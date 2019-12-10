<template>
<!-- 历史报警记录 -->
<div class="ghy-box">
    <div class="h100">
        <div class="filter">
            <div class="filter_line">
                <span>起始时间</span>
                <el-date-picker v-model="dateSearch" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
                <!-- <el-date-picker style="width:150px" format="yyyy-MM-dd" v-model="startDate" type="date" placeholder="选择日期">
                </el-date-picker>
                <span>-</span>
                <el-time-picker v-model="startTime" style="width:150px">
                </el-time-picker> -->
            </div>
            <!-- <div class="filter_line">
                <span>结束时间</span>
                <el-date-picker style="width:150px" v-model="endDate" type="date" placeholder="选择日期">
                </el-date-picker>
                <span>-</span>
                <el-time-picker v-model="endTime" style="width:150px">
                </el-time-picker>
            </div> -->
            <div class="filter_line">
                <span>用户选择</span>
                <el-select v-model="username" clearable>
                    <el-option v-for="item in usernames" :value="item.UserName" :label="item.UserName" :key="item.UserIdent"></el-option>
                </el-select>
            </div>
            <!-- <div class="filter_line">
                <span>报警级别</span>
                <el-select v-model="alarmLevel" clearable>
                    <el-option v-for="item in alarmLevels" :value="item.value" :label="item.label" :key="item.value"></el-option>
                </el-select>
            </div> -->
            <div class="filter_line">
                <button class="search" @click="loadLogs"> 查询</button>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" class="usertable">
            <el-table-column prop="OpraterDate" label="访问时间">
            </el-table-column>
            <el-table-column prop="UserName" label="访问用户">
                <!-- <template slot-scope="scope">
                    <p>{{ sources[scope.row.AlarmSource-1] }}</p>
                </template> -->
            </el-table-column>
            <el-table-column prop="IP" label="IP来源">
            </el-table-column>
            <el-table-column prop="Resource" label="请求资源(路劲)">
            </el-table-column>
            <el-table-column prop="Browser" label="用户代理">
            </el-table-column>
            <el-table-column prop="Description" label="描述">
            </el-table-column>
        </el-table>

        <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>

    </div>
</div>
</template>

<script>
import pagination from '@/components/common/pagination'
export default {
    name: "runlog",
    components: {
        'pagination': pagination,
    },
    data() {
        return {
            // startDate: new Date(),
            // startTime: new Date(2000, 1, 1, 0, 0, 0),
            // endDate: new Date(),
            // endTime: new Date(2000, 1, 1, 23, 59, 59),
            dateSearch: [new Date(), new Date()],
            tableData: [],
            total: 0,
            currentPage: 1,
            username: '',
            usernames: []

        }
    },
    mounted() {
        this.loadLogs();
        this.loadUsers();
    },
    methods: {
        loadLogs() {
            this.$ajax.get(this.$URL + '/log/GetLogList', {
                params: {
                    page: this.currentPage,
                    size: 10,
                    bt: this.dateSearch[0].format("yyyy-MM-dd") + " 00:00:00" ,
                    et: this.dateSearch[1].format("yyyy-MM-dd") + " 23:59:59",
                    username: this.username
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
        loadUsers() {
            this.$ajax.get(this.$URL + '/account/GetUsers').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.usernames=result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val
            this.loadLogs();
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
