<template>
<div class="box">
    <el-table v-loading="listLoading" :data="tableData" @sort-change="sortChange" fit>
        <el-table-column prop="Number" label="工单编号" sortable="custom">
        </el-table-column>
        <el-table-column prop="SheetType" label="工单类型" sortable="custom">
        </el-table-column>
        <el-table-column prop="CreaterName" label="发起人">
        </el-table-column>
        <el-table-column prop="State" label="工单状态" sortable="custom">
        </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" sortable="custom">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.row)">查看</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination :page-size="Size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <!-- 非报修工单详情 -->
    <el-dialog title="工单详情" :visible.sync="dialogWorkorder" v-if="dialogWorkorder" :append-to-body="true" top="60px" center width="700px">
        <div class="associate-dialog">
            <el-form :model="workorder">
                <el-form-item label="发起人:">
                    <span>{{workorder.CreaterName}}</span>
                </el-form-item>
                <el-form-item label="工单类型:">
                    <span>{{workorder.SheetType}}</span>
                </el-form-item>
                <el-form-item label="发起时间:">
                    <span>{{workorder.CreateTime}}</span>
                </el-form-item>
                <el-form-item label="结束时间:">
                    <span>{{workorder.PlanFinishTime}}</span>
                </el-form-item>
                <el-form-item label="工单等级:">
                    <span>{{workorder.Level}}</span>
                </el-form-item>
                <el-form-item>
                    <fm-generate-form v-if="workorder.TempleteForm !== ''" :data="JSON.parse(workorder.TempleteForm)" :remote="remoteFuncs_workorder" :value="JSON.parse(workorder.Templete)" ref="generateForm_workorder"> </fm-generate-form>
                </el-form-item>
                <el-form-item label="审核流程:">
                    <el-steps :active="active" direction="vertical">
                        <el-step v-for="(item,index) in workorder.DetailList" :title="item.UserName" :key="index">
                            <template slot="description">
                                <div class="process-details">
                                    <div v-if="item.CompleteTime!=''&&item.CompleteTime!=null">
                                        <span v-if="index==0">发起时间：{{item.CompleteTime}}</span>
                                        <span v-else>处理时间：{{item.CompleteTime}}</span>
                                    </div>
                                    <div v-if="item.Remark!=''&&item.Remark!=null">
                                        <span>评论：{{item.Remark}}</span>
                                    </div>
                                    <div v-if="item.Action=='拒绝'||item.Action=='撤回'">
                                        <span>状态：{{item.Action}}</span>
                                    </div>
                                    <div v-if="item.ImageList.length>0" class="imglist">
                                        <span>照片：</span>
                                        <enlargeimg :data="GetImageList(item.ImageList)"></enlargeimg>
                                    </div>
                                </div>
                            </template>
                        </el-step>
                    </el-steps>
                </el-form-item>
                <el-form-item label="督办流程:" v-if="workorder.SupervisorList!=null&&workorder.SupervisorList.length>0">
                    <el-steps finish-status="success">
                        <el-step v-for="(item,index) in workorder.SupervisorList" :title="item.Name" :description="item.DeptName" :key="index">
                        </el-step>
                    </el-steps>
                </el-form-item>
                <el-form-item label="操作:" v-if="this.workorder.State=='进行中'">
                    <el-button type="success" @click="urge">催单</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
        <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
</div>
</template>

<script>
import enlargeimg from '@/components/enLargeImg/enLargeImg.vue'
export default {
    components: {
        enlargeimg
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: 'success',
                draft: 'gray',
                deleted: 'danger'
            }
            return statusMap[status]
        }
    },
    data() {
        return {
            listLoading: true,
            tableData: [],
            total: 0,
            Page: 1,
            Size: 10,
            dialogWorkorder: false,
            workorder: {
                SheetType: '',
                PlanFinishTime: '',
                Level: '',
                DeviceName: '',
                DeviceArea: '',
                TempleteForm: '',
                Templete: '',
                DetailList: ''
            },
            active: 0,
            dialogImageUrl: '',
            dialogVisible: false,
            remoteFuncs_workorder: {},
            editData_workorder: {},
            fieldType: "",
            orderType: ""
        }
    },
    created() {
        this.get_table_data()
    },
    methods: {
        // 获取我督办工单列表
        get_table_data() {
            this.listLoading = true
            let data = {
                Type: '4',
                Page: this.Page,
                Size: this.Size,
                fieldType: this.fieldType,
                orderType: this.orderType
            }
            this.$ajax.get(this.$DMURL + '/AllList/GetSheetList', {
                params: data
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.tableData = result.data.data;
                    this.total = result.data.count
                    this.listLoading = false
                }
            });
        },
        //点击查看工单详情
        handleEdit(row) {
            this.$ajax.get(this.$DMURL + '/sheet/GetSheetDetail', {
                params: {
                    Id: row.Id
                }
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.workorder = result.data.data;
                    this.dialogWorkorder = true
                    this.workorder.DetailList.forEach((item, index) => {
                        if (this.workorder.State == '已完成') {
                            this.active = this.workorder.DetailList.length
                        } else if (item.Ing) {
                            this.active = index
                        } else if (item.Action == '拒绝' || item.Action == '撤回') {
                            this.active = index
                        }
                    })
                }
            });
        },
        // 照片预览
        handlePictureCardPreview(url) {
            this.dialogImageUrl = url
            this.dialogVisible = true
        },
        get_Templete(val) {
            if (this.detail.Templete) {
                if (JSON.parse(this.detail.Templete)[val]) {
                    return JSON.parse(this.detail.Templete)[val]
                } else {
                    return '无'
                }
            } else {
                return '无'
            }
        },
        // 催办
        urge() {
            this.$prompt('备注', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({
                value
            }) => {
                let data = {
                    SheetId: this.workorder.Id,
                    Action: '催办',
                    Remark: value
                };
                this.$ajax.post(this.$DMURL + '/sheet/SubmitSheet', data).then(result => {
                    if (result.status == 200 && result.data.success) {
                        this.$message.success('提交成功');
                    }
                });
            })
        },
        // 获取返回过来的图片数组
        GetImageList(data) {
            const ImageList = []
            data.forEach((item, index) => {
                ImageList.push(item.FilePath)
            })
            return ImageList
        },
        //排序
        sortChange(row) {
            this.fieldType = row.prop || ""
            this.orderType = row.order || ""
            this.get_table_data()
        },
        handleCurrentChange(val) {
            this.Page = val
            this.get_table_data();
        },
    }
}
</script>

<style lang="less" scoped>
.detail_line,
.detail_comment {
    padding: 10px 20px;
    border-bottom: solid 1px #cccccc;
}

.detail_comment_p {
    padding-left: 30px;
}

.detail_line>span,
.detail_comment>span {
    font-weight: bold;
}

.associate-dialog {
    max-height: 600px;
    overflow-y: scroll;
    width: 100%;

    & /deep/ .fm-uplaod-container {
        display: flex;
    }

    & /deep/ img {
        height: 100px;
        width: 100px;
    }
}

.process-details {
    min-height: 80px;
}

</style>
