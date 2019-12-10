<template>
<div class="h100">
    <div class="filter">
        <div class="filter_line">
            <el-input placeholder="支持 角色名称 查询" v-model="username"></el-input>
        </div>
        <div class="filter_line">
            <button class="search" @click="search"> 查询</button>
            <button class="search" @click="roleAdd" style="width: 114px;background-color: RGBA(30, 99, 158, 1);position: absolute;top: 50%;right: 154px;transform: translate(0,-50%)">新增角色</button>
            <button @click="roleDelete" style="width: 114px;background-color: RGBA(30, 144, 158, 1);position: absolute;top: 50%;right: 20px;transform: translate(0,-50%)" class="a-upload mr10 search hidden-md-and-down">删除</button>
        </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="usertable" @select-all="selectionAll" @select="selectone">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="RoleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="Description" label="描述">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
        </el-table-column>
    </el-table>
    <el-pagination :page-size="10" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <!-- <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination> -->
    <el-dialog title="角色操作" :visible.sync="roleAddVisible" :modal-append-to-body="false" width="663px" top="100px">
        <el-form label-width="100px" label-position="right" class="demo-ruleForm">
            <el-form-item label="角色名称">
                <el-input v-model="Role.RoleName" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
                <el-input v-model="Role.Description"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
            <el-button type="primary" @click="dialog_submit" style="background-color: #1e639e;border: none">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
// import gh_table from '../../components/table'
import pagination from '@/components/common/pagination'
// import User from '../../lib/user'
export default {
    name: "userManager",
    components: {
        // 'gh_table': gh_table,
        'pagination': pagination,
    },
    data() {
        return {
            username: '',
            user_list: [],
            tableData: [],
            total: 0,
            currentPage: 1,
            roleAddVisible: false,
            Role: {
                RoleId: 0,
                RoleName: '',
                Description: ''
            },
            deleteRoles: [],
        }
    },
    mounted() {
        this.loadAllRoles();
    },
    methods: {
        selectionAll(selection) {
            if (selection.length > 0) {
                let id = [];
                selection.forEach((v, k) => {
                    id.push(v.RoleId);
                });
                this.deleteRoles = id;
            } else if (selection.length === 0) {
                this.deleteRoles = [];
            }
        },
        selectone(selection) {
            if (selection.length === 0) {
                this.deleteRoles = [];
            } else if (selection.length > 0) {
                let id = [];
                selection.forEach((v, k) => {
                    id.push(v.RoleId);
                });
                this.deleteRoles = id;
            }

        },
        search() {
            this.loadAllRoles();
        },
        roleAdd() {
            this.roleAddVisible = true;
            this.Role = {
                RoleId: 0,
                RoleName: '',
                Description: ''
            };
        },
        roleDelete() {
            if (this.deleteRoles.length === 0) {
                this.$message.error("请选择要删除的用户");
                return;
            }
            this.$confirm('此操作将永久删除改数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get(this.$URL + '/account/DeleteRole', {
                    params: {
                        ids: this.deleteRoles
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.loadAllRoles();
                    } else if (!result.data.success) {
                        this.$message.error("删除失败");
                    }
                }).catch((err) => {
                    console.log(err);
                });
            });
        },
        loadAllRoles() {
            this.$ajax.get(this.$URL + '/account/GetRolesInfo', {
                params: {
                    roleName: this.username,
                    page: this.currentPage,
                    size: 10
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {

                    this.tableData = result.data.data;
                    this.total = result.data.count;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        onSelect(v) {
            console.log(v);
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val
            this.loadAllRoles();
        },
        dialog_submit() {
            this.$ajax.post(this.$URL + '/account/AddRole', JSON.stringify(this.Role), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: result.data.Message
                    });
                    this.roleAddVisible = false;
                    this.loadAllRoles();
                } else if (!result.data.success) {
                    this.$message.error(result.data.Message);
                }
            }).catch((err) => {
                this.$message.error(result.data.Message);
            });
        },
        handleEdit(i, data) {
            this.roleAddVisible = true;
            if (data) {
                this.Role = data;
            }
        }
    }
}
</script>

<style lang="less" scoped>
.h100 {
    height: 100%;
    position: relative;
}

table {
    height: 100% !important;
}

.dialog-line {
    height: 37px;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;

}

.dialog-line span {
    color: white;
    margin-right: 10px;
}

.dialog-line div span {
    color: white;
    margin-right: 10px;
}

.list-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;

    button.export {
        /*position: absolute;*/
        /*bottom: -69px;*/
        /*right: 0;*/
        background-color: #1f4083;
        border-radius: 5px;
        color: white;
        outline: none;
        border: none;
        cursor: pointer;
        margin-left: 0.25rem;
        height: 0.4rem;
        width: 1rem;
    }
}

.list-pagination {
    padding-top: 20px;
    text-align: center;

}

.dialog-box {
    display: flex;
    flex-wrap: wrap;
    max-height: 500px;
    overflow-y: scroll;
}

.active {
    color: green;
}

.inactive {
    color: red;
}
</style>
