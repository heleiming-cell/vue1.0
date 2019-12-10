<template>
<!-- GIS编辑参数绑定 -->
<div>
    <el-dialog @close="Close(false)" class="form" title="参数编辑" :visible.sync="paramEditVisibale" :modal-append-to-body="false" width="557px" center>
        <!-- 系统分类 -->
        <el-form ref="ruleForm" label-width="100px" label-position="left" class="demo-ruleForm">
            <el-form-item label="系统分类">
                <el-select style="width:100%" v-model="bim.system" clearable>
                    <el-option v-for="(item,i) in systemCategoryData" :value="item.value" :label="item.label" :key="i"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="楼层分类">
                <el-select style="width:100%" v-model="bim.floor" clearable>
                    <el-option v-for="(item,i) in floors" :value="item.name" :label="item.name" :key="i"></el-option>
                </el-select>
            </el-form-item>

            <!-- 名称描述 -->
            <el-form-item label="名称描述">
                <el-input v-model="bim.description"></el-input>
            </el-form-item>
            <!-- 地理坐标 -->
            <el-form-item label="3D模型">
                <el-input v-model="bim.Objid"></el-input>
            </el-form-item>
            <!-- 图标选择 -->
            <fieldset>
                <legend style="color:white;">图标配置</legend>
                <el-form :inline="true" class="demo-form-inline" style="text-align:center;height:50px;">
                    <el-form-item label="图标选择">
                        <i v-show="bim.icon" @click="openIconDialog('bim|icon')" class="cursor" :class="bim.icon" style="vertical-align: middle;color:white"></i>
                        <el-button v-show="!bim.icon" @click="openIconDialog('bim|icon')" type="primary" icon="el-icon-search" circle></el-button>
                    </el-form-item>
                    <el-form-item label="图标颜色" class="iconColor">
                        <el-color-picker v-model="bim.iconColor" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                </el-form>
            </fieldset>
            <el-form-item label="启用标注">
                <el-switch inactive-color="#13ce66" active-color="#ff4949" v-model="bim.EnableDrawLine"></el-switch>
            </el-form-item>
            <div v-show="bim.EnableDrawLine">
                <fieldset style="padding:10px;">
                    <legend style="color:white;">标签类型</legend>
                    <el-radio v-model="bim.labelType" label="1">普通标签</el-radio>
                    <el-radio v-model="bim.labelType" label="2">引线标签</el-radio>
                </fieldset>
                <br>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>标注列表</span>
                        <el-button @click="deleteTableItem('bim','drawlines')" style="float: right; padding: 3px 0" type="text"><i class="el-icon-close"></i></el-button>
                        <el-button @click="addDrawlines" style="float: right; padding: 3px 0" type="text"><i class="el-icon-plus"></i></el-button>
                        <el-button @click="editDrawlines" style="float: right; padding: 3px 0" type="text"><i class="el-icon-edit-outline"></i></el-button>
                    </div>
                    <div class="text item">
                        <el-table :data="bim.drawlines" style="width: 100%" @select-all="selectionAll" @select="selectionAll">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="DrawLineName" label="描述">
                            </el-table-column>
                            <el-table-column prop="DrawLineVar" label="变量">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </div>
            <!-- 启用动作事件 -->
            <el-form-item label="鼠标事件">
                <el-switch @change="actionBindChange" inactive-color="#13ce66" active-color="#ff4949" v-model="bim.EnableActionBind"></el-switch>
            </el-form-item>
            <fieldset v-if="bim.EnableActionBind">
                <legend>鼠标事件</legend>
                <!-- <div > -->
                <el-form-item label="事件类型">
                    <el-select style="width:100%" v-model="bim.BindEventType" @change="actionTypeChange">
                        <el-option value="0" label="播放视频"></el-option>
                        <el-option value="1" label="弹窗网页"></el-option>
                        <el-option value="2" label="弹窗视图"></el-option>
                        <el-option value="3" label="开关控制"></el-option>
                        <el-option value="4" label="变量写值"></el-option>
                        <el-option value="5" label="监控面板"></el-option>
                        <el-option value="6" label="设备面板"></el-option>
                    </el-select>
                </el-form-item>
                <!-- </div> -->
                <div v-show="bim.BindEventType==0">
                    <el-form-item label="视频服务器">
                        <el-select style="width:100%" @change="serverSelectChange" v-model="bim.videoServer" clearable>
                            <el-option v-for="item in servers" :key="item.value" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="摄像机">
                        <el-select style="width:100%" v-model="bim.videoCam" clearable>
                            <el-option v-for="item in cams" :key="item.value" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div v-show="bim.BindEventType==1">
                    <el-form-item label="网页URL">
                        <el-input class="input-with-select" v-model="bim.HyperLinks">
                        </el-input>
                    </el-form-item>
                </div>
                <div v-show="bim.BindEventType==2">
                    <el-form-item label="组态视图" prop="delivery">
                        <el-input placeholder="选择组态图" class="input-with-select" v-model="bim.DiagramID">
                            <el-button class="btnSelect" @click="openDiagram" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                </div>
                <div v-show="bim.BindEventType==3">
                    <el-form-item label="名称描述" prop="delivery">
                        <el-input placeholder="名称描述" class="input-with-select" v-model="bim.switchName">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="开关变量" prop="delivery">
                        <el-input placeholder="变量" class="input-with-select" v-model="bim.switchVar">
                            <el-button @click="showVarable('bim|switchVar')" class="btnSelect" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                </div>
                <div v-show="bim.BindEventType==4">
                    <el-form-item label="名称描述" prop="delivery">
                        <el-input v-model="bim.setName" placeholder="名称描述" class="input-with-select">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="变量绑定" prop="delivery">
                        <el-input placeholder="变量" class="input-with-select" v-model="bim.setVar">
                            <el-button @click="showVarable('bim|setVar')" class="btnSelect" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="变量值" prop="delivery">
                        <el-input v-model="bim.SetVarValue" placeholder="变量值" class="input-with-select">
                        </el-input>
                    </el-form-item>
                </div>
                <div v-show="bim.BindEventType==5">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>显示列表</span>
                            <el-button @click="removeWatchParams" style="float: right; padding: 3px 0" type="text"><i class="el-icon-close"></i></el-button>
                            <el-button @click="addWatchParams" style="float: right; padding: 3px 0" type="text"><i class="el-icon-plus"></i></el-button>
                        </div>
                        <div class="text item">
                            <table border="1" id="watchtable">
                                <thead>
                                    <tr>
                                        <td><input type="checkbox" @change="selectAll($event)"></td>
                                        <td>名称</td>
                                        <td>参数</td>
                                        <td>单位</td>
                                        <td>类型</td>
                                    </tr>
                                </thead>
                                <tbody id="selectAll">
                                    <tr v-for="(item,i) in bim.watchParameters" :key="i">
                                        <td><input type="checkbox" :propid="i"></td>
                                        <td>
                                            <el-input v-model="item.WatchName" placeholder="名称" class="input-with-select">
                                            </el-input>
                                        </td>
                                        <td>
                                            <el-input placeholder="变量" class="input-with-select" v-model="item.WatchVar">
                                                <el-button @click="showVarable('bim|watchParameters|WatchVar|'+i,i)" class="btnSelect" slot="append" icon="el-icon-search"></el-button>
                                            </el-input>
                                        </td>
                                        <td>
                                            <el-select style="width:100%" v-model="item.WathUnit">
                                                <el-option value="℃" label="℃"></el-option>
                                                <el-option value="%" label="%"></el-option>
                                                <el-option value="V" label="V"></el-option>
                                                <el-option value="A" label="A"></el-option>
                                                <el-option value="KWH" label="KWH"></el-option>
                                            </el-select>
                                        </td>
                                        <td>
                                            <el-select style="width:100%" v-model="item.WathType">
                                                <el-option value="0" label="显示值"></el-option>
                                                <el-option value="1" label="设定值"></el-option>
                                                <el-option value="2" label="状态值"></el-option>
                                                <el-option value="3" label="开关值"></el-option>
                                            </el-select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </el-card>
                </div>
                <div v-show="bim.BindEventType==6">
                    <el-form-item label="选择面板" prop="delivery">
                        <el-select class="w100" v-model="bim.devicePanel">
                            <el-option v-for="(item,i) in panels" :key="i" :label="item.Name" :value="item.ID+'|'+item.PanelType"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </fieldset>
            <el-form-item label="动画事件" prop="delivery">
                <el-switch inactive-color="#13ce66" active-color="#ff4949" v-model="bim.EnableAnimationBind"></el-switch>
            </el-form-item>
            <!-- 动画事件 -->
            <fieldset v-if="bim.EnableAnimationBind">
                <legend>动画事件</legend>
                <el-form-item label="动画变量" prop="delivery">
                    <el-input placeholder="变量" class="input-with-select" v-model="bim.AnimationVar">
                        <el-button @click="showVarable('bim|AnimationVar')" class="btnSelect" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-form-item>
                <!-- 报警变色 -->
                <el-form-item label="状态变色" prop="delivery">
                    <el-switch inactive-color="#13ce66" active-color="#ff4949" v-model="bim.EaableAlarmColor"></el-switch>
                </el-form-item>
                <div v-show="bim.EaableAlarmColor">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>显示列表</span>
                            <el-button @click="removeWatchCParams" style="float: right; padding: 3px 0" type="text"><i class="el-icon-close"></i></el-button>
                            <el-button @click="addWatchCParams" style="float: right; padding: 3px 0" type="text"><i class="el-icon-plus"></i></el-button>
                        </div>
                        <div class="text item">
                            <table border="1" id="watchtable">
                                <thead>
                                    <tr>
                                        <td><input type="checkbox" @change="selectColorAll($event)"></td>
                                        <td>状态值</td>
                                        <td>状态颜色</td>
                                    </tr>
                                </thead>
                                <tbody id="selectColorAll">
                                    <tr v-for="(item,i) in bim.watchColorParameters" :key="i">
                                        <td><input type="checkbox" :propid="i"></td>
                                        <td>
                                            <el-input v-model="item.WatchColorValue" placeholder="值" class="input-with-select">
                                            </el-input>
                                        </td>
                                        <td>
                                            <el-color-picker v-model="item.WatchColor" :predefine="predefineColors"></el-color-picker>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </el-card>
                </div>
                <!-- 是否可见 -->
                <el-form-item label="显示隐藏" prop="delivery">
                    <el-switch inactive-color="#13ce66" active-color="#ff4949" v-model="bim.EaableVisiable"></el-switch>
                </el-form-item>
                <div v-if="bim.EaableVisiable">
                    <el-form-item label="隐藏阀值" prop="delivery">
                        <el-input placeholder="" class="input-with-select" v-model="bim.VisableValue">
                        </el-input>
                    </el-form-item>
                </div>

            </fieldset>
            <!-- 全局刷新 -->
            <el-form-item label="全局刷新" prop="delivery">
                <el-switch active-value="1" inactive-value="0" inactive-color="#13ce66" active-color="#ff4949" v-model="bim.isRealTime"></el-switch>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="CloseDialog">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog class="form" title="标签配置" :visible.sync="labelEditVisibale" :modal-append-to-body="true" width="557px" center>
        <!-- 系统分类 -->
        <el-form ref="ruleForm" label-width="100px" label-position="left" class="demo-ruleForm">
            <!-- 名称描述 -->
            <el-form-item label="名称描述">
                <el-input v-model="lineConfig.DrawLineName"></el-input>
            </el-form-item>
            <el-form-item label="变量选择">
                <el-input placeholder="变量" class="input-with-select" v-model="lineConfig.DrawLineVar">
                    <el-button @click="showVarable('lineConfig|DrawLineVar',-1)" class="btnSelect" slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="显示类型">
                <el-select style="width:100%" v-model="lineConfig.showType">
                    <el-option label="数字显示" value="1"></el-option>
                    <el-option label="图标显示" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单位" v-if="lineConfig.showType==1">
                <el-input v-model="lineConfig.DrawLineUnit"></el-input>
            </el-form-item>
            <el-form-item label="图标类型" v-if="lineConfig.showType==2">
                <el-select style="width:100%" v-model="lineConfig.iconType">
                    <el-option label="状态图标" value="1"></el-option>
                    <el-option label="动画图标" value="2"></el-option>
                    <!-- <el-option label="动画图标" value="3"></el-option> -->
                </el-select>
            </el-form-item>
            <el-card class="box-card" v-if="lineConfig.iconType==1&&lineConfig.showType==2">
                <div slot="header" class="clearfix">
                    <span>状态列表</span>
                    <el-button @click="deleteTableItem('lineConfig','statusIcons')" style="float: right; padding: 3px 0" type="text"><i class="el-icon-close"></i></el-button>
                    <el-button @click="addStatusIcon" style="float: right; padding: 3px 0" type="text"><i class="el-icon-plus"></i></el-button>
                </div>
                <div class="text item">
                    <el-table :data="lineConfig.statusIcons" style="width: 100%" @select-all="selectionAll" @select="selectionAll">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="statusVar" label="状态值">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.statusVar" class="input-with-select">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="statusIcon" label="图标">
                            <template slot-scope="scope">
                                <el-input placeholder="图标" class="input-with-select" v-model="scope.row.statusIcon">
                                    <el-button @click="openIconDialog('lineConfig|statusIcons|statusIcon|'+scope.$index,scope.$index)" class="btnSelect" slot="append" icon="el-icon-search"></el-button>
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="statusIconColor" label="图标颜色">
                            <template slot-scope="scope">
                                <el-color-picker v-model="scope.row.statusIconColor" :predefine="predefineColors"></el-color-picker>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- <table border="1" id="watchtable">
                        <thead>
                            <tr>
                                <td><input type="checkbox"  @change="selectAll($event)"></td>
                                <td>状态值</td>
                                <td>图标</td>
                                <td>图标颜色</td>
                            </tr>
                        </thead>
                        <tbody id="selectAll">
                            <tr v-for="(item,i) in lineConfig.statusIcons" :key="i">
                                <td><input type="checkbox" :propid="i" ></td>
                                <td>
                                    <el-input v-model="item.statusVar" class="input-with-select">
                                    </el-input>
                                </td>
                                <td>
                                    <el-input placeholder="图标" class="input-with-select" v-model="item.statusIcon">
                                        <el-button @click="openIconDialog('lineConfig|statusIcons|statusIcon|'+i,i)" class="btnSelect" slot="append" icon="el-icon-search"></el-button>
                                    </el-input>
                                </td>
                                <td>
                                    <el-color-picker v-model="item.statusIconColor" :predefine="predefineColors"></el-color-picker>
                                </td>
                            </tr>
                        </tbody>
                    </table> -->
                </div>
            </el-card>
            <el-form-item label="图标选择" v-if="lineConfig.iconType==2&&lineConfig.showType==2">
                <el-input placeholder="图标" class="input-with-select" v-model="lineConfig.Icon">
                    <!-- <el-button @click="openIconDialog('lineConfig|statusIcons|statusIcon|'+i,i)" class="btnSelect" slot="append" icon="el-icon-search"></el-button> -->
                    <el-button @click="openIconDialog('lineConfig|Icon')" class="btnSelect" slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-form-item>
            <div v-if="lineConfig.iconType==2&&lineConfig.showType==2">
                <el-radio v-model="lineConfig.animationType" label="1">变色</el-radio>
                <el-radio v-model="lineConfig.animationType" label="2">闪烁</el-radio>
                <el-radio v-model="lineConfig.animationType" label="3">旋转</el-radio>
            </div>
            <el-form-item label="触发值" v-if="lineConfig.iconType==2&&lineConfig.showType==2&&(lineConfig.animationType==2||lineConfig.animationType==3)">
                <el-input v-model="lineConfig.lineConfig"></el-input>
            </el-form-item>
            <el-card class="box-card" v-if="lineConfig.iconType==2&&lineConfig.showType==2&&lineConfig.animationType==1">
                <div slot="header" class="clearfix">
                    <span>状态颜色列表</span>
                    <el-button @click="deleteTableItem('lineConfig','statusColors')" style="float: right; padding: 3px 0" type="text"><i class="el-icon-close"></i></el-button>
                    <el-button @click="addStatusColor" style="float: right; padding: 3px 0" type="text"><i class="el-icon-plus"></i></el-button>
                </div>
                <div class="text item">
                    <el-table :data="lineConfig.statusColors" style="width: 100%" @select-all="selectionAll" @select="selectionAll">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="statusValue" label="状态值">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.statusValue" placeholder="" class="input-with-select">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="statusColor" label="图标颜色">
                            <template slot-scope="scope">
                                <el-color-picker v-model="scope.row.statusColor" :predefine="predefineColors"></el-color-picker>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveLineConfig">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import System from '@/lib/System'
import {
    WatchParamter,
    WatchColorParam,
    DrawLine,
    DrawLineConfig
} from '@/lib/WatchParam'
import Diagram from '@/Views/diagramBind/src'
import {
    bimParamter
} from '@/lib/configParmas';
import Icon from '@/components/Dialog/icon/src'

import Varable from '@/components/Dialog/Variable/src'
export default {
    name: 'paramterdialog',
    components: {
        'el-diagram': Diagram,
    },
    data() {
        return {
            paramEditVisibale: false,
            labelEditVisibale: false,
            // diagramVisibale: false,
            systemCategoryData: System,
            servers: [], //视频服务器
            cams: [],
            diglogVisible: true,
            VarableVisible: false, //选择变量diglog
            // linkProp: '', //变量关联到那个输入框
            // index: 0, //watchparam 里第几个变量
            predefineColors: [
                '#F5F5DC', //beige
                '#000000', //black
                '#0000FF', //blue
                '#5F9EA0', //cadetblue
                '#00008B', //darkblue
                '#1e90ff', //darkred
                '#c71585', //gray
                'rgba(255, 69, 0, 0.68)', //green
                'rgb(255, 120, 0)', //lightblue
                'hsv(51, 100, 98)', //lightgreen
                'hsva(120, 40, 94, 0.5)', //lightpink
                'hsl(181, 100%, 37%)', //orange
                'hsla(209, 100%, 56%, 0.73)', //orchid
                '#c7158577', //purple

            ],
            sysNames: System,
            bim: new bimParamter(),
            iconel: null,
            varableel: null,
            panels: [],
            watchindex: 0,
            // drawlineindex: 0,
            callback: null,
            flag: false,
            fileid: '1506248329021408',
            lineConfig: new DrawLineConfig(),
            deleteItems: [],
            eidt: false,
            floors: [],

        }
    },

    methods: {
        open(callback, modelid, floors, floor) {
            this.floors = floors;
            this.bim.floor = floor;
            this.paramEditVisibale = true;
            this.callback = callback;
            this.$ajax.get(this.$URL + '/bim/GetBimConfig', {
                params: {
                    modelid: modelid,
                    fileid: this.fileid
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    if (result.data.data) {
                        this.bim = JSON.parse(result.data.data);
                        if (this.bim.EnableActionBind && this.bim.BindEventType === "0") {
                            this.loadVideoServer();
                        }
                        return;
                    }
                    // this.bim=result.data.data;
                }
                this.bim.Objid = modelid;
            }).catch((err) => {
                this.bim.Objid = modelid;
                console.log(err);
            });
        },
        openIconDialog(prop) {
            this.iconel = Icon.newInstance().diagram;
            this.iconel.open(this.iconCallback, prop);
        },
        iconCallback(prop, val) {
            if (prop && prop.indexOf("|") && prop.split('|').length == 2) {
                this[prop.split('|')[0]][prop.split('|')[1]] = val;
            } else if (prop && prop.indexOf("|") && prop.split('|').length == 4) {
                this[prop.split('|')[0]][prop.split('|')[1]][prop.split('|')[3]][prop.split('|')[2]] = val;
            }
            // this.bim[prop] = val;
            if (this.iconel) {
                document.getElementById("app").removeChild(this.iconel.$parent.$el);
            }
        },
        loadSystemName() {
            this.$ajax.get(this.$URL + '/SysMenu/LoadMenuName').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.sysNames = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        closeDiagram(id) {
            this.bim.DiagramID = id;
        },
        openDiagram() {
            Diagram.newInstance().diagram.open(this.closeDiagram);

        },
        loadVideoServer() {
            this.$ajax.get(this.$URL + '/video/LoadServerName').then((result) => {
                if (result.status === 200 & result.data.success) {
                    this.servers = result.data.data;
                    if (this.bim.videoServer && this.bim.videoServer.indexOf('|') > 0) {
                        this.serverSelectChange(this.bim.videoServer);
                    }
                }
            }).catch((err) => {
                console.log(err);
                this.servers = [];
            });
        },
        loadPanels() {
            this.$ajax.get(this.$URL + '/panel/GetPanelByAreas', {
                params: {
                    code: ''
                }
            }).then((result) => {
                if (result.status === 200 & result.data.success) {
                    this.panels = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
                this.servers = [];
            });
        },
        actionBindChange(val) {
            if (val && this.bim.BindEventType == 0) {
                this.loadVideoServer();
            } else if (val && this.bim.BindEventType == 6) {
                this.loadPanels();
            }
        },
        actionTypeChange(val) {
            if (val === "0") {
                this.loadVideoServer();
            } else if (val === "6") {
                this.loadPanels();
            }
        },
        serverSelectChange(value) {
            this.$ajax.get(this.$URL + '/video/LoadCamByServer?sid=' + value.split("|")[0]).then((result) => {
                if (result.status === 200 & result.data.success) {
                    this.cams = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
                this.cams = [];
            });
        },
        Close(tag) {
            if (this.callback) {
                this.callback(this.bim, this.flag);
            }
        },
        CloseDialog() {
            this.flag = true;
            this.paramEditVisibale = false;
        },
        closeVariable(prop, value) {
            if (prop && prop.indexOf("|") && prop.split('|').length == 2) {

                this[prop.split('|')[0]][prop.split('|')[1]] = value;

            } else if (prop && prop.indexOf("|") && prop.split('|').length == 4) {
                this[prop.split('|')[0]][prop.split('|')[1]][prop.split('|')[3]][prop.split('|')[2]] = value
            }
            if (this.varableel) {
                document.getElementById('app').removeChild(this.varableel.$parent.$el);
            }
        },
        showVarable(prop, i) {
            if (i >= 0 && !this.bim.EnableAnimationBind) {
                this.watchindex = i;
            }
            this.varableel = Varable.newInstance().diagram;
            if (prop && prop.indexOf("|") && prop.split('|').length == 2) {
                this.varableel.open(this.closeVariable, prop, this[prop.split('|')[0]][prop.split('|')[1]]);
            } else if (prop && prop.indexOf("|") && prop.split('|').length == 4) {
                this.varableel.open(this.closeVariable, prop, this[prop.split('|')[0]][prop.split('|')[1]][prop.split('|')[3]][prop.split('|')[2]]);
            }
        },
        addWatchParams(index) {
            this.bim.watchParameters.push(new WatchParamter());
        },
        addDrawlines(index) {
            this.eidt = false;
            this.lineConfig = new DrawLineConfig();
            this.labelEditVisibale = true;
        },
        editDrawlines() {

            if (this.deleteItems.length == 0) {
                this.$message.error("请选择要编辑的选项");
                return;
            } else if (this.deleteItems.length > 1) {
                this.$message.error("不能同时编辑多项");
                return;
            } else if (this.deleteItems.length === 1) {
                this.eidt = true;
                this.lineConfig = this.deleteItems[0];
                this.labelEditVisibale = true;
            }
        },
        removeWatchParams() {
            let _this = this;

            for (let j = _this.bim.watchParameters.length - 1; j >= 0; j--) {
                document.querySelectorAll('#selectAll input:checked').forEach((v, i) => {
                    if (j == Number.parseInt(v.getAttribute('propid'))) {
                        _this.bim.watchParameters.splice(j, 1);
                        return false;
                    }
                });
            }
        },
        addWatchCParams(index) {
            this.bim.watchColorParameters.push(new WatchColorParam());
        },
        removeWatchCParams() {
            let _this = this;

            for (let j = _this.bim.watchColorParameters.length - 1; j >= 0; j--) {
                document.querySelectorAll('#selectColorAll input:checked').forEach((v, i) => {
                    if (j == Number.parseInt(v.getAttribute('propid'))) {
                        _this.bim.watchColorParameters.splice(j, 1);
                        return false;
                    }
                });
            }
        },
        addStatusIcon(index) {
            this.lineConfig.statusIcons.push({
                statusVar: '',
                statusIcon: '',
                statusIconColor: '#fff',
            });
        },
        addStatusColor(index) {
            this.lineConfig.statusColors.push({
                statusValue: '',
                statusColor: '#fff'
            });
        },
        selectAll($event) {
            document.querySelectorAll('#selectAll input[type="checkbox"]').forEach((v, i) => {
                v.checked = $event.target.checked;
            });
        },
        selectColorAll($event) {
            document.querySelectorAll('#selectColorAll input[type="checkbox"]').forEach((v, i) => {
                v.checked = $event.target.checked;
            });
        },
        saveLineConfig() {
            if (!this.eidt) //编辑
            {
                this.bim.drawlines.push(this.lineConfig);
            }
            this.labelEditVisibale = false;
        },
        selectionAll(selection, prop) {
            this.deleteItems = selection;

        },
        deleteTableItem(obj, prop) {
            if (this.deleteItems.length == 0) {
                this.$message.error("请选择要删除的选项");
                return;
            }
            let _this = this;
            this.deleteItems.forEach((v, k) => {
                let index = _this[obj][prop].indexOf(v);
                _this[obj][prop].splice(index, 1);
            });

        }

    }
}
</script>

<style lang="less" scoped>
.el-card {
    background-color: #030d21;
    color: white;
    border: 0px;
}

table {
    width: 100%;
    text-align: center;
}

.el-card__header {
    padding: 5px 10px;
}

.el-card__body {
    padding: 5px;
}

.btnSelect {
    background-color: #13ce66 !important;
    border-radius: 0;
    border: 1px solid #6a91c5;
    color: white !important;
}

.el-input__inner {
    color: black !important;
}

fieldset {
    padding: 0 5px;
}

.form /deep/ .el-dialog__footer {
    font-size: 12px;
}
</style>
