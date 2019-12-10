<template>
<div class="ghy-box">
    <!-- <div class="header">
        <span style="color: #325fb8"><i class="iconfont icon-shouye"></i>能源管理></span><span style="color:#08abff;">实时表显</span></span>
    </div> -->
    <div class="h100">
        <div class="filter">
            <div class="filter_line">
                <el-input placeholder="支持 区域 组织 设备 查询" v-model="keyword"></el-input>
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
            <el-table-column prop="AName" label="所属区域">
            </el-table-column>
            <el-table-column prop="DName" label="所属部门">
            </el-table-column>
            <el-table-column prop="CName" label="所属分类">
            </el-table-column>
            <el-table-column label="表显">
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
            devicetype:['电','水','气'],
            keyword: '',
            tableData: [],
            total: 0,
            currentPage: 1,
          
         
            
        }
    },
    mounted() {
        this.loadRealData();
    },
    methods: {
        search() {
            this.loadRealData();
        },
        loadRealData() {
            this.$ajax.get(this.$URL + '/energy/GetDeviceRealData', {
                params: {
                    keyword: this.keyword,
                    page: this.currentPage,
                    size: 10
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
    height: calc(100% - 50px);
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
