<template>
<el-row class="h100">
    <el-col :xs="24" :sm="3" class="h100 " style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>场景列表</span></div>
            <div style="float:right">
                <span @click="addScene" class="pointer"><i class="iconfont icon-jia"></i></span>
                <span class="pointer" @click="deleteScene" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>
                <span @click="editScene" class="pointer"><i class="iconfont icon-bianji"></i></span>
            </div>
        </div>
        <el-tree ref="tree" :expand-on-click-node="false" class="paneltree" node-key="key" :data="treedata" show-checkbox @check-change="handleCheckChange" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="24" :sm="21" class="h100 " style="border-right: 1px solid #122d62;padding:10px">
        <div class="btn">
            <el-button type="primary" @click="addGroups">添加</el-button>
            <el-button type="danger" @click="delGroupFromScene">删除</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" class="usertable" @select-all="selctTable" @select="selctTable">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="Name" label="控制组">
            </el-table-column>
            <!-- <el-table-column prop="Channel" label="通道">
            </el-table-column>
            <el-table-column prop="Controller" label="控制器">
            </el-table-column>
            <el-table-column prop="Variable" label="变量">
            </el-table-column>
            <el-table-column prop="WriteValue" label="写入值">
            </el-table-column> -->
            <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <el-pagination :page-size="size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
        </el-pagination>
    </el-col>
    <el-dialog title="场景编辑" :visible.sync="scenePanelDialog" :modal-append-to-body="false" width="400px">
        <el-form label-width="100px" label-position="left">
            <el-form-item label="场景名称" prop="sceneName">
                <el-input v-model="sceneName"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="saveScene">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="控制组选择" :visible.sync="groupPanelDialog" :modal-append-to-body="false" width="400px">
        <el-form label-width="100px" label-position="left">
            <el-form-item label="控制组">
                <el-select v-model="group" multiple clearable>
                    <el-option v-for="item in groups" :label="item.Name" :value="item.ID" :key="item.ID"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="addGrouptoScene">确 定</el-button>
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
    name: "scene",
    data() {
        return {
            scenePanelDialog: false,
            groupPanelDialog: false,
            sceneName: '',
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
            groups: [],
            group: ''
        }
    },
    mounted() {
        this.loadScene();
        this.loadSceneGroups();
        this.loadGroup();
    },
    methods: {
        loadScene() {
            new Tree().loadTreeNodes(this, '/scene/GetScene', "treedata", this.$SHEDULEURL)
        },
        loadGroup() {
            this.$ajax.get(this.$SHEDULEURL + '/group/GetAllGroup', {
                params: {
                    sceneid: [],
                    size: 0,
                    page: 0,
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.groups = result.data.data;
                } else {
                    this.total = 0
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        addScene() {
            if (this.$refs.tree.getCheckedNodes().length > 1) {
                this.$message.error("不能同时操作两个节点场景");
                return;
            }
            this.edit = false;
            this.sceneName = "";
            this.scenePanelDialog = true;
        },
        deleteScene() {
            if (this.$refs.tree.getCheckedNodes() === 0) {
                this.$message.error("请选择要删除的场景");
                return;
            }
            let scenes = [];
            this.$refs.tree.getCheckedNodes().forEach(v => {
                scenes.push(v.key);
            });
            this.$confirm('此操作将永久删除改场景, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.post(this.$SHEDULEURL + '/scene/DeleteScenes', this.$QS.stringify({
                    scenes: scenes
                })).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        });
                        new Tree().loadTreeNodes(this, '/scene/GetScene', "treedata", this.$SHEDULEURL)
                        this.loadSceneGroups();
                    }
                }).catch((err) => {
                    console.log(err);
                });
            });
        },
        editScene() {
            if (this.$refs.tree.getCheckedNodes().length === 0) {
                this.$message.error("请选择要编辑的控制组");
                return;
            } else if (this.$refs.tree.getCheckedNodes().length > 1) {
                this.$message.error("不能同时操作两个节点控制组");
                return;
            }
            this.edit = true;
            this.sceneName = this.$refs.tree.getCheckedNodes()[0].label;
            this.scenePanelDialog = true;
        },
        saveScene() {
            this.$ajax.get(this.$SHEDULEURL + '/scene/AddEditScene', {
                params: {
                    scenename: this.sceneName,
                    parentid: this.$refs.tree.getCheckedNodes().length > 0 ? this.$refs.tree.getCheckedNodes()[0].key : 0,
                    sceneid: !this.edit ? 0 : (this.$refs.tree.getCheckedNodes().length > 0 ? this.$refs.tree.getCheckedNodes()[0].key : 0)
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.scenePanelDialog = false;
                    new Tree().loadTreeNodes(this, '/scene/GetScene', "treedata", this.$SHEDULEURL);
                } else {
                    this.$message.error("操作失败！");
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        handleCheckChange() {
            this.loadSceneGroups();
        },
        handleCurrentChange(page) {
            this.currentPage = page;
            this.loadSceneGroups();
        },
        callback(prop, val, writevalue) {
            if (!writevalue) {
                writevalue = 0;
            }
            this.addGrouptoScene(val, writevalue);
            if (this.el) {
                document.getElementById("app").removeChild(this.el.$parent.$el);
                this.el = null;
            }
        },
        addGroups() {
            if (this.$refs.tree.getCheckedNodes().length === 0) {
                this.$message.error("请选择要操作的场景");
                return;
            } else if (this.$refs.tree.getCheckedNodes().length > 1) {
                this.$message.error("不能同时操作两个节点场景");
                return;
            }
            this.groupPanelDialog = true;
        },
        addGrouptoScene() {
            if (this.group.length === 0) {
                this.$message.error("请选择要加入的控制组");
                return;
            }
            this.$ajax.post(this.$SHEDULEURL + '/scene/AddGroupToScene', this.$QS.stringify({
                sceneid: this.$refs.tree.getCheckedNodes().length > 0 ? this.$refs.tree.getCheckedNodes()[0].key : 0,
                groups: this.group
            })).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.groupPanelDialog = false;
                    this.loadSceneGroups();
                } else {
                    this.$message.error("添加失败！");
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadSceneGroups() {
            let sceneids = [];
            this.$refs.tree.getCheckedNodes().forEach((v) => {
                sceneids.push(v.key ? v.key : 0);
            })
            this.$ajax.get(this.$SHEDULEURL + '/scene/GetSceneGroup', {
                params: {
                    sceneid: sceneids.length > 0 ? sceneids : [0],
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
                    _this.varids.push(v.SceneID + ':' + v.ID);
                });
            }
        },
        delGroupFromScene() {
            if (this.varids.length === 0) {
                this.$message.error("请选择要删除的控制组");
                return;
            } else if (this.varids.length > 0) {
                this.$confirm('此操作将永久删除改数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.post(this.$SHEDULEURL + '/scene/DeleteSceneGroup', this.$QS.stringify({
                        groups: this.varids,
                    })).then((result) => {
                        if (result.status === 200 && result.data.success) {
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });
                            this.loadSceneGroups();
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
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
