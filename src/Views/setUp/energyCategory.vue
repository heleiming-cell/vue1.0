<template>
<el-row class="h100">
    <el-col :xs="24" :sm="3" class="h100" style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>分类树</span></div>
            <div style="float:right">
                <span @click="addCatogory" class="pointer"><i class="iconfont icon-jia"></i></span>
                <span @click="deleteCategory" class="pointer" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>
                <span @click="editCategory" style="margin:0 5px" class="pointer"><i class="iconfont icon-bianji"></i></span>
            </div>
        </div>
        <el-tree node-key="key" ref="tree" show-checkbox check-strictly @check-change="handleCheckChange" :data="data" :props="defaultProps"></el-tree>
    </el-col>

    <el-col :xs="24" :sm="21" class="h100">
        <div style="float:right;margin:10px 0;">
            <el-button type="primary" size="mini" @click="openDialog" icon="el-icon-plus" circle></el-button>
            <el-button type="danger" size="mini" @click="deleteAreaDevice" icon="el-icon-minus" circle></el-button>
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

            <el-table-column prop="CName" label="所属分类">
            </el-table-column>
        </el-table>
        <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>
    </el-col>
    <el-dialog title="分类树编辑" :visible.sync="cateDialog" :modal-append-to-body="false" width="300px">
        <el-form label-width="50px" label-position="left" class="demo-ruleForm">
            <el-form-item label="名称" prop="name">
                <el-input v-model="name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="saveCategory">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="设备选择" :visible.sync="deviceDialog" :modal-append-to-body="false" width="300px">
        <el-form label-width="50px" label-position="left" class="demo-ruleForm">
            <el-form-item label="名称" prop="name">
                <el-select multiple clearable v-model="selectDevices">
                    <el-option v-for="(item,i) in devices" :label="item.Name" :value="item.id" :key="i"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="addCategoryDevices">确 定</el-button>
        </span>
    </el-dialog>

</el-row>
</template>

<script>
import Diagram from '@/components/EnergyDialog/src/index'
import pagination from '@/components/common/pagination'
export default {
    name: 'areaMenuSet',
    components: {

        'pagination': pagination,
    },
    data() {
        return {
            cateDialog: false, //区域编辑窗口
            deviceDialog: false, //设备选择窗口
            data: [], // tree data数据
            name: '', //区域名称
            //  description: '',
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            devicetype: ['电', '水', '气'],
            node: null, //当前check的节点
            edit: false,
            tableData: [],
            total: 0,
            currentPage: 1,
            devices: [],
            selectDevices: [],
            deleteid: [],
        };
    },
    mounted() {

        this.loadTree();
        this.loadDevices();
    },
    methods: {
        loadDevices() {
            this.$ajax.get(this.$URL + '/energy/GetCategoryDevices', {
                params: {
                    cid: this.node ? this.node.key : 0,
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
                this.deleteid = id;
            } else if (selection.length === 0) {
                this.deleteid = [];
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.loadDevices();
        },

        loadTree() {
            this.$ajax.get(this.$URL + '/energy/GetCategoryTree').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.data = result.data.data;
                }
            }).catch((err) => {

            });
        },

        addCatogory() {
            // let nodes = this.$refs.tree.getCheckedNodes();
            // if (nodes.length > 1) {
            //     this.$message.error("不能同时操作多个节点");
            //     return;
            // }
            this.name = '';
            // this.description = '';
            this.cateDialog = true;
            this.edit = false;
        },

        searchid(ids, node) {
            let _this = this;
            ids.push(node.key)
            if (node.children && node.children.length > 0) {
                node.children.forEach((v, i) => {
                    _this.searchid(ids, v);
                })
            }
        },
        deleteCategory() {
            let ids = [];
            if (this.node) {
                this.searchid(ids, this.node);
            }
            if (ids.length > 0) {
                this.$confirm('此操作将永久删除改设备分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.get(this.$URL + '/energy/DeleteCategories', {
                        params: {
                            id: ids
                        }
                    }).then((result) => {
                        if (result.status === 200 && result.data.success) {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            this.loadTree();
                            this.node = null;
                            this.$message("删除成功");
                        }
                    }).catch((err) => {

                    });
                });

            }
        },
        editCategory() {

            if (!this.node) {
                this.$message.error("请选择要编辑的节点");
                return;
            }
            this.edit = true;
            this.name = this.node.label;
            this.cateDialog = true;
        },
        saveCategory() {

            if (!this.name) {
                this.$message.error('名称不能为空');
                return;
            }
            this.$ajax.post(this.$URL + '/energy/AddCategory', {
                id: this.edit ? this.node.key : 0,
                pid: !this.node ? 0 : this.node.key,
                name: this.name,
                code: !this.node ? "" : this.node.code,
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.cateDialog = false;
                    this.loadTree();
                    this.node = null;
                }
            }).catch((err) => {

            });
        },
        handleCheckChange(node, status) {
            if (status) {
                if (this.node && this.node.key != node.key) {
                    this.$refs.tree.setChecked(this.node, false);
                }

                this.node = node;
                this.loadDevices();

            } else {
                if (this.node && this.node.key === node.key) {
                    this.node = null;

                }
                this.loadDevices();
            }

        },
        openDialog() {
            this.deviceDialog = true;
            this.selectDevices = [];
            this.$ajax.get(this.$URL + '/energy/GetAreaDevices', {
                params: {
                    areaId: 0,
                    page: 0,
                    size: 0
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.devices = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        addCategoryDevices() {
            if (this.selectDevices.length == 0) {
                this.$message.error("请选择设备");
                return;
            }
            if (!this.node) {
                this.$message.error("请选择分类");
                return;
            }
            this.$ajax.get(this.$URL + '/energy/AddCategoryDevices', {
                params: {
                    id: this.selectDevices,
                    cid: this.node.key,
                    code: this.node.code
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.deviceDialog = false;
                    this.loadDevices();
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        deleteAreaDevice() {
            if (this.deleteid.length == 0) {
                this.$message.error("请选择要删除的设备");
                return;
            }
            this.$ajax.get(this.$URL + '/energy/DeleteCategoryDevice', {
                params: {
                    id: this.deleteid
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.loadDevices();
                }
            }).catch((err) => {
                console.log(err);
            });
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
