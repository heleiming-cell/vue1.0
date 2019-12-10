<template>
<div class="inspection-container">
    <div class="filter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="任务名称">
                <el-input v-model="formInline.Name" placeholder="任务名称" clearable=""></el-input>
            </el-form-item>
            <!-- <el-form-item label="执行组">
                <el-select v-model="formInline.TeamId" placeholder="维护组">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="项目">
                <Project :value="ProjectId" :cate="'project'" @change="changeProjectId" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" height="calc(100% - 160px)">
        <el-table-column prop="Name" label="任务名称" align="center">
        </el-table-column>
        <!-- <el-table-column prop="CycleUnit" label="计划周期" align="center">
        </el-table-column> -->
        <el-table-column prop="Level" label="任务级别" align="center">

        </el-table-column>
        <el-table-column label="任务类型" align="center">
            <template slot-scope="scope">
                {{scope.row.Type==1?'现场巡检':'资产巡检'}}
            </template>
        </el-table-column>
        <el-table-column prop="TeamName" label="执行组" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="editData(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="addPlan(scope.row)">添加计划</el-button>
                <el-button type="text" size="small" @click="removeData(scope.row)" style="color:#E98E8E">删除</el-button>

            </template>
        </el-table-column>
    </el-table>
    <div class="add-new">
        <el-button type="primary" @click="editData('new')" size="small">新建任务</el-button>
    </div>
    <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 新建、编辑任务 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" v-if="dialogVisible" v-el-drag-dialog>
        <el-form :model="dialogForm" :label-width="'120px'" :rules="dialogrules" ref="dialogForm">
            <el-form-item label="任务名称：" prop="Name">
                <el-input v-model="dialogForm.Name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="任务级别：" prop="Level">
                <AllEnums :value="dialogForm.Level" @change="changeLevel" />
            </el-form-item>
            <el-form-item label="任务类型：" prop="Type">
                <el-select v-model="dialogForm.Type" placeholder="请选择" @change="changeType">
                    <el-option label="现场巡检" :value="1"></el-option>
                    <el-option label="资产巡检" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目：" prop="ProjectId">
                <Project :value="dialogForm.ProjectId" :cate="'project'" @change="changeProjectId" />
            </el-form-item>
            <el-form-item label="巡检组：" prop="TeamId">
                <Project :value="dialogForm.TeamId" :cate="'team'" :id="dialogForm.ProjectId" @change="changeTeamId" :disabled="dialogForm.ProjectId?false:true" />
            </el-form-item>
            <el-form-item label="巡检点：" v-if="dialogForm.ProjectId !=='' && dialogForm.Type == 1">
                <el-button type="primary" size="mini" @click="changePoint">添加</el-button>
                <div>
                    <el-tag type="info" v-for="(item,index) in DataItems" :key="index" style="margin-right:5px">{{item.DataName}}</el-tag>
                </div>
            </el-form-item>
            <el-form-item label="巡检设备：" v-if="dialogForm.ProjectId !=='' && dialogForm.Type == 2">
                <el-button type="primary" size="mini" @click="changePoint">添加</el-button>
                <div>
                    <el-tag type="info" v-for="(item,index) in DataItems" :key="index" style="margin-right:5px">{{item.DataName}}</el-tag>
                </div>
            </el-form-item>
            <el-form-item label="任务描述：" prop="Description">
                <el-input v-model="dialogForm.Description" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitDialog">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 添加计划 -->
    <el-dialog title="添加计划" class="CronDialog" :visible.sync="planVisible" v-if="planVisible" v-el-drag-dialog>
        <div style="text-align:left">计划状态：<el-switch v-model="State" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
        </div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="周期" name="first">
                <cron v-model="cronData" />
            </el-tab-pane>
            <el-tab-pane label="单次" name="second">
                <el-date-picker v-model="StartTime" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
            </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
            <el-button @click="planVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitCron">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 添加巡检点 -->
    <el-dialog title="添加巡检项" :visible.sync="pointVisible" v-if="pointVisible" v-el-drag-dialog>
        <div class="pointVisible flex">
            <div class="point">
                <el-tree :data="pointOptions" show-checkbox node-key="Id" :props="pointDefaultProps" ref='pointTree' @check="checkPoint" @check-change="checkChangePoint" :check-on-click-node="false">
                    <div class="custom-tree-node" slot-scope="{ node, data }">
                        <span :style=" data.Id== treeActiveId?'color:#409eff':''" @click="clickLabel(data)">{{ node.label }}</span>
                    </div>
                </el-tree>
            </div>
            <div class="standard">
                <el-tree :data="standardOptions" show-checkbox node-key="Id" ref='standardTree' :props="pointDefaultProps" @check="checkStandard" @check-change="checkChangeStandard" :check-on-click-node="true">
                </el-tree>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="pointVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitPointDialog">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    inspectTask_List,
    inspectTask_Del,
    inspectTask_AddOrUpdate,
    inspectTask_QueryOne,
    inspectTask_TaskBindPlan,
    inspectTask_GetTaskPlan,
    inspectTask_UpdateState,
} from '@/api/inspectTask'
import {
    inspectPoint_QueryList,
} from '@/api/inspectPoint'
import {
    Device_DeviceList,
} from '@/api/Device'
import {
    Public_GetAllCate,
} from '@/api/Public'
import {
    Standard_PageList,
} from '@/api/Standard'
import pagiNation from '@/components/common/pagination'
import AllEnums from '@/components/filter/AllEnums'
import Project from '@/components/filter/Project'
import cron from './components/cron'
export default {
    components: {
        pagiNation,
        AllEnums,
        Project,
        cron
    },
    data() {
        return {
            formInline: {
                Name: '',
                TeamId: ''
            },
            listQuery: {
                page: 1,
                limit: 10,
                total: 0,
            },
            tableData: [],

            dialogVisible: false,
            dialogTitle: '新建任务',
            dialogForm: {
                "Id": "",
                "TeamId": "",
                "TeamName": "",
                "Type": 1,
                "Description": "",
                "Level": "",
                "Name": "",
                "Code": "",
                "ProjectId": "",
                "ProjectName": "",
                "CycleUnit": "",
                "State": "",
                "CreaterId": "",
                "CreaterName": "",
                "CreateTime": "",
                "DataItems": [{
                    "Id": "",
                    "standardItems": [{
                        "Id": ""
                    }]
                }]
            },
            pointOptions: [],
            pointDefaultProps: {
                children: 'children',
                label: 'Name'
            },
            pointValue: [],
            standardOptions: [],
            StandardValue: [],
            planVisible: false,
            cronData: '',
            activeName: 'first',
            StartTime: null,
            State: 0,

            dialogrules: {
                Name: [{
                    required: true,
                    message: '该项为必填',
                    trigger: 'blur'
                }, ],
                Level: [{
                    required: true,
                    message: '该项为必填',
                    trigger: 'blur'
                }, ],
                Type: [{
                    required: true,
                    message: '该项为必填',
                    trigger: 'blur'
                }, ],
                ProjectId: [{
                    required: true,
                    message: '该项为必填',
                    trigger: 'blur'
                }, ],
                TeamId: [{
                    required: true,
                    message: '该项为必填',
                    trigger: 'blur'
                }, ],
                Description: [{
                    required: true,
                    message: '该项为必填',
                    trigger: 'blur'
                }, ],
            },

            pointVisible: false,
            treeActiveId: "",
            DataItems: [],
            ProjectId: ''
        }
    },
    watch: {
        pointVisible(n) {
            if (!n) {
                this.pointOptions.forEach(item => {
                    this.DataItems.forEach(d => {
                        if (item.Id == d.Id) {
                            d.DataName = item.Name
                        }
                    })
                })
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getPointList() {
            let data = {
                "Page": 1,
                "Size": 10000,
                "OrderBys": [],
                "Conditions": [{
                    "Key": "ProjectId",
                    "Operator": 0,
                    "Value": this.dialogForm.ProjectId
                }],
            }
            if (this.dialogForm.Type == 2) { //资产巡检

                let data1 = {
                    cate: 'standard_zc',
                    id: this.dialogForm.ProjectId
                }
                Public_GetAllCate(data1).then(res => {
                    this.standardOptions = res.Data
                })

                Device_DeviceList(data).then(res => {
                    this.pointOptions = res.Data.Data
                })
            } else {
                let data1 = {
                    cate: 'standard_xc',
                    id: this.dialogForm.ProjectId
                }
                Public_GetAllCate(data1).then(res => {
                    this.standardOptions = res.Data
                })

                inspectPoint_QueryList(data).then(res => {
                    this.pointOptions = res.Data.Data
                })
            }

        },
        getList() {
            let data = {
                "Page": this.listQuery.page,
                "Size": this.listQuery.limit,
                "OrderBys": [],
                "Conditions": [{
                        "Key": "Name",
                        "Operator": 0,
                        "Value": this.formInline.Name
                    },
                    {
                        "Key": "ProjectId",
                        "Operator": 0,
                        // "Value": this.formInline.TeamId
                        "Value":this.ProjectId
                    },
                   
                ]
            }
            inspectTask_List(data).then(res => {
                this.tableData = res.Data.Data
                this.listQuery.total = res.Data.Count
            })
        },
        onSubmit() {
            this.listQuery.page = 1
            this.getList()
        },
        //编辑
        editData(row) {
            if (row == 'new') {
                this.dialogTitle = '新建任务'
                this.pointValue = []
                this.StandardValue = []
                this.dialogForm = {
                    "Id": "",
                    "TeamId": "",
                    "TeamName": "",
                    "Type": 1,
                    "Description": "",
                    "Level": "",
                    "Name": "",
                    "Code": "",
                    "ProjectId": "",
                    "ProjectName": "",
                    "CycleUnit": "",
                    "State": "",
                    "CreaterId": "",
                    "CreaterName": "",
                    "CreateTime": "",
                    "DataItems": []
                }
                this.dialogVisible = true

            } else {
                inspectTask_QueryOne({
                    id: row.Id
                }).then(res => {
                    this.dialogTitle = '编辑任务'
                    this.dialogForm = res.Data
                    this.DataItems = []
                    this.dialogForm.dataItems.forEach(item => {
                        let StandardItems = []
                        item.StandardItems.forEach(s => {
                            let o = {
                                Id: s.StandardId
                            }
                            StandardItems.push(o)
                        })
                        let obj = {
                            Id: item.DataId,
                            DataName: item.DataName,
                            StandardItems: StandardItems
                        }
                        this.DataItems.push(obj)
                    })

                    this.dialogVisible = true

                })

                // this.dialogForm
            }
        },
        //删除
        removeData(row) {
            this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                inspectTask_Del({
                    id: row.Id
                }).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList()
                })

            }).catch(() => {

            });
        },
        //添加计划
        addPlan(row) {
            inspectTask_GetTaskPlan({
                id: row.Id
            }).then(res => {
                this.dialogForm = res.Data
                this.cronData = this.dialogForm.CronString
                this.StartTime = this.dialogForm.StartTime
                this.State = this.dialogForm.State == 1 ? true : false
                this.planVisible = true
            })

        },
        //保存任务
        submitDialog() {

            this.$refs['dialogForm'].validate((valid) => {
                if (valid) {
                    let DataItems = []
                    let standardItems = []

                    let data = {
                        "Id": this.dialogForm.Id,
                        "TeamId": this.dialogForm.TeamId,
                        "Type": this.dialogForm.Type,
                        "Description": this.dialogForm.Description,
                        "Level": this.dialogForm.Level,
                        "Name": this.dialogForm.Name,
                        "Code": this.dialogForm.Code,
                        "ProjectId": this.dialogForm.ProjectId,
                        "DataItems": this.DataItems
                    }
                    inspectTask_AddOrUpdate(data).then(res => {
                        this.$message.success('保存成功！')
                        this.getList()
                        this.dialogVisible = false
                    })
                }
            })
        },
        //选择任务级别
        changeLevel(val) {
            this.dialogForm.Level = val
        },
        //选择项目
        changeProjectId(val) {
            this.dialogForm.ProjectId = val
            this.dialogForm.TeamId = null
            this.ProjectId=val;
            this.getPointList()
        },
        //选择任务类型
        changeType() {
            this.DataItems = []
        },
        //选择组
        changeTeamId(val) {
            this.dialogForm.TeamId = val
        },
        //选择巡检点
        changePoint(val) {
            this.getPointList()
            this.pointValue = []
            this.StandardValue = []
            this.treeActiveId = ''
            this.DataItems.forEach(item => {
                this.pointValue.push(item.Id)

            })
            if (this.DataItems.length > 0) {
                this.treeActiveId = this.DataItems[0].Id
                this.DataItems[0].StandardItems.forEach(i => {
                    this.StandardValue.push(i.Id)
                })
            }
            setTimeout(() => {
                this.$refs.pointTree.setCheckedKeys(this.pointValue);
                this.$refs.standardTree.setCheckedKeys(this.StandardValue);
            }, 100);
            this.pointVisible = true
        },
        //选择标准
        changeStandard(val) {
            if (val) {
                this.StandardValue = val
            }
        },
        //保存计划
        submitCron() {
            let data = {
                "CronString": this.cronData == '* * * ? * * *' ? '' : this.cronData,
                "TaskId": this.dialogForm.TaskId,
                "StartTime": this.StartTime ? this.StartTime : '',
                "CycleUnit": this.activeName == 'second' ? '单次' : '',
                "State": this.State ? 1 : 0
            }
            inspectTask_TaskBindPlan(data).then(res => {
                this.planVisible = false
                this.getList()
                this.$message.success('添加成功！')
            })
        },
        //选择巡检点
        checkPoint(data) {
            // this.treeActiveId = data.Id
        },
        checkChangePoint(data, node, ) {
            this.StandardValue = []
            this.treeActiveId = data.Id
            if (node) { //节点被选中
                if (this.pointValue.indexOf(data.Id) == -1) {
                    this.pointValue.push(data.Id)
                } else {
                    this.DataItems.forEach((item, index) => {
                        if (item.Id == this.treeActiveId) {
                            item.StandardItems.forEach(s => {
                                this.StandardValue.push(s.Id)
                            })
                        }
                    })
                }
            } else {
                if (this.pointValue.indexOf(data.Id) > -1) {
                    this.DataItems.forEach((item, index) => {
                        if (item.Id == data.Id) {
                            this.DataItems.splice(index, 1)
                        }
                    })
                }
                this.treeActiveId = ''
                this.StandardValue = []
            }
            this.$refs.standardTree.setCheckedKeys(this.StandardValue);

        },
        //选择巡检标准
        checkStandard() {},
        checkChangeStandard(data, node, nodes) {
            if (node) {
                if (this.StandardValue.indexOf(data.Id) == -1) {
                    this.StandardValue.push(data.Id)
                }
            } else {
                this.StandardValue.splice(this.StandardValue.indexOf(data.Id), 1)
            }

            this.DataItems.forEach((item, index) => {
                if (item.Id == this.treeActiveId) {
                    this.DataItems.splice(index, 1)
                }
            })
            if (this.treeActiveId) {
                let StandardItems = []
                this.StandardValue.forEach(item => {
                    let obj = {
                        Id: item
                    }
                    StandardItems.push(obj)
                })
                let obj = {
                    Id: this.treeActiveId,
                    StandardItems: StandardItems
                }
                this.DataItems.push(obj)
            }

        },
        clickLabel(data) {
            this.treeActiveId = data.Id

            this.StandardValue = []

            if (this.pointValue.indexOf(data.Id) == -1) {
                this.pointValue.push(data.Id)

                this.$refs.pointTree.setCheckedKeys(this.pointValue);
                this.$refs.standardTree.setCheckedKeys(this.StandardValue);
            } else {
                this.DataItems.forEach(item => {
                    if (item.Id == this.treeActiveId) {
                        item.StandardItems.forEach(s => {
                            this.StandardValue.push(s.Id)
                        })
                    }
                })
                this.$refs.standardTree.setCheckedKeys(this.StandardValue);

            }

        },
        //巡检点选择提交
        submitPointDialog() {
            this.pointVisible = false

        }

    }
}
</script>

<style lang="scss" scoped>
.flex {
    display: flex;
    align-items: center;
    justify-content: center;
}

.inspection-container {
    font-size: 12px;
    height: calc(100% - 115px);
    overflow-y: scroll;

    .filter {
        padding: 10px;
        text-align: left;
    }

    .add-new {
        text-align: right;

        >button {
            margin-top: 10px;
            margin-right: 10px;
        }
    }

    .pointVisible {
        width: 100%;
        height: 500px;

        .point {
            width: 300px;
            height: 100%;
            overflow-y: scroll;
        }

        .standard {
            width: calc(100% - 300px);
            height: 100%;
            overflow-y: scroll;
        }
    }
}
</style><style lang="scss">
@import './css/common.scss';
</style>
