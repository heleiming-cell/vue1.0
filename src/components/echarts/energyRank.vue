<template>
<div ref="energy_rank" class="energy_rank"></div>
</template>

<script>
export default {
    props: {
        energyRankData: {
            type: Array,
            default: []
        },
        energytopName: {
            type: Array,
            default: []
        },
        energyRankVal: {
            type: String,
            default: ""
        },
    },
    data() {
        return {
            option: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '0%',
                    right: '5%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 1],
                    "axisLabel": {
                        "interval": 0,
                        formatter: '{value}',
                        textStyle: {
                            color: "#fff" //X轴文字颜色
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#365472'
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    data: this.energytopName,
                    axisLabel: {
                        textStyle: {
                            color: "#fff" //文字颜色
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#365472"
                        }
                    }
                },
                series: [{
                    name: this.energyRankVal,
                    type: 'bar',
                    color: function (params) {
                        var colorList = ['#2eddc1', '#FCCE10', '#E87C25', '#27727B', '#9efdc6', '#f27C99', '#a27C99', '#27727B', '#ff5085', '#aa4ebf'];
                        return colorList[params.dataIndex]
                    },
                    data: this.energyRankData,
                    itemStyle: {
                        normal: {
                            show: true,
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "right",
                            formatter: "{c}Kw",
                            textStyle: {
                                color: "#9EA7C4"
                            },
                        }
                    },
                    barGap: '0%',
                    barCategoryGap: '60%',
                }]
            }
        }
    },

    mounted() {
        this.init();
    },
    watch: {
        energyRankData() {
            this.init();
        },
        energytopName() {
            this.init();
        },
        energyRankVal() {
            this.init();
        }
    },
    methods: {
        init() {
            this.option.series[0].data = this.energyRankData;
            this.option.series[0].name = this.energyRankVal;
            this.option.yAxis.data = this.energytopName;
            let echart = this.$echarts.init(this.$refs.energy_rank);
            echart.setOption(this.option);
            window.addEventListener("resize", function () {
                echart.resize();
            });
        }
    }
};
</script>

<style>
.energy_rank {
    width: 100%;
    height: 64vh;
}

@media all and (min-height:1080px) {
    .energy_rank {
        height: 70vh;
    }
}
</style>
