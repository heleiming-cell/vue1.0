<template>
<el-row :gutter="10" class="box">
    <el-col class="h100" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="filter">
            <el-input v-model="keyword" placeholder="支持 门名称 查询" style="width:200px;margin-right:30px"></el-input>
            <el-button type="primary" class="search" @click="search">查询</el-button>
        </div>
        <div class="table">
            <el-table :data="tableData" style="width: 100%" class="usertable">
                <el-table-column prop="DoorID" label="门编号">
                </el-table-column>
                <el-table-column prop="DoorName" label="门名称">
                </el-table-column>
                <el-table-column prop="TerName" label="控制器">
                </el-table-column>
                 <el-table-column prop="Note" label="备注">
                </el-table-column>
            </el-table>
            <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>
        </div>
    </el-col>
</el-row>
</template>

<script>
import pagination from '@/components/common/pagination'
export default {
    name: 'doorinfo',
    data() {
        return {
            data: [],
            tableData: [],
            deptid: '',
            total: 11,
            keyword: '',
            defaultProps: {
                children: 'children',
                label: 'label',
                isLeaf: 'isLeaf'
            },
            currentPage:1
        }
    },
    mounted() {
        this.loadDoors();
    },
    components: {
        'pagination': pagination,
    },
    methods: {
        loadDoors() {
            this.$ajax.get(this.$URL + '/acs/GetDoor', {
                params: {
                    keyword: this.keyword,
                    page: this.currentPage,
                    size: 10,
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
        search() {
            this.currentPage=1;
            this.loadDoors();
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.loadDoors()
        }
    }
}
</script>

<style lang="less" scoped>
.filter {
    display: flex;
    padding: 10px 0;
}

.menuheader {
    line-height: 36px;
    vertical-align: middle;
    padding: 0 10px;
    overflow: hidden;
    background: #051b47;
    margin-top: 10px;
}

.box {
    font-size: 12px;
    margin: 0px !important;
    height: calc(100% - 115px);
}

.green {
    color: green;
}

.red {
    color: red;
}
</style>
