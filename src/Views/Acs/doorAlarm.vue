<template>
<!-- 门禁紧急事件 -->
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
            <!-- <div class="filter_line">
                <span>门区</span>
                <el-select v-model="area" clearable>
                    <el-option v-for="item in areas" :value="item.Area_id" :label="item.Area_name" :key="item.Area_id"></el-option>
                </el-select>
            </div> -->
            <!-- <div class="filter_line">
                <el-input v-model="keyword" placeholder="支持 姓名车牌 查询"></el-input>
            </div> -->
            <div class="filter_line">
                <button class="search" @click="search"> 查询</button>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" class="usertable">
            <el-table-column prop="TypeName" label="事件类型">
            </el-table-column>
            <el-table-column prop="Door_name" label="房门">
            </el-table-column>
            <el-table-column prop="doorstatus" label="门状态">
            </el-table-column>
            <el-table-column prop="event_date" label="产生时间">
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
            keyword: '',
            tableData: [],
            total: 0,
            currentPage: 1,
            area: '',
            areas: [{
                    value: 0,
                    label: '进'
                },
                {
                    value: 1,
                    label: '出'
                },
            ]

        }
    },
    mounted() {
         this.loadRecords();
        // this.loadDoorAreas();
    },
    methods: {
        search() {
            this.loadRecords();
        },
        loadRecords() {
            this.$ajax.get(this.$URL + '/acs/GetDoorErrors', {
                params: {
                    // keyword: this.keyword,
                    // inorout: this.inorout,
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
        loadDoorAreas() {
            this.$ajax.get(this.$URL + '/acs/GetAreaInfo').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.areas = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        }

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
