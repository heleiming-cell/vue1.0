<template>
  <!-- 新建工单 -->
  <div class="tableScrollbar">
    <el-row class="newOrderContainer">
      <el-col class="new-date">
        <span>创建时间：</span>
         <el-date-picker
          v-model="date"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-button type="primary" @click="queryClick">查询</el-button>
      </el-col>
      <el-col class="table">
        <el-table :data="tableData" class="tableScrollbar">
          <el-table-column label="工单号" prop="Number" align="center"></el-table-column>
          <el-table-column label="故障描述" prop="Remark" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.Remark?scope.row.Remark:'--'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="CreateTime" align="center"></el-table-column>
          <el-table-column label="完成时间" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.CompleteTime?scope.row.CompleteTime:'--'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="examine(scope.row.Id)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col class="addOrder">
        <el-button size="small" type="primary" @click="dialogVisible=true">新建工单</el-button>
      </el-col>
      <el-col>
        <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="newgetList" />
      </el-col>
    </el-row>


    <el-dialog :visible.sync="dialogVisible"  width="35%" title="新建工单详情" center @close="closeDialog">
      <el-form :model="addForm" label-width="120px">
        <!-- <el-form-item label="工单类型:">
          <el-select v-model="addForm.type" @change="handleChange">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="设备类型:">
          <allSelect :type="devicetype" :value="addForm.devicetype" @change="deviceSelectChange"></allSelect>
        </el-form-item>
        <el-form-item label="区域：">
          <allSelect :type="type" :value="addForm.area" @change="selectChange"></allSelect>
        </el-form-item>
        <el-form-item label="故障描述：">
          <el-input
            type="textarea"
            :rows="10"
            placeholder="请输入内容"
            v-model="addForm.textarea"></el-input>
        </el-form-item>
        <el-form-item label="现场照片：" class="picture">
          <el-upload
            class="upload-demo"
            action=""
            :limit="10"
            list-type="picture-card"
            :file-list="fileList"
            :on-remove="removeFun"
            :before-upload="beforeAvatarUpload">
            <el-button size="mini" type="primary" class="upload">+</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagiNation from '@/components/common/pagination.vue'
import allSelect from '@/components/filter/AllSelect';
import datePicker from '@/components/filter/datePicker'
export default {
  components:{
    pagiNation,
    allSelect,
    datePicker
  },
  data(){
    return{
      date:"",
      dialogVisible:false,
      addForm:{
        type:"",
        textarea:"",
        area:"",
        devicetype:"",
      },
      type:"areacate",
      devicetype:"devicecate",
      options: ['维修工单','维保工单'],
      fileList:[],
      listQuery: {
        page: 1,
        limit: 10,
        total: 0,
      },
      fileData:[],
      formData:"",
      tableData:[],
      uploadAction:this.$Order+"/sys/Public/UpFile",
    }
  },
  methods:{
    getList(params){
      this.$ajax.post(this.$Order+`/sys/WorkFlow/QueryList`,params).then(res=>{
        this.listQuery.total=res.data.Data.Count;
        this.tableData=res.data.Data.Data;
      })
    },
    // 获取新建工单列表
    newgetList(){
      let params={
        page:this.listQuery.page,
        size:this.listQuery.limit,
        OrderBys:[
          {
            Sort:"CreateTime",
            Order:"Desc"
          }
        ],
        Conditions:[],
      }
      this.getList(params)
    },
    // *************上传文件**************
    beforeAvatarUpload(file) {
      this.formData = new FormData();
      this.formData.append("file", file);
      const config = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
      this.$ajax.post(this.$Order+`/sys/Public/UpFile`,this.formData,config).then(res=>{
        res.data.Data.forEach(element => {
          this.fileList.push({
            url:this.$Order+'/'+element,
            name:element
          })
          this.fileData.push(element)
        });
      }).catch((err)=>{
        this.$message.error(err.data.Message)
      })
    },
    // 新建工单
    addClick(){
      this.dialogVisible=false;
      let params={
        Type:1,
        TempletForm:"",
        TempletValue:"",
        AreaId:this.addForm.area,
        DeviceCategoryId:this.addForm.devicetype,
        DeviceId:"",
        Files:this.fileData,
        Remark:this.addForm.textarea,
      }
      this.$ajax.post(this.$Order+`/sys/WorkFlow/Add`,params).then(res=>{
        if(res.data.Success){
          this.$message.success(res.data.Message)
        }else{
          this.$message.warning(res.data.Message)
        }
         this.newgetList();
      }).catch((err)=>{
        this.$message.error(err.data.Message)
      })
    },
    // 工单类型下拉列表
    handleChange(val){
      this.addForm.type=val;
    },
    // 删除图片
    removeFun(file){
       this.$ajax.get(this.$Order+`/sys/Public/DelFile?fileName=${file.name}`).then(res=>{
        let index=this.fileData.indexOf(file.name)
        this.fileData.splice(index,1)
        this.fileList.splice(index,1)
      }).catch((err)=>{
        this.$message.error(err.data.Message)
      })
    },
    // 查看详情
    examine(id){
      this.$router.push({
        path:'/orderDetail',
        query:{
          id:id
        }
      })
    },
    // 区域下拉列表
    selectChange(val){
      this.addForm.area=val;
    },
    // 设备类型下拉列表
    deviceSelectChange(val){
      this.addForm.devicetype=val;
    },
    //查看
    queryClick(){
      let params={
        page:this.listQuery.page,
        size:this.listQuery.limit,
        OrderBys:[
          {
            Sort:"CreateTime",
            Order:"Desc"
          }
        ],
        Conditions:[
          {
            Key:"CreateTime",
            Operator:3,
            Value:this.date?this.$moment(this.date).format('YYYY-MM-DD HH:mm:ss'):'',
          },
          {
            Key:"CreateTime",
            Operator:5,
            Value:this.date?this.$moment(this.date).format('YYYY-MM-DD')+' 23:59:59':'',
          }
        ],
      }
      this.getList(params)
    },
    cancel(){
      this.dialogVisible=false;
      this.fileData=[];
       this.fileList=[];
    },
    closeDialog(){
      this.fileData=[];
      this.fileList=[];
      this.addForm.type="";
      this.addForm.devicetype="";
      this.addForm.area="";
      this.addForm.textarea="";
    },
  },
  mounted(){
    this.newgetList();
  }
}
</script>
<style lang="scss" scoped>
.tableScrollbar{
  height: calc(100% - 115px);
  font-size: 12px;
  padding: 10px;
}
.newOrderContainer{
  padding:19px 0 0 0;
  height: 100%;
  overflow: auto;
  .new-date{
    text-align: left;
    padding-bottom: 20px;
    span{
      color:#ffffff;
      padding-left: 15px;
    }
  }
  .addOrder{
    padding: 20px;
    text-align: right;
  }
}
.el-form-item{
  padding-bottom: 20px;
  margin-bottom: 0;
}
// .el-table {
//   height: 580px !important;
// }
</style>
