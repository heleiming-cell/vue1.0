<template>
  <div style="width: 100%;font-size: 0;">
    <span :style="span_style" class="filter_span">所在岗位</span>
    <el-select v-model="checked_value" placeholder="请选择" :style="styles" @change="change_select"  clearable>
      <el-option
        v-for="item in data_select"
        :key="item.ID"
        :label="item.Name"
        :value="item.ID"
      >
      </el-option>
    </el-select>

  </div>

</template>
<script>
  export default {
    props:{
      data_checked_value:{
        default:''
      },
      styles:{
        default:function(){
          return {
            width: '130px'
          }
        }
      },
      span_style:{
        default:function(){
          return {}
        }
      }
    },
    data(){
      return{
        data_select:[],
        checked_value:this.data_checked_value
      }
    },
    mounted(){
      this.pubSend('/user/ListPost',{
        KeyWord:'',
        Page:1,
        Size:100000
      },false).then(data =>{
        if(data.success){
        this.data_select = data.data
      }
    })
    },
    methods:{
      change_select(val){
        this.$emit('value',val)
      }
    }
  }
</script>
<style scoped>
  .filter_span{
    font-size: 12px;
  }
</style>
