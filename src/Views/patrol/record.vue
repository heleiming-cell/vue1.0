<template>
<div class="box">
    <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="起止时间：">
            <el-date-picker v-model="selectForm.startTime" type="date" placeholder="选择日期"></el-date-picker>
            <span>至</span>
            <el-date-picker v-model="selectForm.endTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="list" height="calc(100% - 100px)"  fit>
        <el-table-column label="巡检点/设备" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.DataName }}</span>
            </template>
        </el-table-column>
        <el-table-column label="巡检类型" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.TaskType }}</span>
            </template>
        </el-table-column>
        <el-table-column label="所属部门" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.DepartMentName }}</span>
            </template>
        </el-table-column>
        <el-table-column label="完成时间" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.CompleteTime }}</span>
            </template>
        </el-table-column>
        <el-table-column label="巡检反馈" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.Remark }}</span>
            </template>
        </el-table-column>
        <el-table-column label="巡检结果" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.Result==0?'有异常项':'全部合格' }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="editData(scope.row)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination :page-size="listQuery.limit" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <el-dialog :visible.sync="dialogPoint" v-if="dialogPoint" center title="记录详情">
        <div class="dialogRecord">巡检反馈：{{dialogPointData.Remark}}</div>
        <div class="dialogRecord" style="overflow: hidden;">
            <p>巡检图片：</p>
            <enlargeimg :data="dialogPointData.AttachmentList"></enlargeimg>
        </div>
        <div v-for="(item,index) in dialogPointData.StandardList" :key="index">
            <p style="text-align:center;font-size: 16px;font-weight: bold;">{{item.StandardName}}</p>
            <el-table :data="itemStandard(item.Standard)" style="width: 100%;margin-bottom: 20px;"  border row-key="id">
                <el-table-column prop="date" width="80">
                </el-table-column>
                <el-table-column prop="label" label="标准名称/内容">
                </el-table-column>
                <el-table-column label="分值">
                    <template slot-scope="scope">
                        <span>{{scope.row.children&&scope.row.children.length>0?'--':scope.row.score}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="检查状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.flag==true?'success':'danger'">{{scope.row.flag==true?'正常':'异常'}}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button @click="dialogPoint = false">关 闭</el-button>
            <el-button type="primary" @click="dialogPoint = false">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            list: null,
            listLoading: false,
            total: 0,
            listQuery: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: "+id"
            },
            dialogPoint: false,
            dialogPointData: null,
            selectForm: {
                startTime: "",
                endTime: "",
            }

        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            let data = {
                taskDataId: "",
                deptId: "",
                start: this.selectForm.startTime || "",
                end: this.selectForm.endTime || "",
                userName: "",
                page: this.listQuery.page,
                size: this.listQuery.limit,
            }
            this.$ajax.get(this.$URL + '/SysTask/GetCompleteList', {
                params: data
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.list = result.data.data
                    this.total = result.data.count
                }
            });
        },
        editData(row) {
            this.$ajax.get(this.$URL + '/SysTask/GetResultById', {
                params: {
                    id: row.Id
                }
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.dialogPointData = res.data
                    this.dialogPoint = true
                }
            });
        },
        itemStandard(item) {
            return JSON.parse(item)
        },
        handleCurrentChange(val) {
            this.listQuery.page = val
            this.getList();
        }

    }
}
</script>
