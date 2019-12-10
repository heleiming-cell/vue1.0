<template>
<el-row class="alarmbody">
    <el-row style="height:40%">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" class="h100">
            <el-row :gutter="20" style="height:100%">
                <el-col :xs="24" :sm="24" :md="8" :lg="8" v-for="(item,i) in listdata" :key="i">
                    <div class="itemcol">
                        <div class="itemleft">
                            <div><span>{{item[0]+item[1]+item[2]}}</span><br><span>{{source[i]}}</span></div>
                        </div>
                        <div class="itemright">
                            <img src="@/static/images/alarm.png">
                            <div>
                                <div>{{item[0]}}</div>
                                <div>{{item[1]}}</div>
                                <div>{{item[2]}}</div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" class="h100">
            <div class="alarmchart">
                <ve-line height="100%" :grid="grid" :extend="legend" :data="chartData" :settings="chartSettings"></ve-line>
            </div>
        </el-col>
    </el-row>
    <el-row style="height:60%;padding-top:10px;">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" class="titlebar">
            <div >
                <span>实时报警</span>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" style="height:calc(100% - 48px)">
                <el-table :data="tableData" style="width: 100%;" height="calc(100% - 36px)" class="tablebody">
                    <el-table-column prop="DateTime" label="报警时间">
                    </el-table-column>
                    <el-table-column prop="Source" label="报警类型">
                        <template slot-scope="scope">
                         <span>{{source1[scope.row.Source]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="Var" label="设备名称">
                    </el-table-column>
                    <el-table-column prop="VarDesc" label="设备描述">
                    </el-table-column>
                    <el-table-column prop="Desc" label="报警内容">
                    </el-table-column>
                </el-table>
                <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>
        </el-col>
    </el-row>
</el-row>
</template>

<script>
import pagination from '@/components/common/pagination'
export default {
    name: 'alarmStatistics',
    components: {
        'pagination': pagination
    },
    data() {
        this.legend = {
            textStyle: {
                color: '#AAB5C9'
            },
            legend: {
                textStyle: {
                    color: '#AAB5C9'
                },
            },
            bottom: 0,
            xAxis: {
                boundaryGap: false,
            }
        };
        this.grid = {
            bottom: 0
        }
        this.chartSettings = {
            labelMap: {
                d: '时间',
                L1: '普通',
                L2: '严重',
                L3: '紧急',

            },
            area: true,
        }
        return {
            tableData: [],
            total: 0,
            currentPage: 1,
            chartData: {
                columns: ['d', 'L1', 'L2', 'L3'],
                rows: []
            },
            listdata: [],
            source1: ['普通事件', '防盗报警', '门禁报警', '视频报警', '火灾报警', '求助报警', '设备报警', '故障报警', '普通报警', '电流报警','电压报警','温度报警','功率报警'],
            source: ['普通事件', '防盗报警', '门禁报警', '火灾报警', '设备报警', '故障报警', '电流报警','电压报警','温度报警'],


        }
    },
    // computed:{
    //    sourceData(){
    //       return this.listdata.filter((v,i)=>{
    //            return i!==3&&i!=5&&i!=8&&i!=12
    //       });
    //    }
    // },
    mounted() {
        this.loadRealData();
        this.LoadAlarmData();
    },
    methods: {
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadRealData();
        },
        loadRealData() {
            this.$ajax.get(this.$URL + '/alarm/AllRtAlarm', {
                params: {
                    size: 10,
                    page: this.currentPage,
                    alarmType: ''
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.tableData = result.data.data;
                    this.total = result.data.count;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        LoadAlarmData() {
            this.$ajax.get(this.$URL + '/alarm/PingAlarm').then((result) => {
                if (result.status === 200) {
                    this.chartData.rows = result.data.chartData;

                    result.data.data.push({
                        1: 0,
                        2: 0,
                        3: 0
                    });

                    this.listdata = result.data.data.splice(0,9);
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }
}
</script>

<style lang="less" scoped>
.alarmbody {
    // width: 100%;
    height: calc(100% - 115px);
    // margin: 0 !important;
    font-size: 12px;
    padding: 5px;
    overflow: hidden;
    >div{
        overflow-y: auto;
        overflow-x: hidden;
    }
    & /deep/ .el-row:nth-of-type(1) {
        height: 40%;

    }
     & /deep/ .el-row:nth-of-type(1) .el-col:nth-of-type(1) .el-row .el-col {
        height: 33.33%;
    }
    & /deep/ .el-row:nth-of-type(2) {
        height: 60%;
    }

    .itemcol {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border: 1px solid rgba(41, 87, 174, 1);
        display: flex;
        flex-wrap: nowrap;
        box-sizing: border-box;
        justify-content: space-between;
        padding: 13px 18px 15px 19px;
        overflow: hidden;

        .itemleft {
            span {
                &:nth-of-type(1) {
                    width: 14px;
                    height: 22px;
                    font-size: 27px;
                    font-family: MicrosoftYaHei;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);

                }

                &:nth-of-type(2) {
                    width: 75px;
                    height: 19px;
                    font-size: 19px;
                    font-family: MicrosoftYaHei;
                    font-weight: 400;
                    color: rgba(170, 181, 201, 1);
                }
            }
        }

        .itemright {
            display: flex;

            img {
                height: 48px;
                width: 48px;
                margin-right: 23px;
            }

            >div {
                >div {
                    text-align: center;
                    width: 16px;
                    height: 16px;
                    opacity: 0.8;
                    border-radius: 4px;

                    &:nth-of-type(1) {
                        background: rgba(230, 0, 18, 1);
                    }

                    &:nth-of-type(2) {
                        background: #F39C12;
                        margin: 7px 0;
                    }

                    &:nth-of-type(3) {
                        background: #2957AE;
                    }
                }
            }
        }
    }

    .itemrow {
        display: flex;

        // .itemcol+.itemcol {
        //     margin-left: 20px;
        // }
    }

    .itemrow+.itemrow {
        margin-top: 20px;
    }

    .alarmchart {
       min-height: 150px;
       height: 100%;
       width: 100%;
    }

    .titlebar {
        // margin: 30px 0 18px 0;
        height: 48px;
        background: rgba(21, 43, 84, 1);
        opacity: 0.8;

        span {
            width: 75px;
            height: 19px;
            font-size: 19px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 53px;

        }

    }

}
</style>
