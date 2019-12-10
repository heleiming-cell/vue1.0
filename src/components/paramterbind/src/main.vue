<template>
<!-- GIS编辑参数绑定 -->
<div>
    <el-dialog @close="close1" title="参数编辑" :visible.sync="paramEditVisibale" :modal-append-to-body="false" width="557px" center>
        <!-- 系统分类 -->
        <el-form ref="ruleForm" label-width="100px" label-position="left" class="demo-ruleForm">
            <el-form-item label="系统分类" prop="name">
                <el-select v-model="gis.systemCategory" style="width:100%">
                    <el-option v-for="item in systemCategoryData" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <!-- 名称描述 -->
            <el-form-item label="名称描述" prop="name">
                <el-input v-model="gis.Name"></el-input>
            </el-form-item>
            <!-- 地理坐标 -->
            <el-form-item label="地理坐标" prop="name">
                <el-input v-model="gis.Lating"></el-input>
            </el-form-item>
            <!-- 图标选择 -->
            <fieldset>
                <legend style="color:white;">图标配置</legend>
                <el-form :inline="true" class="demo-form-inline" style="text-align:center;height:50px;">
                    <el-form-item label="图标选择" prop="name">
                        <i :class="gis.iconClass" @click="openIconDialog" style="vertical-align: middle;color:white"></i>
                        <el-button v-if="!gis.iconClass" @click="openIconDialog" type="primary" icon="el-icon-search" circle></el-button>
                    </el-form-item>
                    <el-form-item label="图标颜色" prop="delivery">

                        <el-color-picker v-model="gis.iconColor"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="图标背景" prop="delivery">
                        <el-color-picker v-model="gis.iconBackColor" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                </el-form>
            </fieldset>

            <!-- 启用动作事件 -->
            <el-form-item label="鼠标事件" prop="delivery">
                <el-switch v-model="gis.EnableActionEvent" inactive-color="#13ce66" active-color="#ff4949"></el-switch>
            </el-form-item>
            <fieldset v-if="gis.EnableActionEvent">
                <legend>鼠标事件</legend>
                <!-- <div > -->
                <el-form-item label="事件类型" prop="name">
                    <el-select v-model="gis.ActionType" style="width:100%" @change="ActionTypeChange">
                        <el-option value="0" label="播放视频"></el-option>
                        <el-option value="1" label="弹窗网页"></el-option>
                        <el-option value="2" label="弹窗视图"></el-option>
                        <el-option value="3" label="开关控制"></el-option>
                        <el-option value="4" label="变量写值"></el-option>
                        <el-option value="5" label="监控面板"></el-option>
                    </el-select>
                </el-form-item>
                <!-- </div> -->

                <div v-if="gis.ActionType==='0'">
                    <el-form-item label="视频服务器" prop="name">
                        <el-select style="width:100%" @change="serverSelectChange" v-model="gis.server">
                            <el-option v-for="item in servers" :key="item.value" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="摄像机" prop="name">
                        <el-select style="width:100%" v-model="gis.cam">
                            <el-option v-for="item in cams" :key="item.value" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div v-if="gis.ActionType==='1'">
                    <el-form-item label="网页URL" prop="delivery">
                        <el-input v-model="gis.LinkUrl" class="input-with-select">
                        </el-input>
                    </el-form-item>
                </div>
                <div v-if="gis.ActionType==='2'">
                    <el-form-item label="组态视图" prop="delivery">
                        <el-input placeholder="选择组态图" v-model="gis.DiagramID" class="input-with-select">
                            <el-button class="btnSelect" @click="openDiagram" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                </div>
                <div v-if="gis.ActionType==='3'">
                    <el-form-item label="名称描述" prop="delivery">
                        <el-input placeholder="名称描述" v-model="gis.SwitchName" class="input-with-select">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="开关变量" prop="delivery">
                        <el-input placeholder="变量" v-model="gis.SwitchVar" class="input-with-select">
                            <el-button @click="showVarable('SwitchVar')" class="btnSelect" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                </div>
                <div v-if="gis.ActionType==='4'">
                    <el-form-item label="名称描述" prop="delivery">
                        <el-input placeholder="名称描述" v-model="gis.WriteName" class="input-with-select">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="变量绑定" prop="delivery">
                        <el-input placeholder="变量" v-model="gis.WriteVar" class="input-with-select">
                            <el-button @click="showVarable" class="btnSelect" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="变量值" prop="delivery">
                        <el-input placeholder="变量值" v-model="gis.WriteValue" class="input-with-select">
                        </el-input>
                    </el-form-item>
                </div>
                <div v-if="gis.ActionType==='5'">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>显示列表</span>
                            <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-close"></i></el-button>
                            <el-button @click="addWatchParams" style="float: right; padding: 3px 0" type="text"><i class="el-icon-plus"></i></el-button>
                        </div>
                        <div class="text item">
                            <table border="1">
                                <thead>
                                    <tr>
                                        <td><input type="checkbox"></td>
                                        <td>名称</td>
                                        <td>参数</td>
                                        <td>单位</td>
                                        <td>类型</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,i) in gis.WatchParams" :key="i">
                                        <td><input type="checkbox"></td>
                                        <td>
                                            <el-input placeholder="名称" class="input-with-select" v-model="item.WatchName">
                                            </el-input>
                                        </td>
                                        <td>
                                            <el-input placeholder="变量" v-model="item.WatchVar" class="input-with-select">
                                                <el-button @click="showVarable('WatchVar',i)" class="btnSelect" slot="append" icon="el-icon-search"></el-button>
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
            </fieldset>
            <el-form-item label="动画事件" prop="delivery">
                <el-switch v-model="gis.EnableAnimation" inactive-color="#13ce66" active-color="#ff4949"></el-switch>
            </el-form-item>
            <!-- 动画事件 -->
            <fieldset v-if="gis.EnableAnimation">
                <legend>动画事件</legend>
                <el-form-item label="变量绑定" prop="delivery">
                    <el-input placeholder="变量" v-model="gis.AnimationVar" class="input-with-select">
                        <el-button @click="showVarable('AnimationVar')" class="btnSelect" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-form-item>
                <!-- 报警变色 -->
                <el-form-item label="报警变色" prop="delivery">
                    <el-switch v-model="gis.EnableAlarmColor" inactive-color="#13ce66" active-color="#ff4949"></el-switch>
                </el-form-item>
                <div v-if="gis.EnableAlarmColor">
                    <el-form-item label="报警颜色" prop="delivery">
                        <el-color-picker v-model="gis.AlarmColor"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="报警阀值" prop="delivery">
                        <el-input placeholder="报警值" v-model="gis.AlarmValue" class="input-with-select">
                        </el-input>
                    </el-form-item>
                </div>
                <!-- 是否可见 -->
                <el-form-item label="报警可见" prop="delivery">
                    <el-switch v-model="gis.EnableVisble" inactive-color="#13ce66" active-color="#ff4949"></el-switch>
                </el-form-item>
                <div v-if="gis.EnableVisble">
                    <el-form-item label="可见阀值" prop="delivery">
                        <el-input placeholder="可见值" v-model="gis.VisbleValue" class="input-with-select">
                        </el-input>
                    </el-form-item>
                </div>
            </fieldset>

            <!-- 全局刷新 -->
            <el-form-item label="全局刷新" prop="delivery">
                <el-switch v-model="gis.GlobleRefresh" inactive-color="#13ce66" active-color="#ff4949"></el-switch>
            </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Close">确 定</el-button>
        </span>

    </el-dialog>
    <!-- <el-dialog style="z-index:2009" title="图标选择" :visible.sync="iconEditVisibale" :modal-append-to-body="false" width="557px" center>
        <el-icon @iconClick="iconClick"></el-icon>
        <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog> -->
    <el-Varable @close="closeVariable" :linkProp="linkProp" :paramEditVisibale="VarableVisible"></el-Varable>
</div>
</template>

<script>
import ICON from '@/components/Dialog/icon/src/index';
import System from '@/lib/System'
import Paramter from '@/lib/Paramter.js'
import {
    WatchParamter
} from '@/lib/WatchParam'
import Varable from '@/components/Variable'
import Diagram from '@/Views/diagramBind/src'
export default {
    name: 'paramterdialog',
    props: ['paramEditVisibale', 'gis'],
    components: {
        // 'el-icon': ICON,
        'el-Varable': Varable,
        'el-diagram': Diagram,
    },
    // watch: {
    //     Latng: function (newvalue, old) {
    //         this.gis.Lating = newvalue;
    //     }
    // },
    data() {
        return {
            // iconEditVisibale: false,
            diagramVisibale: false,
            //  iconClass: '', //选择的图标
            systemCategoryData: System,
            servers: [], //视频服务器
            cams: [],
            diglogVisible: true,
            VarableVisible: false, //选择变量diglog
            //  gis: new Paramter(),
            linkProp: '', //变量关联到那个输入框
            index: 0, //watchparam 里第几个变量
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
                '', //red
                '', //red
                '', //red
            ],
            iconel: null,
        }

    },
    methods: {
        closeDiagram(id) {
            // this.diagramVisibale=false;
            this.gis.DiagramID = id;
        },
        openDiagram() {
            Diagram.newInstance().diagram.open(this.closeDiagram);
            //  this.diagramVisibale=true;

        },
        // iconClick(name) {
        //     this.gis.iconClass = name;
        //     this.iconEditVisibale = false;
        // },
        ActionTypeChange(value) {
            if (value === "0") //播放视频
            {
                this.$ajax.get(this.$URL + '/video/LoadServerName').then((result) => {
                    if (result.status === 200 & result.data.success) {
                        this.servers = result.data.data;
                    }
                }).catch((err) => {
                    console.log(err);
                    this.servers = [];
                });
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
        Close() {
            this.$emit('paramter', false, this.gis)
        },
        close1() {
            this.$emit('close');
        },
        closeVariable(value, variable, linkProp) {
            let _this = this;
            this.VarableVisible = value; //关闭子窗口
            if (linkProp && variable && variable.split(':').length === 4 && variable.split(':')[0]) {
                let a = {}
                if (new Set(Object.keys(this.gis)).has(linkProp))
                    this.gis[linkProp] = variable;
                else
                    this.gis.WatchParams[_this.index][linkProp] = variable;
            }
        },
        showVarable(prop, index) {
            if (index)
                this.index = index;
            this.VarableVisible = true;
            this.linkProp = prop;
        },
        addWatchParams(index) {
            // [].pu
            this.gis.WatchParams.push(new WatchParamter());
        },
        iconCallback(prop, val) {
            this.gis[prop] = val;
            if (this.iconel) {
                document.getElementById("app").removeChild(this.iconel.$parent.$el);
            }
        },
        openIconDialog() {
            this.iconel = ICON.newInstance().diagram;
            this.iconel.open(this.iconCallback, "iconClass");
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
</style>
