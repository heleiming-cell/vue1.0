<template>
<div class="h100">
    <el-form :inline="true" class="header-search">
        <el-form-item>
            <el-input v-model="searchText" placeholder="请输入类型名称或编号" class="searchbtn">
                <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
            </el-input>
        </el-form-item>
    </el-form>
    <el-table :data="tableData" element-loading-text="Loading" fit height="calc(100% - 150px)" style="width: 100%">
        <el-table-column label="类型名称" prop="Name" align="center"></el-table-column>
        <el-table-column label="类型编号" prop="ModelType" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="bottom-btn">
        <el-button type="primary" @click="handleEdit(null)">新增类型</el-button>
    </div>
    <el-pagination :page-size="Size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <el-dialog title="编辑设备类型" width="600px" :visible.sync="dialogVisible" center @close="resetForm">
        <div class="dialog-container">
            <el-form ref="typeForm" label-width="120px" :model="device" :rules="rulesForm">
                <el-form-item label="类型名称：" prop="Name">
                    <el-input v-model="device.Name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="类型编号：" prop="ModelType">
                    <el-input v-model="device.ModelType" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" size="default" @click="dialogVisible = false">关闭</el-button>
            <el-button type="determine" @click="submitForm">确定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            searchText: "",
            tableData: [],
            dialogVisible: false,
            rulesForm: {
                Name: [{
                        required: true,
                        message: "请输入类型名称",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 15,
                        message: "长度在 2 到 15 个字符",
                        trigger: "blur"
                    }
                ],
                ModelType: [{
                        required: true,
                        message: "请输入类型编号",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 15,
                        message: "长度在 2 到 15 个字符",
                        trigger: "blur"
                    }
                ]
            },
            device: {
                ID: "",
                Name: "",
                ModelType: ""
            },
            total: 0,
            Page: 1,
            Size: 10
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            this.$ajax.get(this.$URL + '/Device/TypeList', {
                params: {
                    keyWord: this.searchText,
                    page: this.Page,
                    size: this.Size
                }
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.tableData = result.data.data;
                    this.total = result.data.count;
                }
            });
        },
        // 编辑
        handleEdit(val) {
            if (val != null) {
                this.device = val;
            } else {
                this.device = {
                    ID: "",
                    Name: "",
                    ModelType: ""
                };
            }
            this.dialogVisible = true;
        },
        // 删除
        handleDelete(val) {
            this.$confirm("是否确认删除该类型？", "提示", {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    this.$ajax.get(this.$URL + '/Device/DeleteType', {
                        params: {
                            typeId: val.ID
                        }
                    }).then(result => {
                        if (result.status == 200 && result.data.success) {
                            this.getList();
                            this.dialogVisible = false;
                            this.$message.success("删除成功");
                        }
                    });

                })
                .catch(() => {});
        },
        resetForm() {
            this.$refs.typeForm.resetFields();
        },
        submitForm() {
            this.$refs.typeForm.validate(valid => {
                if (valid) {
                    let data = {
                        Id: this.device.ID,
                        ModelType: this.device.ModelType,
                        Name: this.device.Name
                    };
                    this.$ajax.get(this.$URL + '/Device/SaveType', {
                        params: data
                    }).then(result => {
                        if (result.status == 200 && result.data.success) {
                            this.getList();
                            this.dialogVisible = false;
                            this.$message.success("编辑成功");
                        }
                    });
                }
            });
        },
        handleCurrentChange(val) {
            this.Page = val
            this.getList();
        }
    }
};
</script>

<style lang="less" scoped>
.h100 {
    padding: 10px;
}

.bottom-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    padding-right: 20px;
}
</style>
