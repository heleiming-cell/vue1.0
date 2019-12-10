<template>
<div class="inspection-container">
    <div class="filter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="任务名称">
                <el-input v-model="formInline.Name" placeholder="任务名称" clearable=""></el-input>
            </el-form-item>
            <!-- <el-form-item label="执行组">
                <el-select v-model="formInline.TeamId" placeholder="维护组">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" max-height="calc(100% - 160px)">
        <el-table-column prop="Name" label="任务名称" align="center">
        </el-table-column>
        <!-- <el-table-column prop="CycleUnit" label="计划周期" align="center">
        </el-table-column> -->
        <el-table-column prop="Level" label="任务级别" align="center">

        </el-table-column>
        <el-table-column label="任务类型" align="center">
            <template slot-scope="scope">
                {{scope.row.Type==1?'现场巡检':'资产巡检'}}
            </template>
        </el-table-column>
        <el-table-column prop="TeamName" label="执行组" align="center">
        </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="detailData(scope.row)">查 看</el-button>
                <!-- <el-button type="text" size="small" @click="sendData(scope.row)" v-if="scope.row.State == 0">派 单</el-button> -->
                <el-button type="text" size="small" @click="reviewedData(scope.row)" v-if="scope.row.State == 3">审 核</el-button>
                <el-button type="text" style="color:#E98E8E" size="small" @click="refuseData(scope.row)" v-if="scope.row.State == 3">拒 绝</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- <div class="add-new">
        <el-button type="primary" @click="editData('new')" size="small">新建任务</el-button>
    </div> -->
    <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 派单 -->
    <el-dialog title="派单" :visible.sync="dialogVisible" width="500px" v-if="dialogVisible" v-el-drag-dialog>
        <el-form :model="dialogForm" :label-width="'120px'">
            <el-form-item label="接单人：">
                <Project cate="teamuser" :id="detailForm.TeamId"  @change="changeUser" />
            </el-form-item>
            <el-form-item label="完成时间：">
                <el-date-picker v-model="dialogForm.ComRemindTime" type="datetime"  placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitDialog" v-if="dialogForm.ComRemindTime && dialogForm.UserId">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 工单详情 -->
    <el-dialog title="工单详情" :visible.sync="detailVisible" v-if="detailVisible" v-el-drag-dialog>
        <div class="detailContent">
            <el-form :model="detailForm" :label-width="'120px'">
                <el-form-item label="巡检名称：">
                    {{detailForm.Name}}
                </el-form-item>
                <el-form-item label="巡检工单号：">
                    {{detailForm.Code}}
                </el-form-item>
                <el-form-item label="巡检级别：">
                    {{detailForm.Level}}
                </el-form-item>
                <el-form-item label="巡检项目：">
                    {{detailForm.ProjectName}}
                </el-form-item>
            </el-form>
            <div class="title">巡检点：</div>
            <el-table :data="detailForm.DataItems" style="width: 100%" max-height="300px">
                <el-table-column prop="DataName" label="巡检点">
                </el-table-column>
                <el-table-column prop="address" label="结果">
                    <template slot-scope="scope">
                        <span style="color:rgb(233, 233, 235)" type="info" v-if="scope.row.Result == 0">未巡检</span>
                        <span style="color:rgb(103, 194, 58)" type="success" v-if="scope.row.Result == 1">正常</span>
                        <span style="color:rgb(245, 108, 108)" type="warning" v-if="scope.row.Result == 2">异常</span>
                    </template>
                </el-table-column>
                <el-table-column label="完成时间">
                    <template slot-scope="scope">
                        {{scope.row.CompleteTime?scope.row.CompleteTime:'--'}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="title">巡检流程：</div>
            <div class="content-div">
                <el-timeline>
                    <el-timeline-item v-for="(activity, index) in flowDetail" :key="index" :timestamp="activity.CompleteTime" placement="top">
                        <div>
                            <el-button type="text">{{activity.Name}} </el-button> 进行：{{activity.Action}} 操作
                        </div>
                        <!-- <el-button type="text" @click="getDetail(activity)">查看详情</el-button> -->
                    </el-timeline-item>
                </el-timeline>
            </div>

        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="sendData(detailForm.Id)" type="primary" v-if="detailForm.IsPaySend == 0">派 单</el-button>
            <el-button @click="receiveData(detailForm.Id)" type="success" v-if="detailForm.IsReceive == 0">接 单</el-button>
            <el-button @click="detailVisible = false">取 消</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    inspectTask_List,
    inspectTask_Del,
    inspectTask_AddOrUpdate,
    inspectTask_QueryOne,
    inspectTask_TaskBindPlan,
    inspectTask_GetTaskPlan,
} from '@/api/inspectTask'
import {
    inspectPoint_QueryList,
} from '@/api/inspectPoint'
import {
    Standard_PageList,
} from '@/api/Standard'
import {
    inspectSheet_SendPayTask,
    inspectSheet_NotPayTaskList,
    inspectSheet_CheckSheet,
    inspectSheet_TaskDetail,
    inspectSheet_GetTaskFlowDetail,
    inspectSheet_ReceiveTask,
} from '@/api/inspectSheet'
import pagiNation from '@/components/common/pagination.vue'
import AllEnums from '@/components/filter/AllEnums'
import Project from '@/components/filter/Project'
import cron from './components/cron'
export default {
    components: {
        pagiNation,
        AllEnums,
        Project,
        cron
    },
    data() {
        return {
            formInline: {
                Name: '',
                TeamId: ''
            },
            listQuery: {
                page: 1,
                limit: 10,
                total: 0,
            },
            tableData: [],

            dialogVisible: false,
            dialogForm: {
                "Id": "",
                "UserId": "",
                "ComRemindTime": ""
            },
            detailVisible: false,
            detailForm: {},
            flowDetail: []

        }
    },
    mounted() {
        this.getList()
        // this.getPointList()
    },
    methods: {
        getPointList() {
            let data = {
                "Page": 1,
                "Size": 10000,
                "OrderBys": [],
                "Conditions": [],
            }
            inspectPoint_QueryList(data).then(res => {
                this.pointOptions = res.Data.Data
            })
            Standard_PageList(data).then(res => {
                this.standardOptions = res.Data.Data
            })
        },
        getList() {
            let data = {
                "Page": this.listQuery.page,
                "Size": this.listQuery.limit,
                "OrderBys": [],
                "Conditions": [{
                    "Key": "Name",
                    "Operator": 0,
                    "Value": this.formInline.Name
                }]
            }
            inspectSheet_NotPayTaskList(data).then(res => {
                this.tableData = res.Data.Data
                this.listQuery.total = res.Data.Count
            })
        },
        onSubmit() {
            this.listQuery.page = 1
            this.getList()
        },
        //查看 
        detailData(row) {
            let data = {
                id: row.Id
            }
            inspectSheet_GetTaskFlowDetail(data).then(res => {
                this.flowDetail = res.Data
            })
            inspectSheet_TaskDetail(data).then(res => {
                this.detailForm = res.Data
                this.detailVisible = true
            })
        },
        //派单
        sendData(Id) {
            this.dialogForm.Id = Id
            this.dialogVisible = true
        },
        //接单
        receiveData(Id) {
            this.$confirm('是否接单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                inspectSheet_ReceiveTask({
                    id: Id
                }).then(res => {
                    this.getList()
                    this.$message.success('操作成功')
                    this.detailVisible = false
                })
            }).catch(()=>{})

        },
        //审核
        reviewedData(row) {

            this.$confirm('是否同意本次巡检结果?', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    "Id": row.Id,
                    "IsCheck": 0,
                    "Remark": "审核通过"
                }
                inspectSheet_CheckSheet(data).then(res => {
                    this.getList()
                    this.$message.success('处理成功')
                })
            }).catch(() => {

               
            });
        },
        //拒绝
        refuseData(row){
             this.$prompt('请输入拒绝本次巡检结果的原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',

                }).then(({
                    value
                }) => {
                    let data = {
                        "Id": row.Id,
                        "IsCheck": 1,
                        "Remark": value
                    }
                    inspectSheet_CheckSheet(data).then(res => {
                        this.getList()
                        this.$message.success('处理成功')
                    })
                }).catch(() => {

                });
        },
        //选择接单人
        changeUser(val) {
            this.dialogForm.UserId = val
        },
        submitDialog() {
            let data = this.dialogForm
            inspectSheet_SendPayTask(data).then(res => {
                this.getList()
                this.$message.success('派单成功')
                this.dialogVisible = false
            })
        }

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

    .detailContent {
        max-height: 500px;
        overflow-y: scroll;

        .title {
            height: 30px;
            line-height: 30px;
            text-align: left;
        }
    }
}
</style><style lang="scss">
@import './css/common.scss';
</style>
