<template>
  <el-select
    v-model="checked_value"
    placeholder="请选择"
    @change="change_select">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.Name"
      :value="item.Id">
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    value: {
      default:null
    },


    type:{
      type:String,
      default: ()=>{
        return null
      }
    },
    projectId:{
      type:String,
      default: ()=>{
        return null
      }
    },
  },
  data() {
    return {
      options: [],
      checked_value:"",
      id:this.projectId,
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
      this.$ajax.get(this.$Order+`/sys/Public/GetAllCate?cate=${this.type}&id=${this.id}`).then(res=>{
        this.options=res.data.Data;
      })
    },

  },
  watch:{
    // type(n){

    //   setTimeout(()=>{
    //     this.getList();
    //   },0)
    // },
    value(n){
      this.checked_value=n
    },
    projectId(n){
      if(n){
        this.id=n;
        this.getList();
      }
    }
  }
}
</script>
<style scoped>
.filter_span {
  font-size: 12px;
}
</style>
