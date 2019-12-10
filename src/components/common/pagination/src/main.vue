<template>
  <div class="gh-pagination">
    <div CLASS="gh-pagination-all" style="color: #6A91C5;font-size: 12px;position: absolute;left: 20px">共计: <span style="color: #FF8686">{{total}}</span>条数据</div>
    <div class="gh-pagination-btn" @click="appoint_page(1)">首页</div>
    <div class="gh-pagination-btn" @click="pre_page()" :style="current_page== 1?'cursor: not-allowed;':'cursor: pointer;'">上一页</div>
    <div class="gh-pagination-page" v-if="pre_more_page" @click="more_page('pre')">...</div>
    <div class="gh-pagination-page" @click="click_page(item)" v-for="item in pageNumber" :class="item==current_page?'active':''">{{item}}</div>
    <div class="gh-pagination-page" v-if="next_more_page" @click="more_page('next')">...</div>
    <div class="gh-pagination-btn" @click="next_page()" :style="current_page== allNumber?'cursor: not-allowed;':'cursor: pointer;'">下一页</div>
    <div class="gh-pagination-btn" @click="appoint_page(allNumber)">末页</div>
  </div>

</template>

<script>
  export default {
    name: 'GHpagination',
    props: {
      total:{
        default:Number
      },
      pageSize:{
        default:Number
      }

    },
    data(){
      return{
        pre_more_page:false,
        next_more_page:false,
        current_page:1,
        more_page_size:5
      }
    },
    computed:{
      pageNumber(){
        let allNumber = this.allNumber
        let arr = []

        this.pre_more_page = false
        this.next_more_page = false

        if (allNumber<=10){
          for (let i=1;i<=allNumber;i++){
            arr.push(i)
          }
        }else {


          if (this.current_page<=5){
            for (let i=1;i<=5;i++){
              arr.push(i)
              this.next_more_page = true
            }
          }
          else if (this.current_page>5 && this.current_page <= allNumber-4){
            this.pre_more_page = true
            this.next_more_page = true
            for (let i=this.current_page-3;i<=this.current_page+3;i++){
              arr.push(i)
            }
          }else {
            this.pre_more_page = true
            for (let i=this.current_page-3;i<=this.current_page+3;i++){
              if(i>allNumber){
                break
              }
              arr.push(i)
            }
          }
//          if (this.current_page>10 && this.current_page !== allNumber){
//
//            this.pre_more_page = true
//            this.next_more_page = true
//
//            for (let i=this.current_page-3;i<=this.current_page+3;i++){
////              if (i){}
//              arr.push(i)
//            }
//          }else {
//
//          }

        }



        return arr
      },
      allNumber(){
        return Math.ceil(this.total/this.pageSize)
      }
    },
    mounted(){

    },
    methods:{
      click_page(item){
        this.current_page = item
        this.$emit('current-change',this.current_page)
      },
      next_page(){
        let allNumber = this.allNumber

        if(this.current_page >= allNumber){
          this.current_page = allNumber
        }else {
          this.current_page ++
        }

        this.$emit('current-change',this.current_page)

      },
      pre_page(){
        if(this.current_page <= 1){
          this.current_page = 1
        }else {
          this.current_page--
        }

        this.$emit('current-change',this.current_page)
      },
      more_page(item){
        if(item == 'pre'){
          if (this.current_page - this.more_page_size<=1){
            this.current_page = 1
          }else {
            this.current_page = this.current_page - this.more_page_size
          }
        }else {
          if (this.current_page + this.more_page_size>=this.allNumber){
            this.current_page = this.allNumber
          }else {
            this.current_page = this.current_page + this.more_page_size
          }
        }

        this.$emit('current-change',this.current_page)

      },
      appoint_page(item){
        this.current_page = item

        this.$emit('current-change',this.current_page)
      }
    }
  };
</script>
<style scoped>
  .gh-pagination{
    height:30px;
    display: flex;
    width: 100%;
    text-align: center;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .gh-pagination>div{

    cursor: pointer;
  }
  .gh-pagination-page{
    width:28px;
    height:28px;
    border:1px solid rgba(31,64,131,1);
    line-height: 30px;
    text-align: center;
    margin: 0 5px;
  }
  .gh-pagination-page.active{
    background-color: rgba(31,64,131,1);
  }
  .gh-pagination-btn{
    width:70px;
    height:30px;
    line-height: 30px;
    text-align: center;
    background:rgba(31,64,131,1);
    margin: 0 10px;
  }
</style>
