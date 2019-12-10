<template>
  <div :id="echart_id" :style="echart" ref="echart_id" class="echart"></div>
</template>
<script type="text/ecmascript-6">
  export default{
    props: {
//      最小值
      min: {
        type: Number,
        default: 0
      },
//      最大值
      max: {
        type: Number,
        default: 100
      },
//      当前值
      value: {
        type: Number,
        default: 0
      },
      // 高度
      height: {
        type: String,
        default: ''
      },
      // 宽度
      width: {
        type: String,
        default: ''
      },
//      是否显示刻度尺
      isShow: {
        type: Boolean,
        default: true
      },
//      textName
      textName: {
        type: String,
        default: ''
      },
//      表盘上显示的单位
      unit: {
        type: String,
        default: ''
      },

      bgColor1: {
        type: String,
        default: ''
      },
      bgColor2: {
        type: String,
        default: ''
      },
      bgColor3: {
        type: String,
        default: ''
      },

      echart_id: {
        type: String,
        default: ''
      }
    },
    data(){
      return {
        echart: {
          width: this.width,
          height: this.height
        },
        option: {
          tooltip: {
            trigger: 'item',
//            formatter: '{a} <br/>{b} : {c} %'
          }
          ,
          series: [
            {
              name: '仪表盘',
              type: 'gauge',
              data: [
                {
                  value: this.value,
                  name: this.textName
                }
              ],
              radius: '85%',
              center: ['50%', '50%'],
              min: this.min,
              max: this.max,
              splitNumber: 5,
              axisLine: {            // 坐标轴线
                show: true,
                lineStyle: {       // 属性lineStyle控制线条样式
                  width: 5,
                  color: [
                    [0.2, this.bgColor1],
                    [0.8, this.bgColor2],
                    [1, this.bgColor3]
                  ]
                }
              },
              axisTick: {            // 坐标轴小标记
                length: 5,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                  color: 'auto'
                }
              },
              splitLine: {           // 分隔线
                length: 10,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                  color: 'auto'
                }
              },
//              指针刻度值
              axisLabel: {
                show: this.isShow,   //是否显示
                color: '#666',
              },
              detail: {
                formatter: [
                  '{value} ' + (this.unit || ''),
                ].join('\n'),
                fontSize: 16,
                offsetCenter: [0, '85%']
              },
              title: {
                fontSize: 12,
                color: '#999',
                offsetCenter: [0, '55%']
              },
              pointer: {
                width: 2         // 指针大小
              }
            }
          ]
        }
      }
    },
    mounted(){
      this.$nextTick(()=> {
        let Tplate = this.$echarts.init(this.$refs.echart_id);
        Tplate.setOption(this.option)
      })
    },
    methods: {}
  }
</script>
<style scoped>
  .echart {
    margin: 0 auto;
  }
</style>
