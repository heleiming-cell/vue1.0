<template>
<div ref="usetrend" class="usetrend"></div>
</template>

<script>
import echarts from 'echarts'
export default {
    name: "usetrend",
    props: {
        usetrendDate: {
            type: Array,
            default: []
        },
        useElectricity: {
            type: Array,
            default: []
        },
        usecoldwater: {
            type: Array,
            default: []
        },
        usehotwater: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            option: {
                title: {
                    text: '用能趋势',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 16,
                        color: '#F1F1F3'
                    },
                    left: '0',
                    top: '2%'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}<br />{a0}: {c0}kw<br />{a1}: {c1}t<br />{a2}: {c2}t',
                    axisPointer: {
                        lineStyle: {
                            color: '#57617B'
                        }
                    }
                },
                legend: {
                    icon: 'rect',
                    itemWidth: 14,
                    itemHeight: 5,
                    itemGap: 13,
                    data: ['电能', '冷水', '热水'],
                    bottom: '1%',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff'
                    }
                },
                grid: {
                    left: '1%',
                    right: '4%',
                    bottom: '8%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#496d95'
                        }
                    },
                    data: this.usetrendDate
                }],
                yAxis: [{
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#496d95'
                        }
                    },
                    axisLabel: {
                        margin: 10,
                        textStyle: {
                            fontSize: 14
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#496d95'
                        }
                    }
                }],
                series: [{
                    name: '电能',
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(221, 164, 10, 0.3)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(221, 164, 10, 0)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#dda40a'
                        }
                    },
                    data: this.useElectricity,
                }, {
                    name: '冷水',
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(10, 221, 214, 0.3)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(10, 221, 214, 0)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#0addd6'
                        }
                    },
                    data: this.usecoldwater
                }, {
                    name: '热水',
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        normal: {
                            width: 1
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(235, 115, 78, 0.3)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(235, 115, 78, 0)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#eb734e"
                        }
                    },
                    data: this.usehotwater
                }]
            }
        }
    },
    mounted() {
        this.init();
    },
    watch: {
        usetrendDate() {
            this.init();
        },
        useElectricity() {
            this.init();
        },
        usecoldwater() {
            this.init();
        },
        usehotwater() {
            this.init();
        }
    },
    methods: {
        init() {
            this.option.xAxis[0].data = this.usetrendDate;
            this.option.series[0].data = this.useElectricity;
            this.option.series[1].data = this.usecoldwater;
            this.option.series[2].data = this.usehotwater;
            let echart = this.$echarts.init(this.$refs.usetrend);
            echart.setOption(this.option);
            window.addEventListener("resize", function () {
                echart.resize();
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.usetrend {
    width: 100%;
    height: 70vh;
}

@media all and (min-height:1080px) {
    .usetrend {
        height: 76vh;
    }
}
</style>
