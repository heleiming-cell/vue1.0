<template>
<div ref="myChart" class="myChart"></div>
</template>

<script>
import echarts from "echarts";
export default {
    props: {
        eData: {
            default: () => {
                return {
                    data: [],
                    Hour: [],
                }
            }
        }
    },
    data() {
        return {
            option: {},
            myChart: null
        }
    },
    mounted() {
        this.init()
    },
    watch: {
        eData() {
            this.init()
        }
    },
    methods: {
        init() {
            let option = {
                tooltip: {
                    trigger: 'axis'
                },
                // legend: {
                //     data: ['电流预警', '电压预警', '温度预警', '功率预警'],
                //     textStyle: {
                //         fontSize: 12,
                //         color: 'rgb(0,253,255,0.6)'
                //     },
                //     right: '4%'
                // },
                grid: {
                    top: '5%',
                    left: '2%',
                    right: '1%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: this.eData.Hour,
                    axisLabel: {
                        textStyle: {
                            color: 'white'
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#3F4042',
                            type: 'solid'

                        },
                        show: true,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#3F4042'
                        }
                    },
                    axisTick: {
                        show: false,

                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            color: 'white'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#3F4042'
                        },
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#3F4042'
                        }
                    },
                    axisTick: {
                        show: false,

                    }
                },
                series: [{
                    name: '月巡检趋势',
                    stack: '总量',
                    type: 'line',
                    color: '#298EEC',
                    smooth: true,
                    symbol: 'none',
                    symbolSize: 5,
                    data: this.eData.data
                }]
            }
            this.myChart = echarts.init(this.$refs.myChart);
            this.myChart.setOption(option);

            window.addEventListener("resize", () => {
                this.myChart.resize();
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.myChart {
    width: 100%;
    height: 100%;
}
</style>
