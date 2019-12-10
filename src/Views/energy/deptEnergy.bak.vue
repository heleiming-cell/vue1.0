<template>
<el-row :gutter="1"  style="font-size:12px; margin:0 5px; height:calc(100% - 115px)">
    <!-- <div class="header">
        <span style="color: #325fb8"><i class="iconfont icon-shouye"></i>能源管理></span><span style="color:#08abff;">部门能耗</span></span>
    </div> -->
    <el-col :xs="24" :sm="3" class="h100">
        <div class="menuheader">
            <div><span>部门树</span></div>
        </div>
        <!-- @check-change="handleCheckChange" -->
        <el-tree node-key="key" ref="tree" show-checkbox check-strictly :data="data" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="24" :sm="21" class="h100">
        <div class="chartheader">
            <div><span class="charttitle">区域能耗</span></div>
            <div>
                <span class="charttime" @click="changeDate('year')">年</span><span class="bar">|</span><span class="charttime" @click="changeDate('month')">月</span><span class="bar">|</span><span class="charttime" @click="changeDate('date')">日</span><span class="bar">|</span><span class="charttime" @click="changeDate('custome')">自定义</span>
                <el-date-picker :type="datetype" size="mini" style="width:150px" v-model="startDate" placeholder="选择日期">
                </el-date-picker>
                <span v-show="show">-</span>
                <el-date-picker v-show="show" type="date" size="mini" style="width:150px" v-model="endDate" placeholder="选择日期">
                </el-date-picker>
                <div class="btngroup">
                    <el-button type="primary" size="mini">电</el-button>
                    <el-button type="primary" size="mini">水</el-button>
                    <el-button type="primary" size="mini">气</el-button>
                    <el-button type="primary" size="mini">查询</el-button>
                </div>
            </div>
        </div>
        <div class="chart">
            <ve-line :data="chartData" height="100%" :extend="legend" :settings="chartSettings"></ve-line>
        </div>
    </el-col>
</el-row>
</template>

<script>
export default {
    name: 'areaEnergy',
    data() {
        this.chartSettings = {
            stack: {
                '用户': ['电', '水']
            },
            //  xAxisType: 'time',
            area: true
        }
        this.legend = {

            title: {},
            // series: {
            //     barMaxWidth: 40
            // },
            textStyle: {
                color: '#AAB5C9'
            },
            legend: {
                textStyle: {
                    color: 'red'
                },
                show: false
            },
            yAxis(item) {
                Object.assign(item[0], {
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#13316B'
                        }
                    }
                })
                return item
            },
            xAxis: {
                boundaryGap: false,
                axisLabel: {
                    rotate: 45
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#13316B'
                    }
                }
            }
        };
        return {
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            show: false,
            datetype: 'date',
            startDate: new Date(),
            endDate: new Date(),
            chartData: {
                columns: ['日期', '电', '水', '气'],
                rows: [{
                        '日期': '2015',
                        '电': 1393,
                        '水': 1093,
                        '气': 0.32
                    },
                    {
                        '日期': '2016',
                        '电': 3530,
                        '水': 3230,
                        '气': 0.26
                    },
                    {
                        '日期': '2017',
                        '电': 2923,
                        '水': 2623,
                        '气': 0.76
                    },
                    {
                        '日期': '2018',
                        '电': 1723,
                        '水': 1423,
                        '气': 0.49
                    },
                    {
                        '日期': '2019',
                        '电': 3792,
                        '水': 3492,
                        '气': 0.323
                    },
                    {
                        '日期': '2020',
                        '电': 4593,
                        '水': 4293,
                        '气': 0.78
                    }
                ]
            }
        }
    },
    mounted() {
        this.loadTree();
    },
    methods: {
        loadTree() {
            this.$ajax.get(this.$URL + '/energy/GetDeptTree').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.data = result.data.data;
                }
            }).catch((err) => {

            });
        },

        changeDate(val) {
            if (val === "custome") {
                this.datetype = "date";
                this.show = true;
                return;
            } else {
                this.datetype = val;
                this.show = false;
            }
        }
    }
}
</script>

<style lang="less" scoped>
.header {
    border-bottom: 1px solid rgba(33, 61, 112, 1);
}

.menuheader {
    line-height: 36px;
    vertical-align: middle;
    padding: 0 10px;
    overflow: hidden;
    background: #010308;
    color: rgba(56, 151, 244, 1);
}

.chartheader {
    border-bottom: 1px solid rgba(32, 54, 93, 1);
    padding-bottom: 10px;

    .charttitle {
        font-size: 16px;
        font-weight: 400;
        color: rgba(56, 151, 244, 1);
        line-height: 32px;
    }

    .bar {
        color: #1F4083;
        font-weight: 600;
        margin-right: 5px;
        font-size: 16px;
    }

    .charttime {
        margin-right: 5px;
        font-size: 16px;
        cursor: pointer;
    }

    .btngroup {
        margin-left: 15px;
        display: inline-block;

        button {
            margin: 0 5px;
        }

        button:nth-of-type(1) {
            background: #0895C6 !important;
        }

        button:nth-of-type(2) {
            background: #D48265 !important;
        }

        button:nth-of-type(3) {
            background: #6977EE !important;
        }

        button:nth-of-type(4) {
            background: #1F4083 !important;
        }
    }
}

.chart {
    height: calc(100% - 121px);
    // padding-bottom: 50px;
}
</style>
