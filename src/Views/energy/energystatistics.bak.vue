<template>
<div class="ghy-box">
    <div class="search">
        <div class="searchleft">
            <div>
                <label>区域</label>
                <el-select class="select" v-model="formInline.region" placeholder="活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </div>
            <div>
                <label>区域</label>
                <el-select v-model="formInline.region" placeholder="活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </div>
            <el-button type="primary" size="mini">查询</el-button>
        </div>
        <div class="btn">
            <el-button type="primary" size="mini">水</el-button>
            <el-button type="primary" size="mini">电</el-button>
            <el-button type="primary" size="mini">气</el-button>
        </div>
    </div>
    <!-- <div class=""> -->
    <el-row :gutter="10" class="boxbody">
        <el-col :xs="24" :sm="24" :md="9" :lg="9" class="h100">
            <div class="chart">
                <!-- <ve-histogram height="100%" :data="barData" :colors="totalcolor" :extend="legend"></ve-histogram> -->
            </div>
            <div class="energy">
                <span>分项能耗</span>
                <div class="itemrow">
                    <div class="item">
                        <div>
                            <i class="iconfont icon-13"></i>
                        </div>
                        <div>
                            <span class="span1">动力用电</span></br>
                            <span class="span2">3.33</span></br>
                            <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp;  20%</span></br>
                            <span class="span3">占比 &nbsp;&nbsp;  20%</span>
                        </div>
                    </div>
                    <div class="item">
                        <div style="background:#26488C">
                            <i class="iconfont icon-kongtiao"></i>
                        </div>
                        <div>
                            <span class="span1">空调用电</span></br>
                            <span class="span2">3.33</span></br>
                            <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp;  20%</span></br>
                            <span class="span3">占比 &nbsp;&nbsp;  20%</span>
                        </div>
                    </div>
                </div>
                <div class="itemrow">
                    <div class="item">
                        <div style="background:#D48265;">
                            <i class="iconfont icon-teshuyongdian"></i>
                        </div>
                        <div>
                            <span class="span1">特殊用电</span></br>
                            <span class="span2">3.33</span></br>
                            <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp;  20%</span></br>
                            <span class="span3">占比 &nbsp;&nbsp;  20%</span>
                        </div>
                    </div>
                    <div class="item">
                        <div style="background:#6977EE">
                            <i class="iconfont icon-chazuo"></i>
                        </div>
                        <div>
                            <span class="span1">插座用电</span></br>
                            <span class="span2">3.33</span></br>
                            <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp;  20%</span></br>
                            <span class="span3">占比 &nbsp;&nbsp;  20%</span>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="9" :lg="9" class="h100">
            <div class="chart">
                <!-- <ve-line height="100%" :data="lineData" :extend="legend"></ve-line> -->
            </div>
            <div class="energy">
                <span>区域能耗</span>
                <div class="itemrow">
                    <div class="item">
                        <div style="background:#14213D">
                            <i class="iconfont icon-building"></i>
                        </div>
                        <div>
                            <span class="span1">规划展示中心</span></br>
                            <span class="span2">3.33</span></br>
                            <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp;  20%</span></br>
                        </div>
                    </div>
                    <div class="item">
                        <div style="background:#14213D">
                            <i class="iconfont icon-building"></i>
                        </div>
                        <div>
                            <span class="span1">政务中心</span></br>
                            <span class="span2">3.33</span></br>
                            <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp;  20%</span></br>
                        </div>
                    </div>
                </div>
                <div class="itemrow">
                    <div class="item">
                        <div style="background:#14213D">
                            <i class="iconfont icon-building"></i>
                        </div>
                        <div>
                            <span class="span1">会议中心</span></br>
                            <span class="span2">3.33</span></br>
                            <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp;  20%</span></br>
                        </div>
                    </div>
                    <div class="item">
                        <div style="background:#14213D">
                            <i class="iconfont icon-building"></i>
                        </div>
                        <div>
                            <span class="span1">集团中心</span></br>
                            <span class="span2">3.33</span></br>
                            <span class="span3">同比 &nbsp;&nbsp;<i class="iconfont icon-icon-arrow-top4"></i>&nbsp;&nbsp;  20%</span></br>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" class="h100">
            <div class="chartright">
                <div>
                    <div style="color:rgba(255,255,255,1);font-size:19px;line-height:53px;margin-left:30px">总体信息</div>
                    <div class="img">
                        <img src='@/static/images/lang.jpg'></img>
                    </div>
                    <div class="info">
                        <span>建筑面积:18625㎡ 建筑面积:18625㎡</span> </br>
                        <span>建筑面积:18625㎡ 建筑面积:18625㎡</span>
                    </div>
                    <ul>
                        <li>
                            <span>今日 &nbsp;&nbsp;&nbsp;&nbsp; 1098KWH</span>
                        </li>
                        <li>
                            <span>本周 &nbsp;&nbsp;&nbsp;&nbsp; 1098KWH</span>
                        </li>
                        <li>
                            <span>本月 &nbsp;&nbsp;&nbsp;&nbsp; 1098KWH</span>
                        </li>
                        <li>
                            <span>本年 &nbsp;&nbsp;&nbsp;&nbsp; 1098KWH</span>
                        </li>
                    </ul>
                    <div class="info">
                        <span>单位建筑面积能耗 92kwh/㎡.y</span> </br>
                        <span>单位建筑面积能耗 92kwh/㎡.y</span>
                    </div>
                </div>
                <div style="height:32%">
                    <ve-histogram height="100%" :data="barData" :colors="totalcolor" :extend="legend"></ve-histogram>
                </div>

            </div>
        </el-col>
    </el-row>

</div>
</template>

<script>
export default {
    name: 'energystatistics',
    data() {
        this.legend = {
            grid: {
                left: 0,
                bottom: 5,
            },
            title: {
                text: '总能耗逐年',
                textStyle: {
                    color: 'white',
                    fontSize: 19
                }
            },
            series: {
                barMaxWidth: 40
            },
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
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#13316B'
                    }
                }
            }
        };
        this.totalcolor = ['#0895C6']
        return {
            formInline: {
                user: '',
                region: ''
            },
            barData: {
                columns: ['日期', 'total'],
                rows: [{
                        '日期': '2014',
                        'total': 1393,
                    },
                    {
                        '日期': '2015',
                        'total': 3530,
                    },
                    {
                        '日期': '2016',
                        'total': 2923,
                    },
                    {
                        '日期': '2017',
                        'total': 1723,
                    },
                    {
                        '日期': '2018',
                        'total': 3792,
                    },

                ]
            },
            lineData: {
                columns: ['日期', '访问用户', '下单用户', '下单率'],
                rows: [{
                        '日期': '2014',
                        '访问用户': 1393,
                        '下单用户': 1093,
                        '下单率': 2000
                    },
                    {
                        '日期': '2015',
                        '访问用户': 3530,
                        '下单用户': 3230,
                        '下单率': 3000
                    },
                    {
                        '日期': '2016',
                        '访问用户': 2923,
                        '下单用户': 2623,
                        '下单率': 3000
                    },
                    {
                        '日期': '2017',
                        '访问用户': 1723,
                        '下单用户': 1423,
                        '下单率': 4000
                    },
                    {
                        '日期': '2018',
                        '访问用户': 3792,
                        '下单用户': 3492,
                        '下单率': 0.323
                    }
                ]
            }
        }
    },
}
</script>

<style lang="less" scoped>
.el-select /deep/ .el-input__inner {
    height: 36px !important;
}

.ghy-box {
    .header {
        border-bottom: 1px solid #122d62
    }

    .search {
        height: 50px;
        border-bottom: 1px solid #122d62;
        display: flex;
        justify-content: space-between;

        .searchleft {
            display: flex;
            align-items: center;
            margin-left: 30px;

            >div:nth-of-type(1) {
                margin-right: 10px;
            }

            label {
                margin-right: 10px;
            }

            button {
                margin-left: 40px;
            }

        }

        .btn {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;

            button:nth-of-type(1) {
                background: #0895C6 !important;
            }

            button:nth-of-type(2) {
                background: #D48265 !important;
            }

            button:nth-of-type(3) {
                background: #6977EE !important;
            }
        }
    }

    .boxbody {
        height: calc(100% - 50px);
        padding: 10px;
        margin: 0 !important;

        >div {
            display: flex;
            flex-direction: column;
            flex: 1 1;
        }

        .chart {
            height: 50%;
            border: 1px solid #122d62;
        }

        .energy {
            border: 1px solid #122d62;
            height: 50%;
            margin: 10px 0 0 0;

            display: flex;
            flex-direction: column;

            >span {
                font-size: 19px;
                font-weight: 400;
                color: #fff;
                display: inline-block;
                margin: 20px 0 0 30px;
            }

            .itemrow {
                display: flex;
                flex: 1 1;
                justify-content: space-between;
                align-items: center;
                padding: 0 20px;

                .item {
                    display: flex;

                    >div:nth-of-type(1) {
                        width: 80px;
                        height: 80px;
                        background: rgba(8, 149, 198, 1);
                        border-radius: 4px;
                        margin-right: 20px;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        i {
                            display: inline-block;
                            font-size: 40px;
                            vertical-align: middle;
                        }
                    }

                    >div:nth-of-type(2) {
                        display: inline-block;
                        // background: #26488C;
                    }
                }

                .span1 {

                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(170, 181, 201, 1);
                }

                .span2 {

                    font-size: 24px;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                }

                .span3,
                    {
                    i {
                        color: #00FFFF;
                    }

                    font-size: 13px;
                    font-weight: 400;
                    color: rgba(170, 181, 201, 1);
                }
            }
        }

        .chartright {
            height: 100%;
            box-sizing: border-box;
            border: 1px solid rgba(53, 77, 121, 1);

            &>div:nth-of-type(1) {
                height: 68%;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    display: none;
                }
            }

            img {
                background-size: 100% 100%;
                height: 100%;
                width: 100%;
            }

            .img {
                margin: 10px 30px;
                height: 162px;
            }

            ul {
                border: 1px solid rgba(53, 77, 121, 1);
                margin: 10px 30px;
                list-style: none;

                li {
                    border-bottom: 1px solid rgba(53, 77, 121, 1);
                    padding-left: 50px;

                    span {

                        font-size: 16px;
                        font-weight: 400;
                        color: rgba(170, 181, 201, 1);
                        // line-height: 32px;
                    }
                }

            }

            .info {
                margin: 0 30px;
                font-size: 16px;
                font-weight: 400;
                color: rgba(170, 181, 201, 1);
                line-height: 32px;
            }
        }
    }
}
</style>
