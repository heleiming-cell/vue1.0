<template>
<div class="ghy-box">
    <div class="search">
        <div class="chartheader">
            <span class="charttime" @click="changeDate('year')">年</span>
            <span class="bar">|</span>
            <span class="charttime" @click="changeDate('month')">月</span>
            <span class="bar">|</span>
            <span class="charttime" @click="changeDate('date')">日</span>
            <span class="bar">|</span>
            <el-date-picker type="year" v-show="datetype=='year'" size="mini" style="width:150px" v-model="startDate" placeholder="选择日期"></el-date-picker>
            <el-date-picker type="month" v-show="datetype=='month'" size="mini" style="width:150px" v-model="startDate" placeholder="选择日期"></el-date-picker>
            <el-date-picker type="date" v-show="datetype=='date'" size="mini" style="width:150px" v-model="startDate" placeholder="选择日期"></el-date-picker>

            <div class="btngroup">
                <el-button type="primary" size="mini" @click="search">查询</el-button>
            </div>
            <!-- </div> -->
        </div>
        <div class="btn">
            <el-button type="primary" size="mini" @click="changeDeviceType(1)">电</el-button>
            <el-button type="primary" size="mini" @click="changeDeviceType(2)">水</el-button>
        </div>
    </div>
    <!-- <div class=""> -->
    <el-row :gutter="10" class="boxbody">
        <el-col :xs="24" :sm="24" :md="9" :lg="9" class="h100">
            <div class="chart">
                <!-- //分项趋势 -->
                <div id="statisChart1" class="h100"></div>
                <!-- <ve-histogram height="100%" :data="barData" :colors="totalcolor" :extend="legend"></ve-histogram> -->
            </div>
            <div class="energyList">
                <span>分项能耗</span>
                <div class="energy">
                    <div class="itemrow">
                        <div class="item">
                            <div>
                                <i class="iconfont icon-xinfeng"></i>
                            </div>
                            <div>
                                <div class="span1">{{category.category1[0][1]}}</div>
                                <div class="span2">{{category.category1[0][2]}}</div>
                                <div class="span3">环比 <i class="iconfont " :class="[category.category1[0][2]-category.category2[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(category.category1[0][2]-category.category2[0][2])*100/category.category1[0][2]).toFixed(2)}}%</div>
                                <div class="span3">同比 <i class="iconfont " :class="[category.category1[0][2]-category.category3[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(category.category1[0][2]-category.category3[0][2])*100/category.category1[0][2]).toFixed(2)}}%</div>
                            </div>
                        </div>
                        <div class="item" v-if="category.category1[1]">
                            <div style="background:#26488C">
                                <i class="iconfont icon-chazuo"></i>
                            </div>
                            <div>
                                <div class="span1">{{category.category1[1][1]}}</div>
                                <div class="span2">{{category.category1[1][2]}}</div>
                                <div class="span3">环比 <i class="iconfont " :class="[category.category1[1][2]-category.category2[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(category.category1[1][2]-category.category2[0][2])*100/category.category1[1][2]).toFixed(2)}}%</div>
                                <div class="span3">同比 <i class="iconfont " :class="[category.category1[1][2]-category.category3[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(category.category1[1][2]-category.category3[0][2])*100/category.category1[1][2]).toFixed(2)}}%</div>
                            </div>
                        </div>
                        <div class="item" v-if="category.category1[4]">
                            <div style="background:#0895c6">
                                <i class="iconfont icon-kongtiao"></i>
                            </div>
                            <div>
                                <div class="span1">{{category.category1[4][1]}}</div>
                                <div class="span2">{{category.category1[4][2]}}</div>
                                <div class="span3">环比 <i class="iconfont " :class="[category.category1[4][2]-category.category2[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(category.category1[4][2]-category.category2[0][2])*100/category.category1[4][2]).toFixed(2)}}%</div>
                                <div class="span3">同比 <i class="iconfont " :class="[category.category1[4][2]-category.category3[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(category.category1[4][2]-category.category3[0][2])*100/category.category1[4][2]).toFixed(2)}}%</div>
                            </div>
                        </div>
                    </div>
                    <div class="itemrow">
                        <div class="item" v-if="category.category1[2]">
                            <div style="background:#D48265;">
                                <i class="iconfont icon-zhaoming1"></i>
                            </div>
                            <div>
                                <div class="span1">{{category.category1[2][1]}}</div>
                                <div class="span2">{{category.category1[2][2]}}</div>
                                <div class="span3">环比 <i class="iconfont " :class="[category.category1[2][2]-category.category2[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(category.category1[2][2]-category.category2[0][2])*100/category.category1[2][2]).toFixed(2)}}%</div>
                                <div class="span3">同比 <i class="iconfont " :class="[category.category1[2][2]-category.category3[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(category.category1[2][2]-category.category3[0][2])*100/category.category1[2][2]).toFixed(2)}}%</div>
                            </div>
                        </div>
                        <div class="item" v-if="category.category1[3]">
                            <div style="background:#6977EE">
                                <i class="iconfont icon-teshuyongdian"></i>
                            </div>
                            <div>
                                <div class="span1">{{category.category1[3][1]}}</div>
                                <div class="span2">{{category.category1[3][2]}}</div>
                                <div class="span3">环比 <i class="iconfont " :class="[category.category1[3][2]-category.category2[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(category.category1[3][2]-category.category2[0][2])*100/category.category1[3][2]).toFixed(2)}}%</div>
                                <div class="span3">同比 <i class="iconfont " :class="[category.category1[3][2]-category.category3[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(category.category1[3][2]-category.category3[0][2])*100/category.category1[3][2]).toFixed(2)}}%</div>
                            </div>
                        </div>
                        <div class="item" v-if="category.category1[5]">
                            <div style="background:#D48265">
                                <i class="iconfont icon-shuibeng2"></i>
                            </div>
                            <div>
                                <div class="span1">{{category.category1[5][1]}}</div>
                                <div class="span2">{{category.category1[5][2]}}</div>
                                <div class="span3">环比 <i class="iconfont " :class="[category.category1[5][2]-category.category2[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(category.category1[5][2]-category.category2[0][2])*100/category.category1[5][2]).toFixed(2)}}%</div>
                                <div class="span3">同比 <i class="iconfont " :class="[category.category1[5][2]-category.category3[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(category.category1[5][2]-category.category3[0][2])*100/category.category1[5][2]).toFixed(2)}}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="9" :lg="9" class="h100">
            <div class="chart">
                <!-- //区域趋势 -->
                <div id="statisChart2" class="h100"></div>
                <!-- <ve-line height="100%" :data="lineData" :extend="legend"></ve-line> -->
            </div>
            <div class="energyList">
                <span>区域能耗</span>
                <div class="energy">
                    <div class="itemrow">
                        <div class="item" v-if="area.area1[0]">
                            <div style="background:#14213D">
                                <i class="iconfont icon-building"></i>
                            </div>
                            <div>
                                <span class="span1">{{area.area1[0][1]}}</span><br>
                                <span class="span2">{{area.area1[0][2]}}</span><br>
                                <span class="span3">环比 <i class="iconfont " :class="[area.area1[0][2]-area.area2[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(area.area1[0][2]-area.area2[0][2])*100/area.area1[0][2]).toFixed(2)}}%</span><br>
                                <span class="span3">同比 <i class="iconfont " :class="[area.area1[0][2]-area.area3[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(area.area1[0][2]-area.area3[0][2])*100/area.area1[0][2]).toFixed(2)}}%</span><br>
                            </div>
                        </div>
                        <div class="item" v-if="area.area1[1]">
                            <div style="background:#14213D">
                                <i class="iconfont icon-building"></i>
                            </div>
                            <div>
                                <span class="span1">{{area.area1[1][1]}}</span><br>
                                <span class="span2">{{area.area1[1][2]}}</span><br>
                                <span class="span3">环比 <i class="iconfont " :class="[area.area1[1][2]-area.area2[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(area.area1[1][2]-area.area2[0][2])*100/area.area1[1][2]).toFixed(2)}}%</span><br>
                                <span class="span3">同比 <i class="iconfont " :class="[area.area1[1][2]-area.area3[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(area.area1[1][2]-area.area3[0][2])*100/area.area1[1][2]).toFixed(2)}}%</span><br>
                            </div>
                        </div>
                        <div class="item" v-if="area.area1[2]">
                            <div style="background:#14213D">
                                <i class="iconfont icon-building"></i>
                            </div>
                            <div>
                                <span class="span1">{{area.area1[2][1]}}</span><br>
                                <span class="span2">{{area.area1[2][2]}}</span><br>
                                <span class="span3">环比 <i class="iconfont " :class="[area.area1[2][2]-area.area2[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(area.area1[2][2]-area.area2[0][2])*100/area.area1[2][2]).toFixed(2)}}%</span><br>
                                <span class="span3">同比 <i class="iconfont " :class="[area.area1[2][2]-area.area3[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(area.area1[2][2]-area.area3[0][2])*100/area.area1[2][2]).toFixed(2)}}%</span><br>
                            </div>
                        </div>
                    </div>
                    <div class="itemrow">
                        <div class="item" v-if="area.area1[3]">
                            <div style="background:#14213D">
                                <i class="iconfont icon-building"></i>
                            </div>
                            <div>
                                <span class="span1">{{area.area1[3][1]}}</span><br>
                                <span class="span2">{{area.area1[3][2]}}</span><br>
                                <span class="span3">环比 <i class="iconfont " :class="[area.area1[3][2]-area.area2[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(area.area1[3][2]-area.area2[0][2])*100/area.area1[3][2]).toFixed(2)}}%</span><br>
                                <span class="span3">同比 <i class="iconfont " :class="[area.area1[3][2]-area.area3[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(area.area1[3][2]-area.area3[0][2])*100/area.area1[3][2]).toFixed(2)}}%</span><br>
                            </div>
                        </div>
                        <div class="item" v-if="area.area1[4]">
                            <div style="background:#14213D">
                                <i class="iconfont icon-building"></i>
                            </div>
                            <div>
                                <span class="span1">{{area.area1[4][1]}}</span><br>
                                <span class="span2">{{area.area1[4][2]}}</span><br>
                                <span class="span3">环比 <i class="iconfont " :class="[area.area1[4][2]-area.area2[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(area.area1[4][2]-area.area2[0][2])*100/area.area1[4][2]).toFixed(2)}}%</span><br>
                                <span class="span3">同比 <i class="iconfont " :class="[area.area1[4][2]-area.area3[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(area.area1[4][2]-area.area3[0][2])*100/area.area1[4][2]).toFixed(2)}}%</span><br>
                            </div>
                        </div>
                        <div class="item" v-if="area.area1[5]">
                            <div style="background:#14213D">
                                <i class="iconfont icon-building"></i>
                            </div>
                            <div>
                                <span class="span1">{{area.area1[5][1]}}</span><br>
                                <span class="span2">{{area.area1[5][2]}}</span><br>
                                <span class="span3">环比 <i class="iconfont " :class="[area.area1[5][2]-area.area2[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(area.area1[5][2]-area.area2[0][2])*100/area.area1[5][2]).toFixed(2)}}%</span><br>
                                <span class="span3">同比 <i class="iconfont " :class="[area.area1[5][2]-area.area3[0][2]>0?'icon-icon-arrow-top4':'icon-icon-arrow-btm4']"></i> {{ (Math.abs(area.area1[5][2]-area.area3[0][2])*100/area.area1[5][2]).toFixed(2)}}%</span><br>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" class="h100">
            <div class="chartright">
                <div>
                    <div style="color:rgba(255,255,255,1);font-size:19px;line-height:53px;margin-left:30px">总体信息</div>
                    <div class="img">
                        <img src='@/static/images/lang.jpg'>
                    </div>
                    <div class="info">
                        <span>建筑面积:5724.36㎡</span> <br>
                        <span>建筑地址：上海虹桥</span>
                    </div>
                    <ul>
                        <li>
                            <span>今日: &nbsp;&nbsp;{{currentData.cday}}&nbsp; &nbsp; KWH</span>
                        </li>
                        <li>
                            <span>本周: &nbsp;&nbsp;{{currentData.cweek}}&nbsp; &nbsp; KWH</span>
                        </li>
                        <li>
                            <span>本月: &nbsp;&nbsp;{{currentData.cmonth}}&nbsp;&nbsp;KWH</span>
                        </li>
                        <li>
                            <span>本年: &nbsp;&nbsp;{{currentData.cyear}}&nbsp;&nbsp;KWH</span>
                        </li>
                    </ul>
                    <div class="info">
                        <span>建筑单位面积能耗：{{(currentData.cyear/5724.36).toFixed(2)}}KWH/㎡</span>
                    </div>
                </div>
                <div style="height:32%">
                    <div id="statisChart3" class="h100"></div>
                </div>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import {
    barOption,
    lineOption
} from '@/lib/chartConfig';
import {
    energyData
} from '@/lib/configParmas'
export default {
    name: 'energystatistics',
    data() {
        return {
            statisChart1: null,
            statisChart2: null,
            statisChart3: null,
            startDate: new Date(),
            endDate: new Date(),
            datetype: 'date',
            devicetype: 1,
            currentData: {
                cday: 0,
                cweek: 0,
                cmonth: 0,
                cyear: 0
            },
            category: {
                category1: new energyData().Energy, //本期
                category2: new energyData().Energy, //环比
                category3: new energyData().Energy, //同比
            },
            area: {
                area1: new energyData().Energy, //本期
                area2: new energyData().Energy, //环比
                area3: new energyData().Energy, //同比
            }
        }
    },
    mounted() {
        this.initChart();
        this.loadCurrentDay();
        this.loadAllCateEnergys();
        this.loadAllAreaEnergys();
        this.loadDeviceEnergys();
    },
    methods: {
        initChart() {
            this.statisChart1 = this.$echarts.init(document.getElementById("statisChart1"));
            this.statisChart1.setOption(new barOption().option);
            this.statisChart2 = this.$echarts.init(document.getElementById("statisChart2"));
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
            this.statisChart2.setOption(option);
            this.statisChart3 = this.$echarts.init(document.getElementById("statisChart3"));
            this.statisChart3.setOption(new barOption().option);
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
        },
        changeDeviceType(val) {
            this.devicetype = val;
            this.search();
        },
        loadCurrentDay() {
            this.$ajax.get(this.$URL + '/energySearch/GetDCurrentData', {
                params: {
                    dType: 1
                }
            }).then(result => {
                if (result.status === 200 && result.data.success) {
                    Object.assign(this.currentData, {
                        cday: result.data.cday[0][0][1],
                        cweek: result.data.cweek[0][0][1],
                        cmonth: result.data.cmonth[0][0][1],
                        cyear: result.data.cyear[0][0][1],
                    })
                }
            }).catch(error => {
                console.log(error);
            });
        },
        updatedChart(result, chart) {
            let _this = this;
            let option = chart.getOption();
            // option.legend[0].data = ['今天', "昨天"];
            option.xAxis[0].data = [];
            option.series[0].data = [];
            if (result.data.data) {
                for (let i = 0; i < result.data.data.length; i++) {
                    option.xAxis[0].data.push(result.data.data[i][1]);
                    option.series[0].data.push(result.data.data[i][2])
                }
                // option.series[0].data = result.data.data1;
                // option.series[0].name = option.legend[0].data[0];
                chart.setOption(option);
            }

        },
        updatedDChart(result) {
            let _this = this;
            let option = _this.statisChart3.getOption();
            option.title[0].text = '总能耗趋势';
            let data = [];
            if (this.datetype == "date") {
                option.xAxis[0].data = [];
                for (let i = 0; i < 24; i++) {
                    option.xAxis[0].data.push(i + ":00");
                    data.push(0);
                }
            } else if (this.datetype == "month") {
                option.xAxis[0].data = [];
                for (let i = 0; i <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++) {
                    option.xAxis[0].data.push(i + "日");
                    data.push(0);
                }
            } else if (this.datetype == "year") {
                option.xAxis[0].data = [];
                for (let i = 0; i <= 12; i++) {
                    option.xAxis[0].data.push(i + "月");
                    data.push(0);
                }
            }

            if (result.data.data1) {
                result.data.data1.forEach(v => {
                    // v=v[0];
                    // data.push(v[1]);
                    let index;
                    if (this.datetype == "date") {
                        index = parseInt(v[0][2].split(' ')[1].split(':')[0]);
                    } else if (this.datetype == "month") {
                        index = parseInt(v[0][2].split(' ')[0].split('-')[2]);
                    } else if (this.datetype == "year") {
                        index = parseInt(v[0][2].split(' ')[0].split('-')[1]);
                    }
                    data[index] = v[0][1];
                });
            }
            let name = "";
            if (this.datetype == "date") {
                name = this.startDate.format("yyyy-MM-dd")
            } else if (this.datetype == "month") {
                name = "本月";
            } else if (this.datetype == "year") {
                name = "本年"
            }
            option.series[0].data = data;
            option.series[0].name = name;
            _this.statisChart3.setOption(option);
        },
        loadAllCateEnergys() {
            let _this = this;
            this.$ajax
                .get(this.$URL + "/energySearch/GetAllCategoryEnergy", {
                    params: {
                        bt: this.startDate.format("yyyy-MM-dd") + " 00:00:00",
                        deviceType: this.devicetype,
                        dateType: this.datetype
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        if (result.data.data.length > 0) //本期有数据
                        {
                            if (!result.data.data1) {
                                result.data.data1 = [];
                            }
                            if (!result.data.data2) {
                                result.data.data2 = [];
                            }
                            result.data.data.forEach((v, i) => {
                                if (v) {
                                    if (!result.data.data1[i]) {
                                        result.data.data1[i] = ['', '', 0];
                                    }
                                    if (!result.data.data2[i]) {
                                        result.data.data2[i] = ['', '', 0];
                                    }
                                }
                            });
                            Object.assign(this.category, {
                                category1: result.data.data,
                                category2: result.data.data1,
                                category3: result.data.data2
                            });
                            this.updatedChart(result, this.statisChart1);
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        loadAllAreaEnergys() {
            let _this = this;
            this.$ajax
                .get(this.$URL + "/energySearch/GetAllAreaEnergy", {
                    params: {
                        bt: this.startDate.format("yyyy-MM-dd") + " 00:00:00",
                        deviceType: this.devicetype,
                        dateType: this.datetype
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        if (result.data.data.length > 0) //本期有数据
                        {
                            if (!result.data.data1) {
                                result.data.data1 = [];
                            }
                            if (!result.data.data2) {
                                result.data.data2 = [];
                            }
                            result.data.data.forEach((v, i) => {
                                if (v) {
                                    if (!result.data.data1[i]) {
                                        result.data.data1[i] = ['', '', 0];
                                    }
                                    if (!result.data.data2[i]) {
                                        result.data.data2[i] = ['', '', 0];
                                    }
                                }
                            });
                            Object.assign(this.area, {
                                area1: result.data.data,
                                area2: result.data.data1,
                                area3: result.data.data2
                            });
                            this.updatedChart(result, this.statisChart2);
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        loadDeviceEnergys() {
            let _this = this;
            this.$ajax
                .get(this.$URL + "/energySearch/GetDeviceEnergy", {
                    params: {
                        bt: this.startDate.format("yyyy-MM-dd") + " 00:00:00",
                        deviceType: this.devicetype,
                        dateType: this.datetype
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.updatedDChart(result);
                    }
                })
                .catch(err => {});
        },
        search() {
            this.loadAllCateEnergys();
            this.loadAllAreaEnergys();
            this.loadDeviceEnergys();
            this.loadCurrentDay();
        },
    }
}
</script>

<style lang="less" scoped>
.el-select /deep/ .el-input__inner {
    height: 36px !important;
}

.ghy-box {
    .header {
        border-bottom: 1px solid #122d62
    }

    .search {
        height: 50px;
        border-bottom: 1px solid #122d62;
        display: flex;
        justify-content: space-between;
        padding-left: 15px;

        .searchleft {
            display: flex;
            align-items: center;
            margin-left: 30px;

            >div:nth-of-type(1) {
                margin-right: 10px;
            }

            label {
                margin-right: 10px;
            }

            button {
                margin-left: 40px;
            }
        }

        .btn {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;

            button:nth-of-type(1) {
                background: #0895C6 !important;
            }

            button:nth-of-type(2) {
                background: #D48265 !important;
            }

            button:nth-of-type(3) {
                background: #6977EE !important;
            }
        }
    }

    .boxbody {
        height: calc(100% - 50px);
        padding: 10px;
        margin: 0 !important;

        >div {
            display: flex;
            flex-direction: column;
            flex: 1 1;
        }

        .chart {
            height: 50%;
            border: 1px solid #122d62;
        }

        // .cateEnergy {
        //     font-size: 12px;
        //     height: calc(100% - 53px);
        //     display: flex;
        //     padding: 20px 20px;
        //     overflow: hidden;
        //     .itemrow {
        //         display: flex;
        //         flex: 1 1;
        //         justify-content: space-between;
        //         align-items: flex-start; // padding: 0 20px;
        //         flex-direction: column;
        //         .item {
        //             display: flex;
        //             height: 70px;
        //             >div:nth-of-type(1) {
        //                 // width: 70px;
        //                 // height: 70px;
        //                 background: rgba(8, 149, 198, 1);
        //                 border-radius: 4px;
        //                 margin-right: 10px;
        //                 display: flex;
        //                 justify-content: center;
        //                 align-items: center;
        //                 i {
        //                     font-size: 40px;
        //                 }
        //             }
        //             >div:nth-of-type(2) {
        //                 overflow-x: hidden;
        //                 overflow-y: auto;
        //                 &::-webkit-scrollbar {
        //                     display: none;
        //                 }
        //             }
        //         }
        //         .span1 {
        //             font-size: 16px;
        //             font-weight: 400;
        //             color: rgba(170, 181, 201, 1);
        //         }
        //         .span2 {
        //             font-size: 16px;
        //             font-weight: 400;
        //             color: rgba(255, 255, 255, 1);
        //         }
        //         .span3 {
        //             i {
        //                 color: #00ffff;
        //             }
        //             font-size: 13px;
        //             font-weight: 400;
        //             color: rgba(170, 181, 201, 1);
        //         }
        //         .infotext {
        //             display: flex;
        //         }
        //     }
        // }
        .energyList {
            border: 1px solid #122d62;
            height: 50%;
            margin: 10px 0 0 0; // flex-direction: column;

            >span {
                font-size: 19px;
                font-weight: 400;
                color: #fff;
                display: inline-block;
                margin: 20px 0 0 30px;
                height: 38px;
                display: inline-block;
            }

            .energy {
                height: calc(100% - 58px);
                display: flex;
                padding: 10px 0;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    display: none;
                }
            }

            .itemrow {
                display: flex;
                flex: 1 1;
                justify-content: space-between;
                align-items: flex-start;
                padding: 0 20px;
                flex-direction: column;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    display: none;
                }

                .item {
                    display: flex;
                    align-items: center;
                    overflow-x: hidden;
                    overflow-y: auto;

                    &::-webkit-scrollbar {
                        display: none;
                    }

                    >div:nth-of-type(1) {
                        // width: 80px;
                        // height: 80px;
                        background: rgba(8, 149, 198, 1);
                        border-radius: 4px;
                        margin-right: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        i {
                            display: inline-block;
                            font-size: 40px;
                            vertical-align: middle;
                        }
                    }

                    >div:nth-of-type(2) {
                        display: inline-block; // background: #26488C;
                        // height: 80px;
                        align-self: flex-start;
                        overflow-x: hidden;
                        overflow-y: auto;

                        &::-webkit-scrollbar {
                            display: none;
                        }
                    }
                }

                .span1 {
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(170, 181, 201, 1);
                }

                .span2 {
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                }

                .span3,
                    {
                    i {
                        color: #00FFFF;
                    }

                    font-size: 13px;
                    font-weight: 400;
                    color: rgba(170, 181, 201, 1);
                }
            }
        }

        .chartright {
            height: 100%;
            box-sizing: border-box;
            border: 1px solid rgba(53, 77, 121, 1);

            &>div:nth-of-type(1) {
                height: 68%;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    display: none;
                }
            }

            img {
                background-size: 100% 100%;
                height: 100%;
                width: 100%;
            }

            .img {
                margin: 10px 30px;
                height: 162px;
            }

            ul {
                border: 1px solid rgba(53, 77, 121, 1);
                margin: 10px 30px;
                list-style: none;

                li {
                    border-bottom: 1px solid rgba(53, 77, 121, 1);
                    padding-left: 50px;

                    span {
                        font-size: 16px;
                        font-weight: 400;
                        color: rgba(170, 181, 201, 1); // line-height: 32px;
                    }
                }
            }

            .info {
                margin: 0 30px;
                font-size: 16px;
                font-weight: 400;
                color: rgba(170, 181, 201, 1);
                line-height: 32px;
            }
        }
    }

    .chartheader {
        // border-bottom: 1px solid rgba(32, 54, 93, 1);
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
    }

    // @media screen and (max-width: 1600px) {
    //     /*当屏幕尺寸小于600px时，应用下面的CSS样式*/
    //     .itemrow .item {
    //         &>div:nth-last-of-type(1)
    //         {
    //             height: auto;
    //             width: auto;
    //         }
    //     }
    // }
}
</style>
