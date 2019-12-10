<template>
<div class="box">
    <el-form :inline="true" label-width="100px" class="header-content">
        <el-form-item label="工单状态：">
            <el-select v-model="sheet.State" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in workorderStateType" :key="index" :label="item.Name" :value="item.ID"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="起止时间：">
            <el-date-picker v-model="sheet.startTime" type="date" placeholder="选择日期"></el-date-picker>
            <span>至</span>
            <el-date-picker v-model="sheet.endTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="报修资产：">
            <el-input v-model="sheet.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="tableData" element-loading-text="Loading" fit  style="width: 100%">
        <el-table-column label="报修编号" prop="Number" align="center"></el-table-column>
        <el-table-column label="报修人" prop="CreaterName" align="center"></el-table-column>
        <el-table-column label="报修资产" prop="DeviceName" align="center"></el-table-column>
        <el-table-column label="资产区域" prop="AreaName" align="center"></el-table-column>
        <el-table-column label="工单状态" prop="State" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="CreateTime" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="360px">
            <template slot-scope="scope">
                <el-button type="text" :disabled="scope.row.State=='未处理'?false:true" @click="generateWorkorder(scope.row)">生成工单</el-button>
                <el-button type="text" :disabled="scope.row.State=='未处理'?false:true" @click="refureWorkorder(scope.row)">废除</el-button>
                <el-button type="text" @click="checkRepairDetails(scope.row)">报修详情</el-button>
                <el-button type="text" :disabled="scope.row.State!=='未处理'&&scope.row.State!=='已拒绝' ?false:true" @click="repairWorkorder(scope.row)">关联工单</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination :page-size="Size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <!-- 报修详情 -->
    <el-dialog title="报修详情" :visible.sync="dialogVisible_details" width="600px" center v-if="dialogVisible_details">
        <div class="dialog-container">
            <el-form :model="details" label-width="120px">
                <el-form-item label="报修人：">
                    <span>{{details.CreaterName}}</span>
                </el-form-item>
                <el-form-item label="联系电话：">
                    <span>{{details.CreaterPhone}}</span>
                </el-form-item>
                <el-form-item label="报修资产：">
                    <span>{{details.DeviceName}}</span>
                </el-form-item>

                <el-form-item label="所在区域：">
                    <span>{{details.AreaName}}</span>
                </el-form-item>
                <el-form-item label="报修内容：">
                    <span>{{details.Remark}}</span>
                </el-form-item>
                <el-form-item label="报修照片：">
                    <!-- <span>{{details}}</span> -->
                    <enlargeimg :data="details.Attachment" v-if="details.Attachment && details.Attachment.length>0"></enlargeimg>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" size="default" plain @click="dialogVisible_details = false">关闭</el-button>
        </div>
    </el-dialog>
    <!-- 生成工单 -->
    <el-dialog title="生成工单" :visible.sync="dialogVisble_workorder" width="760px" center top="20px" v-if="dialogVisble_workorder">
        <div class="dialog-container">
            <el-form :model="workorder" label-width="150px" ref="workorderForm" :rules="rulesForm">
                <el-form-item label="工单类型：">
                    <span>维修工单</span>
                </el-form-item>
                <el-form-item label="结束时间：">
                    <el-date-picker v-model="workorder.PlanFinishTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="工单等级：">
                    <el-select v-model="workorder.Level" placeholder="请选择" clearable>
                        <el-option v-for="(item,index) in LevelTypeList" :key="index" :label="item.Name" :value="item.Name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否为联合工单：">
                    <el-radio v-model="workorder.IsJoin" label="1">是</el-radio>
                    <el-radio v-model="workorder.IsJoin" label="0">否</el-radio>
                </el-form-item>
                <fm-generate-form class="designer" v-if="workorder.TempleteForm !== ''" :data="workorder.TempleteForm" :remote="remoteFuncs_cate" :value="editData_cate" ref="generateForm"></fm-generate-form>
                <el-form-item label="审核流程：">
                    <i class="el-icon-edit" style="cursor: pointer;" @click="addUser('addSheetFlows')"></i>
                    <el-steps finish-status="success">
                        <el-step v-for="(item,index) in workorder.SheetFlows" :key="index" :title="item.Name" :description="item.DeptName"></el-step>
                        <!-- <el-step icon="el-icon-circle-plus-outline" @click.native="addUser('addSheetFlows')"></el-step> -->
                    </el-steps>
                </el-form-item>
                <el-form-item label="督办流程：">
                    <i class="el-icon-edit" style="cursor: pointer;" @click="addUser('addSupervisors')"></i>
                    <el-steps finish-status="success">
                        <el-step v-for="(item,index) in workorder.Supervisors" :key="index" :title="item.Name" :description="item.DeptName"></el-step>
                        <!-- <el-step icon="el-icon-circle-plus-outline" @click.native="addUser('addSupervisors')"></el-step> -->
                    </el-steps>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" size="default" plain @click="dialogVisble_workorder = false">关闭</el-button>
            <el-button type="determine" @click="submitGenerate">确定</el-button>
        </div>
    </el-dialog>
    <!-- 人员表格 -->
    <el-dialog title="添加人员" :visible.sync="dialogVisble_user" width="760px" center v-if="dialogVisble_user">
        <el-form :inline="true" :model="user" label-width="100px">
            <el-form-item label="所属部门：">
                <!-- <SelectDepartment :departmentData="user.department" @value="handleChangeDepartment" /> -->
                <SelectTree type="department" :data_checked_value="user.department" @value="handleChangeDepartment" />
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="user.name" placeholder="请输入" @change="getUserList"></el-input>
            </el-form-item>
        </el-form>
        <el-table :data="deptUserData" element-loading-text="Loading" fit highlight-current-row max-height="calc(100vh - 250px)" style="width: 100%">
            <el-table-column type="selected" label="选择" align="center" width="200px">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.Selected" @change="checked=> clickSelectedUser(scope.row,checked)"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column label="所属部门" prop="DeptName" align="center"></el-table-column>
            <el-table-column label="姓名" prop="Name" align="center"></el-table-column>
        </el-table>
        <el-steps v-if="tableProcess.length>0">
            <el-step v-for="(item,index) in tableProcess" :key="index" :title="item.Name" :description="item.DeptName"></el-step>
        </el-steps>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" size="default" plain @click="dialogVisble_user = false">关闭</el-button>
            <el-button type="determine" @click="sureAddUser">确定</el-button>
        </div>
    </el-dialog>
    <!-- 关联工单 -->
    <el-dialog title="关联工单" :visible.sync="dialogVisble_relation" width="760px" center top="50px" v-if="dialogVisble_relation">
        <div class="dialog-container">
            <el-form :model="relation" label-width="150px">
                <el-form-item label="工单类型：">
                    <span>{{relation.SheetType}}</span>
                </el-form-item>
                <el-form-item label="结束时间：">
                    <span>{{relation.PlanFinishTime}}</span>
                </el-form-item>
                <el-form-item label="工单等级：">
                    <span>{{relation.Level}}</span>
                </el-form-item>
                <el-form-item label="资产名称：">
                    <span>{{relation.DeviceName}}</span>
                </el-form-item>
                <el-form-item label="资产区域：">
                    <span>{{relation.DeviceArea}}</span>
                </el-form-item>
                <el-form-item label="执行流程：">
                    <el-steps :active="active" direction="vertical" :space="120">
                        <el-step v-for="(item,index) in relation.DetailList" :title="item.Name" :key="index">
                            <template slot="description">
                                <div class="process-details">
                                    <div v-if="item.CompleteTime!=''&&item.CompleteTime!=null">
                                        <span v-if="index==0">发起时间：{{item.CompleteTime}}</span>
                                        <span v-else>处理时间：{{item.CompleteTime}}</span>
                                    </div>
                                    <div v-if="item.Remark!=''&&item.Remark!=null">
                                        <span>评论：{{item.Remark}}</span>
                                    </div>
                                    <div v-if="item.ImageList!=null&&item.ImageList.length>0">
                                        <span>照片：</span>
                                        <enlargeimg :data="item.ImageList"></enlargeimg>
                                    </div>
                                </div>
                            </template>
                        </el-step>
                    </el-steps>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" size="default" plain @click="dialogVisble_relation = false">关闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    truncate
} from "fs";
export default {

    data() {
        return {
            sheet: {
                name: "",
                State: 0,
                startTime: "",
                endTime: ""
            },
            workorderStateType: [{
                    Name: "全部",
                    ID: 0
                },
                {
                    Name: "未处理",
                    ID: 1
                },
                {
                    Name: "进行中",
                    ID: 2
                },
                {
                    Name: "已完成",
                    ID: 3
                },
                {
                    Name: "已拒绝",
                    ID: 4
                }
            ],
            tableData: [],
            total: 0,
            Page: 1,
            Size: 10,
            details: {},
            dialogVisible_details: false,
            dialogVisble_workorder: false,
            workorder: {
                SheetId: "",
                IsJoin: "0",
                PlanFinishTime: "",
                type: "",
                Level: "一般",
                SheetFlows: [],
                Supervisors: [],
                TempleteForm: {
                    list: [{
                            type: "input",
                            name: "资产编码：",
                            icon: "icon-input22222222",
                            options: {
                                width: "100%",
                                defaultValue: "",
                                required: false,
                                dataType: "input_devicecode",
                                pattern: "",
                                placeholder: "",
                                remoteFunc: "func_input_devicecode"
                            },
                            key: "input_devicecode",
                            model: "input_devicecode",
                            rules: [{
                                type: "string",
                                message: "资产名称格式不正确"
                            }]
                        },
                        {
                            type: "input",
                            name: "资产名称：",
                            icon: "icon-input",
                            options: {
                                width: "100%",
                                defaultValue: "",
                                required: false,
                                dataType: "string",
                                pattern: "",
                                placeholder: "",
                                remoteFunc: "func_1546592457000_43663"
                            },
                            key: "1546592457000_43663",
                            model: "input_1546592457000_43663",
                            rules: [{
                                type: "string",
                                message: "单行文本格式不正确"
                            }]
                        },
                        {
                            type: "input",
                            name: "资产区域：",
                            icon: "icon-input",
                            options: {
                                width: "100%",
                                defaultValue: "",
                                required: false,
                                dataType: "string",
                                pattern: "",
                                placeholder: "",
                                remoteFunc: "func_1546592501000_43995"
                            },
                            key: "1546592501000_43995",
                            model: "input_1546592501000_43995",
                            rules: []
                        },
                        {
                            type: "textarea",
                            name: "工单内容：",
                            icon: "icon-diy-com-textarea",
                            options: {
                                width: "220px",
                                defaultValue: "",
                                required: false,
                                pattern: "",
                                placeholder: "",
                                remoteFunc: "func_1546592520000_87577"
                            },
                            key: "1546592520000_87577",
                            model: "textarea_1546592520000_87577",
                            rules: []
                        },
                        {
                            type: "imgupload",
                            name: "图片：",
                            icon: "icon-tupian",
                            options: {
                                defaultValue: [],
                                size: {
                                    width: 100,
                                    height: 100
                                },
                                width: "",
                                tokenFunc: "funcGetToken",
                                token: "",
                                domain: "http://pfp81ptt6.bkt.clouddn.com/",
                                disabled: false,
                                length: 8,
                                multiple: true,
                                remoteFunc: "func_1546592539000_59339"
                            },
                            key: "1546592539000_59339",
                            model: "imgupload_1546592539000_59339",
                            rules: []
                        }
                    ],
                    config: {
                        labelWidth: 100,
                        labelPosition: "top",
                        size: "small"
                    }
                }
            },
            editData_cate: {},
            remoteFuncs_cate: {
                funcGetToken(resolve) {
                    resolve("1");
                }
            },
            LevelTypeList: [{
                    Name: "一般"
                },
                {
                    Name: "紧急"
                },
                {
                    Name: "非常紧急"
                }
            ],
            rulesForm: {},
            addUserType: "",
            deptUserData: [],
            user: {
                department: [],
                name: ""
            },
            tableProcess: [],
            dialogVisble_user: false,
            dialogVisble_relation: false,
            relation: {
                SheetType: "",
                PlanFinishTime: "",
                Level: "",
                DeviceName: "",
                DeviceArea: "",
                TempleteForm: "",
                DetailList: ""
            },
            active: -1
        };
    },
    mounted() {
        this.getList();
        this.getUserList();
    },
    methods: {
        // 获取列表
        getList() {
            let data = {
                state: this.sheet.State,
                keyWord: this.sheet.name,
                start: this.sheet.startTime,
                end: this.sheet.endTime,
                page: this.Page,
                size: this.Size
            };
            this.$ajax.get(this.$URL + '/RepairSheet/GetList', {
                params: data
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.tableData = result.data.data;
                    this.total = result.data.count;
                }
            });

        },

        // 报修详情
        checkRepairDetails(row) {
            this.$ajax.get(this.$URL + '/RepairSheet/GetRepairSheet', {
                params: {
                    Id: row.Id
                }
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.dialogVisible_details = true;
                    this.details = result.data.data;
                }
            });
        },
        // 拒绝工单
        refureWorkorder(row) {
            this.$prompt("请输入报废原因：", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(({
                value
            }) => {
                this.$ajax.post(this.$URL + '/RepairSheet/RefuseSheet', {
                    ID: row.Id,
                    Reason: value
                }).then(result => {
                    if (result.status == 200 && result.data.success) {
                        this.dialogVisible_details = false;
                        this.$message.success("提交成功");
                        this.getList();
                    }
                });
            });
        },
        // 生成工单
        generateWorkorder(row) {
            this.workorder = {
                SheetId: row.Id,
                IsJoin: "0",
                PlanFinishTime: "",
                type: "",
                Level: "",
                SheetFlows: [],
                Supervisors: [],
                TempleteForm: {
                    list: [{
                            type: "input",
                            name: "资产编码：",
                            icon: "icon-input22222222",
                            options: {
                                width: "100%",
                                defaultValue: "",
                                required: false,
                                dataType: "input_devicecode",
                                pattern: "",
                                placeholder: "",
                                remoteFunc: "func_input_devicecode"
                            },
                            key: "input_devicecode",
                            model: "input_devicecode",
                            rules: [{
                                type: "string",
                                message: "资产名称格式不正确"
                            }]
                        },
                        {
                            type: "input",
                            name: "资产名称：",
                            icon: "icon-input",
                            options: {
                                width: "100%",
                                defaultValue: "",
                                required: false,
                                dataType: "string",
                                pattern: "",
                                placeholder: "",
                                remoteFunc: "func_1546592457000_43663"
                            },
                            key: "1546592457000_43663",
                            model: "input_1546592457000_43663",
                            rules: [{
                                type: "string",
                                message: "单行文本格式不正确"
                            }]
                        },
                        {
                            type: "input",
                            name: "资产区域：",
                            icon: "icon-input",
                            options: {
                                width: "100%",
                                defaultValue: "",
                                required: false,
                                dataType: "string",
                                pattern: "",
                                placeholder: "",
                                remoteFunc: "func_1546592501000_43995"
                            },
                            key: "1546592501000_43995",
                            model: "input_1546592501000_43995",
                            rules: []
                        },
                        {
                            type: "textarea",
                            name: "工单内容：",
                            icon: "icon-diy-com-textarea",
                            options: {
                                width: "220px",
                                defaultValue: "",
                                required: false,
                                pattern: "",
                                placeholder: "",
                                remoteFunc: "func_1546592520000_87577"
                            },
                            key: "1546592520000_87577",
                            model: "textarea_1546592520000_87577",
                            rules: []
                        },
                        {
                            type: "imgupload",
                            name: "图片：",
                            icon: "icon-tupian",
                            options: {
                                defaultValue: [],
                                size: {
                                    width: 100,
                                    height: 100
                                },
                                width: "",
                                tokenFunc: "funcGetToken",
                                token: "",
                                domain: "http://pfp81ptt6.bkt.clouddn.com/",
                                disabled: false,
                                length: 8,
                                multiple: true,
                                remoteFunc: "func_1546592539000_59339"
                            },
                            key: "1546592539000_59339",
                            model: "imgupload_1546592539000_59339",
                            rules: []
                        }
                    ],
                    config: {
                        labelWidth: 100,
                        labelPosition: "top",
                        size: "small"
                    }
                }
            };
            let imgArr = []
            if (row.Attachment && row.Attachment.length > 0) {
                row.Attachment.forEach(item => {
                    let obj = {
                        url: this.$URL + item
                    }
                    imgArr.push(obj)
                })
            }
            this.editData_cate = {
                input_1546592457000_43663: row.DeviceName || "",
                input_1546592501000_43995: row.AreaName || "",
                textarea_1546592520000_87577: row.Remark || "",
                imgupload_1546592539000_59339: imgArr,
                input_devicecode:row.Code
            };
            this.dialogVisble_workorder = true;

        },
        // 获取人员
        getUserList() {
            let departmenArrey = [];
            if (this.user.department != null && this.user.department != "") {
                departmenArrey.push(this.user.department);
                departmenArrey = JSON.stringify(departmenArrey);
            } else {
                departmenArrey = "";
            }
            let data = {
                ids: departmenArrey,
                size: 0,
                page: 0,
                name: this.user.name
            };
            this.$ajax.get(this.$URL + '/department/LoadDeptUsers', {
                params: data
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    let _this = this;
                    this.deptUserData = result.data.data;
                    this.deptUserData.forEach((item, index) => {
                        _this.$set(item, 'Selected', false)
                        item = eval(item)
                        if (_this.tableProcess.length > 0) {
                            _this.tableProcess.forEach(j => {
                                if (j.ID == item.ID) {
                                    _this.$set(item, 'Selected', true)
                                    item = eval(item)
                                }
                            })
                        }
                    });
                }
            });
        },
        // 点击添加人员
        addUser(value) {
            this.dialogVisble_user = true;
            this.addUserType = value;
            if (value == "addSheetFlows") {
                this.tableProcess = JSON.parse(
                    JSON.stringify(this.workorder.SheetFlows)
                );
            } else if (value == "addSupervisors") {
                this.tableProcess = this.workorder.Supervisors;
            }
            this.getUserList();
        },
        //点击选择框
        clickSelectedUser(data, status) {
            if (status) {
                this.tableProcess.push(data);
            } else {
                this.tableProcess.forEach((item, index) => {
                    if (data.ID == item.ID) {
                        this.tableProcess.splice(index, 1);
                    }
                });
            }
        },
        // 确定添加人员
        sureAddUser() {
            if (this.addUserType == "addSheetFlows") {
                this.workorder.SheetFlows = this.tableProcess;
            } else if (this.addUserType == "addSupervisors") {
                this.workorder.Supervisors = this.tableProcess;
            }
            this.dialogVisble_user = false;
        },
        // 选择部门
        handleChangeDepartment(value) {
            this.user.department = value;
            this.getUserList();
        },
        // 提交生成工单
        submitGenerate() {
            if (this.workorder.SheetFlows.length < 1) {
                this.$message.error("请选择执行流程");
                return;
            } else {
                let SheetFlows = [],
                    Supervisor = [];
                this.workorder.SheetFlows.forEach(item => {
                    SheetFlows.push(item.ID);
                });
                if (this.workorder.Supervisors.length > 0) {
                    this.workorder.Supervisors.forEach(element => {
                        Supervisor.push(element.ID);
                    });
                }
                this.$refs.generateForm.getData().then(data => {
                    let text = {
                        RepairSheetId: this.workorder.SheetId,
                        SheetCategoryName: "维修工单",
                        Templete: JSON.stringify(data),
                        TempleteForm: JSON.stringify(this.workorder.TempleteForm),
                        PlanFinishTime: this.workorder.PlanFinishTime,
                        Level: this.workorder.Level,
                        IsJoin: this.workorder.IsJoin,
                        SheetDetail: SheetFlows,
                        Supervisor: Supervisor
                    };
                    this.$ajax.post(this.$URL + '/Sheet/CreateSheet', text).then(result => {
                        if (result.status == 200 && result.data.success) {
                            this.getList();
                            this.$message.success("生成工单成功");
                            this.dialogVisble_workorder = false;
                        }
                    });

                });
            }
        },
        // 关联工单
        repairWorkorder(row) {
            this.$ajax.get(this.$URL + '/Sheet/GetSheetDetail', {
                params: {
                    id: row.SheetId
                }
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.dialogVisble_relation = true;
                    this.relation = result.data.data;
                    (this.relation.DeviceName = row.DeviceName),
                    (this.relation.DeviceArea = row.AreaName);
                }
            });

        },
        handleCurrentChange(val) {
            this.Page = val
            this.getList();
        }
    }
};
</script>

<style lang="less" scoped>
// .app-container {
//     height: 100%;
// }

.header-content {
    span {
        color: #ffffff;
        margin: 0 10px;
    }
}
</style>
