<template>
<div>
    <div class="ghy-header">
        <el-row style="width: 100%">
            <el-col class="hidden-md-and-down h100" :xs="12" :sm="12" :md="12" :lg="3" :xl="3">
                <div class="logo" @click="openMain">
                    <img src="@/assets/logo.png">
                </div>
            </el-col>
            <el-col class="h100" :xs="24" :sm="24" :md="24" :lg="21" :xl="21">
                <div class="left">
                    <div v-for="item in left" :key="item.key" @click="click_menu(item)" :class="(activeHeader&&activeHeader.pkey==item.key||activeHeader&&activeHeader.key==item.key)?'active':''">
                        <el-dropdown trigger="click" placement="top" @command="handleCommand" v-show="item.children.length>0">
                            <span class="el-dropdown-link">{{item.label}}<i v-show="item.children.length>0" class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown" v-show="item.children.length>0">
                                <el-dropdown-item v-for="(f,i) in item.children" :key="i" :command="f">
                                    {{f.label}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <span v-show="item.children.length===0">{{item.label}}</span>
                    </div>
                    <div class="last">
                        <el-badge :value="total" class="item" @click.native="showAlarmList">
                            <i @click.native="showAlarmList" class="el-icon-bell" style="font-size:20px;"></i>
                        </el-badge>
                        <el-dropdown @command="userCommand" trigger="click" placement="bottom">
                            <span class="el-dropdown-link"> {{username}}</span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="pwd">修改密码</el-dropdown-item>
                                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-menu mode="horizontal" v-if="menus.length>8"   @select="selectMenu">
                            <el-submenu index="2">
                                <template slot="title"><i class="el-icon-more more"></i></template>
                                <el-menu-item :index="JSON.stringify(v)" v-for="(v,i) in other" :key="'i'+i" v-show="v.children.length==0">{{v.label}}</el-menu-item>
                                <el-submenu :index="JSON.stringify(v)" :popper-append-to-body="true" v-for="(v,j) in other" :key="'j'+j" v-show="v.children.length>0">
                                    <template slot="title">{{v.label}}</template>
                                    <el-menu-item :index="JSON.stringify(f)" v-for="(f,k) in v.children" :key="'k'+k">{{f.label}}</el-menu-item>
                                </el-submenu>
                            </el-submenu>
                        </el-menu>
                        <!-- <el-dropdown @command="handleCommand" trigger="click" v-if="menus.length>8">
                            <span class="el-dropdown-link"> <i class="el-icon-more more"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(v,i) in other" :key="i" :command="v">{{v.label}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown> -->
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
    <el-row class="title">
        <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
            <div class="lefttitle"> <span style="color: #325fb8"><i @click="openMain" style="cursor:pointer" class="iconfont icon-shouye"></i>>{{(activeHeader&&activeHeader.label)?activeHeader.label:''}}></span>
                <span style="color:#08abff;">{{activefun?activefun:''}}</span>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="18" :xl="18" class="funmenu">
            <div class="item" :class="[index==i?'active-label':'']" @click="openFun(item,i)" v-for="(item,i) in fun_menu" :key="i"><span>{{item.label}}</span></div>
        </el-col>
    </el-row>
    <el-dialog class="form" title="密码管理" :visible.sync="pwdVisibale" :modal-append-to-body="true" width="400px" center>
        <!-- 系统分类 -->
        <el-form label-width="100px" label-position="left">
            <!-- 名称描述 -->
            <el-form-item label="原密码">
                <el-input v-model="oldPwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input type="password" v-model="newPwd"></el-input>
            </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="changePwd">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import {
    RouteMng
} from "@/lib/Common.js";
import Cookie from 'js-cookie'
export default {
    name: "Header",
    props: {},
    mounted() {
        let menu = this.$store.state.app.menus;
        this.$store.commit("change_menu", []);
        this.$store.commit("change_menu", menu);
        if (sessionStorage.username) {
            this.$store.commit("change_username", sessionStorage.username);
        }
        if (sessionStorage.funs) {
            this.$store.commit("chanage_fun_menu", JSON.parse(sessionStorage.funs));
        }
        if (sessionStorage.activefun) {
            this.$store.commit("change_activeFunc", sessionStorage.activefun);
        }
    },
    data() {
        return {
            right: [],
            left: [],
            other: [],
            vueroute: [],
            pwdVisibale: false,
            oldPwd: '',
            newPwd: '',
            index: 0,
        };
    },
    computed: {
        ...mapState({
            activeHeader: state => {
                return state.app.header_menu;
            },
            menus: state => {
                return state.app.menus;
            },
            fun_menu: state => {
                return state.app.fun_menu;
            },
            activefun: state => {
                return state.app.activeFun;
            },
            total: state => {
                return state.alarm.alarmTotal;
            },
            username: state => {
                return state.app.username;
            }
        })
    },
    methods: {

        LoadFunArea(item) {
            this.$ajax
                .get(this.$URL + "/role/GetUserFuns", {
                    params: {
                        menuId: item.key
                    }
                })
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        if (item.label !== "系统设置")
                            this.$store.commit("chanage_fun_menu", result.data.funs);
                        sessionStorage.funs = JSON.stringify(result.data.funs);
                        if (result.data.funs.length > 0) {
                            let fun = result.data.funs[0];
                            if (fun.config) {
                                let config = JSON.parse(fun.config);
                                if (config.route) {
                                    this.$router.push({
                                        name: config.route.name,
                                        params: {
                                            uuid: config.route.name === "Diagram" ? Date.now() : ""
                                        } //主要为了diagram页面产生路由变化
                                    });
                                    this.$store.commit("change_activeFunc", fun.label);
                                    sessionStorage.activefun = fun.label;
                                    return;
                                }
                            }
                        } else {
                            // 二级404 显示空页面
                            this.$router.push({
                                name: "empty"
                            });
                            this.$store.commit("change_activeFunc", "");
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        userCommand(command) {
            if (command === "pwd") {
                this.pwdVisibale = true;

            } else if (command === "logout") {
                sessionStorage.clear();
                Cookie.remove("token");
                this.$router.push({
                    name: 'login'
                });
            }
        },
        handleCommand(command) {
            sessionStorage.header = JSON.stringify(command);
            this.$store.commit("change_header_menu", command);
            if (command.config) {
                let config = JSON.parse(command.config);
                sessionStorage.header = JSON.stringify(command);

                if (config.route && config.route.name) {
                    this.$router.push({
                        name: config.route.name,
                        params: {
                            uuid: config.route.name === "Diagram" ? Date.now() : ""
                        }
                    });
                    this.$store.commit('chanage_fun_menu', []);
                    this.$store.commit('change_activeFunc', '');
                    if (config.route.path === "setUp") {
                        this.LoadFunArea(command);
                    }
                    return;
                }
            }
            this.$store.commit("change_SecondArea", []); //二级区域菜单清空
            this.$store.commit("change_src", "");
            // this.$store.commit('change_header_menu',);
            this.LoadFunArea(command);
        },

        click_menu(item) {
            sessionStorage.header = JSON.stringify(item);
            this.$store.commit("change_header_menu", item);
            sessionStorage.active = JSON.stringify(item);
            if (item && item.config) {
                let config = JSON.parse(item.config);
                if (config && config.route && config.route.name) {
                    this.$router.push({
                        name: config.route.name
                    });
                    this.$store.commit('chanage_fun_menu', []);
                    this.$store.commit('change_activeFunc', '');

                    if (config.route.path === "setUp") {
                        this.LoadFunArea(item);
                    }
                    return;
                }
            }

            //加载功能菜单和区域一级树
            if (item && item.children && item.children.length === 0) {
                this.LoadFunArea(item);
            }
        },
        showAlarmList() {
            this.$store.commit(
                "change_alarmlist",
                !this.$store.state.alarm.showAlarmList
            );
        },
        openFun(item, i) {
            this.index = i;
            this.$store.commit("change_activeFunc", item.label);
            if (item.config) {
                let config = JSON.parse(item.config);
                if (config.route) {
                    this.$router.push({
                        name: config.route.name,
                        params: {
                            uuid: config.route.name === "Diagram" ? Date.now() : ""
                        } //主要为了diagram页面产生路由变化
                    });
                }
            }
        },
        openMain() {
            this.$router.push({
                name: "homepage"
            });
        },
        changePwd() {
            this.$ajax.post(this.$URL + '/account/ChangePassword', this.$QS.stringify({
                oldpassword: this.oldPwd,
                newpassword: this.newPwd
            })).then((result) => {
                if (result.status === 200) {
                    if (result.data.success) {
                        this.$message({
                            type: 'success',
                            message: result.data.Message,
                        });
                        Cookie.set("token", result.data.token + '@@@');
                        this.pwdVisibale = false;
                    } else {
                        this.$message.error(result.data.Message);
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        selectMenu(command) {
            sessionStorage.header = command;
            command=JSON.parse(command);
            this.$store.commit("change_header_menu", command);
            if (command.config) {
                let config = JSON.parse(command.config);
                sessionStorage.header = JSON.stringify(command);

                if (config.route && config.route.name) {
                    this.$router.push({
                        name: config.route.name,
                        params: {
                            uuid: config.route.name === "Diagram" ? Date.now() : ""
                        }
                    });
                    this.$store.commit('chanage_fun_menu', []);
                    this.$store.commit('change_activeFunc', '');
                    if (config.route.path === "setUp") {
                        this.LoadFunArea(command);
                    }
                    return;
                }
            }
            this.$store.commit("change_SecondArea", []); //二级区域菜单清空
            this.$store.commit("change_src", "");
            // this.$store.commit('change_header_menu',);
            this.LoadFunArea(command);
        }
    },
    watch: {
        menus(newvalue, oldvalue) {
            // if (this.menus.length <= 5) {
            //     this.left = this.menus;
            // } else if (this.menus.length > 5 && this.menus.length <= 8) {
            //     this.left = this.menus.slice(0, 5);
            //     this.right = this.menus.slice(5);
            // } else if (this.menus.length > 8) {
            //     this.left = this.menus.slice(0, 5);
            //     this.right = this.menus.slice(5, 8);
            //     this.other = this.menus.slice(8);
            // }

            if (this.menus.length <= 8) {
                this.left = this.menus;
            }
            // else if (this.menus.length > 5 && this.menus.length <= 8) {
            //     this.left = this.menus.slice(0, 5);
            //     this.right = this.menus.slice(5);
            // }
            else if (this.menus.length > 8) {
                this.left = this.menus.slice(0, 8);
                // this.right = this.menus.slice(5, 8);
                this.other = this.menus.slice(8);
            }
        }
    },

};
</script>

<style>
@import "element-ui/lib/theme-chalk/display.css";
</style><style lang="less" scoped>
.ghy-header {
    z-index: 10;
    width: 100%;
    color: white;
    font-size: 16px;
    display: flex;
    height: 65px;
    background-color: rgba(0, 0, 0, 0.76);
    border-bottom: 1px solid #20355c;

    .left {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;

        >div {
            text-align: center;
            cursor: pointer;
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            &.active {
                background-color: RGBA(21, 35, 63, 1);
            }
        }

        & /deep/ .el-dropdown {
            font-size: 16px;
        }
    }

    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 80%;
        margin: 0 auto;
        /*background-color: antiquewhite;*/
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnYAAAAtCAYAAAAjgibkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3xpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjYjcwYTkxNS03NGMwLWJjNGUtYjUzZC1jMTU4MzYzYzg0ODMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkMzMzQyRDY5QzQ1MTFFODk4RkQ4NDMyQjhGOTQ5MkIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkMzMzQyRDU5QzQ1MTFFODk4RkQ4NDMyQjhGOTQ5MkIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4OEYyRTMwRTQyOUNFODExQjg3Q0ZCRjg5NDAyRjdEQiIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmJiOTcyNjliLTliYjEtMTFlOC05M2E2LWJhN2Q0NDYx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");
    }

    .el-dropdown-link {
        color: white;
    }
    span{
         font-size: 16px !important;
    }
  
}

.title {
    z-index: 10;
    color: white;
    font-size: 12px;
    background-color: #030d21;
    border-bottom: 1px solid #20355c;
    height: 50px;

    .lefttitle {
        height: 50px;
        display: table-cell;
        vertical-align: middle;
        padding-left: 15px;
    }

    .funmenu {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 24px;
        height: 100%;

        .item {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 5px;
            height: 30px;
            // background: #031940;
            border-radius: 3px;
            color: #3795f1;
            margin-right: 5px;
            cursor: pointer;
        }
    }
}

.active-label {
    background: #031940;
}

.logo {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 15px;
    cursor: pointer;

    img {
        width: 90%;
        height: 90%;
    }
}

.more {
    display: inline-block;
    transform: rotate(90deg);
}

.last {
    display: flex;
    align-self: flex-end;
    justify-content: space-around !important;
    padding-right: 10px;

    & /deep/ .el-submenu__icon-arrow {
        display: none;
    }

    // & /deep/ .el-menu{
    //     background-color: rgba(0, 0, 0, 0.76)
    // }
    & /deep/ .el-menu--horizontal {
        border-bottom: 0;
    }

    // & /deep/ .el-menu-item{
    //   background-color: rgba(0, 0, 0, 0.76) !important;
    //   color:white;
    // }

    .el-menu {
        background-color: rgba(0, 0, 0, 0.76)
    }
}
</style>
