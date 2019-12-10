<template>
  <div class="radio-box">
    <div v-for="(item,index) in tabs"
         :key="index"
         :class="{active:isActive == index}"
         @click="OnClickRadio(index)">
      <img :src="isActive==index ? item.srcAc :item.src" alt="">
      <div>{{item.name}}</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default{
    data(){
      return {
        isActive: 0,
        tabs: [
          {
            name: '夏季',
            src: require('./images/summer11.svg'),
            srcAc: require('./images/summer1.svg'),
          }, {
            name: '冬季',
            src: require('./images/winter22.svg'),
            srcAc: require('./images/winter2.svg'),
          }, {
            name: '通风',
            src: require('./images/ventilate33.svg'),
            srcAc: require('./images/ventilate3.svg'),
          }, {
            name: '除湿',
            src: require('./images/arefaction44.svg'),
            srcAc: require('./images/arefaction4.svg'),
          }, {
            name: '智能',
            src: require('./images/brainpower5.svg'),
            srcAc: require('./images/brainpower55.svg'),
          }
        ]
      }
    },
    methods: {
      OnClickRadio(num){
        this.isActive = num;
        this.$emit('setMode',num);
      }
    }
  }
</script>
<style scoped>
  .radio-box {
    display: flex;
  }

  .radio-box > div {
    flex: 1;
    cursor: pointer;
  }

  .active {
    color: #13D3D1;
  }
</style>
