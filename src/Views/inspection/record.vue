<template>
<div class="inspection-container">
    <div class="filter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="巡检人员">
                <el-input v-model="formInline.CompleterName" placeholder="巡检人员" clearable=""></el-input>
            </el-form-item>
            <el-form-item label="任务状态">
                <el-select v-model="formInline.CompleteState" placeholder="任务状态">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="起始时间">
                <el-date-picker v-model="formInline.CreateTime" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="项目">
                <Project :value="ProjectId" :cate="'project'" @change="changeProjectId" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="downFile">导出</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" height="calc(100% - 150px)">
        <el-table-column prop="Name" label="任务名称" align="center">
        </el-table-column>
        <el-table-column prop="CompleterName" label="巡检人员" align="center">
        </el-table-column>
        <el-table-column prop="TeamName" label="维护组" align="center">
        </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column prop="CompleteState" label="任务状态" align="center">
        </el-table-column>
        <el-table-column prop="CompleteTime" label="完成时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="getDetail(scope.row)">查看</el-button>

            </template>
        </el-table-column>
    </el-table>
    <!-- <div class="add-new">
        <el-button type="primary" @click="editData('new')" size="small">新建巡检点</el-button>
    </div> -->
    <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 巡检记录详情 -->
    <el-dialog title="巡检记录详情" :visible.sync="dialogVisible" width="600px" v-if="dialogVisible" v-el-drag-dialog>
        <div class="dialogDetail">
            <el-form :model="dialogForm" :label-width="'120px'">
                <el-form-item label="任务名称：">
                    {{dialogForm.Name}}
                </el-form-item>
                <el-form-item label="巡检人员：">
                    {{dialogForm.CompleterName}}
                </el-form-item>
                <el-form-item label="维护组：">
                    {{dialogForm.CompleterName}}
                </el-form-item>
                <el-form-item label="创建时间：">
                    {{dialogForm.CreateTime}}
                </el-form-item>
                <el-form-item label="完成时间：">
                    {{dialogForm.CompleteTime?dialogForm.CompleteTime:'--'}}
                </el-form-item>
                <el-table :data="dialogForm.DataItems" style="width: 100%" max-height="300" v-if="dialogForm.DataItems&& dialogForm.DataItems.length>0">
                    <el-table-column prop="DataName" label="巡检点" align="center"></el-table-column>
                    <el-table-column prop="CompleteTime" label="完成时间" align="center">
                        <template slot-scope="scope">
                            {{scope.row.CompleteTime?scope.row.CompleteTime:'--'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="结果" align="center">
                        <template slot-scope="scope">
                            <span style="color:rgb(233, 233, 235)" type="info" v-if="scope.row.Result == 0">未巡检</span>
                            <span style="color:rgb(103, 194, 58)" type="success" v-if="scope.row.Result == 1">正常</span>
                            <span style="color:rgb(245, 108, 108)" type="warning" v-if="scope.row.Result == 2">异常</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="getPointDetail(scope.row)">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-form-item label="备注：">
                <el-input v-model="dialogForm.Description" autocomplete="off"></el-input>
            </el-form-item> -->
            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <!-- <el-button type="primary" @click="submitDialog">确 定</el-button> -->
        </div>
    </el-dialog>
    <!-- 巡检点记录详情 -->
    <el-dialog title="巡检点记录详情" :visible.sync="detailVisible" v-if="detailVisible" v-el-drag-dialog>
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
            <el-collapse-item :title="item.Name" :name="index" v-for="(item,index) in detailData.StandardItems" :key="index">
                <el-table v-if="item.Content" :data="JSON.parse(item.Content)" style="width: 100%">
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
</div>
</template>

<script>
import FileSaver from "file-saver";

import {
    inspectSheet_List,
    inspectSheet_TaskDetail,
    inspectSheet_GetInspectAsk
} from '@/api/inspectSheet'
import pagiNation from '@/components/common/pagination'
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
                CompleterName: '',
                Result: '',
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
                "CompleterId": "",
                "CompleterName": "",
                "CreateTime": "",
                "Name": "",
                "TaskId": "",
                "CompleteTime": "",
                "ProjectId": "",
                "ProjectName": "",
                "Description": "",
                "TeamId": "",
                "PlanCompleteTime": "",
                "TeamName": "",
                "DistributederId": "",
                "Type": "",
                "DistributedRoleId": "",
                "State": "",
                "Code": "",
                "Id": "",
                "CompleteRate": "",
                "Level": "",
                "IsPaySend": "",
                "IsReceive": "",
                "IsComplete": "",
                "Result": "",
                "CompleteState": "string",
                "DataItems": []
            },
            detailVisible: false, //记录详情
            detailData: null,
            ProjectId: ''

        }
    },
    mounted() {
        this.getList()
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
                        "Key": "CompleterName",
                        "Operator": 0,
                        "Value": this.formInline.CompleterName
                    },
                    {
                        "Key": "CompleteState",
                        "Operator": 0,
                        "Value": this.formInline.CompleteState
                    },
                    {
                        "Key": "CreateTime",
                        "Operator": 0,
                        "Value": this.formInline.CreateTime
                    },
                    {
                        "Key": "ProjectId",
                        "Operator": 0,
                        "Value": this.ProjectId
                    },
                ]
            }
            inspectSheet_List(data).then(res => {
                this.tableData = res.Data.Data
                this.listQuery.total = res.Data.Count
            })
        },
        onSubmit() {
            this.listQuery.page = 1
            this.getList()
        },
        //查看巡检详情
        getDetail(row) {
            inspectSheet_TaskDetail({
                id: row.Id
            }).then(res => {
                this.dialogForm = res.Data
                this.dialogVisible = true
            })

        },
        //查看巡检点详情
        getPointDetail(row) {
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
        //删除
        removeData() {},
        //gis绑点
        bindGis() {},
        //二维码
        getQRcode() {},
        //巡检记录
        getRecord() {},

        downFile() {
            this.$ajax.get(this.$Order + '/sys/excel/QueryListInspectRecord', {
                params: {
                    name: this.formInline.CreaterName,
                    bt: this.formInline.CreateTime,
                    // et: this.formInline.Time[1]
                },
                responseType: "blob"
            }).then(result => {
                FileSaver.saveAs(
                    new Blob([result.data], {
                        type: "application/octet-stream"
                    }),
                    "巡检记录报表.xlsx"
                );
            });
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

    .dialogDetail {
        max-height: 500px;
        overflow-y: scroll;
    }
}
</style><style lang="scss">
@import './css/common.scss';
</style>
