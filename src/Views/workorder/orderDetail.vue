<template>
<!-- 工单详情 -->
<div class="tableScrollbar">
    <div class="orderContainer">
        <el-row class="orderDetailContainer" type="flex" justify="space-between">
            <el-col v-if="datacontent.Type==1">工单详情</el-col>
            <el-col v-if="datacontent.Type==2">维保详情</el-col>
            <el-col class="order-icon">
                <i class="el-icon-close" @click="goback"></i>
            </el-col>
        </el-row>
        <el-row>
            <!-- 基础信息 -->
            <el-col class="basicsCard" v-if="datacontent.Type==1">
                <el-card>
                    <div slot="header" class="card-header">
                        <span>基础信息</span>
                    </div>
                    <div class="card-body">
                        <div class="basics-title">
                            <p>工 单 号：</p>
                            <p>创 建 人 员：</p>
                            <p>创 建 时 间：</p>
                            <p>区 域：</p>
                            <p>设 备 类 型：</p>
                            <p>主 题：</p>
                        </div>
                        <div class="basics-content">
                            <p>{{basicsContent.Number?basicsContent.Number:'--'}}</p>
                            <p>{{basicsContent.CreaterName}}</p>
                            <p>{{basicsContent.CreateTime}}</p>
                            <p>{{basicsContent.AreaName?basicsContent.AreaName:'--'}}</p>
                            <p>{{basicsContent.DeviceCategoryName?basicsContent.DeviceCategoryName:'--'}}</p>
                            <p>{{basicsContent.Remark?basicsContent.Remark:'--'}}</p>
                            <p class="infoImg">
                                <img :src="url+'/'+item" alt v-for="item in basicsContent.Files" :key="item" @click="imgClick(item)" width="45px" height="45px" />
                            </p>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <!-- 设备详情 -->
            <el-col class="equipmentCard" v-if="datacontent.Type==1">
                <el-collapse accordion>
                    <el-collapse-item title="设备详情" name="1">
                        <div class="equipment-title">
                            <p>设 备 编 号：</p>
                            <p>设 备 名 称：</p>
                            <p>设 备 型 号：</p>
                            <p>设 备 品 牌：</p>
                            <p>安 装 地 址：</p>
                            <p>安 装 日 期：</p>
                        </div>
                        <div class="equipment-content">
                            <p>{{equipmentContent.Code?equipmentContent.Code:'--'}}</p>
                            <p>{{equipmentContent.Name?equipmentContent.Name:'--'}}</p>
                            <p>{{equipmentContent.Model?equipmentContent.Model:'--'}}</p>
                            <p>{{equipmentContent.Brand?equipmentContent.Brand:'--'}}</p>
                            <p>{{equipmentContent.AreaDescription?equipmentContent.AreaDescription:'--'}}</p>
                            <p>{{equipmentContent.InstallDate?equipmentContent.InstallDate:'--'}}</p>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-col>

            <!-- 维保详情 -->
            <el-col class="equipmentCard" v-if="datacontent.Type==2">
                <el-collapse accordion v-model="activeNames">
                    <el-collapse-item title="维保详情" name="1">
                        <div class="maintenance">
                            <el-form>
                                <el-form-item label="维 保 单 号：">
                                    <el-input :disabled="true" v-model="basicsContent.PlanNumber"></el-input>
                                </el-form-item>
                                <el-form-item label="维 保 人 员：">
                                    <el-input :disabled="true" v-model="datacontent.completeusername"></el-input>
                                </el-form-item>
                                <el-form-item label="维 保 时 间：">
                                    <el-input :disabled="true" v-model="datacontent.CompleteTime"></el-input>
                                </el-form-item>
                            </el-form>
                            <div class="relevanceEquipment">
                                <span>关 联 设 备：</span>
                                <div>
                                    <span v-for="item in basicsContent.DeviceList" :key="item.Id">{{item.Name}}</span>
                                </div>
                            </div>
                            <div class="maintenanceDetail">
                                <span>维 保 标 准：</span>
                                <div class="table">
                                    <el-table :data="basicsContent.StandardItem">
                                        <el-table-column label="序号" type="index" width="70" align="center"></el-table-column>
                                        <el-table-column label="维保标准" align="center" prop="Name"></el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-col>

            <!-- 工单流程 -->
            <el-col class="flowCard">
                <el-card>
                    <div slot="header" class="card-header">
                        <span v-if="datacontent.Type==1">工单流程</span>
                        <span v-if="datacontent.Type==2">维保流程</span>
                    </div>
                    <div class="card-body">
                        <el-row type="flex">
                            <el-col :span="10">
                                <div class="flow-user" v-for="(item,index) in flowContent" :key="index">
                                    <p>
                                        <span class="name">{{item.RealUserName}}</span>
                                    </p>
                                    <el-divider direction="vertical"></el-divider>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div class="flow-order" v-for="(item,index2) in flowContent" :key="index2">
                                    <p>{{item.ActionName}}</p>
                                    <p class="Remark">{{item.Remark}}</p>
                                    <p v-show="item.SpareList.length>0" class="getPartSum">
                                        领取备件总数：
                                        <span>{{item.SpareList | filterNum}}</span>
                                    </p>
                                </div>
                            </el-col>
                            <el-col :span="9">
                                <div class="flow-date" v-for="(item,i) in flowContent" :key="i">
                                    <p>{{item.CreateTime}}</p>
                                    <p>
                                        <img :src="url+'/'+item" alt v-for="(item,index) in item.Files" :key="index" @click="imgClick(item)" width="30px" class="workflow" />
                                    </p>
                                    <p v-show="item.SpareList.length>0" class="seeDetail">
                                        <el-button type="text" @click="seeDetailClick(item.SpareList)">查看详情</el-button>
                                    </p>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row v-if="flowContent.length>0&&this.$route.query.name!='已完成'&&this.ActionName!='审核'">
                            <el-col class="distanceTime">
                                <div>
                                    距离现在已经
                                    <span>{{fromNowTime}}</span> 未处理
                                </div>
                            </el-col>
                        </el-row>
                        <!-- 按钮 -->
                        <el-row class="btnRow">
                            <el-col>
                                <el-button size="mini" v-for="(item,index3) in datacontent.Btns" :key="index3" @click="flowBtnClick(item)" type="primary">{{item}}</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>

    <!--******** 工单流程按钮弹出框 ******* -->
    <el-dialog :visible.sync="sendDialogVisible" :title="action=='派单'?'派单详情':action=='接单'?'接单详情':action=='退回'?'退回详情':
      action=='转交'?'转交详情':action=='关闭'?'关闭详情':action=='完成'?'完成详情':
      action=='挂起'?'挂起详情':action=='关闭待审核'?'关闭待审核':action=='挂起待审核'?'挂起待审核':
      action=='完成待审核'?'完成待审核':''" width="30%" @close="closeDialog" center class="dialogContainer">
        <el-form :model="actionForm" label-width="120px">
            <el-form-item label="处 理 人：" v-if="action=='派单'||action=='接单'">
                <allSelect :type="type" :value="relateId" @change="selectChange" :projectId="projectId"></allSelect>
            </el-form-item>
            <el-form-item label="维 修 组：" v-if="action=='转交'">
                <allSelect :type="maintaintype" :value="relateId" @change="maintainSelectChange" :projectId="projectId"></allSelect>
            </el-form-item>
            <el-form-item label="完成时间：" v-if="action=='接单'||action=='派单'">
                <el-date-picker v-model="actionForm.time" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="备 注：" v-if="action=='退回'||action=='关闭'||action=='完成'||action=='挂起'||action=='关闭待审核'||action=='挂起待审核'||action=='完成待审核'">
                <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="actionForm.textarea"></el-input>
            </el-form-item>
            <el-form-item label="上传图片：" v-if="action=='退回'||action=='关闭'||action=='完成'||action=='挂起'||action=='关闭待审核'||action=='挂起待审核'||action=='完成待审核'" class="picture">
                <el-upload class="upload-demo" action :limit="10" list-type="picture-card" :file-list="fileList" :on-remove="removeFun" :before-upload="beforeAvatarUpload">
                    <el-button size="mini" type="primary" class="upload">+</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel" size="mini">取 消</el-button>
            <el-button type="primary" @click="sendClick" size="mini">确 定</el-button>
        </span>
    </el-dialog>

    <!-- ********领取设备详情******* -->
    <el-dialog :visible.sync="getDialogVisible" title="领取备件详情" width="30%" center class="getDialogVisibleContainer" @close="closeWarehouse">
        <div>
            <span>仓库名称：</span>
            <el-select v-model="Warehouse" @change="WarehouseChange">
                <el-option v-for="(item,i) in WarehouseOptions" :key="i" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
        </div>
        <div class="table">
            <el-table :data="tableData">
                <el-table-column label="设备名称" prop="SpareName" align="center"></el-table-column>
                <el-table-column label="库存数量" prop="Count" align="center"></el-table-column>
                <el-table-column label="领取数量" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="add(scope.row)">+</el-button>
                        <span>{{scope.row.Num}}</span>
                        <el-button size="mini" @click="subtract(scope.row)">-</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="getDialogSum">
            共计：
            <span>{{sum}}</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="spareClick">确定</el-button>
        </span>
    </el-dialog>
    <!-- 挂起审核详情 -->
    <el-dialog :visible.sync="auditDialogVisible" title="挂起审核详情" width="30%" center class="auditDialogVisibleContainer">
        <div class="dialogBody">
            本工单是否同意
            <span>张三</span>挂起？
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini">同意</el-button>
            <el-button type="info" size="mini" @click="auditDialogVisible=false">拒绝</el-button>
        </span>
    </el-dialog>

    <!-- 图片 -->
    <el-dialog :visible.sync="imgDialogVisible" class="imgDialog">
        <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>

    <!-- **************已领取备件回显表格********** -->
    <el-dialog :visible.sync="parkDialog" title="领取备件详情" width="30%" class="parkTable">
        <el-table :data="parkData" :header-cell-style="{background:'#284c8e'}">
            <el-table-column label="备件名称" prop="SpareName" align="center"></el-table-column>
            <el-table-column label="备件数量" prop="Num" align="center"></el-table-column>
        </el-table>
        <div class="parkSum">总计：{{parkData | filterNum}} 件</div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="parkDialog=false">确认</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import allSelect from "@/components/filter/AllSelect";
import Vue from "vue";
export default {
    components: {
        allSelect
    },
    // inject: ["reload"],
    data() {
        return {
            imgDialogVisible: false,
            parkDialog: false,
            dialogImageUrl: "",
            id: "",
            uploadAction: this.$Order + "/sys/Public/UpFile",
            type: "teamUser",
            maintaintype: "team",
            relateId: "", //关联ID，派单表示UserId,转交时表示TeamId
            projectId: "",
            action: "",
            actionForm: {
                time: "",
                textarea: ""
            },
            basicsContent: "", //基础信息
            equipmentContent: "", //设备详情
            flowContent: "", //工单流程
            sendDialogVisible: false, //派单弹窗
            getDialogVisible: false, //领取弹窗
            auditDialogVisible: false, //挂起审核弹窗
            dialogVisible: false,
            fileData: [], //文件
            fileList: [],
            formData: "",
            Hangpeople: "", //挂起人
            Warehouse: "", //仓库名
            WarehouseOptions: [],
            tableData: [],
            sum: 0, //领取总数
            amount: 0,
            fromNowTime: "0时0分0秒",
            // completeusername:"",//维保人员
            activeNames: ["1"],
            datacontent: "",
            ActionName: "",
            url: this.$Order,
            parkData: []
        };
    },
    filters: {
        filterNum(val) {
            if (val && val.length > 0) {
                let sum = 0;
                val.forEach(ele => {
                    sum += ele.Num;
                });
                return sum;
            }
        }
    },
    methods: {
        imgClick(item) {
            this.dialogImageUrl = this.$Order + "/" + item;
            this.imgDialogVisible = true;
        },
        // 返回
        goback() {
            this.$router.go(-1);
        },
        // 工单详情
        getDetail() {
            this.$ajax
                .post(this.$Order + `/sys/WorkFlow/QueryDetail?id=${this.id}`)
                .then(res => {
                    if (res.data.Success == true) {
                        this.datacontent = res.data.Data;
                        //维保时间
                        this.datacontent.CompleteTime = this.datacontent.CompleteTime ?
                            this.datacontent.CompleteTime :
                            "- -";
                        //维保人员
                        this.datacontent.completeusername = this.datacontent
                            .completeusername ?
                            this.datacontent.completeusername :
                            "- -";
                        //详情
                        this.basicsContent = res.data.Data.Info;
                        if (res.data.Data.Device) {
                            this.equipmentContent = res.data.Data.Device;
                        }
                        this.flowContent = res.data.Data.WorkFlow;
                        this.ActionName = this.flowContent[
                            this.flowContent.length - 1
                        ].ActionName;
                        this.Hangpeople = this.flowContent[
                            this.flowContent.length - 2
                        ].RealUserName;
                        this.getTime();
                    } else {
                        this.$message.error("获取详情失败！");
                    }
                });
        },
        // 下拉框的值
        selectChange(val) {
            this.relateId = val;
        },
        // 工单流程按钮
        flowBtnClick(val) {
            this.action = val;
            if (val == "领取备件") {
                this.getDialogVisible = true;
                this.getWareHouse();
            } else {
                this.sendDialogVisible = true;
            }
            if (val == "接单") {
                this.sendDialogVisible = false;
                this.$confirm("确认接单吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let params = {
                        MainId: this.id,
                        Action: this.action,
                        Remark: "",
                        RelateId: "",
                        Files: this.formData
                    };
                    this.actionFun(params);
                });
            } else if (val == "审核") {
                let files = [];
                if (this.fileList) {
                    this.fileList.forEach(v => {
                        files.push(v.url);
                    });
                }
                this.sendDialogVisible = false;
                this.$confirm("本工单同意 " + this.Hangpeople + " 完成审核吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "拒绝",
                    type: "warning"
                }).then(() => {
                    let params = {
                        MainId: this.id,
                        Action: this.action,
                        Remark: "",
                        RelateId: "",
                        Files: files
                    };
                    this.actionFun(params);
                });
            }
            if (val == "恢复") {
                this.sendDialogVisible = false;
                this.$confirm("是否恢复该工单？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let params = {
                        MainId: this.id,
                        Action: this.action,
                        Remark: "",
                        RelateId: "",
                        Files: []
                    };
                    this.actionFun(params);
                });
            }
            if (this.datacontent.Type == 1) {
                if (val == "派单") {
                    this.projectId = this.basicsContent.TeamId;
                } else if (val == "转交") {
                    this.projectId = this.basicsContent.ProjectId;
                }
            } else {
                if (val == "派单") {
                    this.projectId = this.datacontent.TeamId;
                } else if (val == "转交") {
                    this.projectId = this.datacontent.ProjectId;
                }
            }
        },
        // 派单、接单、转交、完成、关闭、转交
        sendClick() {
            let params = {
                MainId: this.id,
                Action: this.action,
                Remark: this.actionForm.textarea,
                RelateId: this.relateId,
                Files: this.fileData,
                PlanCompleteTime: this.actionForm.time ?
                    this.$moment(this.actionForm.time).format("YYYY-MM-DD HH:mm:ss") : ""
            };
            this.actionFun(params);
        },
        // 工单操作
        actionFun(params) {
            this.$ajax
                .post(this.$Order + `/sys/WorkFlow/Action`, params)
                .then(res => {
                    this.sendDialogVisible = false;
                    if (res.data.Success) {
                        this.$message({
                            type: "success",
                            message: "操作成功"
                        });
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.Message
                        });
                    }
                    this.getDetail();
                });
        },
        // *************上传文件**************
        beforeAvatarUpload(file) {
            this.formData = new FormData();
            this.formData.append("file", file);
            const config = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            this.$ajax
                .post(this.$Order + `/sys/Public/UpFile`, this.formData, config)
                .then(res => {
                    res.data.Data.forEach(element => {
                        this.fileList.push({
                            url: this.$Order + "/" + element,
                            name: element
                        });
                        this.fileData.push(element);
                    });
                })
                .catch(err => {
                    this.$message.error(err.data.Message);
                });
        },
        // 删除图片
        removeFun(file) {
            this.$ajax
                .get(this.$Order + `/sys/Public/DelFile?fileName=${file.name}`)
                .then(res => {
                    let index = this.fileData.indexOf(file.name);
                    this.fileData.splice(index, 1);
                    this.fileList.splice(index, 1);
                    if (res.data.Success) {
                        this.$message({
                            type: "success",
                            message: "图片删除成功"
                        });
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.Message
                        });
                    }
                    // this.$message.success('图片删除成功');
                })
                .catch(err => {
                    this.$message.error(err.data.Message);
                });
        },
        // 获取仓库列表
        getWareHouse() {
            let params = {
                page: 1,
                size: 2000,
                OrderBys: [],
                Conditions: []
            };
            this.$ajax
                .post(this.$Order + `/sys/Warehouse/QueryList`, params)
                .then(res => {
                    this.WarehouseOptions = res.data.Data.Data;
                    this.Warehouse = this.WarehouseOptions[0].Id;
                    this.getSpareList(this.Warehouse);
                });
        },
        // 仓库名下拉列表
        WarehouseChange(val) {
            this.Warehouse = val;
            this.tableData = [];
            this.sum = 0;
            this.getSpareList(this.Warehouse);
        },
        // 获取指定仓库下的设备列表
        getSpareList(params) {
            this.$ajax
                .post(this.$Order + `/sys/Spare/QueryListByApply?warehouseId=${params}`)
                .then(res => {
                    res.data.Data.forEach(element => {
                        this.tableData.push({
                            Count: element.Count,
                            SpareId: element.SpareId,
                            SpareName: element.SpareName,
                            Num: element.ApplyCount
                        });
                    });
                });
        },
        //领取备件
        spareClick() {
            this.getDialogVisible = false;
            let SpareList = [];
            this.tableData.forEach((item, i) => {
                if (item.Num != 0) {
                    SpareList.push(item);
                }
            });
            let params = {
                SpareList: SpareList,
                ProjectId: this.basicsContent.ProjectId,
                Name: "维修领用单",
                Remark: "",
                MainId: this.datacontent.Id,
                DetailId: this.flowContent[this.flowContent.length - 1].Id
            };
            this.$ajax
                .post(this.$Order + `/sys/SpareApplyMain/Add`, params)
                .then(res => {
                    // this.sum=0;
                    if (res.data.Success) {
                        this.$message.success(res.data.Message);
                    } else {
                        this.$message.warning(res.data.Message);
                    }
                    this.getDetail();
                })
                .catch(err => {
                    this.$message.error(err.data.Message);
                    // this.sum=0;
                });
        },
        // 领取数量加
        add(row) {
            this.tableData.forEach(item => {
                if (item.SpareId == row.SpareId) {
                    item.Num = row.Num += 1;
                }
            });
            this.sum += 1;
        },
        // 领取数量减
        subtract(row) {
            if (row.Num > 0) {
                this.tableData.forEach(item => {
                    if (item.SpareId == row.SpareId) {
                        item.Num = row.Num -= 1;
                    }
                });
                this.sum -= 1;
            } else {
                return;
            }
        },
        //维修组下拉列表
        maintainSelectChange(id) {
            this.relateId = id;
        },
        closeDialog() {
            this.relateId = null;
            this.fileData = [];
            this.fileList = [];
        },
        cancel() {
            this.sendDialogVisible = false;
            this.fileData = [];
            this.fileList = [];
        },
        closeWarehouse() {
            this.tableData = [];
            this.sum = 0;
        },
        // 查看详情
        seeDetailClick(val) {
            if (val) {
                this.parkData = val;
                this.parkDialog = true;
            }
        },
        // 时间差
        getTime() {
            let time1 = this.flowContent[this.flowContent.length - 1].CreateTime;
            let millisecond = new Date(time1).getTime();
            let millisecond2 = new Date().getTime();
            let timeold = millisecond2 - millisecond; //总秒数
            let e_daysold = timeold / (24 * 60 * 60 * 1000);
            if (e_daysold > 0) {
                let daysold = Math.floor(e_daysold); //相差天数
                let e_hrsold = (e_daysold - daysold) * 24;
                let hrsold = Math.floor(e_hrsold); //相差小时数
                let e_minsold = (e_hrsold - hrsold) * 60;
                let minsold = Math.floor(e_minsold); //相差分钟数
                let seconds = Math.floor((e_minsold - minsold) * 60); //相差秒数
                //将所获取的时间拼接到一起
                this.fromNowTime =
                    daysold + "天" + hrsold + "小时" + minsold + "分" + seconds + "秒";
            }
        }
    },
    mounted() {
        this.id = this.$route.query.id;
        this.getDetail();
    }
};
</script>

<style lang="scss" scoped>
.tableScrollbar {
    height: calc(100% - 115px);

    .orderContainer {
        height: 100%;
        font-size: 12px;
        overflow-y: auto;
    }

    .orderDetailContainer {
        color: #ffffff;
        padding: 20px 0;
        text-align: center;

        .orderDetail-card {
            width: 1061px;
            background: #284477;
        }

        .order-icon {
            text-align: right;
            padding-right: 20px;
        }
    }

    .el-card {
        background: #284477;
        margin: 0 auto;
        width: 1061px;
        margin-bottom: 20px;
        border: 1px solid #284477;
    }

    & /deep/ .el-dialog__header {
        height: 30px;
    }

    & /deep/ .el-card__header {
        border: none;
        color: white !important;
        text-align: left;
    }

    .basicsCard {
        .basics-title {
            float: left;
            text-align: right;
            width: 50%;
            color: #508ef7;
            font-size: 14px;

            p {
                height: 30px;
                margin: 0;
                line-height: 30px;
            }
        }

        .basics-content {
            float: left;
            text-align: left;
            width: 50%;
            font-size: 14px;
            color: #e7eefc;

            // margin-top:6px;
            p {
                height: 30px;
                margin: 0;
                line-height: 30px;
            }

            .equipment {
                border: 1px solid #376bcb;
                height: 30px;
                width: 80%;
                text-align: center;
                line-height: 30px;
                margin-bottom: 10px;
            }

            .infoImg {
                height: 45px;
                margin-bottom: 10px;

                img {
                    margin-right: 5px;
                }
            }
        }

        .maintenance {
            padding: 0 100px;
        }
    }

    .equipmentCard {
        text-align: center;

        .equipment-title {
            float: left;
            text-align: right;
            width: 50%;
            color: #508ef7;
        }

        .equipment-content {
            float: left;
            text-align: left;
            width: 50%;
            color: #e7eefc;
        }

        .el-collapse {
            margin: 0 auto;
            width: 1061px;
            border: none;
            margin-bottom: 20px;
        }

        & /deep/ .el-collapse-item__header {
            background: #284477 !important;
            color: white;
            border: none;
            padding-left: 20px;
        }

        & /deep/ .el-collapse-item__wrap {
            background: #284477 !important;
            border: none;
            padding-bottom: 10px;
        }
    }

    .flowCard {
        .distanceTime {
            color: #ffffff;
            padding-bottom: 20px;
            text-align: center;

            span {
                color: #ed4c6e;
                font-size: 18px;
                font-weight: bold;
            }
        }

        .btnRow {
            text-align: center;
        }

        .el-card {
            padding-bottom: 20px;
            height: 330px;
            overflow: auto;
        }

        .name {
            display: inline-block;
            width: 50px;
            height: 50px;
            border: 1px solid #009944;
            line-height: 50px;
            text-align: center;
            border-radius: 50%;
            font-size: 12px;
            overflow: hidden;
        }

        .flow-user {
            text-align: right;
            color: #e7eefc;

            p {
                margin: 0;
            }

            .el-divider--vertical {
                margin-right: 25px;
            }

            &:last-child {
                .el-divider--vertical {
                    display: none;
                }
            }
        }

        .flow-order {
            color: #e7eefc;
            margin-top: 15px;
            height: 56px;
            text-align: center;

            p {
                margin: 0;
            }

            .Remark {
                font-size: 12px;
                color: #7fa7f9;
            }

        }

        .flow-date {
            text-align: left;
            margin-top: 15px;
            color: #e7eefc;
            height: 56px;

            p {
                margin: 0;
            }

            .seeDetail {
                .el-button {
                    padding: 0;
                }
            }
        }

        .workflow {
            margin: 5px;
        }
    }
}

// .maintainCard{
//   .maintain-date{
//     float:left;
//     width:49%;
//     text-align:right;
//     color:#FFFFFF;
//   }
//   .maintain-detail{
//     float:right;
//     width:49%;
//     text-align:left;
//     color:#FFFFFF;
//     margin-top: -12px;
//   }
// }

.dialogContainer {
    .upload {
        font-size: 18px;
    }

    .el-textarea__inner {
        background: #03265a !important;
        border: 1px solid #2a93f4 !important;
    }
}

.getDialogVisibleContainer {
    .getDialogSum {
        text-align: right;
        padding-right: 10px;
        color: #ffffff;
    }

    .table {
        max-height: 300px;
        overflow-y: scroll;
    }
}

.auditDialogVisibleContainer {
    .dialogBody {
        text-align: center;

        span {
            color: #0e6eff;
        }
    }
}

.picture {
    position: relative;
}

.el-form-item {
    margin-bottom: 0;
    padding-bottom: 20px;
}

.table {
    margin-top: 20px;
    border: 1px solid #3368ca;
    padding: 0px;
}

.el-input {
    width: 60%;
}

.relevanceEquipment {
    color: #d2d3d5;
    text-align: left;
    max-height: 200px;
    overflow-y: auto;

    &:last-child {
        border: none;
    }

    div {
        border: 1px solid #376bcb;
        margin-left: 100px;
        width: 480px;
        max-height: 200px;
        overflow-y: auto;

        span {
            text-align: center;
            display: inline-block;
            width: 20%;
            padding: 10px 15px;
            box-sizing: border-box;
            border-right: 1px solid #376bcb;
            border-bottom: 1px solid #376bcb;
        }
    }
}

.maintenanceDetail {
    text-align: left;
    color: #d2d3d5;
    padding: 20px 0;

    .table {
        width: 60%;
        margin-left: 100px;
        max-height: 200px;
        overflow-y: auto;
    }
}

.parkSum {
    text-align: right;
    color: #ffffff;
    padding-top: 5px;
}

.parkTable {
    .el-dialog__body {
        .el-table {
            max-height: 400px;
            overflow-y: scroll;
        }
    }
}
</style>
