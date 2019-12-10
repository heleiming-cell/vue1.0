<template>
  <el-select
    v-model="checked_value"
    placeholder="请选择"
    @change="change_select"
    filterable
    clearable
    >
    <el-option
      v-for="item in options"
      :key="item"
      :label="item"
      :value="item"
      
      >
    </el-option>
  </el-select>
</template>
<script>
import {Public_AllEnums} from '@/api/Public'
export default {
  props: {
    value: {
      default:null
    },


    cate:{
      type:String,
      default: ()=>{
        return 'TaskLevelEnums'
      }
    },


  },
  data() {
    return {
      options: [],
      checked_value: this.value,
    }
  },
  mounted() {
      this.getList()
  },
  methods: {
    change_select(val) {
      this.$emit('change', val)
    },
    getList(){
        Public_AllEnums().then(res=>{
            this.options = res.Data[this.cate]
        })
        //DateUnitEnums  时分秒
        //TaskLevelEnums  "一般", "紧急", "非常紧急"
        //WorkFlowActionEnums  "待处理", "发起", 
    },

  }
}
</script>
<style scoped>
.filter_span {
  font-size: 12px;
}
</style>
