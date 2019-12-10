<template>
<div ref="myChart" class="barChart"></div>
</template>

<script>
export default {
    props: {

    },
    data() {
        var value = 0.48;
        var data = [value, value, value, value, value, ];
        return {
            option: {
                graphic: [{
                    type: 'group',
                    left: 'center'
                }],
                series: [{
                    name:"",
                    type: 'liquidFill',
                    radius: '70%',
                    center: ['40%', '48%'],
                    data: data,
                    backgroundStyle: {
                        borderWidth: 5,
                        borderColor: '#1daaeb',
                        color: '#fff'
                    },
                    label: {
                        normal: {
                            formatter: (value * 100).toFixed(2) + '%',
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    }
                }]
            }
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.init();
        })

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
    height: 205px;
    margin: 0 auto;
}
</style>
