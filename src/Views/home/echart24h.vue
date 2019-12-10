<template>
<div :class="className" :style="{height:height,width:width}" />
</template>

<script>
require("echarts/theme/macarons"); // echarts theme
import tools from "./echarts-tooltip-carousel";
export default {
    props: {
        className: {
            type: String,
            default: "chart"
        },
        width: {
            type: String,
            default: "100%"
        },
        height: {
            type: String,
            default: "300"
        },
        time: {
            type: Array,
            default: []
        },
        // 普通
        general: {
            type: Array,
            default: []
        },
        // 严重
        severity: {
            type: Array,
            default: []
        },
        // 紧急
        urgency: {
            type: Array,
            default: []
        },
        chartData: {
            type: Object,
            default: function () {
                return {};
            }
        }
    },
    data() {
        return {
            chart: null
            //   xAxisData: [],
            //   seriesData: []
        };
    },
    mounted() {
        this.initChart();
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart = null;
    },
    methods: {
        initChart() {
            let _this = this;
            this.chart = this.$echarts.init(this.$el, "macarons");
            this.chart.showLoading({
                text: "loading",
                maskColor: "rgba(0,0,0,0.5)",
                color: "#11ab78",
                textColor: "#11ab78"
            });
            let bar = {
                color: ["#51665f"],
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        label: {
                            backgroundColor: "#204b7d"
                        },
                        lineStyle: {
                            color: "#11ab7878"
                        }
                    },
                    borderColor: "#2b80d3", //边框颜色
                    borderWidth: 1, //边框线宽
                    padding: 10
                },
                grid: {
                    top: "10px",
                    // left: 0,
                    // right: 0,
                    bottom: "20px"
                },
                xAxis: {
                    type: "category",
                    data: this.time,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: "#87bbf5"
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#1C1B1B"
                        }
                    }
                },
                yAxis: {
                    type: "value",
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisPointer: {
                        show: false
                    },
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: "#87bbf5"
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#1C1B1B"
                        }
                    }
                },
                series: [{
                        data: this.general,
                        name: "普通",
                        type: "line",
                        smooth: true,
                        areaStyle: {
                            color: "#254985"
                        },
                        symbol: "none"
                    },
                    {
                        data: this.severity,
                        name: "严重",
                        type: "line",
                        smooth: true,
                        areaStyle: {
                            color: "#254985"
                        },
                        symbol: "none"
                    },
                    {
                        data: this.urgency,
                        name: "紧急",
                        type: "line",
                        smooth: true,
                        areaStyle: {
                            color: "#254985"
                        },
                        symbol: "none"
                    }
                ]
            };
            this.chart.setOption(bar);

            this.chart.hideLoading();
            tools.loopShowTooltip(this.chart, bar, {
                loopSeries: true
            });
        }

    },
    watch: {
        time() {
            this.initChart();
        },
        general() {
            this.initChart();
        },
        severity() {
            this.initChart();
        },
        urgency() {
            this.initChart();
        }
    }
};
</script>
