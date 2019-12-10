<template>
<el-row :gutter="10" class="box">
    <el-row class="boxbody card" :gutter="10" id="homebim">
        <div class="nav">
            <div class="cursor" :class="[index===item.value?'active':'']" @click="LoadData(item.value)" v-for="item in systems" :key="item.value">
                <span>{{item.label}}</span>
            </div>
        </div>
        <div class="floor">
            <!-- <div @click="changeFloor(item.name)" :class="[ (floorData.has(item.name))?'active':'']" v-for="(item,i) in floors" :key="item.id" class="list cursor">{{item.name}} -->

            <div @click="changeFloor(item.name)" :class="{active:floorData.indexOf(item.name)>-1}" v-for="(item,i) in floors" :key="item.id" class="list cursor">{{item.name}}
                <div class="" :style="{background:colors[i%7]}"></div>
            </div>
        </div>
        <!-- <transition name="el-zoom-in-center">
            <div class="rightDetail" v-show="showDetail">
                <div @click="close" style="height:30px"><i class="iconfont icon-shanchu"></i></div>
                <div class="content">
                    <div class="card">
                        <div class="cardheader">
                            <span class="cardline"></span>
                            <span class="cardheadertext">{{indexname}}能耗趋势图</span>
                        </div>
                        <div class="chart">
                            <div id="main3chart" class="h100"></div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="cardheader">
                            <span class="cardline"></span>
                            <span class="cardheadertext">总能耗趋势图</span>
                        </div>
                        <div class="chart">
                            <div id="main3chart1" class="h100"></div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="cardheader">
                            <span class="cardline"></span>
                            <span class="cardheadertext">今日总能耗:263kwh</span>
                        </div>
                    </div>
                </div>
            </div>
        </transition> -->
    </el-row>
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
    <el-dialog title="设备监视" :visible.sync="diagramPanel" :modal-append-to-body="false" width="400px" @close="closeWatchPanel" class="form">
        <table width="100%" style="text-align:center;table-layout:fixed;border-spacing:10px;font-size:16px">
            <tr>
                <td>名称</td>
                <td>数值</td>
                <td>单位</td>
            </tr>
            <tr v-for="(item,i) in watchParams" :key="i">
                <td>{{item.WatchName}}</td>
                <td v-show="item.WathType=='0'">{{watchParam['watchpanel_'+i]}}</td>
                <td v-show="item.WathType=='1'">
                    <el-input @blur="WriteCom(item.WatchVar,$event)" size="mini"></el-input>
                </td>
                <td v-show="item.WathType=='2'">{{watchParam['watchpanel_'+i]=='1'?'开':'关'}}</td>
                <td v-show="item.WathType=='3'">
                    <!-- ff4949 -->
                    <el-switch v-model="watchParam['watchpanel_'+i]" @change="switchChange($event,item.WatchVar)" inactive-color="#ff4949" active-color="#13ce66" active-value="1" inactive-value="0">
                    </el-switch>
                </td>
                <td>{{item.WathUnit}}</td>
            </tr>
        </table>
    </el-dialog>
    <div :id="'customlabel_'+i" class="customlabel" v-for="(item,i) in customItem" :key="'customlabel_'+i">
        <!-- 数字显示 -->
        <div v-show="list.showType==1" :uuid="'C_'+i+'_'+j" v-for="(list,j) in item" :key="'C_'+i+'_'+j">{{list.DrawLineName}}：{{(labelLineValue&&labelLineValue.hasOwnProperty('C_'+i+'_'+j))?labelLineValue['C_'+i+'_'+j]:'0'}}{{list.DrawLineUnit}}</div>
        <!-- 图标显示 && 状态图标 -->
        <div v-show="list.showType==2&&list.iconType==1" v-for="(list,j) in item" :key="j">{{list.DrawLineName}}：
            <i v-show="((labelLineValue&&labelLineValue.hasOwnProperty('C_'+i+'_'+j))?labelLineValue['C_'+i+'_'+j]:'0')==statusicon.statusVar" :class="statusicon.statusIcon" :style="{color:statusicon.statusIconColor}" v-for="(statusicon,s) in list.statusIcons" :key="s"></i>
        </div>
        <!-- 图标显示 && 动态图标 变色-->
        <div v-show="list.showType==2&&list.iconType==2&&list.animationType==1" v-for="(list,j) in item" :key="j">{{list.DrawLineName}}：
            <i :class="list.Icon" v-show="((labelLineValue&&labelLineValue.hasOwnProperty('C_'+i+'_'+j))?labelLineValue['C_'+i+'_'+j]:'0')==color.statusValue" :style="{color:color.statusColor}" v-for="(color,s) in list.statusColors" :key="s"></i>
        </div>
        <!-- 图标显示 && 动态图标 闪烁 -->
        <div v-show="list.showType==2&&list.iconType==2&&list.animationType==3" v-for="(list,j) in item" :key="j">{{list.DrawLineName}}：
            <div style="display:inline-block" :class="[((labelLineValue&&labelLineValue.hasOwnProperty('C_'+i+'_'+j))?labelLineValue['C_'+i+'_'+j]:'0')==1?'rotation':'']"><i :class="list.Icon"></i></div>
        </div>
        <div class="jiao"></div>
    </div>
    <div :id="'linelabel_'+i" class="linelabel" v-for="(item,i) in lineLabel" :key="'linelabel_'+i">
        <div> <img src="@/static/images/line.png"></div>
        <div class="labelpanel">
            <div :uuid="'L_'+i+'_'+j" v-for="(list,j) in item" :key="'L_'+i+'_'+j" v-show="list.showType==1">
                <div>{{list.DrawLineName}}:{{(labelLineValue&&labelLineValue.hasOwnProperty('L_'+i+'_'+j))?labelLineValue['L_'+i+'_'+j]:'0'}}{{list.DrawLineUnit}}</div>
            </div>
            <!-- 图标显示 && 状态图标 -->
            <div v-show="list.showType==2&&list.iconType==1" v-for="(list,j) in item" :key="j" style="display:flex">{{list.DrawLineName}}：
                <i v-show="((labelLineValue&&labelLineValue.hasOwnProperty('L_'+i+'_'+j))?labelLineValue['L_'+i+'_'+j]:'0')==statusicon.statusVar" :class="statusicon.statusIcon" :style="{color:statusicon.statusIconColor}" v-for="(statusicon,s) in list.statusIcons" :key="s"></i>
            </div>
            <!-- 图标显示 && 动态图标 变色-->
            <div v-show="list.showType==2&&list.iconType==2&&list.animationType==1" v-for="(list,j) in item" :key="j" style="display:flex">{{list.DrawLineName}}：
                <i :class="list.Icon" v-show="((labelLineValue&&labelLineValue.hasOwnProperty('L_'+i+'_'+j))?labelLineValue['L_'+i+'_'+j]:'0')==color.statusValue" :style="{color:color.statusColor}" v-for="(color,s) in list.statusColors" :key="s"></i>
            </div>
            <!-- 图标显示 && 动态图标 闪烁 -->
            <div v-show="list.showType==2&&list.iconType==2&&list.animationType==3" v-for="(list,j) in item" :key="j" style="display:flex">{{list.DrawLineName}}：
                <div :class="[((labelLineValue&&labelLineValue.hasOwnProperty('L_'+i+'_'+j))?labelLineValue['L_'+i+'_'+j]:'0')==1?'rotation':'']"><i :class="list.Icon"></i></div>
            </div>
        </div>
    </div>
    <!-- </div> -->
</el-row>
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
import system from '@/lib/System'
import {
    hexToRgba,
    RouteMng
} from '@/lib/Common'
import {
    DrawLine
} from '@/lib/WatchParam'
import {
    bimCameraStatus
} from '@/lib/configParmas'
import {
    lineOption,
    barOption
} from '@/lib/chartConfig'
export default {
    name: 'homeComponet',
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
            watchParams: [],
            index: -1,
            systems: system,
            realVars: new Map(),
            drawableConfig: null,
            drawableContainer: null,
            customItem: [],
            lineLabel: [],
            floors: [],
            indexname: '',
            labelLineValue: {},
            colors: ['#3499db', '#2ecd70', '#e77e22', '#c1382a', '#11dab7', '#f1c50e', '#f8e1a3'],
            cameras: [],
            // showDetail: false,
            chart: null,
            totalChart: null,
            areaData: [], //所有区域能耗数据
            watchParam: {},
            rotate: true,
            floorData: [],
            cindex: 0,
            lindex: 0
        }
    },
    computed: {
        ...mapState({
            connection: state => state.signalr.connection,
            scadaHub: state => state.signalr.scadaHub,
            realData: state => state.signalr.realData,

            // routename: state => state.app.routename, //手机切换
            // systemid: state => state.app.systemid, //手机切换
        }),
    },
    watch: {
        realData: {
            handler(v1, v2) {
                let _this = this;
                if (v1 && v1.length > 0) {
                    v1.forEach((v, i) => {
                        if (_this.diagramPanel) {
                            if (_this.watchParam.hasOwnProperty(v.ID)) {
                                _this.watchParam[v.ID] = v.Value;
                            }
                        }
                        if (_this.labelLineValue.hasOwnProperty(v.ID)) {
                            _this.labelLineValue[v.ID] = v.Value;
                        }
                        if (_this.realVars.size > 0) {
                            let configs = _this.realVars.get(v.ID);
                            if (configs && configs.length > 0) {
                                configs.forEach((m, n) => { //改变量关联的所有配置模型
                                    let bimconfig = JSON.parse(m.config);
                                    if (bimconfig && bimconfig.EaableAlarmColor) {
                                        let isExist = false;
                                        bimconfig.watchColorParameters.forEach((wp, j) => {
                                            if (wp.WatchColorValue == v.Value) {
                                                let colors = hexToRgba(wp.WatchColor, 1);
                                                var color = new Glodon.Web.Graphics.Color(colors.split(',')[0], colors.split(',')[1], colors.split(',')[2], 1);
                                                _this.viewer3D.overrideComponentsColorById([m.modelid], color);
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
        },
        // routename: { //手机切换
        //     handler(v) {
        //         if (v) {
        //             this.$router.push({
        //                 name: v
        //             });
        //         }
        //     }
        // },
        // systemid: { //手机切换
        //     handler(v) {
        //         if (v) {
        //             this.LoadData(parseInt(v));
        //         }
        //     }
        // }
    },
    mounted() {
        let _this = this;
        this.$nextTick(() => {
            var viewer;
            var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
            BimfaceLoaderConfig.dataEnvType = BimfaceEnvOption.Local;
            BimfaceLoaderConfig.sdkPath = '../../../static/bim/jssdk/';
            BimfaceLoaderConfig.path = '../../../static/bim/viewToken.json';
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
            this.$ajax.get(this.$URL + '/bim/GetRealVars').then((result) => {
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
                            CMD.signalrVarSubscribe(_this, vars, _this.scadaHub)
                        }
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        LoadFunArea(item) {
            this.$ajax.get(this.$URL + "/role/GetUserFuns", {
                    params: {
                        menuId: item.key
                    }
                }).then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.$store.commit("chanage_fun_menu", result.data.funs);
                        sessionStorage.funs = JSON.stringify(result.data.funs);
                        //    添加二级功能菜单动态路由
                        if (result.data.funs.length > 0) {
                            this.vueroute = [];
                            new RouteMng().createRouter(result.data.funs, this);
                            if (this.$store.state.app.routes && this.$store.state.app.routes.children) {
                                this.$store.state.app.routes.children = this.$store.state.app.routes.children.concat(this.vueroute);
                                this.$router.addRoutes([this.$store.state.app.routes]);
                                this.$store.commit('change_route', this.$store.state.app.routes);
                                sessionStorage.route = JSON.stringify(this.$store.state.app.routes);
                            }
                            //默认跳转第一个二级功能菜单
                            let fun = result.data.funs[0];
                            if (fun.config) {
                                let config = JSON.parse(fun.config);
                                if (config.route) {
                                    this.$router.push({
                                        name: config.route.name
                                    });
                                    this.$store.commit("change_activeFunc", fun.label);
                                    sessionStorage.activefun = fun.label;
                                }
                            }
                        } else {
                            this.$store.commit("change_activeFunc", "");
                            sessionStorage.activefun = "";
                            this.$router.push({
                                name: 'empty'
                            });
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        Enter() {
            if (this.$store.state.app.menus.length > 0) {
                this.$store.commit('change_header_menu', this.$store.state.app.menus[0]);
                this.LoadFunArea(this.$store.state.app.header_menu);
            }
        },

        rotateAuto() {
            if (this.rotate) {
                this.viewer3D.stopAutoRotate();
                this.rotate = false;
            } else {
                this.viewer3D.startAutoRotate(-5);
                this.rotate = true;
            }
        },
        successCallback(viewMetaData) {
            let _this = this;
            // let viewer;
            if (viewMetaData.viewType == "3DView") {
                let view = document.getElementById("homebim");
                let config = new Glodon.Bimface.Application.WebApplication3DConfig();
                config.domElement = view;
                let eventManager = Glodon.Bimface.Application.WebApplication3DEvent;
                let app = new Glodon.Bimface.Application.WebApplication3D(config);
                _this.viewer3D = app.getViewer();
                _this.viewer3D.addModel(viewMetaData);
                let colorRed = new Glodon.Web.Graphics.Color(0, 25, 46, 0);
                _this.viewer3D.setBackgroundColor(colorRed);
                _this.viewer3D.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
                    _this.viewer3D.setCameraAnimation(true);
                    console.log(_this.viewer3D.getCameraStatus());
                    _this.viewer3D.startAutoRotate(-5); //开启自动旋转
                    _this.viewer3D.render();
                    let toolbar = app.getToolbar('MainToolbar');
                    let btnConfig = new Glodon.Bimface.UI.Button.ButtonConfig();
                    btnConfig.title = "旋转";
                    let btn = new Glodon.Bimface.UI.Button.Button(btnConfig);
                    btn.setHtml('<i class="iconfont icon-weiraogoujianxuanzhuan" style="font-size:30px"></i>');
                    btn.addClassName('btn-test');
                    btn.addEventListener('Click', function () {
                        _this.rotateAuto();
                    });
                    toolbar.insertControl(10, btn);
                    //楼层信息
                    _this.viewer3D.getFloors((data) => {
                        _this.floors = data.sort((v1, v2) => {
                         
                           return  v1.elevation-v2.elevation;
                           
                        });
                    });
                    _this.LoadRealUpdateVars(); //加载实时刷新的数据
                    _this.viewer3D.addEventListener("MouseClicked", function (objectdata) {
                        _this.loadBimConfig(objectdata.objectId);
                    });
                    _this.drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
                    _this.drawableConfig.viewer = _this.viewer3D;
                    _this.drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(_this.drawableConfig);
                });
            } else if (viewMetaData.viewType == "rfaView") {}
        },
        loadBimConfig(id) {
            if (id) {
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
            }
        },
        closeWatchPanel() {
            CMD.unSubscribe(this, this.fileid, 'panel');
        },
        analysiEvent(config) {
            let _this = this;
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
                    this.src = "http://" + window.location.hostname + ":9008/home/runview?diagramid=" + config.DiagramID;
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
                    this.watchParams = config.watchParameters;
                    this.diagramPanel = true;
                    let vars = [];
                    config.watchParameters.forEach((v, i) => {
                        vars.push({
                            ['watchpanel_' + i]: v.WatchVar
                        });
                        _this.$set(_this.watchParam, 'watchpanel_' + i, 0);
                    });
                    CMD.signalrVarSubscribeBIM(_this, vars, _this.scadaHub, _this.fileid, 'panel');
                    //监控面板
                    // if (this.connection && this.scadaHub) {
                    //     this.watchParams = config.watchParameters;
                    //     this.diagramPanel = true;
                    //     let varSet = new Set();
                    //     this.watchParams.forEach((v, i) => {
                    //         varSet.add(v.WatchVar);
                    //     });
                    //     CMD.signalrVarSubscribe(this, Array.from(varSet), this.scadaHub);
                    // }
                } else if (config.BindEventType === "6") {
                    //设备面板
                    openModal({
                        data_id: config.devicePanel.split("|")[0],
                        type: config.devicePanel.split("|")[1]
                    }, this);
                }
            }
        },
        //初始化失败回调
        failureCallback: function (error) {
            console.log(error);
        },
        callback() {
            if (this.cctvEl) {
                document.getElementById("app").removeChild(this.cctvEl.$parent.$el);
                this.cctvEl = null;
            }
        },
        switchChange(event, val) {
            CMD.signalrWrite(this, val, event)
        },
        WriteCom(varable, event) {
            CMD.signalrWrite(this, varable, event.target.value)
        },
        addCustom(config, bimconfig) {
            let _this = this;
            config.viewer = _this.viewer3D;
            config.worldPosition = bimconfig.position;
            let customItem = new Glodon.Bimface.Plugins.Drawable.CustomItem(config);
            customItem.onClick(function (item) {
                // drawableContainer.removeItemById(item.id);
                _this.analysiEvent(bimconfig);
            });
            if (!_this.drawableContainer.items) {
                _this.drawableContainer.items = new Map();
            }
            if (bimconfig.floor) {
                if (!_this.drawableContainer.items.has(bimconfig.floor)) {
                    _this.drawableContainer.items.set(bimconfig.floor, []);
                }
                _this.drawableContainer.items.get(bimconfig.floor).push(customItem);
            }
            // 添加自定义标签
            _this.drawableContainer.addItem(customItem);
        },
        showIcon(data) {
            let _this = this;
            CMD.unSubscribe(_this, _this.fileid, 'line');
            // _this.customItem = [];
            // _this.lineLabel = [];
            _this.$nextTick(() => {
                this.$data
                let vars = [];
                data.forEach((v, i) => {
                    if (v.config) {
                        let bimconfig = JSON.parse(v.config);
                        let config = new Glodon.Bimface.Plugins.Drawable.CustomItemConfig();
                        if (bimconfig.EnableDrawLine) {
                            if (bimconfig.labelType == 1) {
                                bimconfig.drawlines.forEach((v, j) => {
                                    vars.push({
                                        ['C_' + _this.cindex + '_' + j]: v.DrawLineVar
                                    });
                                    _this.$set(_this.labelLineValue, 'C_' + _this.cindex + '_' + j, 0)
                                });
                                _this.cindex++;
                                _this.customItem.push(bimconfig.drawlines); //bimconfig.drawlines所有自定义便签 每个包含数组
                            } else if (bimconfig.labelType == 2) {
                                bimconfig.drawlines.forEach((v, j) => {
                                    vars.push({
                                        ['L_' + _this.lindex + '_' + j]: v.DrawLineVar
                                    });
                                    _this.$set(_this.labelLineValue, 'L_' + _this.lindex + '_' + j, 0)
                                });
                                _this.lindex++;
                                _this.lineLabel.push(bimconfig.drawlines); //一个引线便签 每个包含数组
                            }
                            _this.$nextTick(() => {
                                if (bimconfig.labelType == 1) {
                                    config.content = document.getElementById('customlabel_' + _this.customItem.indexOf(bimconfig.drawlines));
                                } else if (bimconfig.labelType == 2) {
                                    config.content = document.getElementById('linelabel_' + _this.lineLabel.indexOf(bimconfig.drawlines));
                                }
                                _this.addCustom(config, bimconfig);
                            });
                            if (i == data.length - 1 && vars.length > 0) //引线最后一次去订阅
                            {
                                CMD.signalrVarSubscribeBIM(_this, vars, _this.scadaHub, _this.fileid, 'line');
                            }
                        } else {
                            let icon = document.createElement('i');
                            icon.className = bimconfig.icon;
                            icon.style.color = bimconfig.iconColor;
                            icon.style.fontWeight = 800;
                            icon.style.cursor = "pointer"
                            icon.style.fontSize = '30px';
                            config.content = icon;
                            _this.addCustom(config, bimconfig);
                        }
                    }
                });
            });
        },
        showLine(data) {
            let _this = this;
            // _this.drawableContainer.clear();
            if (data && data.length > 0) {
                data.forEach((v, i) => {
                    let config = JSON.parse(v.config);
                    var Drawconfig = new Glodon.Bimface.Plugins.Drawable.LeadLabelConfig();
                    Drawconfig.text = "";
                    Drawconfig.componentId = v.ModelID;
                    Drawconfig.worldPosition = config.position;
                    Drawconfig.viewer = _this.viewer3D;
                    var label = new Glodon.Bimface.Plugins.Drawable.LeadLabel(Drawconfig);
                    _this.drawableContainer.addItem(label);
                });
            }
        },
        LoadData(index) {
            let _this = this;
            if (index >= 0) { ///点击系统菜单触发
                if (this.index === index) {
                    this.lineLabel = [];
                    this.customItem = [];
                    this.index = -1;
                    return;
                }
                this.index = index;

            }

            if (this.floorData.length>0 && this.index >= 0) {
                this.$ajax.get(this.$URL + '/bim/GetSystemConfig', {
                    params: {
                        id: this.index,
                        floor: JSON.stringify(this.floorData)
                    }
                }).then(result => {
                    if (result.status === 200 && result.data.success) {
                        if (result.data.data && result.data.data.length >0) {
                            this.showIcon(result.data.data);
                        } else if (result.data.data.length == 0 && index != -1) {
                            this.lineLabel = [];
                            this.customItem = [];
                        }
                    }
                });
            }
        },
        changeFloor(floor) {
            let _this = this;
            // let temp = [];
            if (this.floorData.length == 0) {
                this.viewer3D.hideAllComponents();
            }

            if (this.floorData.indexOf(floor) > -1) {
                this.indexname = '';
                this.floorData.splice(this.floorData.indexOf(floor), 1);
                _this.viewer3D.hideComponentsByObjectData([{
                    "levelName": floor
                }]);
                if (this.floorData.length == 0) //全空恢复整个模型
                {
                    this.viewer3D.showAllComponents();
                    _this.drawableContainer.clear();
                }
            } else {
                this.indexname = floor;
                this.floorData.push(floor);
                _this.viewer3D.showComponentsByObjectData([{
                    "levelName": floor
                }]);
                if (this.floorData.length === this.floors.length) { //全选
                    this.indexname = "";
                    this.floorData = [];
                    _this.drawableContainer.clear();
                    return;
                }
                this.LoadData(-1);

            }
            _this.viewer3D.render();
        },
        saveCamera() {
            // if(_this.viewer3D)
            console.log(JSON.stringify(this.viewer3D.getCameraStatus()));
        },
        close() {
            this.showDetail = false;
        },
    },
}
</script>

<style lang="less" scoped>
.box {
    overflow: hidden;
    margin: 0 5px !important;
    padding: 0;
    font-size: 12px;

    .col {
        height: 100%;
    }
}

.active {
    color: rgb(122, 177, 239);
    background: #0D2943;
}

.line {
    background-color: #1E335A;
    width: 2px;
    height: 40px;
}

.cardheader {
    height: 0.53rem;
    display: flex;
    align-items: center;
    padding: 10px;

    .cardline {
        display: inline-block;
        width: 0.04rem;
        height: 0.2rem;
        background-color: #fff;
    }

    .cardheadertext {
        color: rgba(206, 228, 244, 1);
        font-size: 0.16rem;
        margin-left: 0.13rem;
    }
}

.boxheader {
    .headerleft {
        height: 82px;
        opacity: 0.76;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 10px;
        margin: 0 5px;

        i {
            font-size: 40px;
            color: #254885;
        }
    }

    .headercenter {
        height: 82px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            height: 50px;
            cursor: pointer;
        }
    }
}

.boxbody {
    height: 100%;
    color: #254885;
    padding-left: 10px;
    padding-right: 5px;
    position: relative;

    .nav {
        position: absolute;
        top: 0px;
        font-size: 14px;
        font-weight: 400;
        z-index: 1000;
        display: flex;
        justify-content: center; // width: 90%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #1A4063; // border: 1px solid #333;
        color: #BCC4D6;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        opacity: 0.9;
        word-break: keep-all;
        height: 40px;

        >div {
            display: inline-block;
            padding: 10px; // border-right: 1px solid #32538E;
            border-right: 1px solid black;
        }

        >div:nth-of-type(14) {
            border: 0;
        }
    }
}

.customlabel {
    color: #fff;
    position: relative;
    background: #3499DB;
    padding: 10px;
    border-radius: 5px;
    float: left;
    font-size: 12px;
    border: 1px solid #18496A;

    .jiao {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 10px 0 0 10px;
        border-color: transparent transparent transparent #FFEF93;
    }
}

.labelpanel {
    position: absolute;
    left: 100%;
    top: 0;
    border-radius: 5px;
    transform: translateY(-50%);
    background: #3499DB;
    height: auto;
    padding: 10px;
    word-break: keep-all;
    color: white;
    border: 1px solid #18496A;
}

.rotation {
    -webkit-transition-property: -webkit-transform;
    -webkit-transition-duration: 1s;
    -moz-transition-property: -moz-transform;
    -moz-transition-duration: 1s;
    -webkit-animation: rotate 3s linear infinite;
    -moz-animation: rotate 3s linear infinite;
    -o-animation: rotate 3s linear infinite;
    animation: rotate 3s linear infinite;
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

.btnright {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    z-index: 100;
    background: #1A4063;
    opacity: 0.9;
}

.rightDetail {
    // height:calc(100% - 40px);
    width: 400px;
    position: absolute;
    right: 0;
    top: 40px;
    bottom: 40px;
    background: #0A1631;
    opacity: 0.5;
    padding: 10px;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 10;

    i {
        color: white;
        font-weight: 200;
        font-size: 19px;
        cursor: pointer
    }

    .chart {
        height: 250px;
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: calc(100% - 30px);
    }
}

@-webkit-keyframes rotate {
    from {
        -webkit-transform: rotate(0deg)
    }

    to {
        -webkit-transform: rotate(360deg)
    }
}

@-moz-keyframes rotate {
    from {
        -moz-transform: rotate(0deg)
    }

    to {
        -moz-transform: rotate(359deg)
    }
}

@-o-keyframes rotate {
    from {
        -o-transform: rotate(0deg)
    }

    to {
        -o-transform: rotate(359deg)
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg)
    }

    to {
        transform: rotate(359deg)
    }
}

@media screen and (max-width: 1920px) {

    /*当屏幕尺寸小于600px时，应用下面的CSS样式*/
    .info,
    .category {
        overflow-y: auto;
        overflow-x: hidden;

        &::-webkit-scrollbar {
            display: none;
        }

        // display: flex;
        // flex-direction: column;
        // justify-content: space-between;
    }
}

@media screen and (min-width: 1920px) {

    /*当屏幕尺寸小于600px时，应用下面的CSS样式*/
    .info,
    .category {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}
</style>
