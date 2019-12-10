<template>
<div class="box">
    <el-table :data="tableData" style="width: 100%" height="calc(100% - 36px)">

        <el-table-column prop="js_endpoint_id" label="终端ID">
        </el-table-column>
        <el-table-column prop="js_endpoint_address" label="终端IP">
        </el-table-column>
        <el-table-column prop="js_endpoint_name" label="终端名称">
        </el-table-column>
        <el-table-column prop="js_endpoint_online" label="终端状态">
            <template slot-scope="scope">
                <span v-if="scope.row.js_endpoint_online==1" style="color:green;">在线</span>
                <span v-if="scope.row.js_endpoint_online==0" style="color:red;">离线</span>
            </template>
        </el-table-column>
        <el-table-column prop="js_endpoint_volume" label="当前音量">
        </el-table-column>
        <el-table-column label="当前任务" prop="js_task_name">
        </el-table-column>
    </el-table>
    <el-pagination :background="true" @current-change="handleCurrentChange" :page-size="size" layout="total, prev, pager, next" :total="total">
    </el-pagination>
</div>
</template>

<script>
export default {
    name: 'itcterminal',
    data() {
        return {
            tableData: [],
            size: 10,
            page: 1,
            total: 0,
            data: [],
        }
    },
    watch: {
        data: {
            handler(v) {
                this.tableData = this.data.slice((this.page - 1) * this.size, this.page * this.size);
            }
        }
    },
    mounted() {
       this.loadTerminals();
    },
    methods: {
        loadTerminals() {
            this.$ajax.get(this.$URL + '/itc/GetTerminals').then((result) => {
                if (result.status === 200) {
                        this.data = result.data.PARA;
                        this.total=this.data.length;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        handleCurrentChange(page) {
            this.page = page;
            this.tableData = this.data.slice((this.page - 1) * this.size, this.page * this.size);
        },
    }
}
</script>

<style lang="less" scoped>
.box {
    font-size: 12px;
    height: calc(100% - 115px);
    overflow-x: hidden;
    padding: 10px 0;
    margin: 0 !important;
      & /deep/ .el-pagination.is-background {
        text-align: center;
    }
}

.search {
    height: 50px;
    display: flex;
    align-items: flex-start;
}

.table {
    height: calc(100% - 50px);

}
</style>
