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
      :key="item.Id"
      :label="item.Name"
      :value="item.Id"
      
      >
    </el-option>
  </el-select>
</template>
<script>
import {Templet_QueryList} from '@/api/Templet'
export default {
  props: {
    value: {
      default:null
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
        let data= {
            Page:1,
            Size:0,
            OrderBys:[],
            Conditions:[]
        }
        Templet_QueryList(data).then(res=>{
            this.options = res.Data.Data
        })
    },

  }
}
</script>
<style scoped>
.filter_span {
  font-size: 12px;
}
</style>
