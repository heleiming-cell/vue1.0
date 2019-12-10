<template>
<div class="box">
    <div class="user-management">
        <div class="left-box">
            <p v-for="(item,index) in positionList" :key="index" @click="clickPosition(item)" :class="{'active' : activePosition==item.Id}">{{item.Name}}</p>
        </div>
        <div class="right-box">
            <el-table :data="tableData" @selection-change="handleSelectionChange" class="table-data">
                <el-table-column type="selection" align="center" width="80"></el-table-column>
                <el-table-column label="序号" type="index" align="center"></el-table-column>
                <el-table-column label="人员姓名" prop="Name" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="add-new">
                <el-button type="danger" size="small" @click="handleDelete(null)">移除人员</el-button>
                <el-button type="primary" @click="handleAdd" size="small">添加人员</el-button>
            </div>
        </div>
    </div>
    <el-dialog title="添加人员" :visible.sync="dialogVisible" width="600px">
        <el-form :model="dialogUser" label-width="100px" ref="userDialog">
            <el-form-item label="选择人员：" prop="user">
                <el-select v-model="dialogUser.user" placeholder="请选择" @change="adduser">
                    <el-option v-for="item in userList" :key="item.ID" :label="item.Name" :value="item.Id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="select-user-box">
            <el-tag :key="tag.Id" v-for="tag in selectUser" closable :disable-transitions="false" @close="handleClose(tag.Id)">
                {{tag.Name}}
            </el-tag>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible_user = false">取 消</el-button>
            <el-button type="primary" @click="submitAddUser">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    Public_GetAllCate,
    Public_AddRoleUser,
    Public_DelRoleUser
} from '@/api/Public'
export default {
    data() {
        return {
            positionList: [],
            activePosition: -1,
            tableData: [],
            selectPosition: '',
            dialogVisible: false,
            userList: [],
            selectUser: [],
            dialogUser: {
                user: ''
            }
        }
    },
    mounted() {
        this.getPositionList();
    },
    methods: {
        getPositionList() {
            Public_GetAllCate({
                cate: 'role'
            }).then(result => {
                this.positionList = result.Data
            })
        },
        clickPosition(data) {
            this.activePosition = data.Id;
            this.selectPosition = data;
            this.getPositionBindUser()
        },
        // 获取
        getPositionBindUser() {
            Public_GetAllCate({
                cate: 'roleUser',
                id: this.selectPosition.Id
            }).then(result => {
                this.tableData = result.Data
            })
        },
        handleDelete(row) {
            this.$confirm('是否确认移除用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {}
                if (row) {
                    data = {
                        RoleId: this.selectPosition.Id,
                        UserIds: [row.Id]
                    }
                } else {
                    data = {
                        RoleId: this.selectPosition.Id,
                        UserIds: this.selectDeleteUser.map(v =>v.Id)
                        
                    }
                }
                Public_DelRoleUser(data).then(result => {
                    this.getPositionBindUser();
                    this.selectDeleteUser = []
                })
            })
        },
        handleAdd() {
            if (this.selectPosition) {
                this.dialogVisible = true;
                Public_GetAllCate({
                    cate: 'user'
                }).then(result => {
                    this.userList = result.Data
                })
            } else {
                this.$message.error("请选择职位")
            }
        },
        adduser(id) {
            if (this.selectUser.length == 0 || this.selectUser.find(tag => tag.Id == id) == undefined) {
                this.selectUser.push(this.userList.find(item => item.Id == id));
            }
            this.dialogUser.user = ''
        },
        handleClose(id) {
            this.selectUser.splice(this.selectUser.findIndex(item => item.Id == id),1);
        },
        submitAddUser() {
            let data = {
                RoleId: this.selectPosition.Id,
                UserIds: this.selectUser.map(v => v.Id)
            }
            Public_AddRoleUser(data).then(result => {
                this.getPositionBindUser();
                this.dialogVisible = false;
                this.selectUser = [];
                this.$message.success("添加成功")
            })
        },
        handleSelectionChange(selection) {
            this.selectDeleteUser = selection;

            console.log(this.selectDeleteUser.map(v =>v.Id))
        }

    }
}
</script>

<style lang="scss" scope>
.user-management {
    display: flex;
    justify-content: flex-start;
    height: 100%;
    .left-box,
    .right-box {
        // background: #051430;
        height: 100%
    }

    .left-box {
        width: 300px;
        border-right: solid 1px #284477;
        border-top: solid 1px #284477;
        padding: 5px;

        p {
            width: 100%;
            height: 40px;
            line-height: 40px;
            // background: #032558;
            color: #4C80DE;
            cursor: pointer;
        }

        .active {
            background: #032558;
            color: #fff;
        }
    }

    .right-box {
        width: calc(100% - 301px);

        .add-new {
            text-align: right;

            >button {
                margin-top: 10px;
                margin-right: 10px;
            }
        }
    }
}

.select-user-box {
    width: 480px;
    height: 200px;
    background: #051430;
    border: solid 1px #376BCB;
    text-align: left;
    padding: 20px;

    .el-tag {
        margin-right: 20px;
    }
}
</style>
