<template>
<div :id="echart_id" :style="echart" class="echart" ref="echart_id"></div>
</template>

<script>
export default {
    props: {
        // 刻度尺的最小值
        min: {
            type: Number,
            default: 0
        },
        // 刻度尺的最大值
        max: {
            type: Number,
            default: 100
        },
        // 当前值
        displayVal: {
            //  type: Number,
            default: 0,
        },
        // 当前显示名称
        textName: {
            type: String,
            default: ''
        },
        // 刻度尺中值的颜色
        valueColor: {
            type: String,
            default: '#00BAFF'
        },
        //      单位
        unit: {
            type: String,
            default: ''
        },
        echart_id: {
            type: String,
            default: ''
        },
        // 宽度
        width: {
            type: String,
            default: ''
        },
        // 高度
        height: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            echartobj: null,
            echart: {
                width: this.width,
                height: this.height
            },
            option: {
                series: [{
                        name: '刻度',
                        type: 'gauge',
                        radius: '100%',
                        min: this.min, //最小刻度
                        max: this.max, //最大刻度
                        splitNumber: 50, //刻度数量
                        startAngle: 220,
                        endAngle: -40,
                        // axisLine: {
                        //     show: true,
                        //     lineStyle: {
                        //         width: 1,
                        //         color: [
                        //             [1, 'rgba(0,0,0,0)']
                        //         ]
                        //     }
                        // }, //仪表盘轴线
                        axisLabel: {
                            show: false,
                            color: '#8A96A7',
                            distance: -20,
                        }, //刻度标签
                        // axisTick: {
                        //     show: true,
                        //     splitNumber: 10,
                        //     lineStyle: {
                        //         // color: '#fff',
                        //         width: 1,
                        //     },
                        //     length: -5
                        // }, //刻度样式
                        // splitLine: {
                        //     show: true,
                        //     length: -5,
                        //     lineStyle: {
                        //         color: '#8A96A7'
                        //     }
                        // }, //分隔线样式
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: [
                                    [1, '#494A4F']
                                ],
                                width: 10,
                                opacity: 1
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: true,
                            length: 10,
                            lineStyle: {
                                color: '#494A4F',
                                width: 3,
                                type: 'solid',
                            },
                        },
                        detail: {
                            show: false
                        },
                        pointer: {
                            show: false
                        }
                    },
                    {
                        type: 'gauge',
                        radius: '70%',
                        center: ['50%', '50%'],

                        splitNumber: 0, //刻度数量
                        startAngle: 225,
                        endAngle: -45,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 2,
                                color: [
                                    [
                                        0 / this.max, new this.$echarts.graphic.LinearGradient(
                                            0, 0, 1, 0, [{
                                                offset: 0,
                                                color: this.valueColor
                                            }, ]
                                        )
                                    ],
                                    [
                                        1, '#8A96A7'
                                    ]
                                ]
                            }
                        },
                        //分隔线样式。
                        splitLine: {
                            show: false,
                        },
                        axisLabel: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        pointer: {
                            show: false
                        },
                        title: {
                            show: true,
                            offsetCenter: [0, '100%'], // x, y，单位px
                            textStyle: {
                                color: '#E58B21',
                                fontSize: 16,
                            }
                        },
                        //仪表盘详情，用于显示数据。
                        detail: {
                            show: true,
                            offsetCenter: [0, '0'],
                            color: this.valueColor,
                            formatter: [
                                '{value} ' + (this.unit || ''),
                            ].join('\n'),
                            textStyle: {
                                fontSize: 16
                            }
                        },
                        data: [{
                            name: this.textName,
                            value: 0,
                        }]
                    }
                ]
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.echartobj = this.$echarts.init(this.$refs.echart_id);
            this.echartobj.setOption(this.option)
       })
    },
    watch: {
        displayVal: {
            handler: function (v1, v2) {
                let _this = this;
                if (this.echartobj) {
                    this.echartobj.setOption({
                        series: [{
                              axisLine: {

                                lineStyle: {
                                    // width: 2,
                                    color: [
                                        [
                                            _this.displayVal / _this.max, new this.$echarts.graphic.LinearGradient(
                                                0, 0, 1, 0, [{
                                                    offset: 0,
                                                    color: _this.valueColor
                                                }, ]
                                            )
                                        ],
                                        [
                                            1, '#8A96A7'
                                        ]
                                    ]
                                }
                            },
                        }, 
                        {
                            axisLine: {

                                lineStyle: {
                                    // width: 2,
                                    color: [
                                        [
                                            _this.displayVal / _this.max, new this.$echarts.graphic.LinearGradient(
                                                0, 0, 1, 0, [{
                                                    offset: 0,
                                                    color: _this.valueColor
                                                }, ]
                                            )
                                        ],
                                        [
                                            1, '#8A96A7'
                                        ]
                                    ]
                                }
                            },
                            data: [{
                                name: _this.textName,
                                value: _this.displayVal,
                            }]
                        }]
                    });
                }
            }
        }
    },
    // computed: {
    //     value() {
    //        let _this=this;
    //         if(this.echartobj)
    //         {
    //           this.echartobj.setOption({
    //             series:[{},{
    //               data: [{
    //                         name: _this.textName,
    //                          value: _this.displayVal,
    //                     }]
    //             }]
    //           });
    //         }
    //         return this.displayVal;
    //     }
    // },
    methods: {}
}
</script>

<style>
.echart {
    margin: 0 auto;
}
</style>
