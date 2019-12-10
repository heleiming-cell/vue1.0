<template>
<el-row class="view">
    <el-row style="height:37px;">
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="alarmtitle">
                <div><span style="color:#0D92D7">报警联动</span>
                </div>
                <div @click="close"> <i class="el-icon-circle-close-outline"></i></div>
            </div>
        </el-col>
    </el-row>
    <el-row style="height:calc((100% - 37px) * 0.7);padding:35px 0 33px 0;" :gutter="62">
        <el-col :xs="24" :sm="24" :md="18" :lg="18" class="h100">
            <div class="diagram h100">
                <iframe style="height:100%;" width="100%" frameborder="0" :src="linksrc"></iframe>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" class="h100">
            <div class="camlist h100">
                <div class="cam">
                    <video class="h5video" id="linkv1" autoplay>
                    </video>
                </div>
                <div class="cam">
                    <video class="h5video" id="linkv2" autoplay>
                    </video>
                </div>
            </div>
        </el-col>
    </el-row>
    <el-row style="height:calc((100% - 37px) * 0.3)" class="bottom">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" class="h100">
            <table>
                <thead>
                    <tr>
                        <td><span>报警详情</span></td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>报警设备:{{AlarmVariable}}</td>
                        <td>
                        <td>报警时间:{{DateStamp}}</td>
                    </tr>
                    <tr>
                        <td>报警级别:{{AlarmLevel}}</td>
                        <td>
                        <td>报警描述:{{AlarmDesc}}</td>
                    </tr>
                </tbody>
            </table>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <div class="errorHandle">
                <span>报警原因:</span>
                <el-input type="textarea" v-model="explain" class="errorText"></el-input>
                <div class="btn">
                    <el-button type="primary" @click="handleAlarm">报警处理</el-button>
                </div>
            </div>
        </el-col>
    </el-row>
</el-row>
</template>

<script>
import '@/lib/h5splayer'
import {
    H5siOS,
    H5sPlayerCreate
} from '@/lib/h5splayerhelper'

export default {
    name: 'alarmLink',
    data() {
        return {
            linksrc: '',
            linkvideo1: '',
            linkvideo2: '',
            v1: null,
            v2: null,
            AlarmVariable: '',
            DateStamp: '',
            AlarmLevel: '',
            AlarmDesc: '',
            explain: ''
        }
    },

    computed: {
        linkinfo() {
            return this.$store.state.alarm.linkinfo;
        },
        connection() {
            return this.$store.state.signalr.connection;
        },
        hubproxy() {
            return this.$store.state.signalr.hubproxy
        }
    },
    watch: {
        linkinfo: {
            handler(v1, v2) {
                if (v1) {
                    if (v1.AlarmForm) {
                        this.linksrc = location.protocol + "//" + location.hostname + ":9008/home/runview?diagramid=" + v1.AlarmForm;
                    }
                    if (v1.AlarmVideo) {
                        let server = v1.AlarmVideo.split('|');
                        let conf = {
                            videoid: 'linkv1',
                            protocol: window.location.protocol, //http: or https:
                            host: server[1] + ":" + server[2], // "171.221.238.16:8075", //localhost:8080
                            rootpath: '/', // '/'
                            token: server[4],
                            hlsver: 'v1', //v1 is for ts, v2 is for fmp4
                            session: server[3] //session got from login
                        };
                        this.v1 = H5sPlayerCreate(conf).connect();
                    }
                    if (v1.AlarmVideo2) {
                        let server = v1.AlarmVideo2.split('|');
                        let conf = {
                            videoid: 'linkv2',
                            protocol: window.location.protocol, //http: or https:
                            host: server[1] + ":" + server[2], // "171.221.238.16:8075", //localhost:8080
                            rootpath: '/', // '/'
                            token: server[4],
                            hlsver: 'v1', //v1 is for ts, v2 is for fmp4
                            session: server[3] //session got from login
                        };
                        this.v2 = H5sPlayerCreate(conf).connect();
                    }
                    this.AlarmVariable = v1.AlarmVariable;
                    this.DateStamp = v1.DateStamp.split('.')[0];
                    this.AlarmLevel = v1.AlarmLevel;
                    this.AlarmDesc = v1.AlarmDesc;
                }
            },
            deep: true
        }

    },
    methods: {
        close() {
            if (this.v1) {
                this.v1.disconnect();
                this.v1 = null;
            }
            if (this.v2) {
                this.v2.disconnect();
                this.v2 = null;
            }
            this.$store.commit('change_alarmlink', !this.$store.state.alarm.showAlarmLink)
        },
        handleAlarm() {
            let _this = this;
            if (this.connection) {
                //注意参数类型，否则后端hub接受不到  尤其是int  string 
                _this.connection.invoke('ProcessAlarm', _this.linkinfo.AlarmSource,
                    _this.linkinfo.AlarmLevel, _this.linkinfo.AlarmGuid,
                    _this.linkinfo.TimeTicks, sessionStorage.username, _this.explain).then(result=>{
                        if(result)
                        {
                            this.close();
                            _this.connection.invoke("SendHisAlarm");
                        }
                    });
            }

        }
    },
}
</script>

<style lang="less" scoped>
.view {
    background: #0a1631;
    z-index: 6002;
    width: 87%;
    height: calc(100% - 65px);
    box-sizing: border-box;
    position: absolute;
    top: 65px;
    left: 0px;
    font-size: 12px;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 0 91px 21px 84px;

    .alarmtitle {
        border-bottom: 1px solid #122653;
        line-height: 36px;
        overflow: hidden;

        div:nth-of-type(1) {
            float: left;
            margin-left: 44px;
        }

        div:nth-of-type(2) {
            float: right;
            margin-right: 51px;

            i {
                cursor: pointer;
                font-size: 24px;
            }
        }
    }

    .diagram {
        border: 1px solid #182a51;
        width: 100%;
        margin-right: 30px;
    }

    .camlist {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .cam:nth-of-type(1) {
            margin-bottom: 10px;
        }

        .cam {
            border: 1px solid #182a51;
            height: 50%;
            display: flex;
        }
    }

    .bottom {
        background: #182a51;
        overflow-y: scroll;

        table {
            height: 90%;
            width: 100%;
            font-size: 16px;
            padding: 15px 15px 15px 87px;

            span {
                height: 64px;
            }
        }

        .errorHandle {

            padding: 15px;

            .errorText /deep/ textarea {
                background: #121F3C;
                height: 84px;
            }

            .btn {
                margin-top: 23px;
                text-align: center;
            }

            span {
                font-size: 16px;
                line-height: 64px;
            }
        }

    }

    video {
        height: 100%;
        width: 100%;
    }

    .h5video {
        object-fit: fill;
    }

}
</style>
