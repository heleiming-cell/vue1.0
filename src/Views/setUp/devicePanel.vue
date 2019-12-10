<template>
<el-row class="boxpanel">
    <el-col :xs="24" :sm="3" class="h100 " style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>设备面板</span></div>
            <div style="float:right">
                <span @click="addPanel" class="pointer"><i class="iconfont icon-jia"></i></span>
                <span class="pointer" @click="deletePanel" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>
                <span @click="editPanel" class="pointer"><i class="iconfont icon-bianji"></i></span>
            </div>
        </div>
        <el-tree ref="tree" @node-click="nodeClick" :expand-on-click-node="false" class="paneltree" node-key="key" :data="treedata" show-checkbox check-strictly @check-change="handleCheckChange" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="24" :sm="21" class="h100">
        <div class="config">
            <div style="margin-right:30px;width:20%" v-show="false">
                <img v-show="src" :src="src" style="width:100%">
            </div>
            <div style="width:100%">
                <div class="btngroup">
                    <el-button type="primary" size="mini" v-show="node&&node.panelType&&node.panelType==='Custom'" @click="addCustom">添加</el-button>
                    <el-button type="danger" size="mini" v-show="node&&node.panelType&&node.panelType==='Custom'" @click="delCustom">删除</el-button>
                </div>
                <el-table @select-all="selctTable" @select="selctTable" v-show="tableData.length>0" :data="tableData" style="width: 100%">
                    <el-table-column type="selection" width="55" v-if="node&&node.panelType&&node.panelType==='Custom'">
                    </el-table-column>
                    <el-table-column prop="n" label="序号">
                        <template slot-scope="scope">
                            <span>{{scope.row.n}}</span>
                            <!-- <span v-show="node&&node.PanelType&&node.PanelType==='Custom'">{{scope.$index}}</span> -->
                            <!-- <el-input size="mini" v-model="scope.row.n" v-show="node&&node.PanelType&&node.PanelType==='Custom'"></el-input> -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="名称">
                        <template slot-scope="scope">
                            <span v-show="node&&node.panelType&&node.panelType!=='Custom'">{{scope.row.name}}</span>
                            <el-input size="mini" v-model="scope.row.name" v-show="node&&node.panelType&&node.panelType==='Custom'"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" label="控件ID">
                        <template slot-scope="scope">
                            <span>{{scope.row.id}}</span>
                            <!-- <el-input size="mini" v-model="scope.row.id" v-show="node&&node.PanelType&&node.PanelType==='Custom'"></el-input> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="变量">
                        <template slot-scope="scope">
                            <span style="color:green;">{{scope.row.var}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="变量绑定">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="bindVar(scope.$index, scope.row.id,scope.row.var,scope.row)" type="primary">绑定</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="实时数据">
                        <template slot-scope="scope">
                            <el-checkbox @change="realChange($event,scope)" v-model="scope.row.realtime" style="margin-left:10px;">实时</el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="历史数据">
                        <template slot-scope="scope">
                            <el-checkbox @change="historyChange($event,scope)" v-model="scope.row.history" style="margin-left:10px;">历史</el-checkbox>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="历史记录">
                            <template slot-scope="scope">
                                <el-select @change="historyChange($event,scope)" clearable v-model="scope.row.history" size="mini" style="width:100px;">
                                    <el-option value="1" label="慢速"></el-option>
                                    <el-option value="2" label="中速"></el-option>
                                    <el-option value="3" label="快速"></el-option>
                                </el-select>
                            </template>
                        </el-table-column> -->
                </el-table>
            </div>
        </div>
    </el-col>
    <el-dialog title="面板编辑" :visible.sync="panelDialog" :modal-append-to-body="false" width="400px">
        <el-form :model="ruleForm" :rules="rules" label-width="100px" label-position="left" ref="panel">
            <el-form-item label="面板名称" prop="panelName">
                <el-input v-model="ruleForm.panelName"></el-input>
            </el-form-item>
            <el-form-item label="面板类型" prop="panelType">
                <el-select v-model="ruleForm.panelType" filterable class="w100">
                    <el-option v-for="(item,i) in panelTypes" :label="item.label" :value="item.value" :key="i"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="朗诗屏ID">
                <el-input v-model="ruleForm.ScreenID"></el-input>
                <!-- <el-select v-model="ruleForm.panelType" filterable class="w100">
                    <el-option v-for="(item,i) in panelTypes" :label="item.label" :value="item.value" :key="i"></el-option>
                </el-select> -->
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="savePanel">确 定</el-button>
        </span>
    </el-dialog>
</el-row>
</template>

<script>
import panelType from '@/data/panelType'
import Variable from '@/components/Dialog/Variable/src'
import {
    imgs,
    panelConfig
} from '@/data/panelConfig.js'
export default {
    name: 'devicePanel',
    data() {
        return {
            ruleForm: {
                panelType: '',
                panelName: '',
                ScreenID: '',
            },
            rules: {
                panelName: [{
                    required: true,
                    message: '名称不能为空',
                    trigger: 'blur'
                }],
                panelType: [{
                    required: true,
                    message: '类型不能为空',
                    trigger: 'change'
                }],
            },
            panelDialog: false,
            panelTypes: panelType,
            panelType: '',
            panelName: '',
            node: null,
            edit: false,
            treedata: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            src: '',
            tableData: [],
            bindobj: {},
            el: null,
            i: 0,
            history: [{
                    value: 1,
                    label: '慢速'
                },
                {
                    value: 2,
                    label: '中速'
                },
                {
                    value: 3,
                    label: '快速'
                }
            ],
            deleteConfigs: [],
        }
    },
    mounted() {
        this.loadPanel();
    },
    // computed: {
    //     varobj() {
    //         return this.bindobj;
    //     }
    // },
    methods: {
        addPanel() {
            if (!this.node) {
                this.$message.error("请先选择区域节点");
                return;
            } else if (this.node && !this.node.menuid) {
                this.$message.error("改节点下不支持添加面板");
                return;
            } else if (this.node && this.node.areacode) {
                this.$message.error("改节点下不支持添加面板");
                return;
            }
            this.panelDialog = true;
            this.ruleForm.panelType = '';
            this.ruleForm.panelName = '';

            this.edit = false;
            this.$refs['panel'].resetFields();
        },
        editPanel() {
            if (!this.node) {
                this.$message.error("请选择要编辑的面板");
                return;
            } else if (this.node && !this.node.areacode) {
                this.$message.error("改节点不支持编辑");
                return;
            }
            this.panelDialog = true;
            this.edit = true;
            this.ruleForm.panelType = this.node.panelType;
            this.ruleForm.panelName = this.node.label;
            this.ruleForm.ScreenID = this.node.screenid;
        },
        deletePanel() {
            if (!this.node) {
                this.$message.error("请选择要删除的面板");
                return;
            } else if (this.node && !this.node.areacode) {
                this.$message.error("改节点不支持删除");
                return;
            }
            this.$ajax.get(this.$URL + '/panel/DeletePanels', {
                params: {
                    id: this.node.key
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.loadPanel();

                }
            }).catch((err) => {
                console.log(err);
            });
        },
        savePanel() {
            let _this = this;
            this.$refs['panel'].validate((valid) => {
                if (valid) {
                    this.$ajax.get(this.$URL + '/panel/AddPanels', {
                        params: {
                            name: this.ruleForm.panelName,
                            type: this.ruleForm.panelType,
                            panelId: this.ruleForm.ScreenID,
                            menuId: this.node.menuid,
                            areaId: this.edit ? this.node.areaid : this.node.key,
                            code: this.edit ? this.node.areacode : this.node.code,
                            id: this.edit ? this.node.key : 0,
                        }
                    }).then((result) => {
                        if (result.status === 200 && result.data.success) {
                            this.$message({
                                'message': '操作成功',
                                type: 'success'
                            });
                            this.panelDialog = false;
                            this.loadPanel();
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            });
        },
        handleCheckChange(node, status) {
            let _this = this;
            if (status) {
                if (this.node && this.node.key != node.key) {
                    this.$refs.tree.setChecked(this.node, false);
                }
                this.node = node;
                this.bindobj = {}; //复位
                this.i = 0; //复位
                if (this.node.panelType) {
                    this.src = imgs[this.node.panelType];
                    if (this.node.panelType !== "Custom") {
                        this.tableData = JSON.parse(JSON.stringify(panelConfig[this.node.panelType]));
                    }
                    this.$ajax.get(this.$URL + '/panel/PanelConfig', {
                        params: {
                            id: this.node.key
                        }
                    }).then((result) => {
                        if (result.status === 200 && result.data.success) {
                            if (result.data.data) {
                                if (this.node.panelType === "Custom") {
                                    this.tableData = JSON.parse(result.data.data);
                                    this.loadPanelConfig();
                                    return;
                                }
                                let config = JSON.parse(result.data.data);
                                Object.keys(config).forEach((v, i) => {
                                    _this.tableData.forEach((t, j) => {
                                        if (_this.tableData[j].id === v) {
                                            _this.tableData[j].var = config[v];
                                        }
                                    });
                                });
                                _this.bindobj = config;
                                this.loadPanelConfig();
                            } else {
                                if (this.node.panelType === "Custom")
                                    this.tableData = [];
                            }

                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    this.src = ''
                    this.tableData = [];
                }
            } else {
                if (this.node && this.node.key === node.key) {
                    this.node = null;
                    this.src = ''
                    this.tableData = [];
                }
            }

        },
        loadPanel(node, resolve) {
            this.$ajax.get(this.$URL + '/AreaMenu/GetAreaPanel').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.treedata = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });

        },
        callback(prop, val) {
            if (val) {
                Object.assign(this.bindobj, {
                    [prop]: val,
                });
                if (this.node.panelType === "Custom") { //自定义模板,提前保存
                    this.tableData[this.i].var = val;
                }
                this.$ajax.get(this.$URL + '/panel/AddPanelConfig', {
                    params: {
                        id: this.node.key,
                        config: this.node.panelType === "Custom" ? JSON.stringify(this.tableData) : JSON.stringify(this.bindobj),
                        panelType: this.node.panelType,
                        panelName: this.node.label
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        if (this.node.panelType !== "Custom") {
                            this.tableData[this.i].var = val;
                        }
                    } else {
                        this.$message.error("绑定失败");
                    }
                }).catch((err) => {
                    this.$message.error("绑定失败");
                });
            }
            if (this.el) {
                document.getElementById("app").removeChild(this.el.$parent.$el);
                this.el = null;
            }
        },
        bindVar(i, prop, val, data) {
            if (!data.name || !data.id) {
                this.$message.error("序号、名称、空间ID不能为空");
                return;
            }
            this.i = i;
            this.el = Variable.newInstance().diagram;
            this.el.open(this.callback, prop, val);
        },
        realChange(status, scope) {
            if (status) {
                let obj = {
                    Level: '',
                    TypeID: 1, //实时
                    PanelID: this.node.key,
                    VarName: scope.row.name,
                    Variable: scope.row.var,
                    ComponentID: scope.row.id,
                }
                this.saveConfig(obj);
            } else {
                this.deleteConfig({
                    typeId: 1,
                    panelId: this.node.key,
                    componentId: scope.row.id,
                });
            }
        },
        historyChange(val, scope) {
            if (val) {
                let obj = {
                    // level: val,
                    level: 1,
                    typeId: 0, //历史
                    panelId: this.node.key,
                    varName: scope.row.name,
                    variable: scope.row.var,
                    componentId: scope.row.id,
                }
                this.saveConfig(obj);
            } else {
                this.deleteConfig({
                    typeId: 0,
                    panelId: this.node.key,
                    componentId: scope.row.id,
                });
            }
        },
        saveConfig(obj) {
            this.$ajax.get(this.$URL + '/panel/SavePanelConfig', {
                params: obj
            }).then((result) => {
                if (result.status === 200 && result.data.success) {}
            }).catch((err) => {
                console.log(err);
            });
        },
        deleteConfig(obj) {
            this.$ajax.get(this.$URL + '/panel/DeletePanelConfig', {
                params: obj
            }).then((result) => {
                if (result.status === 200 && result.data.success) {}
            }).catch((err) => {
                console.log(err);
            });
        },
        loadPanelConfig() {
            this.$ajax.get(this.$URL + '/panel/GetPanelConfigById', {
                params: {
                    id: this.node.key
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    if (result.data.data && result.data.data.length > 0) {
                        let _this = this;
                        result.data.data.forEach((v, i) => {
                            _this.tableData.forEach((m, n) => {
                                if (m.id === v.ComponentID && v.TypeID === 0) //历史
                                {
                                    m.history = true;
                                } else if (m.id === v.ComponentID && v.TypeID === 1) //实时
                                {
                                    m.realtime = true;
                                }
                            });
                        });
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        addCustom() {
            if (!this.node) {
                return;
            }
            let index = 0;
            if (this.tableData.length > 0) {
                index = this.tableData[this.tableData.length - 1].n + 1;
            }
            this.tableData.push({
                n: index,
                name: '',
                id: 'id' + index,
                var: '',
                realtime: '',
                history: '',
            });
        },
        delCustom() {
            let _this = this;
            if (this.deleteConfigs.length == 0) {
                this.$message.error("请选择要删除的配置项");
                return;
            }
            this.deleteConfigs.forEach((v, i) => {
                let index = _this.tableData.indexOf(v);
                _this.tableData.splice(index, 1);
            });
            this.deleteConfigs.forEach((v, i) => {
                if (v.realtime) {
                    this.deleteConfig({
                        TypeID: 1,
                        PanelID: this.node.key,
                        ComponentID: v.id,
                    });
                }
                if (v.history) {
                    this.deleteConfig({
                        TypeID: 0,
                        PanelID: this.node.key,
                        ComponentID: v.id,
                    });
                }
            });
            this.saveCustomConfig();

        },
        saveCustomConfig() {
            this.$ajax.get(this.$URL + '/panel/AddPanelConfig', {
                params: {
                    id: this.node.key,
                    config: this.node.panelType === "Custom" ? JSON.stringify(this.tableData) : JSON.stringify(this.bindobj),
                    panelType: this.node.panelType,
                    panelName: this.node.label
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    if (this.node.panelType !== "Custom") {
                        //this.tableData[this.i].var = val;
                    }
                } else {
                    this.$message.error("绑定失败");
                }
            }).catch((err) => {
                this.$message.error("绑定失败");
            });
        },
        nodeClick(data, node, _this) {
            this.node = data;
        },
        selctTable(selection) {
            if (selection.length === 0) {
                this.deleteConfigs = [];
            } else if (selection.length > 0) {
                // let id = [];
                // selection.forEach((v, k) => {
                //     id.push(v.UserId);
                // });
                this.deleteConfigs = selection;
            }
        }
    }
}
</script>

<style lang="less" scoped>
.boxpanel {
    height: 100%;
}

.paneltree {
    height: calc(100% - 37px);
    overflow-x: hidden;
    overflow-y: auto;
}

.menuheader {
    line-height: 36px;
    vertical-align: middle;
    padding: 0 10px;
    overflow: hidden;
    background: #010308;

    i {
        cursor: pointer;
    }
}

.config {
    display: flex;
    flex: 1 1;
    height: 100%;
    width: 100%;
    justify-content: flex-start;
    flex-wrap: nowrap;
    padding: 10px;
    overflow-y: auto;
}

.btngroup {
    float: right;
    padding: 10px 0;
}
</style>
