<template>
<div class="inspection-container">
    <div class="filter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="标准名称">
                <el-input v-model="formInline.Name" placeholder="标准名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="标准类型">
                <Project :value="formInline.TypeId" :cate="'standardtype'" @change="changeTypeId" />
            </el-form-item>
            <el-form-item label="项目">
                <Project :value="ProjectId" :cate="'project'" @change="changeProjectId" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" max-height="calc(100% - 200px)">
        <el-table-column prop="Code" label="标准编号" align="center"> </el-table-column>
        <el-table-column prop="Name" label="标准名称" align="center">
        </el-table-column>
        <el-table-column prop="TypeName" label="标准类型" align="center">
        </el-table-column>
        <el-table-column prop="CreaterName" label="创建人" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="editData(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="removeData(scope.row)" style="color:#E98E8E">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="add-new">
        <el-button type="primary" @click="editData('new')" size="small">新建标准</el-button>
    </div>
    <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 新建、编辑标准 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" v-if="dialogVisible">
        <el-form :model="dialogForm" :label-width="'120px'">
            <el-form-item label="标准编号：">
                <el-input v-model="dialogForm.Code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="标准名称：">
                <el-input v-model="dialogForm.Name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="项目名称：">
                <Project :value="dialogForm.ProjectId" :cate="'project'" @change="changeProjectId" />
            </el-form-item>
            <el-form-item label="标准类型：">
                <Project :value="dialogForm.TypeId" :cate="'standardtype'" @change="changeDialogTypeId" />
            </el-form-item>
            <el-form-item label="标准内容：">
                <el-button type="primary" size="mini" @click="editContent('new')">添加内容</el-button>
            </el-form-item>
            <el-table :data="dialogForm.StandardItems" style="width: 100%" max-height="300px">
                <el-table-column prop="Name" label="标准详情" align="center"> </el-table-column>
                <el-table-column label="操作" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editContent(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="removeStandardItems(scope.row)" style="color:#E98E8E">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-input type="textarea" style="margin-top:10" :rows="2" placeholder="请输入备注" v-model="dialogForm.Description">
            </el-input>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitDialog">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 添加内容 -->
    <el-dialog title="编辑内容" :visible.sync="contentVisible" width="500px">
        <el-form :inline="true" class="demo-form-inline" size="small">
            <el-form-item label="内容">
                <el-input v-model="currentContent.Name" placeholder="内容" clearable></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="contentVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitContent">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    Standard_PageList,
    Standard_Del,
    Standard_AddOrUpdate,
} from '@/api/Standard'
import pagiNation from '@/components/common/pagination.vue'
import Project from '@/components/filter/Project'
export default {
    components: {
        pagiNation,
        Project
    },
    data() {
        return {
            formInline: {
                Name: '',
                TypeId: ''
            },
            listQuery: {
                page: 1,
                limit: 10,
                total: 0,
            },
            tableData: [],
            dialogTitle: '新建标准',
            dialogVisible: false,
            dialogForm: {
                "CreaterName": "",
                "CreateTime": "",
                "Id": "",
                "Name": "",
                "TypeId": "",
                "TypeName": "",
                "Code": "",
                "ProjectId": "",
                "ProjectName": "",
                "CreaterId": "",
                "FalseDelete": "",
                "Description": "",
                "StandardItems": []
            },
            currentContent: {
                Id: "",
                Name: "",
                StandardId: ""
            },
            contentVisible: false,
            ProjectId: ''
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            let data = {
                "Page": this.listQuery.page,
                "Size": this.listQuery.limit,
                "OrderBys": [],
                "Conditions": [{
                        "Key": "Name",
                        "Operator": 1,
                        "Value": this.formInline.Name
                    },
                    {
                        "Key": "TypeId",
                        "Operator": 0,
                        "Value": this.formInline.TypeId
                    },
                    {
                        "key": "ProjectId",
                        "Operator": 0,
                        "Value": this.ProjectId
                    }
                ]
            }
            // this.$ajax.post('http://171.221.238.16:6762/sys/Standard/PageList',data).then(result=>{
            //     console.log(result);
            // })
            Standard_PageList(data).then(res => {
                this.tableData = res.Data.Data
                this.listQuery.total = res.Data.Count
            })
        },
        //选择类型
        changeTypeId(val) {
            this.formInline.TypeId = val
        },
        onSubmit() {
            this.listQuery.page = 1
            this.getList()
        },
        //编辑
        editData(row) {
            if (row == 'new') {
                this.dialogTitle = '新建标准'
                this.dialogForm = {
                    "CreaterName": "",
                    "CreateTime": "",
                    "Id": "",
                    "Name": "",
                    "TypeId": "",
                    "TypeName": "",
                    "Code": "",
                    "ProjectId": "",
                    "ProjectName": "",
                    "CreaterId": "",
                    "FalseDelete": "",
                    "Description": "",
                    "StandardItems": []
                }
            } else {
                this.dialogTitle = '编辑标准'
                this.dialogForm = JSON.parse(JSON.stringify(row))
            }
            this.dialogVisible = true
        },
        //保存标准
        submitDialog() {
            let data = this.dialogForm
            Standard_AddOrUpdate(data).then(res => {
                this.$message.success('保存成功！')
                this.getList()
                this.dialogVisible = false
            })
        },
        //删除标准
        removeData(row) {
            this.$confirm('此操作将永久删除该标准, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Standard_Del({
                    id: row.Id
                }).then(res => {
                    this.$message.success('删除成功！')
                    this.getList()
                })
            }).catch(() => {

            });
        },
        //选择项目
        changeProjectId(val) {
            this.dialogForm.ProjectId = val;
            this.ProjectId = val;
        },
        changeDialogTypeId(val) {
            this.dialogForm.TypeId = val
        },
        //删除标准内容
        removeStandardItems(row) {
            this.$confirm('是否删除该条内容, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let index = this.dialogForm.StandardItems.indexOf(row)
                this.dialogForm.StandardItems.splice(index, 1)
            }).catch(() => {

            });
        },
        //编辑内容
        editContent(row) {
            if (row == 'new') {
                this.currentContent = {
                    Id: "",
                    Name: "",
                    StandardId: this.dialogForm.Id
                }
            } else {
                this.currentContent = row
            }
            this.contentVisible = true
        },
        //保存内容
        submitContent() {
            if (!this.currentContent.Id) {
                this.dialogForm.StandardItems.push(this.currentContent)
            }
            this.contentVisible = false
        },
        //gis绑点
        bindGis() {},
        //二维码
        getQRcode() {},
        //巡检记录
        getRecord() {},
    }
}
</script>

<style lang="scss" scoped>
.flex {
    display: flex;
    align-items: center;
    justify-content: center;
}

.inspection-container {
    font-size: 12px;
    height: calc(100% - 115px);

    overflow-y: scroll;

    .filter {
        padding: 10px;
        text-align: left;
    }

    .add-new {
        text-align: right;

        >button {
            margin-top: 10px;
            margin-right: 10px;
        }
    }
}
</style><style lang="scss">
// @import './css/common.scss';
</style>
