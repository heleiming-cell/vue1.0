<template>
<!-- 我的工单-挂起 -->
  <div  class="underWay-Container">
     <myOrder :type="hangUp"></myOrder>
  </div>
</template>
<script>
import myOrder from '@/components/common/myOrder'
export default {
  components:{
    myOrder
  },
  data(){
    return{
      hangUp:"hangUp"
    }
  },
  methods:{

  },
  mounted(){

  }
}
</script>
<style lang="scss" scoped>
.underWay-Container{
  height: calc(100% - 115px);
  font-size: 12px;
  padding: 10px;
}
</style>
