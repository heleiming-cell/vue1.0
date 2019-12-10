<template>
<div class="Container">
    <div class="project-management">
        <div class="left-box">
            <div class="top-btn">
                <div @click="handleAdd"><i class="el-icon-circle-plus-outline"></i></div>
                <div @click="handleEdit"><i class="el-icon-edit"></i></div>
                <div @click="handleDelete"><i class="el-icon-delete-solid"></i></div>
            </div>
            <el-tree ref="tree" :data="projectList" show-checkbox node-key="Id" :props="defaultProps" default-expand-all check-strictly @check-change="handleCheckChange">
            </el-tree>
        </div>
        <div class="right-box">
            <el-table :data="tableData"  @selection-change="handleSelectionChange" class="table-data">
                <el-table-column type="selection" width="80" align="center"></el-table-column>
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column label="人员姓名" prop="Name" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="add-new">
                <el-button type="danger" size="small" @click="handleDeleteUser">移除人员</el-button>
                <el-button type="primary" @click="handleAddUser()" size="small">添加人员</el-button>
            </div>
        </div>
    </div>
    <!-- 编辑项目 -->
    <el-dialog :title="projectTitle" :visible.sync="dialogVisible_addProject" width="600px">
        <el-form :model="dialogForm" label-width="120px" :rules="project_rules" ref="projectDialog">
            <el-form-item label="项目名称：" prop="projectName">
                <el-input v-model="dialogForm.projectName" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible_addProject = false">取 消</el-button>
            <el-button type="primary" @click="submitDialog">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 添加人员 -->
    <el-dialog title="添加人员" :visible.sync="dialogVisible_user" width="600px">
        <el-form :model="dialogUser" label-width="100px" ref="userDialog">
            <el-form-item label="选择人员：" prop="user">
                <el-select v-model="dialogUser.user" placeholder="请选择" @change="adduser">
                    <el-option v-for="item in canSelectUser" :key="item.ID" :label="item.Name" :value="item.Id">
                    </el-option>
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
    Project_QueryList,
    Project_DelProject,
    Project_AddOrUodate,
    Project_AddProjectUser,
    Project_DelProjectUser
} from '@/api/Project'
import {
    Public_GetAllCate,
    Public_CanBindUsers
} from '@/api/Public'
export default {
    data() {
        return {
            projectList: [],
            defaultProps: {
                children: 'ChildProjectItems',
                label: 'Name',
            },
            node: '',
            dialogVisible_addProject: false,
            projectTitle: '新增项目',
            dialogForm: {
                projectName: ''
            },
            project_rules: {
                projectName: [{
                        required: true,
                        message: '请输入项目名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 15,
                        message: '长度在 2 到 15 个字符',
                        trigger: 'blur'
                    }
                ]
            },
            operating: '',
            tableData: [],
            dialogVisible_user: false,
            dialogUser: {
                user: ''
            },
            canSelectUser: [],
            selectUser:[],
            selectDleteUser:[]
        }
    },
    mounted() {
        this.getProjectList();
        this.getProjectUserList()
    },
    methods: {
        getProjectList() {
            Project_QueryList().then(result => {
                this.projectList = result.Data.Data
            })
        },
        // 选择树时
        handleCheckChange(node, status) {
            if (status) {
                if (this.node && this.node != node) {
                    this.$refs.tree.setChecked(this.node, false);
                }
                this.node = node;
            } else if (this.node && this.node == node) {
                this.node = "";
            }
            this.getProjectUserList()
        },
        handleAdd() {
            this.operating = 'add';
            this.dialogVisible_addProject = true;
            this.dialogForm.projectName = '';
        },
        handleEdit() {
            if (this.node) {
                this.operating = 'modify'
                this.dialogVisible_addProject = true;
                this.dialogForm.projectName = this.node.Description;
            } else {
                this.$message.error("请选择要编辑的项目")
            }
        },
        // 删除项目
        handleDelete() {
            if (this.node) {
                this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Project_DelProject({
                        id: this.node.Id
                    }).then(result => {
                        this.getProjectList();
                        this.node = ''
                        this.$message.success("删除成功")
                    }).catch(error => {
                        this.$message.error(error)

                    })
                })
            } else {
                this.$message.error("请选择要删除的项目");
            }
        },
        // 提交项目表单
        submitDialog() {
            this.$refs.projectDialog.validate((valid) => {
                if (valid) {
                    let data = {}
                    if (this.operating == 'add') {
                        data = {
                            Description: '',
                            Id: '',
                            Pid: this.node != '' ? this.node.Id : '',
                            Name: this.dialogForm.projectName
                        }
                    } else {
                        data = {
                            Description: '',
                            Id: this.node.Id,
                            Pid: this.node.Pid,
                            Name: this.dialogForm.projectName
                        }
                    }
                    Project_AddOrUodate(data).then(result => {
                        this.getProjectList();
                        this.dialogVisible_addProject = false;
                        this.node = ''
                        this.$message.success('编辑成功');
                    })
                }
            })
        },
        handleClick(row) {

        },
        getProjectUserList() {
            let data = {
                Cate: 'teamUser',
                id: this.node != '' ? this.node.Id : ''
            }
            Public_GetAllCate(data).then(result => {
                this.tableData = result.Data
            })
        },
        handleAddUser() {
            if (this.node) {
                this.dialogVisible_user = true;
                Public_CanBindUsers({
                    id: this.node.Id
                }).then(result => {
                    this.canSelectUser = result.Data
                })
            } else {
                this.$message.error("请选择要添加的项目")
            }
        },
        adduser(id){
            if(this.selectUser.length==0||this.selectUser.find(tag=>tag.Id==id) == undefined){
               this.selectUser.push(this.canSelectUser.find(item=>item.Id==id));
            }
            this.dialogUser.user = ''
        },
        handleClose(id){
            this.selectUser.splice(this.selectUser.findIndex(item=>item.Id==id));
        },
        submitAddUser() {
            if(this.selectUser.length==0){
                this.$message.error("请添加人员")
            }else{
                let data =  {
                    Id:this.node.Id,
                    UserIds:this.selectUser.map(v => v.Id)
                }
                Project_AddProjectUser(data).then(result =>{
                    this.$message.success("添加成功");
                    this.getProjectUserList();
                    this.selectUser = [];
                    this.dialogVisible_user = false
                })
            }
        },
        handleSelectionChange(selection){
            this.selectDleteUser = selection;
        },
        handleDeleteUser(){
            if(this.selectDleteUser.length==0){
                this.$message.error("请选择要删除的人员")
            }else{
                this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() =>{
                    let data = {
                        Id:this.node.Id,
                        UserIds:this.selectDleteUser.map(v =>v.Id)
                    }
                    Project_DelProjectUser(data).then(result =>{
                        this.getProjectUserList();
                        this.selectDleteUser = []
                    })
                })
            }
        }

    }
}
</script>

<style lang="scss" scope>
.Container{
    font-size: 12px;
    height: calc(100% - 115px);
    padding: 5px;
}
.project-management {
    display: flex;
    justify-content: flex-start;
    height: 100%;
    .left-box,
    .right-box {
        // background: #051430;
        height: 100%;
    }

    .left-box {
        width: 300px;
        border-right: solid 1px #284477;
        border-top: solid 1px #284477;

        .top-btn {
            display: flex;
            justify-content: flex-start;

            div {
                flex: 1;
                height: 50px;
                line-height: 50px;

                i {
                    color: #175FD1;
                    font-size: 22px;
                    cursor: pointer;
                }
            }
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
    .el-tag{
        margin-right: 20px;
    }
}
</style>
<style lang="scss">
.project-management .el-tree {
    // background: #051430;
    // color: #4C80DE;

    .el-tree-node__content {
        height: 40px;
        line-height: 40px;
        padding-left: 15px;
    }

    .el-tree-node__content:hover {
        background-color: #032558 !important;
    }
   
}
</style>
