<template>
<el-row class="h100">
    <el-col :xs="24" :sm="3" class="h100 funtree" style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>功能菜单</span></div>
            <div style="float:right">
                <span @click="addMenu" class="pointer"><i class="iconfont icon-jia"></i></span>
                <span @click="deleteMenu" class="pointer" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>
                <span @click="editMenu" style="margin:0 5px" class="pointer"><i class="iconfont icon-bianji"></i></span>
                <!-- <span @click="copyMenu"   class="pointer"><i class="fa fa-copy"></i></span> -->
            </div>
        </div>
        <el-tree ref='tree' show-checkbox check-strictly @check-change="handleCheckChange" :data="data" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="24" :sm="21" class="h100" style="display:flex;justify-content:center;align-items:center;">
        <div style="width:50%; margin: 0 auto; ">
            <fieldset style="padding:20px;">
                <legend>菜单配置</legend>
                <el-form ref="ruleForm" label-width="80px">

                    <el-form-item label="路由选择">
                        <el-select style="width:100%" v-model="menuRoute" value-key="path" filterable clearable>
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
    <el-dialog title="功能菜单编辑" :visible.sync="menuDialog" :modal-append-to-body="false" width="400px">
        <el-form label-width="100px" label-position="left" class="demo-ruleForm">
            <el-form-item label="菜单名称" prop="name">
                <el-input v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="菜单描述" prop="name">
                <el-input v-model="description"></el-input>
            </el-form-item>
            <el-form-item label="菜单编号" prop="name">
                <el-input v-model="OrderNo"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="close">确 定</el-button>
        </span>

    </el-dialog>
    <!-- <el-dialog style="z-index:2009" @iconClick="iconClick" title="图标选择" :visible.sync="iconEditVisibale" :modal-append-to-body="false" width="557px" center>
        <el-icon @iconClick="iconClick"></el-icon>
        <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog> -->
    <!-- <el-dialog style="z-index:2009" @iconClick="iconClick" title="菜单复制" :visible.sync="copyVisibale" :modal-append-to-body="false" width="400px" center>
        <el-form ref="ruleForm" :model="form" label-width="80px">
            <el-form-item label="复制到：">
                <el-select v-model="menuCategory" multiple  style="width:100%">
                    <el-option v-for="(item,i) in MenuData" :key="i" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="copySave">复制</el-button>
      </span>
    </el-dialog> -->
</el-row>
</template>

<script>
import Route from '@/router/routes'
import Diagram from '../diagramBind/src'
import Icon from '@/components/Dialog/icon/src'
export default {
    name: 'functionMenuSet',
    data() {
        return {
            copyVisibale: false, //菜单复制dialog
            iconEditVisibale: false, //图标编辑窗口
            menuDialog: false, //菜单编辑窗口
            data: [], // tree data数据
            name: '',
            description: '',
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            node: null, //当前check的节点
            MenuData: [], //系统分类所有数据
            menuCategory: [], //系统分类
            routers: [], //系统所有路由
            menuRoute: '', //菜单对应的路由
            icon: '', //菜单关联的图标,
            digramID: '',
            edit: false,
            iconel: null,
            OrderNo: "",
        };
    },
    mounted() {
        this.resolveRouter(Route);
        this.loadTree();
    },
    methods: {
        //加载菜单树
        loadTree() {
            this.$ajax.get(this.$URL + '/funMenu/GetFTreeInMenu').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.data = result.data.data;
                    // this.MenuData = result.data.info;
                }
            }).catch((err) => {

            });
        },
        loadMenuInfo() {
            this.$ajax.get(this.$URL + '/menu/GetMenus').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.MenuData = result.data.data;
                }
            }).catch((err) => {

            });
        },
        //解析路由
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
            this.name = '';
            this.description = '';
            this.menuDialog = true;
            this.edit = false;
        },
        deleteMenu() {
            let nodes = this.$refs.tree.getCheckedNodes();
            let ids = [];
            if (nodes && nodes.length > 0) {
                nodes.forEach((v, i) => {
                    if (v.key && v.menuid) //排除根节点
                    {
                        ids.push(v.key);
                    }
                });
            }
            if (ids.length > 0) {
                this.$confirm('此操作将永久删除改功能菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.get(this.$URL + '/funMenu/DeleteFMenus', {
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
            } else if (this.node && !this.node.menuid) {
                this.$message.error("该节点不能编辑");
                return;
            }
            this.edit = true;
            this.name = this.node.label;
            this.OrderNo = this.node.OrderNo;
            this.description = '';
            this.menuDialog = true;
        },
        close() {
            if (!this.node) {
                this.$message.error('请选择菜单保存！')
                return;
            }
            if (!this.name) {
                this.$message.error('名称不能为空');
                return;
            }
            // if (!this.edit && this.node.menuid && this.node.pkey === 0) { //新增条件下
            //     this.$message.error('暂不支持多级操作');
            //     return;
            // }
            this.$ajax.post(this.$URL + '/funMenu/AddFunctionMenu', {
                id: this.edit ? this.node.key : 0,
                pid: !this.node.menuid ? 0 : this.node.key,
                name: this.name,
                description: this.description,
                menuId: !this.node.menuid ? this.node.key : this.node.menuid,
                OrderNo: this.OrderNo
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.menuDialog = false;
                    this.loadTree();

                }
            }).catch((err) => {

            });
        },
        handleCheckChange(node, status) {
            if (status) {
                this.node = node;
                if (this.node.menuid && this.$refs.tree.getCheckedNodes().length === 1) {
                    this.$ajax.get(this.$URL + '/funMenu/GetFMenuConfig?id=' + this.node.key).then((result) => {
                        if (result.status === 200 && result.data.success) {
                            let config = JSON.parse(result.data.data[0].config);
                            //  this.menuCategory = config.Menuid;
                            if (config.route.path)
                                this.menuRoute = config.route
                            this.icon = config.icon,
                                this.digramID = config.digramid
                        }
                    }).catch((err) => {

                    });
                } else {
                    // this.node = null;
                    this.menuRoute = '';
                    this.icon = '';
                    this.digramID = '';
                }
            } else {
                this.node = null;
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
            this.iconel = Icon.newInstance().diagram;
            this.iconel.open(this.iconCallback, "icon");
            // this.iconEditVisibale = true;
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
                this.$message.error("请选择要编辑的节点");
                return;
            } else if (this.node && !this.node.menuid) {
                this.$message.error("该节点不能编辑");
                return;
            }
            let data = {
                //  Menuid: this.menuCategory,
                route: this.menuRoute,
                icon: this.icon,
                digramid: this.digramID
            }
            if (this.node && this.node.menuid)
                this.$ajax.post(this.$URL + '/funMenu/SaveFMenuConfig', this.$QS.stringify({
                    id: this.node.key,
                    menuid: this.node.menuid,
                    config: JSON.stringify(data)
                })).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    }
                }).catch((err) => {});
        },
        // copyMenu() {
        //     // alert(this.node.menuid)
        //     if ((this.node && this.node.menuid) || !this.node) {
        //         this.$message.error("请选择系统主菜单");
        //         return;
        //     } else if (this.node && !this.node.menuid) {
        //         this.copyVisibale = true;
        //         this.loadMenuInfo();
        //     }
        // },
        // copySave(){
        //     let _this=this;
        //    if(this.menuCategory.length===0)
        //    {
        //        this.$message.error("请选择要操作的系统菜单");
        //        return;
        //    }
        //    else if(this.menuCategory&&this.menuCategory.length>0)
        //    {
        //        this.$ajax.get(this.$URL+'/menu/CopyMenu',{
        //            params:{
        //                menuid:_this.node.key,
        //                copymenuid:_this.menuCategory
        //            }
        //        }).then((result) => {
        //            if(result.status&&result.data.success)
        //            {
        //                this.$message({
        //                    type:'success',
        //                    message:'复制成功'
        //                });
        //                this.copyVisibale=false;
        //                this.loadTree();
        //            }
        //        }).catch((err) => {

        //        });
        //    }
        // },

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

.funtree /deep/ .el-tree {
    height: calc(100% - 37px);
    overflow-y: auto;
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
