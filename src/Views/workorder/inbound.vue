<template>
<div class="box">
    <div class="filter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="入库人员：">
                <el-input v-model="formInline.CreaterName" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="起始时间：">
                <el-date-picker value-format="yyyy-MM-dd" v-model="formInline.Time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getList">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="downFile">导出</el-button>
            </el-form-item>
        </el-form>
    </div>

    <el-table :data="tableData" class="table-data">
        <el-table-column label="入库单号" prop="Number" align="center"></el-table-column>
        <el-table-column label="入库用户" prop="CreaterName" align="center"></el-table-column>
        <el-table-column label="入库时间" prop="CreateTime" align="center"></el-table-column>
        <el-table-column label="备注" prop="Remark" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div class="add-new">
        <el-button type="primary" @click="handleAdd" size="small">入库</el-button>
    </div>
    <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 添加入库 -->
    <el-dialog title="新增入库" :visible.sync="dialogVisible_spareAdd" width="800px">
        <el-table :data="storageData">
            <el-table-column label="备件名称" prop="Name" align="center"></el-table-column>
            <el-table-column label="备件型号" prop="Model" align="center"></el-table-column>
            <el-table-column label="备件单价" prop="Price" align="center"></el-table-column>
            <!-- <el-table-column label="备件型号" prop="Model" align="center"></el-table-column> -->
            <el-table-column label="入库数量" align="center">
                <template slot-scope="scope">
                    <el-input class="change-num" v-model="scope.row.Num"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" style="color:#F18573" @click="removeWarehouse(scope.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin:20px;text-align:right">
            <el-button type="primary" @click="clickAddSpare" size="small">添加备件</el-button>
        </div>
        <el-form :model="dialogSpare" label-width="60px">
            <el-form-item label="备注：">
                <el-input type="textarea" rows="2" v-model="dialogSpare.remark"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible_spareAdd = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 选择备件 -->
    <el-dialog title="添加备件" :visible.sync="dialogVisible" width="800px" v-if="dialogVisible">
        <el-form :label-width="'100px'" ref="ruleForm">
            <el-form-item label="选择仓库：">
                <Warehouse :value="WarehouseId" @change="selectStore" />
            </el-form-item>
        </el-form>
        <el-table :data="AccessoriesData" @selection-change="handleSelectionChange" ref="spareTable">
            <el-table-column type="selection" align="center" width="60"></el-table-column>
            <el-table-column label="备件名称" prop="Name" align="center"></el-table-column>
            <el-table-column label="备件型号" prop="Model" align="center"></el-table-column>
            <el-table-column label="备件单价" prop="Price" align="center"></el-table-column>
            <el-table-column label="备件描述" prop="Description" align="center"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="determineAdd">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 入库详情 -->
    <el-dialog title="入库详情" :visible.sync="dialogVisible_details" width="800px">
        <el-form :model="details" label-width="100px">
            <el-form-item label="入库单号：">
                <span>{{details.Number}}</span>
            </el-form-item>
            <el-form-item label="登记人：">
                <span>{{details.CreaterName}}</span>
            </el-form-item>
            <el-form-item label="入库时间：">
                <span>{{details.CreateTime}}</span>
            </el-form-item>
            <el-form-item label="入库详情：">

            </el-form-item>
        </el-form>
        <el-table :data="detailsTable">
            <el-table-column label="设备名称" prop="Name" align="center"></el-table-column>
            <el-table-column label="设备型号" prop="Model" align="center"></el-table-column>
            <el-table-column label="所属仓库" prop="WarehouseName" align="center"></el-table-column>
            <el-table-column label="入库数量" prop="Num" align="center"></el-table-column>
            <el-table-column label="计量单位" prop="Unit" align="center"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible_details = false">关闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import FileSaver from "file-saver";

import pagiNation from '@/components/common/pagination'
import Warehouse from '@/components/filter/Warehouse'
import {
    Warehouse_QueryList
} from '@/api/Warehouse'
import {
    SpareIn_Add,
    SpareIn_QueryList,
    SpareIn_QueryDetail,
} from '@/api/SpareIn'
import {
    Spare_QueryList
} from '@/api/Spare'
export default {
    components: {
        pagiNation,
        Warehouse
    },
    data() {
        return {
            spareList: [],
            formInline: {
                CreaterName: '',
                Time: ''
            },
            listQuery: {
                page: 1,
                limit: 10,
                total: 0,
            },
            tableData: [],
            WarehouseId: '',
            dialogVisible_spareAdd: false,
            dialogVisible: false,
            AccessoriesData: [],
            storageData: [],
            selectedWarehouse: [],
            dialogSpare: {
                remark: ''
            },
            dialogVisible_details: false,
            details: {
                Number: '',
                CreaterName: '',
                CreateTime: ''
            },
            detailsTable: []

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
                OrderBys: [{
                    Sort: "CreateTime",
                    Order: "Desc"
                }],
                Conditions: [{
                        Key: "CreaterName",
                        Operator: 1,
                        Value: this.formInline.CreaterName
                    },
                    {
                        Key: "CreateTime",
                        Operator: 14,
                        Value: this.formInline.Time != null && this.formInline.Time != '' ? this.formInline.Time[0] + '|' + this.formInline.Time[1] : ''
                    }
                ]
            }
            SpareIn_QueryList(data).then(result => {
                this.tableData = result.Data.Data;
                this.listQuery.total = result.Data.Count
            })
        },
        handleClick(row) {
            SpareIn_QueryDetail({
                spareInId: row.Id
            }).then(result => {
                this.detailsTable = result.Data
            })
            this.dialogVisible_details = true;
            this.details = row

        },
        // 点击入库
        handleAdd() {
            this.dialogVisible_spareAdd = true;
            this.dialogSpare.remark = '';
            this.storageData = []
        },
        // 点击选择备件
        clickAddSpare() {
            this.WarehouseId = '';
            this.AccessoriesData = [];
            this.dialogVisible = true
        },
        // 根据仓库获取备件
        getWarehouseData() {
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
                this.AccessoriesData = result.Data.Data;
                let newArray = this.AccessoriesData.filter(item => this.storageData.some(v => v.Id == item.Id));
                this.$nextTick(() => {
                    newArray.forEach(row => {
                        this.$refs.spareTable.toggleRowSelection(row)
                    })
                })
            })
        },
        // 选择仓库
        selectStore(value) {
            this.WarehouseId = value;
            this.getWarehouseData()
        },
        // 选择要添加的备件类型
        handleSelectionChange(selection) {
            let newSelection = selection.map(v => {
                return {
                    ...v,
                    Num: 0
                }
            });
            this.selectedWarehouse = newSelection
        },

        // 确认添加选中的备件
        determineAdd() {
            this.storageData = [...this.storageData, ...this.selectedWarehouse];
            this.storageData = this.storageData.reduce((all, next) => all.some((item) => item.Id == next.Id) ? all : [...all, next], []);
            this.dialogVisible = false;
            this.selectedWarehouse = []
        },
        // 移除选中的备件类型
        removeWarehouse(row) {
            this.storageData.splice(this.storageData.findIndex(v => v.Id == row.Id), 1);
        },
        // 提交表单
        submitForm() {
            if (this.storageData.length == 0) {
                this.$message.error("请添加要入库的设备")
            } else {
                if (this.storageData.map(v => v.Num == 0).includes(false)) {
                    if (this.storageData.map(v => v.Num == 0).includes(true)) {
                        this.$confirm('要入库的备件中有数量为0的数据，该数据将不会被选中入库，是否继续操作？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let data = {
                                SpareList: this.storageData.filter(item => {
                                    if (item.Num !== 0) return true
                                }).map(v => {
                                    return {
                                        SpareId: v.Id,
                                        Num: v.Num
                                    }
                                }),
                                Remark: this.dialogSpare.remark,
                            }
                            this.postStoreIn(data)
                        }).catch(() => {

                        })
                    } else {
                        let data = {
                            SpareList: this.storageData.map(v => {
                                return {
                                    SpareId: v.Id,
                                    Num: v.Num
                                }
                            }),
                            Remark: this.dialogSpare.remark
                        }
                        this.postStoreIn(data)
                    }
                } else {
                    this.$message.error("请添加备件数量")
                }
            }
        },
        // 请求入库
        postStoreIn(data) {
            SpareIn_Add(data).then(result => {
                this.getList();
                this.$message.success("入库成功");
                this.dialogVisible_spareAdd = false
            }).catch(error => {
                console.log(error)
            })
        },
      
        downFile() {
            this.$ajax.post(this.$Order + '/sys/excel/QueryListSpareIn',{
                Size:0,Page:0
            },{
                responseType:"blob"
            }).then(result => {
                FileSaver.saveAs(
                    new Blob([result.data], {
                        type: "application/octet-stream"
                    }),
                    "入库明细报表.xlsx"
                );
            });
        }

    }
}
</script>

<style lang="scss">
.filter {
    text-align: left;
    padding: 10px;
}

.add-new {
    text-align: right;
    padding: 5px 3em;

    >button {
        margin-top: 10px;
        margin-right: 10px;
    }
}
</style>
