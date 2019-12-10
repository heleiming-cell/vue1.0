<template>
<!-- 工单总揽 -->
<div class="overviewContainer tableScrollbar">
    <el-row class="overviewRow">
        <!-- 标题 -->
        <el-col>
            <el-row type="flex" justify="space-between">
                <el-col class="overview-header">
                    <div>工单概览</div>
                </el-col>
                <el-col class="overview-header">
                    <el-button size="mini" :type="time=='日'?primary:''" @click="time='日'">今日</el-button>
                    <el-button size="mini" :type="time=='月'?primary:''" @click="time='月'">本月</el-button>
                </el-col>
            </el-row>
        </el-col>
        <!-- 工单小卡片 -->
        <el-col>
            <el-row type="flex" justify="space-around">
                <el-col class="overview-card" :span="7">
                    <el-row>
                        <el-col :span="8" class="overview-icon">
                            <i class="iconfont icon-tongji"></i>
                        </el-col>
                        <el-col :span="16" class="overview-nunber">
                            <div>总工单数</div>
                            <div>{{count}}</div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col class="overview-card" :span="7">
                    <el-row>
                        <el-col :span="8" class="overview-icon">
                            <i class="iconfont icon-shijianriqi"></i>
                        </el-col>
                        <el-col :span="16" class="overview-nunber">
                            <div>已处理工单数</div>
                            <div>{{Complete}}</div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col class="overview-card" :span="7">
                    <el-row>
                        <el-col :span="8" class="overview-icon">
                            <i class="iconfont icon-shijianfenlei"></i>
                        </el-col>
                        <el-col :span="16" class="overview-nunber">
                            <div>处理中工单数</div>
                            <div>{{UnComplete}}</div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-col>
        <!-- 工单图表 -->
        <el-col class="voerviewStatement">
            <el-row type="flex" justify="space-between" class="voerviewStatementCol">
                <!-- 左边柱状图型表 -->
                <el-col class="overview-echart">
                    <el-row>
                        <el-col class="overview-echart-header">各部门工单完成数汇总</el-col>
                        <el-col class="overview-echart-btn">
                            <el-button size="mini" :type="echartTime=='日'?echartprimary:''" @click="echartTime='日'">今日</el-button>
                            <el-button size="mini" :type="echartTime=='月'?echartprimary:''" @click="echartTime='月'">本月</el-button>
                        </el-col>
                    </el-row>
                    <el-row class="echartRow">
                        <el-col class="echartClass">
                            <consumptionChart :echartColor="echartColor" :echartXDate="echartXDate" :echartTitle="echartTitle" :splitNumber="splitNumber" :echartDate="echartDate">
                            </consumptionChart>
                        </el-col>
                    </el-row>
                </el-col>
                <!-- 右边表格 -->
                <el-col class="overview-table">
                    <el-row type="flex" justify="space-between">
                        <el-col class="overview-table-header">工单完成记录</el-col>
                        <el-col class="overview-table-header">More</el-col>
                    </el-row>
                    <el-row class="overview-table-box">
                        <el-col class="overViewtTable">
                            <el-table :data="tableData" :header-cell-style="{background:'#0A396C',color:'#528EFA'}">
                                <el-table-column label="姓名" prop="CompleteUserName" align="center"></el-table-column>
                                <el-table-column label="部门" prop="TeamNam" align="center"></el-table-column>
                                <el-table-column label="工单号" prop="Number" align="center"></el-table-column>
                                <el-table-column label="完成时间" prop="CompleteTime" align="center"></el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</div>
</template>

<script>
import consumptionChart from "@/components/echarts/consumptionChart";

export default {
    components: {
        consumptionChart
    },
    data() {
        return {
            time: "日",
            echartTime: "日",
            primary: "primary",
            echartprimary: "primary",
            count: "",
            Complete: "",
            UnComplete: "",
            tableData: [],
            echartColor: ['#5ADC9C', '#FFD75C', '#FF7A78', '#72BEFF', '#B39EFF', '#FF99E0', '#D58B81'],
            echartDate: [],
            echartXDate: [],
            echartTitle: "",
            splitNumber: 100,
        };
    },
    methods: {
        getList() {
            this.getoverviewList(this.time)
        },
        // 工单总数统计
        getoverviewList(params) {
            this.$ajax.post(this.$Order + `/sys/WorkFlow/IndexTotalData?date=${params}`).then(res => {
                this.count = res.data.Data.Count;
                this.Complete = res.data.Data.Complete;
                this.UnComplete = res.data.Data.UnComplete;
            });
        },
        getTeamDataList() {
            this.getTeamData(this.echartTime)
        },
        // 维护统计
        getTeamData(params) {
            this.$ajax.post(this.$Order + `/sys/WorkFlow/IndexTeamData?date=${params}`).then(res => {
                res.data.Data.forEach(element => {
                    this.echartXDate.push(element.Name)
                    this.echartDate.push(element.Count)
                });
            })
        },
        // 工单完成记录
        getTableList() {
            this.$ajax.get(this.$Order + `/sys/WorkFlow/IndexListData`).then(res => {
                this.tableData = res.data.Data;
            })
        },
    },
    mounted() {
        this.getList();
        this.getTeamDataList();
        this.getTableList()
    },
    watch: {
        time(n) {
            this.getoverviewList(n)
        },
        echartTime(n) {
            this.echartXDate = [];
            this.echartDate = [];
            this.getTeamData(n)
        }
    }
};
</script>

<style lang="scss" scoped>
.overviewContainer {
    padding: 10px;
    color: #ffffff;
    font-size: 12px;
    height: calc(100% - 115px);

    .overviewRow {
        height: 100%;

        .voerviewStatement {
            height: calc(100% - 207px);

            .voerviewStatementCol {
                height: 100%;
            }
        }
    }

    .overview-header {
        padding: 0 30px 20px 30px;

        &:first-child {
            text-align: left;
        }

        &:last-child {
            text-align: right;
        }
    }

    .overview-card {
        height: 159px;
        background: #154398;

        .overview-icon {
            text-align: right;

            .icon-tongji,
            .icon-shijianriqi,
            .icon-shijianfenlei {
                font-size: 120px;
                line-height: 159px;
            }

            .icon-shijianriqi {
                color: #1BD450;
            }

            .icon-shijianfenlei {
                color: #EA6A6A;
            }
        }

        .overview-nunber {
            text-align: left;
            padding-left: 50px;
            margin-top: 30px;

            div:first-child {
                font-size: 30px;
                color: #dbe1ec;
            }

            div:last-child {
                font-size: 63px;
                color: #8bb3ff;
            }
        }
    }

    .overview-echart {
        .overview-echart-header {
            text-align: left;
            padding: 20px 0 0 30px;
        }

        .overview-echart-btn {
            text-align: right;
            padding-right: 35px;
        }
    }

    .overview-table {
        .overview-table-box {
            height: calc(100% - 48px);
        }

        .overview-table-header {
            padding-top: 20px;

            &:first-child {
                text-align: left;
                padding-left: 30px;
            }

            &:last-child {
                text-align: right;
                padding-right: 30px;
            }
        }
    }

    .overViewtTable {
        margin-top: 10px;
        height: 99%;
        overflow: hidden;
    }
}

.echartRow {
    height: calc(100% - 70px);

    .echartClass {
        height: 100%;
    }
}

.barChart {
    height: 98% !important;
}

.el-table::before {
    background: none;
}

.el-table {
    height: 96.5%;
    background: #061422;
    border: 1px solid #0A396C;
    overflow-y: auto;
}
</style>
