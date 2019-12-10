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
            <el-select v-model="search.deviceType" placeholder="请选择" clearable @change="getList">
                <el-option v-for="item in deviceTypeList" :key="item.Name" :label="item.Name" :value="item.ModelType"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备状态:">
            <el-select v-model="search.deviceStatus" placeholder="请选择" clearable @change="getList">
                <el-option v-for="item in deviceStatusList" :key="item.Name" :label="item.Name" :value="item.Name">
                </el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <el-table :data="tableData" size='mini' element-loading-text="Loading" fit style="width: 100%">
        <el-table-column label="设备名称" prop="EquipmentName" align="center">

        </el-table-column>
        <el-table-column label="设备类型" prop="CategoryName" align="center">

        </el-table-column>
        <el-table-column label="设备型号" prop="Model" align="center">

        </el-table-column>
        <el-table-column label="所属部门" prop="DeptName" align="center">

        </el-table-column>
        <el-table-column label="所属区域" prop="AreaName" align="center">

        </el-table-column>
        <el-table-column label="启用时间" prop="InstallDate" align="center">

        </el-table-column>
        <el-table-column label="设备状态" align="center">
            <template slot-scope="scope">
                <el-tag :type="transitionState(scope.row.State)">{{scope.row.State}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
                <!-- <el-button type="text" @click="taskRecording(scope.row)">巡检记录</el-button> -->
                <el-button type="text" @click="generaCode(scope.row)">生成二维码</el-button>
                <el-button type="text" @click="deviceDetails(scope.row)">设备详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination :page-size="Size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="Page" :limit.sync="Size" @pagination="getList" /> -->
    <div v-show="qrcodeShow" class="qrcodeDiv">
        <div ref="imageWrapper" @click="qrcodeShow = false">
            <div id="qrcode" ref="qrcode"></div>
        </div>
        <div style="padding-top: 5px; text-align: center;">
            <el-button alt="下载二维码" icon="el-icon-download" circle @click="downs"></el-button>
        </div>
    </div>
    <!-- 设备详情 -->
    <el-dialog title="编辑设备" width="860px" :visible.sync="dialogVisible" center>
        <el-form :model="device" :inline="true" label-width="120px" ref="assetForm">
            <el-form-item label="设备名称：">
                <el-input v-model="device.EquipmentName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="设备状态：">
                <el-select v-model="device.State" placeholder="请选择" clearable>
                    <el-option v-for="item in deviceStatusList" :key="item.Name" :label="item.Name" :value="item.Name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="系统菜单：">
                <SystemTree :systemData="device.SysCode" />
            </el-form-item>
            <el-form-item label="系统区域：">
                <SelectSystemArea :systemAreaData="device.AreaID" :SysCode="SysMenuCode" />
            </el-form-item>
            <el-form-item label="父级设备：">
                <el-select v-model="device.Pid" placeholder="请选择" clearable>
                    <el-option v-for="item in sysDeviceList" :key="item.DeviceID" :label="item.DeviceName" :value="item.DeviceID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备分组：">
                <el-select v-model="device.GroupId">
                    <el-option v-for="item in groupList" :key="item.ID" :label="item.Name" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="管理部门：">
                <SelectDepartment :departmentData="device.DeptID" clearable />
            </el-form-item>
            <el-form-item label="设备类型：">
                <el-select v-model="device.DeviceType" placeholder="请选择" clearable>
                    <el-option v-for="item in deviceTypeList" :key="item.Name" :label="item.Name" :value="item.ModelType"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="安装日期：">
                <el-date-picker v-model="device.InstallDate" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="启用时间：">
                <el-date-picker v-model="device.ProduceDate" type="date" placeholder="选择日期" />
            </el-form-item>
            <el-form-item label="使用周期：">
                <el-input min="0" type="Number" v-model="device.QualityLong" style="width:100px"></el-input>
                <el-select v-model="device.QualityUnit" placeholder="请选择" style="width:100px" class="select-unit">
                    <el-option v-for="(item,index) in UnitList" :key="index" :label="item.Name" :value="item.Name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="到期时间：">
                <el-date-picker v-model="device.QualityDate" align="left" type="date" placeholder="选择日期" disabled />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" size="default" @click="dialogVisible = false">关闭</el-button>
        </div>
    </el-dialog>
    <!-- 巡检记录 -->
    <el-dialog title="设备详情" width="780px" :visible.sync="dialogVisible_task" center>
        <ul class="form-container">
            <li v-for="(i,index) in 4" :key="index">
                <div class="task-details">
                    <div class="item"><span>巡检时间：</span>{{'2019-03-11 11:21:08'}}</div>
                    <div class="item"><span>巡检部门：</span>{{'机房管理中心'}}</div>
                    <div class="item"><span>巡检人员：</span>{{'张三'}}</div>
                    <div class="item"><span>巡检结果：</span>
                        <el-tag type="success">{{'正常'}}</el-tag>
                    </div>
                    <div class="item"><span>巡检反馈：</span>{{'巡检正常'}}</div>
                </div>
                <div class="task-img">
                    <div class="item"><span>巡检图片：</span>
                    </div>
                </div>
            </li>
        </ul>
        <div slot="footer" class="dialog-footer">
            <el-button type="cancel" size="default" @click="dialogVisible_task = false">关闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import $ from 'jquery'
import SystemTree from '@/components/filter/SystemTree'
import SelectArea from '@/components/filter/SelectArea'
import SelectSystemArea from '@/components/filter/SelectSystemArea'
import SelectDepartment from '@/components/filter/SelectDepartment'
export default {
    components:{
      SystemTree,SelectArea,SelectSystemArea,SelectDepartment
    },
    data() {
        return {
            search: {
                SysCode: [],
                areaId: [],
                deviceType: '',
                deviceStatus: '',
                StartTime: '',
                EndTime: '',
                department: []
            },
            device: {},
            deviceTypeList: [],
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
                ModelType: ''
            },
            dialogVisible_task: false,
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
            SysMenuCode: '',
            sysDeviceList: [],
            devicePanelType: [],
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
            qrcodeShow: false,
            qrcodeImageUrl: '',
            rowData:null,
        }
    },
    mounted() {
        this.$ajax.get(this.$URL + '/Device/TypeList', {
            params: {
                page: 1,
                size: 100,
                keyWord: ''
            }
        }).then(result => {
            if (result.status == 200 && result.data.success == true) {
                this.deviceTypeList = result.data.data;
                this.getList();
            }
        });
    },
    methods: {
        getList() {
            let data = {
                areaID: JSON.stringify(this.search.areaId[this.search.areaId.length - 1]) || '',
                deptID: JSON.stringify(this.search.department[this.search.department.length - 1]) || '',
                deviceType: this.search.deviceType,
                state: this.search.deviceStatus,
                expireState: '',
                startDate: this.search.StartTime,
                endDate: this.search.EndTime,
                type: '',
                keyWord: '',
                page: this.Page,
                size: this.Size,
                sysCode: this.search.SysCode[this.search.SysCode.length - 1] || ''
            }
            this.$ajax.get(this.$URL + '/Device/AllList', {
                params: data
            }).then(result => {
                if (result.status == 200 && result.data.success == true) {
                    this.tableData = result.data.data;
                    this.total = result.data.count;
                }
            });
        },
        // 选择系统菜单
        handleChangeSystem(value) {
            this.search.SysCode = value
            this.getList()
        },
        // 判断设备状态
        transitionState(data) {
            switch (data) {
                case '正常':
                    return 'nomal'
                    break
                case '故障':
                    return 'warning'
                    break
                case '报废':
                    return 'danger'
                    break
            }
        },
        //查看时设备详情
        deviceDetails(row) {
            this.dialogVisible = true
            this.device = row
            if (row.SysCodeStr != null) {
                this.device.SysCode = row.SysCodeStr.split(',')
                this.SysMenuCode = this.device.SysCode[this.device.SysCode.length - 1]
            } else
                this.device.SysCode = []
            if (row.DeptStr != null) {
                this.device.DeptID = row.DeptStr.split(',').map(Number)

            } else
                this.device.DeptID = []
            if (row.AreaStr) {
                this.device.AreaID = row.AreaStr.split(',').map(Number)
            } else
                this.device.AreaID = []
        },
        // 查看巡检记录
        taskRecording(data) {
            this.dialogVisible_task = true
        },
        // 选择部门
        handleChangeDepartment(value) {
            this.search.department = value
            this.getList()
        },
        // 选择区域时
        handleChangeArea(value) {
            this.search.areaId = value
            this.getList()
        },
        // 获取系统设备
        GetSysDevice() {
            let data = {
                syscode: this.device.SysCode[this.device.SysCode.length - 1],

                areaid: this.device.AreaID[this.device.AreaID.length - 1]
            }
            this.$ajax.get(this.$URL + '/device/LoadDevices').then(result => {
                if (result.status == 200 && result.data.success == true) {
                    this.sysDeviceList = result.data.data;
                }
            });
        },
        // 计算到期时间
        Dateadd(interval, number, date) {
            switch (interval) {
                case "年": {
                    date.setFullYear(date.getFullYear() + number);
                    return date
                    break;
                }
                case "月": {
                    date.setMonth(date.getMonth() + number);
                    return date
                    break;
                }
                case "周": {
                    date.setDate(date.getDate() + number * 7);
                    return date
                    break;
                }
                case "天": {
                    date.setDate(date.getDate() + number);
                    return date
                    break;
                }
            }
        },

        maturityDate(unit, date, number) {
            let num = parseInt(number) //将传过来的周期值转化为整数
            let procurementDate = new Date(date)
            let newDate = this.Dateadd(unit, num, procurementDate)
            this.device.QualityDate = newDate
        },
        // 生成二维码
        generaCode(row) {
            let data = row;
            $("#qrcode").html("");
            // setTimeout(function() {
            // }, 100);
            let qrcode = new QRCode("qrcode", {
                width: 200, // 设置宽度
                height: 200, // 设置高度
                text: data.GUID
            });
            setTimeout(() => {
                html2canvas(this.$refs.imageWrapper, {
                    backgroundColor: null
                }).then((canvas) => {
                    let dataURL = canvas.toDataURL("image/png");
                    this.qrcodeImageUrl = dataURL;

                    // this.downs(row.Code)
                })
            }, 100)
            this.qrcodeShow = true;
            this.rowData=row;
        },
        downloadIamge(imgsrc, name) { //下载图片地址和图片名
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
            this.downloadIamge(this.qrcodeImageUrl, this.rowData?this.rowData.EquipmentName:'')
            this.qrcodeShow = false
        },
        handleCurrentChange(val) {
            this.Page = val
            this.getList();
        }
    }
}
</script>

<style lang="less" scoped>
.box {
    // height: calc(100vh - 110px);
    text-align: left;
    background: #061A30;

    .header-search span {
        color: #ffffff;
    }
}

.qrcodeDiv {
    position: fixed;
    width: 220px;
    padding: 10px;
    top: 200px;
    left: calc(50% - 110px);
    background-color: white;
    color: black;
    z-index: 1000;

    p {
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        letter-spacing: 15px;
        font-family: "Microsoft YaHei";
        font-weight: bold;
    }

    >div.qrcodeDivContainer {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        >div {

            display: inline-block;
            width: 200px;
            height: 200px;
            vertical-align: middle;
        }

        >div.info {
            width: 395px;

            >div {
                width: 100%;
                height: 20%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
            }
        }
    }
}
</style>
