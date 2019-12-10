<template>
<div class="box">
    <div id="calendar" style="height:100%"></div>
    <el-dialog class="form" title="计划配置" @close="close" :visible.sync="schedulerVisibale" :modal-append-to-body="true" width="500px" center>
        <!-- 系统分类 -->
        <el-form label-width="100px" label-position="right" ref="form1" :rules="rule" :model="ruleForm">
            <!-- 名称描述 -->
            <el-form-item label="开始时间">
                <el-input v-model="ruleForm.StartTime"></el-input>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-input v-model="ruleForm.EndTime"></el-input>
            </el-form-item>
            <el-form-item label="任务类型">
                <el-select v-model="ruleForm.Type" style="width:100%">
                    <el-option label="广播任务" value="1"></el-option>
                    <el-option label="场景任务" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="广播任务" prop="ITC_Task_ID" v-if="ruleForm.Type==1">
                <el-select v-model="ruleForm.ITC_Task_ID" style="width:100%" @change="typeChange">
                    <el-option v-for="(item,i) in itcs" :key="i" :label="item.Name" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始场景" prop="StartSceneID" v-if="ruleForm.Type==2">
                <el-select v-model="ruleForm.StartSceneID" style="width:100%">
                    <el-option v-for="(item,i) in scenes" :key="i" :label="item.Name" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结束场景" prop="EndSceneID" v-if="ruleForm.Type==2">
                <el-select v-model="ruleForm.EndSceneID" style="width:100%">
                    <el-option v-for="(item,i) in scenes" :key="i" :label="item.Name" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="标题" prop="Title">
                <el-input v-model="ruleForm.Title"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary"  @click.prevent="postSave" >确 定</el-button>
          <!-- <el-button type="danger"   @click="cancle">删 除</el-button> -->
        </span>
    </el-dialog>
    <!-- <el-dialog class="form" title="会议预约" :visible.sync="dayVisibale" :modal-append-to-body="true" width="800px" center>
        <div id="calendar1" style="height:600px"></div>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="postSave" >确 定</el-button>
        </span>
    </el-dialog> -->
</div>
</template>

<script>
import 'fullcalendar/dist/fullcalendar.css'
import moment from 'moment'
import 'fullcalendar';
import 'fullcalendar/dist/locale/zh-cn'
export default {
    name: "loopTask",

    data() {
        return {
            schedulerVisibale: false,
            meetings: [],
            resources: [],
            ruleForm: {
                StartTime: '',
                EndTime: '',
                StartSceneID: '',
                EndSceneID: '',
                ITC_Task_ID: '',
                Title: '',
                Type: "1",
                ID: 0,
            },
            rule: {
                Title: [{
                    required: true,
                    message: '标题不能为空',
                    trigger: 'blur'
                }, ],
                StartSceneID: [{
                    required: true,
                    message: '开始场景不能为空',
                    trigger: 'blur'
                }, ],
                // EndSceneID: [{
                //     required: true,
                //     message: '请输入会议内容',
                //     trigger: 'blur'
                // }, ],
                ITC_Task_ID: [{
                    required: true,
                    message: '广播任务不能为空',
                    trigger: 'blur'
                }, ],
            },
            // dayVisibale: false,
            devices: [],
            persons: [],
            types: [],
            event: null,
            ispost: true,
            edit: false,
            scenes: [],
            itcs: []
        }
    },
    mounted() {
        let _this = this;
        this.$nextTick(() => {
            _this.init();

        });
        this.loadScenes();
        this.loadITCTasks();
    },
    methods: {
        init() {
            let _this = this;
            $('#calendar').fullCalendar({
                height: 'parent',
                defaultView: 'agendaWeek',
                header: false,
                slotLabelFormat: [
                    //'MMMM YYYY', // top level of text
                    'HH' + ':00' // lower level of text
                ],
                columnHeaderFormat: "ddd",
                // slotDuration: '24:00:00',
                allDaySlot: false,
                selectable: true,
                selectHelper: true,
                editable: true,
                droppable: true,
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                displayEventEnd: true,
                eventLimit: true,
                events: [],
                timezone: 'local',
                scrollTime: '00:00:00',
                // minTime:'00:00:00',
                eventClick: function (event, jsEvent, view) {
                   _this.editEvent(event);
                },
                eventResize: function (event, delta, revertFunc) {
                   _this.editEvent(event);

                },
                eventDrop: function (event, delta, revertFunc) {
                  _this.editEvent(event);
                },
                select: function (startDate, endDate) {
                    _this.ruleForm.StartTime = startDate.format("YYYY-MM-DD HH:mm:ss");
                    _this.ruleForm.EndTime = endDate.format("YYYY-MM-DD HH:mm:ss");
                    _this.schedulerVisibale = true;
                },
            });
            this.loadPlan();
        },
        editEvent(event) {
            let _this=this;
            _this.schedulerVisibale = true;
            _this.ruleForm.ID = event.ID;
            _this.ruleForm.StartSceneID = event.StartSceneID;
            _this.ruleForm.EndSceneID = event.EndSceneID;
            _this.ruleForm.ITC_Task_ID = event.ITC_Task_ID;
            _this.ruleForm.Title = event.title;
            _this.ruleForm.Type = event.Type;
            _this.ruleForm.StartTime = event.start.format("YYYY-MM-DD HH:mm:ss");
            _this.ruleForm.EndTime = event.end.format("YYYY-MM-DD HH:mm:ss");
        },
        loadScenes() {
            this.$ajax.get(this.$SHEDULEURL + '/scene/GetAllScene').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.scenes = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadITCTasks() {
            this.$ajax.get(this.$SHEDULEURL + '/itctask/GetAllITCTask').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.itcs = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        initDay() {
            let _this = this;
            $('#calendar1').fullCalendar({
                height: 'parent',
                defaultView: 'agendaWeek',
                schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
                header: {
                    left: 'promptResource today prev,next',
                    center: 'title',
                    right: ''
                },
                allDaySlot: false,
                editable: true,
                droppable: true,
                selectable: true,
                selectHelper: true,
                eventLimit: true,

                select: function (startDate, endDate) {
                    _this.ruleForm.ME_Stime = startDate.format("YYYY-MM-DD HH:mm:ss");
                    _this.ruleForm.ME_Ftime = endDate.format("YYYY-MM-DD HH:mm:ss");
                    _this.schedulerVisibale = true;
                },
                eventResize: function (event, delta, revertFunc) {
                    if (event.end.unix() < new Date().getTime()) {
                        revertFunc();
                        return;
                    }
                    _this.edit = true;
                    _this.event = event;
                    _this.schedulerVisibale = true;
                    _this.ruleForm.ME_Stime = event.start.format("YYYY-MM-DD HH:mm:ss");
                    _this.ruleForm.ME_Ftime = event.end.format("YYYY-MM-DD HH:mm:ss");
                },
                eventDrop: function (event, delta, revertFunc) {
                    if (event.end.unix() < new Date().getTime()) {
                        revertFunc();
                        return;
                    }
                    _this.edit = true;
                    _this.event = event;
                    _this.schedulerVisibale = true;
                    _this.ruleForm.ME_Stime = event.start.format("YYYY-MM-DD HH:mm:ss");
                    _this.ruleForm.ME_Ftime = event.end.format("YYYY-MM-DD HH:mm:ss");
                },
                eventClick: function (calEvent, jsEvent, view) {
                    _this.schedulerVisibale = true;
                    _this.ruleForm = calEvent.meeting;
                    if (calEvent.end.unix() < new Date().getTime()) {
                        this.ispost = false;
                    } else {
                        _this.edit = true;
                    }
                    // _this.schedulerVisibale = true;
                    // _this.ruleForm = calEvent.meeting;

                }

            })
        },

        loadDayMeetingByTime() {
            let calendar = $('#calendar1').fullCalendar('getCalendar');
            let view = calendar.view;
            let start = view.start.format('YYYY-MM-DD HH:mm:ss');
            let end = view.end.format('YYYY-MM-DD HH:mm:ss');
            this.loadDayMeeting(start, end);
        },
        TimeToCurrent(time, weekday) {
            if (weekday === 0) {
                weekday = 7;
            }
            let datetime = new Date();
            let day = datetime.getDay();
            datetime.setDate(datetime.getDate() + (weekday - day));
            return datetime.getFullYear() + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate() + " " + time.split('T')[1]
        },
        loadPlan(start, end) {
            let _this = this;
            this.$ajax.get(this.$SHEDULEURL + '/plan/GetAllPlans').then((result) => {
                if (result.status === 200 && result.data.success) {
                    _this.$nextTick(() => {
                        $('#calendar').fullCalendar("removeEvents");
                        result.data.data.forEach((v, i) => {
                            let s = _this.TimeToCurrent(v.StartTime, v.WeekDay);
                            let e = _this.TimeToCurrent(v.EndTime, v.WeekDay)
                            $('#calendar').fullCalendar("renderEvent", {
                                ID: v.ID,
                                StartSceneID: v.StartSceneID,
                                EndSceneID: v.EndSceneID,
                                title: v.Title,
                                start: s,
                                end: e,
                                ITC_Task_ID: v.ITC_Task_ID,
                                Type: v.Type.toString()
                            }, true);
                        });
                    });
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        saveConfig() {
            let _this = this;
        
        },
        postSave() {
            let _this = this;
            _this.$ajax.post(_this.$SHEDULEURL + '/plan/SavePlanConfig', _this.$QS.stringify(_this.ruleForm)).then((result) => {
                if (result.status === 200) {
                    if (result.data.success) {
                        this.$message({
                            type: 'success',
                            message: result.data.mes,
                        });
                        this.loadPlan();
                    } else {
                        _this.$message.error(result.data.mes);
                    }
                    _this.schedulerVisibale = false;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        typeChange(val) {
            if (val == 1) {
                this.ruleForm.StartSceneID = "";
                this.ruleForm.EndSceneID = "";
            } else if (val == 2) {
                this.ruleForm.ITC_Task_ID = "";
            }
        },
        close() {
            this.ispost = true;
            this.edit = false;
        },
        cancle() {
            this.$ajax.get(this.$URL + '/meeting/CancleSign', {
                params: {
                    ME_Id: this.ruleForm.ME_Id
                }
            }).then((result) => {
                if (result.status === 200) {

                    if (result.data.success) {
                        this.schedulerVisibale = false;
                        this.$message({
                            type: 'success',
                            message: result.data.msg
                        });
                        this.loadDayMeetingByTime();
                    } else {
                        this.$message.error(result.data.msg);
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }
}
</script>

<style lang="less" scoped>
.box {
    font-size: 12px;
    height: 100%;
    overflow-x: hidden;
    padding: 10px;
}

.search {
    height: 60px;
    display: flex;
    align-items: center;
}
</style>
