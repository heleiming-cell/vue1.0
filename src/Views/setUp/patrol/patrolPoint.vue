<template>
<div class="h100">
    <div class="filter">
        <div class="filter_line">
            <el-input placeholder="支持 名称 查询" v-model="keyword"></el-input>
        </div>
        <div class="filter_line">
            <button class="search" @click="loadAllPoints"> 查询</button>
            <button class="search" @click="pointAdd" style="width: 114px;background-color: green;position: absolute;top: 50%;right: 154px;transform: translate(0,-50%)">新增巡检点</button>
            <!-- <button @click="pointDelete" style="width: 114px;background-color: RGBA(30, 144, 158, 1);position: absolute;top: 50%;right: 20px;transform: translate(0,-50%)" class="a-upload mr10 search hidden-md-and-down">删除</button> -->
        </div>
    </div>
    <el-table :data="list">
        <el-table-column label="巡检点编码">
            <template slot-scope="scope">
                <span>{{ scope.row.Code }}</span>
            </template>
        </el-table-column>
        <el-table-column label="巡检点名称">
            <template slot-scope="scope">
                {{ scope.row.Name }}
            </template>
        </el-table-column>
        <el-table-column label="备注">
            <template slot-scope="scope">
                {{ scope.row.Description }}
            </template>
        </el-table-column>
        <el-table-column label="创建人">
            <template slot-scope="scope">
                {{ scope.row.CreaterName }}
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="editData(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteData(scope.row)">删除</el-button>
                <el-button type="text" size="small" @click="bindGis(scope.row)">gis绑点</el-button>
                <el-button type="text" size="small" @click="()=>{dialogRecord = true;Record(scope.row)}">巡检记录</el-button>
                <el-button type="text" size="small" @click="produce_QRCode(scope.row)">生成二维码</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination :page-size="size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <el-dialog :visible.sync="dialogVisible" v-if="dialogVisible" :title="dialogTitle" width="400px" >
        <div class="dialogClass">
            <el-form  :model="formData" :rules="formRules" ref="dialogForm" :inline="true">
                <el-form-item label="巡检点名称：" label-width="120px" prop="PointName">
                    <el-input v-model="formData.PointName" placeholder="巡检点名称"></el-input>
                </el-form-item>
                <el-form-item label="巡检点编码：" label-width="120px" prop="Code">
                    <el-input v-model="formData.Code" placeholder="巡检点编码"></el-input>
                </el-form-item>
                <el-form-item label="所属区域：" label-width="120px" prop="AreaId">
                    <AllCate :type="'area'" :data_checked_value="formData.AreaId" @value="selectAllCate" :multiple="true" :filterable="true" />
                </el-form-item>
                <el-form-item label="巡检内容：" label-width="120px" prop="StandardId">
                    <AllCate :type="'standard_xj'" :data_checked_value="formData.StandardId" @value="selectAllCateStandard" :filterable="true" />
                </el-form-item>
                <el-form-item label="二维码编码：" label-width="120px" prop="QRCode">
                    <el-input v-model="formData.QRCode" placeholder="二维码编码"></el-input>
                </el-form-item>
                <el-form-item label="具体地址：" label-width="120px">
                    <el-input v-model="formData.PointDescription" placeholder="具体地址"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关 闭</el-button>
            <el-button type="primary" @click="UpdateData('dialogForm')">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog class="dialog_gis" title="gis绑点" :visible.sync="dialogGisBind" width="60%" :append-to-body="true" center>
        <div id="gisBind">
            <span>鼠标双击左键获取点位</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogGisBind = false">关 闭</el-button>
            <el-button type="primary" @click="savePosition">保 存</el-button>
        </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogRecord" title="巡检记录">
        <div class="dialogClass">
            <el-table :data="recordList" fit>
                <el-table-column label="巡检点名称">
                    <template slot-scope="scope">
                        {{ scope.row.DataName }}
                    </template>
                </el-table-column>
                <el-table-column label="巡检人员">
                    <template slot-scope="scope">
                        {{ scope.row.CreaterName }}
                    </template>
                </el-table-column>
                <el-table-column label="巡检时间">
                    <template slot-scope="scope">
                        {{ scope.row.CompleteTime }}
                    </template>
                </el-table-column>
                <el-table-column label="巡检结果">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.Result==1?'success':'danger'">{{ scope.row.Result==1?'正常':'异常' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="被扣分数">
                    <template slot-scope="scope">
                        {{scope.row.Score}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="recordDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :page-size="size" @current-change="handleCurrentChangeDialog" @prev-click="handleCurrentChangeDialog" @next-click="handleCurrentChangeDialog" background layout="total,prev, pager, next" :total="dialogTotal">
            </el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogRecord = false">关 闭</el-button>
        </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogPoint" v-if="dialogPoint" title="记录详情" center>
        <div class="dialogClass">
            <div v-for="(item,i) in dialogPointData.StandardList" :key="i">
                <p style="text-align:center;font-size: 16px;font-weight: bold;">{{item.StandardName}}</p>
                <!-- data="item.UnQualifiedList" -->
                <el-table row-key="id" :data="itemStandard(item.Standard)">
                    <el-table-column label="标准名称/内容">
                        <template slot-scope="scope">
                            <span>{{scope.row.label}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="分值">
                        <template slot-scope="scope">
                            <span>{{scope.row.children&&scope.row.children.length>0?'--':scope.row.score}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="检查状态">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.flag?'success':'danger'">{{scope.row.flag?'正常':'异常'}}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogPoint = false">关 闭</el-button>
            <el-button type="primary" @click="dialogPoint = false">确 定</el-button>
        </span>
    </el-dialog>

    <div class="qrcodeDiv" v-show="qrcodeShow" ref="imageWrapper">
        <div class="title">南京古河云</div>
        <div class="qrcodeDivContainer">
            <div class="qrcodeBox">
                <div id="qrcode" ref="qrcode"></div>
                <div class="code">巡检码：{{QRData.Code}}</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import QRCode from "qrcodejs2"
import html2canvas from "html2canvas"
import pointIcon from '@/assets/point.png'
import AllCate from '@/components/filter/AllCate.vue'
export default {
    name: "patrolPoint",
    components: {
        AllCate
    },
    data() {
        return {
            keyword: '',
            list: [],
            total: 0,
            dialogTotal: 0,
            currentPage: 1,
            dialogVisible: false,
            dialogRecord: false,
            dialogTitle: '',
            size: 10,
            QRData: '',
            formData: {
                Id: '',
                PointName: '',
                PointDescription: '',
                AreaId: '',
                QRCode: '',
                State: 1,
                PointLat: '',
                PointLng: '',
                Code: '',
                StandardId: '',
            },
            qrcodeShow: false,
            dialogGisBind: false,
            layers: [],
            formRules: {
                PointName: [{
                    required: true,
                    message: '请输入巡检点名称',
                    trigger: 'blur'
                }],
                QRCode: [{
                    required: true,
                    message: '请输入二维码编码',
                    trigger: 'blur'
                }],
                State: [{
                    required: true,
                    message: '请选择巡检点状态',
                    trigger: 'click',
                    type: 'number'
                }],
                AreaId: [{
                    required: true,
                    message: '请选择区域',
                    trigger: 'change'
                }],
                StandardId: [{
                    required: true,
                    message: '请选择巡检内容',
                    trigger: 'change'
                }],
            },
            recordList: [],
            dialogPoint: false,
            dialogPointData: [],
            row: null,
        }
    },
    mounted() {
        this.loadAllPoints();
      //  this.loadPatrolContent();
    },
    methods: {
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
            this.indexQR++
        },
        downs(Code) {
            this.downloadIamge(this.qrcodeImageUrl, Code)
        },
        produce_QRCode(row) {
            this.QRData = row
            let data = row;
            $("#qrcode").html("");
            let qrcode = new QRCode("qrcode", {
                width: 500, // 设置宽度
                height: 500, // 设置高度
                text: data.QrCode
            });
            setTimeout(() => {
                html2canvas(this.$refs.imageWrapper, {
                    backgroundColor: null
                }).then((canvas) => {
                    let dataURL = canvas.toDataURL("image/png");
                    this.qrcodeImageUrl = dataURL;
                    this.qrcodeShow = false
                    this.downs(row.Code)
                })
            }, 100)
            this.qrcodeShow = true;
        },
        bindGis(row) {
            this.dialogGisBind = true
            setTimeout(() => {
                this.getInitMap()
                this.MaintenanceId = row.Id
                if (row.PointLat && row.PointLat) {
                    this.positionLat = row.PointLat
                    this.positionLong = row.PointLng
                    this.addMarker()
                } else {
                    this.positionLat = null
                    this.positionLong = null
                }
            }, 50)
        },
        //加载gis地图
        getInitMap() {
            let _this = this
            _this.map = new AMap.Map('gisBind', {
                expandZoomRange: true,
                zoom: 17,
                zooms: [4, 20], //设置地图级别范围
                center: [104.020905, 30.564474],
                buildingAnimation: true,
                defaultCursor: 'default',
                doubleClickZoom: false,
            })
            //双击地图获取经纬度
            _this.map.on('dblclick', function (e) {
                _this.positionLat = e.lnglat.getLat()
                _this.positionLong = e.lnglat.getLng()
                _this.addMarker()
            })
        },
        addMarker() {
            let _this = this
            if (_this.layers.length > 0) {
                _this.map.remove(_this.layers)
            }
            let Mycamera = new AMap.Icon({
                size: new AMap.Size(40, 50),
                image: pointIcon,
                imageOffset: new AMap.Pixel(0, 0),
                imageSize: new AMap.Size(30, 30),
            })
            let point = new AMap.Marker({ //添加自定义点标记
                position: new AMap.LngLat(_this.positionLong, _this.positionLat), //基点位置
                offset: new AMap.Pixel(-15, -15), //相对于基点的偏移位置
                icon: Mycamera,
                draggable: false //设置图标是否可以移动
            });
            _this.layers.push(point)
            _this.map.add(point)
        },
        savePosition() {
            if (this.positionLat && this.positionLong) {
                this.$ajax.get(this.$DMURL + '/SysPoint/SaveGis', {
                    params: {
                        id: this.MaintenanceId,
                        lng: this.positionLong,
                        lat: this.positionLat
                    }
                }).then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.dialogGisBind = false;
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                        this.loadAllPoints();
                    }
                });
            }
        },
        editData(row) {
            this.dialogTitle = "编辑巡检点"
            this.formData = {
                Id: row.Id,
                PointName: row.Name,
                PointDescription: row.Description,
                AreaId: row.AreaIds,
                QRCode: row.QrCode,
                State: "",
                PointLat: row.PointLat,
                PointLng: row.PointLng,
                Code: row.Code,
                StandardId: row.StandardId,
            }
            this.dialogVisible = true
        },
        UpdateData(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        Id: this.formData.Id,
                        Name: this.formData.PointName,
                        Description: this.formData.PointDescription,
                        Code: this.formData.Code,
                        QrCode: this.formData.QRCode,
                        StandardId: this.formData.StandardId,
                        AreaIds: this.formData.AreaId
                    };
                    this.$ajax.post(this.$DMURL + '/SysPoint/UpdateOrNew', data).then(result => {
                        if (result.status === 200 && result.data.success) {
                            this.dialogVisible = false;
                            this.loadAllPoints();
                        }
                    });
                } else {
                    return false
                }
            })

        },
        selectAllCateStandard(val) {
            this.formData.StandardId = val
        },
        deleteData(row) {
            this.$confirm('此操作将删除该巡检点, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get(this.$DMURL + '/SysPoint/Del', {
                    params: {
                        ID: row.Id
                    }
                }).then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.loadAllPoints();
                    }
                });
            })
        },
        selectAllCate(val) {
            this.formData.AreaId = val
        },
        Record(row) {
            if (row) {
                this.row = row;
            }
            this.dialogRecord = true;
            this.$ajax.get(this.$DMURL + '/SysSheet/GetResultByPointId', {
                params: {
                    pointId: row ? row.Id : this.row.Id,
                    page: this.currentPage,
                    size: this.size,
                }
            }).then(result => {
                if (result.status === 200 && result.data.success) {
                    this.recordList = result.data.data;
                    this.dialogTotal = result.data.count;
                }
            });
        },
        recordDetail(row) {
            this.$ajax.get(this.$DMURL + '/SysSheet/GetDataDetail', {
                params: {
                    id: row.Id
                }
            }).then(result => {
                if (result.status === 200 && result.data.success) {
                    this.dialogPoint = true
                    this.dialogPointData = result.data.data
                }
            });
        },
        itemStandard(item) {
            return JSON.parse(item)
        },
        pointAdd() {
            this.dialogVisible = true;
            this.dialogTitle = '新建巡检点';
            this.formData = {
                Id: '',
                PointName: '',
                PointDescription: '',
                AreaId: '',
                QRCode: '',
                State: 1,
                PointLat: '',
                PointLng: '',
                Code: '',
                StandardId: '',
            }
        },
        loadAllPoints() {
            this.$ajax.get(this.$DMURL + '/SysPoint/GetList', {
                params: {
                    Page: this.currentPage,
                    Size: this.size,
                    KeyWord: this.keyword
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {

                    this.list = result.data.data;
                    this.total = result.data.count;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        onSelect(v) {
            console.log(v);
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.loadAllPoints();
        },
        handleCurrentChangeDialog(val) {
            this.currentPage = val
            this.Record();
        },
    }
}
</script>

<style lang="less" scoped>
table {
    height: 100% !important;
}

.dialog_gis /deep/ .el-dialog__body {
    padding: 5px;
}

#gisBind {
    width: 100%;
    height: 500px;

}

.dialog_gis .el-dialog--center .el-dialog__body {
    padding: 0;
}

#gisBind span {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2000;
    color: #eeeeee;
}

.qrcodeDiv {
    position: absolute;
    width: 550px;
    height: 700px;
    top: 100px;
    top: -1000px;
    left: calc(50% - 300px);
    background-color: white;
    color: black;
    z-index: 1000;
    z-index: -1000;
    // border: 5px solid black;

    div.title {
        width: 100%;
        height: 96px;
        line-height: 96px;
        text-align: center;
        font-size: 46px;
        letter-spacing: 15px;
        font-family: "Microsoft YaHei";
        font-weight: bold;
        // border-bottom: 5px solid black;

    }

    >div.qrcodeDivContainer {
        width: 100%;
        height: calc(100% - 96px);
        display: flex;
        justify-content: center;
        align-items: center;

        >div {
            width: 100%;
            height: 100%;
        }

        >div.qrcodeBox {
            // border-right: 5px solid black;
            text-align: center;

            #qrcode {
                display: flex;
                text-align: center;
                justify-content: center;
                align-items: center;
                padding-bottom: 15px;
            }

            >div.code {
                height: 30px;
                line-height: 32px;
                font-size: 32px;
                letter-spacing: 3px;
            }
        }

        >div.info {
            >div {
                width: 100%;
                // height: 20%;
                font-size: 26px;
                display: flex;
                justify-content: left;
                align-items: center;
                padding-left: 10px;
                margin-top: 20px;
            }
        }
    }

}
</style>
