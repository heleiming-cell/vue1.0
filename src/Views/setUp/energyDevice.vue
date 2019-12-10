<template>
<el-row class="h100">
    <el-col :xs="24" :sm="24" class="h100">
        <div class="filter">
            <div class="filter_line">
                <el-input placeholder="支持 功能名称 查询" v-model="keyword"></el-input>
            </div>
            <div class="filter_line">
                <button class="search" @click="search"> 查询</button>
            </div>
            <div style="position:absolute;right:10px">
                <el-button type="primary" size="mini" @click="openDialog" icon="el-icon-plus" circle></el-button>
                <el-button type="danger" size="mini" @click="deleteDevice" icon="el-icon-minus" circle></el-button>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%" class="usertable" @select-all="selectionAll" @select="selectionAll">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="Name" label="设备名称">
            </el-table-column>
            <el-table-column label="设备类型">
                <template slot-scope="scope">
                    <span>{{devicetype[scope.row.devicetype-1]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="ioServer" label="IOserver">
            </el-table-column>
            <el-table-column prop="Channal" label="通道">
            </el-table-column>
            <el-table-column prop="Controller" label="控制器">
            </el-table-column>
            <el-table-column prop="Variable" label="变量">
            </el-table-column>
            <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>
    </el-col>

</el-row>
</template>

<script>
import Diagram from '@/components/EnergyDialog/src'
import pagination from '@/components/common/pagination'
export default {
    name: 'areaMenuSet',
    components: {

        'pagination': pagination,
    },
    data() {
        return {
            keyword: '',
            name: '', //区域名称
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            tableData: [],
            total: 0,
            devicetype: ['电', '水', '气'],
            currentPage: 1,
            deleteids: [],
            vm: null
        };
    },
    mounted() {

        this.loadDevices();
    },
    methods: {
        search() {
            this.loadDevices();
        },
        loadDevices() {
            this.$ajax.get(this.$URL + '/energy/GetDeviceInfo', {
                params: {
                    keyword: this.keyword,
                    page: this.currentPage,
                    size: 10
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.tableData = result.data.data;
                    this.total = result.data.count;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        selectionAll(selection) {
            if (selection.length > 0) {
                let id = [];
                selection.forEach((v, k) => {
                    id.push(v.id);
                });
                this.deleteids = id;
            } else if (selection.length === 0) {
                this.deleteids = [];
            }
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val
            this.loadDevices();
        },
        openDialog() {
            this.vm = Diagram.newInstance().diagram
            this.vm.open(this.dialogCallback, 1);
        },
        dialogCallback(val) {
            // if(this.vm)
            // {
            //     this.vm.$parent.$destroy();
            // }
            this.$ajax.post(this.$URL + '/energy/AddDevice', this.$QS.stringify(val)).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.loadDevices();
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        deleteDevice() {
            if (this.deleteids && this.deleteids.length > 0) {
                this.$confirm('此操作将永久删除改能源设备, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.get(this.$URL + '/energy/DeleteDevice', {
                        params: {
                            id: this.deleteids
                        }
                    }).then((result) => {
                        if (result.status === 200 && result.data.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.loadDevices();
                        } else {
                            this.$message.error("删除失败");
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                });

            } else {
                this.$message.error("请选择要删除的数据");
            }
        }
    }
};
</script>

<style lang="less" scoped>
.h100 {
    position: relative;
}

.menuheader {
    line-height: 36px;
    vertical-align: middle;
    padding: 0 10px;
    overflow: hidden;
    background: #010308
}

.pointer {
    cursor: pointer;
}

.el-tree {
    background: #ffffff14 !important;
}

.el-dialog__footer {
    text-align: center !important;
}
</style>
