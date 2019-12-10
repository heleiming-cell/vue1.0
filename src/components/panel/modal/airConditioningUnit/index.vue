<template>
<!--空调机组-->
<transition enter-active-class="fadeInDown" leave-active-class="fadeOutUp">
    <el-card class="box-card" :style="el_card_style" v-show="el_card_show">
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
        <!--设置-->
        <el-row class="border-b">
            <el-row class="setting-con">
                <el-col :span="8">
                    <img :src="panelParamter.FaultAlarm==1 ? icon : icon1" alt="" :class="panelParamter.RunningState==1 ? 'rotation' : ''"></img>
                </el-col>
                <el-col :span="8">
                    <span>{{panelParamter.SupplyTemp}}</span>
                </el-col>
                <!--设置btn-->
                <el-col :span="8">
                    <img :src="setting" alt="" class="setting cursor" @click="OnClickSetting"></img>
                    <el-dialog class="setting-box" :visible.sync="isShow" width="18%" :append-to-body="true" :before-close="handleClose" center>
                        <el-form ref="form" :model="form" label-width="80px">
                            <el-form-item label="送风温度" class="border-b">
                                <process-bar :min="0" :max="100" leftBg="#EA750D" v-model="form.sfT"></process-bar>
                            </el-form-item>
                            <el-form-item label="送风湿度" class="border-b">
                                <process-bar :min="0" :max="100" leftBg="#169BBC" v-model="form.sfH"></process-bar>
                            </el-form-item>
                            <el-form-item label="回风温度" class="border-b">
                                <process-bar :min="0" :max="100" leftBg="#EA750D" v-model="form.hfT"></process-bar>
                            </el-form-item>
                            <el-form-item label="回风湿度" class="border-b">
                                <process-bar :min="0" :max="100" leftBg="#169BBC" v-model="form.hfH"></process-bar>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                </el-col>
            </el-row>
        </el-row>
        <!--送风 / 回风-->

        <!-- 送风温度 -->
        <el-row :gutter="10" class="border-b">
            <el-col :span="6">
                <div>送风温度</div>
                <div class="box">
                    <div class="humidity">{{panelParamter.SupplyTemp}}</div>
                    <div>℃</div>
                </div>
            </el-col>
            <!-- 送风湿度 -->
            <el-col :span="6">
                <div>送风湿度</div>
                <div class="box">
                    <div class="temperature">{{panelParamter.SupplyHumi}}</div>
                    <div>%RH</div>
                </div>
            </el-col>
            <!-- 回风温度 -->
            <el-col :span="6">
                <div>回风温度</div>
                <div class="box">
                    <div class="humidity">{{panelParamter.ReturnTemp}}</div>
                    <div>℃</div>
                </div>
            </el-col>
            <!-- 回风湿度 -->
            <el-col :span="6">
                <div>回风湿度</div>
                <div class="box">
                    <div class="temperature">{{panelParamter.ReturnHumi}}</div>
                    <div>%RH</div>
                </div>
            </el-col>
        </el-row>
        <!--滤网报警-->
        <el-row class="border-b">
            <el-col :span="4">
                <div style="line-height: 45px">滤网报警</div>
            </el-col>
            <el-col :span="10">
                <img :src="panelParamter.FilterAlarm==0 ? normal : huise" alt=""></img>
                <div>正常</div>
            </el-col>
            <el-col :span="10">
                <img :src="panelParamter.FilterAlarm==1 ? malfunction : huise" alt=""></img>
                <div>故障</div>
            </el-col>
        </el-row>
        <el-row class="border-b aperture">
            <el-row :gutter="20">
                <el-col :span="8">
                    水阀开度 :
                    <span class="valve">{{panelParamter.WaterValueFB}}</span>
                    <el-row>
                        <el-col :span="8" class="img">
                            <img :src="kaifa" alt=""></img>
                        </el-col>
                        <el-col :span="16">
                            <my-progress :min="0" :max="100" leftBg="#029cae" :variable="config?config.WaterValue:''" :value="panelParamter.WaterValue"></my-progress>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="8">
                    回风阀开度 :
                    <span class="air">{{panelParamter.ReAirValveAd}}</span>
                    <el-row>
                        <el-col :span="8" class="img">
                            <img :src="air" alt=""></img>
                        </el-col>
                        <el-col :span="16">
                            <my-progress :min="0" :max="100" leftBg="#034889" :variable="config?config.ReAirValveAd:''" :value="panelParamter.ReAirValveAd"></my-progress>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="8">
                    新风阀开度 :
                    <span class="air">{{panelParamter.FreAirValveFb}}</span>
                    <el-row>
                        <el-col :span="8" class="img">
                            <img :src="newTrend" alt=""></img>
                        </el-col>
                        <el-col :span="16">
                            <my-progress :min="0" :max="100" leftBg="#095a7a" :variable="config?config.FreAirValveAd:''" :value="panelParamter.FreAirValveAd"></my-progress>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-row>
        <el-row>
            <el-col :span="12">
                <!--手动 自动-->
                <el-row class="HM-box">
                    <el-col class="HM-img">
                        <span class="manual">手动</span>
                        <span class="self-motion">自动</span>
                        <img  :src="panelParamter.AutoMode==1 ? shoudong : zhidong" class="switch cursor" alt="" @click="HMChange"></img>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <!--状态-->
                <el-row class="run-states">
                    <el-col :span="12">
                        <img :src="panelParamter.RunningState==1 ? normal : huise" alt=""></img>
                        <div class="status">运行</div>
                    </el-col>
                    <el-col :span="12">
                        <img :src="panelParamter.FaultAlarm==1 ? malfunction : huise" alt=""></img>
                        <div class="status">故障</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <!-- <img :src="switchOn ? kai : guan" alt="" @click="changeSwitch"></img> -->
                        <img style="cursor: pointer;" :src=" kai" alt="" @click="changeSwitch"></img>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </el-card>
</transition>
</template>

<script>
import myProgress from '../../common/progress/progress.vue'
import processBar from '../../common/progress/processBar.vue'
import radio from '../../common/radio-btn/Radio.vue'
import cmd from '@/lib/CMD'
export default {
    props: {
        props_id: {
            default: ''
        }
    },
    data() {
        return {
            title: '空调机组',
            progress: '50',
            pre: '20',
            HM: true,
            status: true,
            switchOn: true,
            operation: true, // 运行 / 故障
            filter: true, // 滤网报警
            isShow: false,
            setting: require('../newTrend/images/shez.svg'),
            shoudong: require('../sendingAir/images/shoudong.svg'),
            zhidong: require('../sendingAir/images/zhidong.svg'),
            normal: require('../sendingAir/images/zhengc.svg'),
            malfunction: require('../sendingAir/images/guzang.svg'),
            huise: require('../sendingAir/images/huise.svg'),
            kai: require('../sendingAir/images/kai.svg'),
            guan: require('../sendingAir/images/guan.svg'),
            kaifa: require('../newTrend/images/kaifa.svg'),
            icon: require('./images/AHUicon.svg'),
            icon1: require('./images/AHUicon1.svg'),
            air: require('./images/kongtiaojz7.svg'),
            newTrend: require('./images/kongtiaojz8.svg'),
            form: {
                sfT: '45',
                sfH: '35',
                hfT: '45',
                hfH: '35'
            },
            el_card_style: '',
            el_card_show: false,
            panelName:'',
            panelParamter: {
                // name: '',
                SetPattern: '', //模式设定
                SetTemp: '', //温度设定,
                SupplyTemp: '', //送风温度
                SupplyHumi: '', //送风湿度
                ReturnTemp: '0', //回风温度
                ReturnHumi: '', //回风湿度
                FilterAlarm: '', //滤网报警
                WaterValue: '', //水阀调节
                WaterValueFB: '', //水阀反馈
                FreAirValveAd: '', //新风阀调节
                FreAirValveFb: '', //新风阀反馈
                ReAirValveAd: '', //回风阀调节
                ReAirValveAd: '', //ReAirValveAd
                AutoMode: '', //手动自动
                FaultAlarm: '', //故障报警
                RunningState: '', //运行状态
                RunStopSW: '', //启停
            },
            config: null,
            interval: null,
        }
    },
    components: {
        myProgress,
        processBar,
        radio
    },
    mounted() {
        this.el_card_show = true;
        this.LoadConfig();
    },
    methods: {
        LoadConfig() {
            if(this.interval)
            {
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
                        this.panelName=result.data.name;
                        if (result.data.data)
                        {
                            this.read();
                            this.interval = setInterval(this.read, 2000);
                        }
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        read() {
            cmd.Read(this, this.config);
        },
        //      设置
        OnClickSetting() {
            this.isShow = !this.isShow
        },
        //      手动 自动
        HMChange() {
            cmd.signalrWrite(this, this.config['AutoMode'], this.panelParamter.AutoMode == 1 ? 0 : 1);
        },
        changeSwitch() {
            // cmd.write(this, this.config ? this.config.RunStopSW : '', this.panelParamter.RunningState == 1 ? 0 : 1);
            cmd.signalrWrite(this,this.config ? this.config.RunStopSW : '',this.panelParamter.RunningState == 1 ? 0 : 1);

        },
        handleClose() {
            this.isShow = false
        },
        close() {
            this.el_card_show = false;
            if (this.interval) {
                clearInterval(this.interval);
            }
            setTimeout(() => {
                this.$el.parentNode.removeChild(this.$el)
            }, 2000);
        },
        setMode(val) {
            cmd.write(this, this.config['SetPattern'], val);
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
    max-height: 700px;
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

.box-card /deep/ .el-icon-close {
    font-size: 20px;
    color: #7F7C7A;
}

.box-card .setting-con {
    width: 50%;
    margin: 0px auto;
    font-size: 30px;
    color: #259594;
}

.box {
    font-size: 16px;
    margin: 10px 0;
    padding: 8px 0;
    border: 1px solid #13151B;
    border-radius: 5px;
    background: #1D1E1F;
}

.humidity,
.temperature {
    font-size: 24px;
}

.humidity {
    color: #E58B21;
}

.temperature {
    color: #259594;
}

.HM-box,
.run-states {
    padding: 10px 0;
}

.HM-img {
    margin-top: 20px;
}

.manual,
.self-motion {
    position: absolute;
    top: 20px;
    font-size: 12px;
    color: #616265;
}

.manual {
    left: 130px;
}

.self-motion {
    right: 130px;
}

.rotation {
    transform: rotate(360deg);
    animation: rotation 1s linear infinite;
}

@keyframes rotation {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.aperture {
    font-size: 12px;
}

.aperture .img {
    line-height: 40px;
}

.aperture .valve,
.aperture .air {
    padding: 0px 2px;
}

.aperture .valve {
    color: #238383;
}

.aperture .air {
    color: #084f94;
}

.active {
    color: #13D3D1;
}

.mode-setting {
    font-size: 12px;
    line-height: 20px;
    display: flex;
}

.mode-setting>div {
    flex: 1;
    margin: 0px 5px;
    cursor: pointer;
}

.setting {
    width: 40px;
}
</style>
