<template>
<el-row class="h100">
    <el-col :xs="24" :sm="3" class="h100" style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>区域树</span></div>
            <div style="float:right">
                <!-- <span @click="addMenu" class="pointer"><i class="iconfont icon-jia"></i></span> -->
                <span @click="deleteMenu" class="pointer" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>
                <!-- <span @click="editMenu" style="margin:0 5px" class="pointer"><i class="iconfont icon-bianji"></i></span> -->
                <span @click="copyMenu" class="pointer"><i class="iconfont icon-fuzhi"></i></span>
            </div>
        </div>
        <el-tree :expand-on-click-node="false" node-key="key" ref="tree" show-checkbox check-strictly @node-click="handleClick" @check-change="handleCheckChange" :data="data" :props="defaultProps">
        </el-tree>
    </el-col>

    <el-col :xs="24" :sm="21" class="h100" style="display:flex;justify-content:center;align-items:center;">
        <div style="width:50%; margin: 0 auto; ">
            <fieldset style="padding:20px;">
                <legend>菜单配置</legend>
                <el-form ref="ruleForm" label-width="80px">
                    <el-form-item label="路由选择">
                        <el-select style="width:100%" v-model="menuRoute">
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
    <el-dialog style="z-index:2009" @iconClick="iconClick" title="图标选择" :visible.sync="iconEditVisibale" :modal-append-to-body="false" width="557px" center>
        <el-icon @iconClick="iconClick"></el-icon>
        <span slot="footer" class="dialog-footer">
        </span>
    </el-dialog>
    <el-dialog title="系统区域" :visible.sync="areatreeVisible" :modal-append-to-body="false" width="400px" top="100px">
        <div class="dialog-box">
            <el-tree class="menutree" node-key="key" ref="sysareatree" show-checkbox :data="areaTreeData" :props="defaultProps"></el-tree>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="copySave">确 定</el-button>
        </span>
    </el-dialog>
</el-row>
</template>

<script>
import ICON from '@/components/icon';
import Diagram from '@/Views/diagramBind/src/index'
import {
    RouteMng,
    Tree
} from '@/lib/Common'
export default {
    name: 'areaMenuSet',
    components: {
        'el-icon': ICON,
    },
    data() {
        return {
            tree: new Tree(),
            //  copyVisibale: false, //菜单复制dialog
            iconEditVisibale: false, //图标编辑窗口
            // menuDialog: false, //菜单编辑窗口
            data: [], // tree data数据
            name: '',
            description: '',
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            node: null, //当前check的节点
            //   MenuData: [], //系统分类所有数据
            menuCategory: [], //系统分类
            routers: [], //系统所有路由
            menuRoute: '', //菜单对应的路由
            icon: '', //菜单关联的图标,
            digramID: '',
            edit: false,
            areatreeVisible: false,
            areaTreeData: [],
        };
    },
    mounted() {
        new RouteMng().resolveRouter(this.$router.options.routes, this);
        this.tree.loadTreeNodes(this, '/SysMenu/GetAreaTreeInMenu', "data");
    },
    methods: {
        deleteMenu() {
            this.$confirm('此操作将永久删除改区域菜单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tree.deleteNodes(this, '/AreaMenu/DeleteAMenus')

            });
        },
        handleCheckChange(node, status) {
            this.tree.loadNodeConfig(this, node, status, '/AreaMenu/GetAMenuConfig');
        },
        handleClick(data, node, _this) {
            //   console.log(data);
            this.node = data;
        },
        openIcon() {
            this.iconEditVisibale = true;
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
            this.tree.saveNodeConfig(this, '/AreaMenu/SaveAMenuConfig');
        },
        copyMenu() {
            if (!this.node) {
                this.$message.error("请选择要复制的节点");
                return;
            }
            if ((this.node && this.node.menuid) || !this.node) {
                this.$message.error("请选择系统主菜单");
                return;
            } else if (this.node && !this.node.menuid) {
                this.areatreeVisible = true;
                this.tree.loadTreeNodes(this, '/sysArea/LoadSysArea', 'areaTreeData')
            }
        },
        copySave() {
            let _this = this;
            let halfNodes = this.$refs.sysareatree.getHalfCheckedNodes();
            let nodes = this.$refs.sysareatree.getCheckedNodes();
            if (nodes.length <= 0) {
                this.$message.error("请选择要复制的系统区域");
                return;
            }
            let ids = [];
            if (halfNodes && halfNodes.length > 0) {
                halfNodes.forEach((v, i) => {
                    ids.push(v);
                });
            }
            nodes.forEach((v, i) => {
                ids.push(v);
            });
            this.$ajax.post(this.$URL + '/AreaMenu/CopyMenu', this.$QS.stringify({
                menuid: _this.node.key,
                sysAreas: ids
            })).then((result) => {
                if (result.status && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: '复制成功'
                    });
                    this.areatreeVisible = false;
                    // this.loadTree();
                    this.tree.loadTreeNodes(this, '/SysMenu/GetAreaTreeInMenu', "data");
                } else {
                    this.$message.error("复制失败");
                }
            }).catch((err) => {
                this.$message.error(err);
            });

        },

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
    height: calc(100% - 38px);
    overflow-y: auto;
}

.el-dialog__footer {
    text-align: center !important;
}

.menutree {
    max-height: 400px;
    overflow-y: scroll;
}
</style>
