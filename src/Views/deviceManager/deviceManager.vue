<template>
<div class="box">
    <el-form :inline="true" class="header-search" label-width="100px">
        <el-form-item label="系统菜单:">
            <SystemTree :systemData="search.SysCode" @value="handleChangeSystem" />
        </el-form-item>
        <el-form-item label="设备区域:">
            <SelectArea :areaData="search.areaId" @value="handleChangeArea" />
        </el-form-item>
        <el-form-item label="设备类型:">
            <el-select v-model="search.deviceType" placeholder="请选择" clearable @change="handleChangeDeviceType" filterable>
                <el-option v-for="(item,index) in deviceTypeList" :key="index" :label="item.Name" :value="item.ModelType"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备状态:">
            <el-select v-model="search.deviceStatus" placeholder="请选择" clearable @change="handleChangeDeviceStatus">
                <el-option v-for="(item,index) in deviceStatusList" :key="index" :label="item.Name" :value="item.Name"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <el-table ref="topictable" :data="tableData" :height="tableHeight" size="mini" element-loading-text="Loading" fit  style="width: 100%">
        <el-table-column label="设备名称" prop="EquipmentName" align="center"></el-table-column>
        <el-table-column label="设备类型" prop="CategoryName" align="center"></el-table-column>
        <el-table-column label="所属部门" prop="DeptName" align="center"></el-table-column>
        <el-table-column label="所属区域" prop="AreaName" align="center"></el-table-column>
        <el-table-column label="启用时间" prop="InstallDate" align="center"></el-table-column>
        <el-table-column label="使用周期" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.QualityLong!=null&&scope.row.QualityLong!=''&&scope.row.QualityUnit!=null&&scope.row.QualityUnit!=''?scope.row.QualityLong+scope.row.QualityUnit:''}}</span>
            </template>
        </el-table-column>
        <el-table-column label="设备状态" align="center">
            <template slot-scope="scope">
                <el-tag :type="transitionState(scope.row.State)">{{scope.row.State}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="left" width="300">
            <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
                <!-- <el-button type="text" @click="generaCode(scope.row)">生成二维码</el-button> -->
                <el-button type="text" @click="bindVariable(scope.row)">变量绑定</el-button>
                <el-button class="sign" size="mini" type="success" icon="el-icon-check" circle v-if="scope.row.IoTest!=null&&scope.row.IoTest!=''"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="bottom-btn">
        <el-form :inline="true">
            <el-form-item>
                <el-button type="primary"  @click="handleEdit(null)">添加设备</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"  @click="ExcelMoudel">下载模板</el-button>
            </el-form-item>
            <el-form-item>
                <el-upload class="upload-demo" ref="upload" :show-file-list="false" :action="uploadUrl" :headers="{postHeaders,'enctype':'multipart/application/json'}" :data="{'application/json':'excel'}" accept="{'xls', 'xlsx'}" :on-success="uploadSuccess" :on-error="uploadError" :on-progress="uploadProgress">
                    <el-button type="primary" :loading="Buttonloading">批量导入</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
    </div>
    <el-pagination :page-size="Size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <el-dialog title="编辑设备" width="860px" :visible.sync="dialogVisible" center @close="resetForm">
        <el-form :model="device" :inline="true" label-width="120px" ref="assetForm" :rules="rulesForm">
            <el-form-item label="设备名称：">
                <el-input v-model="device.EquipmentName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="设备状态：">
                <el-select v-model="device.State" placeholder="请选择" clearable>
                    <el-option v-for="(item,index) in deviceStatusList" :key="index" :label="item.Name" :value="item.Name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="系统菜单：">
                <SystemTree :systemData="device.SysCode" @value="selectedSystem" />
            </el-form-item>
            <el-form-item label="系统区域：">
                <SelectSystemArea :systemAreaData="device.AreaID" :SysCode="SysMenuCode" @value="selectedArea" />
            </el-form-item>
            <!-- <el-form-item label="父级设备：">
                <el-select v-model="device.Pid" placeholder="请选择" clearable filterable>
                    <el-option v-for="(item,index) in sysDeviceList" :key="index" :label="item.DeviceName" :value="item.DeviceID"></el-option>
                </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="HIS编号：">
                <el-input v-model="device.HisCode" placeholder="请输入"></el-input>
            </el-form-item> -->
            <el-form-item label="设备分组：">
                <el-select v-model="device.GroupId">
                    <el-option v-for="item in groupList" :key="item.ID" :label="item.Name" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="面板类型：">
                <el-select v-model="device.Paneltype" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in devicePanelType" :key="item.ID" :label="item.Name" :value="item.ID"></el-option>
                </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="模型类型：">
                <el-select v-model="device.ModelType" placeholder="请选择" @change="selectBimModal" clearable>
                    <el-option v-for="item in deviceBimModel" :key="item.type" :label="item.name" :value="item.type"></el-option>
                </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="三维视角：">
                <el-select v-model="device.BimView" placeholder="请选择" clearable>
                    <el-option v-for="(item,index) in perspectiveList" :key="index" :label="item.ViewName" :value="item.ID"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="管理部门：">
                <SelectDepartment :departmentData="device.DeptID" @value="selectedDepartment" clearable />
            </el-form-item>
            <el-form-item label="设备类型：">
                <el-select v-model="device.DeviceType" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in deviceTypeList" :key="item.ModelType" :label="item.Name" :value="item.ModelType"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备IP：">
                <el-input v-model="device.DeviceIp" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="设备型号：">
                <el-input v-model="device.Model" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="安装地址：">
                <el-input v-model="device.AreaAddress" />
            </el-form-item>
            <el-form-item label="生产厂家：">
                <el-input v-model="device.Producer" />
            </el-form-item>
            <el-form-item label="安装日期：">
                <el-date-picker v-model="device.InstallDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="启用时间：">
                <el-date-picker v-model="device.ProduceDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" @change="maturityDate(device.QualityUnit,device.ProduceDate,device.QualityLong)" />
            </el-form-item>
            <el-form-item label="使用周期：">
                <el-input min="0" type="Number" v-model="device.QualityLong" style="width:100px" @change="maturityDate(device.QualityUnit,device.ProduceDate,device.QualityLong)"></el-input>
                <el-select v-model="device.QualityUnit" placeholder="请选择" style="width:100px" class="select-unit" @change="maturityDate(device.QualityUnit,device.ProduceDate,device.QualityLong)">
                    <el-option v-for="(item,index) in UnitList" :key="index" :label="item.Name" :value="item.Name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="到期时间：">
                <el-date-picker v-model="device.QualityDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" disabled />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" size="default" @click="dialogVisible = false">关闭</el-button>
            <el-button type="determine" @click="submitForm">确定</el-button>
        </div>
    </el-dialog>
    <!-- 绑定变量 -->
    <el-dialog title="绑定变量" :visible.sync="dialogVisible_val" v-if="dialogVisible_val" center width="600px" @close="reset">
        <div class="dialog-container">
            <el-form :model="bind" label-width="120px" :rules="rulesFormBind" ref="bindForm">
                <el-form-item label="IoServer：" prop="Ioserver">
                    <el-select v-model="bind.Ioserver" placeholder="请选择" @change="handlechengeIoserve">
                        <el-option v-for="item in IoServerList" :key="item.ID" :label="item.Name" :value="item.ID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="通道：" prop="channers">
                    <el-select v-model="bind.channers" placeholder="请选择" @change="handleChangeChanners">
                        <el-option v-for="(item,index) in ChannelsList" :key="index" :label="item.Name" :value="item.ID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="控制器：" prop="controlller">
                    <el-select v-model="bind.controlller" placeholder="请选择" @change="handleChangeControl">
                        <el-option v-for="(item,index) in ControllerList" :key="index" :label="item.Name" :value="item.ID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="变量：" prop="variable">
                    <el-select v-model="bind.variable" placeholder="请选择">
                        <el-option v-for="(item,index) in VariableList" :key="index" :label="item.Name" :value="item.ID"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" size="default" @click="dialogVisible_val = false">关闭</el-button>
            <el-button type="determine" @click="submitFormBind">确定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import $ from "jquery";
import SystemTree from '@/components/filter/SystemTree'
import SelectArea from '@/components/filter/SelectArea'
import SelectSystemArea from '@/components/filter/SelectSystemArea'
import SelectDepartment from '@/components/filter/SelectDepartment'
export default {
    components: {
        SystemTree,
        SelectArea,
        SelectDepartment,
        SelectSystemArea
    },
    data() {
        return {
            tableHeight: null,
            uploadUrl: this.$URL + "/Device/ExcelToTable",
            postHeaders: this.$Header,
            Buttonloading: false,
            deviceStatusList: [{
                    Name: '正常'
                },
                {
                    Name: '故障'
                },
                {
                    Name: '报废'
                }
            ],
            deviceTypeList: [],
            search: {
                SysCode: [],
                department: [],
                StartTime: '',
                EndTime: '',
                deviceStatus: '',
                deviceType: '',
                areaId: [],
            },
            tableData: [],
            total: 0,
            Page: 1,
            Size: 10,
            dialogVisible: false,
            device: {
                ID: '0',
                EquipmentName: '',
                DeptID: [],
                InstallDate: '',
                DeviceType: '',
                assetType: '',
                SysCode: [],
                Pid: null,
                Code: null,
                GroupId: null,
                unit: '',
                Model: '',
                purchaseValue: '',
                depreciatedAmount: '',
                residualValue: '',
                AreaID: [],
                AreaAddress: '',
                Producer: '',
                State: '正常',
                ProduceDate: '',
                QualityDate: '',
                QualityLong: '',
                QualityUnit: '',
                Paneltype: '',
                BimView: '',
                ModelType: '',
                DeviceIp: '',
                HisCode: ''
            },
            groupList: [{
                    Name: '第一组',
                    ID: 1
                },
                {
                    Name: '第二组',
                    ID: 2
                },
                {
                    Name: '第三组',
                    ID: 3
                },
                {
                    Name: '第四组',
                    ID: 4
                },
                {
                    Name: '第五组',
                    ID: 5
                },
            ],
            sysDeviceList: [],
            SysMenuCode: '',
            UnitList: [{
                    Name: '天'
                },
                {
                    Name: '周'
                },
                {
                    Name: '月'
                },
                {
                    Name: '年'
                }
            ],
            rulesForm: {
                EquipmentName: [{
                        required: true,
                        message: '请输入设备名称',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 5,
                        message: '长度在 2 到 15 个字符',
                        trigger: 'blur'
                    }
                ]
            },
            // devicePanelType: [],
            perspectiveList: [],
            dialogVisible_val: false,
            IoServerList: [],
            ChannelsList: [],
            ControllerList: [],
            VariableList: [],
            bind: {
                Ioserver: '',
                channers: '',
                controlller: '',
                variable: ''
            },
            rulesFormBind: {
                Ioserver: [{
                    required: true,
                    message: '请选择IoServer',
                    trigger: 'change'
                }],
                channers: [{
                    required: true,
                    message: '请选择通道',
                    trigger: 'change'
                }],
                controlller: [{
                    required: true,
                    message: '请选择控制器',
                    trigger: 'change'
                }],
                variable: [{
                    required: true,
                    message: '请选择变量',
                    trigger: 'change'
                }]
            },
            qrcodeShow: false,
            qrcodeImageUrl: '',
            qrcodeTitle: ''
        }
    },
    mounted() {
        this.tableHeight =
            window.innerHeight - this.$refs.topictable.$el.offsetTop - 280;
        this.$ajax.get(this.$URL + '/Device/TypeList', {
            params: {
                page: 1,
                size: 100,
                keyWord: ''
            }
        }).then(result => {
            if (result.status == 200 && result.data.success == true) {
                this.deviceTypeList = result.data.data;

            }
        });

        // this.devicePanelType = panelTypes;
        this.getList();

        this.$ajax.get(this.$URL + '/ioServer/GetIOServers').then(result => {
            if (result.status == 200 && result.data.success == true) {
                this.IoServerList = result.data.data;
            }
        });

    },
    methods: {
        getList() {
            let data = {
                areaID: JSON.stringify(this.search.areaId[this.search.areaId.length - 1]) ||
                    "",
                deptID: JSON.stringify(
                    this.search.department[this.search.department.length - 1]
                ) || "",
                deviceType: this.search.deviceType || "",
                state: this.search.deviceStatus,
                expireState: "",
                startDate: this.search.StartTime,
                endDate: this.search.EndTime,
                type: "",
                keyWord: "",
                page: this.Page,
                size: this.Size,
                sysCode: this.search.SysCode[this.search.SysCode.length - 1] || ""
            };
            this.$ajax.get(this.$URL + '/Device/AllList',{
                params:data
            }).then(result => {
                if (result.status == 200 && result.data.success == true) {
                    this.tableData = result.data.data;
                    this.total = result.data.count;
                }
            });
        },
        // 判断设备状态
        transitionState(data) {
            switch (data) {
                case "正常":
                    return "nomal";
                    break;
                case "故障":
                    return "warning";
                    break;
                case "报废":
                    return "danger";
                    break;
            }
        },

        // 生成二维码
        generaCode(row) {
            let data = row;
            this.qrcodeTitle = row.EquipmentName
            $("#qrcode").html("");
            // setTimeout(function() {
            // }, 100);
            let qrcode = new QRCode("qrcode", {
                width: 180, // 设置宽度
                height: 180, // 设置高度
                text: data.GUID
            });
            setTimeout(() => {
                html2canvas(this.$refs.imageWrapper, {
                    backgroundColor: null
                }).then(canvas => {
                    let dataURL = canvas.toDataURL("image/png");
                    this.qrcodeImageUrl = dataURL;

                    // this.downs(row.Code)
                });
            }, 100);
            this.qrcodeShow = true;
        },
        downloadIamge(imgsrc, name) {
            //下载图片地址和图片名
            var image = new Image();
            // 解决跨域 Canvas 污染问题
            image.setAttribute("crossOrigin", "anonymous");
            image.onload = function () {
                var canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                var context = canvas.getContext("2d");
                context.drawImage(image, 0, 0, image.width, image.height);
                var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据

                var a = document.createElement("a"); // 生成一个a元素
                var event = new MouseEvent("click"); // 创建一个单击事件
                a.download = name || "photo"; // 设置图片名称
                a.href = url; // 将生成的URL设置为a.href属性
                a.dispatchEvent(event); // 触发a的单击事件
            };
            image.src = imgsrc;
        },
        downs(Code) {
            this.downloadIamge(this.qrcodeImageUrl, Code);
            this.qrcodeShow = false;
        },
        // 编辑
        handleEdit(row) {
            this.dialogVisible = true;
            if (row != null) {
                this.device = JSON.parse(JSON.stringify(row));
                if (row.SysCodeStr != null) {
                    this.device.SysCode = row.SysCodeStr.split(",");
                    this.SysMenuCode = this.device.SysCode[
                        this.device.SysCode.length - 1
                    ];
                } else this.device.SysCode = [];
                if (row.DeptStr != null) {
                    this.device.DeptID = row.DeptStr.split(",").map(Number);
                } else this.device.DeptID = [];
                if (row.AreaStr) {
                    this.device.AreaID = row.AreaStr.split(",").map(Number);
                } else this.device.AreaID = [];
            } else {
                this.device = {
                    ID: "0",
                    EquipmentName: "",
                    DeptID: [],
                    InstallDate: "",
                    DeviceType: "",
                    assetType: "",
                    SysCode: [],
                    Pid: null,
                    Code: null,
                    GroupId: null,
                    unit: "",
                    Model: "",
                    purchaseValue: "",
                    depreciatedAmount: "",
                    residualValue: "",
                    AreaID: [],
                    AreaAddress: "",
                    Producer: "",
                    State: "正常",
                    ProduceDate: "",
                    QualityDate: "",
                    QualityLong: "",
                    QualityUnit: "",
                    Paneltype: "",
                    ModelType: "",
                    BimView: "",
                    DeviceIp: "",
                    HisCode: ""
                };
            }
            this.GetSysDevice();
        },
        // 删除设备
        handleDelete(row) {
            this.$confirm("是否确认删除该设备", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$ajax.get(this.$URL + '/Device/RemoveDevice', {
                    params: {
                        deviceId: row.ID
                    }
                }).then(result => {
                    if (result.status == 200 && result.data.success == true) {
                        this.getList();
                        this.$message.success("删除成功");
                    }
                });
            });
        },
        // 选择部门
        handleChangeDepartment(value) {
            this.Page = 1
            this.search.department = value;
            this.getList();
        },
        // 选择系统菜单
        handleChangeSystem(value) {
            this.Page = 1
            this.search.SysCode = value;
            this.getList();
        },
        handleChangeDeviceType() {
            this.Page = 1
            this.getList();
        },
        handleChangeDeviceStatus() {
            this.Page = 1
            this.getList();
        },
        // 选择区域时
        handleChangeArea(value) {
            this.Page = 1
            this.search.areaId = value;
            this.getList();
        },
        // 点击绑定变量
        bindVariable(row) {
            this.dialogVisible_val = true;
            if (row.IoTest != null && row.IoTest != "") {
                let bindData = new Array();
                bindData = row.IoTest.split("/");
                this.bind = {
                    Ioserver: bindData[0],
                    channers: bindData[1],
                    controlller: bindData[2],
                    variable: bindData[3]
                };
                this.getChannelsList();
                this.getControllerList();
                this.getVariableList();
            } else {
                this.bind = {
                    Ioserver: "",
                    channers: "",
                    controlller: "",
                    variable: ""
                };
            }
            this.bind.ID = row.ID;
        },
        // 选择系统菜单时
        selectedSystem(val) {
            this.device.SysCode = val;
            this.SysMenuCode = val[val.length - 1];
            this.GetSysDevice();
        },
        // 选择区域时
        selectedArea(val) {
            this.device.AreaID = val;
            this.GetSysDevice();
        },
        // 选择模型类型时
        selectBimModal(val) {
            this.device.bimModel = val;

        },

        // 选择部门时
        selectedDepartment(val) {
            this.device.DeptID = val;
        },
        // 计算到期时间
        Dateadd(interval, number, date) {
            switch (interval) {
                case "年": {
                    date.setFullYear(date.getFullYear() + number);
                    return date;
                    break;
                }
                case "月": {
                    date.setMonth(date.getMonth() + number);
                    return date;
                    break;
                }
                case "周": {
                    date.setDate(date.getDate() + number * 7);
                    return date;
                    break;
                }
                case "天": {
                    date.setDate(date.getDate() + number);
                    return date;
                    break;
                }
            }
        },

        maturityDate(unit, date, number) {
            let num = parseInt(number); //将传过来的周期值转化为整数
            let procurementDate = new Date(date);
            let newDate = this.Dateadd(unit, num, procurementDate);
            this.device.QualityDate = newDate;
        },
        // 提交编辑
        submitForm() {
            let data = {
                ID: this.device.ID,
                EquipmentName: this.device.EquipmentName,
                InstallDate: this.device.InstallDate || "",
                Period: "",
                PeriodUnit: "",
                ProduceDate: "",
                QualityLong: this.device.QualityLong,
                QualityUnit: this.device.QualityUnit,
                QuailtyLastDate: this.device.QualityDate || "",
                deviceState: this.device.State,
                Model: this.device.Model,
                SysCode: this.device.SysCode[this.device.SysCode.length - 1],
                Pid: this.device.Pid,
                Devicecode: this.device.Code,
                GroupId: this.device.GroupId,
                Paneltype: this.device.Paneltype,
                DeviceType: this.device.DeviceType,
                BimView: this.device.BimView,
                ModelType: this.device.ModelType,
                AreaID: this.device.AreaID[this.device.AreaID.length - 1],
                Unitmeasure: "",
                Assetvalue: "",
                Depreciation: "",
                Salvage: "",
                Producer: this.device.Producer,
                AreaAddress: this.device.AreaAddress,
                DeptID: this.device.DeptID[this.device.DeptID.length - 1],
                oldDeviceId: "",
                AreaStr: this.device.AreaID,
                DeptSrc: this.device.DeptID,
                SysCodeStr: this.device.SysCode,
                Attribute: "",
                DeviceIp: this.device.DeviceIp,
                HisCode: this.device.HisCode
            };

            this.$ajax.post(this.$URL + '/Device/SaveDevice', data).then(result => {
                if (result.status == 200 && result.data.success == true) {
                    this.getList();
                    this.$message.success("保存成功");
                    this.dialogVisible = false;
                }
            });
        },
        // 获取通道
        getChannelsList() {
            this.$ajax.get(this.$URL + '/ioServer/GetChannels', {
                params: {
                    ioSvr: this.bind.Ioserver
                }
            }).then(result => {
                if (result.status == 200 && result.data.success == true) {
                    this.ChannelsList = result.data.data;
                }
            });
        },
        // 获取控制器
        getControllerList() {
            this.$ajax.get(this.$URL + '/ioServer/GetController', {
                params: {
                    ioSvr: this.bind.Ioserver,
                    chlkey: this.bind.channers
                }
            }).then(result => {
                if (result.status == 200 && result.data.success == true) {
                    this.ControllerList = result.data.data;
                }
            });
        },
        // 获取变量
        getVariableList() {
            this.$ajax.get(this.$URL + '/ioServer/GetVariable', {
                params: {
                    ioSvr: this.bind.Ioserver,
                    chlkey: this.bind.channers,
                    ctrlkey: this.bind.controlller
                }
            }).then(result => {
                if (result.status == 200 && result.data.success == true) {
                    this.VariableList = result.data.data;
                }
            });
        },
        // 提交绑定的变量
        submitFormBind() {
            this.$refs.bindForm.validate(valid => {
                if (valid) {
                    let data = {
                        Id: this.bind.ID,
                        IoTest: this.bind.Ioserver +
                            "/" +
                            this.bind.channers +
                            "/" +
                            this.bind.controlller +
                            "/" +
                            this.bind.variable
                    };
                    this.$ajax.post(this.$URL + '/Device/BindIoValue', data).then(result => {
                        if (result.status == 200 && result.data.success == true) {
                            this.dialogVisible_val = false;
                            this.$message.success("绑定成功");
                            this.getList();
                        }
                    });
                }
            });
        },
        reset() {
            this.$refs.bindForm.resetFields();
            this.ChannelsList = [];
            this.ControllerList = [];
            this.VariableList = [];
        },
        resetForm() {
            this.$refs.assetForm.resetFields();
        },
        // 导出模板
        ExcelMoudel() {
            let url = this.$URL + "/Device/ExcelMoudle";
            window.open(url);
        },
        ImportAsset() {},
        // 上传文件成功
        uploadSuccess(response, file, fileList) {
            this.Buttonloading = false;
            console.log(response);
            if (response.success) {
                this.getList();
                this.$message.success(response.message);
            } else {
                this.$message.error(response.message);
            }
        },
        // 上传文件失败
        uploadError(err, file, fileList) {
            this.Buttonloading = false;
            this.$message.error("上传文件失败");
        },
        // 上传文件时
        uploadProgress(event, file, fileList) {
            this.Buttonloading = true;
            console.log(file);
        },
        // 选择Ioserve时
        handlechengeIoserve(val) {
            this.getChannelsList();
            this.ControllerList = [];
            this.VariableList = [];
            this.bind.channers = "";
            this.bind.controlller = "";
            this.bind.variable = "";
        },
        // 选择通道时
        handleChangeChanners(val) {
            this.getControllerList();
            this.VariableList = [];
            this.bind.controlller = "";
            this.bind.variable = "";
        },
        // 选择控制器时
        handleChangeControl(val) {
            this.getVariableList();
            this.bind.variable = "";
        },
        // 获取系统设备
        GetSysDevice() {
            let data = {
                syscode: this.device.SysCode[this.device.SysCode.length - 1],

                areaid: this.device.AreaID[this.device.AreaID.length - 1]
            };
            this.$ajax.get(this.$URL + '/device/LoadDevices').then(result => {
                if (result.status == 200 && result.data.success == true) {
                    this.sysDeviceList = result.data.data;
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

.header-search {
    .el-form-item {
        margin-right: 0px;
    }
}

.el-form .el-form-item .el-cascader {
    width: 200px;
    text-align: left !important;
}

.box {
    text-align: left;
    background: #061a30;
    position: relative;

    .header-search span {
        color: #ffffff;
    }

    .el-button--mini.is-circle.sign {
        padding: 2px;
    }

    .qrcodeDiv {
        position: fixed;
        width: 200px;
        padding: 10px;
        top: 200px;
        left: calc(50% - 110px);
        background-color: white;
        color: black;
        z-index: 1000;

        .qrcode-title,
        .title {
            width: 100%;
            text-align: center;
        }

        .title {
            font-size: 18px;
            font-weight: 500;
        }
    }
}
</style>
