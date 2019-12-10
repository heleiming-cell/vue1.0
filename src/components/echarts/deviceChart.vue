<template>
<div ref="myChart" class="barChart"></div>
</template>

<script>
export default {
    data() {
        return {
            option: {
                color: [
                    '#00F0FF'
                ],
                grid: {
                    left: '0%',
                    top: '2%',
                    right: '5%',
                    bottom: '0%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'value',
                    boundaryGap: [0, 1],
                    name: '',
                    axisLabel: {
                        color: '#7EA6F0'
                    },
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#1d5eae'
                        }
                    }
                }],
                yAxis: [{
                    type: 'category',
                    axisLabel: {
                        color: '#7EA6F0',
                        fontSize: '10'
                    },
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#1d5eae'
                        }
                    },
                    data: ['新风', '排风', '电梯', '给水', '排水', '照明']
                }],
                series: [{
                    name: '',
                    type: 'bar',

                    data: ['578', '890', '500', '570', '1200', '1000'],
                    itemStyle: {
                        normal: {
                            show: true,
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: "right",

                            textStyle: {
                                color: "#9EA7C4"
                            },
                        }
                    },
                    barGap: '0%',
                    barCategoryGap: '60%',
                }]
            },

        }
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
}
</script>

<style lang="scss" scoped>
.barChart {
    width: 100%;
    height: 215px;
    margin: 0 auto;
}
</style>
