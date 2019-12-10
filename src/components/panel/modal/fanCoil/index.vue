<template>
<!--风机盘管-->
<transition enter-active-class="fadeInDown" leave-active-class="fadeOutUp">
    <el-card class="box-card" v-show="el_card_show" :style="el_card_style">
        <div slot="header" class="clearfix">
            <span>{{panelName}}</span>
            <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-close" @click="close"></i>
            </el-button>
        </div>
        <!--模式设定-->
        <el-row class="border-b">
            <el-col :span="4">
                <div style="line-height: 45px">模式设定 :</div>
            </el-col>
            <el-col :span="20" class="mode-setting">
                <radio @setMode="setMode"></radio>
            </el-col>
        </el-row>
        <el-row class="border-b">
            <dash-doard :min="0" :max="50" width="150px" height="150px" :displayVal="panelParamter.RoomTemp" :valueColor="backColor" echart_id="backWeather" textName="室内温度" unit="℃">
            </dash-doard>
        </el-row>
        <el-row class="border-b">
            <el-col :span="12">
                <el-row>
                    <el-col class="air-tit">
                        回风温度
                    </el-col>
                    <el-col>
                        <el-row class="slhf">
                            <el-col :span="8">
                                <img :src="icon" alt="">
                                </el-col>
                                <el-col :span="10">
                                    <span class="num">{{panelParamter.RoomTemp}}<i>℃</i></span>
                                </el-col>
                                <el-col :span="6">
                                    <el-col>
                                        <el-button type="text" @click="add">+</el-button>
                                    </el-col>
                                    <el-col>
                                        <el-button type="text" @click="subtract">-</el-button>
                                    </el-col>
                                </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <el-row :gutter="10">
                    <el-col class="air-tit">风量调节</el-col>
                    <el-col class="air-regulation">
                        <div class="box" v-for="(item,index) in tabs" :key="index" :class="[isShow == (index+1)?'airA':'' ]" @click="OnClick(index+1)">
                            <!-- <img :src="isShow == index ? item.srcA : item.src" alt=""> -->
                            <i :class="item.icon"></i>
                            <div>{{item.name}}</div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!--开/关-->
        <el-row class="switch">
            <el-col>
                <img style="cursor: pointer;" :src="panelParamter.RunningState==1? kai : guan" alt="" @click="switchChange">
                </el-col>
        </el-row>
    </el-card>
</transition>
</template>

<script>
import {mapState} from 'vuex'
import dashDoard from '@/components/panel/common/dash-doard/meter.vue'
import radio from '@/components/panel/common/radio-btn/FRadio'
import cmd from '@/lib/CMD'
export default {
    props: {
        props_id: {
            default: ''
        }
    },
    computed: {
        ...mapState({
            // connection: state => state.signalr.connection,
            // scadaHub: state => state.signalr.scadaHub,
            realData: state => state.signalr.realData
        }),
    },
    watch: {
        realData: {
            handler(v1, v2) {
                let _this = this;
                if (v1 && v1.length > 0) {
                    v1.forEach((v, i) => {
                       this.panelParamter[v.ID]=v.Value;
                    });
                }
            }
        }
    },
    data() {
        return {
            title: '风机盘管',
            isShow: 1,
            number: 27,
            oC: 27, //温度
            backWeather: 1,
            backColor: '#33bcc5',
            switchOn: false, //开/关
            icon: import('./images/fengjipg.svg'),
            kai: import('../sendingAir/images/kai.svg'),
            guan: import('../sendingAir/images/guan.svg'),
            tabs: [{
                    icon: 'iconfont icon-zidongqianx',
                    name: '自动'
                },
                {
                    icon: 'iconfont icon-disu',
                    name: '低速'
                }, {
                    icon: 'iconfont icon-caozuo_zhongsu',
                    name: '中速'
                }, {
                    icon: 'iconfont icon-hekr',
                    name: '高速'
                }
            ],
            el_card_show: false,
            el_card_style: '',
            panelName: '',
            panelParamter: {
                SetMode: '', //模式设定
                RoomTemp: '0', //室内温度,
                TempSet: '', //温度设定
                FanSpeed: '', //风量调节
                RunningState: '0', //运行状态
                RunStopSW: '', //启停控制
            },
            config: null,
            interval: null,
            n: 'fancoil'
        }
    },
    components: {
        dashDoard,
        radio
    },
    mounted() {
        this.el_card_show = true;
        this.LoadConfig();
    },
    methods: {
        LoadConfig() {
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.$ajax.get(this.$URL + '/panel/PanelConfig', {
                params: {
                    id: this.props_id || this.data_id,
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    if (result.data.data) {
                        this.config = JSON.parse(result.data.data);
                        if (this.config) {
                            cmd.signalrVarSubscribePanel(this, this.config, null, this.n, this.n)
                        }
                        this.panelName = result.data.name;
                        // if (result.data.data) {
                        //     this.read();
                        //     this.interval = setInterval(this.read, 2000);
                        // }
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        read() {
            cmd.Read(this, this.config);

        },
        close() {
            this.el_card_show = false;
            cmd.unSubscribe(this,this.n, this.n);
            // if (this.interval) {
            //     clearInterval(this.interval);
            // }
            // setTimeout(() => {
            //     this.$el.parentNode.removeChild(this.$el)
            // }, 2000);
        },
        OnClick(num) {
            this.isShow=num;
            // cmd.write(this, this.config ? this.config.FanSpeed : '', num);
            cmd.signalrWrite(this, this.config ? this.config.FanSpeed : '', num);
        },
        //      切换开关
        switchChange() {
            cmd.signalrWrite(this, this.config ? this.config.RunStopSW : '', this.panelParamter.RunningState == 0 ? '1' : '0');
            // cmd.write(this, this.config ? this.config.RunStopSW : '', this.panelParamter.RunningState == 1 ? 0 : 1);
        },
        add() {
            // cmd.write(this, this.config ? this.config.TempSet : '', this.panelParamter.RoomTemp++);
            cmd.signalrWrite(this, this.config ? this.config.TempSet : '', this.panelParamter.RoomTemp++);

        },
        subtract() {
            // cmd.write(this, this.config ? this.config.TempSet : '', this.panelParamter.RoomTemp--);
            cmd.signalrWrite(this, this.config ? this.config.TempSet : '', this.panelParamter.RoomTemp--);

        },
        setMode(val) {
            //   cmd.write(this, this.config['SetMode'], val);
            cmd.signalrWrite(this, this.config['SetMode'], val);
        }
    }
}
</script>

<style scoped>
.box-card {
    width: 428px;
    margin: 0px auto;
    font-size: 14px;
    color: #616265;
    background: #1B1E26;
    border: 0;
    max-height: 580px;
}

.box-card /deep/ .el-card__body {
    text-align: center;
}

.box-card /deep/ .el-card__header {
    border-bottom: 1px solid #292D37 !important;
    padding: 10px 20px;
    overflow: hidden;
    font-size: 16px;
}

.mode-setting,
.air-regulation {
    font-size: 12px;
    line-height: 20px;
    display: flex;
    margin: 10px 0;
}

.mode-setting>div,
.air-regulation>div {
    flex: 1;
    margin: 0px 5px;
    cursor: pointer;
}

.air-tit {
    text-align: left;
    line-height: 35px;
}

.switch {
    padding: 15px 0;
}

.box {
    border: 1px solid #333;
}

.active {
    color: #13D3D1;
}

.airA {
    color: #38B7D1;
    border: 1px solid #38B7D1;
}

.slhf {
    margin: 0px 10px;
    padding: 10px 0;
    border: 1px solid #13151b
}

.slhf img {
    margin-right: 10px;
}

.slhf .num {
    color: #E58B21;
    line-height: 40px;
}

.slhf .num i {
    color: #616265;
    font-style: normal;
}

.el-button {
    font-size: 18px;
    color: #535354;
    padding: 0
}
</style>
