<template>
<!-- 场内停车记录 -->
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
                <span>开闸方式</span>
                <el-select v-model="openType">
                    <el-option v-for="item in openTypes" :value="item.value" :label="item.label" :key="item.value"></el-option>
                </el-select>
            </div>
            <div class="filter_line">
                <button class="search" @click="search"> 查询</button>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" class="usertable">
            <el-table-column prop="ChannelName" label="进场通道">
            </el-table-column>
            <el-table-column prop="TriggerCarcode" label="车牌号">
            </el-table-column>
            <el-table-column prop="OperatorName" label="操作员">
            </el-table-column>
            <el-table-column prop="OperatorDate" label="开闸时间">
            </el-table-column>
            <el-table-column prop="Reasons" label="备注信息">
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
        // 'gh_table': gh_table,
        'pagination': pagination,
    },
    data() {
        return {
            startDate: new Date(),
            startTime: new Date(2000, 1, 1, 0, 0, 0),
            endDate: new Date(),
            endTime: new Date(2000, 1, 1, 23, 59, 59),
            keyword: '',
            tableData: [],
            total: 0,
            currentPage: 1,
            openType:'',
            openTypes: [{
                    value: 1,
                    label: '紧急开闸'
                },
                {
                    value: 2,
                    label: '紧急关闸'
                },
                {
                    value: 3,
                    label: '遥控开闸'
                },
                {
                    value: 4,
                    label: '遥控关闸'
                },
                {
                    value: 5,
                    label: '车辆识别开闸'
                },
                {
                    value: 6,
                    label: '解除紧急'
                }
            ]

        }
    },
    mounted() {

        this.loadOpenRecords();
    },
    methods: {
        search() {
            this.loadOpenRecords();
        },
        loadOpenRecords() {
            this.$ajax.get(this.$URL + '/park/GetOpenRecord', {
                params: {
                    typeid: this.openType,
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
            this.loadOpenRecords();
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
