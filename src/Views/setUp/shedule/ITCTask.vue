<template>
<el-row class="h100">
    <el-col :xs="24" :sm="3" class="h100 " style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>任务列表</span></div>
            <div style="float:right">
                <span @click="addTask" class="pointer"><i class="iconfont icon-jia"></i></span>
                <span class="pointer" @click="deleteITCTask" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>
                <span @click="editITCTask" class="pointer"><i class="iconfont icon-bianji"></i></span>
            </div>
        </div>
        <el-tree ref="tree" :expand-on-click-node="false" class="paneltree" node-key="key" :data="treedata" show-checkbox @check-change="handleCheckChange" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="24" :sm="21" class="h100 " style="border-right: 1px solid #122d62;padding:10px">
        <div class="btn">
            <el-button type="primary" @click="addConfig">添加</el-button>
            <el-button type="danger" @click="delConfigs">删除</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" class="usertable" @select-all="selctTable" @select="selctTable">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="Name" label="任务名称">
            </el-table-column>
            <el-table-column prop="ITC_Task_Musics" label="广播文件">
                <template slot-scope="scope">
                    <span v-for="(item,i) in JSON.parse(scope.row.ITC_Task_Musics)" :key="i">{{item}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="ITC_Task_Terminal" label="广播终端">
                <template slot-scope="scope">
                    <!-- <span>{{scope.row}}</span> -->
                    <span v-for="(item,i) in JSON.parse(scope.row.ITC_Task_Terminal)" :key="i">{{item}}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination :page-size="size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
        </el-pagination>
    </el-col>
    <el-dialog title="广播任务" :visible.sync="itcTaskPanelDialog" :modal-append-to-body="false" width="400px">
        <el-form label-width="100px" label-position="left">
            <el-form-item label="任务名称">
                <el-input v-model="taskName"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="saveITCTask">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="广播任务配置" :visible.sync="taskConfigPanelDialog" :modal-append-to-body="false" width="400px">
        <el-form label-width="100px" label-position="left">
            <el-form-item label="音乐目录">
                <el-select clearable style="width:100%" v-model="category" @change="changeCategory">
                    <el-option v-for="(item,i) in categorys" :label="item.CategoryName" :value="item.CategoryID" :key="i"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="文件选择">
                <el-select clearable style="width:100%" filterable multiple v-model="music">
                    <el-option v-for="(item,i) in musics" :label="item.Name" :value="item.FullPath" :key="i"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-form label-width="100px" label-position="left">
            <el-form-item label="终端选择">
                <el-select clearable style="width:100%" filterable multiple v-model="terminal">
                    <el-option v-for="(item,i) in terminals" :label="item.js_endpoint_name" :value="item.js_endpoint_address" :key="i"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="saveTaskConfig">确 定</el-button>
        </span>
    </el-dialog>
</el-row>
</template>

<script>
import {
    Tree
} from '@/lib/Common'
import Variable from '@/components/Dialog/Variable/src'
export default {
    name: "itctask",
    data() {
        return {
            itcTaskPanelDialog: false,
            taskConfigPanelDialog: false,
            taskName: '',
            treedata: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            tableData: [],
            total: 0,
            size: 10,
            currentPage: 1,
            edit: false,
            el: null,
            varids: [],
            categorys: [],
            category: '',
            musics: [],
            music: [],
            terminals: [],
            terminal: []
        }
    },
    mounted() {
        this.loadTask();
        this.loadITCTaskConfig();
        this.loadCategorys();
        this.loadTerminals();
    },
    methods: {
        loadTask() {
            new Tree().loadTreeNodes(this, '/itctask/GetITCTask', "treedata", this.$SHEDULEURL);
        },
        loadCategorys() {
            this.$ajax.get(this.$URL + '/itc/GetSelectCategory').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.categorys = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadTerminals() {
            let _this = this;
            this.$ajax.get(this.$URL + '/itc/GetTerminals').then((result) => {
                if (result.status === 200) {
                    this.terminals = result.data.PARA
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadFiles(id) {
            this.$ajax.get(this.$URL + '/itc/GetFiles', {
                params: {
                    nodeid: JSON.stringify([id]),
                    page: 0,
                    size: 0,
                    keyword: '',
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.musics = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        changeCategory(id) {
            if (id) {
                this.loadFiles(id);
            } else {
                this.musics = [];
            }
        },
        addTask() {
            if (this.$refs.tree.getCheckedNodes().length > 1) {
                this.$message.error("不能同时操作两个节点控制组");
                return;
            }
            this.edit = false;
            this.taskName = "";
            this.itcTaskPanelDialog = true;
        },
        deleteITCTask() {
            if (this.$refs.tree.getCheckedNodes() === 0) {
                this.$message.error("请选择要删除的控制组");
                return;
            }
            let tasks = [];
            this.$refs.tree.getCheckedNodes().forEach(v => {
                tasks.push(v.key);
            })
            this.$ajax.post(this.$SHEDULEURL + '/itctask/DeleteItcTasks', this.$QS.stringify({
                tasks: tasks
            })).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: '删除成功！'
                    });
                    new Tree().loadTreeNodes(this, '/itctask/GetITCTask', "treedata", this.$SHEDULEURL);
                    this.loadITCTaskConfig();
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        editITCTask() {
            if (this.$refs.tree.getCheckedNodes().length === 0) {
                this.$message.error("请选择要编辑的任务");
                return;
            } else if (this.$refs.tree.getCheckedNodes().length > 1) {
                this.$message.error("不能同时操作两个节点任务");
                return;
            }
            this.edit = true;
            this.taskName = this.$refs.tree.getCheckedNodes()[0].label;
            this.itcTaskPanelDialog = true;
        },
        saveITCTask() {
            this.$ajax.get(this.$SHEDULEURL + '/itctask/AddEditITCTasks', {
                params: {
                    taskname: this.taskName,
                    parentid: this.$refs.tree.getCheckedNodes().length > 0 ? this.$refs.tree.getCheckedNodes()[0].key : 0,
                    taskid: !this.edit ? 0 : (this.$refs.tree.getCheckedNodes().length > 0 ? this.$refs.tree.getCheckedNodes()[0].key : 0)
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.itcTaskPanelDialog = false;
                    new Tree().loadTreeNodes(this, '/itctask/GetITCTask', "treedata", this.$SHEDULEURL);
                } else {
                    this.$message.error("操作失败！");
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        saveTaskConfig() {
            if (this.music.length === 0) {
                this.$message.error("播放文件不能为空");
                return;
            } else if (this.terminal.length === 0) {
                this.$message.error("播放终端不能为空");
                return;
            }
            this.$ajax.post(this.$SHEDULEURL + '/itctask/SaveTaskCoonfig', this.$QS.stringify({
                key: this.$refs.tree.getCheckedNodes()[0].key,
                terminals: JSON.stringify(this.terminal),
                files: JSON.stringify(this.music)
            })).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.taskConfigPanelDialog=false;
                    this.loadITCTaskConfig();
                } else {
                    this.$message.error("添加失败！");
                }
            }).catch((err) => {
                console.log(err);
            });

        },
        handleCheckChange() {
            this.loadITCTaskConfig();
        },
        handleCurrentChange(page) {
            this.currentPage = page;
            this.loadITCTaskConfig();
        },
        callback(prop, val, writevalue) {
            if (!writevalue) {
                writevalue = 0;
            }
            this.addVtoGroup(val, writevalue);
            if (this.el) {
                document.getElementById("app").removeChild(this.el.$parent.$el);
                this.el = null;
            }
        },
        addConfig() {
            if (this.$refs.tree.getCheckedNodes().length === 0) {
                this.$message.error("请选择要操作的任务");
                return;
            } else if (this.$refs.tree.getCheckedNodes().length > 1) {
                this.$message.error("不能同时操作两个节点任务");
                return;
            }
            this.taskConfigPanelDialog = true;
        },
   
        loadITCTaskConfig() {
            let taskids = [];
            this.$refs.tree.getCheckedNodes().forEach((v) => {
                taskids.push(v.key ? v.key : 0);
            })
            this.$ajax.get(this.$SHEDULEURL + '/itctask/GetITCTaskByKey', {
                params: {
                    key: taskids.length > 0 ? taskids : [0],
                    size: this.size,
                    page: this.currentPage,
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.tableData = result.data.data.length>0?result.data.data[0].Table:[];
                    this.total = result.data.count;
                } else {
                    //    this.tableData=[]
                    this.total = 0
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        selctTable(selection) {
            let _this = this;
            if (selection.length === 0) {
                this.varids = [];
            } else if (selection.length > 0) {
                this.varids = [];
                selection.forEach((v, k) => {
                    _this.varids.push(v.ID);
                });
            }
        },
        delConfigs() {
            if (this.varids.length === 0) {
                this.$message.error("请选择要删除的任务配置");
                return;
            } else if (this.varids.length > 0) {
                this.$ajax.post(this.$SHEDULEURL + '/itctask/DeleteTaskConfig', this.$QS.stringify({
                    keys: this.varids
                })).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        });
                        this.loadITCTaskConfig();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        }

    }
}
</script>

<style lang="less" scoped>
// .box {
//     height: calc(100% - 0px);
// }
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

.paneltree {
    height: calc(100% - 37px);
    overflow-y: auto;
}

.btn {
    display: flex;
    flex-direction: row-reverse
}
</style>
