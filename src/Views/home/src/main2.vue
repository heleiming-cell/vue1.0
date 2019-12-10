<template>
<el-row :gutter="10" class="box">
    <el-row class="boxheader">
        <el-col :xs="24" :sm="24" :md="5" :lg="5">
            <div class="card headerleft">
                <div>
                    <i class="iconfont icon-home cursor" @click="changeMain(1)"></i>
                </div>
                <div class="line"></div>
                <div>
                    <i class="iconfont icon-shuidian cursor" style="color:#7AB1EF" @click="changeMain(2)"></i>
                </div>
                <div class="line"></div>
                <div>
                    <i class="iconfont icon-lifangti- cursor" @click="changeMain(3)"></i>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="14" :lg="14">
            <div class="headercenter">
                <img src="@/static/images/logo.png" @click="Enter">
        </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="5" :lg="5">
            <div class="card headerleft">
                <div class="cursor" @click="changeDevice(1)">
                    <i class="iconfont icon-dianyoux-" :class="[devicetype==1?'active':'']"></i>
                </div>
                <div class="cursor" @click="changeDevice(2)">
                    <i class="iconfont icon-shui1" :class="[devicetype==2?'active':'']"></i>
                </div>
                <div class="line"></div>
                <div class="cursor" @click="changeDate('year')">
                    <span :class="[datetype=='year'?'active':'']">年</span>
                </div>
                <div class="cursor" @click="changeDate('month')">
                    <span :class="[datetype=='month'?'active':'']">月</span>
                </div>
                <div class="cursor" @click="changeDate('date')">
                    <span :class="[datetype=='date'?'active':'']">日</span>
                </div>
            </div>
        </el-col>
    </el-row>
    <el-row class="boxbody" :gutter="10">
        <el-col :xs="24" :sm="24" :md="10" :lg="10" class="h100 chartlist">
            <div class="card" v-for="(item,i) in areaEnergy.slice(0,3)" :key="i">
                <div class="cardheader">
                    <span class="cardline"></span>
                    <span class="cardheadertext">{{item.Key}}能耗趋势图</span>
                </div>
                <div class="chart">
                    <div :id="'mian2chart'+i" class="h100"></div>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="9" :lg="9" class="h100 chartlist">
            <div class="card" v-for="(item,i) in areaEnergy.slice(3)" :key="i">
                <div class="cardheader">
                    <span class="cardline"></span>
                    <span class="cardheadertext">{{item.Key}}能耗趋势图</span>
                </div>
                <div class="chart">
                    <div :id="'mian2chart'+(i+3)" class="h100"></div>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="5" :lg="5" class="h100">
            <div class="info card h100">
                <div class="cardheader">
                    <span class="cardline"></span>
                    <span class="cardheadertext">总体信息</span>
                </div>
                <div class="img">
                    <img src='@/static/images/lang.jpg'>
                </div>
                    <div class="infotext">
                        <div>建筑面积:5000㎡</div>
                        <div>空调面积:5000㎡</div>
                    </div>
                    <div class="infotext">
                        <div>建筑地址:上海虹桥</div>
                        <div>采集状态:正常</div>
                    </div>
                    <div class="textlist">
                        <!-- <div>
                            <span>今日 &nbsp;&nbsp;&nbsp;&nbsp; 1098KWH</span>
                        </div>
                        <div>
                            <span>本周 &nbsp;&nbsp;&nbsp;&nbsp; 1098KWH</span>
                        </div>
                        <div>
                            <span>本月 &nbsp;&nbsp;&nbsp;&nbsp; 1098KWH</span>
                        </div>
                        <div>
                            <span>本年 &nbsp;&nbsp;&nbsp;&nbsp; 1098KWH</span>
                        </div> -->
                        <div>
                            <span>今日 &nbsp;&nbsp;&nbsp;&nbsp; {{currentData.cday}}KWH</span>
                        </div>
                        <div>
                            <span>本周 &nbsp;&nbsp;&nbsp;&nbsp; {{currentData.cweek}}KWH</span>
                        </div>
                        <div>
                            <span>本月 &nbsp;&nbsp;&nbsp;&nbsp; {{currentData.cmonth}}KWH</span>
                        </div>
                        <div>
                            <span>本年 &nbsp;&nbsp;&nbsp;&nbsp; {{currentData.cyear}}KWH</span>
                        </div>
                    </div>
                    <div class="energytext">
                        <span>单位建筑面积 5724.36㎡</span> <br>
                        <span>单位建筑面积能耗 {{ (currentData.cyear/5724.36).toFixed(2)}}kwh/㎡.y</span>
                    </div>
                    <div style="height:300px" id="main2chart7">
                        <!-- <ve-line height="100%" :data="lineData" :extend="legend"></ve-line> -->
                    </div>
                </div>
        </el-col>
    </el-row>
</el-row>
</template>

<script>
import {
    RouteMng
} from '@/lib/Common'
import {
    lineOption,
    barOption
} from '@/lib/chartConfig'
import {
    mapState
} from "vuex";
export default {
    name: 'homeComponet',
    data() {
        return {
            hour: '',
            month: '',
            min: "",
            day: '',
            week: '',
            devicetype: 1,
            datetype: 'date',
            areaEnergy: [{
                Key: '1F'
            }, {
                Key: '2F'
            }, {
                Key: '3F'
            }, {
                Key: '4F'
            }, {
                Key: '5F'
            }, {
                Key: 'B1F'
            }],
            charts: [],
            chart: null,
            currentData: {
               cday: 0,
                cweek: 0,
                cmonth: 0,
                cyear: 0
            },
        }
    },
    computed: {
        ...mapState({
            // connection: state => state.signalr.connection,
            // scadaHub: state => state.signalr.scadaHub,
            // realData: state => state.signalr.realData,
            routename: state => state.app.routename, //手机切换
        }),
    },
    mounted() {
        this.initChart();
        this.loadAreaCateEnergys();
        this.loadDeviceEnergys();
        this.loadCurrentDay();
    },
    watch: {
        routename: { //手机切换
            handler(v) {
                if (v) {
                    this.$router.push({
                        name: v
                    });
                }
            }
        }
    },
    methods: {
        LoadFunArea(item) {
            this.$ajax
                .get(this.$URL + "/role/GetUserFuns", {
                    params: {
                        menuId: item.key
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.$store.commit("chanage_fun_menu", result.data.funs);
                        sessionStorage.funs = JSON.stringify(result.data.funs);
                        //    添加二级功能菜单动态路由
                        if (result.data.funs.length > 0) {
                            this.vueroute = [];
                            new RouteMng().createRouter(result.data.funs, this);
                            if (this.$store.state.app.routes && this.$store.state.app.routes.children) {
                                this.$store.state.app.routes.children = this.$store.state.app.routes.children.concat(this.vueroute);
                                this.$router.addRoutes([this.$store.state.app.routes]);
                                this.$store.commit('change_route', this.$store.state.app.routes);
                                sessionStorage.route = JSON.stringify(this.$store.state.app.routes);
                            }

                            //默认跳转第一个二级功能菜单
                            let fun = result.data.funs[0];
                            if (fun.config) {
                                let config = JSON.parse(fun.config);
                                if (config.route) {
                                    this.$router.push({
                                        name: config.route.name
                                    });
                                    this.$store.commit("change_activeFunc", fun.label);
                                    sessionStorage.activefun = fun.label;
                                }
                            }
                        } else {
                            this.$store.commit("change_activeFunc", "");
                            sessionStorage.activefun = "";
                            this.$router.push({
                                name: 'empty'
                            });
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        Enter() {
            if (this.$store.state.app.menus.length > 0) {
                this.$store.commit('change_header_menu', this.$store.state.app.menus[0]);
                this.LoadFunArea(this.$store.state.app.header_menu);
            }
        },
        changeMain(val) {
            if (val === 1) {
                this.$router.push({
                    name: 'homepage'
                });
            } else if (val === 2) {
                this.$router.push({
                    name: 'home2'
                });
            } else if (val === 3) {
                this.$router.push({
                    name: 'home3'
                });
            }
        },
        updateChart(data) {
            let _this = this;
            if (data.length > 0) {
                data.forEach((v, i) => {
                    let value = v.Value;
                    let option = _this.charts[i].getOption();
                    option.legend[0].data = Object.keys(value);
                    if (this.datetype == "date") {
                        option.xAxis[0].data = [];
                        for (let i = 0; i < 24; i++) {
                            option.xAxis[0].data.push(i + ":00");
                        }
                    } else if (this.datetype == "month") {
                        option.xAxis[0].data = [];
                        for (let i = 1; i <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++) {
                            option.xAxis[0].data.push(i + "日");
                        }
                    } else if (this.datetype == "year") {
                        option.xAxis[0].data = [];
                        for (let i = 1; i <= 12; i++) {
                            option.xAxis[0].data.push(i + "月");
                        }
                    }
                    option.series = [];
                    Object.keys(value).forEach((m, n) => {
                        let s = {
                            name: m,
                            type: 'line',
                            symbol: 'circle',
                            symbolSize: 5,
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            },
                            data: value[m]
                        };
                        option.series.push(s);

                    });
                    _this.charts[i].setOption(option, true);

                });
            }
        },
        loadAreaCateEnergys() {
            let _this = this;
            this.$ajax.get(this.$URL + "/energySearch/GetAreaCateEenergy", {
                    params: {
                        bt: new Date().format("yyyy-MM-dd") + " 00:00:00",
                        devicetype: this.devicetype,
                        datetype: this.datetype
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        if (result.data.data.length > 0) {
                            // this.areaEnergy = result.data.data;
                            this.updateChart(result.data.data);

                        } else {
                            //  this.initChart();
                            let _this = this;
                            this.charts.forEach((v, i) => {
                                let option = v.getOption();
                                option.xAxis[0].data = [];
                                if (_this.datetype == "date") {

                                    for (let i = 0; i < 24; i++) {
                                        option.xAxis[0].data.push(i + ":00");
                                    }
                                } else if (_this.datetype == "month") {
                                    for (let i = 1; i <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++) {
                                        option.xAxis[0].data.push(i + "日");
                                    }
                                } else if (_this.datetype == "year") {
                                    for (let i = 1; i <= 12; i++) {
                                        option.xAxis[0].data.push(i + "月");
                                    }
                                }
                                option.yAxis = [];
                                option.title = null;
                                option.legend = [];
                                if (option.series.length > 0) {
                                    option.series.forEach((t, j) => {
                                        t.data = [];
                                    })
                                }
                                v.setOption(option);
                            });
                        }
                    }
                })
                .catch(err => {});
        },
        updatedDChart(result) {
            let _this = this;
            let option = _this.chart.getOption();
            option.title[0].text = '总能耗趋势';
            option.xAxis[0].data = [];
            if (this.datetype == "date") {
                for (let i = 0; i < 24; i++) {
                    option.xAxis[0].data.push(i + ":00");

                }
            } else if (this.datetype == "month") {
                for (let i = 1; i <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); i++) {
                    option.xAxis[0].data.push(i + "日");
                }
            } else if (this.datetype == "year") {
                for (let i = 1; i <= 12; i++) {
                    option.xAxis[0].data.push(i + "月");
                }
            }
            option.series[0].data = result.data.data1;
            // option.series[0].name = new.format("yyyy-MM-dd");
            _this.chart.setOption(option);
        },
        loadDeviceEnergys() {
            let _this = this;
            this.$ajax
                .get(this.$URL + "/energySearch/GetDeviceEnergy", {
                    params: {
                        bt: new Date().format("yyyy-MM-dd") + " 00:00:00",
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
        initChart() {
            let _this = this;
            let charts = document.querySelectorAll('.card>.chart>div');
            if (charts && charts.length > 0) {
                charts.forEach((v, i) => {

                    let c = _this.$echarts.init(v);

                    let option = new lineOption().option;
                    option.title = {};
                    option.yAxis[0].splitLine.show = false;
                    option.grid = {
                            top: '10',
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        c.setOption(option);
                    _this.charts.push(c);
                });
            }
            let chart = this.$echarts.init(document.getElementById("main2chart7"));
            let option = new barOption().option;
            option.title.text = "设备总能耗"
            option.series[0].data = [];
            chart.setOption(option);
            _this.chart = chart;

        },
        changeDevice(val) {
            this.devicetype = val;
            this.loadAreaCateEnergys();
            this.loadDeviceEnergys();
        },
        changeDate(val) {
            this.datetype = val;
            this.loadAreaCateEnergys();
            this.loadDeviceEnergys();
        },
         loadCurrentDay() {
            this.$ajax.get(this.$URL + '/energySearch/GetDCurrentData', {
                params: {
                    dType: 1
                }
            }).then(result => {
                if (result.status === 200 && result.data.success) {
                    Object.assign(this.currentData, {
                        cday: result.data.cday,
                        cweek: result.data.cweek,
                        cmonth: result.data.cmonth,
                        cyear: result.data.cyear,
                    })
                }
            }).catch(error => {
                console.log(error);
            });
        },
    },
    // beforeRouteEnter(to, from, next) {
    //     next(vm => {
    //         vm.$store.commit('change_showHeader', false);
    //     })
    // },
    // beforeRouteLeave(to, from, next) {
    //     this.$store.commit('change_showHeader', true);
    //     next();
    // }
}
</script>

<style lang="less" scoped>
.active {
    color: #7AB1EF !important;
}

.box {
    height: 100%;
    margin: 0 5px !important;
    padding: 10px 0;
    font-size: 12px;

    .col {
        height: 100%;
    }
}

.line {
    background-color: #1E335A;
    width: 2px;
    height: 40px;
}

.cardheader {
    height: 0.53rem;
    display: flex;
    align-items: center;
    padding: 10px;

    .cardline {
        display: inline-block;
        width: 0.04rem;
        height: 0.2rem;
        background-color: #fff;
    }

    .cardheadertext {
        color: rgba(206, 228, 244, 1);
        font-size: 0.16rem;
        margin-left: 0.13rem;
    }
}

.chart {
    height: calc(100% - 53px);
}

.boxheader {
    .headerleft {
        height: 0.82rem;
        opacity: 0.76;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 10px;
        margin: 0 5px;

        i {
            font-size: 40px;
            color: #254885;
        }

        span {
            font-size: 30px;
            color: #254885;
        }
    }

    .headercenter {
        height: 82px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            height: 50px;
            cursor: pointer;
        }

    }
}

.boxbody {
    height: calc(100% - 92px);
    color: #254885;
    padding-left: 10px;
    padding-right: 5px;

    .category {
        // display: flex;
        // flex-direction: column;
        // align-items: center;
        // justify-content: space-between;

        >div {
            text-align: center;
            border-bottom: 2px solid #32538E;
            padding-bottom: 5px;

            span:nth-of-type(1) {
                font-size: 25px;
            }

            span:nth-of-type(2) {
                font-size: 16px;
            }
        }

        >div:nth-of-type(8) {
            border: 0;
        }
    }

    .chartlist {
        >div {
            height: calc((100% - 20px) / 3);
        }

        >div:nth-of-type(2) {
            margin: 10px 0;
        }
    }

    .info {
        width: 100%;
        box-sizing: border-box;
        font-size: 12px;

        img {
            background-size: 100% 100%;
            height: 100%;
            width: 100%;
            height: 162px;
        }

        .img {
            margin: 10px 20px;
        }

        .textlist {
            border: 1px solid rgba(53, 77, 121, 1);
            margin: 10px 20px;
            list-style: none;
            padding: 10px;

            >div {
                border-bottom: 1px solid rgba(21, 36, 65, 1);
                padding-left: 20px;

                span {
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(170, 181, 201, 1);
                }
            }

        }

        .infotext {
            display: flex;
            padding: 5px 20px;
            justify-content: space-between;
            font-size: 17px;
            color: #AAB5C9;
        }

        .energytext {
            margin: 0 20px;
            font-size: 16px;
            font-weight: 400;
            color: rgba(170, 181, 201, 1);
            // line-height: 32px;
        }
    }

}

// @media screen and (max-width: 1366px) {

//     /*当屏幕尺寸小于600px时，应用下面的CSS样式*/
//    .category {
//         overflow-y: auto;
//         overflow-x: hidden;

//         &::-webkit-scrollbar {
//             display: none;
//         }
//     }
// }
</style>
