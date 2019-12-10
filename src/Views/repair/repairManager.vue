<template>
<div class="box">
    <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
            <el-button @click="clickType(1)" :type="Type==1?'primary':''" size="mini">待受理</el-button>
            <el-button @click="clickType(2)" :type="Type==2?'primary':''" size="mini">待维修</el-button>
            <el-button @click="clickType(3)" :type="Type==3?'primary':''" size="mini">已完成</el-button>
            <el-button @click="clickType(4)" :type="Type==4?'primary':''" size="mini">我报修</el-button>
        </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="gridData" element-loading-text="Loading" fit @sort-change="sortChange">
        <el-table-column property="DeviceName" label="设备名称"></el-table-column>
        <el-table-column property="CreateTime" label="报修时间"></el-table-column>
        <el-table-column label="完成时间">
            <template slot-scope="scope">
                {{ scope.row.CompleteTime!=null?scope.row.CompleteTime:'--' }}
            </template>
        </el-table-column>
        <el-table-column property="State" label="状态"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="modifyData(scope.row)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="button-btn">
        <el-button type="primary" @click="addNewData" style="position: absolute;right: 20px;" size="medium">新增报修</el-button>
    </div>
    <el-pagination :page-size="listQuery.limit" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>

    <el-dialog title="报修详情" :visible.sync="dialogVisible" v-if="dialogVisible" :append-to-body="true" center>
        <div style="height:500px;overflow-y: scroll;">
            <el-form :model="workorder">
                <el-form-item label="发起人:">
                    <span>{{workorder.CreaterName}}</span>
                </el-form-item>
                <el-form-item label="发起时间:">
                    <span>{{workorder.CreateTime}}</span>
                </el-form-item>
                <el-form-item label="报修设备:" v-if="workorder.DeviceInfo">
                    <el-button type="text" size="small" @click="deviceData(workorder.DeviceInfo)">{{workorder.DeviceInfo.Name}}</el-button>
                </el-form-item>
                <el-form-item label="报修内容:">
                    <span>{{workorder.Content.join(',')}}</span>
                </el-form-item>
                <el-form-item label="状态:">
                    <span>{{workorder.State}}</span>
                </el-form-item>
                <el-timeline>
                    <el-timeline-item :timestamp="item.CreateTime" placement="top" v-for="(item,index) in workorder.DetailList" :key="index" :color="item.CompleteTime?'#0bbd87':''">
                        <el-card>
                            <h4>{{item.UserName}}--{{item.Action}}</h4>
                            <p>备注信息：{{item.Remark}}</p>
                            <div style="height: 100px;" v-if="item.AttachmentList.length>0">
                                <enlargeimg :data="item.AttachmentList"></enlargeimg>
                            </div>

                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="eventsAction('受理')" v-if="workorder.IsAccept ">受理</el-button>
            <el-button @click="eventsAction('转交')" v-if="workorder.IsDeliver ">转交</el-button>
            <el-button @click="eventsAction('提交')" v-if="workorder.IsSubmit ">提交</el-button>
            <el-button @click="eventsAction('拒绝')" v-if="workorder.IsRefuse ">拒绝</el-button>
            <el-button @click="eventsAction('上报')" v-if="workorder.IsUp">上报</el-button>
            <el-button @click="eventsAction('评价')" v-if="workorder.IsAppraise ">评价</el-button>
        </div>
    </el-dialog>
    <el-dialog  title="设备详情" :visible.sync="dialogVisible_device" v-if="dialogVisible_device" :append-to-body="true" center>
        <el-form :model="DeviceInfo">
            <el-form-item label="设备名称:">
                <span>{{DeviceInfo.Name}}</span>
            </el-form-item>
            <el-form-item label="设备类型:">
                <span>{{DeviceInfo.CategoryName}}</span>
            </el-form-item>
            <el-form-item label="维护部门:">
                <span>{{DeviceInfo.DepartmentName}}</span>
            </el-form-item>
            <el-form-item label="所属区域:">
                <span>{{DeviceInfo.AreaName}}</span>
            </el-form-item>
            <el-form-item label="安装地址:">
                <span>{{DeviceInfo.Address}}</span>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible_device = false">关 闭</el-button>
        </div>
    </el-dialog>
    <el-dialog  :title="submitData.Action==3?'转交操作':'上报操作'" :visible.sync="dialogVisible_people" v-if="dialogVisible_people" :append-to-body="true" center>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="备注信息:">
                <el-input v-model="peopleRemark" placeholder="请输入内容"></el-input>
            </el-form-item>
        </el-form>
        <el-table ref="peopleTable" :data="peopleData" border fit highlight-current-row style="width: 100%" @current-change="handleSelectionChange">
            <el-table-column label="操作" width="55">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.checked"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column align="center" property="Name" label="姓名"></el-table-column>
            <el-table-column align="center" property="DeviceName" label="电话"></el-table-column>
        </el-table>
        <!-- <pagination v-show="total_p>0" :total="total_p" :page.sync="listQuery_p.page" :limit.sync="listQuery_p.limit" @pagination="getList" /> -->
        <div slot="footer" class="dialog-footer">
            <el-button @click="()=>{dialogVisible_people = false;peopleId = '';peopleRemark= ''}">关 闭</el-button>
            <el-button @click="submitPeople" type="primary">确 定</el-button>
        </div>
    </el-dialog>

    <el-dialog  title="提交操作" :visible.sync="dialogVisible_submit" v-if="dialogVisible_submit" :append-to-body="true" center width="600px">
        <el-form label-width="100px">
            <el-form-item label="描述信息:">
                <el-input type="textarea" v-model="submitRemark" rows="2"></el-input>
            </el-form-item>
            <el-form-item label="图片:">
                <el-upload :headers="loadingHeaders" :action="loadingUrl" :on-success="uploadSuccess" :on-error="uplodError" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="changeFile" :file-list="fileList">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog  :visible.sync="pic_dialogVisible" :append-to-body="true" title="图片信息" center>
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitDescribe">提交</el-button>
        </div>
    </el-dialog>
    <el-dialog  title="新增报修" :visible.sync="dialogVisible_add" v-if="dialogVisible_add" :append-to-body="true" center>
        <el-form class="demo-form-inline" :label-width="'120px'">
            <el-form-item label="设备名称:">
                <el-input type="input" v-model="addData.name"></el-input>
            </el-form-item>
            <el-form-item label="所在区域:">
                <AllCateTree :type="'area'" :data_checked_value="addData.area" @value="selectAllCate" :filterable="true" />
            </el-form-item>
            <el-form-item label="设备类型:">
                <AllCateTree :type="'deviceCate'" :data_checked_value="addData.area" @value="selectAllCate_deviceCate" :filterable="true" />
            </el-form-item>
            <el-form-item label="巡检内容:" v-if="checkList.length>0">
                <el-checkbox-group v-model="addData.checkList">
                    <el-checkbox :label="item" v-for="(item,index) in checkList" :key="index"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="备注信息:">
                <el-input type="textarea" v-model="addData.remark" rows="2"></el-input>
            </el-form-item>
            <el-form-item label="图片:">
                <el-upload :headers="loadingHeaders" :action="loadingUrl" :on-success="uploadSuccess" :on-error="uplodError" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="changeFile" :file-list="fileList">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog  :visible.sync="pic_dialogVisible" :append-to-body="true" title="图片信息" center>
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible_add = false">关 闭</el-button>
            <el-button type="primary" @click="submit_add">提 交</el-button>
        </div>
    </el-dialog>

    <el-dialog  title="报修评价" :visible.sync="dialogVisible_raise" v-if="dialogVisible_raise" :append-to-body="true" center>
        <el-form class="demo-form-inline">
            <el-form-item label="评价信息:">
                <el-input type="textarea" v-model="raiseData.remark" rows="2"></el-input>
            </el-form-item>
            <el-form-item label="评价分数:">
                <el-rate v-model="raiseData.value" show-score text-color="#ff9900">
                </el-rate>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible_raise = false">关 闭</el-button>
            <el-button type="primary" @click="submit_raise">提 交</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import AllCateTree from '@/components/filter/AllCateTree'
import Cookie from 'js-cookie'
export default {
    name: 'repairManager',
    components:{AllCateTree},
    data() {
        return {
            listLoading: false,
            dialogImageUrl: "",
            dialogVisible: false,
            dialogVisible_device: false,
            dialogVisible_people: false,
            dialogVisible_submit: false,
            dialogVisible_add: false,
            dialogVisible_raise: false,
            total: 0,
            listQuery: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: "+id"
            },
            gridData: [],
            dialogVisible: false,
            workorder: {},
            DeviceInfo: {},
            Type: 1,
            submitData: {
                Id: "",
                Action: "",
                NodeType: "",
                RelateId: "",
                DepartMentId: "",
                Remark: "",
                AttachmentList: "",
            },
            peopleData: [],
            total_p: 0,
            listQuery_p: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: "+id"
            },
            peopleId: "",
            peopleRemark: "",

            submitRemark: "",
            loadingHeaders: {
                Authorization: 'Bearer ' + Cookie.get("token")
            },
            loadingUrl: null,
            fileList: [],
            pic_dialogVisible: false,
            dialogImageUrl: "",
            imageUrl: [],
            pictureArray: [],

            addData: {
                name: "",
                area: "",
                type: "",
                typeName: "",
                remark: "",
                checkList: []
            },
            checkList: [],

            raiseData: {
                remark: "",
                value: 5
            }
        }
    },
    created() {
        this.getList()
        this.loadingUrl = this.$DMURL+ '/Repair/UploadImg'
    },
    methods: {
        //获取员工列表
        getList() {
            let data = {
                type: this.Type,
                startTime: "",
                endTime: "",
                Page: this.listQuery.page,
                Size: this.listQuery.limit,
            }
            this.$ajax.get(this.$DMURL + "/Repair/GetList", {
                params: data
            }).then(result => {
                if (result.status === 200 && result.data.success) {
                    this.total = result.data.count;
                    this.gridData = result.data.data;
                }
            });
        },
        //选择类型
        clickType(t) {
            this.Type = t
            this.getList()
        },
        //排序
        sortChange() {},
        //新增报修
        addNewData() {
            this.addData = {
                name: "",
                area: "",
                type: "",
                typeName: "",
                remark: "",
                checkList: []
            }
            this.dialogVisible_add = true
            this.pictureArray = []
        },
        //查看详情
        modifyData(row) {
            this.$ajax.get(this.$DMURL + '/Repair/GetDetail', {
                id: row.Id
            }).then(result => {
                if (result.status === 200 && result.data.success) {
                    this.workorder = result.data.data
                    this.dialogVisible = true
                }
            });
        },
        //设备详情
        deviceData(info) {
            this.DeviceInfo = info
            this.dialogVisible_device = true
        },
        RepairGetUpUsers() {
            this.$ajax.get(this.$DMURL + '/Repair/GetUpUsers').then(result => {
                if (result.status === 200 && result.data.success) {
                    let resdata = result.data.data;
                    resdata.forEach(item => {
                        item.checked = false
                    })
                    this.peopleData = resdata
                    this.dialogVisible_people = true
                }
            });
        },
        eventsAction(type) {
            this.submitData = {
                Id: this.workorder.Id,
                Action: "",
                NodeType: 0,
                RelateId: 0,
                DepartMentId: 0,
                Remark: "",
                AttachmentList: [],
            }
            switch (type) {
                case "受理":
                    this.$confirm('是否受理该报修?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.submitData.Action = 2
                        this.submitAction()
                        this.dialogVisible = false
                    })
                    break
                case "拒绝":
                    this.$prompt('请输入拒绝理由', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({
                        value
                    }) => {
                        this.submitData.Action = 6
                        this.submitData.Remark = value
                        this.submitAction()
                    })
                    break
                case "上报":
                    this.submitData.Action = 5
                    this.submitData.NodeType = 1
                    this.submitData.DepartMentId = 0
                    this.RepairGetUpUsers();
                    break
                case "转交":
                    this.submitData.Action = 3
                    this.submitData.NodeType = 1
                    this.submitData.DepartMentId = 0
                    this.RepairGetUpUsers();
                    break
                case '提交':
                    this.submitData.Action = 4
                    this.dialogVisible_submit = true
                    this.pictureArray = []
                    break
                case '评价':
                    this.raiseData = {
                        remark: "",
                        value: 5
                    }
                    this.dialogVisible_raise = true
                    break
            }
        },
        //submit
        submitAction() {
            let data = {
                Id: this.submitData.Id,
                Action: this.submitData.Action,
                NodeType: this.submitData.NodeType,
                RelateId: this.submitData.RelateId,
                DepartMentId: this.submitData.DepartMentId,
                Remark: this.submitData.Remark,
                AttachmentList: this.submitData.AttachmentList,
            }
            this.$ajax.get(this.$DMURL + '/Repair/Submit', {
                params: data
            }).then(result => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.getList()
                    this.pic_dialogVisible = false
                    this.dialogVisible = false
                    this.dialogVisible_device = false
                    this.dialogVisible_people = false
                }
            });
        },
        //选择人员
        handleSelectionChange(row) {
            this.peopleData.forEach(item => {
                // 排他,每次选择时把其他选项都清除
                if (item.Id !== row.Id) {
                    item.checked = false
                }
            })
            this.peopleId = row.Id
        },
        //确定人员选择
        submitPeople() {
            let tip = "上报"
            if (this.submitData.Action == 5) {
                tip = "上报"
            } else if (this.submitData.Action == 3) {
                tip = "转交"
            }
            if (this.peopleId) {
                this.$confirm('确认' + tip + '该报修?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.submitData.RelateId = this.peopleId
                    this.submitData.Remark = this.peopleRemark
                    this.submitAction()
                })

            } else {
                this.$message.warning("请选择人员")
            }

        },
        // 点击图片上面的勾
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.pic_dialogVisible = true;
        },
        //删除照片
        handleRemove(file, fileList) {
            this.pictureArray = fileList
        },
        // 上传照片成功
        uploadSuccess(response, file, fileList) {
            this.pictureArray = fileList
        },
        // 上传失败
        uplodError(err, file, fileList) {},
        //选中照片
        changeFile(file, fileList) {
            this.imageUrl.push(file.raw);
        },
        submitDescribe() {
            this.$confirm('确认提交报修?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let Attachment = []
                this.pictureArray.forEach((item, index) => {
                    Attachment.push(item.response.data)
                })
                this.submitData.AttachmentList = Attachment
                this.submitData.Remark = this.submitRemark

                this.dialogVisible_submit = false

                this.submitAction()
            })
        },
        selectAllCate(val) {
            this.addData.area = val
        },
        selectAllCate_deviceCate(val, label) {
            this.addData.type = val
            this.addData.typeName = label;
            this.$ajax.get(this.$DMURL + '/SysStandard/GetRepairByDeviceCate', {
                params: {
                    cateId: val
                }
            }).then(result => {
                if (result.status === 200 && result.data.success) {
                    this.checkList = result.data.data;
                }
            });
        },
        submit_add() {
            let Attachment = []
            this.pictureArray.forEach((item, index) => {
                Attachment.push(item.response.data)
            })
            let data = {
                "DeviceId": 0,
                "DeviceName": this.addData.name,
                "DeviceCategoryId": this.addData.type,
                "AreaName": this.addData.area,
                "Remark": this.addData.remark,
                "Content": this.addData.checkList,
                "Attachment": Attachment
            }
            this.$ajax.post(this.$DMURL + '/Repair/CreateRepairSheet', data).then(result => {
                if (result.status === 200 && result.data.success) {
                    this.getList()
                    this.$message.success('创建成功！')
                    this.dialogVisible_add = false
                }
            });
        },
        //提交评价
        submit_raise() {
            let data = {
                Id: this.workorder.Id,
                Service: this.raiseData.value,
                Remark: this.raiseData.remark,
            }
            this.$ajax.get(this.$DMURL + '/Repair/Appraise', {
                params: data
            }).then(result => {
                if (result.status === 200 && result.data.success) {
                    this.$message.success('操作成功！')
                    this.getList()
                    this.dialogVisible_raise = false
                }
            });
        },
        handleCurrentChange(val) {
            this.listQuery.page = val
            this.getList();
        },
    }
}
</script>

<style lang="less" scoped>
.app-container {
    font-size: 12px;
    height: calc(100% - 115px);
}
.button-btn {
    padding: 20px;
    width: 100%;
    text-align: right;
    height: 44px;
}
</style>
