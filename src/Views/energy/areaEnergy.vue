<template>
<el-row :gutter="15" style="font-size:12px; margin:0 5px; height:calc(100% - 115px)">
    <el-col :xs="24" :sm="24" class="h100">
        <div class="chartheader">
            <span>区域选择</span>
            <el-select size="mini" style="margin-right:20px" v-model="area" clearable @change="search">
                <el-option v-for="(item,i) in areas" :key="i" :value="item.id+'|'+item.name" :label="item.name"></el-option>
            </el-select>
            <span class="charttime" @click.stop="changeDate('year')">年</span>
            <span class="bar">|</span>
            <span class="charttime" @click.stop="changeDate('month')">月</span>
            <span class="bar">|</span>
            <span class="charttime" @click.stop="changeDate('date')">日</span>
            <span class="bar">|</span>
            <el-date-picker type="year" v-show="datetype=='year'" size="mini" style="width:150px" v-model="startDate" placeholder="选择日期"></el-date-picker>
            <el-date-picker type="month" v-show="datetype=='month'" size="mini" style="width:150px" v-model="startDate" placeholder="选择日期"></el-date-picker>
            <el-date-picker type="date" v-show="datetype=='date'" size="mini" style="width:150px" v-model="startDate" placeholder="选择日期"></el-date-picker>
            <span v-show="show">-</span>
            <el-date-picker v-show="show" type="date" size="mini" style="width:150px" v-model="endDate" placeholder="选择日期"></el-date-picker>
            <div class="btngroup">
                <el-button type="primary" size="mini" @click="changeEnergy(1)">电</el-button>
                <el-button type="primary" size="mini" @click="changeEnergy(2)">水</el-button>
                <el-button type="primary" size="mini" @click="search">查询</el-button>
            </div>
            <!-- </div> -->
        </div>
        <el-row :gutter="10" class="row">
            <el-col :xs="24" :sm="12" :lg="12" class="h100">
                <el-card shadow="never">
                    <div slot="header" class="clearfix">
                        <span>能耗分析</span>
                    </div>
                    <div id="echart1" class="h100"></div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12" class="h100">
                <el-card shadow="never">
                    <div slot="header" class="clearfix">
                        <span>能耗统计分析</span>
                    </div>
                    <div class="circlelist h100">
                        <div>
                            <div class="tcircle center circle">
                                <div class="innercircle center">
                                    <span>同比 <i v-show="sum1>sum3" class="iconfont icon-icon-arrow-top4" style="color:red;"></i>
                                        <i v-show="sum1<sum3" class="iconfont icon-icon-arrow-btm4" style="color:green;"></i>
                                        {{ Math.abs(sum1-sum3).toFixed(2) }}</span><span>{{this.devicetype==1?'kwh':'m³'}}</span>
                                </div>
                            </div>
                            <div class="center hcircle circle">
                                <span>环比<i v-show="sum1>sum2" class="iconfont icon-icon-arrow-top4" style="color:red;"></i>
                                    <i v-show="sum1<sum2" class="iconfont icon-icon-arrow-btm4" style="color:green;"></i>{{ Math.abs(sum1-sum2).toFixed(2)}}</span><span>{{this.devicetype==1?'kwh':'m³'}}</span>
                            </div>
                        </div>
                        <div>
                            <span class="num">总能耗:{{sum1.toFixed(2)}}</span>
                            <span class="num">最大值:{{max.toFixed(2)}}</span>
                            <span class="num">最小值:{{min.toFixed(2)}}</span>
                            <span class="num">平均值:{{average.toFixed(2)}}</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="row" style="margin-top:10px">
            <el-col :xs="24" :sm="12" :lg="12" class="h100">
                <el-card shadow="never">
                    <div slot="header" class="clearfix">
                        <span>能耗分析</span>
                    </div>
                    <div id="areaechart" class="h100"></div>
                    <!-- <el-table :data="tableData" style="width: 100%;" height="100%" show-summary class="eltable">
                             <el-table-column prop="time" label="时间"></el-table-column>
                             <el-table-column prop="areaname" label="区域"></el-table-column>
                             <el-table-column prop="type" label="能耗类型"></el-table-column>
                             <el-table-column prop="val" :label="'能耗值('+(devicetype==1?'kwh':'m³')+')'"></el-table-column>
                         </el-table> -->
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12" class="h100">
                <el-card shadow="never">
                    <div slot="header" class="clearfix">
                        <span>能耗分解饼图</span>
                    </div>
                    <div id="echart2" class="h100"></div>
                </el-card>
            </el-col>
        </el-row>
    </el-col>
</el-row>
</template>

<script>
import {
    areaBarOption,
    areaPieOption,
    lineOption
} from "@/lib/chartConfig";
export default {
    name: "areaEnergy",
    data() {
        return {
            data: [],
            defaultProps: {
                children: "children",
                label: "label"
            },
            show: false,
            datetype: "date",
            startDate: new Date(),
            endDate: new Date(),
            areas: [],
            area: "",
            chart1: null,
            chart2: null,
            areaechart: null,
            devicetype: 1,
            tableData: [],
            max: 0,
            min: 0,
            average: 0,
            sum1: 0,
            sum2: 0,
            sum3: 0,
            data1:[],
            data2:[],
        };
    },
    mounted() {
        this.initChart();
        this.loadAreas();
        this.loadDeviceEnergys();
        this.loadAllAreaEnergys();
        this.loadSingleAreaEnergys();
        // this.loadAllAreaEnergys();
    },
    methods: {
        loadAreas() {
            this.$ajax
                .get(this.$URL + "/energy/GetAllArea")
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.areas = result.data.data;
                    }
                })
                .catch(err => {});
        },
        changeDate(val) {
            if (val === "custome") {
                this.datetype = "date";
                return;
            } else {
                this.datetype = val;
            }
        },
        initChart() {
            this.chart1 = this.$echarts.init(document.getElementById("echart1"));
            this.chart1.setOption(new areaBarOption().option);
            this.chart2 = this.$echarts.init(document.getElementById("echart2"));
            this.chart2.setOption(new areaPieOption().option);

            this.areaechart = this.$echarts.init(document.getElementById("areaechart"));
            let option = new lineOption().option;
            option.series.push({
                name: '',
                type: 'line',

                // smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                // showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(0,136,212)',
                        borderColor: 'rgba(0,136,212,0.2)',
                        borderWidth: 10
                    }
                },
                data: [120, 110, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150]
            })
            option.title.text = "";
            option.grid.top = "3%";
            this.areaechart.setOption(option);
        },
        changeEnergy(val) {
            this.devicetype = val;
            this.search();
        },
        getXaisData(option) {
            if (this.datetype == "date") {
                option.legend.data = [this.startDate.format("yyyy-MM-dd"), "上一天"];
                option.xAxis[0].data = [];
                for (let i = 0; i < 24; i++) {
                    option.xAxis[0].data.push(i + ":00");
                }
            } else if (this.datetype == "month") {
                option.legend.data = [this.startDate.format("yyyy-MM"), "上月当天"];
                option.xAxis[0].data = [];
                for (let i = 1; i <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++) {
                    option.xAxis[0].data.push(i + "日");
                }
            } else if (this.datetype == "year") {
                option.legend.data = [this.startDate.format("yyyy"), "去年同月"];
                option.xAxis[0].data = [];
                for (let i = 1; i <= 12; i++) {
                    option.xAxis[0].data.push(i + "月");
                }
            }
        },
        updatedChart(result) {
            let _this = this;
            let option = _this.chart1.getOption();
            this.getXaisData(option);
            option.series[0].data = this.data1;
            option.series[0].name = this.startDate.format("yyyy-MM-dd");
            option.series[1].data = this.data2;
            option.series[1].name = option.legend.data[1];
            _this.chart1.setOption(option);
        },
        updatedPieChart(result) {
            let _this = this;
            if (result.data.data && result.data.data.length > 0) {
                let option = _this.chart2.getOption();
                option.legend.data = [];
                let sum = 0;
                let data = [];
                result.data.data.forEach((v, i) => {
                    option.legend[0].data.push(v[1]);
                    sum += v[2] ? parseFloat(v[2]) : 0;
                    data.push({
                        name: v[1],
                        value: v[2]
                    });
                });
                option.title[0].subtext = sum.toFixed(2) + (this.devicetype == 1 ? 'kwh' : 'm³');
                //   option.series[0].data = result.data.data;
                option.series[0].data = data;
                _this.chart2.setOption(option);
            }
        },
        updatedLineChart(result) {
            let _this = this;
            if (result.data.data && result.data.data.length > 0) {
                let option = _this.areaechart.getOption();
                option.legend.data = [];

                option.series = [];
                this.getXaisData(option);
                result.data.data.forEach((v, i) => {
                    option.series.push({
                        name: v.Key,
                        type: 'line',
                        symbol: 'circle',
                        symbolSize: 5,
                        lineStyle: {
                            normal: {
                                width: 1
                            }
                        },
                        itemStyle: {
                            normal: {
                                // color: 'rgb(0,136,212)',
                                // borderColor: 'rgba(0,136,212,0.2)',
                                borderWidth: 10
                            }
                        },
                        data: v.Value[v.Key]
                    })
                });
                _this.areaechart.setOption(option, true);
            }
        },
        showTable(result) { //最大值 最小值 平局值 计算
            let _this = this;
            this.max = 0;
            this.min = 0;
            result.data.data1.forEach((v, i) => {
                if (i == 0) {
                    _this.min = v[1];
                }
                let obj = {
                    time: '',
                    type: _this.devicetype == 1 ? "电" : "水",
                    val: v[1],
                    areaname: this.area ? this.area.split('|')[1] : ''
                };
                if (_this.max < v[1]) {
                    _this.max = v[1];
                }
                if (_this.min > v[1]) {
                    _this.min = v[1];
                }
                if (_this.datetype === "date") {
                    obj.time = _this.startDate.format("yyyy-MM-dd") + " " + i + ":00";
                    _this.average = _this.sum1 / 24;
                } else if (_this.datetype === "month") {
                    obj.time = _this.startDate.format("yyyy-MM-") + (i + 1);
                    _this.average = _this.sum1 / new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
                } else if (_this.datetype === "year") {
                    obj.time = _this.startDate.format("yyyy-") + (i + 1);
                    _this.average = _this.sum1 / 12;
                }
                // _this.tableData.push(obj);
            });
        },
        loadDeviceEnergys() {
            let _this = this;
            this.$ajax
                .get(this.$URL + "/energy/GetDeviceEnergy", {
                    params: {
                        bt: this.startDate.format("yyyy-MM-dd") + " 00:00:00",
                        deviceType: this.devicetype,
                        dateType: this.datetype
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.updatedChart(result);

                        if (result.data.data1) {
                            _this.sum1=0;
                            _this.data1=[];
                            result.data.data1.forEach(v => {
                                _this.sum1 += v[1];
                                _this.data1.push(v[1])
                            });
                        }
                        if (result.data.data2) {
                             _this.sum2=0;
                            _this.data2=[];
                            result.data.data2.forEach(v => {
                                _this.sum2 += v[1];
                                _this.data2.push(v[1]);
                            });
                        }
                        if (result.data.data3) {
                             _this.sum3=0;
                            result.data.data3.forEach(v => {
                                _this.sum3 += v[1];
                            });
                        }
                        _this.tableData = [];
                        _this.showTable(result);
                    }
                })
                .catch(err => {});
        },
        loadAreaEnergys() {
            let _this = this;
            this.$ajax
                .get(this.$URL + "/energy/GetAreaEnergy", {
                    params: {
                        bt: this.startDate.format("yyyy-MM-dd") + " 00:00:00",
                        deviceType: this.devicetype,
                        dateType: this.datetype,
                        areaId: this.area.split('|')[0]
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.updatedChart(result);
                        _this.tableData = [];
                        _this.showTable(result);
                        this.sum1 = result.data.sum1;
                        this.sum2 = result.data.sum2;
                        this.sum3 = result.data.sum3;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        loadSingleAreaEnergys() {
            let _this = this;
            this.$ajax
                .get(this.$URL + "/energySearch/GetAreaTimeEnergy", {
                    params: {
                        bt: this.startDate.format("yyyy-MM-dd") + " 00:00:00",
                        deviceType: this.devicetype,
                        dateType: this.datetype,
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.updatedLineChart(result);
                        // _this.tableData = [];
                        // _this.showTable(result);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        loadAllAreaEnergys() {
            let _this = this;
            this.$ajax
                .get(this.$URL + "/energy/GetAllAreaEnergy", {
                    params: {
                        bt: this.startDate.format("yyyy-MM-dd") + " 00:00:00",
                        deviceType: this.devicetype,
                        dateType: this.datetype
                        // areaid: this.area
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.updatedPieChart(result);
                    }
                })
                .catch(err => {});
        },
        search() {
            if (this.area) {
                this.loadAreaEnergys();
            } else {
                this.loadDeviceEnergys();
            }
            this.loadAllAreaEnergys();
            this.loadSingleAreaEnergys();
        },
        dateFoucus() {

        }
    }
};
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
    display: flex;
    align-items: center;
    height: 48px;

    .bar {
        color: #1f4083;
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
            background: #0895c6 !important;
        }

        button:nth-of-type(2) {
            background: #d48265 !important;
        }

        button:nth-of-type(3) {
            background: #6977ee !important;
        }

        button:nth-of-type(4) {
            background: #1f4083 !important;
        }
    }

    // & /deep/  .el-popper{
    //     position: absolute;
    //     top: 153px;
    //     left: 368px;
    //     z-index: 2004;
    // }
}

.row {
    height: calc((100% - 58px) / 2);

    & /deep/ .el-card {
        height: 100%;
        background-color: transparent;
        border: 1px solid rgba(41, 45, 55, 1);
        color: white;
    }

    & /deep/ .el-card__header {
        border-bottom: 1px solid rgba(41, 45, 55, 1) !important;
        height: 52px;
    }

    & /deep/ .el-card__body {
        height: calc(100% - 52px);
        padding: 10px !important;
    }
}

.circlelist {
    >div:nth-of-type(1) {
        height: calc(100% - 20px);
        display: flex;
        justify-content: center;

        .circle {
            width: 200px;
            height: 200px;
            border-radius: 50%;
        }

        .tcircle {
            background: #2397a8;
            margin-right: 100px;

            .innercircle {
                width: 180px;
                height: 180px;
                background: #030d21;
                border-radius: 50%;
            }
        }

        .hcircle {
            background: #e24e30;
        }
    }

    >div:nth-of-type(2) {
        height: 20px;
        text-align: center;
    }
}

.row /deep/ .el-table__footer-wrapper tbody td,
.el-table__header-wrapper tbody td {
    background: #122447;
}

.num {
    margin-right: 10px;
    font-size: 16px;
}

.eltable {
    & /deep/ .el-table__header th {
        background: transparent;
    }

    & /deep/ .el-table__footer-wrapper tbody td {
        background: transparent;
    }
}
</style>
