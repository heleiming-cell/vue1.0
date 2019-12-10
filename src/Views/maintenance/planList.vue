<template>
<!-- 维保计划列表 -->
<div class="tableScrollbar">
    <el-row class="planListContainer">
        <el-col class="planTitle">
            <el-form :model="planForm" :inline="true">
                <el-form-item label="关键字：">
                    <el-input v-model="planForm.keyWord"></el-input>
                </el-form-item>
                <el-form-item label="资产类型：">
                    <el-select v-model="planForm.type" @change="deviceChange">
                        <el-option v-for="(item,i) in options" :key="i" :label="item.Name" :value="item.Id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="起始时间：">
                    <datePicker @startFun="startFun" @endFun="endFun"></datePicker>
                </el-form-item>
                 <el-form-item label="项目">
                        <Project :value="ProjectIdSearch" :cate="'project'" @change="projectChange" />
                    </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryClick">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col class="table">
            <el-table :data="tableData" max-height="calc(100% - 150px)">
                <el-table-column label="维保计划编号" prop="PlanNumber" align="center"></el-table-column>
                <el-table-column label="维保计划名称" prop="PlanName" align="center"></el-table-column>
                <el-table-column label="资产类型" prop="DeviceCategoryName" align="center"></el-table-column>
                <el-table-column label="维保周期" prop="Days" align="center"></el-table-column>
                <el-table-column label="关联维保标准" align="center">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.StandardItem" :key="item.Id" class="tabletext">{{item.Name}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="执行时间" prop="ExecuteTime" align="center"></el-table-column>
                <el-table-column label="关联设备" align="center">
                    <template slot-scope="scope">
                        <div v-for="item in scope.row.DeviceList" :key="item.Id" class="tabletext">{{item.Name}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="执行周期" prop="Period" align="center">
                </el-table-column>
                <el-table-column label="计划状态" prop="State" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="detailClick(scope.row)">详情</el-button>
                        <el-button type="text" @click="modificationClick(scope.row)">修改</el-button>
                        <el-button type="text" @click="deleteClick(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-col class="addPlan">
            <el-button type="primary" @click="addPlan" size="small">新增计划</el-button>
        </el-col>
        <el-col>
            <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getPlanList" />
        </el-col>
    </el-row>

    <!--详情弹窗 -->
    <detailDialog :visible="detailVisible" @close="detailDialogColse" :detailData="detailData"></detailDialog>
    <!-- 删除 -->
    <el-dialog :visible="deleteDialog" title="删除提示" width="30%">
        <div class="deleteName">是否将 <span>{{deleteTitle}}</span> 删除？</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialog = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="deleteplanClick" size="mini">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改/新增 -->
    <el-dialog :visible.sync="editorvisible" :title="title" @close="editorDialogColse">
        <el-row>
            <el-col :span="12" class="formLfet">
                <el-form :model="editorForm" label-width="120px" :inline="true">
                    <el-form-item label="计划名称：">
                        <el-input v-model="editorForm.PlanName" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="计划状态：">
                        <el-radio-group v-model="editorForm.State">
                            <el-radio label="启用">启用</el-radio>
                            <el-radio label="停用">停用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="维保间隔：">
                        <el-input v-model="editorForm.Days" class="interval">
                            <template slot="append">天</template></el-input>
                    </el-form-item>
                    <el-form-item label="关联维保标准：">
                        <el-input v-model="editorForm.knowledge" :disabled="standardDisabled" v-if="!knowledgeOption.length>0">{{editorForm.knowledge}}</el-input>
                        <el-select v-model="knowledge" v-if="knowledgeOption.length>0" @change="knowledgeClick">
                            <el-option v-for="item in knowledgeOption" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目">
                        <Project :value="ProjectId" :cate="'project'" @change="changeProjectId" />
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12" class="formRight">
                <el-form :model="editorForm" label-width="120px" :inline="true">
                    <el-form-item label="资产类型：">
                        <el-select v-model="editorForm.DeviceCategoryName" @change="DeviceCategoryChange">
                            <el-option v-for="item in options" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="执行周期：">
                        <el-radio-group v-model="editorForm.Period">
                            <el-radio label="单次">单次</el-radio>
                            <el-radio label="循环">循环</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="执行时间：">
                        <el-date-picker v-model="editorForm.ExecuteTime" type="datetime" placeholder="选择日期时间：">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="关联设备：">
                        <el-button type="primary" @click="addequipment" :disabled="disabled" size="small">添加设备</el-button>
                        <el-select v-model="DeviceList" multiple class="DeviceList" collapse-tags style="width:100%">
                            <el-option v-for="item in deviceListOption" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="planDetail">
                <el-form :model="editorForm" label-width="120px">
                    <el-form-item label="计划详情：">
                        <div class="planTextArea">
                            <p v-for="(item,index) in planTextArea" :key="index">{{index+1}}、{{item.Name}}</p>
                        </div>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editorvisible = false">取 消</el-button>
            <el-button type="primary" @click="editorDialogPlan">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import datePicker from '@/components/filter/datePicker'
import pagiNation from '@/components/common/pagination.vue'
import detailDialog from '@/components/common/detailDialog.vue' //详情
import addDialog from '@/components/common/addDialog.vue' //新建
import Project from '@/components/filter/Project'
import {
    GetPagePlanList,
    DeletePlan,
    DeviceCategory_QueryList,
    Device_QueryList,
    AddPlan,
    GetPlan,
    UpdatePlan,
    PageList
} from '@/api/planList'
import {
    DateTime
} from '@/util/DateTime'
export default {
    //  inject: ['reload'],
    components: {
        datePicker,
        pagiNation,
        detailDialog,
        Project
    },
    data() {
        return {
            editorvisible: false,
            detailVisible: false,
            deleteDialog: false,
            deleteTitle: "", //删除标题
            title: "", //新建编辑标题
            planId: "",
            planForm: {
                keyWord: "",
                type: "",
                startTime: "2000-01-01 00:00:00",
                endTime: "",
                deviceId: '',
            },
            options: [],
            listQuery: {
                page: 1,
                limit: 10,
                total: 0,
                size: 10,
            },
            editorForm: {
                State: "启用",
                Period: "单次"
            }, //编辑新增form表单数据
            PlanDetails: [], //计划详情数组
            tableData: [],
            detailData: "",
            deviceListOption: [], //弹出框关联设备下拉列表
            planTextArea: [], //计划详情
            knowledgeOption: [], //关联维保标准下拉列表
            knowledge: "",
            DeviceList: [], //弹框关联设备列表
            StandardID: "",
            disabled: false,
            standardDisabled: true,
            ProjectId: '',
            ProjectIdSearch:'',
        }
    },
    methods: {
        changeProjectId(val) {
            this.ProjectId = val;
        },
        projectChange(val){
          this.ProjectIdSearch=val;
        },
        // 开始时间
        startFun(val) {
            this.planForm.startTime = val
        },
        // 结束时间
        endFun(val) {
            this.planForm.endTime = val
        },
        // 详情dialog
        detailDialogColse() {
            this.detailVisible = false;
        },
        // 点击详情
        detailClick(row) {
            this.standardDisabled = true;
            GetPlan({
                id: row.Id
            }).then(res => {
                this.detailData = res.Data;
                this.detailVisible = true;
            })
        },
        // 删除
        deleteClick(row, val) {
            this.planId = row.Id;
            this.deleteTitle = row.PlanNumber;
            this.deleteDialog = true;
            this.pageType = val;
        },
        // 删除
        deleteplanClick() {
            this.deleteDialog = false;
            DeletePlan({
                id: this.planId
            }).then(res => {
                this.$message.success('删除成功！');
                this.getPlanList();
                // this.reload()
            })
        },
        // 获取列表
        getList(params) {
            GetPagePlanList(params).then(res => {
                this.tableData = res.Data.Data
                this.listQuery.total = res.Data.Count;
                this.getDeviceList()
            })
        },
        // 获取列表
        getPlanList() {
            let params = {
                page: this.listQuery.page,
                size: this.listQuery.size,
                startTime: this.planForm.startTime,
                endTime: this.planForm.endTime,
            }
            this.getList(params)
        },
        // 查询
        queryClick() {
            let params = {
                page: this.listQuery.page,
                size: this.listQuery.size,
                keyword: this.planForm.keyWord,
                categoryType: this.planForm.deviceId,
                startTime: this.planForm.startTime ? this.planForm.startTime : '2000-01-01 00:00:00',
                endTime: this.planForm.endTime ? this.planForm.endTime : new DateTime().getNowDate(),
                projectId:this.ProjectIdSearch
            }
            this.getList(params)
        },
        // 页面资产管理下拉列表
        deviceChange(val) {
            this.planForm.deviceId = val
        },
        // 获取资产类型列表
        getDeviceList() {
            this.options = [];
            let params = {
                page: 1,
                size: 200,
                OrderBys: [],
                Conditions: []
            }
            DeviceCategory_QueryList(params).then(res => {
                let data = res.Data.Data;
                this.options = res.Data.Data
            })
        },
        //**************************编辑新增***********************
        // 修改
        modificationClick(row) {
            this.standardDisabled = false
            this.DeviceList = [];
            this.title = "修改计划详情";
            GetPlan({
                id: row.Id
            }).then(res => {
                this.editorForm = res.Data;
                res.Data.DeviceList.forEach(item => {
                    this.DeviceList.push(item.Id)
                })
                this.editorForm.DeviceCategoryName = res.Data.DeviceCategoryId;
                this.knowledge = res.Data.StandardName
                this.planTextArea = res.Data.StandardItem
                this.deviceListOption = res.Data.DeviceList
                this.StandardID = this.editorForm.StandardID
            })
            this.editorvisible = true;
            this.knowledgeOptionlist();
        },
        //添加关联设备
        addequipment() {
            let params = {
                page: 1,
                size: 200,
                OrderBys: [],
                Conditions: [{
                    Key: "CategoryId",
                    Operator: 0,
                    Value: this.editorForm.DeviceCategoryId,
                }]
            }
            this.deviceQueryList(params)
        },
        // 获取关联维保标准
        deviceQueryList(params) {
            Device_QueryList(params).then(res => {
                let data = res.Data.Data;
                data.forEach(item => {
                    this.deviceListOption.push(item)
                    this.DeviceList.push(item.Id)
                })
                this.disabled = true;
            })
        },
        // 资产类型下拉列表
        DeviceCategoryChange(val) {
            this.editorForm.DeviceCategoryId = val;
            this.editorForm.DeviceCategoryId ? this.disabled = false : this.disabled = true;
            this.deviceListOption = [];
            this.DeviceList = [];
        },
        // 提交修改详情信息
        editorDialogPlan() {
            let params = {
                Id: this.editorForm.Id,
                FK_DeviceCategory: this.editorForm.DeviceCategoryId,
                FK_Standard: this.StandardID,
                PlanName: this.editorForm.PlanName,
                Period: this.editorForm.Period,
                Days: parseInt(this.editorForm.Days),
                ExecuteTime: this.$moment(this.editorForm.ExecuteTime).format('YYYY-MM-DD HH:mm:ss'),
                State: this.editorForm.State,
                DeviceList: this.DeviceList.join(','),
                ProjectId: this.ProjectId
            }
            if (this.title == "修改计划详情") {
                UpdatePlan(params).then(res => {
                    this.editorvisible = false;
                    this.$message.success(res.Message);
                    this.getPlanList();
                    //  this.reload()
                })
            } else {
                AddPlan(params).then(res => {
                    this.editorvisible = false;
                    this.$message.success(res.Message);
                    this.getPlanList();
                    //  this.reload()
                })
            }

        },
        // 新增计划
        addPlan() {
            this.StandardID = "";
            this.editorForm.DeviceCategoryId ? this.disabled = false : this.disabled = true;
            this.title = "新增计划详情"
            this.editorForm = {
                    State: "启用",
                    Period: "单次"
                },
                this.DeviceList = [];
            this.planTextArea = [];
            this.editorvisible = true;
            this.knowledgeOptionlist();

        },
        // 关联维保下来列表
        knowledgeClick(val) {
            this.planTextArea = [];
            this.StandardID = val;
            this.knowledgeOption.forEach(item => {
                if (item.Id == this.StandardID) {
                    this.planTextArea = item.StandardItems
                }
            })
        },
        editorDialogColse() {
            this.knowledge = "";
            this.deviceListOption = [];
        },
        knowledgeOptionlist() {
            let params = {
                page: 1,
                size: 200,
                OrderBys: [],
                Conditions: [{
                    key: "TypeId",
                    Operator: 0,
                    // Value: '160c3d25-ebd9-1dc1-95e2-a7fcfb326753'
                    Value: ''
                }]
            }
            PageList(params).then(res => {
                this.knowledgeOption = res.Data.Data;
            })
        }
    },
    mounted() {
        let date = new DateTime();
        this.planForm.endTime = date.getNowDate();
        this.getPlanList();

    },
}
</script>

<style lang="scss" scoped>
.tableScrollbar {
    font-size: 12px;
    height: calc(100% - 115px);
}

.planListContainer {
    height: 95%;
    text-align: left;
    overflow-y: auto;

    .planTitle {
        padding: 20px 0 10px 15px;

        .table {
            margin-top: 10px;

            .tabletext {
                font-size: 12px;
            }
        }
    }

    .addPlan {
        text-align: right;
        padding: 20px 30px 0 0;
    }

    .deleteName {
        color: #5FA6FE;

        span {
            color: #ffffff;
        }
    }
}

.el-dialog__body {
    padding: 50px 10px !important;

    .formRight,
    .formLfet,
    .planDetail {
        text-align: left;

        .planTextArea {
            height: 150px;
            overflow: hidden;
            width: 85%;
            padding: 0 10px;
            border: 1px solid #2A93F4;
            border-radius: 3px;
        }

        .DeviceList {
            width: 45%;
        }
    }

    .el-input-group {
        width: 84%;
    }
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover,
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected,
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover {
    background-color: #010101;
}

p {
    margin: 0;
    height: 30px;
}

.el-table {
    .el-table .cell {
        line-height: 14px !important;
    }
}
</style>
