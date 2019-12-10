<template>
  <div class="slider" ref="slider">
    <div class="process" :style="[{width},barStyle]"></div>
    <div class="thunk" ref="trunk" :style="{left}">
      <div class="block"></div>
      <div class="tips">
        <span>{{process}}</span>
        <i class="fas fa-caret-down"></i>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    props: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      value: {
        type: String,
        default: ''
      },
      leftBg: {
        type: String,
        default: ''
      }
    },
    data(){
      return {
        slider: null,        //滚动条DOM元素
        thunk: null,         //拖拽DOM元素
        per: this.value,     //当前值
        barStyle: {
          'background': this.leftBg
        }
      }
    },
    //渲染到页面的时候
    mounted () {
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
        }
        document.onmouseup = function () {
          document.onmousemove = document.onmouseup = null;
        }
        return false;
      }
    },
    computed: {
      // 设置一个百分比，提供计算slider进度宽度和trunk的left值
      // 对应公式为  当前值-最小值/最大值-最小值 = slider进度width / slider总width
      // trunk left =  slider进度width + trunk宽度/2
      scale(){
        return (this.per - this.min) / (this.max - this.min);
      },
      width(){
        if (this.slider) {
          return this.slider.offsetWidth * this.scale + 'px';
        } else {
          return 10 + 'px'
        }
      },
      left(){
        if (this.slider) {
          return this.slider.offsetWidth * this.scale - this.thunk.offsetWidth / 2 + 'px';
        } else {
          return 0 + 'px'
        }
      },
      process(){
        return parseInt(this.scale * 100)
      }
    }
  }
</script>

<style scoped>
  .slider {
    position: relative;
    margin: 20px 0;
    width: 100%;
    height: 5px;
    background: #21252e;
    border-radius: 5px;
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
    left: -7px;
    bottom: -20px;
    min-width: 15px;
    text-align: center;
    padding: 4px 8px;
    border-radius: 5px;
    color: #989b9b
  }

  .slider .tips i {
    position: absolute;
    margin-left: -5px;
    left: 50%;
    bottom: -9px;
    font-size: 12px;
    color: #000
  }

</style>
