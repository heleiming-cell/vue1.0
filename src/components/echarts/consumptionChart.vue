<template>
<div ref="myChart" class="barChart"></div>
</template>

<script>
export default {
    props: {
        echartDate: {
            type: Array,
            default () {
                return;
            }
        },
        echartColor: {
            type: Array,
            default () {
                return [];
            }
        },
        echartSeries: {
            type: Array,
            default () {
                return;
            }
        },
        echartTitle: {
            // type: String,
            default () {
                return;
            }
        },
        legend: {
            default () {
                return;
            }
        },
        yAxisMax: {
            type: Number,
            default () {
                return;
            }
        },
        splitNumber: {
            type: Number,
            default () {
                return;
            }
        },
        echartXDate: {
            type: Array,
            default () {
                return;
            }
        }
    },
    data() {
        let _this = this
        return {
            option: {
                title: this.echartTitle,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '2%',
                    // top:'6%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: this.echartXDate,
                    axisTick: {
                        alignWithLabel: true
                    },
                    lineStyle: {
                        type: 'dashed'
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#7ea6f0'
                        }
                    },
                }],
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: '#7ea6f0'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#4C4F5C'],
                            width: 0.5,
                            type: 'dashed'
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    max: this.splitNumber,
                    min: 0,
                    splitNumber: 5,
                }],
                series: [{
                    name: '电',
                    type: 'bar',
                    // barWidth: '60%',
                    data: this.echartDate,
                    color: function (params) {
                        var colorList = _this.echartColor;
                        return colorList[params.dataIndex];
                    }
                }]
            },
        }
    },
    methods: {
        init() {
            let echart = this.$echarts.init(this.$refs.myChart);
            this.option.series[0].data = this.echartDate
            echart.setOption(this.option);
            window.addEventListener("resize", function () {
                echart.resize();
            });
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.init();
        })

    },
    watch: {
        echartDate(val) {
            this.init()
        },
    }
}
</script>

<style lang="scss" scoped>
.barChart {
    width: 100%;
    margin: 0 auto;
}
</style>
