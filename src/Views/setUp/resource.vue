<template>
<div class="box">
    <el-table row-key="Code" :data="tableData">
        <el-table-column label="部门编号">
            <template slot-scope="scope">
                <span v-for="space in scope.row._level" :key="space" class="ms-tree-space" />
                <span>{{scope.row.Code}}</span>
            </template>
        </el-table-column>
        <el-table-column label="部门名称">
            <template slot-scope="scope">
                <span v-for="space in scope.row._level" :key="space" class="ms-tree-space" />
                <span>{{scope.row.Name}}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <el-button type="text" @click="addDepartment(scope.row)">增加子部门</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="button-btn">
        <el-button type="primary" @click="addDepartment('')">新建部门</el-button>
    </div>
    <el-pagination :page-size="size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <el-dialog :title="dialog_title" :visible.sync="dialog_visible" :modal-append-to-body="false" center>
        <div class="dialogClass">
            <el-form :model="formInline" label-width="100px" ref="dialogFrom" :rules="fromRules">
                <el-form-item label="部门编号:" prop="Code">
                    <el-input v-model="formInline.Code" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="部门名称:" prop="Name">
                    <el-input v-model="formInline.Name" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="部门描述:">
                    <el-input v-model="formInline.Describe" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialog_visible = false" size="medium">关 闭</el-button>
            <el-button type="primary" @click="dialog_submit" size="medium">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import AllCateTree from '@/components/filter/AllCateTree'

export default {
    components: {
        AllCateTree
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: 'success',
                draft: 'gray',
                deleted: 'danger'
            }
            return statusMap[status]
        }
    },
    data() {
        return {
            listLoading: true,
            Keyword: '',
            tableData: [],
            Page: 1,
            Size: 10,
            total: 0,
            dialog_title: '新增部门',
            dialog_visible: false,
            formInline: {
                Code: '',
                Name: '',
                Describe: '',
                PId: ''
            },
            // 表单验证
            fromRules: {
                Code: [{
                        required: true,
                        message: '请输入部门编号',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 15,
                        message: '长度在2到20个字符',
                        trigger: 'blur'
                    }
                ],
                Name: [{
                        required: true,
                        message: '请输入部门名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 15,
                        message: '长度在2到15个字符',
                        trigger: 'blur'
                    }
                ]
            },
            columns: [{
                    text: '部门编号',
                    value: 'Code',
                    width: '200'
                },
                {
                    text: '部门名称',
                    value: 'Name',
                },
            ],

        }
    },
    created() {
        this.getData()
    },
    methods: {
        //获取部门列表
        getData() {
            this.listLoading = true;
            this.$ajax.get(this.$DMURL + '/User/AllCateTree', {
                params: {
                    key: "department"
                }
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.tableData = result.data.data
                }
            });
        },
        // 添加部门显示
        addDepartment(row) {
            let PId = 0
            if (row) {
                PId = row.Id
            }
            this.dialog_title = '新增部门',
                this.dialog_visible = true
            this.formInline = {
                Code: '',
                Name: '',
                Describe: '',
                PId: PId,
                Id: ""
            }
        },
        // 编辑部门显示
        handleEdit(index, row) {
            this.formInline = {
                Code: row.Code,
                Name: row.Name,
                Describe: "",
                PId: row.PId,
                Id: row.Id
            }
            this.dialog_title = '修改部门',
                this.dialog_visible = true
        },
        // 删除部门
        handleDelete(index, row) {
            let data = {
                ID: row.Id
            }
            this.$confirm('此操作将删除该部门,是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.post(this.$DMURL + '/project/RemoveProjectDepartMent', data).then(result => {
                    if (result.status == 200 && result.data.success) {
                        this.getData()
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                    }
                });

            });
        },
        //提交部门的修改
        dialog_submit() {
            this.$refs.dialogFrom.validate((valid) => {
                if (valid) {
                    let data = {
                        ID: this.formInline.Id,
                        Name: this.formInline.Name,
                        Describe: this.formInline.Describe,
                        PId: this.formInline.PId,
                        Code: this.formInline.Code,
                    }
                    this.$ajax.post(this.$DMURL + '/project/UpdateProjectDepartMent',data).then(result => {
                        if (result.status === 200 && result.data.success) {
                            this.dialog_visible=false;
                            this.$message({
                                type:'success',
                                message:'操作成功'
                            });
                            this.getData()
                            this.formInline.Code = ""
                            this.formInline.Name = ""
                            this.formInline.Describe = ""
                        }
                    });
                }
            })
        },
        handleCurrentChange(val) {
            this.Page = val
            this.getData();
        },
    }
}
</script>

<style lang="less" scoped>
.box{
    height: 100% !important;
}
.bottom-btn {
    height: 50px;
    text-align: right;
    padding: 20px;
}

.ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;

    &::before {
        content: ""
    }
}

.button-btn {
    height: 40px;
    text-align: right;
    padding: 20px;
}
</style>
