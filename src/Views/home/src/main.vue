<template>
<div class="homePage">
    <div class="logo" @click="Enter"></div>
    <el-row type="flex" class="section-con">
        <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <div class="grid-content bg-purple">
                <!-- 设备总数 -->
                <div class="card-box device-total">
                    <div class="title"> <span>设备总数</span></div>
                    <div class="num-box flex">
                        <div class="num" v-for="(num,numIndex) in dayNum" :key="numIndex">
                            <div v-for="(item,index) in [9,8,7,6,5,4,3,2,1,0]" :key="index" :style="item<num?animationStyle(index,numIndex):''">{{num}}</div>
                        </div>
                    </div>
                </div>
                <!-- 视频设备 -->
                <div class="card-box video-device">
                    <div class="title"> <span>视频设备</span></div>
                    <div class="monitor flex">
                        <div>
                            <div class="text">在线设备</div>
                            <div class="m-num">{{camOnLine}}</div>
                            <div class="lines flex">
                                <span v-for="(item,key) in 20" :style="linesAnimationStyle(item)" :key="key"></span>
                            </div>
                        </div>
                        <div>
                            <div class="text">设备总数</div>
                            <div class="m-num">{{camCount}}</div>
                            <div class="lines flex">
                                <span v-for="(item,key) in 20" :style="linesAnimationStyle(item)" :key="key"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 实时告警 -->
                <div class="card-box Real-time">
                    <div class="title">
                        <span>实时告警</span>
                    </div>
                    <div class="table">
                        <div class="t-head  flex">
                            <div>告警设备</div>
                            <div>告警类型</div>
                            <div>告警时间</div>
                        </div>
                        <div class="t-body " ref="tBody">
                            <div class="t-list flex" v-for="(item,index) in alarmHData" :key="index">
                                <div>{{item.VariableName}}</div>
                                <div>
                                    {{alarmTypeL[item.AlarmSource] }}
                                </div>
                                <div class="t-time">{{item.DateStamp}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 24小时告警趋势 -->
                <div class="card-box video-device">
                    <div class="title"> <span>24小时告警趋势</span></div>
                    <div class="echart-24h">
                        <echart24h :height="'2rem'" :time="time" :general="general" :severity="severity" :urgency="urgency" />
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
            <div class="grid-content bg-purple-light">
                <div class="building"></div>
                <div class="card-box run-device">
                    <div class="title"> <span>主要设备运行监控</span></div>
                    <div class="echart-device flex">
                        <div class="d-container">
                            <div class="d-content">
                                <div class="d-content-box">
                                    <div class="d-num">
                                        <span>
                                            <count-to :startVal="0" :endVal="KT" :duration="2600" class="card-panel-num" />/</span>{{KT_all}}
                                    </div>
                                    <div class="d-name">空调机组</div>
                                </div>
                            </div>
                            <div class="border"></div>
                        </div>
                        <div class="d-container">
                            <div class="d-content">
                                <div class="d-content-box">
                                    <div class="d-num">
                                        <span>
                                            <count-to :startVal="0" :endVal="ba_xfj" :duration="2600" class="card-panel-num" />/</span>{{ba_xfj_all}}
                                    </div>
                                    <div class="d-name">变配电</div>
                                </div>
                            </div>
                            <div class="border"></div>
                        </div>
                        <div class="d-container">
                            <div class="d-content">
                                <div class="d-content-box">
                                    <div class="d-num">
                                        <span>
                                            <count-to :startVal="0" :endVal="RS" :duration="2600" class="card-panel-num" />/</span>{{RS_all}}
                                    </div>
                                    <div class="d-name">冷热源</div>
                                </div>
                            </div>
                            <div class="border"></div>
                        </div>
                        <div class="d-container">
                            <div class="d-content">
                                <div class="d-content-box">
                                    <div class="d-num">
                                        <span>
                                            <count-to :start-val="0" :end-val="FJ" :duration="2600" class="card-panel-num" />/</span>{{FJ_all}}
                                    </div>
                                    <div class="d-name">电梯</div>
                                </div>
                            </div>
                            <div class="border"></div>
                        </div>
                        <div class="d-container">
                            <div class="d-content">
                                <div class="d-content-box">
                                    <div class="d-num">
                                        <span>
                                            <count-to :startVal="0" :endVal="FDJ" :duration="2600" class="card-panel-num" />/</span>{{FDJ_all}}
                                    </div>
                                    <div class="d-name">发电机</div>
                                </div>
                            </div>
                            <div class="border"></div>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <div class="grid-content bg-purple">
                <div class="card-box EM">
                    <div class="title"> <span>环境监测</span></div>
                    <div class="environment flex">
                        <div class="e-pm flex">
                            <div class="e-loading">
                                <div class="e-text flex">
                                    <div class="e-text-num flex">优：29</div>
                                    <div class="e-text-title flex">PM 2.5</div>
                                </div>
                                <div class="e-line" v-for="(item,index) in 12" :key="index" :style="eLineStyle(index)"></div>
                            </div>
                        </div>
                        <div class="e-tem flex">
                            <div class="flex Shape"><span class="iconfont icon-wenshidu1"></span>室内温度：<span class="e-tem-num">23℃</span></div>
                            <div class="flex shui4"><span class="iconfont icon-fenzu"></span>相对湿度：<span class="e-tem-num">70%</span></div>
                        </div>
                    </div>
                </div>
                <div class="card-box Security-alarm">
                    <div class="title"><span>工单统计</span></div>
                    <pieChart :underway="underway" :done="done" :unfinished="unfinished"></pieChart>
                </div>
                <div class="card-box energy">
                    <div class="title"> <span>能耗概览</span></div>
                    <div class="echart-24h">
                        <energy></energy>
                    </div>
                    <div class="bottom">
                        <span>今日用能</span>
                        <el-row type="flex">
                            <el-col :span="8">
                                <div class="title-index">水</div>
                                <div class="cir">
                                    <i class="iconfont icon-shui"></i>
                                </div>
                                <div class="num">100 m³</div>
                            </el-col>
                            <el-col :span="8">
                                <div class="title-index">电</div>
                                <div class="cir">
                                    <i class="iconfont icon-139"></i>
                                </div>
                                <div class="num">100 kWh</div>
                            </el-col>
                            <el-col :span="8">
                                <div class="title-index">气</div>
                                <div class="cir">
                                    <i class="iconfont icon-qi"></i>
                                </div>
                                <div class="num">100 m³</div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import {
    RouteMng
} from "@/lib/Common.js"
import echart24h from '../echart24h'
import energy from '../energy'
import pieChart from '../pieChart'
import CountTo from 'vue-count-to'

export default {
    components: {
        echart24h,
        energy,
        pieChart,
        CountTo
    },
    //     1层弱电间门禁   离线报警 08:27
    // 3层护士站监控   离线报警 07:30
    // 报警主机        离线报警 07:40
    // 消防主机       离线报警 06:30
    data() {
        return {
            src: require('../images/66_03.png'),
            deviceStatistics: null,
            dayAll: '140', //设备总数
            camOnLine: '120', //在线设备
            camCount: '250', // 视频设备总数
            tableTimer: null,
            // alarmList: [],
            pageindex: 1, //当前页数
            pageSize: 4, //每页显示
            totalPage: 0, //总条数
            dom: null,
            // 时间
            time: ['00:01', '6:00', '7:20', '08:30', '13:30', '17:21'],
            // 普通
            general: ['0', '0', '0', '1', '0', '3'],
            // 严重
            severity: ['0', '0', '0', '0', '0', '0'],
            // 紧急
            urgency: ['0', '1', '2', '4', '8', '3'],
            // 报警类型
            alarmTypeL: [
                "普通事件",
                "紧急报警",
                "门禁报警",
                "视频报警",
                "火灾报警",
                "求助报警",
                "设备报警",
                "故障报警",
                "普通报警",
                "电流报警",
                "电压报警",
                "温度报警",
                "功率报警"
            ],
            fireAlarm: 12, //火灾报警
            intruderAlarm: 20, //紧急报警
            helpAlarm: 8, //求助报警

            ba_xfj: 20, // 新风机
            ba_xfj_all: 30,
            KT_all: 10, //空调
            KT: 3,
            FDJ_all: 5, // 发电机
            FDJ: 0,
            RS_all: 1, //冷热源
            RS: 1,
            FJ_all: 400, //风机盘管
            FJ: 100,
            alarmHData: [{
                VariableName: "发电机",
                AlarmSource: "1",
                DateStamp: "20:00:11"
            }, {
                VariableName: "火灾",
                AlarmSource: "5",
                DateStamp: "08:00:11"
            }, {
                VariableName: "发电机",
                AlarmSource: "1",
                DateStamp: "17:00:11"
            }, {
                VariableName: "火灾",
                AlarmSource: "5",
                DateStamp: "12:00:11"
            }],
            underway: '98',
            done: '112',
            unfinished: '152'
        }
    },
    watch: {
        alarmHData: {
            deep: true,
            handler(val) {
                if (val && val.length >= 1) {
                    const list = []
                    val.forEach(element => {
                        if (element.AlarmSource == '4') { // 火灾报警
                            list.push(element.AlarmSource)
                            this.fireAlarm = list.length
                        }
                        if (element.AlarmSource == '5') { // 求助报警
                            list.push(element.AlarmSource)
                            this.helpAlarm = list.length
                        }
                        if (element.AlarmSource == '1') { // 紧急报警
                            list.push(element.AlarmSource)
                            this.intruderAlarm = list.length
                        }
                    });
                }
            }
        }
    },
    computed: {
        dayNum() {
            let arr = [];
            let list = []
            if (this.dayAll.split("").length < 6) {
                for (let i = 0; i < 6 - this.dayAll.split("").length; i++) {
                    arr.unshift("0");
                }
                let list = arr.concat(this.dayAll.split(""))
                for (let i = 0; i < list.length; i++) {
                    list[i] = Number(list[i])
                }
                return list;
            } else {
                return list;
            }
        }
    },
    // 离开页面清除定时器
    beforeDestroy() {
        // this.$refs.offline.clearTime()
        if (this.tableTimer) {
            clearInterval(this.tableTimer)
        }
    },
    mounted() {
      //  this.tableScoll()

        if (this.alarmHData && this.alarmHData.length >= 1) {
            const list = []
            this.alarmHData.forEach(element => {
                if (element.AlarmSource == '4') { // 火灾报警
                    list.push(element.AlarmSource)
                    this.fireAlarm = list.length
                }
                if (element.AlarmSource == '5') { // 求助报警
                    list.push(element.AlarmSource)
                    this.helpAlarm = list.length
                }
                if (element.AlarmSource == '1') { // 紧急报警
                    list.push(element.AlarmSource)
                    this.intruderAlarm = list.length
                }
            });
        }
    },
    methods: {
        //表格滚动
        tableScoll() {
            this.tableTimer = setInterval(() => {
                let tBody = this.$refs.tBody;
                let dom = tBody.childNodes[0];
                if (dom) {
                    dom.classList.add('active')
                    setTimeout(() => {
                        tBody.removeChild(dom)
                        tBody.appendChild(dom)
                        dom.classList.remove('active')
                    }, 1000)
                }

            }, 1000)
        },
        //设备总数
        animationStyle(index, numIndex) {
            let num = (0.1 + 0.1 * (10 - index)) * (1)
            let styleobj = {
                animation: ' flipover-top .2s linear ' + num + 's 1 normal forwards'
            }
            return styleobj
        },
        //视频设备
        linesAnimationStyle(index) {
            let num = 0.1 * index
            let arr = [0.36, 0.16, 0.18, 0.24, 0.30, 0.20, 0.22, 0.12]
            let height = arr[Math.floor(Math.random() * arr.length)]
            let obj = {
                'animation-delay': num + 's',
                'height': height + 'rem'
            }
            return obj
        },
        //环境监测
        eLineStyle(index) {
            let num = index * 15
            let obj = {
                transform: 'rotate(' + num + 'deg)',
            }
            return obj
        },
        LoadFunArea(item) {
            this.$ajax.get(this.$URL + "/role/GetUserFuns", {
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
                           // this.vueroute = [];
                            // new RouteMng().createRouter(result.data.funs, this);
                            // if (this.$store.state.app.routes && this.$store.state.app.routes.children) {
                            //     this.$store.state.app.routes.children = this.$store.state.app.routes.children.concat(this.vueroute);
                            //     this.$router.addRoutes([this.$store.state.app.routes]);
                            //     this.$store.commit('change_route', this.$store.state.app.routes);
                            //     sessionStorage.route = JSON.stringify(this.$store.state.app.routes);
                            // }
                            
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
            //无一级菜单禁止跳转
            if (this.$store.state.app.menus.length > 0) {
                this.$store.commit(
                    "change_header_menu",
                    this.$store.state.app.menus[0]
                );
                this.LoadFunArea(this.$store.state.app.header_menu);
            }
        },

    },

    beforeRouteLeave(to, from, next) {
        // this.$store.commit("change_showHeader", true);
        if (this.timetick) {
            clearTimeout(this.timetick);
        }
        if (this.infotick) {
            clearTimeout(this.infotick);
        }
        next();
    }
}
</script>

<style lang="less" scoped>
.flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    justify-items: center;
}

.homePage {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0 auto;
    font-size: 12px;
    position: relative;

    .logo {
        height: 0.8rem;
        width: 100%;
        background-image: url("../images/logo.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        cursor: pointer;
        position: relative;
    }

    .section-con {
        position: relative;
        padding: 0 0.2rem;
        height: calc(100% - 80px);
        background-image: url('../images/bg.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;

        .grid-content {
            height: 100%;

            .device-total {
                height: 22%;
            }

            .video-device {
                height: 23%;
            }

            .Real-time {
                height: 28%;
            }

            .EM {
                height: 24%;
            }

            .run-device {
                height: 25%;
            }

            .Security-alarm {
                height: 25%;
            }

            .energy {
                height: 50%;
            }

            .card-box {
                width: 100%;
                // height: 100%;
                // margin-bottom: .15rem;
                border: none;

                .title {
                    height: .2rem;
                    line-height: .2rem;
                    font-size: .2rem;
                    width: 100%;
                    text-align: left;
                    margin-bottom: .2rem;

                    >span {
                        border-left: 2px solid #00ffff;
                        display: inline-block;
                        height: 100%;
                        color: #fefeff;
                        padding-left: 5px;
                    }
                }

                .bottom {
                    span {
                        display: block;
                        padding: 0 25px
                    }

                    .title-index {
                        text-align: center;
                        font-family: 'MicrosoftYaHei';
                        font-size: .16rem;
                        line-height: .35rem;
                        letter-spacing: 0px;
                        color: #ffffff;
                    }

                    .num {
                        text-align: center;
                        font-size: 14px;
                        line-height: 30px;
                        letter-spacing: 0px;
                        color: #93bbfd;
                    }

                    .cir {
                        width: .75rem;
                        height: .75rem;
                        background-color: #031c34;
                        border-radius: 50%;
                        line-height: .75rem;
                        text-align: center;
                        margin: 0 auto;

                        .iconfont {
                            font-size: 0.25rem;
                            color: #94bada;
                        }
                    }
                }

                &:last-child {
                    margin-bottom: 0;
                    flex: 1;
                    position: relative
                }
            }

        }
    }

    .num-box {
        height: 1.23rem;
        width: 100%;
        border-bottom: 1px solid #164d87;

        .num {
            height: .8rem;
            width: .56rem;
            position: relative;
            overflow: hidden;
            display: inline-block;
        }

        .num>div {
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            color: #c8e7fd;
            background-color: #053a65;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: .6rem;
            position: absolute;
            transform-origin: bottom;

        }
    }

    //视频设备
    .monitor {
        >div {
            width: 1.7rem;
            height: 100%;

            .text {
                color: #4080e1;
                height: .25rem;
                line-height: .25rem;
                font-size: .18rem;
                text-align: left;
                // margin-top: .3rem;
                margin-bottom: .17rem;
            }

            .m-num {
                color: #01e8fd;
                line-height: .25rem;
                font-size: .16rem;
                text-align: left;
            }

            .lines {
                height: .68rem;
                position: relative;
                align-items: flex-end;

                >span {
                    display: block;
                    bottom: 0px;
                    width: 2px;
                    height: .2rem;
                    background: #2274c9;
                    transform-origin: bottom;
                    animation: preloader_1 1.5s infinite ease-in-out;
                }
            }
        }
    }

    //             // 实时告警
    .table {
        .t-head {
            background-color: #164c83;
            height: .26rem;
            width: 100%;
            color: #61a3e7;
            line-height: .26rem;
            font-size: .18rem;

            >div {
                flex: 1;
                border-right: 1px solid #000001;
                text-align: center;

                &:last-child {
                    border: none;
                }
            }
        }

        .t-body {
            height: 1.6rem;
            overflow: hidden;

            .t-list {
                height: .4rem;
                width: 100%;
                color: #fefeff;
                line-height: .4rem;
                font-size: .16rem;
                transition: 0.5s ease;
                text-align: center;
                overflow: hidden;

                &.active {
                    height: 0;
                }

                >div {
                    flex: 1;
                }

                .t-time {
                    font-size: .13rem;
                }
            }
        }
    }

    .building {
        height: 73%;
        width: 100%;
        background-image: url('../images/66_03.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        cursor: pointer;
        // animation: flipInY 300ms .1s ease both
    }

    .echart-device {
        height: 2rem;
        width: 100%;

        >div.d-container {
            width: 1.75rem;
            height: 1.75rem;
            background-color: wheat;
            position: relative;
            border-radius: 50%;
            z-index: 1;

            .border {
                margin: 0 auto;
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                overflow: hidden;
                /* transition: ease 0.5s; */
                top: 0;
                left: 0;
                z-index: 2;
                background: #355D8D;
            }

            .border::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                z-index: 4;
                width: 100%;
                height: 30%;
                border-radius: 50%;
            }

            .d-content {
                position: absolute;
                top: 10px;
                left: 10px;
                width: calc(100% - 20px);
                height: calc(100% - 20px);
                border-radius: 50%;
                background-color: #000000;
                color: wheat;
                z-index: 3;

                .d-content-box {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;

                    >div {
                        width: 100%;
                        // height: 50%;
                        font-size: .24rem;
                        text-align: center;
                    }

                    .d-num {
                        color: #ffffff;

                        >span {
                            color: #5abefe;
                        }
                    }

                    .d-name {
                        font-size: .2rem;
                        color: #fffefe;
                    }
                }

            }

            &:nth-child(1) {
                .border {
                    animation: out-down 8s linear 0s infinite;
                }

                .border::after {
                    background: linear-gradient(to right, #355D8D, green);
                }
            }

            &:nth-child(2) {
                .border {
                    animation: out-down 8s linear 0.5s infinite;
                }

                .border::after {
                    background: linear-gradient(to right, #355D8D, #309d9a);
                }
            }

            &:nth-child(3) {
                .border {
                    animation: out-down 8s linear 1s infinite;
                }

                .border::after {
                    background: linear-gradient(to right, #355D8D, #0054b0);
                }
            }

            &:nth-child(4) {
                .border {
                    animation: out-down 8s linear 1.5s infinite;
                }

                .border::after {
                    background: linear-gradient(to right, #355D8D, #7901fc);
                }
            }

            &:nth-child(5) {
                .border {
                    animation: out-down 8s linear 2s infinite;
                }

                .border::after {
                    background: linear-gradient(to right, #355D8D, #9f2842);
                }
            }
        }

    }

    .environment {
        height: 1.4rem;

        >div {
            flex: 1;
            height: 100%;

            &.e-pm {
                position: relative;
                border-radius: 50%;
                justify-content: center;

                .e-loading {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 80%;
                    height: 80%;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);

                    .e-text {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        // background-color: #309d9a;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        justify-content: center;
                        flex-wrap: wrap;

                        >div {
                            width: 100%;
                            height: 50%;
                            justify-content: center;
                            font-size: .16rem;
                            color: #797979;

                            &.e-text-num {
                                align-items: flex-end;
                                color: #00b2b2;
                                font-size: .2rem
                            }
                        }
                    }

                    .e-line {
                        position: absolute;
                        top: -5px;
                        left: 50%;
                        transform: translate(-50%, 0);
                        width: 3px;
                        height: calc(100% + 10px);

                        &::after {
                            position: absolute;
                            content: "";
                            top: 0;
                            left: 0;
                            width: 3px;
                            height: 10px;
                            background-color: #0e4848;

                        }

                        &::before {
                            position: absolute;
                            content: "";
                            bottom: 0;
                            left: 0;
                            width: 3px;
                            height: 10px;
                            background-color: #0e4848;
                        }

                        &:nth-child(1):before {
                            -webkit-animation: load 4.8s linear 0s infinite;
                        }

                        &:nth-child(2):before {
                            -webkit-animation: load 4.8s linear 0.1s infinite;
                        }

                        &:nth-child(3):before {
                            -webkit-animation: load 4.8s linear 0.2s infinite;
                        }

                        &:nth-child(4):before {
                            -webkit-animation: load 4.8s linear 0.3s infinite;
                        }

                        &:nth-child(5):before {
                            -webkit-animation: load 4.8s linear 0.4s infinite;
                        }

                        &:nth-child(6):before {
                            -webkit-animation: load 4.8s linear 0.5s infinite;
                        }

                        &:nth-child(7):before {
                            -webkit-animation: load 4.8s linear 0.6s infinite;
                        }

                        &:nth-child(8):before {
                            -webkit-animation: load 4.8s linear 0.7s infinite;
                        }

                        &:nth-child(9):before {
                            -webkit-animation: load 4.8s linear 0.8s infinite;
                        }

                        &:nth-child(10):before {
                            -webkit-animation: load 4.8s linear 0.9s infinite;
                        }

                        &:nth-child(11):before {
                            -webkit-animation: load 4.8s linear 1s infinite;
                        }

                        &:nth-child(12):before {
                            -webkit-animation: load 4.8s linear 1.1s infinite;
                        }

                        &:nth-child(13):before {
                            -webkit-animation: load 4.8s linear 1.2s infinite;
                        }

                        &:nth-child(1)::after {
                            -webkit-animation: load 4.8s linear 1.3s infinite;
                        }

                        &:nth-child(2)::after {
                            -webkit-animation: load 4.8s linear 1.4s infinite;
                        }

                        &:nth-child(3)::after {
                            -webkit-animation: load 4.8s linear 1.5s infinite;
                        }

                        &:nth-child(4)::after {
                            -webkit-animation: load 4.8s linear 1.6s infinite;
                        }

                        &:nth-child(5)::after {
                            -webkit-animation: load 4.8s linear 1.7s infinite;
                        }

                        &:nth-child(6)::after {
                            -webkit-animation: load 4.8s linear 1.8s infinite;
                        }

                        &:nth-child(7)::after {
                            -webkit-animation: load 4.8s linear 1.9s infinite;
                        }

                        &:nth-child(8)::after {
                            -webkit-animation: load 4.8s linear 2s infinite;
                        }

                        &:nth-child(9)::after {
                            -webkit-animation: load 4.8s linear 2.1s infinite;
                        }

                        &:nth-child(10)::after {
                            -webkit-animation: load 4.8s linear 2.2s infinite;
                        }

                        &:nth-child(11)::after {
                            -webkit-animation: load 4.8s linear 2.3s infinite;
                        }

                        &:nth-child(12)::after {
                            -webkit-animation: load 4.8s linear 2.4s infinite;
                        }

                        &:nth-child(13)::after {
                            -webkit-animation: load 4.8s linear 2.5s infinite;
                        }
                    }

                }
            }

            &.e-tem {
                justify-content: center;
                flex-wrap: wrap;
                color: #accbf6;
                font-size: .16rem;

                >div {
                    height: 50%;
                    width: 100%;
                    justify-content: center;

                    &.Shape>span {
                        color: #08aeac;

                        &.iconfont {
                            font-size: 0.3rem;
                            margin-right: .01rem;
                        }

                        &.e-tem-num {
                            font-size: 0.3rem;
                        }
                    }

                    &.shui4>span {
                        color: #2274c9;

                        &.iconfont {
                            font-size: 0.3rem;
                            margin-right: .01rem;
                        }

                        &.e-tem-num {
                            font-size: 0.3rem;
                        }
                    }
                }
            }
        }

    }

}

@-webkit-keyframes flipover-top {
    0% {
        z-index: 8;
        transform: rotateX(0);
        -webkit-perspecitve-origin: 0% 50%;
    }

    50% {
        z-index: 8;
        transform: rotateX(-90deg);
        -webkit-perspecitve-origin: 0% 50%;
        opacity: 1;
    }

    100% {
        z-index: 7;
        opacity: 0;
        transform: rotateX(-180deg);
        -webkit-perspecitve-origin: 0% 50%;
    }
}

@keyframes preloader_1 {
    0% {
        transform: translateY(0px);
        background: #2274c9;
    }

    25% {
        transform: translateY(-1px);
        background: #61a3e7;
    }

    50% {

        transform: translateY(0px);
        background: #2274c9;
    }

    100% {
        transform: translateY(0px);
        background: #61a3e7;
    }
}

@-webkit-keyframes load {
    0% {
        /* opacity: 0; */
        background-color: #0e4848;
    }

    100% {
        background-color: #27CFD1;
    }
}

@-webkit-keyframes flipInY {
    0% {
        -webkit-transform: perspective(400px) rotateY(90deg);
        opacity: 0;
    }

    40% {
        -webkit-transform: perspective(400px) rotateY(-10deg);
    }

    70% {
        -webkit-transform: perspective(400px) rotateY(10deg);
    }

    100% {
        -webkit-transform: perspective(400px) rotateY(0deg);
        opacity: 1;
    }
}
</style>
