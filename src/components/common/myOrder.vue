<template>
<!-- 我的工单-进行中 -->
<div class="underwayContainer tableScrollbar">
    <el-row class="underwayRow">
        <el-col class="underway-form" :span="17">
            <el-form :model="underwayform" :inline="true" ref="underwayform">
                <el-form-item label="工单号：">
                    <el-input v-model="underwayform.oddNum" placeholder="请输入工单号"></el-input>
                </el-form-item>
                <el-form-item label="创建人：">
                    <el-select v-model="underwayform.creator" @change="changeClick">
                        <el-option v-for="(item,i) in CreaterNameOptions" :key="i" :label="item.Name" :value="item.Id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态:">
                    <el-select v-model="state" clearable>
                        <el-option v-for="(item,i) in states" :key="i" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工单类型：">
                    <el-select v-model="underwayform.type" @change="typeChangeClick">
                        <el-option v-for="(typeitem,index) in TypeNameOption" :key="index" :label="typeitem" :value="typeitem"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="项目">
                    <Project :value="ProjectId" :cate="'project'" @change="changeProjectId" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryClick">查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="downFile">导出</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col class="table ">
            <el-table :data="tableData">
                <el-table-column label="工单号" prop="Number" align="center"></el-table-column>
                <el-table-column label="主题" prop="Remark" align="center"></el-table-column>
                <el-table-column :label="routeName=='挂起'?'挂起人':routeName=='关闭'?
            '发起人':routeName=='已完成'?'完成人':'创建人'" prop="CreaterName" align="center">
                </el-table-column>
                <el-table-column :label="routeName=='挂起'?'挂起时间':routeName=='关闭'?
            '关闭时间':routeName=='已完成'?'完成时间':'创建时间'" prop="CreateTime" align="center">
                </el-table-column>
                <el-table-column label="设备类型" prop="DeviceCategoryName" align="center" v-if="pageType=='underway'||pageType=='hangUp' "></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="queryDetailClick(scope.row.Id)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-col>
            <pagiNation v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getOrderList" />
        </el-col>
    </el-row>
</div>
</template>

<script>
import pagiNation from '@/components/common/pagination.vue'
import Project from '@/components/filter/Project'

import FileSaver from "file-saver"

export default {
    components: {
        pagiNation,
        Project
    },
    props: {
        type: {
            type: String,
        }
    },
    data() {
        return {
            underwayform: {
                oddNum: "", //工单号
                creator: "", //创建人
                type: "", //工单类型
            },
            CreaterNameOptions: [],
            TypeNameOption: ['维修工单', '维保工单'],
            tableData: [],
            listQuery: {
                page: 1,
                limit: 10,
                total: 0,
            },
            userId: "", //创建人id
            typeId: "",
            routeName: "", //路由位置
            pageType: this.type,

            route: {
                "hangUp": '挂起',
                "accomplish": '已完成',
                "underway": '进行中',
                "close": '关闭',
            },
            state: '',
            states: [{
                    label: '挂起',
                    value: '挂起'
                },
                {
                    label: '完成',
                    value: '完成'
                },
                {
                    label: '进行中',
                    value: '进行中'
                },
                {
                    label: '关闭',
                    value: '关闭'
                },
            ],
            ProjectId: ''

        }
    },
    methods: {
        getOrderList() {
            let params = {
                page: this.listQuery.page,
                size: this.listQuery.limit,
                OrderBys: [{
                    Sort: "CreateTime",
                    Order: "Desc"
                }],
                Conditions: [{
                        Key: 'state',
                        Operator: 0,
                        // Value: this.routeName
                        Value: this.state
                    },

                ],
            }
            this.getList(params)
        },
        getList(params) {
            this.$ajax.post(this.$Order + `/sys/WorkFlow/QueryList`, params)
                .then(res => {
                    this.listQuery.total = res.data.Data.Count
                    this.tableData = res.data.Data.Data
                })
        },
        // 创建人下拉列表
        getAllCate() {
            this.$ajax.get(this.$Order + `/sys/public/GetAllCate?cate=user`).then(res => {
                this.CreaterNameOptions = res.data.Data;
            })
        },
        // 查询
        queryClick() {
            let params = {
                page: this.listQuery.page,
                size: this.listQuery.limit,
                OrderBys: [{
                    Sort: "CreateTime",
                    Order: "Desc"
                }],
                Conditions: [{
                        Key: 'Number',
                        Operator: 1,
                        Value: this.underwayform.oddNum

                    },
                    {
                        Key: 'CreaterId',
                        Operator: 0,
                        Value: this.userId
                    },
                    {
                        Key: 'Type',
                        Operator: 0,
                        Value: this.typeId
                    },
                    {
                        Key: 'state',
                        Operator: 0,
                        // Value: this.routeName
                        Value: this.state
                    }, 
                    {
                        Key: 'ProjectId',
                        Operator: 0,
                        Value: this.ProjectId
                    },
                ]
            }
            this.getList(params)
        },
        // 查看详情
        queryDetailClick(id) {
            this.$router.push({
                path: '/orderDetail',
                query: {
                    id: id,
                    name: this.$route.name
                }
            })
        },
        // 创建人下拉列表的值
        changeClick(val) {
            this.userId = val
        },
        // 维修类型下拉值
        typeChangeClick(val) {
            if (val == "维修工单") {
                this.typeId = 1
            } else {
                this.typeId = 2
            }
        },
        downFile() {
            let params = {
                page: this.listQuery.page,
                size: 0,
                OrderBys: [{
                    Sort: "CreateTime",
                    Order: "Desc"
                }],
                Conditions: [{
                        Key: 'Number',
                        Operator: 1,
                        Value: this.underwayform.oddNum

                    },
                    {
                        Key: 'CreaterId',
                        Operator: 0,
                        Value: this.userId
                    },
                    {
                        Key: 'Type',
                        Operator: 0,
                        Value: this.typeId
                    },
                    {
                        Key: 'state',
                        Operator: 0,
                        Value: this.routeName
                    }
                ]
            }
            this.$ajax.post(this.$Order + '/sys/excel/QueryListOrder', params, {
                responseType: "blob"
            }).then(result => {
                FileSaver.saveAs(
                    new Blob([result.data], {
                        type: "application/octet-stream"
                    }),
                    "工单报表.xlsx"
                );
            });
        },
        changeProjectId(val) {
            this.ProjectId = val;
        }
    },
    mounted() {
        if (this.$route.name == "accomplish") {
            this.routeName = "完成"
        } else {
            this.routeName = this.route[this.$route.name];
        }
        this.getOrderList();
        this.getAllCate();
    },

}
</script>

<style lang="scss" scoped>
.underwayContainer {
    height: calc(100% - 32px);

    .underwayRow {
        height: 100%;
        overflow-y: auto;

        .underway-form {
            text-align: left;
            padding: 0 15px;
            width: auto;
        }
    }
}
</style>
