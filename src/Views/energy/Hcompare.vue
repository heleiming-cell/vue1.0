<template>
<el-row :gutter="15" style="font-size:12px; margin:0 5px; height:calc(100% - 115px)">
    <!-- <div class="header">
        <span style="color: #325fb8"><i class="iconfont icon-shouye"></i>能源管理></span><span style="color:#08abff;">环比分析</span></span>
    </div> -->
    <el-col :xs="24" :sm="3" class="h100">
        <div class="menuheader">
            <div style="float:left"><span>{{treeTitle}}</span></div>
            <div style="float:right">
                <span  class="pointer" @click="changeTree('GetAreaTreeInMenu','区域树',1)"><i class="fa fa-building"></i></span>
                <span  class="pointer" @click="changeTree('GetDeptTree','部门树',2)" style="margin:0 5px"><i class="fa fa-sitemap"></i></span>
                <span  style="margin:0 5px" @click="changeTree('GetCateTree','分类树',3)" class="pointer"><i class="fa fa-server"></i></span>
            </div>
        </div>
        <!-- @check-change="handleCheckChange" -->
        <el-tree node-key="key" ref="tree" @check-change="handleCheckChange"  show-checkbox check-strictly :data="data" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="24" :sm="21" class="h100">
        <div class="chartheader">
            <div><span class="charttitle">区域能耗</span></div>
            <div>
                <span class="charttime" @click="changeDate('year')">年</span><span class="bar">|</span><span class="charttime" @click="changeDate('month')">月</span><span class="bar"></span>
                <!--<span class="charttime" @click="changeDate('date')">日</span>--><span class="bar"></span>
                <el-date-picker :type="datetype" size="mini" style="width:150px" v-model="startDate" placeholder="选择日期">
                </el-date-picker>
                <!-- <span v-show="show">-</span>
                <el-date-picker v-show="show" type="date" size="mini" style="width:150px" v-model="endDate" placeholder="选择日期">
                </el-date-picker> -->
                <div class="btngroup">
                    <el-button type="primary" size="mini" @click="changeType(1)">电</el-button>
                    <el-button type="primary" size="mini" @click="changeType(2)">水</el-button>
                    <el-button type="primary" size="mini" @click="changeType(3)">气</el-button>
                    <el-button type="primary" size="mini" @click="changeType(0)">全部</el-button>
                </div>
            </div>
        </div>
        <div class="chart">
            <!-- :settings="chartSettings" -->
            <ve-histogram :data="chartData" height="100%" :extend="legend"></ve-histogram>
        </div>
    </el-col>
</el-row>
</template>

<script>
export default {
    name: 'areaEnergy',
    data() {
        this.chartSettings = {
            stack: {
                '用户': ['访问用户', '下单用户']
            },
            area: true
        }
        this.legend = {
            title: {},
            textStyle: {
                color: '#AAB5C9'
            },
            legend: {
                textStyle: {
                    color: 'red'
                },
                show: false
            },
            yAxis(item) {
                Object.assign(item[0], {
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#13316B'
                        }
                    }
                })
                return item
            },
            xAxis: {
                axisLabel: {
                    rotate: 45
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#13316B'
                    }
                }
            }
        };
        return {
            data: [],
            devicetype: 0, //全部
            categorytype: 1, //默认区域
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            //   show: false,
            datetype: 'month',
            startDate: new Date(),
            node:null,
            //  endDate: new Date(),
            treeTitle: '区域树',
            chartData: {
                columns: ['t', '水', '电', '气'],
                rows: [{
                        't': '2016-10',
                        '水': '100',
                        '电': 88,
                        '气': 1
                    },
                    {
                        't': '2017-10',
                        '水': 20,
                        '电': 70,
                        '气': 26
                    },
                    {
                        't': '2018-10',
                        '水': 30,
                        '电': 99,
                        '气': 76
                    },
                ]
            }
        }
    },
    mounted() {
        this.loadTree('GetAreaTreeInMenu');
    },
    methods: {
        changeType(val) {
            this.devicetype = val;
            this.loadChartData();
        },
        changeTree(val, title, type) {
            this.treeTitle = title;
            this.categorytype = type;
            this.loadTree(val);
        },
        loadTree(val) {
            this.$ajax.get(this.$URL + '/energy/' + val).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.data = result.data.data;
                }
            }).catch((err) => {

            });
        },
        changeDate(val) {

            this.datetype = val;
            this.startDate=new Date();
            // this.show = false;

        },
        loadChartData() {
            if(!this.node)
            {
                this.$message.error("请选择要环比的区域");
                return;
            }
            this.$ajax.get(this.$URL + '/energy/GetAreaHData',{
                params:{
                   areaid:this.node.key,
                   time:this.startDate.format("yyyy-MM-dd") ,
                   timetype:this.datetype,
                   devicetype:this.devicetype
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    if(result.data.data&&result.data.data.length>0)
                    {
                       
                       this.chartData.columns=Object.keys(result.data.data[0]);
                       this.chartData.rows=result.data.data;
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        handleCheckChange(node, status) {
            if (status) {
                if (this.node && this.node.key != node.key) {
                    this.$refs.tree.setChecked(this.node, false,true);
                }
               
                this.node = node;
                this.loadChartData();
            } else {
                if (this.node && this.node.key === node.key) {
                    this.node = null;
                }
            }

        },
    }
}
</script>

<style lang="less" scoped>
.header {
    border-bottom: 1px solid rgba(33, 61, 112, 1);
}

.menuheader {
    line-height: 36px;
    vertical-align: middle;
    padding: 0 10px;
    overflow: hidden;
    background: #010308;
    color: rgba(56, 151, 244, 1);
}

.chartheader {
    border-bottom: 1px solid rgba(32, 54, 93, 1);
    padding-bottom: 10px;

    .charttitle {
        font-size: 16px;
        font-weight: 400;
        color: rgba(56, 151, 244, 1);
        line-height: 32px;
    }

    .bar {
        color: #1F4083;
        font-weight: 600;
        margin-right: 5px;
        font-size: 16px;
    }

    .charttime {
        margin-right: 5px;
        font-size: 16px;
        cursor: pointer;
    }

    .btngroup {
        margin-left: 15px;
        display: inline-block;

        button {
            margin: 0 5px;
        }

        button:nth-of-type(1) {
            background: #0895C6 !important;
        }

        button:nth-of-type(2) {
            background: #D48265 !important;
        }

        button:nth-of-type(3) {
            background: #6977EE !important;
        }

        button:nth-of-type(4) {
            background: #1F4083 !important;
        }
    }
}

.chart {
    height: calc(100% - 121px);
    // padding-bottom: 50px;
}

.pointer {
    cursor: pointer;
}
</style>
