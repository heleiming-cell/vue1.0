<template>
  <div class="ghy-box">
    <div class="header">
      <span style="color: #325fb8"><i class="iconfont icon-shouye"></i>工单中心></span><span style="color:#08abff;">派单中心</span>
    </div>
    <div class="filter">
      <div class="filter-line" v-for="item in queryState" :class="workList_State == item ?'active':''" @click="click_tab(item)">{{item}}</div>
      <div class="filter_line">
        <span>创建时间</span>
        <el-date-picker
          v-model="select_date_value"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:230px">
        </el-date-picker>
      </div>
      <div class="filter_line">
        <button class="search" @click="search"> 查询</button>
      </div>
      <div class="filter_line" style="position: absolute;top:50%;right: 30px;transform: translate(0,-50%)">
        <button>导入工单</button>
      </div>

    </div>
    <gh_table :columns="columns" :data="equipment_list">
      <template slot-scope="scope">
        <div class="facilities-methods item-column">
          <span @click="click_dispatch" style="width: auto;margin-right: 20px;cursor: pointer"><button>派单</button></span>

          <span title="详情" @click="click_detail(scope)"><i class="iconfont icon-xiangqing"></i></span>
          <!--<span class="qrcode_span"><i class="iconfont icon-qr-code"  @mouseenter = "produce_QRCode(scope)" @mouseout = "close_QRCode"></i></span>-->
        </div>
      </template>
    </gh_table>
    <div class="box-btn">
      <button @click="click_newWarning">新建工单</button>
      <button style="background-color: #1F58A6">一键派单</button>
    </div>
    <el-dialog title="工单详情"  :visible.sync="dialog_workList_detail" :modal-append-to-body="false" width="557px" top="200px">
      <div class="dialog-box">
        <div class="dialog-line"><span>工单类型:</span><span>{{data_dialog.Type}}</span></div>
        <div class="dialog-line"><span>创建人:</span><span>{{data_dialog.CreateUser.Name}}</span></div>
        <div class="dialog-line"><span>发生时间:</span><span>{{data_dialog.CreateUser.Date}}</span></div>
        <div class="dialog-line"><span>工单状态:</span><span>{{data_dialog.State}}</span></div>
        <div class="dialog-line"><span>设备地址:</span><span>{{data_dialog.AreaName}}</span></div>
        <div class="dialog-line"><span>工单描述:</span><span>{{data_dialog.Describe}}</span></div>
        <div class="dialog-button">
          <button @click="dialog_workList_detail = false">确定</button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="派单"  :visible.sync="dialog_workList_dispatch" :modal-append-to-body="false" width="557px" top="200px">
      <div class="dialog-box">
        <div class="dialog-line">
          <span style="line-height: 40px;text-align: center;">维修人员</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="dialog-button">
          <button @click="click_newWarning_submit">确定</button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="新建工单" v-if="dialog_workList_new" :visible.sync="dialog_workList_new" :modal-append-to-body="false" width="557px" top="200px">
      <div class="dialog-box">
        <div class="dialog-line">
          <select-DeviceArea @value="select_deviceArea" :styles="{width:'300px'}" :span_style="{width:'20%',display:'inline-block'}"></select-DeviceArea>
        </div>
        <div class="dialog-line"><span>详细地址:</span><el-input style="width: 300px" v-model="data_dialog_newWarning.AreaAddress" placeholder="请输入内容"></el-input></div>
        <div class="dialog-line"><span>情况描述:</span><el-input style="width: 300px"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="data_dialog_newWarning.Describe">
        </el-input></div>
        <div class="dialog-line"><span>现场照片:</span><el-upload
          action=""
          :http-request="http_request"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog></div>
        <div class="dialog-button">
          <button @click="click_newWarning_submit">确定</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import gh_table from '../../components/common/table'
  import pagination from '../common/pagination'
  export default {
    name: 'WorkList-manager',
    components:{
      gh_table,
      pagination
    },
    data(){
      return {
        //列表
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
            key: 'CreateUser',
            key_key:'Date'
          },
          {
            title: '工单描述',
            key: 'Describe'
          },{
            title: '工单状态',
            key: 'State'
          },{
            title: '维修人员',
            key: 'TakeUser'
          },
          { type:'expand',
            title: '操作'
          }
        ],
        //面板显示
        dialog_workList_detail:false,
        dialog_workList_new:false,
        dialog_workList_dispatch:false,
        //新建工单
        workList_new_address:'',
        workList_new_time:'',
        workList_new_describe:'',
        dialogImageUrl: '',
        dialogVisible: false,
        //创建时间
        equipment_date_value:'',
        //维修人员
        options: [
          {
          value: '1',
          label: '维修人员1'
        }, {
          value: '2',
          label: '维修人员2'
        }, {
          value: '3',
          label: '维修人员3'
        }, {
          value: '4',
          label: '维修人员4'
        }, {
          value: '5',
          label: '维修人员5'
        }],
        value: '',
        index:'all',
        start_time:'',
        end_time:'',
        queryState: ["全部工单", "待派单", "已派单", "已完成"],
        //工单状态
        workList_State:'全部工单',
        month_options:[
          {
            value: '1',
            label: '1月'
          }, {
            value: '2',
            label: '2月'
          }, {
            value: '3',
            label: '3月'
          }, {
            value: '4',
            label: '4月'
          }, {
            value: '5',
            label: '5月'
          }, {
            value: '6',
            label: '6月'
          }, {
            value: '7',
            label: '7月'
          }, {
            value: '8',
            label: '8月'
          }, {
            value: '9',
            label: '9月'
          }, {
            value: '10',
            label: '10月'
          }, {
            value: '11',
            label: '11月'
          }, {
            value: '12',
            label: '12月'
          }],
        year_options:[
          {
            value: '2018',
            label: '2018年'
          },{
            value: '2017',
            label: '2017年'
          },{
            value: '2016',
            label: '2016年'
          },{
            value: '2015',
            label: '2015年'
          },
        ],
        month_options_value: '',
        year_options_value: '',
        repair_man_value: '',
        list_data:[
          {
            num:1,
            order_num:1,
            repair_name:"维修人员",
            repair_num:1,
            repair_time:1,
            repair_percent:'30%'
          }
        ],
        //新增
        equipment_list:[],
        total:'',
        currentPage:1,
        select_date_value:[],//选中的时间
        //工单详情
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
        //新建工单
        data_dialog_newWarning:{
          DeviceNo:'',
          DeviceName:'',
          AreaCode:'',
          AreaName:'',
          AreaAddress:'',
          Describe:'',
        },
        data_newWarning_AttachmentList:[]
      }
    },
    computed:{
      repair_man(){
        return this.$store.state.app.repair_man
      }
    },
    mounted(){
      this.get_equipment_list()
    },
    methods:{
      get_equipment_list() {
        var StartDate
        var EndDate
        if (this.select_date_value){
          StartDate = this.select_date_value[0]
          EndDate = this.select_date_value[1]
        }else {
          StartDate = ''
          EndDate = ''
        }
        this.pubSend('/sheet/Query',{
          State:this.workList_State,
          AreaID:'',
          StartDate:StartDate,
          EndDate:EndDate,
          Keyword:'',
          Page:this.currentPage,
          Size:10
        },false).then(data =>{
          if(data.success){
          this.equipment_list = data.data || []
          this.total = data.count
        }
      })
      },
      //查询
      search(){
        this.get_equipment_list()
      },
      //点击tab
      click_tab(item){
        this.workList_State = item
        this.get_equipment_list()
      },
      //点击详情
      click_detail(item){
        this.data_dialog = item.data
        this.dialog_workList_detail = true
      },
      //新增工单
      click_newWarning(){
        this.dialog_workList_new = true
        this.data_newWarning_AttachmentList = []
      },
      //新增工单-确定
      click_newWarning_submit(){
        let Required= {
          Describe:'',
          AreaCode:'',
          AreaName:'',
        }//必传的参数

        console.log(this.data_dialog_newWarning)

        for (let key in Required) {

          if(this.data_dialog_newWarning[key] == '' || this.data_dialog_newWarning[key] =='undefined'){
            console.log(this.data_dialog_newWarning[key])
            this.alert_warning(key)
            return
          }
        }

        this.pubSend('/sheet/NewWarning',{
          DeviceNo:this.data_dialog_newWarning.DeviceNo,
          DeviceName:this.data_dialog_newWarning.DeviceName,
          AreaCode:this.data_dialog_newWarning.AreaCode,
          AreaName:this.data_dialog_newWarning.AreaName,
          AreaAddress:this.data_dialog_newWarning.AreaAddress,
          Describe:this.data_dialog_newWarning.Describe,
          AttachmentList:this.data_newWarning_AttachmentList
        },true).then(
          data =>{
              if(data.success){
                this.$message({
                  type: 'success',
                  message: '新增工单！'
                })
                this.dialog_workList_new = false
                this.get_equipment_list()
              }
          }
        )
      },
      //点击派单
      click_dispatch(){
        this.dialog_workList_dispatch = true
      },
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
          this.data_newWarning_AttachmentList.push(data.data)
        }
      }
      )
      },
      //新增工单选择区域
      select_deviceArea(val){

        this.pubSend('/device/GetDeviceArea',{},false).then(data =>{
          if(data.success){
          console.log(data.data)
          for(let i=0;i<data.data.length;i++){
            if (data.data[i].ID == val ){
              this.data_dialog_newWarning.AreaName = data.data[i].Name

            }
          }
        }
      })

        this.data_dialog_newWarning.AreaCode = val
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  };
</script>
<style scoped lang="less" type="text/less">
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
  .dialog-button{
    margin-top: 50px;
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
  /*弹框*/
  .dialog-box{
    padding:0 20px;
  }
  .dialog-line{
    margin-bottom: 30px;
    height: auto;
    display: flex;
    color: #B8C4DC;

    >span{
        width: 20%;
       display: flex;
       justify-content: flex-start;
       align-items: center;
     }

  }
  /*底部按钮*/
  .box-btn{
    padding-right: 50px;
    width: calc(100% - 50px);
    text-align: right;
    height:44px;
    >button{
        cursor: pointer;
       width:146px;
       height:44px;
       border-radius:5px;
       border: none;
       outline: none;
       color: white;
        background-color: #408F89;
        margin-left: 20px;
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

   button{
     color: white;
     border: none;
     outline: none;
     background-color: #1F58A6;
     border-radius:5px;
     width: 50px;
     height: 30px;
   }

  >i{
     font-size: 16px;
   }
  }
  }

  .filter_line{

    >button{
       cursor: pointer;
       color: white;
       outline: none;
       border: none;
       width:146px;
       height:44px;
       background:rgba(31,88,166,1);
       border-radius:5px;
     }
  }

</style>
