<template>
<el-row class="h100">
    <el-col :xs="24" :sm="3" class="h100" style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>系统菜单</span></div>
            <div style="float:right">
                <span @click="addMenu" class="pointer"><i class="iconfont icon-jia"></i></span>
                <span @click="deleteMenu" class="pointer" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>
                <span @click="editMenu" class="pointer"><i class="iconfont icon-bianji"></i></span>
            </div>
        </div>
        <el-tree ref="tree" show-checkbox @check-change="handleCheckChange" check-strictly :data="data" :props="defaultProps"></el-tree>
    </el-col>

    <el-col :xs="24" :sm="21" class="h100" style="display:flex;justify-content:center;align-items:center;">
        <div style="width:50%; margin: 0 auto; ">
            <fieldset style="padding:20px;">
                <legend>菜单配置</legend>
                <el-form ref="ruleForm" label-width="80px">
                    <el-form-item label="系统分类">
                        <el-select v-model="systemCategory" style="width:100%">
                            <el-option v-for="(item,i) in SystemData" :key="i" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="路由选择">
                        <el-select style="width:100%" v-model="menuRoute" value-key="path" clearable filterable>
                            <el-option v-for="(item,i) in routers" :key="i" :value="item.path" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="图标选择" prop="delivery">
                        <el-input placeholder="选择图标" class="input-with-select" v-model="icon">
                            <el-button class="btnSelect" @click="openIcon" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="组态视图" prop="delivery">
                        <el-input placeholder="选择组态图" class="input-with-select" v-model="digramID">
                            <el-button class="btnSelect" @click="openDiagram" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item style="text-align:center">
                        <el-button type="primary" @click="saveMenuConfig">保存</el-button>
                        <el-button type="warning" @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </fieldset>
        </div>
    </el-col>
    <el-dialog title="菜单编辑" :visible.sync="menuDialog" :modal-append-to-body="false" width="400px">
        <el-form label-width="100px" label-position="left" class="demo-ruleForm">
            <el-form-item label="菜单名称" prop="name">
                <el-input v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="菜单序号" prop="name">
                <el-input v-model="orderno"></el-input>
            </el-form-item>
            <el-form-item label="菜单描述" prop="name">
                <el-input v-model="description"></el-input>
            </el-form-item>
            <el-form-item label="配置菜单" prop="name">
                <el-checkbox v-model="isConfig" true-label="1" false-label="0"></el-checkbox>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="close">确 定</el-button>
        </span>

    </el-dialog>
    <el-dialog style="z-index:2009" @iconClick="iconClick" title="图标选择" :visible.sync="iconEditVisibale" :modal-append-to-body="false" width="557px" center>
        <el-icon @iconClick="iconClick"></el-icon>
        <span slot="footer" class="dialog-footer">
        </span>
    </el-dialog>
</el-row>
</template>

<script>
import SystemData from '@/lib/System'
import Icon from '@/components/Dialog/icon/src'
import Diagram from '@/Views/diagramBind/src'
import Route from '@/router/routes.js'
export default {
    name: 'menuset',
    // components: {
    //     'el-icon': ICON,
    // },
    data() {
        return {

            iconEditVisibale: false, //图标编辑窗口
            menuDialog: false, //菜单编辑窗口
            data: [], // tree data数据
            name: '',
            description: '',
            orderno: '',
            isConfig: "0",
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            node: null, //当前check的节点
            SystemData, //系统分类所有数据
            systemCategory: 0, //系统分类
            routers: [], //系统所有路由
            menuRoute: null, //菜单对应的路由
            icon: '', //菜单关联的图标,
            digramID: '',
            edit: false,
            iconel: null,
        };
    },
    mounted() {
        this.resolveRouter(Route);
        this.loadTree();
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
        loadTree() {
            this.$ajax.get(this.$URL + '/SysMenu/LoadMenu').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.data = result.data.data;
                }
            }).catch((err) => {

            });
        },
        resolveRouter(routes) {
            let _this = this;
            if (routes && routes.length > 0) {
                routes.forEach((r, i) => {
                    _this.routers.push({
                        name: r.title,
                        path: {
                            name: r.name,
                            title: r.title,
                            path: r.path,
                            component: r.cpath
                        }
                    });
                    if (r.children && r.children.length > 0) {
                        _this.resolveRouter(r.children); //递归
                    }
                });
            }
        },
        addMenu() {
            let nodes = this.$refs.tree.getCheckedNodes();
            if (nodes.length > 1) {
                this.$message.error("不能同时操作多个节点");
                return;
            }
            // else if (nodes.length === 1) {
            this.name = '';
            this.description = '';
            this.menuDialog = true;
            this.edit = false;
            // }

        },
        deleteMenu() {
            let nodes = this.$refs.tree.getCheckedNodes();
            let ids = [];
            if (nodes && nodes.length > 0) {
                nodes.forEach((v, i) => {
                    if (v.key) //排除根节点
                    {
                        ids.push(v.key);
                    }
                });
            }
            if (ids.length > 0) {
                this.$confirm('此操作将永久删除改系统菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.get(this.$URL + '/SysMenu/DeleteMenus', {
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
                            this.updateStore();
                            this.node = null;
                        }
                    }).catch((err) => {});
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
            this.isConfig = this.node.isConfig ? this.node.isConfig.toString() : "0"
        },
        close() {
            if (!this.name) {
                this.$message.error('名称不能为空');
                return;
            }
            this.$ajax.post(this.$URL + '/SysMenu/AddMenu', {
                id: this.edit ? this.node.key : 0,
                pid: this.node ? this.node.key : 0,
                name: this.name,
                orderno: this.orderno ? this.orderno : '0',
                description: this.description,
                isConfig: this.isConfig
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.menuDialog = false;
                    this.loadTree();
                    this.updateStore();
                }
            }).catch((err) => {

            });
        },
        handleNodeClick(data) {
            console.log(data);
        },
        handleCheckChange(node, status) {
            if (status) {
                this.node = node;
                this.$ajax.get(this.$URL + '/SysMenu/GetMenuConfig?id=' + this.node.key).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        let config = JSON.parse(result.data.data[0].config);
                        this.systemCategory = config.systemCategory;
                        this.menuRoute = config.route
                        this.icon = config.icon,
                            this.digramID = config.digramid
                    }
                }).catch((err) => {

                });
            } else {
                this.node = null;
                this.systemCategory = 0;
                this.menuRoute = '';
                this.icon = '';
                this.digramID = '';
            }

        },
        iconCallback(prop, val) {
            this.icon = val;
            if (this.iconel) {
                document.getElementById("app").removeChild(this.iconel.$parent.$el);
            }
        },
        openIcon() {
            // this.iconEditVisibale = true;
            this.iconel = Icon.newInstance().diagram;
            this.iconel.open(this.iconCallback, "icon");
        },
        iconClick(name) {
            this.icon = name;
            this.iconEditVisibale = false;
        },
        setDiagram(id) {
            this.digramID = id;
        },
        openDiagram() {
            Diagram.newInstance().diagram.open(this.setDiagram);
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        saveMenuConfig() {
            if (!this.node) {
                this.$message.error('请选择菜单保存！')
                return;
            }
            let data = {
                systemCategory: this.systemCategory,
                route: this.menuRoute,
                icon: this.icon,
                digramid: this.digramID
            }
            this.$ajax.post(this.$URL + '/SysMenu/SaveMenuConfig', this.$QS.stringify({
                id: this.node.key,
                sysid: this.systemCategory,
                config: JSON.stringify(data)
            })).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.updateStore();
                }
            }).catch((err) => {

            });
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
