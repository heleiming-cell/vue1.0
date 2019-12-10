<template>
<div class="inspection-container">
    <div class="filter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="巡检点编号">
                <el-input v-model="formInline.Code" placeholder="巡检点编号" clearable=""></el-input>
            </el-form-item>
            <el-form-item label="创建人">
                <el-input v-model="formInline.CreaterName" placeholder="创建人" clearable=""></el-input>
            </el-form-item>
            <el-form-item label="项目">
                <Project :value="ProjectId" :cate="'project'" @change="changeProjectId" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" height="calc(100% - 200px)">
        <el-table-column prop="Code" label="巡检点编号" align="center">
        </el-table-column>
        <el-table-column prop="Name" label="巡检点名称" align="center">
        </el-table-column>
        <el-table-column prop="Description" label="备注" align="center">
        </el-table-column>
        <el-table-column prop="CreaterName" label="创建人" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="editData(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="removeData(scope.row)" style="color:#E98E8E">删除</el-button>
                <el-button type="text" size="small" @click="bindGis(scope.row)">gis绑点</el-button>
                <el-button type="text" size="small" @click="getQRcode(scope.row)">二维码</el-button>
                <el-button type="text" size="small" @click="getRecord(scope.row)">巡检记录</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="add-new">
        <el-button type="primary" @click="editData('new')" size="small">新建巡检点</el-button>
    </div>
    <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 编辑、新建巡检点     -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" v-if="dialogVisible" v-el-drag-dialog>
        <el-form :model="dialogForm" :label-width="'120px'" :rules="dialogrules" ref="dialogForm">
            <el-form-item label="巡检点编号：" prop="Code">
                <el-input v-model="dialogForm.Code" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="巡检点名称：" prop="Name">
                <el-input v-model="dialogForm.Name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="项目：" prop="ProjectId">
                <Project :value="dialogForm.ProjectId" :cate="'project'" @change="changeProjectId" />
            </el-form-item>
            <el-form-item label="所在区域：" prop="AreaId">
                <Project :value="dialogForm.AreaId" :cate="'areacate'" @change="changeAreaId" />
            </el-form-item>
            <el-form-item label="备注：" prop="Description">
                <el-input v-model="dialogForm.Description" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitDialog('dialogForm')">确 定</el-button>
        </div>
    </el-dialog>
    <!-- gis绑点 -->
    <el-dialog title="GIS绑点" :visible.sync="GisVisible" v-if="GisVisible" v-el-drag-dialog>
        <div class="gis-container">
            <Map @change="changeMap" :gis="{lng:dialogForm.Lng,lat:dialogForm.Lat}" />
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="GisVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitDialog('gis')">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 巡检记录 -->
    <el-dialog title="巡检记录" :visible.sync="recordVisible" v-if="recordVisible" v-el-drag-dialog>
        <el-table :data="recordData" style="width: 100%" max-height="500px">
            <el-table-column prop="DataName" label="巡检点" align="center">
            </el-table-column>
            <el-table-column prop="CompleterName" label="巡检人员" align="center">
            </el-table-column>
            <el-table-column prop="CompleteTime" label="巡检时间" align="center">
            </el-table-column>
            <el-table-column label="巡检结果" align="center">
                <template slot-scope="scope">
                    <span style="color:rgb(233, 233, 235)" type="info" v-if="scope.row.Result == 0">未巡检</span>
                    <span style="color:rgb(103, 194, 58)" type="success" v-if="scope.row.Result == 1">正常</span>
                    <span style="color:rgb(245, 108, 108)" type="warning" v-if="scope.row.Result == 2">异常</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="getDetail(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="recordVisible = false">关 闭</el-button>
        </div>
    </el-dialog>
    <!-- 巡检记录详情 -->
    <el-dialog title="巡检记录详情" :visible.sync="detailVisible" v-if="detailVisible" v-el-drag-dialog>
        <el-form :model="detailData" :label-width="'120px'">
            <el-form-item label="巡检照片：">
                <el-image style="width: 100px; height: 100px" v-for="(item,index) in detailData.ImageItems" :key="index" :src="URL+'/'+item" :preview-src-list="getImageItems(detailData.ImageItems)">
                </el-image>
            </el-form-item>
            <el-form-item label="巡检备注：">
                {{detailData.Remark?detailData.Remark:'--'}}
            </el-form-item>
        </el-form>
        <el-collapse>
            <el-collapse-item :title="item.Name" name="1" v-for="(item,index) in detailData.StandardItems" :key="index">
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
            <el-button @click="detailVisible = false">关 闭</el-button>
        </div>
    </el-dialog>
    <!-- 二维码 -->
    <el-dialog title="二维码" :visible.sync="QRcodeVisible" v-if="QRcodeVisible" v-el-drag-dialog>
        <div class="qrcodeDiv flex" ref="">
            <div id="qrcode" ref="imageWrapper"></div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="QRcodeVisible = false">关 闭</el-button>
            <el-button type="primary" @click="downloadIamge">下 载</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import pagiNation from '@/components/common/pagination'
import Project from '@/components/filter/Project'
import DeviceArea from '@/components/filter/DeviceArea'
import Map from './components/map'
import {
    inspectPoint_QueryList,
    inspectPoint_AddOrUpdate,
    inspectPoint_Del,

} from '@/api/inspectPoint'
import {
    inspectSheet_GetPointResult,
    inspectSheet_GetInspectAsk
} from '@/api/inspectSheet'

import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import $ from "jquery"

export default {
    components: {
        pagiNation,
        Project,
        Map,
    },
    data() {
        return {
            URL: this.$Order,
            formInline: {
                Code: '',
                CreaterName: ''
            },
            listQuery: {
                page: 1,
                limit: 10,
                total: 0,
            },

            tableData: [],
            dialogTitle: '新建巡检点',
            dialogVisible: false,
            dialogForm: {
                "Id": "",
                "Code": "",
                "QrCode": "",
                "Name": "",
                "Description": "",
                "ProjectId": "",
                "ProjectName": "",
                "AreaId": "",
                "AreaName": "",
                "Lat": "",
                "Lng": "",
                "CreaterId": "",
                "CreaterName": "",
                "CreateTime": ""
            },

            GisVisible: false, //gis

            recordData: [],
            recordVisible: false, //记录
            detailVisible: false, //记录详情
            detailData: null,
            QRcodeVisible: false,
            QRcodeCode: '',
            qrcodeImageUrl: '',

            dialogrules: {
                Code: [{
                    required: true,
                    message: '该项为必填',
                    trigger: 'blur'
                }, ],
                Name: [{
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
                AreaId: [{
                    required: true,
                    message: '该项为必填',
                    trigger: 'blur'
                }, ],
            },
            ProjectId: ''
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            let data = {
                "Page": this.listQuery.page,
                "Size": this.listQuery.limit,
                "OrderBys": [],
                "Conditions": [{
                        "Key": "Code",
                        "Operator": 1,
                        "Value": this.formInline.Code || ''
                    },
                    {
                        "Key": "CreaterName",
                        "Operator": 1,
                        "Value": this.formInline.CreaterName || ''
                    },
                    {
                        key: 'ProjectId',
                        "Operator": 0,
                        "Value": this.ProjectId
                    }
                ]
            }
            inspectPoint_QueryList(data).then(res => {
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
                this.dialogForm = {
                    "Id": "",
                    "Code": "",
                    "QrCode": "",
                    "Name": "",
                    "Description": "",
                    "ProjectId": "",
                    "ProjectName": "",
                    "AreaId": "",
                    "AreaName": "",
                    "Lat": "",
                    "Lng": "",
                    "CreaterId": "",
                    "CreaterName": "",
                    "CreateTime": ""
                }
                this.dialogTitle = '新建巡检点'
                this.dialogVisible = true
            } else {
                this.dialogTitle = '编辑巡检点'
                this.dialogForm = JSON.parse(JSON.stringify(row))
                this.dialogVisible = true
            }
        },
        //删除
        removeData(row) {
            this.$confirm('此操作将永久删除该巡检点, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    id: row.Id
                }
                inspectPoint_Del(data).then(res => {
                    this.$message.success('删除成功')
                    this.getList()
                })
            }).catch(() => {

            });
        },
        //gis绑点
        bindGis(row) {
            this.dialogForm = JSON.parse(JSON.stringify(row))
            this.GisVisible = true
        },
        //二维码
        getQRcode(row) {
            $("#qrcode").html("");
            // setTimeout(function() {

            // }, 100);
            this.QRcodeVisible = true
            this.QRcodeCode = row.Id
            setTimeout(() => {
                let qrcode = new QRCode("qrcode", {
                    width: 300, // 设置宽度
                    height: 300, // 设置高度
                    text: row.Id
                });
                html2canvas(this.$refs.imageWrapper, {
                    backgroundColor: null
                }).then((canvas) => {
                    let dataURL = canvas.toDataURL("image/png");
                    this.qrcodeImageUrl = dataURL;
                    // this.qrcodeShow = false
                    // this.downs(row.Code)

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
        //巡检记录
        getRecord(row) {
            inspectSheet_GetPointResult({
                id: row.Id
            }).then(res => {
                this.recordData = res.Data
                this.recordVisible = true
            })
        },
        //保存巡检点
        submitDialog(name) {
            if (name == 'gis') {
                let data = this.dialogForm
                inspectPoint_AddOrUpdate(data).then(res => {
                    this.dialogVisible = false
                    this.GisVisible = false
                    this.getList()
                    this.$message.success('保存成功')
                })
            } else {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data = this.dialogForm
                        inspectPoint_AddOrUpdate(data).then(res => {
                            this.dialogVisible = false
                            this.GisVisible = false
                            this.getList()
                            this.$message.success('保存成功')
                        })
                    }
                })
            }

        },
        //改变项目
        changeProjectId(val) {
            this.dialogForm.ProjectId = val;
            this.ProjectId=val;
        },
        //改变区域
        changeAreaId(val) {
            this.dialogForm.AreaId = val
        },
        //改变gis坐标
        changeMap(map) {
            this.dialogForm.Lng = map.lng
            this.dialogForm.Lat = map.lat
        },
        //查看详情
        getDetail(row) {
            let data = {
                id: row.TaskId,
                qrCode: row.DataId,
            }
            inspectSheet_GetInspectAsk(data).then(res => {
                this.detailData = res.Data
                this.detailVisible = true
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

    .qrcodeDiv {
        margin-bottom: 10px
    }

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

    .gis-container {
        height: 500px;
        width: 100%;
    }
}
</style><style lang="scss">
@import './css/common.scss';
</style>
