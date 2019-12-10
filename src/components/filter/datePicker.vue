<template>
<!-- 时间选择器 -->
  <div class="datePicker">
      <el-date-picker
        v-model="startTime"
        type="date"
        @change="startFun"
        value-format="yyyy-MM-dd"
        :picker-options="startDatePicker"
        placeholder="开始时间">
      </el-date-picker>
      <el-date-picker
        v-model="endTime"
        type="date"
        @change="endFun"
        value-format="yyyy-MM-dd"
        :picker-options="endDatePicker"
        placeholder="结束时间">
      </el-date-picker>
  </div>
</template>
<script>
export default {
  data(){
    return{
      startTime:"",//开始时间
      endTime:"",//结束时间
      startDatePicker:this.beginDate(),//开始时间范围
      endDatePicker:this.processDate(),//结束时间范围
    }
  },
  methods:{
    // 开始时间不得小于当天
    beginDate(){
      let self = this
      return {
        disabledDate(time){
        return time.getTime() > Date.now()
            }
          }
    },
    // 结束时间不得小于开始时间
    processDate(){
      let _this=this;
      return {
        disabledDate(time){
          if(_this.startTime){
            return new Date(_this.startTime).getTime() > time.getTime() || time.getTime() > Date.now()  //结束时间要大于开始时间或者现在时间
          }
        }
      }
    },
    startFun(time){
      this.$emit('startFun',time)
    },
    endFun(time){
      this.$emit('endFun',time)
    }
  }
}
</script>
<style  scoped>
.datePicker{
  display: inline;
}
</style>
