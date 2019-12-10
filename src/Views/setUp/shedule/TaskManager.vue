<template>
<el-row class="box">
    <el-row style="height:30%">
        <el-col :xs="24" :sm="8" class="h100 scheduler">
            <div>
                <i class="iconfont icon-cpu" v-show="scheduler.status" style="font-size:48px;color:green;"></i>
                <i class="iconfont icon-cpu" v-show="!scheduler.status" style="font-size:48px;color:red;"></i>
            </div>
            <div style="margin-top:20px;">
                <el-button @click="Run('pause')" type="primary">
                    PauseAll
                </el-button>
                <el-button @click="Run('resume')" type="primary">
                    ResumeAll
                </el-button>
                <el-button @click="Run('start')" type="primary">
                    start
                </el-button>
                <el-button @click="Run('shotdown')" type="primary">
                    shutdown
                </el-button>
            </div>
        </el-col>
        <el-col :xs="24" :sm="8" class="h100 center">

        </el-col>
        <el-col :xs="24" :sm="8" class="h100 center">

        </el-col>
    </el-row>
    <el-col :xs="24" :sm="24" style="border-right: 1px solid #122d62;padding:10px;height:70%">
        <div class="btn">
            <el-button type="primary" @click="addJob">添加</el-button>
            <el-button type="danger" @click="delJobs">删除</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" class="usertable" @select-all="selctTable" @select="selctTable">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="JOB_NAME" label="任务编号">
            </el-table-column>
            <el-table-column prop="Job_Trigger" label="触发器">
            </el-table-column>
            <el-table-column prop="Job_Status" label="状态">
            </el-table-column>
            <el-table-column prop="Cron" label="CRON">
            </el-table-column>
            <el-table-column prop="DESCRIPTION" label="描述">
            </el-table-column>
            <el-table-column prop="StartTime" label="开始执行时间">
            </el-table-column>
            <el-table-column prop="PreTime" label="上次执行时间">
            </el-table-column>
            <el-table-column prop="NextTime" label="下次执行时间">
            </el-table-column>
            <el-table-column prop="RunCount" label="次数">
            </el-table-column>
            <el-table-column prop="Job_Status">
                <template slot-scope="scope">
                    <span v-if="scope.row.Job_Status==2" style="color:green">执行完毕</span>
                    <span v-if="scope.row.Job_Status==-1" style="color:green"></span>
                    <span v-if="scope.row.Job_Status==0" style="color:red">停止</span>
                    <span v-if="scope.row.Job_Status==1" style="color:green">运行中</span>
                    <span v-if="scope.row.Job_Status==3" style="color:red">删除</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="350px">
                <template slot-scope="scope">
                    <el-button size="mini" @click="editjob(scope.row)" type="primary">编辑</el-button>
                    <el-button size="mini" @click="runjob('run', scope.row)" type="primary">执行</el-button>
                    <el-button size="mini" @click="runjob('pause', scope.row)" type="primary">暂停</el-button>
                    <el-button size="mini" @click="runjob('resume', scope.row)" type="primary">恢复</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination :page-size="size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
        </el-pagination>
    </el-col>
    <el-dialog title="任务设置" :visible.sync="jobPanelDialog" :modal-append-to-body="false" width="400px">
        <el-form label-width="100px" label-position="right">
            <el-form-item label="任务KEY">
                <el-input v-model="job.JOB_NAME" :readonly="eidt"></el-input>
            </el-form-item>
            <el-form-item label="群组">
                <el-input v-model="job.JOB_GROUP" :readonly="eidt"></el-input>
            </el-form-item>
            <el-form-item label="Cron">
                <el-input v-model="job.Cron"></el-input>
            </el-form-item>
            <el-form-item label="触发器KEY">
                <el-input v-model="job.Job_Trigger" :readonly="eidt"></el-input>
            </el-form-item>
            <el-form-item label="任务CLASS">
                <el-input v-model="job.Job_Class" :readonly="eidt"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="job.DESCRIPTION" :readonly="eidt"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="saveJob">确 定</el-button>
        </span>
    </el-dialog>
</el-row>
</template>

<script>
import {
    Tree
} from '@/lib/Common'
import Variable from '@/components/Dialog/Variable/src'
import {
    TaskJob
} from '@/lib/configParmas'
export default {
    name: "taskmanager",
    data() {
        return {
            jobPanelDialog: false,
            job: new TaskJob(),
            tableData: [],
            total: 0,
            size: 10,
            currentPage: 1,
            scheduler: {
                status: false
            },
            jobs: [],
            eidt: false,
        }
    },
    mounted() {
        this.loadScheduler();
        this.getJobs();
    },
    methods: {
        getJobs() {
            this.$ajax.get(this.$SHEDULEURL + '/scheduler/GetJobs', {
                params: {
                    size: this.size,
                    page: this.currentPage
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.tableData = result.data.data;
                    this.total = result.data.count
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadScheduler() {
            this.$ajax.get(this.$SHEDULEURL + '/scheduler/GetSchedulerStatus').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.scheduler.status = result.data.data.status;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        Run(cmd) {
            if (cmd === "start" && this.scheduler.status) {
                this.$message.error("调度器已经启动！");
                return;
            } else if (cmd === "shotdown" && !this.scheduler.status) {
                this.$message.error("调度器已经停止！");
                return;
            } else if ((cmd === "pause" || cmd === "pause") && !this.scheduler.status) {
                this.$message.error("请先启动调度器！");
                return;
            }
            this.$ajax.get(this.$SHEDULEURL + '/scheduler/CmdScheduler', {
                params: {
                    cmd: cmd
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: result.data.mes
                    });
                } else {
                    this.$message.error(result.data.mes);
                }
                this.loadScheduler();
            }).catch((err) => {
                console.log(err);
            });
        },
        runjob(cmd, row) {
            //0 停止 -1 未添加到调度器，1运行 0 停止 3 删除
            if (cmd === "run" && (row.Job_Status == "WAITING" || row.Job_Status == "ACQUIRED" || row.Job_Status == "PAUSED")) {
                this.$message.error("不能重复执行,该任务已添加到调度器");
                return;
            } else if (cmd === "pause" && row.Job_Status != "ACQUIRED") {
                this.$message.error("只有运行中的任务才能停止");
                return;
            } else if (cmd === "resume" && row.Job_Status != "PAUSED") {
                this.$message.error("只有暂停的任务才能恢复运行");
                return;
            }
            this.$ajax.get(this.$SHEDULEURL + '/scheduler/CmdJob', {
                params: {
                    cmd: cmd,
                    key: row.JOB_NAME
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: result.data.mes
                    });
                } else {
                    this.$message.error(result.data.mes);
                }
                this.getJobs();
            }).catch((err) => {
                console.log(err);
            });
        },
        handleCurrentChange(page) {
            this.currentPage = page;
        },
        selctTable(selection) {
            let _this = this;
            if (selection.length === 0) {
                this.jobs = [];
            } else if (selection.length > 0) {
                this.jobs = [];
                selection.forEach((v, k) => {
                    _this.jobs.push(v.JOB_NAME + ':' + v.JOB_GROUP);
                });
            }
        },
        addJob() {
            this.jobPanelDialog = true;
            this.eidt = false;
        },
        editjob(row) {
            this.eidt = true;
            this.jobPanelDialog = true;
            Object.assign(this.job, row);

        },
        delJobs() {
            if (this.jobs.length === 0) {
                this.$message.error("请选择要删除的任务");
                return;
            }
            this.$confirm('此操作将永久删除改Job, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.post(this.$SHEDULEURL + '/scheduler/DelJobs', this.jobs).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            type: 'success',
                            message: result.data.mes
                        });
                        this.getJobs();

                    } else
                        this.$message.error(result.data.mes);
                }).catch((err) => {
                    console.log(err);
                });
            });

        },
        saveJob() {
            var url = "/scheduler/addJob";
            if (this.eidt) {
                url = "/scheduler/EditJob";
            }
            this.$ajax.post(this.$SHEDULEURL + url, this.job).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: result.data.mes
                    });
                    this.getJobs();
                    this.jobPanelDialog = false;
                } else
                    this.$message.error(result.data.mes);
            }).catch((err) => {
                console.log(err);
            });
        }

    }
}
</script>

<style lang="less" scoped>
// .box {
//     height: calc(100% - 0px);
// }
.menuheader {
    line-height: 36px;
    vertical-align: middle;
    padding: 0 10px;
    overflow: hidden;
    background: #010308;

    i {
        cursor: pointer;
    }
}

.paneltree {
    height: calc(100% - 37px);
    overflow-y: auto;
}

.btn {
    display: flex;
    flex-direction: row-reverse
}

.box {
    height: 100%;

    & /deep/ .el-icon-close {
        display: none;
    }
}

.scheduler {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center
}

.circle {
    height: 200px;
    width: 200px;
    // border: 10px solid red;
    border-radius: 200px;
    position: relative;
}
</style>
