<template>
<div class="bimbox h100" id="ghy-bim" @contextmenu="showContextMenu">
    <div class="floor">
        <div @click="changeFloor(item.name)" :class="[item.name==indexname?'active':'']" v-for="(item,i) in floors" :key="item.id" class="list cursor">{{item.name}}
            <div class="" :style="{background:colors[i%7]}"></div>
        </div>
    </div>
</div>
</template>

<script>
import '../../../static/bim/jssdk/BimfaceSDKLoader@latest-release'
import bimBind from '@/components/Dialog/bimBind/src'
import camera from '@/components/Dialog/bimCameraBind/src'
export default {
    name: 'bimDesign',
    data() {
        return {
            el: null,
            fileid: '1506248329021408',
            position: null,
            floors: [],
            complited: false,
            camel: null,
            drawableConfig: null,
            drawableContainer: null,
            indexname: '',
            colors: ['#3499db', '#2ecd70', '#e77e22', '#c1382a', '#11dab7', '#f1c50e', '#f8e1a3'],
            drag: false,
            create: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            var viewer;
            var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
            BimfaceLoaderConfig.dataEnvType = BimfaceEnvOption.Local;
            BimfaceLoaderConfig.sdkPath = '../../../static/bim/jssdk/';
            BimfaceLoaderConfig.path = '../../../static/bim/viewToken.json';
            BimfaceSDKLoader.load(BimfaceLoaderConfig, this.successCallback, this.failureCallback);
        });

    },
    methods: {
        successCallback(viewMetaData) {
            let _this = this;
            if (viewMetaData.viewType == "3DView") {
                let view = document.getElementById('ghy-bim')
                let config = new Glodon.Bimface.Application.WebApplication3DConfig();
                config.domElement = view;
                let eventManager = Glodon.Bimface.Application.WebApplication3DEvent;
                config.Buttons = []
                let app = new Glodon.Bimface.Application.WebApplication3D(config);
                _this.viewer3D = app.getViewer();
                _this.viewer3D.addModel(viewMetaData);
                let colorRed = new Glodon.Web.Graphics.Color(0, 25, 46, 1);
                _this.viewer3D.setBackgroundColor(colorRed);
                _this.viewer3D.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
                    _this.viewer3D.render();
                    _this.viewer3D.addEventListener("MouseClicked", function (obj) {
                        _this.position = obj.worldPosition
                        _this.el = bimBind.newInstance().diagram;
                        _this.viewer3D.getComponentProperty(obj.objectId, (data) => {
                            if (data && data.properties && data.properties.length > 0) {
                                data.properties[0].items.forEach((v, i) => {
                                    if (v.key === "floor") {
                                        _this.el.open(_this.callback, obj.objectId, _this.floors, v.value);
                                        return;
                                    }
                                });
                            }
                        });

                    });
                    _this.viewer3D.getFloors((data) => {
                        _this.floors = data.sort((v1, v2) => {

                            return v1.elevation - v2.elevation;

                        });
                    });
                    // _this.viewer3D.getFloors((data) => {
                    //     // _this.floors = data;
                    //     _this.floors = data.sort((v1, v2) => {
                    //         if (v1.name > v2.name)
                    //             return 1;
                    //         else if (v1.name < v2.name)
                    //             return -1;
                    //         else
                    //             return 0;
                    //     });
                    // });
                    _this.complited = true;

                    _this.drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
                    _this.drawableConfig.viewer = _this.viewer3D;
                    _this.drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(_this.drawableConfig);

                    // _this.loadAllConfig();
                });

            } else if (viewMetaData.viewType == "rfaView") {

            }
        },
        failureCallback: function (error) {
            console.log(error);
        },
        callback(config, flag) {
            if (config && flag) {
                Object.assign(config, {
                    position: this.position
                });
                this.$ajax.post(this.$URL + '/bim/SaveBimConfig', this.$QS.stringify({
                    config: JSON.stringify(config),
                    isreal: config.isRealTime,
                    modelid: config.Objid,
                    fileid: this.fileid,
                    system: config.system,
                    animation: config.AnimationVar,
                    floor: config.floor
                })).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                        this.drawableContainer.clear();
                        this.loadAllConfig(this.indexname);
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
            document.getElementById('app').removeChild(this.el.$parent.$el);
        },
        camCallback(config, flag) {
            let _this = this;
            if (config && flag) {
                Object.assign(config, {
                    Objid: _this.viewer3D.getCameraStatus(),
                });
                this.$ajax.post(this.$URL + '/bim/SaveBimCamConfig', this.$QS.stringify({
                    config: JSON.stringify(config),
                    // isreal: config.isRealTime,
                    CamObj: config.Objid,
                    fileid: this.fileid,
                    // system: config.system,
                    // animation: config.AnimationVar,
                    pointid: config.pointid,
                    floor: config.floor
                })).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        })
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
            document.getElementById('app').removeChild(this.camel.$parent.$el);
        },
        mousemove() {
            this.drag = true;
        },
        showContextMenu($event) {
            let _this = this;

            if (this.complited) {
                _this.camel = camera.newInstance().diagram;
                _this.camel.open(_this.camCallback, _this.floors);
            }

        },
        loadAllConfig(floor) {
            let _this = this;
            this.$ajax.get(this.$URL + '/bim/GetFloorConfig', {
                params: {
                    fileid: this.fileid,
                    floor: floor || '1F',
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    if (result.data.data && result.data.data.length > 0) {
                        if (result.data.data && result.data.data.length > 0) {
                            result.data.data.forEach((v, i) => {
                                let config = new Glodon.Bimface.Plugins.Drawable.CustomItemConfig();
                                let icon = document.createElement('i');
                                icon.className = "iconfont icon-weizhi";
                                icon.style.color = "#1296db";
                                icon.style.fontWeight = 800;
                                icon.style.cursor = "pointer"
                                icon.style.fontSize = '30px';
                                config.content = icon;
                                _this.addCustom(config, JSON.parse(v.Config));
                            });
                            _this.viewer3D.render();
                        }
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        addCustom(config, bimconfig) {
            let _this = this;
            config.viewer = _this.viewer3D;
            config.worldPosition = bimconfig.position;
            let customItem = new Glodon.Bimface.Plugins.Drawable.CustomItem(config);
            customItem.onClick(function (item) {
                _this.el = bimBind.newInstance().diagram;
                _this.el.open(_this.callback, bimconfig.Objid, _this.floors, bimconfig.floor);
                // _this.analysiEvent(bimconfig);
            });
            // if (!_this.drawableContainer.items) {
            //     _this.drawableContainer.items = new Map();
            // }
            // if (bimconfig.floor) {
            //     if (!_this.drawableContainer.items.has(bimconfig.floor)) {
            //         _this.drawableContainer.items.set(bimconfig.floor, []);
            //     }
            //     _this.drawableContainer.items.get(bimconfig.floor).push(customItem);
            // }
            // 添加自定义标签
            _this.drawableContainer.addItem(customItem);
        },

        changeFloor(floor) {
            let _this = this;
            let temp = [];
            _this.drawableContainer.clear();
            this.viewer3D.showAllComponents();
            if (this.indexname === floor) {
                this.viewer3D.showAllComponents();
                // _this.drawableContainer.clear();
                this.indexname = '';

            } else {
                //   _this.drawableContainer.clear();
                this.indexname = floor;
                this.loadAllConfig(floor);
                this.floors.forEach((v, i) => {
                    if (v.name !== floor) {
                        temp.push({
                            "levelName": v.name
                        });
                    } else {}
                });
                if (temp.length > 0) {
                    _this.viewer3D.hideComponentsByObjectData(temp);
                }

            }
            _this.viewer3D.render();
        },
    }
}
</script>

<style lang="less" scoped>
.tool {
    padding: 10px;
}

.bimbox {
    position: relative;
}

.active {
    color: rgb(122, 177, 239);
    background: #0D2943;
}

.floor {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    z-index: 100;
    background: #1A4063;
    opacity: 0.9;

    .list {
        width: 150px;
        font-size: 16px;
        text-align: center;
        line-height: 32px;
        border-bottom: 1px solid #000;
        color: #BCC4D6;

        >div {
            height: 32px;
            width: 5px;
            float: right;
        }

        &:hover {
            cursor: pointer;
            background: #1E335A;
        }
    }
}
</style>
