<template>
<div class="ghy-box">
    <!-- <div class="header">
        <span style="color: #325fb8"><i class="iconfont icon-shouye"></i>能源管理></span><span style="color:#08abff;">抄表记录</span></span>
    </div> -->
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
                <el-input placeholder="支持  设备 查询" v-model="keyword"></el-input>
            </div>
            <div class="filter_line">
                <button class="search" @click="search"> 查询</button>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" class="usertable">
            <el-table-column prop="Name" label="设备名称">
            </el-table-column>
            <el-table-column label="设备类型">
                <template slot-scope="scope">
                    <span>{{devicetype[scope.row.devicetype-1]}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="AName" label="所属区域">
            </el-table-column>
            <el-table-column prop="DName" label="所属部门">
            </el-table-column>
            <el-table-column prop="CName" label="所属分类">
            </el-table-column> -->
            <el-table-column prop="time" label="抄表时间">
            </el-table-column>
            <el-table-column label="抄表数值">
                <template slot-scope="scope">
                    <span style="color:green">{{scope.row.value}}</span>
                </template>
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
            devicetype: ['电', '水', '气'],
            keyword: '',
            select_date_value: '',
            tableData: [],
            total: 0,
            currentPage: 1,

        }
    },
    mounted() {
      

        this.loadRealData();
    },
    methods: {
        getStartDate(val) {
            // this.startDate=val;
        },
        search() {
            this.loadRealData();
        },
        loadRealData() {
            this.$ajax.get(this.$URL + '/energy/GetDeviceHisData', {
                params: {
                    keyword: this.keyword,
                    page: this.currentPage,
                    size: 10,
                    begin: this.startDate.format("yyyy-MM-dd") + " " + this.startTime.format("hh:mm:ss"),
                    end: this.endDate.format("yyyy-MM-dd") + " " + this.endTime.format("hh:mm:ss"),
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.tableData=[];
                    result.data.data.forEach(v=>{
                        if(v.length)
                        {
                           this.tableData.push({
                               time:v[0],
                               devicetype:v[10],
                               Name:v[12],
                               value:v[13]
                           })
                        }
                    });
                   // this.tableData = result.data.data;
                    this.total = result.data.count;
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val
            this.loadRealData();
        },

    }
}
</script>

<style lang="less" scoped>
.header {
    border-bottom: 1px solid rgba(33, 61, 112, 1);
}

.h100 {
    height:100%;
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
