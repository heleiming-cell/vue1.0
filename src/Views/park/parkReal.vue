<template>
<el-row class="box">
    <el-row :gutter="10" style="margin:0">
        <el-col :xs="24" :sm="24" :md="8" :lg="8" class="h100 center">
            <el-progress type="circle" :percentage="100" status="text">
                <div>{{total}}</div>
                <div>总车位</div>
            </el-progress>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" class="h100 center">
            <el-progress type="circle" :percentage="100" status="text" color="#8e71c7">
                <div>{{total-occupy}}</div>
                <div>剩余</div>
            </el-progress>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" class="h100 center">
            <el-progress type="circle" :percentage="100" status="text" color="#13ce66">
                <div>{{occupy}}</div>
                <div>占用</div>
            </el-progress>
        </el-col>
    </el-row>
    <el-row style="margin:0">
        <div class="table h100">
            <el-table :data="data" style="width: 100%;overflow-y:auto" class=" h100">
                <el-table-column prop="ChannelName" label="通道名称">
                </el-table-column>
                <el-table-column prop="UserName" label="车主姓名">
                </el-table-column>
                <el-table-column prop="CarCode" label="车牌号码">
                </el-table-column>
                <!-- <el-table-column prop="InOrOut" label="进出状态">
                </el-table-column> -->
                <el-table-column label="设备类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.InOrOut=="1"?"出":"进"}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Crdtm" label="进出时间">
                </el-table-column>
            </el-table>
        </div>
    </el-row>
</el-row>
</template>

<script>
import pagination from '@/components/common/pagination'
export default {
    name: 'acsrecord',
    data() {
        return {

            total: 0,
            occupy: 0,
            data: [],
        }
    },
    mounted() {
        this.loadData();
    },
    components: {
        'pagination': pagination,
    },
    methods: {
        loadData() {
            this.$ajax.get(this.$URL + '/park/GetRealData').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.total = result.data.Total;
                    this.occupy = result.data.Occupy;
                    this.data = result.data.RealRecord
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }
}
</script>

<style lang="less" scoped>
.table {
    padding: 10px;
}

.box {
    height: calc(100% - 115px);

    >div:nth-of-type(1) {
        height: 150px;
    }

    >div:nth-of-type(2) {
        height: 80%;
    }
}

.green {
    color: green;
}

.red {
    color: red;
}
</style>
