<template>
<div class="inspection-container">
    <div class="num4 flex">
        <div class="flex">
            <div class="icon">
                <span class="iconfont icon-tianqizitiku43"></span>
            </div>
            <div class="content flex">
                <div class="num">{{allData.Total}}</div>
                <div class="text">巡检总次数</div>
            </div>
        </div>
        <div class="flex">
            <div class="icon">
                <span class="iconfont icon-chart" style="color:#65A8FF"></span>
            </div>
            <div class="content flex">
                <div class="num" style="color:#65A8FF">{{allData.DeviceTaskCount}}</div>
                <div class="text">资产巡检次数</div>
            </div>
        </div>
        <div class="flex">
            <div class="icon">
                <span class="iconfont icon-shujuku" style="color:#7D79B6"></span>
            </div>
            <div class="content flex">
                <div class="num" style="color:#7D79B6">{{allData.PointTaskCount}}</div>
                <div class="text">现场巡检次数</div>
            </div>
        </div>
        <div class="flex">
            <div class="icon">
                <span class="iconfont icon-jinggao" style="color:#F3B75F"></span>
            </div>
            <div class="content flex">
                <div class="num" style="color:#F3B75F">{{allData.UnqualifiedCount}}</div>
                <div class="text">不合格次数</div>
            </div>
        </div>
    </div>
    <div class="echart flex">
        <div>
            <div class="title">月巡检趋势</div>
            <div class="content-div">
                <lineChart :eData="lineChart" />
            </div>
        </div>
        <div>
            <div class="title">巡检动态 <span @click="goRoute">查看更多</span></div>
            <div class="content-div" style="overflow-y: scroll;">
                <el-timeline>
                    <el-timeline-item v-for="(activity, index) in allData.LastFourSheet" :key="index" :timestamp="activity.CompleteTime" placement="top">
                        <div><el-button type="text">{{activity.Name}}</el-button>： 完成了一次巡检</div>
                        <el-button type="text" @click="getDetail(activity)">查看详情</el-button>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </div>
    </div>
     <!-- 巡检记录详情 -->
    <el-dialog title="巡检记录详情" :visible.sync="dialogVisible" width="600px" v-if="dialogVisible" v-el-drag-dialog>
        <div class="dialogDetail">
            <el-form :model="dialogForm" :label-width="'120px'">
                <el-form-item label="任务名称：">
                    {{dialogForm.Name}}
                </el-form-item>
                <el-form-item label="巡检人员：">
                    {{dialogForm.CompleterName}}
                </el-form-item>
                <el-form-item label="维护组：">
                    {{dialogForm.CompleterName}}
                </el-form-item>
                <el-form-item label="创建时间：">
                    {{dialogForm.CreateTime}}
                </el-form-item>
                <el-form-item label="完成时间：">
                    {{dialogForm.CompleteTime?dialogForm.CompleteTime:'--'}}
                </el-form-item>
                <el-table :data="dialogForm.DataItems" style="width: 100%" max-height="300" v-if="dialogForm.DataItems&& dialogForm.DataItems.length>0">
                    <el-table-column prop="DataName" label="巡检点" align="center"></el-table-column>
                    <el-table-column prop="CompleteTime" label="完成时间" align="center">
                        <template slot-scope="scope">
                            {{scope.row.CompleteTime?scope.row.CompleteTime:'--'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="结果" align="center">
                        <template slot-scope="scope">
                            <span style="color:rgb(233, 233, 235)" type="info" v-if="scope.row.Result == 0">未巡检</span>
                            <span style="color:rgb(103, 194, 58)" type="success" v-if="scope.row.Result == 1">正常</span>
                            <span style="color:rgb(245, 108, 108)" type="warning" v-if="scope.row.Result == 2">异常</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="getPointDetail(scope.row)">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-form-item label="备注：">
                <el-input v-model="dialogForm.Description" autocomplete="off"></el-input>
            </el-form-item> -->
            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <!-- <el-button type="primary" @click="submitDialog">确 定</el-button> -->
        </div>
    </el-dialog>
    <!-- 巡检点记录详情 -->
    <el-dialog title="巡检点记录详情" :visible.sync="detailVisible" v-if="detailVisible" v-el-drag-dialog>
        <el-form :model="detailData" :label-width="'120px'">
            <el-form-item label="巡检照片：">
                <el-image style="width: 100px; height: 100px" v-for="(item,index) in detailData.ImageItems" :key="index" :src="URL+'/'+item" :preview-src-list="getImageItems(detailData.ImageItems)">
                </el-image>
            </el-form-item>
            <el-form-item label="巡检备注：">
                {{detailData.Remark?detailData.Remark:'--'}}
            </el-form-item>
        </el-form>
        <el-collapse>
            <el-collapse-item :title="item.Name" :name="index" v-for="(item,index) in detailData.StandardItems" :key="index">
                <el-table v-if="item.Content" :data="JSON.parse(item.Content)" style="width: 100%">
                    <el-table-column prop="Name" label="巡检内容" align="center"> </el-table-column>
                    <el-table-column prop="Result" label="巡检结果" align="center">
                        <template slot-scope="scope">
                            <span style="color:rgb(233, 233, 235)" type="info" v-if="scope.row.Result == 0">未巡检</span>
                            <span style="color:rgb(103, 194, 58)" type="success" v-if="scope.row.Result == 1">正常</span>
                            <span style="color:rgb(245, 108, 108)" type="warning" v-if="scope.row.Result == 2">异常</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>
        <div slot="footer" class="dialog-footer">
            <el-button @click="detailVisible = false">关 闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    inspectSheet_InspectCount,
    inspectSheet_List,
    inspectSheet_TaskDetail,
    inspectSheet_GetInspectAsk
} from '@/api/inspectSheet'
import lineChart from './components/lineChart'
export default {
    components: {
        lineChart
    },
    computed: {
        lineChart() {
            let arr = {
                data: [],
                Hour: [],
            }
            if (this.allData.MonthCount) {
                for (let item in this.allData.MonthCount) {
                    arr.data.push(this.allData.MonthCount[item])
                    arr.Hour.push(item)
                }
            }

            return arr
        }
    },
    data() {
        return {
            URL: this.$Order,
            allData: {
                "Total": 0,
                "DeviceTaskCount": 0,
                "PointTaskCount": 0,
                "UnqualifiedCount": 0,
                "MonthCount": null,
                "LastFourSheet": []
            },
            dialogVisible: false,
            dialogForm: {
                "CompleterId": "",
                "CompleterName": "",
                "CreateTime": "",
                "Name": "",
                "TaskId": "",
                "CompleteTime": "",
                "ProjectId": "",
                "ProjectName": "",
                "Description": "",
                "TeamId": "",
                "PlanCompleteTime": "",
                "TeamName": "",
                "DistributederId": "",
                "Type": "",
                "DistributedRoleId": "",
                "State": "",
                "Code": "",
                "Id": "",
                "CompleteRate": "",
                "Level": "",
                "IsPaySend": "",
                "IsReceive": "",
                "IsComplete": "",
                "Result": "",
                "CompleteState": "string",
                "DataItems": []
            },
            detailVisible: false, //记录详情
            detailData: null,
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            inspectSheet_InspectCount().then(res => {
                this.allData = res.Data
            })
        },
        //查看巡检详情
        getDetail(row) {
            inspectSheet_TaskDetail({
                id: row.Id
            }).then(res => {
                this.dialogForm = res.Data
                this.dialogVisible = true
            })

        },
        //查看巡检点详情
        getPointDetail(row) {
            let data = {
                id: row.TaskId,
                qrCode: row.DataId,
            }
            inspectSheet_GetInspectAsk(data).then(res => {
                this.detailData = res.Data
                this.detailVisible = true
            })
        },
        //处理图片
        getImageItems(arr) {
            let item = []
            arr.forEach(i => {
                let url = this.$Order + '/' + i
                item.push(url)
            });

            return item
        },
        //查看更多
        goRoute(){
            this.$router.push('/record')
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
    width: 100%;

    .num4 {
        height: 148px;
        width: 100%;

        >div {
            flex: 1;
            margin: 0 15px;
            height: 100%;
            border: 1px solid rgba(40, 68, 119, 1);
            justify-content: space-around;

            >div {
                height: 70px;

                &.icon {
                    width: 80px;

                    >span {
                        font-size: 70px;
                        color: #43B548;
                    }
                }

                &.content {
                    width: 100px;
                    flex-wrap: wrap;

                    .num {
                        height: 40px;
                        font-size: 38px;
                        color: #43B548;
                        width: 100%;
                    }

                    .text {
                        font-size: 12px;
                        color: #BCD6FA;
                    }
                }
            }
        }
    }

    .echart {
        margin-top: 20px;
        height: calc(100% - 170px);
        width: calc(100% -30px);
        padding: 0 15px;

        >div {
            flex: 1;
            height: 100%;
            border: 1px solid rgba(40, 68, 119, 1);

            &:first-child {
                margin-right: 15px;
            }

            .title {
                height: 50px;
                line-height: 50px;
                width: calc(100% - 10px);
                padding-left: 10px;
                text-align: left;
                color: white;

                >span {
                    color: #7CAFFB;
                    float: right;
                    margin-right: 10px;
                    cursor: pointer;
                }
            }

            .content-div {
                height: calc(100% - 50px);
            }
        }
    }
}
</style><style lang="scss">
@import './css/common.scss';
</style>
