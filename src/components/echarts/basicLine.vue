<template>
  <div ref="myChart" class="barChart"></div>
</template>
<script>
export default {
  data(){
    return{
      option:{
        xAxis: {
          type: 'category',
          data:['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00'],
          axisLine:{
            lineStyle:{
              color:'#0067FF',
              width:1,
            }
          },
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
          },
          axisLine:{
            lineStyle:{
              color:'#0067FF',
              width:1,
            }
          },
          splitLine: {
            show: true,
            lineStyle:{
                  color: ['#0A3981'],
                  width: 0.5,
                  type: 'dashed'
              }
          },
          max : 1500,
          min : 0,
          splitNumber : 9,
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320,880,690,1200,1230,1330,1240],
            type: 'line',
            color:['#1F51CF'],
            symbolSize: 10,//折点大小
            symbol: 'circle',
            itemStyle: {
              normal: {
                  color: "#1F51CF",
                  borderColor: '#79CCF8',
                  borderWidth: 1,
              }
            },
        }]
      }
    }
  },
  methods:{
    init() {
        let echart = this.$echarts.init(this.$refs.myChart);
        echart.setOption(this.option);
        window.addEventListener("resize", function () {
            echart.resize();
        });
    }
  },
  mounted(){
    this.init()
  }
}
</script>
<style lang="scss">
.barChart {
    width: 100%;
    // height: 500px;
    margin: 0 auto;
}
</style>
