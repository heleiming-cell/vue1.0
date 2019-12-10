<template>
  <div class="ghy-box">

    <div class="header">
      <span style="color: #325fb8"><i class="iconfont icon-shouye"></i>工单中心></span><span style="color:#08abff;">我的工单</span>
    </div>
    <div class="filter">
      <div class="filter-line" v-for="item in queryState" :class="workList_State==item?'active':''" @click="click_tab(item)">{{item}}</div>
    </div>

    <!--<div class="list"></div>-->
    <gh_table :columns="columns" :data="equipment_list">
      <template slot-scope="scope">
        <div class="facilities-methods item-column">
          <span @click="click_receipt(scope.data.ID)" title="接单" v-if="scope.data.MineState =='待接单' " style="width: 28px"><i class="iconfont icon-zhengchangshebei" style="font-size: 28px"></i></span>
          <span @click="click_slip(scope.data.ID)" title="转单" v-if="scope.data.MineState == '进行中'"><i class="iconfont icon-zhuanzailiang"></i></span>
          <span @click="click_detail(scope)" title="详情"><i class="iconfont icon-xiangqing"></i></span>
          <!--<span class="qrcode_span"><i class="iconfont icon-qr-code"  @mouseenter = "produce_QRCode(scope)" @mouseout = "close_QRCode"></i></span>-->
        </div>
      </template>
    </gh_table>
    <pagination @current-change="handleCurrentChange" :page-size="10"  :total="total" v-if="equipment_list.length>0"></pagination>


    <el-dialog title="工单详情" :visible.sync="dialog_workList_show" :modal-append-to-body="false" width="575px">
      <div v-if="workList_State == '进行中'" style="padding:10px;background:#051B47">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 8}" v-model="data_feedback_Describe" placeholder="" style="width:100%"></el-input>

        <div class="flex" style="padding-top:10px">
          <div class="flexitem smupload">
            <el-upload ref="feeduploads" action=""  :http-request="http_request" :limit=3 :multiple=true list-type="picture-card" :on-success="handleSuccessFeedBack" :on-preview="handlePictureCardPreview" :on-remove="handleRemoveFeedBack">
              <div slot="trigger">
                <i class="el-icon-picture"></i>
              </div>
            </el-upload>
          </div>
          <el-button type="text" @click="feedback(data_dialog.ID)">提交记录</el-button>
        </div>
      </div>
      <div style="padding:10px 20px;color:#FEFEFE;overflow-y: scroll">
        <div class="dialog-line"><span class="blue">工单编号:</span><span>{{data_dialog.Code}}</span></div>
        <div class="dialog-line"><span class="blue">接单时间:</span><span>{{data_dialog.TakeUser.Date}}</span></div>
        <div class="dialog-line"><span class="blue">工单状态:</span><span>{{data_dialog.MineState}}</span></div>
        <div class="dialog-line"><span class="blue">报警设备:</span><span>{{data_dialog.DeviceName}}</span></div>
        <div class="dialog-line"><span class="blue">报警原因:</span><span>{{data_dialog.Describe}}</span></div>
        <div class="dialog-line"><span class="blue">设备区域:</span><span>{{data_dialog.AreaName}}</span></div>
        <div class="dialog-line"><span class="blue" style="vertical-align: top;">维保记录:</span>
          <div style="display: inline-block;width: 300px">
            <div class="dialog-record" v-for="item in data_dialog_record">
              <div class="info"><span>{{item.CreateUser.Date}}</span><span style="float: right">{{item.Describe}}</span></div>
              <div class="picture">
                <img :src="item_pic.FileUrl" alt="" v-for="item_pic in item.AttachMentList">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-button">
        <button @click="dialog_workList_show = false">确定</button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogs.preview" title="预览" :modal-append-to-body="false">
      <img width="100%" :src="dialogImageUrl" alt="图片预览">
    </el-dialog>

  </div>
</template>

<script>
  import gh_table from '../../components/common/table'
  import pagination from '../common/pagination'

  export default {
    name: "WorkList-manager",
    components:{
      gh_table,
      pagination
    },
    data() {
      return {
        columns:[
          {
            title: '工单编号',
            key: 'Code'
          },
          {
            title: '工单类型',
            key: 'Type'
          },
          {
            title: '工单发起人',
            key: 'CreateUser',
            key_key:'Name'

          },
          {
            title: '发生时间',
            key: 'EquipmentName'
          },
          {
            title: '工单描述',
            key: 'Describe',
          },{
            title: '工单状态',
            key: 'MineState'
          },
          { type:'expand',
            title: '操作'
          }
        ],
        queryState: ["全部工单", "待接单", "进行中", "已完成"],
        //工单详情
        dialog_workList_show:false,
        //工单状态
        workList_State:'全部工单',

        queryDto: {
          takeTimeRange: [],
          doneTimeRange: [],
          AreaName: "",
          From: "",
          TakeStartTime: "",
          TakeEndTime: "",
          DoneStartTime: "",
          DoneEndTime: "",
          Page: 1,
          Size: 10
        },
        newDto: {
          OrderType: "告警工单",
          Reason: "",
          AreaName: "",
          DeviceName: "",
          DeviceNo: "",
          PersonNo: "00001",
          PersonName: "tangbo",
          TakePersonNo: "",
          TakePersonName: "",
          AttachmentList: []
        },
        feedDto: {
          PersonNo: "00001",
          PersonName: "tangbo",
          Describe: "",
          AttachmentList: [],
          OrderNo: ""
        },
        sendDto: {
          OrderNo: "",
          PersonNo: "00001",
          PersonName: "tangbo",
          SendPersonNo: "",
          SendPersonName: ""
        },
        quertResult: [{
          OrderNo:221,
          AreaName:'维修',
          CategoryName:'张三',
          EquipmentName:'2018-08-24 09:32',
          Model:'维修电表',

        }],

        dialogs: {
          new: false,
          info: true,
          send: false,
          preview: false
        },

        dialogImageUrl: '',

        areanamelist: [
          {
          value: "南区",
          label: "南区"
        },
          {
          value: "北区",
          label: "北区"
        }],
        fromtypelist: [
          {
          value: "自动",
          label: "自动"
        }, {
          value: "手工",
          label: "手工"
        }],
        total: 0,
        submiting: false,
        infoDto: null,
        currentPage:1,
        //新加参数
        equipment_list:[],
        data_dialog: {
          "ID": '',
          "Code": "",
          "DeviceCode": "",
          "DeviceName": "",
          "AreaCode": "正常",
          "AreaName": "",
          "Describe": '',
          "State": "",
          "Type": "",
          "From": "",
          "CreateUser": {},
          "SendUser":{},
          "TakeUser":{},
          "FinishUser": {},
        },
        data_dialog_record:[],//维修记录
        data_feedback_AttachmentList:[],//反馈的图片
        data_feedback_Describe:'',//反馈的内容
      }
    },
    computed: {
      repair_man() {
        return this.$store.state.app.repair_man
      },
      common_url(){
        return this.$URL
      }
    },
    mounted() {
      this.get_equipment_list()
    },
    methods: {
      //上传图片
      http_request(param){
        console.log(param)
        var fileObj = param.file;
        var form = new FormData();
        // 文件对象
        form.append("file", fileObj);
        this.pubSend('/sheet/Upload',form,true,true).then(
          data =>{
            if (data.success){
              this.data_feedback_AttachmentList.push(data.data)
            }
          }
        )
      },
      //点击tab
      click_tab(item){
        this.workList_State = item
        this.get_equipment_list()
      },
      //显示工单详情
      click_detail(item){
        console.log(item)
        this.data_dialog = item.data
        this.workList_State = this.data_dialog.MineState
        this.dialog_workList_show = true
        this.data_dialog_record = []

        this.pubSend('/sheet/FeedBack',{
          SheetID:item.data.ID,
          Skip:0,
          Size:10
        },false).then(data =>{
           if(data.success){
             this.data_dialog_record = data.data
           }
        })
      },
      //转单
      click_slip(id) {
        this.$prompt('请输入转单原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
//          this.$message({
//          type: 'success',
//          message: '转单成功！'
//        });
          this.pubSend('/sheet/ReturnSheet',{
          SheetID:id,
          Describe:value
        },true).then(data =>{
          if(data.success){
              this.$message({
              type: 'success',
              message: '转单成功！'
            });
          this.get_equipment_list()

        }else {
          this.$message.error(data.errmsg)
          }
        })
      })
      },
      click_receipt(id){
        this.$confirm('是否接单?', '接单确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            console.log('确定')
            this.pubSend('/sheet/ReceiveSheet',{
              ID:id
            },true).then(data =>{
              if(data.success){
                this.$message({
                  type: 'success',
                  message: '接单成功！'
                });
              this.get_equipment_list()

             }else {
                this.$message.error(data.errmsg)
              }
            })
        }).catch(() => {
          console.log('取消')

        });
      },

      handlePictureCardPreview(file) {
        console.log(file)
        console.log('handlePictureCardPreview')
//        this.dialogImageUrl = file.url;
//        this.dialogs.preview = true;
      },
      handleSuccessFeedBack(response, file, filelist) {
        if (response.success) {
          console.log('handleSuccessFeedBack')
          console.log(response)
//          this.feedDto.AttachmentList.push({
//            no: response.data.no,
//            url: response.data.url,
//            name: response.data.name,
//            uid: file.uid
//          })
        }
      },
      handleRemoveFeedBack(file, fileList) {
        console.log('handleRemoveFeedBack')
        console.log(file)
//        this.feedDto.AttachmentList = this.feedDto.AttachmentList.filter(x => {
//            return x.uid != file.uid
//          })
      },
      feedback(id) {
        this.pubSend('/sheet/NewFeedBack',{
          SheetID:id,
          Describe:this.data_feedback_Describe,
          AttachmentList:this.data_feedback_AttachmentList
        },true).then(data =>{
          if (data.success){
            this.$message({
              showClose: true,
              message: '提交成功!',
              type: 'success'
            })
            this.dialog_workList_show = false
            this.get_equipment_list()
          }
        })
      },
      get_equipment_list() {
        this.pubSend('/sheet/Mine',{
          State:this.workList_State,
          Page:this.currentPage,
          Size:10
        },false).then(data =>{
          if(data.success){
          this.equipment_list = data.data || []
          this.total = data.count
        }
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.get_equipment_list()
      },
    }
  }
</script>

<style lang="less" scoped>

.filter-line{
  height: 100%;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #14C5D4;
  cursor: pointer;
  font-size: 14px;

  &.active{
      color: white;
   }
}

.dialog-line{
  height: 40px;
  line-height: 40px;

  >span{
    display: inline-block;
    width: 300px;

    &.blue{
      width: 100px;
      color: #4372D2;
    }
  }
}


.dialog-record{
  border-bottom: 1px solid #234676;
}
.dialog-record .picture{
  /*display: flex;*/
  /*flex-direction: column;*/
  text-align: left;
  padding-top: 5px;
}

.dialog-record .picture img{
  width: 80px;
  height: 50px;
}
.dialog-button{
  margin-top: 30px;
  text-align: center;

>button{
   cursor: pointer;
   width:188px;
   height:54px;
   background:rgba(30,99,158,1);
   border-radius:4px 4px 4px 4px;
   color: white;
   border: none;
   outline: none;
   font-size: 14px;
 }
}

/*操作*/
.facilities-methods{
  display: flex;
  color: #17B2E5;
  justify-content: center;
  align-items: center;

>span{
   width: 20px;
   margin: 0 5px;

>i{
   font-size: 16px;
 }
}
}
  /*.ghy-box {*/
    /*padding-bottom: 98px;*/
    /*padding-top: 98px;*/
    /*padding-left: 20px;*/
    /*padding-right: 20px;*/
    /*font-size: 14px;*/
  /*.header {*/
  /*>span {*/
     /*display: inline-block;*/
     /*text-align: center;*/
     /*font-size: 16px;*/
     /*cursor: pointer;*/
     /*color: #00ffff;*/
     /*height: 88px;*/
     /*width: 120px;*/
     /*line-height: 88px;*/
  /*&.acitve {*/
     /*color: white;*/
   /*}*/
  /*}*/
  /*}*/
  /*.filter {*/
    /*border-top: 1px solid #20355c;*/
    /*padding-top: 22px;*/
    /*padding-left: 14px;*/
    /*padding-right: 14px;*/
  /*}*/
  /*.list {*/
  /*.pagination {*/
    /*padding: 14px 0;*/
  /*}*/
  /*}*/
  /*.dialogbtns {*/
    /*text-align: center;*/
    /*padding-top: 20px*/
  /*}*/
  /*.feedhis {*/
    /*margin-bottom: 5px;*/
    /*padding: 10px;*/
    /*background: #051B47;*/
    /*border-radius: 4px;*/
  /*}*/
  /*.feedhis p {*/
    /*padding-bottom: 10px;*/
  /*}*/
  /*.feedwho{*/
    /*color: #CCC;*/
    /*font-size: 12px*/
  /*}*/
  /*}*/

  /*// @htmlBg: #32475c;*/
  /*// @basePx: 100px;*/
  /*// .px2rem(@name, @px) {*/
  /*//   @{name}: @px;*/
  /*// }*/
  /*// .padding2rem(@name,@top,@left,@down,@right) {*/
  /*//   @{name}: (@top / @basePx * 1rem) (@left / @basePx * 1rem)*/
    /*//     (@down / @basePx * 1rem) (@right / @basePx * 1rem);*/
  /*// }*/
  /*// .ghy-box {*/
     /*//   width: 100%;*/
     /*//   height: 100%;*/
     /*//   position: fixed;*/
     /*//   top: 0;*/
     /*//   left: 0;*/
     /*//   z-index: 9;*/
     /*//   background-color: #030d21;*/
     /*//   font-size: 12px;*/
  /*//   .header {*/
       /*//     color: #00ffff;*/
       /*//     border-bottom: 1px solid #122d62;*/
       /*//     .px2rem(padding-top,99px);*/
  /*//     > span {*/
           /*//       display: inline-block;*/
           /*//       text-align: center;*/
           /*//       font-size: 16px;*/
           /*//       cursor: pointer;*/
           /*//       .px2rem(height,88px);*/
           /*//       .px2rem(width,120px);*/
           /*//       .px2rem(line-height,88px);*/
  /*//       &.acitve {*/
            /*//         color: white;*/
            /*//       }*/
  /*//     }*/
  /*//   }*/
  /*//   .filter {*/
       /*//     display: flex;*/
       /*//     justify-content: flex-start;*/
       /*//     align-items: center;*/
       /*//     width: 100%;*/
       /*//     .px2rem(height,95px);*/
  /*//     > div {*/
           /*//       color: white;*/
           /*//       text-align: center;*/
           /*//       .px2rem(margin-left,35px);*/
  /*//       > span {*/
             /*//         font-size: 14px;*/
             /*//         .px2rem(margin-right,20px);*/
             /*//       }*/
  /*//     }*/
  /*//     button {*/
         /*//       background-color: #1f4083;*/
         /*//       border-radius: 5px;*/
         /*//       color: white;*/
         /*//       outline: none;*/
         /*//       border: none;*/
         /*//       .px2rem(margin-left,25px);*/
         /*//       .px2rem(height,50px);*/
         /*//       .px2rem(width,160px);*/
         /*//     }*/
  /*//   }*/
  /*//   .list {*/
       /*//     color: #658bbe;*/
       /*//     background-color: #051b47;*/
       /*//     margin: 0 auto;*/
       /*//     width: 98%;*/
       /*//     .px2rem(height,54px);*/
  /*//     .list-head {*/
         /*//       display: flex;*/
         /*//       height: 100%;*/
  /*//       > div {*/
             /*//         display: flex;*/
             /*//         align-items: center;*/
             /*//         justify-content: center;*/
             /*//         height: 100%;*/
             /*//         font-size: 14px;*/
             /*//         flex: 1;*/
             /*//       }*/
  /*//     }*/
  /*//     .list-body {*/
         /*//       width: 100%;*/
  /*//       .item {*/
           /*//         display: flex;*/
           /*//         border-bottom: 1px solid #122d62;*/
           /*//         .px2rem(height,69px);*/
  /*//         > div {*/
               /*//           display: flex;*/
               /*//           align-items: center;*/
               /*//           justify-content: center;*/
               /*//           height: 100%;*/
               /*//           font-size: 14px;*/
               /*//           flex: 1;*/
  /*//           > button {*/
                 /*//             border: none;*/
                 /*//             outline: none;*/
                 /*//             cursor: pointer;*/
                 /*//             border-radius: 5px;*/
                 /*//             letter-spacing: 5px;*/
                 /*//             background-color: #1e639e;*/
                 /*//             color: white;*/
                 /*//             .px2rem(width,80px);*/
                 /*//             .px2rem(height,30px);*/
                 /*//           }*/
  /*//           > span {*/
                 /*//             cursor: pointer;*/
                 /*//           }*/
  /*//         }*/
  /*//       }*/
  /*//     }*/
  /*//   }*/
  /*// }*/
  /*// .detail {*/
     /*//   color: #4272d3;*/
     /*//   font-size: 14px;*/
     /*//   .px2rem(height,37px);*/
     /*//   .px2rem(line-height,37px);*/
  /*//   .list_data {*/
       /*//     color: white;*/
       /*//   }*/
  /*// }*/
  /*// .record {*/
     /*//   display: inline-block;*/
     /*//   .px2rem(width,400px);*/
  /*//   .time {*/
       /*//     color: white;*/
       /*//   }*/
  /*//   .img {*/
       /*//     display: flex;*/
       /*//     .px2rem(height,70px);*/
  /*//     > img {*/
           /*//       flex: 1;*/
           /*//       height: 100%;*/
           /*//     }*/
  /*//   }*/
  /*// }*/
</style>
