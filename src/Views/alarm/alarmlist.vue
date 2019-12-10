<template>
<div class="list">
    <div class="listbody">
        <ul>
            <li v-for="(item,i) in alarmData" @click="showLink(item)" :key="i">
                <div>
                    <i v-if="item.AlarmLevel>=1&&item.AlarmLevel<=3" style="color:#2957AE" class="el-icon-error"></i>
                    <i v-if="item.AlarmLevel>=4&&item.AlarmLevel<=6" style="color:#F39C12" class="el-icon-error"></i>
                    <i v-if="item.AlarmLevel>=7" style="color:#e60012" class="el-icon-error"></i>
                </div>
                <div>
                    <span>{{item.AlarmVariable}}</span><br>
                    <span>{{item.AlarmDesc}}</span><br>
                    <span>{{item.DateStamp.split('.')[0]}}</span><br>
                </div>
            </li>
        </ul>
    </div>
    <div class="listbottom">
        <div @click="showAll" class="center">
            <div>
                <div><i class="fa fa-list-ul"></i></div>
            </div>
            <span>查看所有</span>
        </div>
        <div class="center">
            <div>
                <div><i class="fa fa-bell-slash"></i></div>
            </div>
            <span>消音</span>
        </div>
        <div @click="removeAll" class="center">
            <div>
                <div><i class="fa fa-hand-pointer-o"></i></div>
            </div>
            <span>一键处理</span>
        </div>
        <!-- <div class="center" @click="showAlarmList"> -->
        <div class="center">
            <div>
                <div>
                    <!-- <i class="fa fa-gears"></i> -->
                    <el-switch v-model="openAlarm" active-color="#13ce66" inactive-color="#ff4949" @change="openAlarmChange">
                    </el-switch>
                </div>
            </div>
            <!-- <span>关闭</span> -->
        </div>
    </div>
</div>
</template>

<script>
import {
    mapState
} from 'vuex'
export default {
    name: 'alarmlist',
    computed: {
        alarmData() {
            if (this.$store.state.alarm.alarmRData.length > 0) {
                this.$store.commit('change_linkvideo1', "");
                this.$store.commit('change_linkvideo2', "")
                this.$store.commit('change_linksrc', "")
                this.$store.commit('change_linkvideo1', this.$store.state.alarm.alarmRData[0].AlarmVideo);
                this.$store.commit('change_linkvideo2', this.$store.state.alarm.alarmRData[0].AlarmVideo2)
                this.$store.commit('change_linksrc', this.$store.state.alarm.alarmRData[0].AlarmForm);
            }
            return this.$store.state.alarm.alarmHData;
        },

        ...mapState({

            connection: state => state.signalr.connection,
            hubproxy: state => state.signalr.hubproxy,
            openAlarm:state=>state.app.openAlarm,
        }),
    },
    methods: {
        removeAll() {
            if (this.connection) {
                this.connection.invoke('ProcessAlarmAll', sessionStorage.username).then((result) => {
                    this.connection.invoke("SendHisAlarm");
                    this.$store.commit('change_alarmlink', false);
                });
            }
        },
        showAll() {
            this.$router.push({
                name: 'alarmStatistics'
            });
        },
        showLink(item) {
            console.log(item);
            this.$store.commit('change_alarmlink', true);
            this.$store.commit('change_linkinfo', item);
        },
        showAlarmList() {
            this.$store.commit(
                "change_alarmlist",
                !this.$store.state.alarm.showAlarmList
            );
        },
        openAlarmChange(val)
        {
            this.$store.commit('change_openAlarm',val);
        }
    }
}
</script>

<style lang="less" scoped>
div {
    box-sizing: border-box;
}

.list {
    background: #0A1631;
    z-index: 6002;
    width: 13%;
    height: calc(100% - 65px);
    box-sizing: border-box;
    position: absolute;
    top: 65px;
    right: 0px;
    font-size: 12px;
    overflow: hidden;

    ul {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            border-bottom: 1px solid #122D62;
            overflow: hidden;
            cursor: pointer;

            &:hover {
                // background: red;
            }

            div {
                display: table-cell;
                vertical-align: middle;

                i {
                    font-size: 24px;
                }
            }

            div:nth-of-type(1) {
                padding: 0 10px;
            }
        }
    }

    .listbody {
        max-height: calc(100% - 34px);
        min-height: calc(100% - 34px);
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .listbottom {
        height: 34px;
        font-size: 0;
        display: flex;

        div {
            font-size: 12px;
            -webkit-text-size-adjust: none;
        }

        >div {
            width: calc(25% - 1px);
            background: #202A41;
            margin-right: 1px;
            overflow: hidden;
            cursor: pointer;
            height: 100%;
        }

    }

}
</style>
