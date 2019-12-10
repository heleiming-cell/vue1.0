<template>
<div ref="myChart" class="barChart"></div>
</template>

<script>
export default {
    props: {

    },
    data() {
        var xdata = ['一栋', '二栋', '三栋', '四栋'];
        var legendData = ['开启', '关闭'];
        var dataArr = [20, 12, 31, 34];
        var dataArr2 = [10, 20, 5, 9];
        return {
            option: {
                backgroundColor: '#000',
                title: {
                    // text: '2016年12月长宁区合规成本分析'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: legendData,
                    align: 'right',
                    right: 10,
                    textStyle: {
                        color: '#fff'
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    axisLabel: {
                        textStyle: {
                            fontSize: 14,
                            color: '#fff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#597ef7',
                            width: 1
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    data: xdata
                }],
                yAxis: [{
                    type: 'value',
                    // name: '总价(万元)',
                    axisLabel: {
                        formatter: '{value}',
                        color: '#65F5FD',
                        fontSize: 14
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#1e2b54'
                        }
                    },
                }],
                series: [{
                    name: legendData[0],
                    type: 'bar',
                    barWidth: 34, //柱子宽度

                    itemStyle: {
                        normal: {
                            color: '#84ed76'
                        }
                    },
                    data: dataArr
                }, {
                    name: legendData[1],
                    type: 'bar',
                    barWidth: 34, //柱子宽度

                    itemStyle: {
                        normal: {
                            color: '#917bf7'

                        }
                    },
                    data: dataArr2
                }]
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
    height: 290px;
    margin: 0 auto;
}
</style>
