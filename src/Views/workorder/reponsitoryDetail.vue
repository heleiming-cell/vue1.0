<template>
<div class="box">
    <!-- <el-col :xs="24" :sm="24" class="h100"> -->
    <el-tabs type="border-card" @tab-click="tabClick" class="h100">
        <el-tab-pane label="备件详情" class="h100">
            <div class="filter">
                <el-form :inline="true" class="demo-form-inline" size="small">
                    <el-form-item label="仓库名称：">
                        <el-input placeholder="备件名称" v-model="SpareName" clearable=""></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getStoreList">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="storeData" show-summary :summary-method="getSummaries" height="calc(100% - 120px)">
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

        </el-tab-pane>
        <el-tab-pane label="入库信息">
            <div class="filter">
                <el-form :inline="true" class="demo-form-inline" size="small">
                    <el-form-item label="关键字：">
                        <el-input placeholder="人员或者备件名称" v-model="keyword" clearable=""></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getInbound">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="InboundData" class="table-data">
                <el-table-column label="入库单号" prop="Number" align="center"></el-table-column>
                <el-table-column label="入库人员" prop="CreaterName" align="center"></el-table-column>
                <el-table-column label="入库时间" prop="CreateTime" align="center"></el-table-column>
                <el-table-column label="备件名称" prop="SpareName" align="center"></el-table-column>
                <el-table-column label="备件型号" prop="Model" align="center"></el-table-column>
                <el-table-column label="入库数量" prop="Num" align="center"></el-table-column>
                <el-table-column label="单位" prop="Unit" align="center"></el-table-column>
                <el-table-column label="仓库名称" prop="WarehouseName" align="center"></el-table-column>
                <el-table-column label="备注" prop="Remark" align="center"></el-table-column>
            </el-table>
            <pagination @current-change="handleCurrentChange" :page-size="10" :total="listQuery.total"></pagination>
        </el-tab-pane>
        <el-tab-pane label="出库信息">
            <div class="filter">
                <el-form :inline="true" class="demo-form-inline" size="small">
                    <el-form-item label="关键字：">
                        <el-input placeholder="人员或者备件名称" v-model="keyword" clearable=""></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getOutList">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="outData" class="table-data">
                <el-table-column label="出库单号" prop="Number" align="center"></el-table-column>
                <el-table-column label="出库人员" prop="CreaterName" align="center"></el-table-column>
                <el-table-column label="出库时间" prop="CreateTime" align="center"></el-table-column>
                <el-table-column label="备件名称" prop="SpareName" align="center"></el-table-column>
                <el-table-column label="备件型号" prop="Model" align="center"></el-table-column>
                <el-table-column label="单位" prop="Unit" align="center"></el-table-column>
                <el-table-column label="仓库名称" prop="WarehouseName" align="center"></el-table-column>
                <el-table-column label="备注" prop="Remark" align="center"></el-table-column>

            </el-table>
            <pagination @current-change="handleCurrentChange" :page-size="10" :total="listQuery.total"></pagination>

        </el-tab-pane>
        <el-tab-pane label="领取记录">
            <div class="filter">
                <el-form :inline="true" class="demo-form-inline" size="small">
                    <el-form-item label="关键字：">
                        <el-input placeholder="人员或者备件名称" v-model="keyword" clearable=""></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getApplyList">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="applyData" class="table-data">
                <el-table-column label="领取人员" prop="CreateName" align="center"></el-table-column>
                <el-table-column label="领取时间" prop="CreateTime" align="center"></el-table-column>
                <el-table-column label="备件名称" prop="Name" align="center"></el-table-column>
                <el-table-column label="备件型号" prop="Model" align="center"></el-table-column>
                <el-table-column label="领取数量" prop="Num" align="center"></el-table-column>
                <el-table-column label="领用备注" prop="Remark" align="center"></el-table-column>
            </el-table>
            <pagination @current-change="handleCurrentChange" :page-size="10" :total="listQuery.total"></pagination>

        </el-tab-pane>

    </el-tabs>
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
</div>
</template>

<script>
import {
    SpareOut_Query,

} from '@/api/SpareOut'
import {
    Spare_QueryList,
    Spare_AddOrUpdate,
    Spare_Del
} from '@/api/Spare'
import {
    SpareIn_Add,
    SpareIn_Query,
    SpareIn_QueryDetail,
} from '@/api/SpareIn'
import pagination from '@/components/common/pagination/index.js'
import {
    SpareApplyMain_Query,
} from '@/api/SpareApplyMain'
import {
    Public_AllEnums
} from '@/api/Public'

export default {
    data() {
        return {
            storeData: [],
            WarehouseId: '',
            SpareName: '',
            InboundData: [],
            outData: [],
            listQuery: {
                page: 1,
                limit: 10,
                total: 0,
            },
            tableData: [],
            index: '0',
            applyData: [],
            keyword: '',
            dialogStoreTitle: '',
            dialogVisible_store: false,
            accessories: {
                Id: '',
                Name: '',
                Model: '',
                Price: '',
                Unit: '',
                Description: ''
            },
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
            UnitList: [],
        }
    },
    components: {
        'pagination': pagination,
    },
    mounted() {
        this.WarehouseId = this.$route.params.id;
        // let _this = this;
        // this.$nextTick(() => {
        //     _this.getStoreList();
        // });
        this.getStoreList();
        this.getUnitList();

    },
    methods: {
        tabClick(item) {
            this.listQuery.page = 1;
            this.keyword = "";
            this.index = item.index;
            if (item.index == 0) {
                this.getStoreList();
            } else if (item.index == 1) {
                this.getInbound();
            } else if (item.index == 2) {
                this.getOutList();
            } else if (item.index == 3) {
                this.getApplyList();
            }
        },
        getInbound() {
            let data = {
                Page: this.listQuery.page,
                Size: this.listQuery.limit,
                OrderBys: [{
                    Sort: "CreateTime",
                    Order: "Desc"
                }],
                Conditions: [
                    // {
                    //     Key: "CreaterName",
                    //     Operator: 1,
                    //     Value: this.formInline.CreaterName
                    // },
                    // {
                    //     Key: "CreateTime",
                    //     Operator: 14,
                    //     Value: this.formInline.Time != null && this.formInline.Time != '' ? this.formInline.Time[0] + '|' + this.formInline.Time[1] : ''
                    // }
                ]
            }

            SpareIn_Query({
                wareHouseId: this.WarehouseId,
                size: this.listQuery.limit,
                page: this.listQuery.page,
                keyword: this.keyword
            }).then(result => {
                this.InboundData = result.Data.Data;
                this.listQuery.total = result.Data.Count
            })
        },
        getOutList() {
            SpareOut_Query({
                wareHouseId: this.WarehouseId,
                size: this.listQuery.limit,
                page: this.listQuery.page,
                keyword:this.keyword
            }).then(result => {
                this.outData = result.Data.Data
                this.listQuery.total = result.Data.Count
            })
        },
        getApplyList() {
            SpareApplyMain_Query({
                wareHouseId: this.WarehouseId,
                size: this.listQuery.limit,
                page: this.listQuery.page,
                keyword: this.keyword
            }).then(result => {
                this.applyData = result.Data.Data;
                this.listQuery.total = result.Data.Count;
            })
        },
        getStoreList() {
            let data = {
                Page: 1,
                Size: 10,
                OrderBys: [],
                Conditions: [{
                    Key: 'WarehouseId',
                    Operator: 0,
                    Value: this.WarehouseId
                }, {
                    Key: 'Name',
                    Operator: 1,
                    Value: this.SpareName
                }]
            }
            Spare_QueryList(data).then(result => {
                this.storeData = result.Data.Data
            })
        },
        handleCurrentChange(val) {
            this.listQuery.page = val
            if (this.index === "1") {
                this.getInbound();
            } else if (this.index === "2") {
                this.getOutList();
            } else if (this.index === "3") {
                this.getApplyList();
            }
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
                const values = data.map(item => Number(item[column.property] * item["Price"]));
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
        },
        handleEditStore(row) {
            this.dialogVisible_store = true;
            this.dialogStoreTitle = '修改备件';
            this.accessories = JSON.parse(JSON.stringify(row))
        },
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
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        getUnitList() {
            Public_AllEnums().then(result => {
                this.UnitList = result.Data.DeviceUnitEnums
            })
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

    }
}
</script>

<style lang="less" scoped>
.box {
    padding-top: 0px !important;
}

.box /deep/ .el-tabs__content {
    height: calc(100% - 40px);
}

.box /deep/ .el-table__body-wrapper {
    height: calc(100% - 99px) !important;
}
</style>
