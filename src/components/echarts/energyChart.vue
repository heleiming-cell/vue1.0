<template>
  <div ref="myChart" class="barChart"></div>
</template>
<script>
export default {
  data() {
    return {
      option:{
        title: {
          text: '世界人口总量',
          subtext: '数据来自网络'
        },
        color: ['#3398DB'],
        tooltip: {},
        dataset: {
          source: [
            ["product", "2012", "2013", "2014", "2015"],
            ["Matcha Latte", 41.1, 30.4],
            // ["Milk Tea", 86.5, 92.1],
            // ["Cheese Cocoa", 24.1, 67.2]
          ]
        },
        xAxis: [
          {
            type: "category",
            gridIndex: 0 ,
            axisLabel: {
              textStyle: {
                  color: '#7ea6f0'
              }
            },
            lineStyle:{
              type:'dashed'
            },
          },
          {
            type: "category",
            gridIndex: 1 ,
            axisLabel: {
              textStyle: {
                  color: '#7ea6f0'
              }
            },
            lineStyle:{
              type:'dashed'
            },
           }
        ],
        yAxis: [
          {
            gridIndex: 0 ,
            axisLabel: {
                textStyle: {
                    color: '#7ea6f0'
                }
            }
          },
          { gridIndex: 1 ,
            axisLabel: {
                  textStyle: {
                      color: '#7ea6f0'
                  }
              }
          },

        ],
        grid: [{ left: "55%" }, { right: "55%" }],
        series: [
          // These series are in the first grid.
          { type: "bar", seriesLayoutBy: "row" },
          // { type: "bar", seriesLayoutBy: "row" },
          // { type: "bar", seriesLayoutBy: "row" },
          // These series are in the second grid.
          { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
          { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
          // { type: "bar", xAxisIndex: 1, yAxisIndex: 1 },
          // { type: "bar", xAxisIndex: 1, yAxisIndex: 1 }
        ],
        // legend:{
        //   show:false,
        // }
      }

    };
  },
  methods: {
    init() {
      let echart = this.$echarts.init(this.$refs.myChart);
      echart.setOption(this.option);
      window.addEventListener("resize", function() {
        echart.resize();
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss">
.barChart {
    width: 100%;
    // height: 600px;
    margin: 0 auto;
}
</style>
