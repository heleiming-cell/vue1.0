<template>
<div class="h100">
    <el-col :xs="24" :sm="3" class="h100" style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>系统角色列表</span></div>
        </div>
        <el-tree ref="tree" @check-change="handleRoleCheck" show-checkbox check-strictly :data="data" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="24" :sm="21" class="h100">
        <el-tabs type="border-card" @tab-click="tabClick">
            <el-tab-pane label="系统菜单" value="1">
                <div style="float:right;margin-bottom:10px;">
                    <el-button @click="openTreeDialog" type="primary">添加菜单</el-button>
                    <el-button @click="deleteRoleMenus" type="danger">删除菜单</el-button>
                </div>
                <el-table :data="tableData" style="width: 100%" class="usertable" @select-all="selectionAll" @select="selectone">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="MenuId" label="菜单编号">
                    </el-table-column>
                    <el-table-column prop="Name" label="菜单名称">
                    </el-table-column>
                    <el-table-column prop="RoleName" label="角色名称">
                    </el-table-column>
                </el-table>
                <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>

            </el-tab-pane>
            <el-tab-pane label="功能菜单">
                <div style="float:right;margin-bottom:10px;">
                    <el-button @click="openFTreeDialog" type="primary">添加菜单</el-button>
                    <el-button @click="deleteRoleFuns" type="danger">删除菜单</el-button>
                </div>
                <el-table :data="tableFunData" style="width: 100%" class="usertable" @select-all="selectionAll" @select="selectone">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="FunId" label="子菜单编号">
                    </el-table-column>
                    <el-table-column prop="MName" label="系统名称">
                    </el-table-column>
                    <el-table-column prop="FName" label="子菜单名称">
                    </el-table-column>
                    <el-table-column prop="RoleName" label="所属角色">
                    </el-table-column>
                </el-table>
                <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>

            </el-tab-pane>
            <el-tab-pane label="功能权限">
                <div style="float:right;margin-bottom:10px;">
                    <el-button @click="openFunDialog" type="primary">添加功能</el-button>
                    <el-button @click="deleteRoleFeatures" type="danger">删除功能</el-button>
                </div>
                <el-table :data="tableFeatureData" style="width: 100%" class="usertable" @select-all="selectionAll" @select="selectone">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="FunId" label="功能编号">
                    </el-table-column>
                    <el-table-column prop="FunName" label="功能名称">
                    </el-table-column>
                    <el-table-column prop="RoleName" label="角色名称">
                    </el-table-column>
                </el-table>
                <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>

            </el-tab-pane>
            <el-tab-pane label="区域权限">
                <div style="float:right;margin-bottom:10px;">
                    <el-button @click="openAreaDialog" type="primary">添加区域</el-button>
                    <el-button @click="deleteRoleAreas" type="danger">删除区域</el-button>
                </div>
                <el-table :data="tableAreaData" style="width: 100%" class="usertable" @select-all="selectionAll" @select="selectone">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="AreaId" label="区域编号">
                    </el-table-column>
                    <el-table-column prop="MName" label="系统名称">
                    </el-table-column>
                    <el-table-column prop="AName" label="区域名称">
                    </el-table-column>
                    <el-table-column prop="RoleName" label="所属角色">
                    </el-table-column>
                </el-table>
                <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>

            </el-tab-pane>
            <el-tab-pane label="资源权限">
                <div style="float:right;margin-bottom:10px;">
                    <el-select placeholder="资源类型" clearable v-model="typeId" @change="changeResourceType" default-first-option>
                        <el-option label="资源类型" value="0"></el-option>
                        <el-option label="摄像机" value="1"></el-option>
                        <el-option label="面板" value="2"></el-option>
                        <el-option label="视图" value="3"></el-option>
                    </el-select>
                </div>
                <el-table ref="multipleTable" :data="tableResourceData" style="width: 100%" class="usertable" @select-all="selectionAll" @select="selectionAll">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column prop="Name" label="资源名称">
                    </el-table-column>
                    <el-table-column prop="TypeName" label="资源类型">
                    </el-table-column>
                </el-table>
                <el-pagination :page-size="Size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
                </el-pagination>

            </el-tab-pane>

            <!-- <el-tab-pane label="前端路由">前端路由</el-tab-pane> -->
        </el-tabs>
    </el-col>
    <el-dialog title="菜单树" :visible.sync="menutreeVisible" :modal-append-to-body="false" width="400px" top="100px">
        <div class="dialog-box">
            <el-tree class="menutree" show-checkbox check-strictly @check-change="handleCheck" :data="menuTreeData" :props="defaultProps"></el-tree>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="SaveRoleMenu">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="功能菜单树" :visible.sync="funMenutreeVisible" :modal-append-to-body="false" width="400px" top="100px">
        <div class="dialog-box">
            <el-tree class="menutree" show-checkbox check-strictly @check-change="handleFunCheck" :data="menuTreeData" :props="defaultProps"></el-tree>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="SaveFunMenu">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="区域树" :visible.sync="areatreeVisible" :modal-append-to-body="false" width="400px" top="100px">
        <div class="dialog-box">
            <el-tree class="menutree" show-checkbox check-strictly @check-change="handleAreaCheck" :data="areaTreeData" :props="defaultProps"></el-tree>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="SaveAreaMenu">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="功能列表" :visible.sync="funVisible" :modal-append-to-body="false" width="400px" top="100px">
        <div class="dialog-box">
            <el-select collapse-tags multiple style="width:100%" v-model="selectFuns" placeholder="请选择功能">
                <el-option v-for="item in funOptions" :key="item.FunID" :value="item.FunID" :label="item.FunName"></el-option>
            </el-select>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" @click="SaveRoleFeature">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import pagination from '@/components/common/pagination/index.js'
export default {
    name: 'authorization',
    components: {
        // 'gh_table': gh_table,
        'pagination': pagination,
    },
    data() {
        return {
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            selectFuns: [],
            funOptions: [], //功能列表 select
            tableFunData: [], //功能表
            tableFeatureData: [],
            tableData: [], //菜单权限表
            tableAreaData: [], //区域权限表
            tableResourceData: [], //资源
            menutreeVisible: false,
            areatreeVisible: false,
            funVisible: false,
            funMenutreeVisible: false,
            menuTreeData: [],
            funMenuTreeData: [],
            selectTreeids: new Set(),
            selectTreeRole: new Set(),
            selectTreeArea: new Set(),
            selectTreeFun: new Set(),
            total: 0,
            currentPage: 1,
            deleteMenus: [],
            deleteAreas: [], //要删除的区域
            deleteFuns: [],
            deleteFeatures: [],
            areaTreeData: [], //区域树
            index: "0", //tab id
            typeId: "0",
            Size: 10
        }
    },
    mounted() {
        this.loadRoleTree();
        this.loadMenuTable();
    },
    methods: {
        //加载区域树
        loadAreaTree() {
            this.$ajax.get(this.$URL + '/SysMenu/GetAreaTreeInMenu').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.areaTreeData = result.data.data;
                    // this.MenuData = result.data.info;
                }
            }).catch((err) => {

            });
        },
        //加载功能菜单树
        loadFunTree() {
            this.$ajax.get(this.$URL + '/funMenu/GetFTreeInMenu').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.menuTreeData = result.data.data;
                    // this.MenuData = result.data.info;
                }
            }).catch((err) => {

            });
        },
        //加载菜单树
        loadMenuTree() {
            this.$ajax.get(this.$URL + '/SysMenu/LoadMenu').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.menuTreeData = result.data.data;
                }
            }).catch((err) => {

            });
        },
        //加载角色树
        loadRoleTree() {
            this.$ajax.get(this.$URL + '/account/LoadRoleTree').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.data = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        //加载功能select
        loadFuns() {

        },
        //根据角色加载角色里的菜单
        loadMenuTable() {
            this.$ajax.get(this.$URL + '/role/GetRoleMenus', {
                params: {
                    roleId: this.selectTreeRole.size > 0 ? JSON.stringify(Array.from(this.selectTreeRole)) : " ",
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
        //根据角色加载角色里的功能
        loadFeatureTable() {
            this.$ajax.get(this.$URL + '/fun/GetRoleFuns', {
                params: {
                    roleId: this.selectTreeRole.size > 0 ? JSON.stringify(Array.from(this.selectTreeRole)) : " ",
                    page: this.currentPage,
                    size: 10
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.tableFeatureData = result.data.data;
                    this.total = result.data.count;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        //加载角色里的区域for table
        loadAreaTable() {
            this.$ajax.get(this.$URL + '/role/GetRoleAreas', {
                params: {
                    roleId: this.selectTreeRole.size > 0 ? JSON.stringify(Array.from(this.selectTreeRole)) : " ",
                    page: this.currentPage,
                    size: 10
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.tableAreaData = result.data.data;
                    this.total = result.data.count;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        // 角色和功能菜单列表
        loadFunTable() {
            this.$ajax.get(this.$URL + '/role/GetRoleFuns', {
                params: {
                    roleId: this.selectTreeRole.size > 0 ? JSON.stringify(Array.from(this.selectTreeRole)) : " ",
                    page: this.currentPage,
                    size: 10
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.tableFunData = result.data.data;
                    this.total = result.data.count;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadResourceTable() {
            let roles = [];
            let nodes = this.$refs.tree.getCheckedNodes();
            nodes.forEach(v => {
                roles.push(v.key);
            });
            this.$ajax.get(this.$URL + '/resource/GetResources', {
                params: {
                    typeId: this.typeId,
                    roleId: roles.length == 0 ? '[0]' : JSON.stringify(roles),
                    page: this.currentPage,
                    size: 10
                }
            }).then((result) => {
                let _this = this;
                if (result.status === 200 && result.data.success) {
                    this.tableResourceData = result.data.data;
                    this.total = result.data.count;
                    this.$nextTick(() => {
                        if (this.tableResourceData) {
                            this.tableResourceData.forEach(v => {
                                if (v.Checked)
                                    _this.$refs.multipleTable.toggleRowSelection(v);
                            });
                        }
                    })

                }
            }).catch((err) => {
                console.log(err);
            });
        },
        //打开菜单树dialog
        openTreeDialog() {
            this.menutreeVisible = true;
            this.loadMenuTree();

        },
        //打开功能菜单dialog
        openFTreeDialog() {
            this.funMenutreeVisible = true;
            this.loadFunTree();

        },
        //打开区域树dialog
        openAreaDialog() {
            this.areatreeVisible = true;
            this.loadAreaTree();

        },
        openFunDialog() {
            this.funVisible = true;
            this.selectFuns = [];
            this.$ajax.get(this.$URL + '/fun/GetFuns').then((result) => {
                if (result.status === 200 && result.data.success) {
                    console.log(result.data.data);
                    this.funOptions = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        handleCheck(v, status) {
            if (status) {
                this.selectTreeids.add(v.key);
            } else {
                this.selectTreeids.delete(v.key);
            }
        },
        //区域树check
        handleAreaCheck(v, status) {
            if (status) {
                if (v.key && v.menuid) //排除一级菜单
                    this.selectTreeArea.add(v.key + "|" + v.menuid);
            } else {
                if (v.key && v.menuid)
                    this.selectTreeArea.delete(v.key + "|" + v.menuid);
            }
        },
        //功能菜单树check
        handleFunCheck(v, status) {
            if (status) {
                if (v.key && v.menuid) //排除一级菜单
                    this.selectTreeFun.add(v.key + "|" + v.menuid);
            } else {
                if (v.key && v.menuid)
                    this.selectTreeFun.delete(v.key + "|" + v.menuid);
            }
        },
        //角色树check
        handleRoleCheck(v, status) {
            if (status) {
                this.selectTreeRole.add(v.key);
            } else {
                this.selectTreeRole.delete(v.key);
            }
            if (this.index === "0") {
                this.loadMenuTable();
            } else if (this.index === "2") {
                // this.loadAreaTable();
                this.loadFeatureTable();
            } else if (this.index === "1") {
                // this.loadFeatureTable();
                this.loadFunTable()
            } else if (this.index === "3") {
                // this.loadFunTable();
                this.loadAreaTable();
            } else if (this.index === "4") {
                this.loadResourceTable();
            }
        },
        SaveRoleMenu() {
            if (this.selectTreeRole.size <= 0) {
                this.$message.error("请选择要操作的角色");
                return;
            }
            if (this.selectTreeids.size <= 0) {
                this.$message.error("请选择要分配的菜单");
                return;
            }
            this.$ajax.post(this.$URL + '/role/AddRoleMenu', {
                roles: Array.from(this.selectTreeRole),
                menus: Array.from(this.selectTreeids)
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.menutreeVisible = false;
                    this.loadMenuTable();
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        SaveAreaMenu() {
            if (this.selectTreeRole.size <= 0) {
                this.$message.error("请选择要操作的角色");
                return;
            }
            if (this.selectTreeArea.size <= 0) {
                this.$message.error("请选择要分配的区域");
                return;
            }
            this.$ajax.post(this.$URL + '/role/AddRoleArea', {
                roles: Array.from(this.selectTreeRole),
                areas: Array.from(this.selectTreeArea)
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.areatreeVisible = false;
                    this.loadAreaTable();
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        //角色--功能菜单
        SaveFunMenu() {
            if (this.selectTreeRole.size <= 0) {
                this.$message.error("请选择要操作的角色");
                return;
            }
            if (this.selectTreeFun.size <= 0) {
                this.$message.error("请选择要分配的功能菜单");
                return;
            }
            this.$ajax.post(this.$URL + '/role/AddRoleFun', {
                roles: Array.from(this.selectTreeRole),
                funs: Array.from(this.selectTreeFun)
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.funMenutreeVisible = false;
                    this.loadFunTable();
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        //角色--功能
        SaveRoleFeature() {
            if (this.selectTreeRole.size <= 0) {
                this.$message.error("请选择要操作的角色");
                return;
            }
            if (this.selectFuns.length === 0) {
                this.$message.error("请选择功能！");
                return;
            }
            this.$ajax.post(this.$URL + '/role/AddRoleFeature', {
                roles: Array.from(this.selectTreeRole),
                funs: this.selectFuns
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.funVisible = false;
                    this.loadFeatureTable();
                }
            }).catch((err) => {
                console.log(err);
            });

        },
        handleCurrentChange(val) {
            this.currentPage = val
            if (this.index === "0") {
                this.loadMenuTable();
            } else if (this.index === "3") {
                this.loadAreaTable();
            } else if (this.index === "1") {
                this.loadFunTable();
            } else if (this.index === "2") {
                this.loadFeatureTable();
            } else if (this.index === "4") {
                this.loadResourceTable();
            }
        },
        //表格全选
        selectionAll(selection, row) {
            if (this.index === "0") {
                if (selection.length > 0) {
                    let id = [];
                    selection.forEach((v, k) => {
                        id.push(v.MenuId + '|' + v.RoleId);
                    });
                    this.deleteMenus = id;
                } else if (selection.length === 0) {
                    this.deleteMenus = [];
                }
            } else if (this.index === "3") {
                if (selection.length > 0) {
                    let id = [];
                    selection.forEach((v, k) => {
                        id.push(v.AreaId + '|' + v.RoleId);
                    });
                    this.deleteAreas = id;
                } else if (selection.length === 0) {
                    this.deleteAreas = [];
                }
            } else if (this.index === "2") {
                if (selection.length > 0) {
                    let id = [];
                    selection.forEach((v, k) => {
                        id.push(v.FunID + '|' + v.RoleId);
                    });
                    this.deleteFeatures = id;
                } else if (selection.length === 0) {
                    this.deleteFeatures = [];
                }
            } else if (this.index === "1") {
                if (selection.length > 0) {
                    let id = [];
                    selection.forEach((v, k) => {
                        id.push(v.FunId + '|' + v.RoleId);
                    });
                    this.deleteFuns = id;
                } else if (selection.length === 0) {
                    this.deleteFuns = [];
                }
            } else if (this.index === "4") {
                let nodes = this.$refs.tree.getCheckedNodes();
                let roles = [];
                if (nodes.length == 0) {
                    this.$message.error("请先选择角色");
                    return false;
                }
                nodes.forEach(v => {
                    roles.push(v.key)
                });
                if (row) //单选
                {
                    if (selection.length && selection.find(v => v.ID == row.ID)) //选中
                    {
                        this.updateResource(row.TypeId, roles, [row.ID], "add");
                    } else {
                        this.updateResource(row.TypeId, roles, [row.ID], "delete");
                    }
                } else //多选
                {
                    let ids = [];
                    let flag = "add";
                    if (selection.length > 0) {
                        selection.forEach(v => {
                            ids.add(v.ID);
                        });
                        flag = "add";
                    } else {
                        this.tableResourceData.forEach(v => {
                            ids.add(v.ID);
                        });
                        flag = "delete";
                    }
                    this.updateResource(row.TypeId, roles, ids, flag);

                }
            }
        },
        //表格单选
        selectone(selection) {
            if (this.index === "0") {
                if (selection.length === 0) {
                    this.deleteMenus = [];
                } else if (selection.length > 0) {
                    let id = [];
                    selection.forEach((v, k) => {
                        id.push(v.MenuId + '|' + v.RoleId);
                    });
                    this.deleteMenus = id;
                }
            } else if (this.index === "2") {
                if (selection.length === 0) {
                    this.deleteFeatures = [];
                } else if (selection.length > 0) {
                    let id = [];
                    selection.forEach((v, k) => {
                        id.push(v.FunID + '|' + v.RoleId);
                    });
                    this.deleteFeatures = id;
                }
            } else if (this.index == "1") {
                if (selection.length === 0) {
                    this.deleteFuns = [];
                } else if (selection.length > 0) {
                    let id = [];
                    selection.forEach((v, k) => {
                        id.push(v.FunId + '|' + v.RoleId);
                    });
                    this.deleteFuns = id;
                }
            } else if (this.index == "4") {
                if (selection.length === 0) {
                    this.deleteFuns = [];
                } else if (selection.length > 0) {
                    let id = [];
                    selection.forEach((v, k) => {
                        id.push(v.FunId + '|' + v.RoleId);
                    });
                    this.deleteFuns = id;
                }
            } else if (this.index == "3") {
                if (selection.length === 0) {
                    this.deleteAreas = [];
                } else if (selection.length > 0) {
                    let id = [];
                    selection.forEach((v, k) => {
                        id.push(v.AreaId + '|' + v.RoleId);
                    });
                    this.deleteAreas = id;
                }
            }

        },
        updateResource(typeId, roles, ids, action) {
            this.$ajax.post(this.$URL + '/resource/UpdateResources', {
                typeId: typeId,
                roles: roles,
                ids: ids,
                action: action
            }).then(result => {
                if (result.status === 200 && result.data.success) {
                    this.loadResourceTable();
                }
            });

        },
        deleteRoleMenus() {
            if (this.deleteMenus.length === 0) {
                this.$message.error("请选择要删除的菜单");
                return;
            }
            this.$confirm('此操作将永久删除改系统菜单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get(this.$URL + '/role/DeleteRoleMenu', {
                    params: {
                        data: this.deleteMenus
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.loadMenuTable();
                    } else if (!result.data.success) {
                        this.$message.error("删除失败");
                    }
                }).catch((err) => {
                    console.log(err);
                });
            });

        },
        deleteRoleFeatures() {
            if (this.deleteFeatures.length === 0) {
                this.$message.error("请选择要删除的功能");
                return;
            }
            this.$confirm('此操作将永久删除改系统功能, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get(this.$URL + '/fun/DeleteRoleFun', {
                    params: {
                        data: this.deleteFeatures
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.loadFeatureTable();
                    } else if (!result.data.success) {
                        this.$message.error("删除失败");
                    }
                }).catch((err) => {
                    console.log(err);
                });
            });

        },
        deleteRoleFuns() {
            if (this.deleteFuns.length === 0) {
                this.$message.error("请选择要删除的功能菜单");
                return;
            }
            this.$confirm('此操作将永久删除改功能菜单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get(this.$URL + '/role/DeleteRoleFun', {
                    params: {
                        data: this.deleteFuns
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.loadFunTable();
                    } else if (!result.data.success) {
                        this.$message.error("删除失败");
                    }
                }).catch((err) => {
                    console.log(err);
                });
            });

        },
        deleteRoleAreas() {
            if (this.deleteAreas.length === 0) {
                this.$message.error("请选择要删除的区域");
                return;
            }
            this.$confirm('此操作将永久删除改区域数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get(this.$URL + '/role/DeleteRoleArea', {
                    params: {
                        data: this.deleteAreas
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.loadAreaTable();
                    } else if (!result.data.success) {
                        this.$message.error("删除失败");
                    }
                }).catch((err) => {
                    console.log(err);
                });
            });

        },
        tabClick(_this) {
            this.index = _this.index;
            if (_this.index === "0") {
                this.loadMenuTable();
            } else if (_this.index === "2") {
                this.loadFeatureTable();
                // this.loadAreaTable();
            } else if (_this.index === "1") {
                // this.loadFeatureTable();
                this.loadFunTable();
            } else if (_this.index === "3") {
                // this.loadFunTable();
                this.loadAreaTable();
            } else if (_this.index === "4") {
                this.loadResourceTable();
            }
        },
        changeResourceType(val) {
            this.typeId = val;
            this.loadResourceTable();
        }

    }
}
</script>

<style lang="less" scoped>
.h100 {
    height: 100%;
}

.menuheader {
    line-height: 40px;
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

.menutree {
    max-height: 400px;
    overflow-y: scroll;
}
</style>
