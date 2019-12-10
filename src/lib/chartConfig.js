import echarts from 'echarts'
var base = +new Date(1968, 9, 3);
var oneDay = 24 * 3600 * 1000;
var date = [];

var data = [Math.random() * 300];

for (var i = 1; i < 20000; i++) {
  var now = new Date(base += oneDay);
  date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
 // data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
 data.push(0);
}
let dateHour = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00'];
class ChartOption {
  constructor() {
    this.option = {
      // backgroundColor: '#00264d',
      series: [
        /*仪表盘图，做中间刻度线*/
        {
          type: 'gauge',
          name: '业务指标',
          radius: '100%',
          startAngle: '0',
          endAngle: '-359.99',
          splitNumber: '80',
          pointer: {
            show: false
          },
          title: {
            show: false
          },
          detail: {
            show: false
          },
          data: [{
            value: 95,
            name: '完成率'
          }],
          axisLine: {
            lineStyle: {
              width: 20,
              opacity: 0
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            length: 5,
            lineStyle: {
              color: '#32538E',
              width: 2,
              type: 'solid',
            },
          },
          axisLabel: {
            show: false
          }
        },

        {
          name: 'pie',
          type: 'pie',
          clockWise: true,
          startAngle: 90,
          radius: ['80%', '90%'],
          hoverAnimation: false,
          center: ['50%', '50%'],
          data: [{
            value: 1,
            label: {
              normal: {
                formatter: '{d}%',
                position: 'center',
                show: false,
                textStyle: {
                  fontSize: '12',
                  fontWeight: 'normal',
                  color: '#fff'
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#f74369',
                shadowColor: '#f74369',
                shadowBlur: 10
              }
            }
          }, {
            value: 50,
            name: 'invisible',
            itemStyle: {
              normal: {
                color: 'rgba(247,67,105,0)', // 未完成的圆环的颜色
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              },
              emphasis: {
                color: 'rgba(44,59,70,1)' // 未完成的圆环的颜色
              }
            }
          }]
        }
      ]
    };
    this.outOption = {
      title: {
        x: "center",
        bottom: 20,
        subtext: 'PM2.5'
      },

      series: [{
        name: 'PM2.5',
        type: 'gauge',
        radius: '100%',
        min: 0,
        max: 300,
        axisLine: {
          show: true,
          lineStyle: {
            width: 15,
            shadowBlur: 0,
            color: [
              [0.12, '#7CBB55'], //E43F3D
              [0.25, '#9CD6CE'],
              [0.38, '#DDBD4D'],
              [0.83, '#E98E2C'],
              [1, '#E43F3D']

            ]
          }
        },
        axisTick: {
          show: true,
          splitNumber: 1
        },
        splitLine: {
          show: true,
          length: 15,
          lineStyle: {
            //color:'black'
          },
        },
        itemStyle: {
          opacity: 1
        },
        axisLabel: {
         
          textStyle: {
            fontSize: 12,
            fontWeight: ""
          }
        },
        pointer: {
          show: true,
        },
        detail: {
          //show:false,
          formatter: function (param) {
            var level = '';
            if (param < 35) {
              level = '优'
            } else if (param < 75) {
              level = '良'
            } else if (param < 115) {
              level = '轻度'
            } else if (param < 150) {
              level = '中度'
            } else if (param <= 250) {
              level = '重度'
            } else {
              level = '严重';
            }
            return level+':'+param;
          },
          offsetCenter: [0, 50],
          textStyle: {
            fontSize: 16
          }
        },
        data: [{
          name: "",
          value: Math.floor(105)
        }]
      }]
    }
    this.vocoption = {
      grid: {
        left: 30,
        right: 50,
        top: 50,
        bottom: 30,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: [],
        triggerEvent: true,
        splitLine: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            width: 2,
            color: 'rgba(255,255,255,.6)'
          },
         
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
          textShadowColor: '#000',
          textShadowOffsetY: 2,
          // interval:0,  
          // formatter:function(value)  
          // {  
          //     return value.split("").join("\n");  
          // }  
        }
      },
      yAxis: {
        name: '单位mg/m³',
        nameTextStyle: {
          color: '#fff',
          fontSize: 16,
          textShadowColor: '#000',
          textShadowOffsetY: 2
        },
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(255,255,255,.2)'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            width: 2,
            color: 'rgba(255,255,255,.6)'
          }
        },
        axisTick: {
          show: true
        },
        axisLabel: {
          color: '#fff',
          fontSize: 16,
          textShadowColor: '#000',
          textShadowOffsetY: 2
        }
      },
      series: [{
        data: [],
        type: 'line',
        symbol: 'circle',
        symbolSize: 12,
        color: '#FEC201',
        lineStyle: {
          color: "#03E0F2"
        },
        label: {
          show: true,
          position: 'top',
          textStyle: {
            color: '#FEC201',
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        areaStyle: {
          color: 'rgba(1,98,133,0.6)'
        }
      }, {
        type: 'pictorialBar',
        data: [],
        barGap: "10%",
        symbolRepeat: true,
        symbolMargin: 2,
        symbol: "rect",
        symbolSize: 1,
        color: '#03E0F2',
        symbolClip: true

      }]
    }
  }
}
class HistoryChartOption {
  constructor() {
    this.option = {
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        }
      },
      title: {
        left: 'center',
        text: '历史数据',
        show: false
      },
      // legend: {
      //   top: 'bottom',
      //   data: ['意向'],
      //   // show:false,
      // },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
         // saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date,
        axisLabel: {
          color: "white"
        },
        axisLine: {
          lineStyle: {
            color: "white"
          }
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        axisLabel: {
          color: "white"
        },
        axisLine: {
          lineStyle: {
            color: "white"
          }
        }
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10
      }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
      series: [{
        name: '历史数据',
        type: 'line',
        smooth: true,
        symbol: 'none',
        sampling: 'average',
        itemStyle: {
          normal: {
            color: 'rgb(255, 70, 131)'
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgb(255, 158, 68)'
            }, {
              offset: 1,
              color: 'rgb(255, 70, 131)'
            }])
          }
        },
        data: []
      }]
    };
  }
}
class RealChartOption {
  constructor() {
    this.option = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['','','','','','','',''],
        splitLine: {
          show: false,
          lineStyle: {
            color: "white"
          }
        },
        axisLabel: {
          color: "white"
        },
        axisLine: {
          lineStyle: {
            color: "white"
          }
        }
      },
      yAxis: {
        boundaryGap: [0, '50%'],
        type: 'value',
        axisLabel: {
          color: "white"
        },
        axisLine: {
          lineStyle: {
            color: "white"
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        }
      },
      series: [{
        name: '',
        type: 'line',
        smooth: true,
        symbol: 'none',
        stack: 'a',
        areaStyle: {
          normal: {}
        },
        data: [0,0,0,0,0,0,0,0]
      }]
    };
  }
}
class areaPieOption {
  constructor() {
    this.option = {
      title: {
        text: '总能耗',
        subtext: '0',
        subtextStyle: {
          fontSize: 20,
          padding: 20,
          color: '#84aef5'
        },
        x: 'center',
        y: '40%',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        top: '40%',
        right: '10%',
        itemGap: 10,
        // formatter: function (name) {
        //   return 'Legend ' + name;
        // },
        textStyle: {
          fontSize: 15,
          padding: [0, 0, 0, 4],
        },
        data: ['', '', '', '']
      },
      color: ['#15C7BD', '#E12F63', '#E24E30', '#DE741D', '#EEA341', '#44A0DA'],
      series: [{
        name: '能耗统计',
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['65%', '80%'],
        startAngle: 360,
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [{
            value: 0,
            name: ''
          },
          {
            value: 0,
            name: ''
          },
          {
            value: 0,
            name: ''
          },
          {
            value: 0,
            name: ''
          }
        ]
      }]
    };
  }
}

class areaBarOption {
  constructor() {
    this.option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },

      legend: {
        data: [],
        textStyle: {
          color: 'white'
        }
      },
      grid: {
        left: '10',
        top: '25',
        bottom: '10',
        right: '10',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: dateHour,
        axisPointer: {
          type: 'shadow'
        },
        axisLabel: {
          color: "white"
        },
      }],
      yAxis: [{
          type: 'value',
          // name:'单位：kwh',
          axisLabel: {
            color: 'white'
          },
          splitLine: {
            lineStyle: {
              color: '#999',
              type: 'dashed'
            }
          }
        },

      ],
      series: [{
          name: '',
          type: 'bar',
          itemStyle:{
              color:'#A0CE3A'
          },
          data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: '',
          type: 'bar',
          itemStyle:{
            color:'#2f4554'
        },
          data: [0, 0, 0, 0, 0, 0, 0, 0]
        },
      ]
    };
  }
}
class barOption {
  constructor() {
    this.option = {
      title:{
        text:'分项能耗趋势图',
        top:'10',
        left:'30',
        textStyle:{
          color:"#fff",
          fontSize:19,
          fontWeight:0
        }
      },
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: ['', '', '', '', '', '', ''],
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
      }],
      yAxis: [{
        type: 'value',
        // name: '单位（%）',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 14
          }
        },
        splitLine: {
          lineStyle: {
            color: '#57617B'
          }
        }
      }],
      series: [{
        name: '',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220]
      }]
    };
  }
}

class lineOption {
  constructor() {
    this.option = {
      // backgroundColor: '#394056',
      tooltip: {
        trigger: 'axis'
      },
      title:{
        text:'区域能耗趋势图',
        top:'10',
        left:'30',
        textStyle:{
          color:"#fff",
          fontSize:19,
          fontWeight:0
        }
      },
      grid: {
        left: '10',
        right: '10',
        bottom: '3%',
        containLabel: true
      },
      legend: {
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 5,
        itemGap: 13,
        data: [],
        left: 'center',
        textStyle: {
          fontSize: 12,
          color: '#F1F1F3'
        }
      },
      color:['#15b292','#5ab1ef','#fa6e86','rgb(137,189,27)','rgb(219,50,51)'],
      xAxis: [{
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        data: ['', '', '', '', '', '', '', '', '', '', '', '']
      }],
      yAxis: [{
        type: 'value',
        // name: '单位（%）',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 14
          }
        },
        splitLine: {
          lineStyle: {
            color: '#57617B'
          }
        }
      }],
      series: [
      
    ]
    };
  }
}
export {
  ChartOption,
  HistoryChartOption,
  RealChartOption,
  areaBarOption,
  areaPieOption,
  barOption,
  lineOption
};
