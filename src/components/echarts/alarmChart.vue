<template>
<div ref="myChart" class="barChart"></div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            option: {
                color: ["#4DE0FF", "#4DFF8F", "#ADFF4D"],
                tooltip: {
                    trigger: "item",
                    formatter: "{b}: {c} ({d}%)"
                },

                legend: {
                    orient: "vertical",
                    top: "13%",
                    left: "50%",
                    itemWidth: 9,
                    itemHeight: 7,
                    data: ["消防告警", "设备告警", "手动告警"],
                    textStyle: {
                        color: "#fff"
                    }
                },
                series: [{
                        name: "手动告警",
                        type: "pie",
                        clockWise: false,
                        hoverAnimation: false,
                        center: ["50%", "50%"],
                        selectedMode: "single",
                        radius: ["20%", "30%"],
                        label: {
                            show: false
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        color: "#ffba00",
                        data: [{
                                value: 170,
                                name: "手动告警"
                            },
                            {
                                value: 437,
                                name: "",
                                itemStyle: {
                                    color: "rgba(0,0,0,0)",
                                    borderWidth: 0
                                },
                                tooltip: {
                                    show: false
                                },

                            }
                        ]
                    },
                    {
                        name: "设备告警",
                        clockWise: false,
                        hoverAnimation: false,
                        type: "pie",
                        center: ["50%", "50%"],
                        radius: ["40%", "50%"],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        label: {
                            show: false
                        },
                        color: "#79ccf8",
                        data: [{
                                value: 100,
                                name: "设备告警"
                            },
                            {
                                value: 137,
                                name: "",
                                itemStyle: {
                                    color: "rgba(0,0,0,0)",
                                    borderWidth: 0
                                },
                                tooltip: {
                                    show: false
                                }
                            }
                        ]
                    },
                    {
                        name: "消防告警",
                        clockWise: false,
                        hoverAnimation: false,
                        type: "pie",
                        center: ["50%", "50%"],
                        radius: ["60%", "70%"],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        label: {
                            show: false
                        },
                        color: "#376bcb",
                        data: [{
                                value: 380,
                                name: "消防告警"
                            },
                            {
                                value: 137,
                                name: "",
                                itemStyle: {
                                    color: "rgba(0,0,0,0)",
                                    borderWidth: 0
                                },
                                tooltip: {
                                    show: false
                                }

                            }
                        ]
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

<style lang="scss" scoped>
.barChart {
    width: 100%;
    height: 215px;
    margin: 0 auto;
}
</style>
