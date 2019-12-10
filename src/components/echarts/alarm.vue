<template>
<div ref="myChart" class="barChart"></div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            // option: {
            //     tooltip: {
            //         trigger: "item",
            //         formatter: "{a} <br/>{b}: {c} ({d}%)"
            //     },
            //     legend: {
            //         width: "70%",
            //         x: 'center',
            //         orient: 'horizontal',
            //         right: "0",
            //         bottom: "5%",
            //         padding: [5, 10],
            //         itemGap: 10,
            //         textStyle:{
            //           color:"#fff",
            //           padding:5,
            //         },
            //         data: ["普通告警", "火灾告警", "电流告警", "防盗告警", "设备告警","电压告警","门禁告警","故障告警","温度告警"]
            //     },
            //     series: [{
            //         name: "访问来源",
            //         type: "pie",
            //         radius: ["40%", "60%"],
            //         center: ['50%', '30%'],
            //         avoidLabelOverlap: false,
            //         label: {
            //             normal: {
            //                 // formatter: '{b}:{c}: ({d}%)',
            //                 show: false,
            //                 position: "center"
            //             },
            //             emphasis: {
            //                 show: true,
            //                 textStyle: {
            //                     fontSize: "30",
            //                     fontWeight: "bold"
            //                 }
            //             }
            //         },
            //         labelLine: {
            //             normal: {
            //                 show: false
            //             }
            //         },
            //         data: [{
            //                 value: 335,
            //                 name: "普通告警"
            //             },
            //             {
            //                 value: 310,
            //                 name: "火灾告警"
            //             },
            //             {
            //                 value: 234,
            //                 name: "电流告警"
            //             },
            //             {
            //                 value: 135,
            //                 name: "防盗告警"
            //             },
            //             {
            //                 value: 148,
            //                 name: "设备告警"
            //             },
            //             {
            //                 value: 158,
            //                 name: "电压告警"
            //             },
            //             {
            //                 value: 158,
            //                 name: "门禁告警"
            //             },
            //             {
            //                 value: 158,
            //                 name: "故障告警"
            //             },
            //             {
            //                 value: 158,
            //                 name: "温度告警"
            //             },
            //         ]
            //     }],
            // }
        };
    },
    mounted() {
     let option={
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            width: "100%",
            x: 'center',
            orient: 'horizontal',
            right: "0",
            bottom: "5%",
            itemGap: 6,
            textStyle:{
              color:"#fff",
              padding:5,
            },
            formatter: function(name) {
                // 获取legend显示内容
                let data = option.series[0].data;
                let total = 0;
                let tarValue = 0;
                for (let i = 0, l = data.length; i < l; i++) {
                    total += data[i].value;
                    if (data[i].name == name) {
                        tarValue = data[i].value;
                    }
                }
                let p = (tarValue / total * 100).toFixed(2);
                return name + ' ' + ' ' + p + '%';
            },
            data: ["普通告警", "火灾告警", "电流告警", "防盗告警", "设备告警","电压告警","门禁告警","故障告警","温度告警"]
        },
        series: [{
            name: "告警统计",
            type: "pie",
            radius: ["40%", "55%"],
            center: ['50%', '33%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: "center"
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: "30",
                        fontWeight: "bold"
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: [{
                    value: 335,
                    name: "普通告警"
                },
                {
                    value: 310,
                    name: "火灾告警"
                },
                {
                    value: 234,
                    name: "电流告警"
                },
                {
                    value: 135,
                    name: "防盗告警"
                },
                {
                    value: 148,
                    name: "设备告警"
                },
                {
                    value: 158,
                    name: "电压告警"
                },
                {
                    value: 158,
                    name: "门禁告警"
                },
                {
                    value: 158,
                    name: "故障告警"
                },
                {
                    value: 158,
                    name: "温度告警"
                },
            ]
        }],

      }
        // this.init();

      let echart = this.$echarts.init(this.$refs.myChart);
      echart.setOption(option);
      window.addEventListener("resize", function () {
          echart.resize();
      });
    },
    methods: {
        // init() {
        //     let echart = this.$echarts.init(this.$refs.myChart);
        //     echart.setOption(this.option);
        //     window.addEventListener("resize", function () {
        //         echart.resize();
        //     });
        // }
    }
};
</script>

<style lang="scss" scoped>
.barChart {
    width: 100%;
    height: 100%;
    margin: 0 auto;
}
</style>
