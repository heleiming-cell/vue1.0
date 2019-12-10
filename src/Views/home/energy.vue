<template>
<div ref="myChart" class="barChart"></div>
</template>

<script>
export default {
    data() {
        return {
            option: {
                color: ["#006056", "#d87b0e", "#0e80df"],
                title: [{
                    text: "",
                    left: "1%",
                    top: "2%",
                    textStyle: {
                        color: "#ffd285"
                    }
                }],
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    top: "1%",
                    right: "4%",
                    textStyle: {
                        color: "#93bbfd"
                    },
                    data: ["水", "电", "气"]
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    top: "middle",
                    bottom: "3%",
                    height: "80%",
                    containLabel: true
                },
                toolbox: {
                    show: false,
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: "category",
                    axisLine: {
                        lineStyle: {
                            color: "#525252"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#93bbfd"
                        }
                    },
                    boundaryGap: false,
                    data: ["1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00"]
                },
                yAxis: {
                    axisLine: {
                        lineStyle: {
                            color: "#525252"
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#001f51"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#93bbfd"
                        }
                    },
                    type: "value"
                },
                series: [{
                        name: "水",
                        smooth: true,
                        type: "line",
                        symbolSize: 8,
                        symbol: "circle",
                        data: [190, 680, 69, 1050, 120, 582, 850]
                    },
                    {
                        name: "电",
                        smooth: true,
                        type: "line",
                        symbolSize: 8,
                        symbol: "circle",
                        data: [570, 350, 150, 387, 190, 980, 570]
                    },
                    {
                        name: "气",
                        smooth: true,
                        type: "line",
                        symbolSize: 8,
                        symbol: "circle",
                        data: [290, 200, 250, 132, 15, 200, 800]
                    }
                ]
            }
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
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
    height: 2.5rem;
    margin: 0 auto;
}
</style>
