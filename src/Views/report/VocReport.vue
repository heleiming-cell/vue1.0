<template>
<!-- 场内停车记录 -->
<div class="ghy-box">
    <div class="h100">
        <div class="search">
            <div>
                <!-- <el-input style="margin-right:10px" type="text" size="mini" v-model="floor" placeholder="支持 楼层  查询"></el-input> -->
                <el-input type="text" size="mini" v-model="keyword" placeholder="支持 名称 查询"></el-input>
                <el-button type="primary" size="mini" @click="search">查询</el-button>
            </div>
            <div>
                <el-button type="primary" size="mini" @click="changeShow(false)">表格</el-button>
                <el-button type="primary" size="mini" @click="changeShow(true)">图表</el-button>
            </div>
        </div>
        <el-radio-group v-model="radio" v-show="ischart" class="elradio" @change="radioChange">
            <el-radio :label="1">VOC</el-radio>
            <el-radio :label="2">CO2</el-radio>
            <!-- <el-radio :label="3">甲醛</el-radio> -->
        </el-radio-group>
        <el-table :data="tableData" style="width: 100%" class="usertable" :default-sort="{prop: 'voc', order: 'descending'}" v-show="!ischart">
            <!-- <el-table-column prop="areaname" label="楼层"></el-table-column> -->
            <el-table-column prop="name" label="名称"></el-table-column>
            <!-- <el-table-column prop="DName" label="所属部门">
        </el-table-column>-->
            <el-table-column prop="voc" label="VOC(mg/m³)" sortable></el-table-column>
            <el-table-column prop="co" label="CO2" sortable></el-table-column>
            <el-table-column prop="pm" label="PM2.5" sortable></el-table-column>
            <el-table-column prop="temp" label="室内温度(℃)" sortable></el-table-column>
            <el-table-column prop="wet" label="室内湿度(%)" sortable></el-table-column>
        </el-table>
        <div v-show="!ischart" style="text-align:center">
            <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total, prev, pager, next" :total="total">
            </el-pagination>
        </div>
        <!-- <pagination @current-change="handleCurrentChange" :page-size="10" :total="total" v-show="!ischart"></pagination> -->
        <div id="vocchart" v-show="ischart"></div>
    </div>
</div>
</template>

<script>
import pagination from "@/components/common/pagination";
import {
    ChartOption
} from "@/lib/chartConfig";
export default {
    name: "userManager",
    components: {
        // 'gh_table': gh_table,
        pagination: pagination
    },
    data() {
        return {
            keyword: "",
            //  tableData: [],
            total: 0,
            currentPage: 1,
            ischart: false,
            radio: 1,
            data: [],
            floor:''
        };
    },
    computed: {
        tableData() {
            return this.data.slice((this.currentPage - 1) * 10, this.currentPage * 10);
            // return th
        }
    },
    watch: {
        ischart: {
            handler(v) {
                if (v) {
                    this.$nextTick(() => {
                        let chart = this.$echarts.init(document.getElementById("vocchart"));
                        let option = new ChartOption().vocoption;
                        if (this.data && this.data.length > 0) {
                            this.data.forEach((v, i) => {
                                option.xAxis.data.push(v.name);
                                option.series[0].data.push(v.voc ? v.voc : 0);
                                option.series[1].data.push(v.voc ? v.voc : 0);
                            });
                        }
                        chart.setOption(option);
                    });

                }else{
                    this.loadVOC();
                }
            }
        }
    },
    mounted() {
        this.loadVOC();
    },
    methods: {
        search() {
            this.currentPage = 1;
            this.loadVOC();
        },
        loadVOC() {
            this.$ajax
                .get(this.$URL + "/report/GetVocRealData", {
                    params: {
                        keyword: this.keyword,
                        floor:this.floor,
                        // page: this.currentPage,
                        // size: 10
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                            this.currentPage = 1;
                            this.data = result.data.data;
                            this.total = result.data.count;
                            if(this.ischart)
                            this.showChart(this.radio);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },

        handleCurrentChange(val) {
            this.currentPage = val;
            this.tableData = this.data.slice((this.currentPage - 1) * 10, this.currentPage * 10);
        },
        changeShow(val) {
            this.ischart = val;
        },
        showChart(prop) {
            this.$nextTick(() => {
                let chart = this.$echarts.init(document.getElementById("vocchart"));
                let option = new ChartOption().vocoption;
                if (this.data && this.data.length > 0) {
                    this.data.forEach((v, i) => {
                        option.xAxis.data.push(v.name);
                        option.series[0].data.push(v[prop] ? v[prop] : 0);
                        option.series[1].data.push(v[prop] ? v[prop] : 0);
                    });
                }
                chart.setOption(option);
            });
        },
        radioChange(val) {
            if (val === 1) {
                this.showChart("voc")
            } else if (val === 2) {
                this.showChart("co")
            } else if (val === 3) {
                this.showChart("hcho")
            }
        }
    }
};
</script>

<style lang="less" scoped>
.header {
    border-bottom: 1px solid rgba(33, 61, 112, 1);
}

table {
    height: 100% !important;
}

.ghy-box {
    padding: 0 10px;
}

#vocchart {
    height: 600px;
}

.search {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;

    >div {
        display: flex;
    }
}

.elradio {
    margin-top: 15px;
    margin-left: 15px;
}
</style>
