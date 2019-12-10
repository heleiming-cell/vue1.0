<template>
<div class="box">
    <div class="filter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="仓库名称：">
                <el-input v-model="formInline.Nmae" placeholder="仓库名称" clearable=""></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableList" class="table-data">
        <el-table-column prop="Name" label="仓库名称" align="center"></el-table-column>
        <el-table-column prop="CreaterName" label="创建人" align="center"></el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="LastModifyName" label="最后修改人" align="center"></el-table-column>
        <el-table-column prop="LastModifyTime" label="最后修改时间" align="center"></el-table-column>
        <el-table-column prop="Description" label="描述" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDetails(scope.row)">备件详情</el-button>
                <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleDelete(scope.row)" style="color:#F18573">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="add-new">
        <el-button type="primary" @click="handleAdd()" size="small">新建仓库</el-button>
    </div>
    <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 仓库编辑 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="700px" v-if="dialogVisible">
        <el-form :model="dialogForm" :label-width="'120px'" :rules="rules" ref="ruleForm">
            <el-form-item label="仓库名称：" prop="Name">
                <el-input v-model="dialogForm.Name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属项目：">
                <Project cate="project" :value="dialogForm.ProjectId" @change="handleChange" />
            </el-form-item>
            <el-form-item label="描述：" prop="Description">
                <el-input type="textarea" v-model="dialogForm.Description" :rows="2"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitDialog">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 备件详情 -->
    <el-dialog :title="storeDetailsTitle" :visible.sync="dialogVisible_details" width="1000px">
        <el-table :data="storeData" show-summary :summary-method="getSummaries">
            <el-table-column label="备件名称" prop="Name" align="center"></el-table-column>
            <el-table-column label="备件型号" prop="Model" align="center"></el-table-column>
            <el-table-column label="备件单价" prop="Price" align="center"></el-table-column>
            <el-table-column label="入库数量" prop="Count" align="center"></el-table-column>

            <el-table-column label="计量单位" prop="Unit" align="center"></el-table-column>
            <el-table-column label="入库用户" prop="CreaterName" align="center"></el-table-column>
            <el-table-column label="金额" prop="Count" align="center">
                <template slot-scope="scope">
                    {{scope.row.Count*scope.row.Price}}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleEditStore(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" style="color:#F18573" @click="handleDeleteStore(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="add-new">
            <el-button type="primary" @click="handleAddStore()" size="small">添加备件</el-button>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible_details = false">关闭</el-button>
        </div>
    </el-dialog>
    <!-- 备件编辑 -->
    <el-dialog :title="dialogStoreTitle" :visible.sync="dialogVisible_store" width="600px" @close="resetForm('editForm')">
        <el-form :model="accessories" label-width="100px" :rules="storeForm" ref="editForm">
            <el-form-item label="备件名称：" prop="Name">
                <el-input v-model="accessories.Name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="备件型号：" prop="Model">
                <el-input v-model="accessories.Model" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="备件单价：" prop="Price">
                <el-input v-model="accessories.Price" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="计量单位：" prop="Unit">
                <el-select v-model="accessories.Unit">
                    <el-option v-for="item in UnitList" :key="item" :value="item" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述：">
                <el-input type="textarea" rows="2" v-model="accessories.Description"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible_store = false">取 消</el-button>
            <el-button type="primary" @click="submitStoreForm">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="删除操作" :visible.sync="dialogVisible_pwd" width="600px">
        <el-form :model="accessories" label-width="100px" :rules="storeForm" ref="editForm">
            <el-form-item label="登陆密码：">
                <el-input v-model="pwd" type="password" placeholder="请输入"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible_pwd = false">取 消</el-button>
            <el-button type="primary" @click="Warehouse_Del">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import pagiNation from '@/components/common/pagination'
import Project from '@/components/filter/Project'
import {
    Warehouse_AddOrUpdate,
    Warehouse_Del,
    Warehouse_QueryList,
} from '@/api/Warehouse'
import {
    Spare_QueryList,
    Spare_AddOrUpdate,
    Spare_Del
} from '@/api/Spare'
import {
    Public_AllEnums
} from '@/api/Public'
export default {
    components: {
        pagiNation,
        Project
    },
    data() {
        return {
            formInline: {
                Name: ''
            },
            tableList: [],
            listQuery: {
                page: 1,
                limit: 10,
                total: 0,
            },
            dialogTitle: '添加仓库',
            dialogVisible: false,
            dialogVisible_pwd: false,
            dialogForm: {
                ProjectId: '',
                Id: '',
                Name: '',
                Description: ''
            },
            rules: {
                Name: [{
                        required: true,
                        message: '请输入仓库名称',
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
                    message: '请选择项目',
                    trigger: 'change'
                }]
            },
            dialogVisible_details: false,
            storeDetailsTitle: '',
            storeData: [],
            accessories: {
                Id: '',
                Name: '',
                Model: '',
                Price: '',
                Unit: '',
                Description: ''
            },
            UnitList: [],
            dialogStoreTitle: '',
            dialogVisible_store: false,
            pwd: '',
            storeForm: {
                Name: [{
                        required: true,
                        message: '请输入备件名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 20,
                        message: '长度在2到20个字符',
                        trigger: 'blur'
                    }
                ],
                Model: [{
                        required: true,
                        message: '请输入备件型号',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 20,
                        message: '长度在2到20个字符',
                        trigger: 'blur'
                    }
                ],
                Price: [{
                    required: true,
                    message: '请输入备件单价',
                    trigger: 'blur'
                }],
                Unit: [{
                    required: true,
                    message: '请选择计量单位',
                    trigger: 'change'
                }]
            },
            WarehouseId: '',
            row:null
        }
    },
    mounted() {
        this.getList();
        this.getUnitList()
    },
    methods: {
        getList() {
            let data = {
                Page: this.listQuery.page,
                Size: this.listQuery.limit,
                OrderBys: [{
                    Sort: "CreateTime",
                    Order: "DESC"
                }],
                Conditions: [{
                    Key: "Name",
                    Operator: 1,
                    Value: this.formInline.Name
                }]
            }
            Warehouse_QueryList(data).then(result => {
                this.tableList = result.Data.Data;
                this.listQuery.total = result.Data.Count
            })
        },
        handleDelete(row) {
            this.$confirm('此操作将永久删除该仓库, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               this.dialogVisible_pwd=true;
               this.row=row;
            })
        },
        Warehouse_Del() {
            if(!this.pwd)
            {
                this.$message.error("密码不能为空！");
            }
            Warehouse_Del({
                id: this.row.Id,
                pwd:this.pwd
            }).then(result => {
                this.getList();
                this.dialogVisible_pwd=false;
                this.row=null;
                this.$message.success("删除成功");
            }).catch(error => {
               // this.$message.error(error)
            })
        },
        handleEdit(row) {
            this.dialogVisible = true;
            this.dialogTitle = "修改仓库";
            this.dialogForm = {
                ProjectId: row.ProjectId,
                Id: row.Id,
                Name: row.Name,
                Description: row.Description
            }
        },
        handleAdd() {
            this.dialogVisible = true;
            this.dialogTitle = "新增仓库";
            this.dialogForm = {
                ProjectId: '',
                Id: '',
                Name: '',
                Description: ''
            }
        },
        handleChange(value) {
            this.dialogForm.ProjectId = value
        },
        // 仓库编辑表单
        submitDialog() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let data = {
                        ProjectId: this.dialogForm.ProjectId,
                        Description: this.dialogForm.Description,
                        Id: this.dialogForm.Id,
                        Name: this.dialogForm.Name
                    }
                    Warehouse_AddOrUpdate(data).then(result => {
                        this.getList();
                        this.dialogVisible = false;
                        this.$message.success(result.Message)
                    }).catch(error => {
                        this.$message.error(error.Message)
                    })
                }
            })
        },
        // 获取仓库下面的备件列表
        getStoreList() {
            let data = {
                Page: 1,
                Size: 0,
                OrderBys: [],
                Conditions: [{
                    Key: 'WarehouseId',
                    Operator: 0,
                    Value: this.WarehouseId
                }]
            }
            Spare_QueryList(data).then(result => {
                this.storeData = result.Data.Data
            })
        },
        // 获取枚举单位
        getUnitList() {
            Public_AllEnums().then(result => {
                this.UnitList = result.Data.DeviceUnitEnums
            })
        },
        handleDetails(row) {
            // this.dialogVisible_details = true;
            // this.storeDetailsTitle = row.Name + '-备件详情';
            // this.WarehouseId = row.Id;
            // this.getStoreList(row.Id);

            this.$router.push({name:`reponsitoryDetail`,params:{id:row.Id}})
        },
        handleEditStore(row) {
            this.dialogVisible_store = true;
            this.dialogStoreTitle = '修改备件';
            this.accessories = JSON.parse(JSON.stringify(row))
        },
        handleDeleteStore(row) {
            this.$confirm('是否确认从该仓库中删除该备件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Spare_Del({
                    id: row.Id
                }).then(result => {
                    this.getStoreList();
                    this.$message.success("删除成功")
                })
            })
        },

        handleAddStore() {
            this.dialogVisible_store = true;
            this.dialogStoreTitle = '添加备件'
            this.accessories = {
                Id: '',
                Name: '',
                Model: '',
                Price: '',
                Unit: '',
                Description: ''
            }
        },
        // 提交编辑备件表单
        submitStoreForm() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    let data = {
                        Id: this.accessories.Id,
                        WarehouseId: this.WarehouseId,
                        Description: this.accessories.Description,
                        Unit: this.accessories.Unit,
                        Model: this.accessories.Model,
                        Price: this.accessories.Price,
                        Name: this.accessories.Name
                    }
                    Spare_AddOrUpdate(data).then(result => {
                        this.dialogVisible_store = false;
                        this.getStoreList();
                        this.$message.success("编辑成功")
                    })
                }
            })
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        getSummaries(param) {
            const {
                columns,
                data
            } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '总金额';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    if (index == 6) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' 元';
                    }

                } else {
                    sums[index] = '';
                }
            });

            return sums;
        }
    }
}
</script>

<style lang="scss" scoped>
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
