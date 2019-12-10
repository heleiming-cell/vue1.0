<template>
<div class="slider" ref="slider">
    <div class="process" :style="[{width},barStyle]"></div>
    <div class="thunk" ref="trunk" :style="{left}">
        <div class="block"></div>
    </div>
    <div class="tips">
        <el-input v-model="percentage" class="progress-input"></el-input>
    </div>
</div>
</template>

<script>
import cmd from '@/lib/CMD'
export default {
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
            //   type: String,
            // default: ''
        },
        //      进度条已划过部分背景色
        leftBg: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: true
        },
        variable:{
            default:'',
        }
    },
    data() {
        return {
            slider: null, //滚动条DOM元素
            thunk: null, //拖拽DOM元素
            per: this.value, //当前值
            percentage: this.value,
            barStyle: {
                'background': this.leftBg
            }
        }
    },
    mounted() {
        this.slider = this.$refs.slider;
        this.thunk = this.$refs.trunk;
        var _this = this;
        this.thunk.onmousedown = function (e) {
            var width = parseInt(_this.width);
            var disX = e.clientX;
            document.onmousemove = function (e) {
                // value, left, width
                // 当value变化的时候，会通过计算属性修改left，width

                // 拖拽的时候获取的新width
                var newWidth = e.clientX - disX + width;
                // 拖拽的时候得到新的百分比
                var scale = newWidth / _this.slider.offsetWidth;
                _this.per = Math.ceil((_this.max - _this.min) * scale + _this.min);
                _this.per = Math.max(_this.per, _this.min);
                _this.per = Math.min(_this.per, _this.max);
                _this.percentage = parseInt(_this.scale * (_this.max-_this.min))
            }
            document.onmouseup = function () {
                document.onmousemove = document.onmouseup = null;
                if(_this.variable)
                {
                  cmd.write(_this,_this.variable,_this.percentage);
                }
            }
            return false;
        }
    },
    watch: {
        percentage(newValue) {
          if(newValue>this.max)
            newValue=this.max;
          else if(newValue<=this.min)
          {
            newValue=this.min;
          }
            this.per = parseFloat(newValue)
        },
        value(newValue){
           this.percentage=newValue;
        }
    },
    computed: {
        scale() {
            return (this.per - this.min) / (this.max - this.min);
        },
        width() {
            if (this.slider) {
                return this.slider.offsetWidth * this.scale + 'px';
            } else {
                return 0 + 'px'
            }
        },
        left() {
            if (this.slider) {
                return this.slider.offsetWidth * this.scale - this.thunk.offsetWidth / 2 + 'px';
            } else {
                return 10 + 'px'
            }
        }
    }
}
</script>

<style scoped>
.slider {
    position: relative;
    width: 85%;
    height: 5px;
    background: #21252e;
    border-radius: 5px;
    margin: 10px 0;
    cursor: pointer
}

.slider .process {
    position: absolute;
    left: 0;
    top: 0;
    width: 112px;
    height: 5px;
    border-radius: 5px;
    background: #029cae
}

.slider .thunk {
    position: absolute;
    left: 100px;
    top: -5px;
    width: 8px;
    height: 15px
}

.slider .block {
    width: 8px;
    height: 15px;
    border-radius: 8px;
    background: #434341;
    transition: .2s all
}

.slider .tips {
    position: absolute;
    right: -42px;
    bottom: -8px;
}

.tips /deep/ .el-input__inner {
    font-size: 12px;
    background: #000;
    border: 1px solid #000;
    color: #259594;
    text-align: center;
    height: 20px;
    line-height: 20px;
    padding: 0;
}

.tips /deep/ .el-input {
    width: 38px;
}
</style>
