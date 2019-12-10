<template>
  <div class="gh-list">
    <div class="gh-list-head">
      <div v-if="selection" class="gh-list-input"><input disabled="disabled" type="checkbox" class="input_check" :checked="all_checked" ><label @click="selectAll"></label></div>
      <div class="gh-list-title" v-for="(item,index) in columns">{{item.title}}</div>
    </div>
    <div class="gh-list-body" >
      <div class="item" v-for="item in data">
        <div v-if="selection" class="gh-list-input"><input disabled="disabled" type="checkbox" class="input_check"  :checked="checkbox_array.indexOf(item)>=0"><label @click="click_input(item)"></label></div>
        <div class="item-column" v-for="column in columns" v-if="column.type !=='expand' ">
          {{list_body(item,column)}}
        </div>
        <slot  v-for="column in columns" v-if="column.type =='expand'" :data="item"></slot>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'GHtable',
    props: {
      columns:Array,
      data:Array,
      selection:{
        default:false
      }

    },
    data(){
      return{
        checkbox_array:[],
        all_checked:false
      }
    },
    computed:{
//      all_checked(){
//        return
//      }
    },
    methods:{
      list_body(item,column){
        if (typeof item[column.key] == 'object'){
          return item[column.key][column.key_key]
        }else  if(
          typeof item[column.key] == 'undefined'
        ){
          return '--'
        }else  {
          return item[column.key]
        }


      },
      click_input(id){
        if(this.checkbox_array.indexOf(id)>-1){
          this.checkbox_array.splice(this.checkbox_array.indexOf(id),1)
        }else {
          this.checkbox_array.push(id)
        }

        if(this.checkbox_array.length == this.data.length){
          this.all_checked=true
        }else {
          this.all_checked=false
        }
        this.$emit('on-select',this.checkbox_array)

      },
      selectAll(){
      //  console.log(12315)
        if(this.all_checked){
          this.checkbox_array = []
          this.all_checked=false
        }else {
          this.checkbox_array = []

          for(let i=0;i<this.data.length;i++){
            this.checkbox_array.push(this.data[i])
          }
          this.all_checked=true
        }

        this.$emit('on-select',this.checkbox_array)

      },
      selectSwitch(s){
        this.all_checked = s
        this.selectAll()
      }
    }
  };
</script>
<style scoped>
  .gh-list{
    height: calc(100% - 250px);
    color: #658bbe;
    margin: 0 auto;
    width: 98%;
  }

  .gh-list-head{
    background-color: #051b47;

    height: 54px;
    display: flex;
  }
  .gh-list-head>div.gh-list-title{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 14px;
    flex: 1;
  }
  .gh-list-body {
    position: relative;
    max-height: calc(100% - 60px);
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
  }
  .gh-list-body .item{
    display: flex;
    border-bottom: 1px solid #122d62;
    height:58px;
  }
  .gh-list-body .item>div.item-column{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 14px;
    flex: 1;
  }
  .gh-list-body .item>div>button{
    border: none;
    outline: none;
    cursor: pointer;
    border-radius: 5px;
    letter-spacing: 5px;
    background-color: #1e639e;
    color: white;
    width: 80px;
    height: 30px;
  }
  .gh-list-body .item>div>span{
    cursor: pointer;
  }

.gh-list-input{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
}


  /*多选框*/
  .input_check {
    position: absolute;
    visibility: hidden;
  }

  .input_check + label {
    vertical-align: middle;
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 1px solid RGB(158, 217, 255);
    position: relative;
  }

  .input_check:checked + label:after {
    content: "";
    position: absolute;
    left: 1px;
    /* top: 50%; */
    width: 6px;
    height: 4px;
    border: 2px solid RGB(158, 217, 255);
    border-top-color: transparent;
    border-right-color: transparent;
    -webkit-transform: rotate(-60deg);
    transform: rotate(-45deg);
  }

</style>
