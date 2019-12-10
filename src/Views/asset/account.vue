<template>
<div class="inspection-container">
    <div class="filter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="资产名称">
                <el-input v-model="formInline.Name" placeholder="请输入" clearable=""></el-input>
            </el-form-item>
            <!-- <el-form-item label="起始时间">
                <el-date-picker v-model="formInline.InstallDate" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item> -->
            <el-form-item label="项目">
                <Project :value="ProjectId" :cate="'project'" @change="changeProjectId" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" max-height="500px">

        <el-table-column prop="Name" label="资产名称" align="center">
        </el-table-column>
        <el-table-column prop="CategoryName" label="资产类型" align="center">
        </el-table-column>
        <el-table-column prop="AreaName" label="所属区域" align="center">
        </el-table-column>
        <el-table-column prop="InstallDate" label="安装时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <!-- <el-button type="text" size="small" @click="getDetail(scope.row)">查看</el-button> -->
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="getDetail(scope.row)">资产详情</el-dropdown-item>
                        <el-dropdown-item @click.native="getCard(scope.row)">生成资产卡</el-dropdown-item>
                        <el-dropdown-item @click.native="getInspection(scope.row)">巡检记录</el-dropdown-item>
                        <el-dropdown-item @click.native="getMaintenance(scope.row)">维保记录</el-dropdown-item>
                        <el-dropdown-item @click.native="getRepair(scope.row)">维修记录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
        </el-table-column>
    </el-table>
    <!-- <div class="add-new">
        <el-button type="primary" @click="editData('new')" size="small">新建巡检点</el-button>
    </div> -->
    <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 资产详情 -->
    <el-dialog title="资产详情" :visible.sync="dialogVisible" width="800px" v-if="dialogVisible" v-el-drag-dialog>
        <div class="dialogDetail">
            <el-form :model="dialogForm" :label-width="'120px'" :inline="true" style="text-align: left;">
                <el-form-item label="资产名称：">
                    <div style="width:220px">{{dialogForm.Name}}</div>
                </el-form-item>
                <el-form-item label="所属区域：">
                    <div style="width:220px">{{dialogForm.AreaName}}</div>
                </el-form-item>
                <el-form-item label="资产状态：">
                    <div style="width:220px">{{dialogForm.Specification}}</div>
                </el-form-item>
                <el-form-item label="资产型号：">
                    <div style="width:220px">{{dialogForm.Model}}</div>
                </el-form-item>
                <el-form-item label="资产规格：">
                    <div style="width:220px">{{dialogForm.Specification}}</div>
                </el-form-item>
                <el-form-item label="计量单位：">
                    <div style="width:220px">{{dialogForm.Unit}}</div>
                </el-form-item>
                <el-form-item label="安装地址：">
                    <div style="width:220px">{{dialogForm.AreaDescription}}</div>
                </el-form-item>
                <el-form-item label="设备品牌：">
                    <div style="width:220px">{{dialogForm.Brand}}</div>
                </el-form-item>
                <el-form-item label="生产日期：">
                    <div style="width:220px">{{dialogForm.CreateTime}}</div>
                </el-form-item>
            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <!-- <el-button type="primary" @click="submitDialog">确 定</el-button> -->
        </div>
    </el-dialog>
    <!-- 资产卡片 -->
    <el-dialog title="资产卡片" :visible.sync="cardVisible" v-if="cardVisible" v-el-drag-dialog>
        <div class="cardClass flex" ref="imageWrapper">
            <div class="code flex">
                <!-- <div class="text"></div> -->
                <div class="qrCode" id="qrcode"></div>
            </div>
            <div class="info flex">
                <div class="flex"><span>资产名称：{{cardData.Name}}</span></div>
                <div class="flex"><span>资产类型：{{cardData.CategoryName}}</span></div>
                <div class="flex"><span>安装时间：{{cardData.InstallDate}}</span></div>
                <div class="flex"><span>安装地址：{{cardData.AreaDecscription}}</span></div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cardVisible = false">取 消</el-button>
            <el-button type="primary" @click="downloadIamge">下载</el-button>
        </div>
    </el-dialog>
    <!-- 巡检记录 -->
    <el-dialog title="巡检记录" :visible.sync="inspectionVisible" v-if="inspectionVisible" v-el-drag-dialog>
        <div class="dialogDetail">
            <el-table :data="inspectionData" style="width: 100%" max-height="500px">
                <el-table-column prop="DataName" label="设备名称" align="center">
                </el-table-column>
                <el-table-column prop="CompleteTime" label="巡检时间" align="center"></el-table-column>
                <el-table-column prop="CompleterName" label="巡检人员" align="center"></el-table-column>
                <el-table-column label="巡检结果" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.Result == 0">未巡检</span>
                        <span style="color:#098C0C" v-if="scope.row.Result == 1">正常</span>
                        <span style="color:#F34F4F" v-if="scope.row.Result == 2">异常</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="getInspectionDetail(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="inspectionVisible = false">取 消</el-button>
            <!-- <el-button type="primary" @click="submitDialog">确 定</el-button> -->
        </div>
    </el-dialog>
    <!-- 巡检记录详情 -->
    <el-dialog title="巡检记录详情" :visible.sync="inspectionDetail" width="600px" v-if="inspectionDetail" v-el-drag-dialog>
        <el-form :model="inspectionDetailData" :label-width="'120px'">
            <el-form-item label="巡检照片：">
                <el-image style="width: 100px; height: 100px" v-for="(item,index) in inspectionDetailData.ImageItems" :key="index" :src="URL+'/'+item" :preview-src-list="getImageItems(inspectionDetailData.ImageItems)">
                </el-image>
            </el-form-item>
            <el-form-item label="巡检备注：">
                {{inspectionDetailData.Remark?inspectionDetailData.Remark:'--'}}
            </el-form-item>
        </el-form>
        <el-collapse>
            <el-collapse-item :title="item.Name" name="1" v-for="(item,index) in inspectionDetailData.StandardItems" :key="index">
                <el-table :data="JSON.parse(item.Content)" style="width: 100%">
                    <el-table-column prop="Name" label="巡检内容" align="center"> </el-table-column>
                    <el-table-column prop="Result" label="巡检结果" align="center">
                        <template slot-scope="scope">
                            <span style="color:rgb(233, 233, 235)" type="info" v-if="scope.row.Result == 0">未巡检</span>
                            <span style="color:rgb(103, 194, 58)" type="success" v-if="scope.row.Result == 1">正常</span>
                            <span style="color:rgb(245, 108, 108)" type="warning" v-if="scope.row.Result == 2">异常</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>

        <div slot="footer" class="dialog-footer">
            <el-button @click="inspectionDetail = false">取 消</el-button>
            <!-- <el-button type="primary" @click="submitDialog">确 定</el-button> -->
        </div>
    </el-dialog>
    <!-- 维保记录 -->
    <el-dialog title="维保记录" :visible.sync="maintenanceVisible" width="600px" v-if="maintenanceVisible" v-el-drag-dialog>
        <div class="dialogDetail">
            <el-table :data="maintenanceData" style="width: 100%" max-height="500px">
                <el-table-column prop="CompleteTime" label="维保时间" align="center"></el-table-column>
                <el-table-column prop="CompleteUserName" label="维保人员" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="getMaintenanceDetail(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="maintenanceVisible = false">取 消</el-button>
            <!-- <el-button type="primary" @click="submitDialog">确 定</el-button> -->
        </div>
    </el-dialog>
    <!-- 维保记录详情 -->
    <el-dialog title="维保记录详情" :visible.sync="maintenanceDetailVisible" width="600px" v-if="maintenanceDetailVisible" v-el-drag-dialog>
        <div class="dialogDetail">
            <el-form :model="maintenanceDetailData" :label-width="'120px'">
                <el-form-item label="维保单号：">
                    {{maintenanceDetailData.PlanNumber}}
                </el-form-item>
                <el-form-item label="维保时间：">
                    {{maintenanceDetailData.CreateTime}}
                </el-form-item>
                <el-form-item label="维保设备：">
                    <el-tag type="info" v-for="(item,index) in maintenanceDetailData.DeviceList" :key="index" style="margin-right:5px;margin-bottom:5px">{{item.Name}}</el-tag>
                </el-form-item>
                <el-form-item label="维保内容：">
                    <div v-for="(item,index) in maintenanceDetailData.StandardItem" :key="index" style="margin-bottom:5px">{{index+1}}、{{item.Name}}</div>
                </el-form-item>
                <el-form-item label="维保流程：">
                    <el-timeline>
                        <el-timeline-item v-for="(activity, index) in maintenanceDetailData.WorkFlow" :key="index" :timestamp="activity.CompleteTime">
                            <div>
                                {{activity.RealUserName}}：{{activity.Action}}
                            </div>
                            <div>
                                备注：{{activity.Remark}}
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </el-form-item>
            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="maintenanceDetailVisible = false">取 消</el-button>
            <!-- <el-button type="primary" @click="submitDialog">确 定</el-button> -->
        </div>
    </el-dialog>
    <!-- 维修记录 -->
    <el-dialog title="维修记录" :visible.sync="repairVisible" width="600px" v-if="repairVisible" v-el-drag-dialog>
        <div class="dialogDetail">
            <el-table :data="repairData" style="width: 100%" max-height="500px">
                <el-table-column prop="CompleteTime" label="维修时间" align="center"></el-table-column>
                <el-table-column prop="CompleteUserName" label="维修人员" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="getRepairDetail(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="repairVisible = false">取 消</el-button>
            <!-- <el-button type="primary" @click="submitDialog">确 定</el-button> -->
        </div>
    </el-dialog>
    <!-- 维修记录详情 -->
    <el-dialog title="维修记录详情" :visible.sync="repairDetailVisible" width="600px" v-if="repairDetailVisible" v-el-drag-dialog>
        <div class="dialogDetail">
            <el-form :model="repairDetailData" :label-width="'120px'">
                <el-form-item label="维修单号：">
                    {{repairDetailData.PlanNumber}}
                </el-form-item>
                <el-form-item label="维修时间：">
                    {{repairDetailData.CreateTime}}
                </el-form-item>
                <el-form-item label="维修设备：">
                    <el-tag type="info" v-for="(item,index) in repairDetailData.DeviceList" :key="index" style="margin-right:5px;margin-bottom:5px">{{item.Name}}</el-tag>
                </el-form-item>
                <el-form-item label="维修内容：">
                    <div v-for="(item,index) in repairDetailData.StandardItem" :key="index" style="margin-bottom:5px">{{index+1}}、{{item.Name}}</div>
                </el-form-item>
                <el-form-item label="维修流程：">
                    <el-timeline>
                        <el-timeline-item v-for="(activity, index) in repairDetailData.WorkFlow" :key="index" :timestamp="activity.CompleteTime">
                            <div>
                                {{activity.RealUserName}}：{{activity.Action}}
                            </div>
                            <div>
                                备注：{{activity.Remark}}
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </el-form-item>
            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="repairDetailVisible = false">取 消</el-button>
            <!-- <el-button type="primary" @click="submitDialog">确 定</el-button> -->
        </div>
    </el-dialog>
</div>
</template>

<script>
import {
    inspectSheet_List,
    inspectSheet_TaskDetail,
    inspectSheet_GetInspectAsk,
    inspectSheet_GetDeviceResult
} from '@/api/inspectSheet'
import {
    Device_DeviceList,
    Device_QueryDeviceDetail
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

export default {
    components: {
        pagiNation,
        Project
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
                "Id": "string",
                "Name": "string",
                "CategoryId": "string",
                "CategoryName": "string",
                "ProjectId": "string",
                "TeamId": "string",
                "AreaId": 0,
                "AreaName": "string",
                "CreateTime": "2019-09-30T00:58:48.070Z",
                "Unit": "string",
                "Brand": "string",
                "Model": "string",
                "Specification": "string",
                "AreaDescription": "string"
            },
            cardVisible: false, //资产卡片
            cardData: {},
            QRcodeCode: null,
            qrcodeImageUrl: null,
            inspectionVisible: false, //巡检记录
            inspectionData: [],
            inspectionDetail: false, //巡检记录详情
            inspectionDetailData: [],
            url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            srcList: [
                'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
                'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
            ],
            maintenanceVisible: false, //维保记录
            maintenanceData: [],
            maintenanceDetailVisible: false, //维保记录详情
            maintenanceDetailData: {},
            repairVisible: false, //维修记录
            repairData: [],
            repairDetailVisible: false, //维修记录详情
            repairDetailData: {},
            ProjectId: '',
            State: '',

        }
    },
    mounted() {
        this.State = this.$route.params.state || "";
        this.getList();
    },
    methods: {
        changeProjectId(val) {
            this.ProjectId = val;
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
                    },
                    {
                        "Key": "ProjectId",
                        "Operator": 1,
                        "Value": this.ProjectId
                    },
                    {
                        "Key": "State",
                        "Operator": 0,
                        "Value": this.State
                    },
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
        getDetail(row) {
            Device_QueryDeviceDetail({
                id: row.Id
            }).then(res => {
                this.dialogForm = res.Data
                this.dialogVisible = true
            })
        },
        //查看资产卡片
        getCard(row) {
            this.cardData = row
            $("#qrcode").html("");
            // setTimeout(function() {

            // }, 100);
            this.cardVisible = true
            this.QRcodeCode = row.Id
            setTimeout(() => {
                let qrcode = new QRCode("qrcode", {
                    width: 173, // 设置宽度
                    height: 173, // 设置高度
                    text: row.Id
                });
                html2canvas(this.$refs.imageWrapper, {
                    backgroundColor: null
                }).then((canvas) => {
                    let dataURL = canvas.toDataURL("image/png");
                    this.qrcodeImageUrl = dataURL;

                })
            }, 100)
        },
        //下载二维码
        downloadIamge() { //下载图片地址和图片名
            let imgsrc = this.qrcodeImageUrl
            let name = this.QRcodeCode
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
        //查看巡检记录
        getInspection(row) {
            inspectSheet_GetDeviceResult({
                id: row.Id
            }).then(res => {
                this.inspectionData = res.Data
                this.inspectionVisible = true
            })
        },
        //查看巡检记录详情
        getInspectionDetail(row) {
            let data = {
                id: row.TaskId,
                qrCode: row.DataId,
            }
            inspectSheet_GetInspectAsk(data).then(res => {
                this.inspectionDetailData = res.Data
                this.inspectionDetail = true
            })
        },
        //处理图片
        getImageItems(arr) {
            let item = []
            arr.forEach(i => {
                let url = this.$Order + '/' + i
                item.push(url)
            });
            return item
        },
        //查看维保记录
        getMaintenance(row) {
            let data = {
                "Page": 1,
                "Size": 0,
                "OrderBys": [],
                "Conditions": [{
                    "Key": "DeviceList",
                    "Operator": 1,
                    "Value": row.Id
                }]
            }
            WorkFlow_GetWBListByDeviceId(data).then(res => {
                this.maintenanceData = res.Data.Data
                this.maintenanceVisible = true
            })
        },
        //查看维保记录详情
        getMaintenanceDetail(row) {
            WorkFlow_QueryDetail({
                id: row.Id
            }).then(res => {
                this.maintenanceDetailData = res.Data.Info
                this.maintenanceDetailVisible = true
            })
        },
        //查看维修记录
        getRepair(row) {
            let data = {
                "Page": 1,
                "Size": 0,
                "OrderBys": [],
                "Conditions": [{
                    "Key": "DeviceId",
                    "Operator": 0,
                    "Value": row.Id
                }]
            }
            WorkFlow_GetWXListByDeviceId(data).then(res => {
                this.repairData = res.Data.Data
                this.repairVisible = true
            })
        },
        getRepairDetail(row) {
            WorkFlow_QueryDetail({
                id: row.Id
            }).then(res => {
                this.repairDetailData = res.Data.Info
                this.repairDetailVisible = true
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
