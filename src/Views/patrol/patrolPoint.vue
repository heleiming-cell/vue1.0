<template>
<div class="box">
    <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="巡检点名称：">
            <el-input placeholder="巡检点名称" v-model="KeyWord" clearable @change="()=>{KeyWord==''?getList():''}" @keyup.enter.native="getList"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit>
        <el-table-column label="巡检点编码" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.QRCode }}</span>
            </template>
        </el-table-column>
        <el-table-column label="巡检点名称" align="center">
            <template slot-scope="scope">{{ scope.row.PointName }}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
            <template slot-scope="scope">{{ scope.row.PointDescription }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
            <template slot-scope="scope">
                <el-button size="mini" @click="SetState(scope.row)" :type="scope.row.State==1?'success':'info'" plain>{{scope.row.State==1?'启用':'停用'}}</el-button>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <!-- <el-button type="text" size="small" @click="()=>{dialogRecord = true;Record(scope.row)}">巡检记录</el-button> -->

                <el-button type="text" size="small" @click="editData(scope.row)">编辑</el-button>

                <el-button type="text" @click="generaCode(scope.row)">生成二维码</el-button>

                <!-- <el-button type="text" size="small" @click="removeData(scope.row)">删除</el-button> -->

                <!-- <el-button type="text" size="small" @click="editStandard(scope.row)">编辑</el-button> -->
            </template>
        </el-table-column>
    </el-table>
    <div class="footerBtn">
        <el-button type="primary" @click="()=>{dialogVisible = true;dialogTitle='新建巡检点';formData={
        Id:'',
        PointName:'',
        PointDescription:'',
        AreaId:'',
        QRCode:'',
        State:1,
        PointLat:'',
        PointLng:'',
        SysCode:[],
      }}">新建巡检点</el-button>
    </div>
    <el-pagination :page-size="listQuery.limit" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <el-dialog :visible.sync="dialogVisible" v-if="dialogVisible" :title="dialogTitle" center>
        <div class="dialogClass">
            <el-form label-position="right" :model="formData" :rules="formRules" ref="dialogForm">
                <el-form-item label="巡检点名称：" label-width="120px" prop="PointName">
                    <el-input v-model="formData.PointName" placeholder="巡检点名称"></el-input>
                </el-form-item>
                <el-form-item label="所属区域：" label-width="120px" prop="SysCode">
                    <SelectArea :areaData="formData.SysCode" @value="selectAllCate" />
                </el-form-item>
                <el-form-item label="二维码编码：" label-width="120px" prop="QRCode">
                    <el-input v-model="formData.QRCode" placeholder="二维码编码"></el-input>
                </el-form-item>
                <el-form-item label="巡检点状态：" label-width="120px" prop="State">
                    <el-radio-group v-model="formData.State">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="备注信息：" label-width="120px">
                    <el-input v-model="formData.PointDescription" placeholder="备注信息"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关 闭</el-button>
            <el-button type="primary" @click="UpdateData('dialogForm')">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogRecord" title="巡检记录" center>
        <div class="dialogClass">
            <el-table v-loading="listLoading" :data="recordList" element-loading-text="Loading" border fit highlight-current-row>
                <el-table-column label="巡检点名称" align="center">
                    <template slot-scope="scope">{{ scope.row.PointName }}</template>
                </el-table-column>
                <el-table-column label="巡检人员" align="center">
                    <template slot-scope="scope">{{ scope.row.CreaterName }}</template>
                </el-table-column>
                <!-- <el-table-column label="管理部门" align="center">
<template slot-scope="scope">
     {{ scope.row.InspectDepartmentName }}
</template>
          </el-table-column>-->
                <el-table-column label="巡检时间" align="center">
                    <template slot-scope="scope">{{ scope.row.CompleteTime }}</template>
                </el-table-column>
                <el-table-column label="巡检结果" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.Result==1?'success':'danger'">{{ scope.row.Result==1?'合格':'不合格' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="被扣分数" align="center">
                    <template slot-scope="scope">{{scope.row.Score}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="recordDetail(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="dialogTotal>0" :total="dialogTotal" :page.sync="dialogListQuery.page" :limit.sync="dialogListQuery.limit" @pagination="getList" />
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogRecord = false">关 闭</el-button>
        </span>
    </el-dialog>
    <el-dialog v-el-drag-dialog :visible.sync="dialogPoint" v-if="dialogPoint" title="记录详情" center>
        <div class="dialogClass">
            <div v-for="(item,index) in dialogPointData.StandardList" :key="index">
                <p style="text-align:center;font-size: 16px;font-weight: bold;">{{item.StandardName}}</p>
                <!-- data="item.UnQualifiedList" -->
                <tree-table :data="itemStandard(item.Standard)" border>
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
                </tree-table>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogPoint = false">关 闭</el-button>
            <el-button type="primary" @click="dialogPoint = false">确 定</el-button>
        </span>
    </el-dialog>
    <div v-show="qrcodeShow" class="qrcodeDiv">
        <div ref="imageWrapper" @click="qrcodeShow = false">
            <div id="qrcode" ref="qrcode"></div>
        </div>
        <div style="padding-top: 5px; text-align: center;">
            <el-button alt="下载二维码" icon="el-icon-download" circle @click="downs"></el-button>
        </div>
    </div>
</div>
</template>

<script>
import SelectArea from '@/components/filter/SelectArea'
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import $ from "jquery";
export default {
    components: {
        SelectArea
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
            listLoading: false,
            total: 0,
            listQuery: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: "+id"
            },
            dialogTotal: 0,
            dialogListQuery: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: "+id"
            },
            KeyWord: "",
            dialogVisible: false,
            dialogTitle: "新建巡检点",
            formData: {
                Id: "",
                PointName: "",
                PointDescription: "",
                AreaId: "",
                QRCode: "",
                State: 1,
                PointLat: "",
                PointLng: "",
                SysCode: []
            },
            formRules: {
                PointName: [{
                    required: true,
                    message: "请输入巡检点名称",
                    trigger: "blur"
                }],
                QRCode: [{
                    required: true,
                    message: "请输入二维码编码",
                    trigger: "blur"
                }],
                State: [{
                    required: true,
                    message: "请选择巡检点状态",
                    trigger: "click",
                    type: "number"
                }],
                SysCode: [{
                    required: true,
                    message: "请选择区域",
                    trigger: "change"
                }]
            },
            dialogRecord: false,
            recordList: null,
            dialogPoint: false,
            dialogPointData: null,

            dialogGisBind: false,
            map: null,
            positionLat: "",
            positionLong: "",
            layers: [],
            MaintenanceId: "",

            qrcodeShow: false,
            qrcodeImageUrl: "",
            qrcodeTitle: "",
            rowData: null,
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            let data = {
                Page: this.listQuery.page,
                Size: this.listQuery.limit,
                KeyWord: this.KeyWord
            };

            this.$ajax.get(this.$URL + '/SysPoint/GetPointList', {
                params: data
            }).then(result => {
                this.list = result.data.data;
                this.total = result.data.count;
                this.listLoading = false;
            });
        },
        //编辑或新增巡检点
        UpdateData(formName) {
            let _this = this;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$ajax.post(_this.$URL + '/SysPoint/UpdateOrNew', this.formData).then(result => {
                        this.dialogVisible = false;
                        this.getList();
                        this.$message.success("保存成功！");
                    });
                } else {
                    return false;
                }
            });
        },
        //选择标准
        selectAllCate(val) {
            this.formData.AreaId = val[val.length - 1];
            this.formData.SysCode = val;
        },
        //删除标准
        removeData(row) {
            this.$confirm("此操作将删除该巡检点, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    let data = {
                        ID: row.InspectPointID
                    };
                    RemoveInspectPoint(data).then(response => {
                        this.getList();
                    });
                })
                .catch(() => {});
        },
        //编辑标准
        editData(row) {
            this.dialogTitle = "编辑巡检点";
            this.formData = {
                Id: row.Id,
                PointName: row.PointName,
                PointDescription: row.PointDescription,
                AreaId: row.AreaId,
                QRCode: row.QRCode,
                State: row.State,
                PointLat: row.PointLat,
                PointLng: row.PointLng,
                SysCode: JSON.parse(row.SysCode)
            };
            this.dialogVisible = true;
        },
        //查看巡查记录
        Record(row) {
            let data = {
                pointId: row.Id
                // page:this.dialogListQuery.page,
                // size:this.dialogListQuery.limit,
            };

            this.$ajax.get(_this.$URL + '/SysPoint/GetPointById', {
                params: data
            }).then(result => {
                this.recordList = result.data.data;
                this.dialogTotal = result.data.count;
            });

        },
        //设置巡检点启用状态
        SetState(row) {
            let data = {
                id: row.Id,
                state: row.State == 1 ? 0 : 1
            };

            this.$ajax.get(_this.$URL + '/SysPoint/SetPointState', {
                params: data
            }).then(result => {
                this.getList();
                this.$message.success("设置成功！");
            });

        },
        //巡检点记录详情
        recordDetail(row) {
            GetSheetPointById({
                pointId: row.PointId
            }).then(response => {
                this.dialogPoint = true;
                this.dialogPointData = response.data;
            });
        },
        itemStandard(item) {
            return JSON.parse(item);
        },
        // 生成二维码
        generaCode(row) {
            let data = row;
            this.qrcodeTitle = row.PointName;
            $("#qrcode").html("");
            // setTimeout(function() {
            // }, 100);
            let qrcode = new QRCode("qrcode", {
                width: 180, // 设置宽度
                height: 180, // 设置高度
                text: data.QRCode
            });
            setTimeout(() => {
                html2canvas(this.$refs.imageWrapper, {
                    backgroundColor: null
                }).then(canvas => {
                    let dataURL = canvas.toDataURL("image/png");
                    this.qrcodeImageUrl = dataURL;

                    // this.downs(row.PointName)
                });
            }, 100);
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
            this.downloadIamge(this.qrcodeImageUrl, this.rowData ? this.rowData.PointName : '')
            this.qrcodeShow = false
        },
        handleCurrentChange(val) {
            this.listQuery.page = val
            this.getList();
        },

    }
};
</script>

<style lang="less" scoped>
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

.footerBtn {
    margin: 10px 0;
    width: 100%;
    text-align: right;
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
</style>
