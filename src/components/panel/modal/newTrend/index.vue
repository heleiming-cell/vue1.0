<template>
<transition enter-active-class="fadeInDown" leave-active-class="fadeOutUp">
    <el-card class="box-card" v-show="el_card_show" :style="el_card_style">
        <div slot="header" class="clearfix">
            {{panelName}}
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
            <el-col>
                <el-row class="newTrend">
                    <el-col :span="8">
                        <img :src="fengs" alt="" :class="[panelParamter.RunningState==1 ? 'rotation' : '']"></img>
                    </el-col>
                    <el-col :span="8">
                        <span>{{panelParamter.SupplyTemp}}</span>
                    </el-col>
                    <!--设置-->
                    <el-col :span="8">
                        <img :src="setting" class="setting" alt="" @click="OnClickSetting"></img>
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
            </el-col>
        </el-row>
        <el-row class="border-b blowing-in">
            <el-col :span="12">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <div>送风温度</div>
                        <div class="box">
                            <div class="humidity">{{panelParamter.SupplyTemp}}</div>
                            <div>℃</div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div>送风湿度</div>
                        <div class="box">
                            <div class="temperature">{{panelParamter.SupplyHumi}}</div>
                            <div>%RH</div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <div>滤网报警</div>
                <el-row class="strainer-state">
                    <el-col :span="12">
                        <img :src="panelParamter.FilterAlarm==0? normal:huise" alt=""></img>
                        <div class="states">正常</div>
                    </el-col>
                    <el-col :span="12">
                        <img :src="panelParamter.FilterAlarm==1? normal:huise" alt=""></img>
                        <div class="states">故障</div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row class="border-b" :gutter="20">
            <!--水阀开度-->
            <el-col :span="12">
                <el-row>
                    水阀开度:
                    <span class="aperture">100%</span>
                </el-row>
                <el-row class="water-value">
                    <el-col :span="8">
                        <img :src="kaifa" alt=""></img>
                    </el-col>
                    <el-col :span="16">
                        <process-bar :min="0" :max="100" leftBg="#029cae" :variable="config?config.SetWaterValue:''" :value="panelParamter.SetWaterValue"></process-bar>
                    </el-col>
                </el-row>
            </el-col>
            <!--新风阀开关-->
            <el-col :span="12">
                <el-row>
                    新风阀开关:
                    <span v-if="newTrend" class="switch-state">开</span>
                    <span v-else class="switch-state">关</span>
                </el-row>
                <el-row class="switch-btn">
                    <el-col :span="12">
                        <el-button size="mini" :class="newTrend ? 'on' : 'off' " @click="onClickSwitchOn">开</el-button>
                    </el-col>
                    <el-col :span="12">
                        <el-button size="mini" :class="newTrend ? 'off' : 'on' " @click="onClickSwitchOff">关</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <!--手动 自动-->
                <el-row class="HM-box">
                    <el-col class="HM-img">
                        <span class="manual">手动</span>
                        <span class="self-motion">自动</span>
                        <img :src="panelParamter.AutoMode==0 ? shoudong : zhidong" class="switch" alt="" @click="HMChange"></img>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <!--状态-->
                <el-row class="run-states">
                    <el-col :span="12">
                        <img :src="panelParamter.FaultAlarm==0 ? normal : huise" alt=""></img>
                        <div class="status">运行</div>
                    </el-col>
                    <el-col :span="12">
                        <img :src="panelParamter.FaultAlarm==1 ? malfunction : huise" alt=""></img>
                        <div class="status">故障</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <!-- <img :src="RunStopSW ? kai : guan" alt="" @click="changeSwitch" ></img> -->
                        <img style="cursor: pointer;" :src=" panelParamter.RunStopSW==1? kai : guan " alt="" @click="changeSwitch" ></img>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </el-card>
</transition>
</template>

<script>
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
            progress: '30',
            fengs: require('./images/fengs.svg'),
            setting: require('./images/shez.svg'), //设置
            normal: require('./images/zhengc.svg'),
            huise: require('./images/huise.svg'),
            kaifa: require('./images/kaifa.svg'),
            shoudong: require('./images/shoudong.svg'),
            zhidong: require('./images/zhidong.svg'),
            malfunction: require('./images/guzang.svg'),
            huise: require('./images/huise.svg'),
            kai: require('./images/kai.svg'),
            guan: require('./images/guan.svg'),
            isShow: false,
            newTrend: true, // 新风阀开关
            status: true,
            operation: true, // 故障/运行
            HM: true,
            switchOn: true,
            form: {
                sfT: '45',
                sfH: '35',
                hfT: '45',
                hfH: '35'
            },
            el_card_show: false,
            el_card_style: '',
            data_id: '',
            panelName: '',
            panelParamter: {
                // name: '',
                SetTemp: '', //温度设定
                SupplyTemp: '', //送风温度,
                SupplyHumi: '', //送风湿度
                FilterAlarm: '', //滤网报警
                SetWaterValue: '0', //水阀调节
                WaterValueFB: '', //水阀反馈
                FreAirValveAd: '', //新风阀调节
                FreAirValveFb: '', //新风阀反馈
                AutoMode: '', //手动自动
                FaultAlarm: '', //故障报警
                RunningState: '', //运行状态
                RunStopSW: '' //启停
            },
            config: null,
            interval: null,
        }
    },
    components: {
        'process-bar': processBar,
        radio
    },
    methods: {
        LoadConfig() {
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.$ajax.get(this.$URL + '/panel/PanelConfig', {
                params: {
                    id: this.data_id || this.props_id,
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    if (result.data.data) {
                        this.config = JSON.parse(result.data.data);
                        this.panelName = result.data.name;
                        if (result.data.data) {
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
        close() {
            this.el_card_show = false;
            if (this.interval) {
                clearInterval(this.interval);
            }
            setTimeout(() => {
                this.$el.parentNode.removeChild(this.$el);
            }, 2000);
        },
        handleClose() {
            this.isShow = false
        },
     
        changeSwitch() {
            // cmd.write(this, this.config['RunStopSW'], this.panelParamter.RunningState == 0 ? 1 : 0)
            cmd.signalrWrite(this,(this.config&&this.config.RunStopSW)?this.config['RunStopSW']:'',this.panelParamter.RunningState == 0 ? 1 : 0)

        },
        //      设置
        OnClickSetting() {
            this.isShow = !this.isShow
            console.log('111')
        },
        //      手动 自动
        HMChange() {
            this.HM = !this.HM;
            let variable = this.config['AutoMode'];
            cmd.write(this, variable, this.panelParamter.AutoMode == 1 ? 0 : 1);
        },
        onClickSwitchOn() {
            this.newTrend = true
        },
        onClickSwitchOff() {
            this.newTrend = false
        },
        setMode(val) {
            alert(val);
        }
    },
    mounted() {
        this.LoadConfig();
        this.el_card_show = true

        let id = this.data_id || this.props_id

        //id 用于ajax请求数据用
    },
    watch: {}
}
</script>

<style lang="less" scoped>
.box-card {
    width: 428px;
    margin: 0px auto;
    font-size: 12px;
    color: #616265;
    background: #1B1E26;
    border: 0;
    max-height: 640px;
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

.box-card /deep/ .el-card__body {
    text-align: center;
}

@keyframes rotation {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.rotation {
    transform: rotate(360deg);
    animation: rotation 1s linear infinite;
}

.newTrend {
    width: 48%;
    margin: 0px auto;
    font-size: 30px;
    color: #259594;
}

.newTrend .setting {
    width: 40px;
}

.switch {
    width: 133px;
    height: 133px;
}

.box {
    font-size: 16px;
    font-size: 16px;
    margin: 10px 0;
    border: 1px solid #13151B;
    border-radius: 5px;
    background: #1D1E1F;
}

.blowing-in {
    font-size: 12px;
    color: #616265;
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

.strainer-state {
    margin-top: 15px;
}

.strainer-state .states {
    line-height: 38px;
}

.HM-box,
.run-states {
    padding: 10px 0;
}

.HM-img {
    margin-top: 20px;
    cursor: pointer;
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

.status {
    font-size: 12px;
    color: #616265;
    line-height: 38px;
}

.water-value,
.switch-btn {
    margin: 10px 0;
}

.switch-btn .el-button {
    border: 1px solid #313339;
    border-radius: 5px;
}

.on {
    background: #18181a;
}

.switch-btn .off {
    background: #2c2f34;
}

.switch-state,
.aperture {
    padding: 0px 15px;
}

.switch-state {
    color: #025DB1;
}

.aperture {
    color: #259594;
}

.el-progress {
    line-height: 40px;
}

.el-form-item {
    margin-bottom: 5px;
    border-bottom: 1px solid #272B36;
}
</style>
