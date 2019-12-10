<template>
<el-row class="boxpanel">
    <el-col :xs="24" :sm="3" class="h100 " style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>设备列表</span></div>

        </div>
        <el-tree ref="tree" class="paneltree" node-key="key" :data="treedata" show-checkbox check-strictly @check-change="handleCheckChange" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="24" :sm="21" class="h100 " style="border-right: 1px solid #122d62">
        <div class="showtype">
            <div>
                <span>起始时间</span>
                <el-date-picker @change="showHistoryChart" size="small" v-model="select_history_date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:230px">
                </el-date-picker>
                <span>参数</span>
                <el-select v-model="param" size="small" @change="showHistoryChart">
                    <el-option v-for="(item,i) in params" :label="item.VarName" :value="item.Variable+'|'+item.VarName" :key="i"></el-option>
                </el-select>
                <el-button type="primary" @click="showHistoryChart" size="small">查询</el-button>
            </div>
            <div>
                <el-button type="primary" circle size="mini" @click="changeType(1)">
                    <i class="iconfont icon-tubiaozhexiantu"></i>
                </el-button>
                <el-button type="primary" circle size="mini" @click="changeType(2)">
                    <i class="iconfont icon-biaoge"></i>
                </el-button>
            </div>
        </div>
        <div class="chart" v-show="showType==1">

        </div>
        <el-table :data="tables" style="width: 100%" v-show="showType==2">

            <el-table-column label="设备名称">
                <template slot-scope="scope">
                    <span>{{node.label}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="参数名称">
                <template slot-scope="scope">
                    <span>{{param.split('|')[1]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="Key" label="时间">
            </el-table-column>
            <el-table-column label="历史值" prop="Value">
            </el-table-column>
        </el-table>
        <el-pagination v-show="showType===2" background layout="prev, pager, next" :total="total" @current-change="changePage" @prev-click="changePage" @next-click="changePage">
        </el-pagination>
    </el-col>
</el-row>
</template>

<script>
import {
    Tree
} from '@/lib/Common'
import {
    HistoryChartOption
} from '@/lib/chartConfig'
export default {
    name: 'realdata',
    data() {
        return {
            treedata: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            params: [],
            param: '',
            tree: null,
            roption: new HistoryChartOption().option,
            intervalTime: 2,
            interval: null,
            chart: null,
            select_history_date: '',
            showType: 1,
            tables: [],
            total: 0,
            hdata: [],
            node: null,
        }
    },
    watch: {
        showType: {
            handler(v) {
                if (v === 2) {
                    if (this.hdata.length === 0) {
                        this.loadTable();
                    }
                }
            }
        },
        hdata: {
            handler(v) {
                if (v.length > 0) {
                    this.tables = v.slice(0, 10);
                }

            }
        }
    },
    mounted() {
        this.loadPanel();
        
    },
    methods: {
        loadPanel() {
            this.$ajax.get(this.$URL + '/AreaMenu/GetAreaPanel').then((result) => {
                if (result.status === 200 && result.data.success) {
                    let data = [];
                    result.data.data.forEach(v => {
                        if (v.label == "楼宇自控") {
                            data = v;
                            return false;
                        }
                    });
                    this.treedata = [data];
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        initChart() {
            let chart = this.$echarts.init(document.querySelector('.boxpanel .chart'));
            chart.setOption(this.roption);
            this.chart = chart;
        },
        handleCheckChange(data, status) {
            if (status && data && data.key) {
                this.node = data;
                this.loadConfig(data, 0);
                this.initChart();
            } else if (!status) {
                this.node = null;
            }
        },
        loadConfig(data, typeid) {
            this.$ajax.get(this.$URL + '/panel/GetPanelConfig', {
                params: {
                    id: data.key,
                    typeid: typeid //实时数据
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.params = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        showHistoryChart() {
            if (!this.select_history_date || !this.param) {
                return;
            }
            if (this.showType === 2) {
                this.loadTable();
                return;
            }
            let StartDate = this.select_history_date[0];
            let EndDate = this.select_history_date[1];
            this.$ajax.post(this.$URL + '/device/GetHistoryData', this.$QS.stringify({
                bt: StartDate,
                et: EndDate,
                variable: this.param.split('|')[0],
                // PanelID:this.PanelID,
            })).then((result) => {
                if (result.status === 200 && result.data.success) {
                    let option = this.chart.getOption();
                    this.hdata = result.data.data;
                    this.total = result.data.data.length;
                    if (result.data.data.length > 0) {
                        option.xAxis[0].data = [];
                        option.series[0].data = [];
                        result.data.data.forEach((v, i) => {
                            option.xAxis[0].data.push(v.Key);
                            option.series[0].data.push(v.Value);
                        });
                        // option.xAxis[0].data = Object.keys(result.data.data);
                        // option.series[0].data = [];
                        // option.series[0].data = Object.values(result.data.data);
                        option.series[0].name = this.param.split('|')[1]

                    } else {
                        option.xAxis[0].data = [];
                        option.series[0].data = [];
                        option.series[0].data = [];
                        option.series[0].name = '';
                    }
                    this.chart.setOption(option);
                } else {
                    let option = this.chart.getOption();
                    option.xAxis[0].data = [];
                    option.series[0].data = [];
                    option.series[0].data = [];
                    option.series[0].name = '';
                    this.chart.setOption(option);
                }
            }).catch((err) => {
                console.log(err);
            });

        },
        loadTable() {
            if (!this.select_history_date || !this.param) {
                return;
            }
            let StartDate = this.select_history_date[0];
            let EndDate = this.select_history_date[1];
            this.$ajax.post(this.$URL + '/device/GetHistoryData', this.$QS.stringify({
                bt: StartDate,
                et: EndDate,
                variable: this.param.split('|')[0],
                // PanelID:this.PanelID,
            })).then((result) => {
                if (result.status === 200 && result.data.success) {
                    let option = this.chart.getOption();
                    this.hdata = result.data.data;
                    this.total = result.data.length;
                }
            }).catch((err) => {
                console.log(err);
            });

        },
        changeType(val) {
            this.showType = val;
        },
        changePage(page) {
            this.tables = this.hdata.slice((page - 1) * 10, page * 10)
        }
    }

}
</script>

<style lang="less" scoped>
.boxpanel {
    font-size: 12px;
    height: calc(100% - 115px);

    & /deep/ .el-pagination {
        text-align: center;
        margin-top: 10px
    }
}

.menuheader {
    line-height: 36px;
    vertical-align: middle;
    padding: 0 10px;
    overflow: hidden;
    background: #010308;

    i {
        cursor: pointer;
    }
}

.showtype {
    height: 60px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    div:nth-of-type(1) {
        display: flex;
        align-items: center;
    }

    .numInterval {
        display: inline-block;
        width: 80px;
    }
}

.chart {
    height: calc(100% - 60px);
    padding: 10px;
}

.paneltree {
    height: calc(100% - 36px);
    overflow-y: auto;
}
</style>
