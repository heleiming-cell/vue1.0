<template>
<div class="bimbox" id="ghy-bim">
    <div class="nav">
        <div class="cursor" @click="LoadData(item.value)" v-for="(item,i) in systems" :key="i">
            <span :class="[index===item.value?'active':'']">{{item.label}}</span>
        </div>
    </div>
    <el-dialog title="视图窗口" :visible.sync="diagramVisibale" :modal-append-to-body="false" class="form">
        <div>
            <iframe style="height:600px;" width="100%" frameborder="0" :src="src"></iframe>
        </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="diagramSwitch" :modal-append-to-body="false" width="300px">
        <div style="text-align:center">
            <el-switch @change="switchChange" v-model="switchValue" inactive-color="#13ce66" active-color="#ff4949"></el-switch>
        </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="diagramInput" :modal-append-to-body="false" width="300px">
        <div style="text-align:center">
            <el-input></el-input>
        </div>
    </el-dialog>

    <el-dialog title="设备监视" :visible.sync="diagramPanel" :modal-append-to-body="false" width="400px" class="form">
        <table width="100%" style="text-align:center;table-layout:fixed;border-spacing:10px;font-size:16px">
            <tr>
                <td>名称</td>

                <td>数值</td>

                <td>单位</td>
            </tr>

            <tr v-for="(item,i) in watchParams" :key="i">
                <td>{{item.WatchName}}</td>

                <td v-show="item.WathType=='0'">{{item.WatchValue}}</td>

                <td v-show="item.WathType=='1'">
                    <el-input @blur="WriteCom(item.WatchVar,$event)" size="mini"></el-input>
                </td>

                <td v-show="item.WathType=='2'">{{item.WatchValue=='1'?'开':'关'}}</td>
                <td v-show="item.WathType=='3'">
                    <el-switch v-model="item.WatchValue" @change="switchChange($event,item.WatchVar)" inactive-color="#ff4949" active-color="#13ce66" active-value="1" inactive-value="0"></el-switch>
                </td>
                <td>{{item.WathUnit}}</td>
            </tr>
        </table>
    </el-dialog>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import "../../../static/bim/jssdk/BimfaceSDKLoader@latest-release";
import cctv from "@/components/Dialog/cctv/src";
import {
    openModal
} from "@/components/common/modal/panelModal";
import CMD from "@/lib/CMD";
import system from "@/lib/System";
import {
    hexToRgba,
    RouteMng
} from "@/lib/Common";
export default {
    components: {},
    name: "Bim",
    data() {
        return {
            viewer3D: "",
            cctvEl: null,
            fileid: "1506248329021408",
            src: "",
            diagramVisibale: false,
            diagramSwitch: false,
            title: "",
            diagramInput: false,
            diagramPanel: false,
            switchVar: "", //开关变量
            switchValue: false, //开关值
            // sacadaHub: null,
            watchParams: [],
            systems: system,
            index: 0,
            realVars: new Map(),
            drawableConfig: null,
            drawableContainer: null
        };
    },
    computed: {
        ...mapState({
            connection: state => state.signalr.connection,
            scadaHub: state => state.signalr.scadaHub,
            realData: state => state.signalr.realData
        })
    },
    watch: {
        realData: {
            handler(v1, v2) {
                let _this = this;
                if (v1 && v1.length > 0) {
                    v1.forEach((v, i) => {
                        if (_this.diagramPanel) {
                            _this.watchParams.forEach((p, j) => {
                                if (v.ID === p.WatchVar) {
                                    p.WatchValue = v.Value;
                                }
                            });
                        }
                        if (_this.realVars.size > 0) {
                            let configs = _this.realVars.get(v.ID);
                            if (configs && configs.length > 0) {
                                configs.forEach((m, n) => {
                                    //改变量关联的所有配置模型
                                    let bimconfig = JSON.parse(m.config);
                                    if (bimconfig && bimconfig.EaableAlarmColor) {
                                        let isExist = false;
                                        bimconfig.watchColorParameters.forEach((wp, j) => {
                                            if (wp.WatchColorValue == v.Value) {
                                                let colors = hexToRgba(wp.WatchColor, 1);
                                                var color = new Glodon.Web.Graphics.Color(
                                                    colors.split(",")[0],
                                                    colors.split(",")[1],
                                                    colors.split(",")[2],
                                                    1
                                                );
                                                _this.viewer3D.overrideComponentsColorById(
                                                    [m.modelid],
                                                    color
                                                );
                                                _this.viewer3D.render();
                                                isExist = true;
                                                return false;
                                            }
                                        });
                                        if (!isExist) {
                                            _this.viewer3D.restoreComponentsColorById([m.modelid]);
                                            _this.viewer3D.render();
                                        }
                                    }
                                    if (bimconfig && bimconfig.EaableVisiable) {
                                        if (v.Value == bimconfig.VisableValue) {
                                            _this.viewer3D.hideComponents([m.modelid]);
                                        } else {
                                            _this.viewer3D.showComponents([m.modelid]);
                                        }
                                        _this.viewer3D.render();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            var viewer;
            var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
            BimfaceLoaderConfig.dataEnvType = BimfaceEnvOption.Local;
            BimfaceLoaderConfig.sdkPath = "../../../static/bim/jssdk/";
            BimfaceLoaderConfig.path = "../../../static/bim/viewToken.json";
            BimfaceSDKLoader.load(
                BimfaceLoaderConfig,
                this.successCallback,
                this.failureCallback
            );
        });
    },
    methods: {
        LoadRealUpdateVars() {
            let _this = this;
            this.$ajax
                .get(this.$URL + "/bim/GetRealVars")
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        if (result.data.data && result.data.data.length > 0) {
                            let vars = [];
                            // new Map().set()
                            result.data.data.forEach((v, i) => {
                                vars.push(v.AnimationVar);
                                // new Map().has
                                if (!_this.realVars.has(v.AnimationVar)) {
                                    _this.realVars.set(v.AnimationVar, []);
                                }
                                _this.realVars.get(v.AnimationVar).push({
                                    config: v.Config,
                                    modelid: v.ModelID
                                });
                            });
                            if (vars.length > 0) {
                                CMD.signalrVarSubscribe(_this, vars, _this.scadaHub);
                            }
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        successCallback(viewMetaData) {
            let _this = this;
            // let viewer;
            if (viewMetaData.viewType == "3DView") {
                let view = document.getElementById("ghy-bim");
                let config = new Glodon.Bimface.Application.WebApplication3DConfig();
                config.domElement = view;
                let eventManager = Glodon.Bimface.Application.WebApplication3DEvent;
                let app = new Glodon.Bimface.Application.WebApplication3D(config);
                _this.viewer3D = app.getViewer();
                _this.viewer3D.addModel(viewMetaData);
                let colorRed = new Glodon.Web.Graphics.Color(0, 25, 46, 0);
                _this.viewer3D.setBackgroundColor(colorRed);
                _this.viewer3D.addEventListener(
                    Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded,
                    function () {
                        _this.viewer3D.render();

                        _this.LoadRealUpdateVars(); //加载实时刷新的数据

                        _this.viewer3D.addEventListener("MouseClicked", function (
                            objectdata
                        ) {
                            _this.loadBimConfig(objectdata.objectId);
                        });
                        _this.LoadData(_this.index);
                        _this.drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
                        _this.drawableConfig.viewer = _this.viewer3D;
                        _this.drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(
                            _this.drawableConfig
                        );
                    }
                );
            } else if (viewMetaData.viewType == "rfaView") {}
        },
        loadBimConfig(id) {
            this.$ajax
                .get(this.$URL + "/bim/GetBimConfig", {
                    params: {
                        modelid: id,
                        fileid: this.fileid
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        if (result.data.data) {
                            this.analysiEvent(JSON.parse(result.data.data));
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        analysiEvent(config) {
            if (config.EnableActionBind) {
                if (config.BindEventType === "0") {
                    //播放视频
                    if (config.videoServer && config.videoCam) {
                        this.cctvEl = cctv.newInstance().diagram;
                        this.cctvEl.open(
                            config.videoServer + "|" + config.videoCam,
                            this.callback
                        );
                    }
                } else if (config.BindEventType === "1") {
                    //弹窗网页
                    this.diagramVisibale = true;
                    this.src = config.HyperLinks;
                } else if (config.BindEventType === "2") {
                    //弹窗视图
                    this.diagramVisibale = true;
                    this.src =
                        "http://" +
                        window.location.hostname +
                        ":9008/home/runview?diagramid=" +
                        config.DiagramID;
                } else if (config.BindEventType === "3") {
                    //开关控制
                    if (config.switchName && config.switchVar) {
                        this.diagramSwitch = true;
                        this.title = config.switchName;
                    }
                    this.switchVar = config.switchVar;

                    // this.sacadaHub.Subscribe();
                } else if (config.BindEventType === "4") {
                    //变量写值
                } else if (config.BindEventType === "5") {
                    //监控面板
                    if (this.connection && this.scadaHub) {
                        this.watchParams = config.watchParameters;
                        this.diagramPanel = true;
                        let varSet = new Set();
                        this.watchParams.forEach((v, i) => {
                            varSet.add(v.WatchVar);
                        });

                        CMD.signalrVarSubscribe(this, Array.from(varSet), this.scadaHub);
                    }
                } else if (config.BindEventType === "6") {
                    //设备面板
                    openModal({
                            data_id: config.devicePanel.split("|")[0],
                            type: config.devicePanel.split("|")[1]
                        },
                        this
                    );
                }
            }
        },

        //初始化失败回调
        failureCallback: function (error) {
            console.log(error);
        },
        //添加marker
        markerAdd() {
            let _this = this;

            /* Marker3D*/
            var markerConfig = new Glodon.Bimface.Plugins.Marker3D.Marker3DContainerConfig();
            markerConfig.viewer = _this.viewer3D;
            var marker = new Glodon.Bimface.Plugins.Marker3D.Marker3DContainer(
                markerConfig
            );
            /* Marker3D*/
            marker.clear();
            let data = [{
                    objectid: "465807",
                    description: "办公室1"
                },
                {
                    objectid: "502450",
                    description: "办公室2"
                },
                {
                    objectid: "502524",
                    description: "办公室1"
                }
            ];

            let marker3dConfigSrc = _this.marker3dConfigSrc;
            data.forEach((v, i) => {
                _this.viewer3D.getComponentProperty(v.objectid, function (objectdata) {
                    var marker3dConfig = new Glodon.Bimface.Plugins.Marker3D.Marker3DConfig();
                    marker3dConfig.src = marker3dConfigSrc;
                    marker3dConfig.id = objectdata.elementId;
                    marker3dConfig.worldPosition = objectdata.boundingBox.max;
                    marker3dConfig.tooltip = v.description;
                    var marker3d = new Glodon.Bimface.Plugins.Marker3D.Marker3D(
                        marker3dConfig
                    );
                    marker3d.onClick(function (item) {
                        _this.viewer3D.zoomToSelectedComponents();
                        _this.viewer3D.render();
                        _this.cctvEl = cctv.newInstance().diagram;
                        _this.cctvEl.open(
                            "54|112.19.169.2|2500|60120609-f2df-4de8-81a1-998148d0682a|d817|4号路口单人岗亭|false",
                            _this.callback
                        );
                    });
                    marker.addItem(marker3d);
                    /* Marker3D*/
                });
            });
        },
        callback() {
            if (this.cctvEl) {
                document.getElementById("app").removeChild(this.cctvEl.$parent.$el);
                this.cctvEl = null;
            }
        },
        switchChange(event, val) {
            CMD.signalrWrite(this, val, event);
        },
        WriteCom(varable, event) {
            CMD.signalrWrite(this, varable, event.target.value);
        },
        showIcon(data) {
            let _this = this;
            _this.drawableContainer.clear();
            data.forEach((v, i) => {
                _this.viewer3D.getComponentProperty(v.ModelID, function (obj) {
                    if (v.config) {
                        let bimconfig = JSON.parse(v.config);
                        let config = new Glodon.Bimface.Plugins.Drawable.CustomItemConfig();
                        let icon = document.createElement("i");
                        icon.className = bimconfig.icon;
                        icon.style.color = bimconfig.iconColor;
                        icon.style.fontWeight = 800;
                        icon.style.cursor = "pointer";
                        icon.style.fontSize = "20px";
                        config.content = icon;
                        config.viewer = _this.viewer3D;
                        config.worldPosition = bimconfig.position;

                        // console.log(""+obj.boundingBox.max)
                        // config.worldPosition.x = (obj.boundingBox.max.x + obj.boundingBox.min.x) / 2;
                        // config.worldPosition.y = (obj.boundingBox.max.y + obj.boundingBox.min.y) / 2;
                        // config.worldPosition.z =  obj.boundingBox.min.z;

                        let customItem = new Glodon.Bimface.Plugins.Drawable.CustomItem(
                            config
                        );
                        customItem.onClick(function (item) {
                            // drawableContainer.removeItemById(item.id);
                            _this.analysiEvent(bimconfig);
                        });
                        _this.drawableContainer.addItem(customItem);
                    }
                });
            });
            if (data.length > 0) {
                // _this.viewer3D.render();
            }
        },
        LoadData(index) {
            this.index = index;
            this.$ajax
                .get(this.$URL + "/bim/GetSystemConfig", {
                    params: {
                        id: this.index
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        if (result.data.data && result.data.data.length >= 0) {
                            //   this.viewer3D.restoreDefault();
                            this.showIcon(result.data.data);
                        }
                    }
                });
        }
    }
};
</script>

<style lang="less" scoped>
@htmlBg: #32475c;
@basePx: 100px;

.px2rem(@name, @px) {
    @{name}: @px / @basePx * 1rem;
}

.padding2rem(@name, @top, @left, @down, @right) {
    @{name}: (@top / @basePx * 1rem) (@left / @basePx * 1rem) (@down / @basePx * 1rem) (@right / @basePx * 1rem);
}

.ghy-bim {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
}

.bimbox {
    height: calc(100% - 115px);
    padding: 5px;
    font-size: 12px;
    position: relative;
}

.form /deep/ .el-dialog__body {
    padding: 5px;
}

.active {
    color: rgb(122, 177, 239);
}

.nav {
    position: absolute;
    color: #254885;
    top: 10px;
    font-size: 19px;
    font-weight: 400;
    z-index: 1000;
    display: flex;
    justify-content: center; // width: 90%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #030d21;
    // border: 1px solid #333;

    >div {
        display: inline-block;
        padding: 10px;
        // border-right: 1px solid #32538e;
    }

    >div:nth-of-type(10) {
        border: 0;
    }
}
</style>
