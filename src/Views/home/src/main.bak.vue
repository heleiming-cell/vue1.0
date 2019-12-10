<template>
<el-row :gutter="10" class="box">
    <el-col :xs="24" :sm="24" :md="5" :lg="5" class="leftcard col">
        <div class="card leftcardmode">
            <div>
                <i class="iconfont icon-home cursor" style="color:#7AB1EF" @click="changeMain(1)"></i>
            </div>
            <div class="line"></div>
            <div>
                <i class="iconfont icon-shuidian cursor" @click="changeMain(2)"></i>
            </div>
            <div class="line"></div>
            <div>
                <i class="iconfont icon-lifangti- cursor" @click="changeMain(3)"></i>
            </div>
        </div>
        <div class="card leftcardPM">
            <div class="outpm">
                <div>70</div>
                <div>良好</div>
                <div>室外PM2.5</div>
            </div>
            <div class="cardheader">
                <span class="cardline"></span>
                <span class="cardheadertext">环境监测</span>
            </div>
            <div class="PMCircle">
                <div class="solidcircle">
                    <div class="dotcircle">
                        <div class="pmnum">50</div>
                        <span class="pmtext">舒适</span>
                        <div>室内PM2.5</div>
                    </div>
                </div>
            </div>
            <div class="roomco2">
                <span>室内二氧化碳</span><br>
                <span>255</span>
            </div>
            <div class="ruler">
                <div class="cm" v-for="i in 6" :key="i" :id="(i-1)*10+i">
                    <div class="mm" v-for="j in 10" :key="j" :id="(i-1)*10+i+j"></div>
                </div>
            </div>
            <div class="temperature">
                <div>
                    <div>18℃</div>
                    <span>室内温度</span>
                </div>
                <div>
                    <div>12℃</div>
                    <span>室外温度</span>
                </div>
            </div>
            <div style="text-align:center;margin-top:25px;">
                <span>甲醛含量等级</span>
            </div>
            <div style="text-align:center;margin-top:5px;color:green">
                <span>优</span>
            </div>
            <div class="hoco">
                <div style="border:1px solid green; width:63px">
                    <div class="jiao"></div>
                </div>
                <div style="border:1px solid yellow;width:63px"></div>
                <div style="border:1px solid RGBA(211, 86, 37, 1);width:63px"></div>
                <div style="border:1px solid red;width:63px"></div>
            </div>
            <div class="temperature">
                <div>
                    <div>23%</div>
                    <span>室内湿度</span>
                </div>
                <div>
                    <div>23%</div>
                    <span>室外湿度</span>
                </div>
            </div>
            <div class="VOC">
                <span>室内VOC</span>
                <span>0.023mg/m³</span>
            </div>
            <div>
                <div class="weather">
                    <i :class="weatherclass"></i>
                    <div>
                        <span>{{weathertype}}</span>
                        <span>{{low}}-{{high}}</span>
                    </div>
                </div>
                <hr>
                <div class="weather">
                    <i class="iconfont icon-fengsu1"></i>
                    <div>
                        <span>{{wind}}</span>
                        <span>{{windlevel}}</span>
                    </div>
                </div>
                <hr>
                <div class="weather">
                    <i class="iconfont icon-yundong"></i>
                    <div>
                        <span>{{sport}}</span>
                        <span>运动</span>
                    </div>
                </div>
            </div>
        </div>
    </el-col>
    <el-col :xs="24" :sm="24" :md="14" :lg="14" class="centercard col">
        <div class="centerheader">
            <img src="@/static/images/logo.png" @click="Enter">
        </div>
            <div class="centerbody ">
                <div class="bodyup card">
                    <div class="bodyupleft">
                        <div class="bodyupleft_up">
                            <div class="cardheader">
                                <span class="cardline"></span>
                                <span class="cardheadertext">总能耗</span>
                            </div>
                            <div class="chart">
                                <ve-line height="100%" :data="lineData" :extend="legend"></ve-line>
                            </div>
                        </div>
                        <div class="bodyupleft_down">
                            <div class="cardheader">
                                <span class="cardline"></span>
                                <span class="cardheadertext">用电量TOP3</span>
                            </div>
                            <div class="chart">
                                <ve-bar height="100%" :data="barData" :extend="barLegend" :settings="barSettings"></ve-bar>
                            </div>
                        </div>
                    </div>
                    <div class="bodyupright">
                        <div class="cardheader">
                            <span class="cardline"></span>
                            <span class="cardheadertext">总体信息</span>
                        </div>
                        <div class="info">
                            <div class="img">
                                <img src='@/static/images/langshi.jpg'></img>
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
                                <span>单位建筑面积能耗 92kwh/㎡.y</span> <br>
                                <span>单位建筑面积能耗 92kwh/㎡.y</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bodydown">
                    <div class="downleft card">
                        <div class="cardheader">
                            <span class="cardline"></span>
                            <span class="cardheadertext">分项能耗</span>
                        </div>
                        <div class="areaenergy">
                            <div class="itemrow">
                                <div class="item">
                                    <div style="background:#0895C6">
                                        <i class="iconfont icon-Fan_02"></i>
                                    </div>
                                    <div>
                                        <span class="span1">新风机</span><br>
                                        <span class="span2">8.26</span><br>
                                        <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp; 20%</span><br>
                                    </div>
                                    </div>
                                    <div class="item">
                                        <div style="background:#26488C">
                                            <i class="iconfont icon-xuehua1"></i>
                                        </div>
                                        <div>
                                            <span class="span1">空调</span><br>
                                            <span class="span2">8.23</span><br>
                                            <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp; 20%</span><br>
                                    </div>
                                        </div>
                                    </div>
                                    <div class="itemrow">
                                        <div class="item">
                                            <div style="background:#D48265">
                                                <i class="iconfont icon-qita"></i>
                                            </div>
                                            <div>
                                                <span class="span1">风机盘管</span><br>
                                                <span class="span2">7.00</span><br>
                                                <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp; 20%</span>
                                                <br>
                                             </div>
                                            </div>
                                            <div class="item">
                                                <div style="background:#6977EE">
                                                    <i class="iconfont icon-zhaoming1"></i>
                                                </div>
                                                <div>
                                                    <span class="span1">照明</span><br>
                                                    <span class="span2">6.33</span><br>
                                                    <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp; 20%</span><br>
                                                 </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="downright card">
                                        <div class="cardheader">
                                            <span class="cardline"></span>
                                            <span class="cardheadertext">区域能耗</span>
                                        </div>
                                        <div class="areaenergy">
                                            <div class="itemrow">
                                                <div class="item">
                                                    <div style="background:#14213D">
                                                        <i class="iconfont icon-building"></i>
                                                    </div>
                                                    <div>
                                                        <span class="span1">1F</span><br>
                                                        <span class="span2">5.33</span><br>
                                                        <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp; 20%</span><br>
                                                    </div>
                                                    </div>
                                                    <div class="item">
                                                        <div style="background:#14213D">
                                                            <i class="iconfont icon-building"></i>
                                                        </div>
                                                        <div>
                                                            <span class="span1">2F</span><br>
                                                            <span class="span2">6.12</span><br>
                                                            <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp; 20%</span><br>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div class="itemrow">
                                                        <div class="item">
                                                            <div style="background:#14213D">
                                                                <i class="iconfont icon-building"></i>
                                                            </div>
                                                            <div>
                                                                <span class="span1">3F</span><br>
                                                                <span class="span2">4.26</span><br>
                                                                <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp; 20%</span><br>
                                                            </div>
                                                            </div>
                                                            <div class="item">
                                                                <div style="background:#14213D">
                                                                    <i class="iconfont icon-building"></i>
                                                                </div>
                                                                <div>
                                                                    <span class="span1">4F</span><br>
                                                                    <span class="span2">7.68</span><br>
                                                                    <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp; 20%</span><br>
                                                                 </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
    </el-col>
    <el-col :xs="24" :sm="24" :md="5" :lg="5" class="rightcard col">
        <div class="card rightcarddate">
            <div class="datetime">
                <div class="time">{{hour}}:{{min}}</div>
                <div class="date">星期{{week}}<br>{{month}}月{{day}}日</div>
            </div>
        </div>
        <div class="chartlist">
            <div class="card">
                <div class="cardheader">
                    <span class="cardline"></span>
                    <span class="cardheadertext">设备管理</span>
                </div>
                <div class="chart">
                    <ve-ring :data="deviceData" height="100%" :settings="deviceSettings" :extend="pieLegend"></ve-ring>
                </div>
            </div>
            <div class="card">
                <div class="cardheader">
                    <span class="cardline"></span>
                    <span class="cardheadertext">车位监测</span>
                </div>
                <div class="chart">
                    <ve-ring height="100%" :data="carData" :settings="pieSetting" :extend="pieLegend"></ve-ring>
                </div>
            </div>
            <div class="card">
                <div class="cardheader">
                    <span class="cardline"></span>
                    <span class="cardheadertext">光伏发电</span>
                </div>
                <div class="chart">
                    <!-- <ve-line height="100%" :data="lineData" :extend="legend"></ve-line> -->
                    <ve-histogram height="100%" :extend="legend" :settings="gfSettings" :data="gfData"></ve-histogram>
                </div>
            </div>
        </div>
    </el-col>
</el-row>
</template>

<script>
import Weather from "@/data/weather";

export default {
    name: "homeComponet",
    mounted() {

        this.getWeather();
        this.loadCurrentDay();
        this.getTimes();

    },
    data() {
        this.barSettings = {
            dimension: ["设备"],
            metrics: ["用电量"],
            itemStyle: {
                normal: {
                    color: function (params) {
                        // build a color map as your need.
                        var colorList = ["#D55A42", "#93DD97", "#93CBDB"];
                        return colorList[params.dataIndex];
                    },
                    label: {
                        show: false,
                        position: "top",
                        formatter: "{c}%"
                    }
                }
            }
        };
        this.gfSettings = {
            itemStyle: {
                normal: {
                    color: function (params) {
                        // build a color map as your need.
                        var colorList = ["#3ca0fe", "#4bca73", "#3ca0fe", "#445188"];
                        return colorList[params.dataIndex];
                    }
                }
            }
        };
        this.deviceSettings = {
            roseType: "area",
            offsetY: "50%",
            radius: [40, 150]
        };
        this.pieSetting = {
            offsetY: "50%"
        };
        this.legend = {
            grid: {
                left: 5,
                bottom: 5,
                top: 5
            },
            series: {
                barMaxWidth: 40
            },
            textStyle: {
                color: "#AAB5C9"
            },
            legend: {
                textStyle: {
                    color: "red"
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
                            color: "#13316B"
                        }
                    }
                });
                return item;
            },
            xAxis: {
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#13316B"
                    }
                }
            }
        };
        this.pieLegend = {
            series: {
                radius: "60%"
            },
            textStyle: {
                color: "white"
            },
            legend: {
                textStyle: {
                    color: "white"
                }
            }
        };
        this.barLegend = {
            grid: {
                left: 5,
                bottom: 5,
                top: 5
            },
            series: {
                barMaxWidth: 40
            },
            textStyle: {
                color: "#AAB5C9"
            },
            legend: {
                textStyle: {
                    color: "red"
                },
                show: false
            }
        };
        return {
            weatherclass: "iconfont icon-duoyun",
            weathertype: "晴",
            high: "10",
            low: "20",
            wind: "南风",
            windlevel: "3-4级",
            sport: "较不宜",
            hour: "",
            month: "",
            min: "",
            day: "",
            week: "",
            weeks: ["日", "一", "二", "三", "四", "五", "六"],
            lineData: {
                columns: ["日期", "新风机", "空调", "照明"],
                rows: [{
                        日期: "6月",
                        新风机: 1393,
                        空调: 1093,
                        照明: 2000
                    },
                    {
                        日期: "7月",
                        新风机: 3530,
                        空调: 3230,
                        照明: 3000
                    },
                    {
                        日期: "8月",
                        新风机: 2923,
                        空调: 2623,
                        照明: 3000
                    },
                    {
                        日期: "9月",
                        新风机: 1723,
                        空调: 1423,
                        照明: 4000
                    },
                    {
                        日期: "10月",
                        新风机: 3792,
                        空调: 3492,
                        照明: 0.323
                    }
                ]
            },
            barData: {
                columns: ["设备", "用电量"],
                rows: [{
                        设备: "空调",
                        用电量: 1393
                    },
                    {
                        设备: "照明",
                        用电量: 3530
                    },
                    {
                        设备: "新风",
                        用电量: 2923
                    }
                ]
            },
            deviceData: {
                columns: ["状态", "数量"],
                rows: [{
                        状态: "运行",
                        数量: 1393
                    },
                    {
                        状态: "故障",
                        数量: 3530
                    },
                    {
                        状态: "停止",
                        数量: 2923
                    }
                ]
            },
            carData: {
                columns: ["分类", "数量"],
                rows: [{
                        分类: "占用",
                        数量: 60
                    },
                    {
                        分类: "空余",
                        数量: 40
                    }
                ]
            },
            gfData: {
                columns: ["日期", "发电量"],
                rows: [{
                        日期: "00:00",
                        发电量: 0
                    },
                    {
                        日期: "06:00",
                        发电量: 20
                    },
                    {
                        日期: "12:00",
                        发电量: 100
                    },
                    {
                        日期: "18:00",
                        发电量: 40
                    }
                ]
            },
            currentData: {
                cday: 0,
                cweek: 0,
                cmonth: 0,
                cyear: 0
            }
        };
    },
    methods: {
        getTimes() {
            let _this = this;
            let datetime = new Date();
            _this.day = datetime.getDate();
            _this.min =
                datetime.getUTCMinutes() < 10 ?
                "0" + datetime.getUTCMinutes() :
                datetime.getUTCMinutes();
            _this.month = datetime.getMonth() + 1;
            _this.hour = datetime.getHours();
            _this.week = this.weeks[datetime.getDay()];
            setTimeout(_this.getTimes, 30000);
        },
        LoadFunArea(item) {
            this.$ajax
                .get(this.$URL + "/role/GetUserFuns", {
                    params: {
                        menudId: item.key
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.$store.commit("chanage_fun_menu", result.data.funs);
                        sessionStorage.funs = JSON.stringify(result.data.funs);
                        if (result.data.funs.length > 0) {
                            let fun = result.data.funs[0];
                            if (fun.config) {
                                let config = JSON.parse(fun.config);
                                if (config.route) {
                                    this.$router.push({
                                        name: config.route
                                    });
                                    // this.$store.commit('change_showHeader', true); //开启头部
                                    this.$store.commit("change_activeFunc", fun.label);
                                    sessionStorage.activefun = fun.label;
                                }
                            }
                        } else {
                            this.$store.commit("change_activeFunc", "");
                            sessionStorage.activefun = fun.label;
                        }
                        //   this.$store.commit('change_FirstArea', result.data.areas);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        Enter() {
            if (this.$store.state.app.menus.length > 0) {
                this.$store.commit(
                    "change_header_menu",
                    this.$store.state.app.menus[0]
                );
                this.LoadFunArea(this.$store.state.app.header_menu);
            }
        },
        changeMain(val) {
            if (val === 1) {
                this.$router.push({
                    name: "homepage"
                });
            } else if (val === 2) {
                this.$router.push({
                    name: "home2"
                });
            } else if (val === 3) {
                this.$router.push({
                    name: "home3"
                });
            }
        },
        getWeather() {
            this.$ajax
                .get(this.$URL + "/weather/GetWeather")
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.weatherclass = Weather[result.data.weathertype];
                        this.weathertype = result.data.weathertype;
                        this.high = result.data.high;
                        this.low = result.data.low.slice(0, result.data.low.length - 1);
                        this.sport = result.data.sport;
                        this.wind = result.data.wind;
                        this.windlevel = result.data.windlevel;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
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
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.commit("change_showHeader", false);
        });
    },
    beforeRouteLeave(to, from, next) {
        this.$store.commit("change_showHeader", true);
        next();
    }
};
</script>

<style lang="less" scoped>
.box {
    height: 100%;
    margin: 0 5px !important;
    padding: 10px 0;
    font-size: 12px;
    background: #040e17;

    .col {
        height: 100%;
    }
}

.line {
    background-color: #1e335a;
    width: 2px;
    height: 40px;
}

.jiao {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 10px 0 10px;
    border-color: #AAB5C9 transparent transparent transparent;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
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

.ruler {
    width: 75%;
    margin: 13px auto;
    height: 15px;
    border-bottom: 1px solid rgba(19, 49, 107, 1);
    display: flex;
    justify-content: space-between;

    .cm {
        display: flex;
        justify-content: space-between;
        width: 20%;

        .mm:nth-of-type(1) {
            height: 15px;
        }

        .mm:nth-of-type(5) {
            height: 12px;
        }

        .mm:nth-of-type(10) {
            margin-right: 3px;
        }
    }

    .mm {
        border-left: 1px solid rgba(19, 49, 107, 1);
        height: 8px;
        width: 1px;
        align-self: flex-end;
    }

    &>.cm:nth-of-type(6) {
        border-right: 1px solid rgba(19, 49, 107, 1);
    }
}

.areaenergy {
    font-size: 12px;
    height: calc(100% - 53px);
    display: flex;
    flex-direction: column;

    .itemrow {
        display: flex;
        flex: 1 1;
        justify-content: space-between;
        align-items: center;
        padding: 0 76px;

        .item {
            display: flex;
            height: 70px;

            >div:nth-of-type(1) {
                width: 70px;
                height: 70px;
                background: rgba(8, 149, 198, 1);
                border-radius: 4px;
                margin-right: 20px;
                display: flex;
                justify-content: center;
                align-items: center;

                i {
                    font-size: 40px;
                }
            }

            >div:nth-of-type(2) {
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
            font-size: 24px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
        }

        .span3 {
            i {
                color: #00ffff;
            }

            font-size: 13px;
            font-weight: 400;
            color: rgba(170, 181, 201, 1);
        }

        .infotext {
            display: flex;
        }
    }
}

.leftcard {
    .leftcardmode {
        height: 82px;
        // opacity: 0.76;
        display: flex;
        align-items: center;
        justify-content: space-around;
        // padding: 10px;
        box-sizing: content-box;

        i {
            font-size: 40px;
            color: #254885;
        }
    }

    .leftcardPM {
        margin-top: 10px;
        height: calc(100% - 92px);
        position: relative;

        .PMCircle {
            display: flex;
            align-items: center;
            justify-content: center;

            .solidcircle {
                border: 2px solid RGBA(34, 104, 183, 1);
                background-color: RGBA(1, 3, 6, 1);
                width: 146px;
                height: 146px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .dotcircle {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border: 2px dotted white;
                background-color: RGBA(1, 3, 6, 1);
                width: 130px;
                height: 130px;
                border-radius: 50%;

                .pmnum {
                    font-size: 38px;
                }

                .pmtext {
                    padding: 2px;
                    font-size: 10px;
                    background-color: green;
                }
            }
        }
    }

    .outpm {
        position: absolute;
        top: 20px;
        right: 20px;
        text-align: center;
        color: #8F99A9;

        div:nth-of-type(2) {
            background-color: #A69746;
            display: inline-block;
        }
    }

    .roomco2 {
        text-align: center;
        padding-top: 15px;

        &>span:nth-of-type(2) {
            font-size: 24px;
            font-weight: 400;
            color: rgba(23, 146, 3, 1);
        }
    }

    .temperature {
        margin: 10px auto;
        display: flex;
        justify-content: center;

        >div {
            color: RGBA(135, 145, 160, 1);
            text-align: center;

            span {
                font-size: 16px;
            }

            >div {
                font-size: 19px;
            }
        }

        >div:nth-of-type(1) {
            color: green;
        }

        >div:nth-of-type(2) {
            margin-left: 53px;
            color: RGBA(166, 151, 70, 1);
        }
    }

    .VOC {
        font-size: 19px;
        color: #cee4f4;
        text-align: center;
        margin-bottom: 40px;

        span:nth-of-type(2) {
            margin-left: 15px;
            color: #179203;
        }
    }

    .weather {
        font-size: 19px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60%;
        margin: 0 auto;

        i {
            font-size: 50px;
            color: #cee4f4;
        }

        >div {
            margin-left: 70px;
            text-align: center;

            span {
                display: block;
            }

            span:nth-of-type(1) {
                color: #cee4f4;
            }

            span:nth-of-type(2) {
                color: #5f6773;
                font-size: 17px;
            }
        }
    }

    .hoco {
        margin: 13px auto;
        display: flex;
        justify-content: center;

        >div {
            position: relative;
        }
    }

    hr {
        border: 0;
        background-color: #32538e;
        height: 1px;
        width: 60%;
        margin: 15px auto;
    }
}

.centercard {
    .centerheader {
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

    .centerbody {
        height: calc(100% - 92px);
        display: flex;
        flex-direction: column;

        .bodyup {
            height: 60%;
            margin-bottom: 10px;
            display: flex;

            .bodyupleft {
                width: 60%;
                height: 100%;
                border-right: 1px solid #354d79;

                .bodyupleft_up {
                    height: 70%;
                }

                .bodyupleft_down {
                    border-top: 1px solid #354d79;
                    height: 30%;
                }
            }

            .bodyupright {
                width: 40%;
                height: 100%;

                .info {
                    width: 100%;
                    height: calc(100% - 53px);
                    box-sizing: border-box;
                    font-size: 12px;

                    img {
                        background-size: 100% 100%;
                        height: 100%;
                        width: 100%;
                    }

                    .img {
                        margin: 0 20px;
                        height: 200px;
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
                        color: #aab5c9;
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
        }

        .bodydown {
            height: 40%;
            display: flex;

            .downright {
                width: 50%;
            }

            .downleft {
                margin-right: 10px;
                width: 50%;
            }
        }
    }
}

.rightcard {
    .rightcarddate {
        height: 82px;
        margin-bottom: 10px;

        .datetime {
            height: 100% !important;
            font-size: 12px;
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            .time {
                font-size: 32px;
                margin-right: 30px;
            }

            .date {
                font-size: 20px;
                color: rgba(165, 177, 195, 1);
            }
        }
    }

    .chartlist {
        height: calc(100% - 92px);

        >div {
            height: calc((100% - 20px) / 3);
        }

        >div:nth-of-type(2) {
            margin: 10px 0;
        }
    }
}
</style>
