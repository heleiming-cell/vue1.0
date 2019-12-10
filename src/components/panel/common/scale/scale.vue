<template>
  <div class="slider" ref="slider">
    <div class="process" :style="[{width},barStyle]"></div>
    <div class="thunk" ref="trunk" :style="{left}">
      <div class="tips">
        <span>{{process}}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
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
        ruleValue: this.value,     //当前值
        barStyle: {
          'background': this.leftBg
        }
      }
    },
    //渲染到页面的时候
    mounted () {
      this.slider = this.$refs.slider;
      this.thunk = this.$refs.trunk;
    },
    computed: {
      scale(){
        return (this.ruleValue - this.min) / (this.max - this.min);
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
    width: 85%;
    height: 15px;
    border-radius: 15px;
    border: 1px solid #2d313e;
    cursor: pointer
  }

  .slider .process {
    position: absolute;
    left: 0;
    top: 0;
    width: 112px;
    height: 15px;
    border-radius: 15px;
    background: #107ca8
  }

  .slider .thunk {
    position: absolute;
    left: 100px;
    top: -5px;
    width: 8px;
    height: 15px
  }

  .slider .tips {
    position: absolute;
    left: -7px;
    bottom: 10px;
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
