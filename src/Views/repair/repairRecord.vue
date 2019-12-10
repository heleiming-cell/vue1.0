<template>
<div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="记录编号">
            <el-input v-model="selectForm.number" placeholder="记录编号" clearable @change="()=>{listQuery.page = 1 }" @keyup.enter.native="getList"></el-input>
        </el-form-item>
        <el-form-item label="记录状态：">
            <el-select v-model="selectForm.state" @change="()=>{listQuery.page=1;getList();}" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading"  fit>
        <el-table-column label="记录编号" >
            <template slot-scope="scope">
                {{ scope.row.Number }}
            </template>
        </el-table-column>
        <el-table-column label="设备名称" >
            <template slot-scope="scope">
                {{ scope.row.DeviceName }}
            </template>
        </el-table-column>

        <el-table-column label="区域名称" >
            <template slot-scope="scope">
                {{ scope.row.AreaName  }}
            </template>
        </el-table-column>
        <el-table-column label="报修时间" >
            <template slot-scope="scope">
                {{ scope.row.CreateTime }}
            </template>
        </el-table-column>
        <el-table-column label="完成时间" >
            <template slot-scope="scope">
                {{ scope.row.CompleteTime !=null?scope.row.CompleteTime :'--' }}
            </template>
        </el-table-column>
        <el-table-column label="状态" >
            <template slot-scope="scope">
                {{ scope.row.State  }}
            </template>
        </el-table-column>
        <el-table-column  label="操作" >
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="editData(scope.row)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination :page-size="listQuery.limit" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <el-dialog  title="记录详情" :visible.sync="dialogVisible" v-if="dialogVisible" :append-to-body="true" center>
        <div style="height:500px;overflow-y: scroll;">
            <el-form :model="workorder">
                <el-form-item label="发起人:">
                    <span>{{workorder.CreaterName}}</span>
                </el-form-item>
                <el-form-item label="发起时间:">
                    <span>{{workorder.CreateTime}}</span>
                </el-form-item>
                <el-form-item label="报修设备:" v-if="workorder.DeviceInfo">
                    <el-button type="text" size="small" @click="deviceData(workorder.DeviceInfo)">{{workorder.DeviceInfo.Name}}</el-button>
                </el-form-item>
                <el-form-item label="报修内容:">
                    <span>{{workorder.Content.join(',')}}</span>
                </el-form-item>
                <el-form-item label="状态:">
                    <span>{{workorder.State}}</span>
                </el-form-item>
                <el-timeline>
                    <el-timeline-item :timestamp="item.CreateTime" placement="top" v-for="(item,i) in workorder.DetailList" :color="item.CompleteTime?'#0bbd87':''" :key="i">
                        <el-card>
                            <h4>{{item.UserName}}--{{item.Action}}</h4>
                            <p>备注信息：{{item.Remark}}</p>
                            <div style="height: 100px;" v-if="item.AttachmentList.length>0">
                                <enlargeimg :data="item.AttachmentList"></enlargeimg>
                            </div>

                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关 闭</el-button>
            <!-- <el-button @click="eventsAction('受理')" v-if="workorder.IsAccept ">受理</el-button>
            <el-button @click="eventsAction('转交')" v-if="workorder.IsDeliver ">转交</el-button>
            <el-button @click="eventsAction('提交')" v-if="workorder.IsSubmit ">提交</el-button>
            <el-button @click="eventsAction('拒绝')" v-if="workorder.IsRefuse ">拒绝</el-button>
            <el-button @click="eventsAction('上报')" v-if="workorder.IsUp">上报</el-button>
            <el-button @click="eventsAction('评价')" v-if="workorder.IsAppraise ">评价</el-button> -->
        </div>
    </el-dialog>
    <el-dialog  title="设备详情" :visible.sync="dialogVisible_device" v-if="dialogVisible_device" :append-to-body="true" center>
        <el-form :model="DeviceInfo">
            <el-form-item label="设备名称:">
                <span>{{DeviceInfo.Name}}</span>
            </el-form-item>
            <el-form-item label="设备类型:">
                <span>{{DeviceInfo.CategoryName}}</span>
            </el-form-item>
            <el-form-item label="维护部门:">
                <span>{{DeviceInfo.DepartmentName}}</span>
            </el-form-item>
            <el-form-item label="所属区域:">
                <span>{{DeviceInfo.AreaName}}</span>
            </el-form-item>
            <el-form-item label="安装地址:">
                <span>{{DeviceInfo.Address}}</span>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible_device = false">关 闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
export default {
    name:"repairRecord",
    data() {
        return {
            list: null,
            listLoading: true,
            total: 0,
            listQuery: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: "+id"
            },
            selectForm: {
                number: "",
                name: "",
                state: "0",
            },
            options: [{
                value: '0',
                label: '全部'
            }, {
                value: '1',
                label: '待受理'
            }, {
                value: '2',
                label: '待维修'
            }, {
                value: '3',
                label: '已完成'
            }],
            dialogVisible: false,
            dialogVisible_device: false,
            workorder: {},
            DeviceInfo: {},

        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            let data = {
                number: this.selectForm.number,
                name: this.selectForm.name,
                deviceCategoryId: 0,
                state: this.selectForm.state,
                page: this.listQuery.page,
                size: this.listQuery.limit,
            }
            this.$ajax.get(this.$DMURL + '/Repair/GetAllList', {
                params: data
            }).then(result => {
                if (result.status === 200 && result.data.success) {
                    this.list = result.data.data
                    this.total = result.data.count
                    this.listLoading = false
                }
            });
        },
        editData(row) {
            this.$ajax.get(this.$DMURL + '/Repair/GetDetail', {
                params:{id: row.Id}
            }).then(result => {
                if (result.status === 200 && result.data.success) {
                    this.workorder = result.data.data
                    this.dialogVisible = true
                }
            });
        },
        //设备详情
        deviceData(info) {
            this.DeviceInfo = info
            this.dialogVisible_device = true
        },
        handleCurrentChange(val) {
            this.listQuery.page = val
            this.getList();
        },
    }
}
</script>
<style lang="less" scoped>
.app-container {
    font-size: 12px;
    height: calc(100% - 115px);
}

</style>