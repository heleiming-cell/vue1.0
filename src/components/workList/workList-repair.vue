<template>
  <div class="ghy-box">
    <div class="header">
      <span @click="click_menu('all')" :class="index=='all'?'acitve':''">我的工单</span>
      <span :class="index=='noComplete'?'acitve':''" @click="click_menu('noComplete')">未完成</span>
      <span :class="index=='Complete'?'acitve':''" @click="click_menu('Complete')">已完成</span>
    </div>
    <div class="filter">
      <div>
        <span>接单时间</span>
        <el-date-picker
          v-model="start_time"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div>
        <span>结束时间</span>
        <el-date-picker
          v-model="end_time"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <button class="search"> 查询</button>
    </div>
    <div class="list">
      <div class="list-head">
        <div>序号</div>
        <div>订单编号</div>
        <div>设备名称</div>
        <div>设备区域</div>
        <div>故障描述</div>
        <div>创建类型</div>
        <div>报修时间</div>
        <div>操作</div>
      </div>
      <div class="list-body">
        <div class="item">
          <div>序号</div>
          <div>订单编号</div>
          <div>设备名称</div>
          <div>设备区域</div>
          <div>故障描述</div>
          <div>创建类型</div>
          <div>报修时间</div>
          <div>
            <span  @click="open4">反馈</span>
          </div>
        </div>
        <div class="item">
          <div>序号</div>
          <div>订单编号</div>
          <div>设备名称</div>
          <div>设备区域</div>
          <div>故障描述</div>
          <div>创建类型</div>
          <div>报修时间</div>
          <div>
            <span  @click="open6">查看</span>
          </div>
        </div>
        <div class="item" style="border: none;justify-content: flex-end;align-items: center;height: 1rem">
          <button @click="open5">维修报警</button>
        </div>
      </div>
    </div>
    <el-dialog title="维修报警" :visible.sync="dialogFormVisible"  :modal-append-to-body="false" width="6rem" top="2rem">
      <div class="dialog_line">
        <span >反应人员:</span>
        <el-input style="width: 3.6rem"></el-input>
      </div>
      <div class="dialog_line">
        <span >联系电话:</span>
        <el-input style="width: 3.6rem"></el-input>
      </div>
      <div class="dialog_line">
        <span >故障地址:</span>
        <el-input style="width: 3.6rem"></el-input>
      </div>
      <div class="dialog_line">
        <span>故障设备:</span>
        <el-input style="width: 3.6rem"></el-input>
      </div>
      <div class="dialog_line" >
        <span style="vertical-align: top;">故障说明:</span>
        <el-input style="width: 3.6rem" type="textarea" autosize></el-input>
      </div>
      <div class="dialog_line">
        <span style="vertical-align: top;">上传照片:</span>
        <div class="photo"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center">
          <button class="dialog-footer-btn" @click="dialogFormVisible12 = false">确 定</button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="工单详情" :visible.sync="dialogFormVisible2"  :modal-append-to-body="false" width="6rem" top="1rem">
      <div style="margin: 0 auto;text-align: left">
        <div class="detail"><span>工单编号：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>接单时间：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>完成时间：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>维修时长：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>接单人员：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>工单状态：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>报警设备：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>维保周期：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>报警原因：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>设备区域：</span><span class="list_data">222222</span></div>
        <div class="detail" style="height: auto">
          <span style="vertical-align: top;">维修记录：</span>
          <div class="record" style="">
            <div>
              <div class="time">日期:2018-11-10   02:11：00</div>
              <div class="time">描述:报警</div>

              <div class="img">
                <img src="@/assets/logo.png" alt="">
                <img src="@/assets/logo.png" alt="">
                <img src="@/assets/logo.png" alt="">
                <img src="@/assets/logo.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center">
          <el-button type="primary" @click="dialogFormVisible2 = false">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="工单详情" :visible.sync="dialogFormVisible4"  :modal-append-to-body="false" width="6rem" top="1rem">
      <div style="margin: 0 auto;text-align: left">
        <div class="feedback">
          <input style="width: 100%" type="textarea" />
          <div class="upload"><span>上传照片</span><span>提交记录</span></div>
        </div>
        <div class="detail"><span>工单编号：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>接单时间：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>完成时间：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>维修时长：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>接单人员：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>工单状态：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>报警设备：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>维保周期：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>报警原因：</span><span class="list_data">222222</span></div>
        <div class="detail"><span>设备区域：</span><span class="list_data">222222</span></div>
        <div class="detail" style="height: auto">
          <span style="vertical-align: top;">维修记录：</span>
          <div class="record" style="">
            <div>
              <div class="time">日期:2018-11-10   02:11：00</div>
              <div class="time">描述:报警</div>

              <div class="img">
                <img src="@/assets/logo.png" alt="">
                <img src="@/assets/logo.png" alt="">
                <img src="@/assets/logo.png" alt="">
                <img src="@/assets/logo.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="text-align: center">
          <el-button type="primary" @click="dialogFormVisible4 = false">维修结束</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'WorkList-manager',
    data(){
      return {
        index:'all',
        start_time:'',
        end_time:'',
        options: [
          {
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
        value: '',
        dialogFormVisible4 :false,
        dialogFormVisible :false,
        dialogFormVisible2 :false,
        activeNames: ['1']
      }
    },
    methods:{

      click_menu(e){
        this.index = e
      },
      open4() {
        this.dialogFormVisible4  = true
      },open5() {
        this.dialogFormVisible  = true
      },
      open6() {
        this.dialogFormVisible2  = true
      }
    }
  };
</script>
<style>
  @import "../../static/css/common.css";
</style>
<style scoped lang="less" type="text/less">
  @htmlBg: #32475c;
  @basePx:100px;
  .px2rem(@name, @px){
  @{name}: @px;
  }
  .padding2rem(@name,@top,@left,@down,@right){
  @{name}: (@top / @basePx * 1rem)  (@left / @basePx * 1rem)   (@down / @basePx * 1rem) (@right / @basePx * 1rem);
  }
  .ghy-box{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    background-color: #030d21;
    font-size: 12px;

  .header{
    color: #00ffff;
    border-bottom: 1px solid #122d62;
  .px2rem(padding-top,99px);

  >span{
     display: inline-block;
     text-align: center;
     font-size: 16px;
     cursor: pointer;
   .px2rem(height,88px);
   .px2rem(width,120px);
   .px2rem(line-height,88px);

  &.acitve{
     color: white;
   }
  }
  }

  .filter{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  .px2rem(height,95px);

  >div{
     color: white;
     text-align: center;
   .px2rem(margin-left,35px);


  >span{
     font-size: 14px;
   .px2rem(margin-right,20px);

   }
  }

  button{
    background-color: #1f4083;
    border-radius: 5px;
    color: white;
    outline: none;
    border: none;
  .px2rem(margin-left,25px);
  .px2rem(height,50px);
  .px2rem(width,160px);
  }

  }

  .list{
    color: #658bbe;
    background-color: #051b47;
    margin: 0 auto;
    width: 98%;
  .px2rem(height,54px);

  .list-head{
    display: flex;
    height: 100%;

  >div{
     display: flex;
     align-items: center;
     justify-content: center;
     height: 100%;
     font-size: 14px;
     flex: 1;
   }
  }

  .list-body{
    width: 100%;

  .item{
    display: flex;
    border-bottom: 1px solid #122d62;
  .px2rem(height,69px);
  >button{
     border: none;
     outline: none;
     cursor: pointer;
     border-radius: 5px;
     background-color: #408f89;
     color: white;
   .px2rem(height,44px);
   .px2rem(width,145px);
   }
  >div{
     display: flex;
     align-items: center;
     justify-content: center;
     height: 100%;
     font-size: 14px;
     flex: 1;

  >button{
     border: none;
     outline: none;
     cursor: pointer;
     border-radius: 5px;
     letter-spacing: 5px;
     background-color: #1e639e;
     color: white;
   .px2rem(width,80px);
   .px2rem(height,30px);

   }
  >span{
     cursor: pointer;
   }
  }

  }
  }
  }

  }

  .detail{
    color: #4272d3;
    font-size: 14px;
  .px2rem(height,37px);
  .px2rem(line-height,37px);

  .list_data{
    color: white;
  }
  }


  .dialog_line{

    margin: 0px auto;text-align: left;
  .px2rem(margin-bottom,20px);
  .px2rem(padding-left,50px);


  >span{
       color: white;margin-right: 10px;
     }
   .photo{
     .px2rem(height,65px);
     .px2rem(width,65px);
     border: 1px solid #b6d0f4;
     display: inline-block;
     cursor: pointer;
   }
  }

  .dialog-footer-btn{
    cursor: pointer;
    .px2rem(height,54px);
    .px2rem(line-height,54px);
    .px2rem(width,180px);
    border: none;
    outline: none;
    border-radius: 5px;
    background-color: #1e639e;
    color: white;
  }

  .record{
    display: inline-block;
    .px2rem(width,400px);

    .time{
      color: white;
    }

    .img  {
      display: flex;
    .px2rem(height,70px);


    >img{
       flex: 1;
       height: 100%;
     }
    }
  }

  .feedback{
      position: relative;
      margin-bottom: 5px;

      >input{
        border: none;
        outline: none;
        color: white;
        background-color: transparent;
      }

      .upload{
        width: 100%;
        background-color: #0d2a64;
        color: white;
      .px2rem(height,50px);
      }

  }
</style>
