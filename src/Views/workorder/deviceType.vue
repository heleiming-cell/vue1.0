<template>
<div class="box">
    <div class="filter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="类型名称：">
                <el-input v-model="formInline.Name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData" class="table-data">
        <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
        <el-table-column label="类型名称" prop="Name" align="center"></el-table-column>
        <el-table-column label="项目名称" prop="ProjectName" align="center"></el-table-column>
        <el-table-column label="组名称" prop="TeamName" align="center"></el-table-column>
        <el-table-column label="模版名称" prop="TempletName" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleDelete(scope.row)" style="color:#F18573">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="add-new">
        <el-button type="primary" @click="handleAddType" size="small">新增类型</el-button>
    </div>
    <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="dialogTitle" v-if="dialogVisible" :visible.sync="dialogVisible" width="600px" @close="resetForm('dialogForm')">
        <el-form :model="dialog" label-width="120px" ref="dialogForm" :rules="dialogRules" >
            <el-form-item label="类型名称：" prop="Name">
                <el-input v-model="dialog.Name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="类型编码：" prop="Code">
                <el-input v-model="dialog.Code" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="选择项目：" prop="ProjectId">
                <Project cate="project" :value="dialog.ProjectId" @change="selectProject" />
            </el-form-item>
            <el-form-item label="选择项目组：" prop="TeamId">
                <Team cate="team" :value="dialog.TeamId" :projectId="dialog.ProjectId" @change="selectTeam" />
            </el-form-item>
            <el-form-item label="选择模版：">
                <Templet :value="dialog.TempletId" @change="selectTemplet" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitDialog">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import pagiNation from '@/components/common/pagination'
import Team from '@/components/filter/Team'
import Project from '@/components/filter/Project'
import Templet from '@/components/filter/Templet'
import {
    DeviceCategory_QueryList,
    DeviceCategory_Del,
    DeviceCategory_AddOrUpdate
} from '@/api/DeviceCategory'
export default {
    components: {
        pagiNation,
        Project,
        Team,
        Templet
    },
    data() {
        return {
            formInline: {
                Name: ''
            },
            tableData: [],
            listQuery: {
                page: 1,
                limit: 10,
                total: 0
            },
            dialogTitle: '新增类型',
            dialogVisible: false,
            dialog: {
                Id: '',
                Name: '',
                Code: '',
                ProjectId: '',
                TeamId: '',
                TempletId: ''
            },
            projectList: [],
            projectGroupList: [],
            templetList: [],
            dialogRules: {
                Name: [{
                        required: true,
                        message: '请输入类型名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 15,
                        message: '长度在 2 到 15 个字符',
                        trigger: 'blur'
                    }
                ],
                Code: [{
                        required: true,
                        message: '请输入类型编号',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 15,
                        message: '长度在 2 到 15 个字符',
                        trigger: 'blur'
                    }
                ],
                ProjectId: [{
                    required: true,
                    message: '请选择所属项目',
                    trigger: 'change'
                }],
                TeamId: [{
                    required: true,
                    message: '请选择所属项目组',
                    trigger: 'change'
                }],
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            let data = {
                Page: this.listQuery.page,
                Size: this.listQuery.limit,
                Conditions: [{
                    key: 'Name',
                    Operator: 1,
                    Value: this.formInline.Name
                }]
            }
            DeviceCategory_QueryList(data).then(result => {
                this.tableData = result.Data.Data;
                this.listQuery.total = result.Data.Count
            })
        },
        handleEdit(row) {
            this.dialogVisible = true;
            this.dialog = JSON.parse(JSON.stringify(row))
        },
        handleDelete(row) {
            this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                DeviceCategory_Del({id:row.Id}).then(result =>{
                    this.getList()
                })
            })
        },
        handleAddType() {
            this.dialogVisible = true;
            this.dialog = {
                Id: '',
                Name: '',
                Code: '',
                ProjectId: '',
                TeamId: '',
                TempletId: ''
            }
        },
        selectProject(value) {
            this.dialog.ProjectId = value;
            this.dialog.TeamId = ''
        },
        selectTeam(value) {
            this.dialog.TeamId = value
        },
        selectTemplet(value) {
            this.dialog.TempletId = value
        },
        submitDialog() {
            this.$refs.dialogForm.validate((valid) => {
                if (valid) {
                    let data = {
                        Id:this.dialog.Id,
                        Code: this.dialog.Code,
                        Name:this.dialog.Name,
                        ProjectId:this.dialog.ProjectId,
                        TeamId:this.dialog.TeamId,
                        TempletId:this.dialog.TempletId
                    }
                    DeviceCategory_AddOrUpdate(data).then(result =>{
                        this.getList();
                        this.dialogVisible = false;
                        this.$message.success("编辑成功")
                    })
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>

<style lang="scss" scope>
.filter {
    text-align: left;
    padding: 10px;
}

.add-new {
    text-align: right;

    >button {
        margin-top: 10px;
        margin-right: 10px;
    }
}
</style>


