<template>
<div class="h100">
    <div class="filter">
        <div class="filter_line">
            <el-input placeholder="支持 用户名 查询" v-model="username"></el-input>
        </div>
        <div class="filter_line">
            <button class="search" @click="search"> 查询</button>
            <!-- <button class="search" @click="test"> test</button> -->
            <button class="search" @click="userAdd" style="width: 114px;background-color: RGBA(30, 99, 158, 1);position: absolute;top: 50%;right: 287px;transform: translate(0,-50%)">新增用户</button>
            <button class="search" @click="slotRole" style="width: 114px;background-color: green;position: absolute;top: 50%;right: 154px;transform: translate(0,-50%)">分配角色</button>
            <button @click="userDelete" style="width: 114px;background-color: RGBA(30, 144, 158, 1);position: absolute;top: 50%;right: 20px;transform: translate(0,-50%)" class="a-upload mr10 search hidden-md-and-down">删除</button>
        </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="usertable" @select-all="selectionAll" @select="selectone">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="UserName" label="登录名">
        </el-table-column>
        <el-table-column prop="Name" label="姓名">
        </el-table-column>
        <el-table-column prop="RoleName" label="所属角色">
        </el-table-column>
        <el-table-column prop="PhoneNumber" label="手机号码">
        </el-table-column>
        <el-table-column prop="Status" label="状态">
            <template slot-scope="scope">
                <p :class="scope.row.Status=='1'?'active':'inactive'">{{ scope.row.Status=="1"?"正常":"停用" }}</p>
            </template>
        </el-table-column>
        <el-table-column prop="ReadLevel" label="读操作级别">
        </el-table-column>
        <el-table-column prop="WriteLevel" label="写操作级别">
        </el-table-column>
        <el-table-column prop="CreateDate" label="创建时间">
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
    <el-dialog title="用户操作" :visible.sync="userAddVisible" :modal-append-to-body="false" width="663px" top="100px">
        <el-form label-width="100px" label-position="right" class="demo-ruleForm">
            <el-form-item label="登录名称">
                <el-input v-model="User.UserName" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="用户姓名">
                <el-input v-model="User.Name"></el-input>
            </el-form-item>
            <el-form-item label="Email">
                <el-input v-model="User.Email"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="User.PhoneNumber"></el-input>
            </el-form-item>
            <!-- <el-form-item label="部门">
                <el-cascader v-model="User.DeptId" :props="defaultProps" :options="depts" @change="handleChange" style="width:100%"></el-cascader>
            </el-form-item> -->
            <el-form-item label="读操作级别">
                <el-input v-model="User.ReadLevel"></el-input>
            </el-form-item>
            <el-form-item label="写操作级别">
                <el-input v-model="User.WriteLevel"></el-input>
            </el-form-item>
            <el-form-item label="微信号">
                <el-input v-model="User.WeiXin"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch active-value="1" inactive-value="0" v-model="User.Status" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
            <el-button type="primary" @click="dialog_submit" style="background-color: #1e639e;border: none">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="角色分配" :visible.sync="roleVisible" :modal-append-to-body="false" width="400px" top="100px">
        <el-form label-width="100px" label-position="right" class="demo-ruleForm">
            <el-form-item label="角色选择">
                <el-select v-model="role">
                    <el-option v-for="item in roleData" :key="item.RoleId" :label="item.RoleName" :value="item.RoleId"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
            <el-button type="primary" @click="role_submit" style="background-color: #1e639e;border: none">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import gh_table from '@/components/common/table'
import pagination from '@/components/common/pagination'
import {
    User
} from '@/lib/configParmas'
import AllCateTree from '@/components/filter/AllCateTree'
import {
    panels,
    openModal
} from '@/components/common/modal/panelModal.js'

export default {
    name: "userManager",
    components: {
        'gh_table': gh_table,
        'pagination': pagination,
        AllCateTree
    },
    data() {
        return {
            username: '',
            user_list: [],
            tableData: [],
            total: 0,
            currentPage: 1,
            userAddVisible: false,
            User: new User(),
            deleteUsers: [],
            role: "",
            roleVisible: false,
            roleData: [],
            depts: [],
            defaultProps: {
                label: "Name",
                value: "Id",
            }
        }
    },
    mounted() {
        this.loadAllUsers();
        this.AllCateTree();
    },
    methods: {
        AllCateTree() {
            this.$ajax.get(this.$DMURL + '/User/AllCateTree', {
                params: {
                    key: 'department'
                }
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.depts = result.data.data;
                }
            });
        },
        selectionAll(selection) {
            if (selection.length > 0) {
                let id = [];
                selection.forEach((v, k) => {
                    id.push(v.UserId);
                });
                this.deleteUsers = id;
            } else if (selection.length === 0) {
                this.deleteUsers = [];
            }
        },
        selectone(selection) {
            if (selection.length === 0) {
                this.deleteUsers = [];
            } else if (selection.length > 0) {
                let id = [];
                selection.forEach((v, k) => {
                    id.push(v.UserId);
                });
                this.deleteUsers = id;
            }

        },
        search() {
            this.loadAllUsers();
        },
        userAdd() {
            this.userAddVisible = true;
            this.User = new User();
        },
        userDelete() {
            if (this.deleteUsers.length === 0) {
                this.$message.error("请选择要删除的用户");
                return;
            }
            this.$confirm('此操作将永久删除改用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get(this.$URL + '/account/DeleteUser', {
                    params: {
                        ids: this.deleteUsers
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            type: 'success',
                            message: "删除成功"
                        });
                        this.loadAllUsers();
                    } else if (!result.data.success) {
                        this.$message.error("删除失败");
                    }
                }).catch((err) => {
                    console.log(err);
                });
            });

        },
        loadAllUsers() {
            this.$ajax.get(this.$URL + '/account/GetUserInfo', {
                params: {
                    username: this.username,
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
            this.loadAllUsers();
        },
        dialog_submit() {
            this.$ajax.post(this.$URL + '/account/RegisterUser', JSON.stringify(this.User), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: result.data.Message
                    });
                    this.userAddVisible = false;
                    this.loadAllUsers();
                } else if (!result.data.success) {
                    this.$message.error(result.data.Message);
                }
            }).catch((err) => {
                this.$message.error(result.data.Message);
            });
        },
        handleEdit(i, data) {
            this.userAddVisible = true;
            if (data) {
                this.User = data;
            }

        },
        slotRole() {
            if (this.deleteUsers.length === 0) {
                this.$message.error("请选择要操作的用户");
                return;
            }
            this.roleVisible = true;
            this.$ajax.get(this.$URL + '/account/GetSelectRole').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.roleData = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        role_submit() {
            if (!this.role) {
                this.$message.error("请选择要分配的角色");
                return;
            }
            this.$ajax.get(this.$URL + '/account/SlotRole', {
                params: {
                    userIds: this.deleteUsers,
                    roleId: this.role
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        message: '分配成功',
                        type: 'success',
                    });
                    this.roleVisible = false;
                    this.loadAllUsers();
                } else if (!result.data.success) {
                    this.$message.error("分配失败");
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        handleChange(val) {
            this.User.DeptId = val[val.length - 1]
        },

        test() {
            openModal({
                type: 'device',
                data_id: '123',
                el_card_style: 'position:fixed;top:100px;left:calc(50% - 350px);z-index:3000'
            }, this);

        },
    
    }
}
</script>

<style lang="less" scoped>
// .h100 {
//     height: 100%;
//     position: relative;
// }

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
