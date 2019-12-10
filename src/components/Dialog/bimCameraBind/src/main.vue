<template>
<div>
    <el-dialog @close="Close(false)" class="form" title="视点编辑" :visible.sync="paramEditVisibale" :modal-append-to-body="false" width="557px" center>
        <!-- 系统分类 -->
        <el-form ref="ruleForm" label-width="100px" label-position="left" class="demo-ruleForm">
            <el-form-item label="名称描述">
                <el-input v-model="bim.description"></el-input>
            </el-form-item>
            <el-form-item label="楼层分类">
                <el-select style="width:100%" v-model="bim.floor" clearable>
                    <el-option v-for="(item,i) in floors" :value="item.name" :label="item.name" :key="i"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="巡检点">
                <el-select clearable v-model="bim.pointid" style="width:100%">
                    <el-option v-for="(item,i) in pointids" :key="i" :value="item.ID" :label="item.Name"></el-option>
                </el-select>
            </el-form-item>
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
        </el-form>
        <span slot="footer" class="dialog-footer">
           <el-button type="primary" @click="CloseDialog">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {
    WatchParamter,
    // WatchColorParam,
    // DrawLine,
    // DrawLineConfig
} from '@/lib/WatchParam'
// import Diagram from '../../../Views/diagramBind/src'
import {
    bimCamera
} from '@/lib/configParmas';
// import Icon from '../../icon/src/index';
import Varable from '../../Variable/src/index'
export default {
    name: 'paramterdialog',
    // components: {
    //     'el-diagram': Diagram,
    // },
    data() {
        return {
            paramEditVisibale: false,
            servers: [], //视频服务器
            cams: [],
            VarableVisible: false, //选择变量diglog
            bim: new bimCamera(),
            varableel: null,
            watchindex: 0,
            callback: null,
            flag: false,
            fileid: '1506248329021408',
            deleteItems: [],
            eidt: false,
            floors: [],
            // pointid: '',
            pointids: [],
        }
    },
    methods: {
        open(callback, floors) {
            this.floors = floors;
            this.paramEditVisibale = true;
            this.callback = callback;
            this.loadVideoServer();
            this.loadAllPoints();
            // this.$ajax.get(this.$URL + '/bim/GetBimConfig', {
            //     params: {
            //         modelid: modelid,
            //         fileid: this.fileid
            //     }
            // }).then((result) => {
            //     if (result.status === 200 && result.data.success) {
            //         if (result.data.data) {
            //             this.bim = JSON.parse(result.data.data);
            //             if (this.bim.EnableActionBind && this.bim.BindEventType === "0") {
            //                 this.loadVideoServer();
            //             }
            //             return;
            //         }
            //         // this.bim=result.data.data;
            //     }
            //     this.bim.Objid = modelid;
            // }).catch((err) => {
            //     this.bim.Objid = modelid;
            //     console.log(err);
            // });
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

        selectAll($event) {
            document.querySelectorAll('#selectAll input[type="checkbox"]').forEach((v, i) => {
                v.checked = $event.target.checked;
            });
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
        },
        loadAllPoints() {
            this.$ajax.get(this.$URL + '/patrol/GetAllPoints').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.pointids = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
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
