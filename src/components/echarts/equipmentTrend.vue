<template>
<div ref="myChart" class="barChart"></div>
</template>

<script>
export default {
  props:{
    echartDate:{
      type: Array,
      default () {
        return;
      }
    },
    echartColor:{
      type: Array,
      default () {
        return;
      }
    },
    echartSeries:{
      type: Array,
      default () {
        return;
      }
    },
    echartTitle:{
      type: String,
      default () {
        return;
      }
    },
    legend:{
      default () {
        return;
      }
    },
    yAxisMax:{
      type: Number,
      default () {
        return;
      }
    },
    splitNumber:{
      type: Number,
      default () {
        return;
      }
    }
  },
  data() {
        return {
            option: {
                color: this.echartColor,
                title:{
                  text:this.echartTitle,
                  left:'center',
                  textStyle:{
                    color:'#00A7FE',
                    fontSize:20,
                  }
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend:this.legend,
                grid: {
                    left: '2%',
                    right: '2%',
                    top: '16%',
                    bottom: '6%',
                    containLabel: true
                },
                toolbox: {
                    "show": false,
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#c0576d'
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#7ea6f0'
                        }
                    },
                    boundaryGap: false,
                    data:this.echartDate
                },
                yAxis: {
                    scale : true,
                    max : this.yAxisMax,
                    min : 0,
                    splitNumber : this.splitNumber,
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#062543'
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#7ea6f0'
                        }
                    },
                    type: 'value'
                },
                series:this.echartSeries,
            }
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
    height: 300px;
    margin: 0 auto;
}
</style>
