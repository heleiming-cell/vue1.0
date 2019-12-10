<template>
<el-row class="systemarea h100">
    <el-col :xs="12" :sm="3" class="h100" style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>部门列表</span></div>
            <div style="float:right">
                <span @click="addDept" class="cursor"><i class="el-icon-plus"></i></span>
                <span @click="deleteDept" class="cursor" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>
                <span @click="editDept" class="cursor" style="margin:0 5px"><i class="el-icon-edit-outline"></i></span>
            </div>
        </div>
        <el-tree ref="tree" default-expand-all @check-change="loadDeptUsers" show-checkbox node-key="key" check-strictly :data="data" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="12" :sm="21" class="h100" style="border-right: 1px solid #122d62">
        <div class="searchTable">
            <el-button type="primary" @click="addUsers">添加用户</el-button>
            <el-button type="danger" @click="deleteUsers">删除用户</el-button>
        </div>
        <el-table height="calc(100% - 100px)" :data="tableData" style="width: 100%" class="usertable"  @select-all="select" @select="select">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="DeptName" label="部门">
            </el-table-column>
            <el-table-column prop="UserName" label="用户名">
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination background @current-change="handleCurrentChange" :current-page="currentPage" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </el-col>
    <!-- 添加/编辑部门 -->
    <el-dialog :visible.sync="deptDialog" :title="titleMap[dialogStatus]" :modal-append-to-body="false" width="400px" top="100px">
        <el-form label-width="100px" label-position="right" :model="Department">
            <el-form-item label="部门名称">
                <el-input v-model="Department.Name" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="部门描述">
                <el-input v-model="Department.Description"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
            <el-button type="primary" @click="saveDept" style="background-color: #1e639e;border: none">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="添加用户" :visible.sync="userVisible" :modal-append-to-body="false" width="663px" top="100px">
        <el-form label-width="100px" label-position="right" class="demo-ruleForm">
            <el-form-item label="用户选择">
                <el-select v-model="users" clearable="true" filterable="true" multiple style="width:100%">
                    <el-option v-for="item in Users" :key="item.UserId" :label="item.UserName" :value="item.UserId"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" size="default" @click="userVisible = false">关闭</el-button>
            <el-button type="determine" @click="addUserToDept">确定</el-button>
        </div>
    </el-dialog>
</el-row>
</template>

<script>
// import {
//     Tree
// } from '@/lib/common.js'
// import Variable from '@/components/common/variablebind/src/'
export default {
    name: 'Department',
    mounted() {
        this.loadDepts();
        this.loadUsers();
        this.loadDeptUsers();
    },
    data() {
        return {
            data: null,
            deptDialog: false,
            userVisible: false,
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            Department: {
                Name: '',
                OrderNo: '',
                Description: '',
                Code: '',
                ParentID: 0,
                ID: 0,
            },
            Users: [],
            users: [],
            tableData: [],
            currentPage: 1,
            size: 10,
            total: 0,
            deleteUser: [],
            titleMap: {
                create: "添加部门",
                update: "编辑部门"
            },
            dialogStatus: ""
        }
    },
    methods: {
        loadUsers() {
            this.$ajax.get(this.$URL+'/account/GetUsers').then((result) => {
                if (result.data.success) {
                    this.Users = result.data.data;
                }
            })
        },
        loadDepts() {
            this.$ajax.get(this.$URL+'/department/LoadDeparts').then((result) => {
                if (result.data.success) {
                    this.data = result.data.data;
                }
            })
        },
        saveDept() {
            var node = this.$refs.tree.getCheckedNodes();
            this.$ajax.post(this.$URL+'/department/SaveDepartment', this.Department, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((result) => {
                if (result.data.success) {
                    this.deptDialog = false;
                    this.loadDepts();
                }
            })
        },
        addDept() {
            this.dialogStatus = "create";
            var node = this.$refs.tree.getCheckedNodes();
            if (node.length > 1) {
                this.deptDialog = false;
                this.$message.error("不能在多个节点下添加部门");
                return;
            } else {
                this.deptDialog = true;
            }

            this.Department = {
                Name: "",
                OrderNo: "",
                Description: "",
                Code: "",
                ParentID: node.length === 1 ? node[0].key : 0
            };
        },
        deleteDept() {
            var node = this.$refs.tree.getCheckedNodes();
            if (node.length === 0) {
                this.$message.error("请选择要删除的部门");
                return;
            }
            let code = [];
            node.forEach(v => {
                code.push(v.Code);
            });
            this.$ajax.post(this.$URL+'/department/DeleteDepartments', code, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((result) => {
                if (result.data.success) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.loadDepts();
                }
            })

        },
        editDept() {
            this.dialogStatus = "update";
            var node = this.$refs.tree.getCheckedNodes();
            if (node.length === 0) {
                this.$message.error("请选择要编辑的部门");
                return;
            } else if (node.length > 1) {
                this.$message.error("不能同时编辑多个部门");
                return;
            }
            this.deptDialog = true;
            this.Department.ID = node[0].key;
            this.Department.Name = node[0].label;
            this.Department.OrderNo = node[0].OrderNo;
            this.Department.ParentID = node[0].ParentID;
            this.Department.Description = node[0].Description;
            this.Department.Code = node[0].Code;
        },
        handleCurrentChange() {
            this.loadDeptUsers();
        },
        addUsers() {
            var node = this.$refs.tree.getCheckedNodes();
            if (node.length === 0) {
                this.$message.error("请选择要操作的部门");
                return;
            }
            this.userVisible = true;
        },
        deleteUsers() {
            if (this.deleteUser.length === 0) {
                this.$message.error("请选择要删除的用户");
                return;
            } else if (this.deleteUser.length > 0) {
                this.$ajax.get(this.$URL+'/department/DeleteDeptUsers', {
                    params: {
                        ids: this.deleteUser
                    }
                }).then((result) => {
                    if (result.data.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                        });
                        this.loadDeptUsers();
                    } else if (!result.data.success) {
                        this.$message.error("删除失败");
                    }
                })
            }
        },
        addUserToDept() {
            var node = this.$refs.tree.getCheckedNodes();
            if (this.users.length == 0) {
                this.$message.error("请选择要添加的用户再保存");
                return;
            } else if (this.users.length > 0) {
                let roles = [];
                node.forEach(v => {
                    roles.push(v.key);
                });
                this.$ajax.post(this.$URL+'/department/SlotDept', {
                    userids: this.users,
                    deptids: roles
                }).then((result) => {
                    if (result.data.success) {
                        this.$message({
                            message: '分配成功',
                            type: 'success',
                        });
                        this.userVisible = false;
                        this.loadDeptUsers();
                    } else if (!result.data.success) {
                        this.$message.error("分配失败");
                    }
                })
            }
        },
        loadDeptUsers() {
            var node = this.$refs.tree.getCheckedNodes();
            let roles = [];
            if (node.length > 0) {
                node.forEach(v => {
                    roles.push(v.key)
                });
            }
            this.$ajax.get(this.$URL+'/department/LoadDeptUsers', {
                params: {
                    ids: JSON.stringify(roles),
                    size: this.size,
                    page: this.currentPage
                }
            }).then((result) => {
                if (result.data.success) {

                    this.tableData = result.data.data;
                    this.total = result.data.count;
                }
            })
        },
        select(ids) {
            let _this = this;
            if (ids.length === 0) {
                this.deleteUser = [];
            } else if (ids.length > 0) {
                this.deleteUser = [];
                ids.forEach(v => {
                    _this.deleteUser.push(v.DeptID + "|" + v.UserId);
                });
            }
        },
    }

}
</script>

<style lang="less" scoped>
.systemarea {
    .el-tree {
        height: calc(100% - 36px);
        background-color: transparent;
        overflow-y: auto;
    }
}

.menuheader {
    line-height: 36px;
    vertical-align: middle;
    padding: 0 10px;
    overflow: hidden;
    background: #010308;

}

.searchTable {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-sizing: content-box;

}
</style>
