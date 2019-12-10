<template>
<div ref="myChart" class="barChart"></div>
</template>

<script>
export default {
    props: {
        proportion: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            option: {
                series: [{
                    color: ["#00ccff", "#0c254b"],
                    type: 'pie',
                    radius: ['80%', '90%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    silent: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '24'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                            value: this.proportion,
                            name: this.proportion,
                            label: {
                                normal: {
                                    textStyle: {
                                        fontSize: '28'
                                    }
                                }
                            },
                        },
                        {
                            value: this.proportion,
                            label: {
                                normal: {
                                    textStyle: {
                                        fontSize: '20',
                                        color: '#999',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
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
            this.option.series[0].data[0].value = this.proportion;
            this.option.series[0].data[0].name = this.proportion + '%';
            this.option.series[0].data[1].value = (100 - this.proportion);
            let echart = this.$echarts.init(this.$refs.myChart);
            echart.setOption(this.option);
            window.addEventListener("resize", function () {
                echart.resize();
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.barChart {
    width: 100%;
    height: 100px;
    margin: 0 auto;
}
</style>
