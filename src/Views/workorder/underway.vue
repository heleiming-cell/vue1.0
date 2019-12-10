<template>
  <div class="underWay-Container">
    <myOrder :type="underway"></myOrder>
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
      underway:"underway"
    }
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
