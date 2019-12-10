<template>
<div ref="myChart" class="myChart"></div>
</template>

<script>
import echarts from "echarts";
export default {
    props: ["legend","data"],
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
        data() {
            this.init()
        },
        legend(){
            this.init()
        }
    },
    methods: {
        init() {
            let option = {
                // backgroundColor: '#00265f',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    top: '15%',
                    right: '3%',
                    left: '5%',
                    bottom: '12%'
                },
                xAxis: [{
                    type: 'category',
                    data: this.legend,
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.12)'
                        }
                    },
                    axisLabel: {
                        margin: 10,
                        color: '#e2e9ff',
                        textStyle: {
                            fontSize: 14
                        },
                    },
                }],
                yAxis: [{
                    axisLabel: {
                        formatter: '{value}',
                        color: '#e2e9ff',
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.12)'
                        }
                    }
                }],
                series: [{
                    type: 'bar',
                    data: this.data,
                    barWidth: '20px',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0,244,255,1)' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: 'rgba(0,77,167,1)' // 100% 处的颜色
                            }], false),
                            barBorderRadius: [30, 30, 30, 30],
                            shadowColor: 'rgba(0,160,221,1)',
                            shadowBlur: 4,
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            lineHeight: 30,
                            width: 80,
                            height: 30,
                            backgroundColor: 'rgba(0,160,221,0.1)',
                            borderRadius: 200,
                            position: ['-8', '-60'],
                            distance: 1,
                            formatter: [
                                '    {d|●}',
                                ' {a|{c}}     \n',
                                '    {b|}'
                            ].join(','),
                            rich: {
                                d: {
                                    color: '#3CDDCF',
                                },
                                a: {
                                    color: '#fff',
                                    align: 'center',
                                },
                                b: {
                                    width: 1,
                                    height: 30,
                                    borderWidth: 1,
                                    borderColor: '#234e6c',
                                    align: 'left'
                                },
                            }
                        }
                    }
                }]
            };
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
