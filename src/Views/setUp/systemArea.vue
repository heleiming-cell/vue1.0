<template>
<el-row class="h100">
    <el-col :xs="24" :sm="3" class="h100" style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>系统区域</span></div>
            <div style="float:right">
                <span @click="addSystemArea" class="pointer"><i class="iconfont icon-jia"></i></span>
                <span @click="deleteMenu" class="pointer" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>
                <span @click="editMenu" class="pointer" style="margin:0 5px"><i class="iconfont icon-bianji"></i></span>
            </div>
        </div>
        <el-tree ref="tree" @check-change="handleCheck" show-checkbox node-key="key" check-strictly :data="data" :props="defaultProps"></el-tree>
    </el-col>

    <el-col :xs="24" :sm="21" class="h100" style="display:flex;justify-content:center;align-items:center;">
    </el-col>
    <el-dialog title="系统区域编辑" :visible.sync="menuDialog" :modal-append-to-body="false" width="400px">
        <el-form label-width="100px" label-position="left" class="demo-ruleForm">
            <el-form-item label="区域名称" prop="name">
                <el-input v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="区域序号" prop="name">
                <el-input v-model="orderno"></el-input>
            </el-form-item>
            <el-form-item label="区域描述" prop="name">
                <el-input v-model="description"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="close">确 定</el-button>
        </span>
    </el-dialog>

</el-row>
</template>

<script>
import {
    Tree
} from '@/lib/Common'
export default {
    name: 'menuset',
    data() {
        return {
            menuDialog: false, //菜单编辑窗口
            data: [], // tree data数据
            name: '',
            description: '',
            orderno: '',
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            node: null, //当前check的节点
            edit: false,
            tree: new Tree()
        };
    },
    mounted() {
        this.tree.loadTreeNodes(this, '/sysArea/LoadSysArea', "data");
    },
    methods: {
        updateStore() {
            this.$ajax.get(this.$URL + '/SysMenu/GetMenuTree').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$store.commit('change_menu', result.data.data);
                }
            }).catch((err) => {

            });
        },

        addSystemArea() {
            this.name = '';
            this.description = '';
            this.menuDialog = true;
            this.edit = false;
        },
        searchid(ids, node) {
            let _this = this;
            ids.push(node.code)
            if (node.children && node.children.length > 0) {
                node.children.forEach((v, i) => {
                    _this.searchid(ids, v);
                })
            }
        },
        deleteMenu() {
            if (!this.node) {
                this.$message.error("请选择要删除的区域");
                return;
            }
            // let nodes = this.$refs.tree.getCheckedNodes();
            let ids = [];
            this.searchid(ids, this.node);
            if (ids.length > 0) {
                this.$confirm('此操作将永久删除改系统区域, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.get(this.$URL + '/sysArea/DeleteSysAreas', {
                        params: {
                            id: ids
                        }
                    }).then((result) => {
                        if (result.status === 200 && result.data.success) {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            this.tree.loadTreeNodes(this, '/sysArea/LoadSysArea', "data");
                            // this.updateStore();
                            this.node = null;
                        }
                    }).catch((err) => {
                    });
                });

            }
        },
        editMenu() {
            let nodes = this.$refs.tree.getCheckedNodes();
            if (nodes.length > 1) {
                this.$message.error("不能同时操作多个节点");
                return;
            }
            if (!this.node) {
                this.$message.error("请选择要编辑的节点");
                return;
            }
            this.edit = true;
            this.name = this.node.label;
            this.description = '';
            this.orderno = this.node.orderno;
            this.menuDialog = true;
        },
        close() {
            if (!this.name) {
                this.$message.error('名称不能为空');
                return;
            }
            this.$ajax.post(this.$URL + '/sysArea/AddSystemArea', {
                id: this.edit ? this.node.key : 0,
                pid: this.node ? this.node.key : 0,
                code: this.edit ? this.node.code : '',
                name: this.name,
                orderno: this.orderno,
                description: this.description
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.menuDialog = false;
                    // this.loadTree();
                    // this.updateStore();
                    this.tree.loadTreeNodes(this, '/sysArea/LoadSysArea', "data")
                }
            }).catch((err) => {

            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleCheck(data, status) {
            if (status) {
                this.node = data;
            } else {
                this.node = null;
            }
        }

    }
};
</script>

<style lang="less" scoped>
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
