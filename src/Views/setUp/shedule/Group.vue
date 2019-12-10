<template>
<el-row class="h100">
    <el-col :xs="24" :sm="3" class="h100 " style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>控制组</span></div>
            <div style="float:right">
                <span @click="addGroup" class="pointer"><i class="iconfont icon-jia"></i></span>
                <span class="pointer" @click="deleteGroup" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>
                <span @click="editGroup" class="pointer"><i class="iconfont icon-bianji"></i></span>
            </div>
        </div>
        <el-tree ref="tree" :expand-on-click-node="false" class="paneltree" node-key="key" :data="treedata" show-checkbox @check-change="handleCheckChange" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="24" :sm="21" class="h100 " style="border-right: 1px solid #122d62;padding:10px">
        <div class="btn">
            <el-button type="primary" @click="addVariables">添加</el-button>
            <el-button type="danger" @click="delVarFromGroup">删除</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" class="usertable" @select-all="selctTable" @select="selctTable">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="IOServer" label="IO服务器">
            </el-table-column>
            <el-table-column prop="Channel" label="通道">
            </el-table-column>
            <el-table-column prop="Controller" label="控制器">
            </el-table-column>
            <el-table-column prop="Variable" label="变量">
            </el-table-column>
            <el-table-column prop="WriteValue" label="写入值">
            </el-table-column>
            <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <el-pagination :page-size="size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
        </el-pagination>
    </el-col>
    <el-dialog title="控制组编辑" :visible.sync="groupPanelDialog" :modal-append-to-body="false" width="400px">
        <el-form label-width="100px" label-position="left">
            <el-form-item label="控制组名称" prop="groupName">
                <el-input v-model="groupName"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="saveGroup">确 定</el-button>
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
    name: "controlGroup",
    data() {
        return {
            groupPanelDialog: false,
            groupName: '',
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
            varids: []
        }
    },
    mounted() {
        this.loadGroup();
        this.loadGroupVars();
    },
    methods: {
        loadGroup() {
            new Tree().loadTreeNodes(this, '/group/GetGroup', "treedata", this.$SHEDULEURL)
        },
        addGroup() {
            if (this.$refs.tree.getCheckedNodes().length > 1) {
                this.$message.error("不能同时操作两个节点控制组");
                return;
            }
            this.edit = false;
            this.groupName = "";
            this.groupPanelDialog = true;
        },
        deleteGroup() {
            if (this.$refs.tree.getCheckedNodes() === 0) {
                this.$message.error("请选择要删除的控制组");
                return;
            }
            let groups = [];
            this.$refs.tree.getCheckedNodes().forEach(v => {
                groups.push(v.key);
            });
            this.$confirm('此操作将永久删除改控制组, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.post(this.$SHEDULEURL + '/group/DeleteGroups', this.$QS.stringify({
                    groups: groups
                })).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        });
                        new Tree().loadTreeNodes(this, '/group/GetGroup', "treedata", this.$SHEDULEURL);
                        this.loadGroupVars();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            });

        },
        editGroup() {
            if (this.$refs.tree.getCheckedNodes().length === 0) {
                this.$message.error("请选择要编辑的控制组");
                return;
            } else if (this.$refs.tree.getCheckedNodes().length > 1) {
                this.$message.error("不能同时操作两个节点控制组");
                return;
            }
            this.edit = true;
            this.groupName = this.$refs.tree.getCheckedNodes()[0].label;
            this.groupPanelDialog = true;
        },
        saveGroup() {
            this.$ajax.get(this.$SHEDULEURL + '/group/AddEditGroup', {
                params: {
                    groupName: this.groupName,
                    parentId: this.$refs.tree.getCheckedNodes().length > 0 ? this.$refs.tree.getCheckedNodes()[0].key : 0,
                    groupId: !this.edit ? 0 : (this.$refs.tree.getCheckedNodes().length > 0 ? this.$refs.tree.getCheckedNodes()[0].key : 0)
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.groupPanelDialog = false;
                    new Tree().loadTreeNodes(this, '/group/GetGroup', "treedata", this.$SHEDULEURL);
                } else {
                    this.$message.error("操作失败！");
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        handleCheckChange() {
            this.loadGroupVars();
        },
        handleCurrentChange(page) {
            this.currentPage = page;
            this.loadGroupVars();
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
        addVariables() {
            if (this.$refs.tree.getCheckedNodes().length === 0) {
                this.$message.error("请选择要操作的控制组");
                return;
            } else if (this.$refs.tree.getCheckedNodes().length > 1) {
                this.$message.error("不能同时操作两个节点控制组");
                return;
            }
            this.el = Variable.newInstance().diagram;
            this.el.open(this.callback, '', '', true);
        },
        addVtoGroup(vars, writevalue) {
            this.$ajax.post(this.$SHEDULEURL + '/group/AddVToGroup', this.$QS.stringify({
                writevalue: writevalue,
                groupid: this.$refs.tree.getCheckedNodes().length > 0 ? this.$refs.tree.getCheckedNodes()[0].key : 0,
                vars: [vars]
            })).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.loadGroupVars();
                } else {
                    this.$message.error("添加失败！");
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadGroupVars() {
            let groupids = [];
            this.$refs.tree.getCheckedNodes().forEach((v) => {
                groupids.push(v.key ? v.key : 0);
            })
            this.$ajax.get(this.$SHEDULEURL + '/group/GetGroupVars', {
                params: {
                    groupid: groupids.length > 0 ? groupids : [0],
                    size: this.size,
                    page: this.currentPage,
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.tableData = result.data.data;
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
                    _this.varids.push(v.CtrlGroupID + ':' + v.ID);
                });
            }
        },
        delVarFromGroup() {
            if (this.varids.length === 0) {
                this.$message.error("请选择要删除的变量");
                return;
            } else if (this.varids.length > 0) {
                this.$ajax.post(this.$SHEDULEURL + '/group/DeleteGroupVars', this.$QS.stringify({
                    vars: this.varids
                })).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        });
                        this.loadGroupVars();
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
