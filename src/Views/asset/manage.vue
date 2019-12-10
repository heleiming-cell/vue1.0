<template>
<div class="inspection-container">
    <div class="filter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="设备名称">
                <el-input v-model="formInline.Name" placeholder="请输入" clearable=""></el-input>
            </el-form-item>
            <!-- <el-form-item label="起始时间">
                <el-date-picker v-model="formInline.InstallDate" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" max-height="500px">

        <el-table-column prop="Name" label="设备名称" align="center">
        </el-table-column>
        <el-table-column prop="CategoryName" label="设备类型" align="center">
        </el-table-column>
        <el-table-column prop="AreaName" label="所属区域" align="center">
        </el-table-column>
        <el-table-column prop="InstallDate" label="安装时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="editData(scope.row)">编 辑</el-button>
                <el-button type="text" size="small" @click="removeData(scope.row)" style="color:#FC4734">删 除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="add-new">
        <el-button type="primary" @click="editData('new')" size="small">新建设备</el-button>
    </div>
    <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 设备详情 -->
    <el-dialog title="编辑设备" :visible.sync="dialogVisible" v-if="dialogVisible" >
        <div class="dialogDetail">
            <el-form :model="dialogForm" :label-width="'120px'" :inline="true" style="text-align: left;" :rules="rules" ref="ruleForm">
                <el-form-item label="设备名称：" prop="Name">
                    <el-input v-model="dialogForm.Name" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="设备类型：" prop="CategoryId">
                    <Project cate="devicecate" :value="dialogForm.CategoryId" @change="changeCategoryId" />
                </el-form-item>
                <el-form-item label="所在区域：" prop="AreaId">
                    <Project cate="areacate" :value="dialogForm.AreaId" @change="changeAreaId" />
                </el-form-item>
                <el-form-item label="设备规格：" prop="Specification">
                    <el-input v-model="dialogForm.Specification" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="生产厂家：" prop="Producer">
                    <el-input v-model="dialogForm.Producer" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="生产日期：" prop="ProductionDate">
                    <el-date-picker v-model="dialogForm.ProductionDate" type="date" placeholder="选择日期"> </el-date-picker>
                </el-form-item>
                <el-form-item label="设备到期：" prop="QualityLastDate">
                    <el-date-picker v-model="dialogForm.QualityLastDate" type="date" placeholder="选择日期"> </el-date-picker>
                </el-form-item>
                <el-form-item label="安装地址：" prop="AreaDescription">
                    <el-input v-model="dialogForm.AreaDescription" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="安装日期：" prop="InstallDate">
                    <el-date-picker v-model="dialogForm.InstallDate" type="date" placeholder="选择日期"> </el-date-picker>
                </el-form-item>
                <el-form-item label="使用日期：" prop="UsingDate">
                    <el-date-picker v-model="dialogForm.UsingDate" type="date" placeholder="选择日期"> </el-date-picker>
                </el-form-item>
                <el-form-item label="设备单位：" prop="Unit">
                    <AllEnums cate="DeviceUnitEnums" :value="dialogForm.Unit" @change="changeUnit" />
                </el-form-item>
                <el-form-item label="设备状态：" prop="State">
                    <AllEnums cate="DeviceStateEnums" :value="dialogForm.State" @change="changeState" />
                </el-form-item>
                <el-form-item label="面板类型：" prop="">
                    <el-select clearable v-model="dialogForm.PanelType">
                        <el-option v-for="(item,index) in PanelType" :key="index" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态变量：" prop="">
                    <el-input placeholder="请输入内容" v-model="dialogForm.VarStatus" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="BindVar('VarStatus')"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="报警变量：" prop="">
                    <el-input placeholder="请输入内容" v-model="dialogForm.VarAlarm" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="BindVar('VarAlarm')"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitDialog">确 定</el-button>
        </div>
    </el-dialog>

</div>
</template>

<script>
import Variable from '@/components/Dialog/Variable/src'
import PanelType from '@/data/panelType.js'
import {
    inspectSheet_List,
    inspectSheet_TaskDetail,
    inspectSheet_GetInspectAsk,
    inspectSheet_GetDeviceResult
} from '@/api/inspectSheet'
import {
    Device_DeviceList,
    Device_QueryDeviceDetail,
    Device_Del,
    Device_AddOrUpdate,
} from '@/api/Device'
import {
    WorkFlow_GetWBListByDeviceId,
    WorkFlow_GetWXListByDeviceId,
    WorkFlow_QueryDetail
} from '@/api/WorkFlow'
import pagiNation from '@/components/common/pagination'
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import $ from "jquery"
import Project from '@/components/filter/Project'
import AllEnums from '@/components/filter/AllEnums'

export default {
    components: {
        pagiNation,
        Project,
        AllEnums
    },
    data() {
        return {
            URL: this.$Order,
            formInline: {
                InstallDate: '',
                Name: '',
                CreateTime: '',
            },
            listQuery: {
                page: 1,
                limit: 10,
                total: 0,
            },
            tableData: [],
            options: [{
                value: '已完成',
                label: '已完成'
            }, {
                value: '未完成',
                label: '未完成'
            }, {
                value: '超时完成',
                label: '超时完成'
            }, {
                value: '已超时',
                label: '已超时'
            }],
            dialogVisible: false,
            dialogForm: {
                "Brand": "",
                "Model": "",
                "CategoryId": "",
                "Name": "",
                "Specification": "",
                "Producer": "",
                "ProductionDate": "",
                "QualityLastDate": "",
                "AreaDescription": "",
                "Id": "",
                "AreaId": "",
                "InstallDate": "",
                "UsingDate": "",
                "RelateId": 0,
                "State": "",
                "Unit": "",
                VarStatus: "",
                VarAlarm: "",
                PanelType:''
            },
            rules: {
                Name: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }, ],
                Model: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }, ],
                CategoryId: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }, ],
                InstallDate: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }, ],
                Unit: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }, ],
                State: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }, ],
                AreaId: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }, ],
                AreaDescription: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }, ],
                Producer: [{
                    required: true,
                    message: '必填项',
                    trigger: 'blur'
                }, ],
            },
            el: null,
            PanelType

        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        callback(prop, val) {
            if (val) {
                Object.assign(this.dialogForm, {
                    [prop]: val,
                });
            }
            if (this.el) {
                document.getElementById("app").removeChild(this.el.$parent.$el);
                this.el = null;
            }
        },
        BindVar(prop) {

            this.el = Variable.newInstance().diagram;
            this.el.open(this.callback, prop, null);
        },
        getList() {
            let data = {
                "Page": this.listQuery.page,
                "Size": this.listQuery.limit,
                "OrderBys": [],
                "Conditions": [{
                        "Key": "Name",
                        "Operator": 1,
                        "Value": this.formInline.Name
                    },
                    {
                        "Key": "InstallDate",
                        "Operator": 1,
                        "Value": this.formInline.InstallDate
                    }
                ]
            }
            Device_DeviceList(data).then(res => {
                this.tableData = res.Data.Data
                this.listQuery.total = res.Data.Count
            })
        },
        onSubmit() {
            this.listQuery.page = 1
            this.getList()
        },
        //查看详情
        editData(row) {

            if (row == 'new') {
                this.dialogForm = {
                    "Brand": "",
                    "Model": "",
                    "CategoryId": "",
                    "Name": "",
                    "Specification": "",
                    "Producer": "",
                    "ProductionDate": "",
                    "QualityLastDate": "",
                    "AreaDescription": "",
                    "Id": "",
                    "AreaId": "",
                    "InstallDate": "",
                    "UsingDate": "",
                    "RelateId": 0,
                    "State": "",
                    "Unit": "",
                    VarStatus: "",
                    VarAlarm: ""
                }
                this.dialogVisible = true
            } else {
                Device_QueryDeviceDetail({
                    id: row.Id
                }).then(res => {
                    this.dialogForm = res.Data
                    this.dialogVisible = true
                })
            }
        },
        //删除
        removeData(row) {
            this.$confirm('此操作将永久删除该设备, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                Device_Del({
                    id: row.Id
                }).then(res => {
                    this.getList()
                    this.$message.success('删除成功！')
                })

            }).catch(() => {

            });
        },
        //选择设备类型
        changeCategoryId(val) {
            this.dialogForm.CategoryId = val
        },
        //选择设备区域
        changeAreaId(val) {
            this.dialogForm.AreaId = val
        },
        //选择计量单位
        changeUnit(val) {
            this.dialogForm.Unit = val
        },
        //选择设备状态
        changeState(val) {
            this.dialogForm.State = val
        },
        //保存设备
        submitDialog() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    Device_AddOrUpdate(this.dialogForm).then(res => {
                        this.getList()
                        this.dialogVisible = false
                        this.$message.success('保存成功！')
                    })
                }
            })
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
    height: calc(100% - 115px);
    font-size: 12px;
    width: 100%;
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

    .dialogDetail {
        max-height: 500px;
        overflow-y: scroll;
    }

    .cardClass {
        // width: ;
        // background-color: #051430;
        border: 1px solid #087CA2;
        height: 247px;
        width: 717px;
        margin: 20px auto;

        .code {
            width: 270px;
            height: 100%;
            border: 1px solid #087CA2;
            flex-wrap: wrap;
            color: white;

            .text {
                height: 30px;
                line-height: 30px;
            }

            .qrCode {
                width: 173px;
                height: 173px;
            }
        }

        .info {
            height: 100%;
            width: calc(100% - 271px);
            flex-wrap: wrap;

            >div {
                width: 100%;
                height: calc(25% - 2px);
                border: 1px solid #087CA2;
                justify-content: left;

                >span {
                    margin-left: 30px;
                }
            }
        }
    }
}
</style><style lang="scss">
@import './css/common.scss';
</style>
