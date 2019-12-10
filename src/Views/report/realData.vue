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
                <span>间隔:&nbsp;&nbsp;&nbsp;</span>
                <el-input class="numInterval" v-model="intervalTime" size="mini" @change="showRealChart"></el-input>
                <span>秒&nbsp;&nbsp;&nbsp;</span>
                <span>参数:&nbsp;&nbsp;</span>
                <el-select v-model="param" size="mini" @change="showRealChart">
                    <el-option v-for="(item,i) in params" :label="item.VarName" :value="item.Variable+'|'+item.VarName" :key="i"></el-option>
                </el-select>
                <el-button type="primary" @click="showRealChart" size="mini">查询</el-button>
            </div>
            <div>
                <el-button type="primary" circle size="mini">
                    <i class="iconfont icon-biaoge"></i>
                </el-button>
                <el-button type="primary" circle size="mini">
                    <i class="iconfont icon-tubiaozhexiantu"></i>
                </el-button>
            </div>
        </div>
        <div class="chart">

        </div>
    </el-col>
</el-row>
</template>

<script>
import {
    Tree
} from '@/lib/Common'
import {
    RealChartOption
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
            roption: new RealChartOption().option,
            intervalTime: 2,
            interval:null,
            chart:null,
        }
    },
    mounted() {
        this.tree = new Tree();
        this.tree.loadTreeNodes(this, '/AreaMenu/GetAreaPanel', 'treedata')
    },
    methods: {
        initChart() {
            let chart = this.$echarts.init(document.querySelector('.boxpanel .chart'));
            chart.setOption(this.roption);
            this.chart=chart;
        },
        handleCheckChange(data, status) {
            if (status && data && data.key) {
                this.loadConfig(data, 1);
                this.initChart();
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
        showRealChart() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            if (!this.params) {
                //this.$message.error("请选择参数");
                return;
            }
            if (!this.intervalTime || typeof (parseInt(this.intervalTime)) !== "number") {
                //this.$message.error("请输入正常的时间间隔");
                return;
            }

            let current = new Date();
            this.$ajax.get(this.$URL + '/ioServer/SingleRead', {
                params: {
                    varId: this.param.split('|')[0]
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    let option = this.chart.getOption();
                    if (option.xAxis[0].data.length > 10) {
                         option.xAxis[0].data.shift();
                    }
                    if (option.series[0].data.length > 10) {
                        option.series[0].data.shift();
                    }
                    option.xAxis[0].data.push(current.format("yyyy-MM-dd hh:mm:ss"))
                    option.series[0].data.push(result.data.data);
                    option.series[0].name = this.param.split('|')[1]
                    this.chart.setOption(option);
                    this.interval = setInterval(this.showRealChart, parseInt(this.intervalTime) * 1000);
                }
            }).catch((err) => {
                console.log(err);
            });
        },
    }

}
</script>

<style lang="less" scoped>
.boxpanel {
    font-size: 12px;
    height: calc(100% - 115px);
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
.paneltree{
    height: calc(100% - 36px);
    overflow-y: auto;
}
</style>
