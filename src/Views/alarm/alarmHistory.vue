<template>
<!-- 历史报警记录 -->
<div class="ghy-box">
    <div class="h100">
        <div class="filter">
            <div class="filter_line">
                <span>起始时间</span>
                <el-date-picker style="width:150px" format="yyyy-MM-dd" v-model="startDate" type="date" placeholder="选择日期">
                </el-date-picker>
                <span>-</span>
                <el-time-picker v-model="startTime" style="width:150px">
                </el-time-picker>
            </div>
            <div class="filter_line">
                <span>结束时间</span>
                <el-date-picker style="width:150px" v-model="endDate" type="date" placeholder="选择日期">
                </el-date-picker>
                <span>-</span>
                <el-time-picker v-model="endTime" style="width:150px">
                </el-time-picker>
            </div>
            <div class="filter_line">
                <span>报警类型</span>
                <el-select v-model="alarmSource" clearable>
                    <el-option v-for="item in alarmSources" :value="item.value" :label="item.label" :key="item.value"></el-option>
                </el-select>
            </div>
            <div class="filter_line">
                <span>报警级别</span>
                <el-select v-model="alarmLevel" clearable>
                    <el-option v-for="item in alarmLevels" :value="item.value" :label="item.label" :key="item.value"></el-option>
                </el-select>
            </div>
            <div class="filter_line">
                <button class="search" @click="search"> 查询</button>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" class="usertable">
            <el-table-column prop="EventTime" label="报警时间">
            </el-table-column>
            <el-table-column prop="AlarmSource" label="报警类型">
                <template slot-scope="scope">
                    <p>{{ sources[scope.row.AlarmSource-1] }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="AlarmDesc" label="报警描述">
            </el-table-column>
            <el-table-column prop="AlarmLevel" label="报警级别">
                <template slot-scope="scope">
                    <p>{{levels[scope.row.AlarmLevel-1]}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="Operater" label="消警人员">
            </el-table-column>
            <el-table-column prop="OperateDate" label="消警时间">
            </el-table-column>
        </el-table>

        <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>

    </div>
</div>
</template>

<script>
import pagination from '@/components/common/pagination'
export default {
    name: "userManager",
    components: {
        'pagination': pagination,
    },
    data() {
        return {
            startDate: new Date(),
            startTime: new Date(2000, 1, 1, 0, 0, 0),
            endDate: new Date(),
            endTime: new Date(2000, 1, 1, 23, 59, 59),

            tableData: [],
            total: 0,
            currentPage: 1,
            alarmSource: '',
            alarmSources: [{
                    label: '防盗报警',
                    value: 1
                },
                {
                    label: '门禁报警',
                    value: 2
                },
                {
                    label: '视频报警',
                    value: 3
                },
                {
                    label: '火灾报警',
                    value: 4
                },
                {
                    label: '求助报警',
                    value: 5
                },
                {
                    label: '设备报警',
                    value: 6
                },
                {
                    label: '故障报警',
                    value: 7
                },
                {
                    label: '普通报警',
                    value: 8
                },
            ],
            sources:['防盗报警','门禁报警','视频报警','火灾报警','求助报警','设备报警','故障报警','普通报警'],
            alarmLevel: '',
            alarmLevels: [{
                    label: '普通',
                    value: 1
                },
                {
                    label: '重要',
                    value: 2
                },
                {
                    label: '紧急',
                    value: 3
                },
            ],
            levels:['普通','重要','紧急']

        }
    },
    mounted() {
        this.loadRecords();
    },
    methods: {
        search() {
            this.loadRecords();
        },
        loadRecords() {
            this.$ajax.get(this.$URL + '/alarm/AllHistoryAlarm', {
                params: {
                    alarmSource: this.alarmSource,
                    level: this.alarmLevel,
                    page: this.currentPage,
                    size: 10,
                    bt: this.startDate.format("yyyy-MM-dd") + " " + this.startTime.format("hh:mm:ss"),
                    et: this.endDate.format("yyyy-MM-dd") + " " + this.endTime.format("hh:mm:ss"),
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.tableData = result.data.data;
                    this.total = result.data.count;
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val
            this.loadRecords();
        },

    }
}
</script>

<style lang="less" scoped>
.header {
    border-bottom: 1px solid rgba(33, 61, 112, 1);
}

.h100 {
    height: 100%;
    position: relative;
    padding: 10px;
}

.ghy-box .filter {
    border: 0 !important;
}

table {
    height: 100% !important;
}

.dialog-line {
    height: 37px;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;

}

.dialog-line span {
    color: white;
    margin-right: 10px;
}

.dialog-line div span {
    color: white;
    margin-right: 10px;
}

.list-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;

    button.export {
        /*position: absolute;*/
        /*bottom: -69px;*/
        /*right: 0;*/
        background-color: #1f4083;
        border-radius: 5px;
        color: white;
        outline: none;
        border: none;
        cursor: pointer;
        margin-left: 0.25rem;
        height: 0.4rem;
        width: 1rem;
    }
}

.list-pagination {
    padding-top: 20px;
    text-align: center;

}

.dialog-box {
    display: flex;
    flex-wrap: wrap;
    max-height: 500px;
    overflow-y: scroll;
}

.active {
    color: green;
}

.inactive {
    color: red;
}
</style>
