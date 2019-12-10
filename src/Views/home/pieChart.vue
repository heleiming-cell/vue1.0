<template>
<div ref="myChart" class="barChart"></div>
</template>

<script>
export default {
    props: {
        underway: {
            type: String,
            default: ''
        },
        done: {
            type: String,
            default: ''
        },
        unfinished: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            option: {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    right: '10%',
                    top: 'middle',
                    itemWidth: 5,
                    itemHeight: 5,
                    textStyle: {
                        color: '#53b8ff',
                        fontSize: 15
                    },
                    data: ['进行中', '已完成', '未完成']
                },
                series: [{
                    name: '工单统计',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                            value: this.underway,
                            name: '进行中',
                            itemStyle: {
                                normal: {
                                    color: { // 完成的圆环的颜色
                                        colorStops: [{
                                            offset: 0,
                                            color: '#f4f69e' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#f4f69e' // 100% 处的颜色
                                        }]
                                    },
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                }
                            }
                        },
                        {
                            value: this.done,
                            name: '已完成',
                            itemStyle: {
                                normal: {
                                    color: { // 完成的圆环的颜色
                                        colorStops: [{
                                            offset: 0,
                                            color: '#00b3a3' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#00b3a3' // 100% 处的颜色
                                        }]
                                    },
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                }
                            }
                        },
                        {
                            value: this.unfinished,
                            name: '未完成',
                            itemStyle: {
                                normal: {
                                    color: { // 完成的圆环的颜色
                                        colorStops: [{
                                            offset: 0,
                                            color: '#004aff' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#004aff' // 100% 处的颜色
                                        }]
                                    },
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                }
                            }
                        }
                    ]
                }]
            }

        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.underway = this.option.series[0].data[0].value
            this.done = this.option.series[0].data[1].value
            this.unfinished = this.option.series[0].data[2].value
            let echart = this.$echarts.init(this.$refs.myChart);
            echart.setOption(this.option);
            window.addEventListener("resize", function () {
                echart.resize();
            });
        }
    }
};
</script>

<style lang="less" scoped>
.barChart {
    width: 100%;
    height: 1.8rem;
    margin: 0 auto;
}
</style>
