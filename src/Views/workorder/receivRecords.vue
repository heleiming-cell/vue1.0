<template>
<div class="box">
    <div class="filter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="领取人员：">
                <!-- <el-select v-model="formInline.Recipient" placeholder="请选择" clearable>
                    <el-option v-for="item in spareList" :key="item.Id" :label="item.Name" :value="item.Id">
                    </el-option>
                </el-select> -->
                <el-input v-model="formInline.CreaterName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="起始时间：">
                <el-date-picker v-model="formInline.Time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getList">
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
        <el-table-column label="领取单号" prop="Number" align="center"></el-table-column>
        <el-table-column label="领取人员" prop="CreaterName" align="center"></el-table-column>
        <el-table-column label="领取时间" prop="CreateTime" align="center"></el-table-column>
        <el-table-column label="领用备注" prop="Remark" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
            </template>
        </el-table-column>
    </el-table>
    <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog title="领用详情" :visible.sync="dialogVisible" width="800px">
        <el-form :model="details" label-width="120px">
            <el-form-item label="领取单号：">
                <span>{{details.Number}}</span>
            </el-form-item>
            <el-form-item label="领取时间：">
                <span>{{details.CreateTime}}</span>
            </el-form-item>
            <el-form-item label="备注：">
                <span>{{details.Remark}}</span>
            </el-form-item>
            <el-form-item label="领取备件详情：">

            </el-form-item>
        </el-form>
        <el-table :data="detailsTable">
            <el-table-column label="备件名称" prop="Name" align="center"></el-table-column>
            <el-table-column label="备件型号" prop="Model" align="center"></el-table-column>
            <el-table-column label="所属仓库" prop="WarehouseName" align="center"></el-table-column>
            <el-table-column label="备件数量" prop="Num" align="center"></el-table-column>
            <el-table-column label="计量单位" prop="Unit" align="center"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import FileSaver from "file-saver"

import pagiNation from '@/components/common/pagination'
import {
    Warehouse_QueryList
} from '@/api/Warehouse'
import {
    SpareApplyMain_QueryList,
    SpareApplyMain_QueryDetail
} from '@/api/SpareApplyMain'
export default {
    components: {
        pagiNation
    },
    data() {
        return {
            formInline: {
                CreaterName: '',
                Recipient: '',
                Time: ''
            },
            spareList: [],
            tableData: [],
            listQuery: {
                page: 1,
                limit: 10,
                total: 0
            },
            dialogVisible: false,
            details: {
                Number: '',
                CreateTime: '',
                Remark: ''
            },
            detailsTable: []
        }
    },
    mounted() {
        this.getSpareList();
        this.getList();

    },
    methods: {
        getSpareList() {
            const data = {
                Page: 1,
                Size: 0,
                OrderBys: [{
                    Sort: "CreateTime",
                    Order: "DESC"
                }],
                Conditions: []
            }
            Warehouse_QueryList(data).then(result => {
                this.spareList = result.Data.Data
            })
        },
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
                }, {
                    Key: "CreateTime",
                    Operator: 14,
                    Value: this.formInline.Time != null && this.formInline.Time != '' ? this.formInline.Time[0] + '|' + this.formInline.Time[1] : ''
                }]
            }
            SpareApplyMain_QueryList(data).then(result => {
                this.tableData = result.Data.Data;
                this.listQuery.total = result.Data.Count;
            })
        },
        handleClick(row) {
            this.details = row;
            this.dialogVisible = true;
            SpareApplyMain_QueryDetail({
                spareInId: row.Id
            }).then(result => {
                this.detailsTable = result.Data
            })
        },
        downFile() {
            this.$ajax.get(this.$Order + '/sys/excel/QueryListSpareApply', {
                params:{
                    name:this.formInline.CreaterName,
                    bt:this.formInline.Time[0],
                    et:this.formInline.Time[1]
                },
                 responseType: "blob"
            }).then(result => {
                FileSaver.saveAs(
                    new Blob([result.data], {
                        type: "application/octet-stream"
                    }),
                    "领取记录报表.xlsx"
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
</style>
