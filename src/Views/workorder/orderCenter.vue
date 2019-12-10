<template>
<div class="box">
    <el-row>
        <el-col>
            <div class="top-button">
                <el-button :type="workorderStatus==1?'primary':'nomal'" @click="ckickStatus(1)">待完成</el-button>
                <el-button :type="workorderStatus==2?'primary':'nomal'" @click="ckickStatus(2)">已完成</el-button>
                <el-button :type="workorderStatus==3?'primary':'nomal'" @click="ckickStatus(3)">我发起</el-button>
                <el-button :type="workorderStatus==4?'primary':'nomal'" @click="ckickStatus(4)">我督办</el-button>
            </div>
        </el-col>
    </el-row>
    <el-table :data="tableData" element-loading-text="Loading" fit  style="width: 100%;margin-top:10px" height="500px">
        <el-table-column label="工单编号" prop="Number" align="center">

        </el-table-column>
        <el-table-column label="工单类型" prop="SheetType" align="center">

        </el-table-column>
        <el-table-column label="发起人" prop="CreaterName" align="center">

        </el-table-column>
        <el-table-column label="工单状态" prop="State" align="center">

        </el-table-column>
        <el-table-column label="创建时间" prop="CreateTime" align="center">

        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" @click="handleClick(scope.row)">查看</el-button>
                <el-button type="text" @click="withdrawOrder(scope.row)" v-if="workorderStatus==3&& scope.row.State!=='已完成' && scope.row.State!=='已撤回'">撤回</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="bottom-btn">
        <el-button type="primary" @click="clickAddWorkorder">新增工单</el-button>
    </div>
    <el-pagination :page-size="Size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <el-dialog title="工单详情" :visible.sync="dialogVisible" width="760px" center top="60px">
        <div class="dialog-container dialog-details">
            <el-form :model="details" label-width="120px">
                <el-form-item label="发起人：">
                    <span>{{details.CreaterName}}</span>
                </el-form-item>
                <el-form-item label="工单类型：">
                    <span>{{details.SheetType}}</span>
                </el-form-item>
                <el-form-item label="发起时间：">
                    <span>{{details.CreateTime}}</span>
                </el-form-item>
                <el-form-item label="结束时间：">
                    <span>{{details.PlanFinishTime}}</span>
                </el-form-item>
                <el-form-item label="工单等级：">
                    <span>{{details.Level}}</span>
                </el-form-item>
                <el-form-item label="工单详情：">
                    <span @click="dialogVisible_detail = true" style="color:#409EFF;cursor: pointer;">查看</span>
                </el-form-item>
                <el-form-item label="工单流程：">
                    <el-steps :active="active" direction="vertical">
                        <el-step v-for="(item,index) in details.DetailList" :key="index" :title="item.Name">
                            <template slot="description">
                                <div class="process-details">
                                    <div v-if="item.CompleteTime!='' && item.CompleteTime!=null">
                                        <span v-if="index==0">发起时间：{{item.CompleteTime}}</span>
                                        <span v-else>完成时间：{{item.CompleteTime}}</span>
                                    </div>
                                    <div>
                                        <span>评论：{{item.Remark?item.Remark:'无'}}</span>
                                    </div>
                                    <div v-if="item.ImageList!=null&&item.ImageList.length>0">
                                        <enlargeimg :data="item.ImageList"></enlargeimg>
                                    </div>
                                </div>
                            </template>
                        </el-step>
                    </el-steps>
                </el-form-item>
                <el-form-item label="督办流程：" v-if="details.SupervisorList&&details.SupervisorList.length>0">
                    <el-steps finish-status="success">
                        <el-step v-for="(item,index) in details.SupervisorList" :key="index" :title="item.Name" :description="item.DeptName"></el-step>
                    </el-steps>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="determine" v-if="workorderStatus==1" @click="operationOrder('拒绝')">拒绝</el-button>
            <el-button type="determine" v-if="workorderStatus==1" @click="operationOrder('评论')">提交</el-button>
            <el-button type="determine" v-if="workorderStatus==1" @click="operationOrder('同意')">完成</el-button>
            <el-button type="determine" v-if="workorderStatus==1" @click="clickChange">转单</el-button>
            <!-- <el-button type="determine" v-if="workorderStatus==3||workorderStatus==4" v-show="details.State !=='已完成'" @click="operationOrder('催办')">催单</el-button> -->
            <el-button type="cancel" @click="dialogVisible = false">关闭</el-button>
        </div>
    </el-dialog>
    <!-- 工单详情 -->
    <el-dialog title="工单详情" :visible.sync="dialogVisible_detail" width="760px" center v-if="dialogVisible_detail">
        <div class="dialog-container">
            <fm-generate-form class="designer" v-if="details.TempleteForm !== ''" :data="JSON.parse(details.TempleteForm)" :remote="remoteFuncs_workorder" :value="JSON.parse(details.Templete)" ref="generateForm_workorder"> </fm-generate-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" @click="dialogVisible_detail = false">关 闭</el-button>
        </div>
    </el-dialog>
    <!-- 工单操作 -->
    <el-dialog title="工单操作" :visible.sync="dialogVisible_oper" width="760px" center>
        <div class="dialog-container">
            <el-form :model="operation" label-width="120px">
                <el-form-item label="描述信息：">
                    <el-input type="textarea" v-model="operation.remark" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="上传图片：">
                    <el-upload :headers="loadingHeaders" :action="loadingUrl" :on-success="uploadSuccess" :on-error="uplodError" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="changeFile" :file-list="fileList">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-dialog :visible.sync="pic_dialogVisible" :append-to-body="true" title="图片信息" center>
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" @click="dialogVisible_oper = false">取消</el-button>
            <el-button type="determine" @click="submitOperation">确定</el-button>
        </div>
    </el-dialog>
    <!-- 转单选人 -->
    <!-- <el-dialog title="员工列表" :visible.sync="dialogVisible_change" width="760px" center>
        <div class="dialog-container">
            <el-form :model="user" :inline="true" label-width="100px">
                <el-form-item label="所属部门：">
                    <SelectTree type="department" :data_checked_value="user.department" @value="selectDepartment" />
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input v-model="user.Name" placeholder="请输入" @change="getUserList" />
                </el-form-item>
            </el-form>
            <el-table :data="userTableData" element-loading-text="Loading" fit highlight-current-row max-height="calc(100vh - 250px)" style="width: 100%">
                <el-table-column label="选择" align="center">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.Selected" @change="checked=> clickSelectedUser(scope.row,checked)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="所属部门" prop="DeptName" align="center">
                </el-table-column>
                <el-table-column label="姓名" prop="UserName" align="center">
                </el-table-column>
            </el-table>
        </div>
    </el-dialog> -->
    <!-- 新增工单 -->
    <el-dialog title="新增工单" :visible.sync="dialogVisible_add" width="700px" center>
        <div class="dialog-container">
            <el-form :model="workorder" label-width="150px" ref="ruleForm" :rules="rules">
                <el-form-item label="工单类型：" prop="workorderType">
                    <el-select v-model="workorder.workorderType" placeholder="请选择" @change="selectWorkorderType" clearable>
                        <el-option v-for="(item,index) in workorderTypeList" :key="index" :value="item.Id" :label="item.Name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结束时间：">
                    <el-date-picker v-model="workorder.finishTiem" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="工单等级：" prop="Level">
                    <el-select v-model="workorder.Level" placeholder="请选择" clearable>
                        <el-option v-for="(item,index) in LevelTypeList" :key="index" :label="item.Name" :value="item.Name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否为联合工单：">
                    <el-radio v-model="workorder.union" :label="1">是</el-radio>
                    <el-radio v-model="workorder.union" :label="0">否</el-radio>
                </el-form-item>
                <fm-generate-form class="designer" v-if="workorder.TempleteForm !== ''" :data="workorder.TempleteForm" :remote="remoteFuncs" :value="editData" ref="generateForm"> </fm-generate-form>
                <el-form-item label="执行流程：" v-if="workorder.workorderType != ''&&workorder.workorderType!=null" class="add-workorder">
                    <i class="el-icon-edit" style="cursor: pointer;" @click="addStepSheetFlows('addSheetFlows')"></i>
                    <el-steps finish-status="success">
                        <el-step v-for="(item,index) in workorder.SheetFlows" :key="index" :title="item.Name" :description="item.DeptName" @click.native="stepSheetFlows(item,index,'SheetFlows')"> </el-step>
                    </el-steps>
                </el-form-item>
                <el-form-item label="督办流程：" v-if="workorder.workorderType != ''&&workorder.workorderType!=null" class="add-workorder">
                    <i class="el-icon-edit" style="cursor: pointer;" @click="addStepSheetFlows('addSupervisors')"></i>
                    <el-steps finish-status="success">
                        <el-step v-for="(item,index) in workorder.Supervisors" :key="index" :title="item.Name" :description="item.DeptName" @click.native="stepSheetFlows(item,index,'SheetFlows')"></el-step>
                    </el-steps>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" size="default" plain @click="dialogVisible_add = false">关闭</el-button>
            <el-button type="determine" @click="submitAddSheet">确定</el-button>
        </div>
    </el-dialog>
    <!-- 选择执行人员 -->
    <el-dialog title="添加人员" :visible.sync="dialogVisible_user" width="960px" center @close="closeUserDialog">
        <div class="dialog-container">
            <el-form :model="user" :inline="true" label-width="100px">
                <el-form-item label="所属部门：">
                    <SelectTree type="department" :data_checked_value="user.department" @value="handleChangeDepartment" />
                </el-form-item>
                <el-form-item label="姓名：">
                    <el-input v-model="user.Name" placeholder="请输入" @change="getUserList" />
                </el-form-item>
            </el-form>
            <el-table :data="userTableData" element-loading-text="Loading" fit highlight-current-row style="width: 100%">
                <el-table-column label="选择" align="center">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.Selected" @change="checked=> clickSelectedUser(scope.row,checked)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="所属部门" prop="DeptName" align="center">
                </el-table-column>
                <el-table-column label="姓名" prop="Name" align="center">
                </el-table-column>
            </el-table>
            <el-steps v-if="tableProcess.length>0">
                <el-step v-for="(item,index) in tableProcess" :key="index" :title="item.Name" :description="item.DeptName"></el-step>
            </el-steps>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" size="default" plain @click="dialogVisible_user = false">关闭</el-button>
            <el-button type="determine" @click="submitAddUser">确定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import Cookie from 'js-cookie'
import {
    setTimeout
} from 'timers';
import SelectArea from '@/components/filter/SelectArea'
import SelectTree from '@/components/filter/SelectTree'
export default {
    components:{
        SelectArea,SelectTree
    },
    data() {
        return {
            workorderStatus: 1, //1->待完成  2->已完成  3->我发起   4->我督办
            tableData: [],
            total: 1,
            Page: 1,
            Size: 10,
            dialogVisible: false,
            dialogVisible_detail: false,
            details: {
                Id: '',
                CreaterName: '',
                SheetType: '',
                CreateTime: '',
                PlanFinishTime: '',
                Level: '',
                TempleteForm: '',
                Templete: '',
                DetailList: [],
                SupervisorList: []
            },
            remoteFuncs_workorder: {},
            active: -1,
            dialogVisible_add: false,
            workorderTypeList: [],
            LevelTypeList: [{
                    Name: '一般'
                },
                {
                    Name: '紧急'
                },
                {
                    Name: '非常紧急'
                }
            ],
            workorder: {
                SheetCategoryName: '',
                workorderType: null,
                finishTiem: '',
                Level: '一般',
                union: 'false',
                TempleteForm: '',
                SheetFlows: [],
                Supervisors: []
            },
            remoteFuncs: {},
            editData: '',
            rules: {
                workorderType: [{
                    required: true,
                    message: '请选择工单类型',
                    trigger: 'change'
                }],
            },
            dialogVisible_user: false,
            user: {
                department: '',
                Name: ''
            },
            userTableData: [],
            selectedUser: null,
            addSheetType: null,
            selectedUser: null, //选择的人员
            dialogIndex: null,
            Action: '提交',
            dialogVisible_oper: false,
            operation: {
                remark: '',
            },
            loadingHeaders: {
                Authorization: 'Bearer ' + Cookie.get('token')
            },
            loadingUrl: this.$URL + '/Sheet/UploadImg',
            pictureArray: [],
            dialogImageUrl: [],
            pic_dialogVisible: false,
            imageUrl: [],
            fileList: [],
            UserId: 0,
            addUserType: '',
            SheetId: null,
            tableProcess: [],
        }
    },
    mounted() {
        this.getList()
        this.GetWorkorderModalList();
    },
    methods: {
        GetWorkorderModalList() {
            this.$ajax.get(this.$URL + '/Sheet/GetCategoryList', {
                params: {
                    page: 1,
                    size: 1000,
                    state: 1
                }
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.workorderTypeList = result.data.data;
                }
            });
        },
        // 获取数据
        getList() {
            let data = {
                type: this.workorderStatus,
                page: this.Page,
                size: this.Size
            }
            this.$ajax.get(this.$URL + '/Sheet/GetSheetList', {
                params: data
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.tableData = result.data.data;
                    this.total = result.data.count
                }
            });
        },
        // 获取用户
        getUserList() {
            let departmenArrey = []
            if (this.user.department != null && this.user.department != '') {
                departmenArrey.push(this.user.department)
                departmenArrey = JSON.stringify(departmenArrey)
            } else {
                departmenArrey = ''
            }
            let data = {
                ids: departmenArrey,
                size: 0,
                page: 0,
                name: this.user.name
            }
            this.$ajax.get(this.$URL + '/department/LoadDeptUsers', {
                params: data
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    let  _this = this;
                    result.data.data.forEach((item, index) => {
                        _this.$set(item, 'Selected', false)
                        item = eval(item)
                        if (_this.tableProcess.length > 0) {
                            _this.tableProcess.forEach(j => {
                                if (j.ID == item.ID) {
                                    console.log(item.ID)
                                    _this.$set(item, 'Selected', true)
                                    item = eval(item)
                                }
                            })
                        }

                    });
                    this.userTableData = result.data.data;
                }
            });

        },
        // 点击按钮
        ckickStatus(val) {
            this.workorderStatus = val
            this.getList()
        },
        // 查看工单
        handleClick(row) {
            this.$ajax.get(this.$URL + '/Sheet/GetSheetDetail', {
                params: {
                    id: row.Id
                }
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.dialogVisible = true
                    this.details = result.data.data;
                    this.SheetId = result.data.data.Id
                    this.details.DetailList.forEach((item, index) => {
                        if (this.details.State == '已完成') {
                            this.active = this.details.DetailList.length
                        } else if (item.Ing) {
                            this.active = index
                        } else if (item.Action == '拒绝' || item.Action == '撤回') {
                            this.active = index
                        }
                    })
                }
            });

        },
        // 新增工单
        clickAddWorkorder() {
            this.dialogVisible_add = true
            this.workorder = {
                workorderType: null,
                finishTiem: '',
                Level: '一般',
                union: 0,
                TempleteForm: '',
                SheetFlows: [],
                Supervisors: []
            }
        },
        OrderOperation(data) {
            return this.$ajax.post(this.$URL + '/Sheet/SubmitSheet', data);
        },
        //添加人员
        submitAddUser() {
            console.log(this.addUserType)
            // 转单
            if (this.addUserType == 'changeOrder') {
                if (this.UserId == 0) {
                    this.$message.error('请选择转交人')
                    return
                } else {
                    let data = {
                        SheetId: this.SheetId,
                        Action: '转发',
                        Remark: '',
                        Attachment: [],
                        UserId: this.UserId
                    }
                    this.OrderOperation(data).then(result => {
                        if (result.data.success) {
                            this.$message.success('转单成功')
                            this.getList()
                            this.dialogVisible_user = false
                        }
                    })
                }
            } else if (this.addUserType == 'addSheetFlows') {
                this.workorder.SheetFlows = this.tableProcess;
                this.dialogVisible_user = false
            } else if (this.addUserType == 'addSupervisors') {
                this.workorder.Supervisors = this.tableProcess;
                this.dialogVisible_user = false
            } else {
                switch (this.addSheetType) {
                    case "addSheetFlows":
                        this.workorder.SheetFlows = this.tableProcess;
                        break
                    case "addSupervisors":
                        this.workorder.Supervisors = this.tableProcess;
                        break
                    case "SheetFlows":
                        this.workorder.SheetFlows.splice(this.dialogIndex, 1, this.SheetFlowsData[0])
                        break
                    case "SheetFlows":
                        this.workorder.Supervisors.splice(this.dialogIndex, 1, this.SheetFlowsData[0])
                }
                this.dialogVisible_user = false
            }

        },
        // 提交新增工单
        submitAddSheet() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if (this.workorder.SheetFlows.length < 1) {
                        this.$message.error('请选择执行流程')
                        return
                    } else {
                        let SheetFlows = [],
                            Supervisor = []
                        this.workorder.SheetFlows.forEach(item => {
                            SheetFlows.push(item.ID)
                        })
                        if (this.workorder.Supervisors.length > 0) {
                            this.workorder.Supervisors.forEach(element => {
                                Supervisor.push(element.ID)
                            })
                        }
                        this.$refs.generateForm.getData().then(data => {
                            let text = {
                                RepairSheetId: null,
                                SheetCategoryName: this.workorder.SheetCategoryName,
                                PlanFinishTime: this.workorder.finishTiem,
                                Level: this.workorder.Level,
                                Templete: JSON.stringify(data),
                                TempleteForm: JSON.stringify(this.workorder.TempleteForm),
                                SheetDetail: SheetFlows.length > 0 ? SheetFlows.map(Number) : [],
                                Supervisor: Supervisor.length > 0 ? Supervisor.map(Number) : [],
                                IsJoin: this.workorder.union
                            }
                            this.$ajax.post(this.$URL + '/Sheet/CreateSheet', text).then(result => {
                                if (result.status == 200 && result.data.success) {
                                    this.$message.success('新增成功')
                                    this.dialogVisible_add = false
                                    this.getList()
                                }
                            });
                        })
                    }
                }
            })

        },
        // 选择工单类型
        selectWorkorderType(val) {
            if (val != '' && val != null) {
                this.$ajax.get(this.$URL + '/Sheet/GetSheetCategory', {
                    params: {
                        id: val
                    }
                }).then(result => {
                    if (result.status == 200 && result.data.success) {
                        this.workorder.TempleteForm = JSON.parse(result.data.data.TempleteForm)
                        this.workorder.SheetFlows = result.data.data.SheetFlows
                        this.workorder.Supervisors = result.data.data.Supervisors
                    }
                });
            }
            this.workorderTypeList.forEach(element => {
                if (element.Id == val) {
                    this.workorder.SheetCategoryName = element.Name
                }
            })

        },
        // 选择部门
        handleChangeDepartment(value) {
            this.user.department = value
            this.getUserList()
        },
        // 添加人员
        addStepSheetFlows(value) {
            this.dialogVisible_user = true;
            this.addUserType = value;
            if (value == "addSheetFlows") {
                this.tableProcess = JSON.parse(
                    JSON.stringify(this.workorder.SheetFlows)
                );
            } else if (value == "addSupervisors") {
                this.tableProcess = this.workorder.Supervisors;
            }
            this.getUserList();
            this.SheetFlowsData = []
        },
        // 人员列表关闭时
        closeUserDialog() {
            this.addUserType = 'change'
            this.UserId = 0
        },
        // 修改流程的人员
        stepSheetFlows(data, index, type) {
            this.getUserList()
            this.dialogIndex = index
            this.dialogVisible_user = true
            this.addSheetType = type
            this.SheetFlowsData = data

        },
        // 选择框发生改变时
        clickSelectedUser(row, state) {
            if (this.addUserType == 'changeOrder') {
                if (state) {
                    this.userTableData.forEach((item, index) => {
                        if (row.ID !== item.ID) {
                            item.Selected = false
                        } else {
                            item.Selected = true
                            this.selectedUser = row
                        }
                    })
                    this.UserId = row.ID
                } else {
                    this.UserId = 0
                }
            } else {
                if (state) {
                    this.tableProcess.push(row);
                } else {
                    this.tableProcess.forEach((item, index) => {
                        if (row.ID == item.ID) {
                            this.tableProcess.splice(index, 1);
                        }
                    });
                }
            }

        },
        // 工单操作
        operationOrder(action) {
            this.Action = action
            this.dialogVisible_oper = true
            this.operation = {
                remark: '',
            }
        },
        // 提交操作类容
        submitOperation() {
            let Attachment = []
            this.pictureArray.forEach((item, index) => {
                Attachment.push(item.response.data)
            })
            let data = {
                SheetId: this.details.Id,
                Action: this.Action,
                Remark: this.operation.remark,
                Attachment: Attachment,
                UserId: 0
            }
            this.OrderOperation(data).then(result => {
                if (result.data.success) {
                    this.$message.success('提交成功')
                    this.dialogVisible_oper = false
                    this.dialogVisible = false
                    this.getList()
                }
            })
        },
        //转单
        clickChange() {
            this.dialogVisible_user = true
            this.addUserType = 'changeOrder'
            this.getUserList()
        },
        // 撤单
        withdrawOrder(row) {
            let data = {
                SheetId: row.Id,
                Action: '撤回',
                Remark: '',
                UserId: row.CreaterId,
                Attachment: ''
            }
            this.$confirm('是否确认撤回该工单？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.OrderOperation(data).then(result => {
                    if (result.data.success) {
                        this.$message.success('操作成功')
                        this.getList()
                    }
                })
            })
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
        handleCurrentChange(val) {
            this.listQuery.page = val
            this.getList();
        }

    }
}
</script>

<style lang="less" scoped>
.is-finish .process-details {
    color: #409EFF;
}

.process-details {
    color: white;
}

.app-container {
    height: calc(100vh - 120px);
    text-align: left;
    background: #061A30;

    .top-button {
        width: 100%;
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
    }

    .bottom-btn {
        width: 100%;
        text-align: right;
        padding: 20px 20px 0 0;
    }
}
</style>
