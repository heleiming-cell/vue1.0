<template>
<div class="box">
    <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="任务名称：">
            <el-input v-model="selectForm.KeyWord" placeholder="任务名称" clearable @change="()=>{selectForm.KeyWord==''?getList():''}" @keyup.enter.native="getList"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit>
        <el-table-column label="任务名称" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.TaskName }}</span>
            </template>
        </el-table-column>
        <el-table-column label="任务周期" align="center">
            <template slot-scope="scope">{{ scope.row.TaskCycleDateUnit }}</template>
        </el-table-column>
        <el-table-column label="任务描述" align="center">
            <template slot-scope="scope">{{ scope.row.TaskDescription }}</template>
        </el-table-column>
        <el-table-column label="管理部门" align="center">
            <template slot-scope="scope">{{ scope.row.DepartName }}</template>
        </el-table-column>
        <el-table-column label="开始时间" align="center">
            <template slot-scope="scope">{{ scope.row.StartTime }}</template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
            <template slot-scope="scope">{{ scope.row.EndTime }}</template>
        </el-table-column>
        <el-table-column label="任务状态" align="center">
            <template slot-scope="scope">
                <el-button size="mini" @click="SetStateTask(scope.row)" :type="scope.row.State==1?'success':'info'" plain>{{scope.row.State==1?'启用':'停用'}}</el-button>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="editData(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteData(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="footerBtn">
        <el-button type="primary" @click="addData">新建任务</el-button>
    </div>
    <el-pagination :page-size="listQuery.limit" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total"></el-pagination>
    <!-- 新建任务-->
    <!-- <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" v-if="dialogVisible" :title="dialogTitle" center> -->
    <el-dialog :visible.sync="dialogVisible" v-if="dialogVisible" :title="dialogTitle" center top="50px">
        <div class="taskForm">
            <el-form label-position="right" :model="formData" :rules="formRules" ref="dialogForm" label-width="120px">
                <el-form-item label="任务名称：" prop="TaskName">
                    <el-input v-model="formData.TaskName" placeholder="任务名称"></el-input>
                </el-form-item>
                <el-form-item label="任务类型：" prop="StandardName">
                    <el-select v-model="formData.TaskType" placeholder="请选择">
                        <el-option v-for="item in optionsTaskType" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务级别：" prop="TaskLevel">
                    <el-select v-model="formData.TaskLevel" placeholder="请选择">
                        <el-option v-for="item in optionsSheetLevel" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="formData.TaskType == '现场巡保任务'?'巡检点：':'巡检设备：'">
                    <el-button type="primary" size="mini" @click="() =>{addPoint()}">添加</el-button>
                    <div>
                        <el-tag style="margin-right:5px;" closable type="info" v-for="(item,index) in PointListShow" :key="index" @close="closeTag(item)">{{item.dataName}}</el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="巡检标准：" prop="standard" v-if="formData.TaskType == '现场巡保任务'">
                    <standard @value="selectStandard" />
                </el-form-item>
                <el-form-item label="巡检周期：" prop="TaskCycleNumber">
                    <el-radio-group v-model="formData.TaskCycleDateUnit">
                        <el-radio label="日"></el-radio>
                        <el-radio label="周"></el-radio>
                        <el-radio label="月"></el-radio>
                        <el-radio label="单次"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="执行次数：" v-if="formData.TaskCycleDateUnit!=='单次'">
                    <el-input v-model="formData.TaskCycleNumber"></el-input>
                </el-form-item>
                <el-form-item label="巡检时间：" prop="datePicker" v-if="formData.TaskCycleDateUnit == '单次'">
                    <el-date-picker v-model="formData.datePicker" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" />
                </el-form-item>
                <el-form-item label="任务状态：" label-width="120px" prop="TaskState">
                    <el-radio-group v-model="formData.TaskState">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="巡检部门：" label-width="120px" prop="TaskDepartId">
                    <SelectDepartment :departmentData="formData.DepartStr" @value="selectDepartment" />
                    <!-- <AllCateTree :data_checked_value="formData.TaskDepartId" @value="dialogDeviceDepartMent" /> -->
                </el-form-item>
                <el-form-item label="任务描述：">
                    <el-input v-model="formData.TaskDescription" placeholder="任务描述"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关 闭</el-button>
            <el-button type="primary" @click="updateData('dialogForm')">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogPoint" :title="formData.TaskType=='现场巡保任务'?'选择巡检点':'选择资产'" v-if="dialogPoint" center>
        <!-- 巡检点 -->
        <div style="width:100%" v-if="formData.TaskType == '现场巡保任务'">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="巡检点名称：">
                    <el-input placeholder="巡检点名称" v-model="KeyWord_xj" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="GetPointList">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table style="width: 100%" height="400" @selection-change="handleSelectionChange" @select="clickSelect" ref="multipleTable" :data="dialogPointList">
                <el-table-column type="selection" width="70"></el-table-column>
                <el-table-column label="巡检点编号" prop="PointCode"></el-table-column>
                <el-table-column label="巡检点名称" prop="PointName"></el-table-column>
                <el-table-column label="巡检点描述" prop="PointDescription"></el-table-column>
            </el-table>
            <el-pagination :page-size="listQuery.limit" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total"></el-pagination>
        </div>
        <!-- 资产设备 -->
        <div style="width:100%" v-if="formData.TaskType == '资产巡检任务'">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="资产名称：">
                    <el-input placeholder="资产名称" v-model="KeyWord_zc" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="GetSelectDevice">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table style="width: 100%" height="400" @selection-change="handleSelectionChange" @select="clickSelect" ref="multipleTable" :data="dialogPointList">
                <el-table-column type="selection" width="70"></el-table-column>
                <el-table-column align="center" label="资产编码" prop="Code">
                    <template slot-scope="scope">{{ scope.row.Code }}</template>
                </el-table-column>
                <el-table-column align="center" label="资产名称">
                    <template slot-scope="scope">{{ scope.row.EquipmentName }}</template>
                </el-table-column>

                <el-table-column label="资产类型" align="center">
                    <template slot-scope="scope">{{ scope.row.CategoryName }}</template>
                </el-table-column>
                <el-table-column label="使用部门" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.DeptName }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :page-size="listQuery.limit" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total"></el-pagination>
            <!-- <pagination v-show="total_zc>0" :total="total_zc" :page.sync="listQuery_zc.page" :limit.sync="listQuery_zc.limit" @pagination="GetSelectDevice" /> -->
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogPoint = false">关 闭</el-button>
            <el-button type="primary" @click="savePoint('dialogPointForm')">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import standard from '@/components/filter/standard'
import SelectDepartment from '@/components/filter/SelectDepartment'
export default {
    components: {
        standard,
        SelectDepartment
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: "success",
                draft: "gray",
                deleted: "danger"
            };
            return statusMap[status];
        }
    },
    data() {
        return {
            list: null,
            listLoading: true,
            optionsSheetLevel: ["一般", "紧急", "非常紧急"],
            optionsTaskType: ["现场巡保任务", "资产巡检任务"],

            selectForm: {
                KeyWord: "",
                deptId: "",
                type: ""
            },
            total: 0,
            listQuery: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: "+id"
            },

            dialogVisible: false,
            dialogTitle: "新建任务",

            formData: {
                Id: "",
                TaskName: "",
                TaskDescription: "",
                TaskType: "一般",
                TaskLevel: "",
                TaskCycleNumber: "",
                TaskCycleDateUnit: "",
                TaskDepartId: "",
                TaskState: "",
                TaskStartTime: "",
                TaskEndTime: "",
                PointList: [],
                Devices: [],
                DepartStr: [],
                datePicker: ""
            },
            formRules: {
                TaskName: [{
                    required: true,
                    message: "请输入任务名称",
                    trigger: "blur"
                }],
                TaskCycleNumber: [{
                    required: true,
                    message: "请输入任务周期",
                    trigger: "blur"
                }],
                TaskState: [{
                    required: true,
                    message: "请选择任务状态",
                    trigger: "click"
                }],
                PointList: [{
                    required: true,
                    message: "请选择巡检点或巡检设备",
                    trigger: "change",
                    type: "array"
                }],
                TaskDepartId: [{
                    required: true,
                    message: "请选择巡检部门",
                    trigger: "change",
                    type: "number"
                }],
                datePicker: [{
                    required: true,
                    message: "请选择时间",
                    trigger: "change"
                }],
                TaskLevel: [{
                    required: true,
                    message: "请选择任务级别",
                    trigger: "change"
                }]
            },

            total_zc: 0,
            KeyWord_zc: "",
            listQuery_zc: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: "+id"
            },

            KeyWord_xj: "",
            total_xj: 0,
            listQuery_xj: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: "+id"
            },

            dialogPoint: false,
            dialogPointList: [],
            StandardArr: [],
            PointListShow: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            let StartDate = "";
            let EndDate = "";
            if (this.selectForm.datePicker) {
                StartDate = this.selectForm.datePicker[0];
                EndDate = this.selectForm.datePicker[1];
            } else {
                StartDate = "";
                EndDate = "";
            }
            this.listLoading = true;
            let data = {
                taskType: this.selectForm.type,
                taskName: this.selectForm.KeyWord,
                deptId: this.selectForm.deptId,
                Page: this.listQuery.page,
                Size: this.listQuery.limit,
                start: StartDate,
                end: EndDate
            };
            this.$ajax
                .get(this.$URL + "/SysTask/GetList", {
                    params: data
                })
                .then(result => {
                    if (result.status == 200 && result.data.success) {
                        this.listLoading = false;
                        this.total = result.data.count;
                        this.list = result.data.data;
                    }
                });
        },
        //新建任务
        addData() {
            this.dialogTitle = "新建任务";
            this.formData = {
                Id: "",
                TaskName: "",
                TaskDescription: "",
                TaskType: "现场巡保任务",
                TaskLevel: "",
                TaskCycleNumber: 1,
                TaskCycleDateUnit: "日",
                TaskDepartId: "",
                TaskState: 1,
                TaskStartTime: "",
                TaskEndTime: "",
                PointList: [],
                Devices: [],
                DepartStr: [],
                datePicker: ""
            };
            this.PointListShow = [];
            this.dialogVisible = true;
        },
        //编辑任务
        editData(row) {
            this.$ajax
                .get(this.$URL + "/SysTask/GetDetail", {
                    params: {
                        id: row.Id
                    }
                })
                .then(result => {
                    if (result.status == 200 && result.data.success) {
                        let data = result.data.data;
                        this.dialogTitle = "编辑任务";
                        this.formData = {
                            Id: data.Id,
                            TaskName: data.TaskName,
                            TaskDescription: data.TaskDescription,
                            TaskType: data.TaskType,
                            TaskLevel: data.TaskLevel || "一般",
                            TaskCycleNumber: data.TaskCycleNumber,
                            TaskCycleDateUnit: data.TaskCycleDateUnit,
                            TaskDepartId: data.DepartId,
                            DepartStr: data.DepartStr == "" ? [] : JSON.parse(data.DepartStr),
                            TaskState: data.State,
                            TaskStartTime: data.StartTime,
                            TaskEndTime: data.EndTime,
                            PointList: [],
                            Devices: [],
                            datePicker: ""
                        };
                        this.PointListShow = data.DataList;
                        this.dialogVisible = true;
                    }
                });
        },
        //删除任务
        deleteData(row) {
            this.$confirm("此操作将永久删除该任务, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$ajax
                    .get(this.$URL + "/SysTask/DeleteTask", {
                        params: {
                            taskId: row.Id
                        }
                    })
                    .then(result => {
                        if (result.status == 200 && result.data.success) {
                            this.getList();
                            this.$message.success("删除成功！");
                        }
                    });
            });
        },
        //选择任务类型
        selectFormDataTaskType() {},
        //选择巡检部门
        selectDepartment(val) {
            this.formData.DepartStr = val;
            this.formData.TaskDepartId = val[val.length - 1];
        },
        //添加巡检点
        addPoint() {
            if (this.formData.TaskType == "资产巡检任务") {
                this.listQuery_zc = {
                    page: 1,
                    limit: 10,
                    importance: undefined,
                    title: undefined,
                    type: undefined,
                    sort: "+id"
                };
                this.GetSelectDevice();
            } else if (this.formData.TaskType == "现场巡保任务") {
                this.listQuery_xj = {
                    page: 1,
                    limit: 10,
                    importance: undefined,
                    title: undefined,
                    type: undefined,
                    sort: "+id"
                };
                this.GetPointList();
            }
        },
        //获取巡检点列表
        GetPointList() {
            let data = {
                keyWord: this.KeyWord_xj,
                page: this.listQuery_xj.page,
                size: this.listQuery_xj.limit
            };
            this.$ajax
                .get(this.$URL + "/SysPoint/GetPointList", {
                    params: data
                })
                .then(result => {
                    if (result.status == 200 && result.data.success) {
                        if (!this.dialogPoint) {
                            this.dialogPoint = true;
                        }
                        this.dialogPointList = result.data.data;
                        this.total_xj = result.data.count;
                        this.$nextTick(() => {
                            this.dialogPointList.forEach(row => {
                                if (this.PointListShow && this.PointListShow.length > 0) {
                                    this.PointListShow.forEach(item => {
                                        if (item.Id == row.Id) {
                                            this.$refs.multipleTable.toggleRowSelection(row);
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
        },
        //获取设备资产列表
        GetSelectDevice() {
            let data = {
                areaID: "",
                deptID: "",
                deviceType: "",
                state: "",
                expireState: "",
                startDate: "",
                endDate: "",
                type: "",
                keyWord: this.KeyWord_zc,
                page: this.listQuery_zc.page,
                size: this.listQuery_zc.limit,
                sysCode: ""
            };
            this.$ajax.get(this.$URL + '/Device/AllList', {
                params: data
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    if (!this.dialogPoint) {
                        this.dialogPoint = true;
                    }
                    this.dialogPointList = result.data.data;
                    this.total_zc = result.data.count;
                    this.$nextTick(() => {
                        this.dialogPointList.forEach(row => {
                            if (this.PointListShow && this.PointListShow.length > 0) {
                                this.PointListShow.forEach(item => {
                                    if (item.Id == row.ID) {
                                        this.$refs.multipleTable.toggleRowSelection(row);
                                    }
                                });
                            }
                        });
                    });
                }
            });
        },
        //列表选择
        handleSelectionChange(val) {
            if (this.formData.TaskType == "资产巡检任务") {
                val.forEach(item => {
                    let a = this.PointListShow.some(i => {
                        return i.Id == item.ID;
                    });
                    if (!a) {
                        let obj = {
                            dataName: item.EquipmentName,
                            Id: item.ID
                        };
                        this.PointListShow.push(obj);
                    }
                });
            } else {
                val.forEach(item => {
                    let a = this.PointListShow.some(i => {
                        return i.Id == item.Id;
                    });
                    if (!a) {
                        let obj = {
                            dataName: item.PointName,
                            Id: item.Id
                        };
                        this.PointListShow.push(obj);
                    }
                });
            }
        },
        // 点击表格中的选择框
        clickSelect(selection, row) {
            if (this.formData.TaskType == "资产巡检任务") {
                if (selection.indexOf(row) == -1) {
                    this.PointListShow = this.PointListShow.filter(item => {
                        return item.Id !== row.ID;
                    });
                }
            } else {
                if (selection.indexOf(row) == -1) {
                    this.PointListShow = this.PointListShow.filter(item => {
                        return item.Id !== row.Id;
                    });
                }
            }
        },
        //删除巡检点
        closeTag(val) {
            let arr = JSON.parse(JSON.stringify(this.PointListShow));
            this.PointListShow = arr.filter(item => {
                if (item.Id !== val.Id) {
                    return item;
                }
            });
        },
        //保存巡检点或资产设备
        savePoint(formName) {
            // let point = this.dialogPointForm.point;
            // this.formData.PointListShow = point.map(item => {
            //     let obj = {
            //         Name: item.Name,
            //         Id: item.Id
            //     };
            //     return obj;
            // });
            // this.formData.PointList = this.formData.PointListShow
            this.dialogPoint = false;
        },
        //选择标准
        selectStandard(val) {
            this.StandardArr = val;
        },
        //设置巡检任务启用状态
        SetStateTask(row) {
            let data = {
                id: row.Id,
                state: row.State == 1 ? 0 : 1
            };
            this.$ajax
                .get(this.$URL + "/SysTask/ChangeState", {
                    params: data
                })
                .then(result => {
                    if (result.status == 200 && result.data.success) {
                        this.getList();
                        this.$message.success("操作成功!");
                    }
                });
        },
        //新增或修改巡检任务
        updateData(formName) {
            if (this.formData.TaskCycleDateUnit == "单次") {
                this.formData.TaskCycleNumber = 1;
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let arr = [];
                    let Devices = [];
                    if (this.formData.TaskType == "现场巡保任务") {
                        this.PointListShow.forEach(item => {
                            let obj = {
                                PointId: item.Id,
                                StandardIds: this.StandardArr.join("|")
                            };
                            arr.push(obj);
                        });
                    } else {
                        this.PointListShow.forEach(item => {
                            Devices.push(item.Id);
                        });
                    }
                    let data = {
                        Id: this.formData.Id,
                        TaskName: this.formData.TaskName,
                        TaskDescription: this.formData.TaskDescription,
                        TaskType: this.formData.TaskType,
                        TaskLevel: this.formData.TaskLevel,
                        TaskCycleNumber: this.formData.TaskCycleNumber,
                        TaskCycleDateUnit: this.formData.TaskCycleDateUnit,
                        TaskDepartId: this.formData.TaskDepartId,
                        TaskState: this.formData.TaskState,
                        TaskStartTime: this.formData.datePicker[0] || "",
                        TaskEndTime: this.formData.datePicker[1] || "",
                        PointList: arr,
                        DepartStr: this.formData.DepartStr,
                        Devices: Devices
                    };
                    this.$ajax
                        .post(this.$URL + "/SysTask/CreateTask", data)
                        .then(result => {
                            if (result.status == 200 && result.data.success) {
                                this.getList();
                                this.dialogVisible = false;
                                this.$message.success("保存成功！");
                            }
                        });
                } else {
                    return false;
                }
            });
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getList();
        }
    }
};
</script>

<style scoped>
.footerBtn {
    margin: 10px 0;
    width: 100%;
    text-align: right;
}

.taskForm {
    max-height: 600px;
    overflow: auto;
}
</style>
