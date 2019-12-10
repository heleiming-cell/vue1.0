<template>
<div class="ghy-box">
    <el-row class="h100">
        <el-col :xs="24" :sm="3" class="h100">
            <el-menu :router="true" default-active="/setUp/userManager" class="el-menu-vertical-demo" text-color="#14C5D4" active-text-color="#fff">
                <el-menu-item :index="'/setUp/'+(item.config?JSON.parse(item.config)['route']['path']:'')" v-for="item in setupMenus" :key="item.key*3" v-show="item.children&&item.children.length===0">
                    <i :class="item.config?(JSON.parse(item.config).icon?JSON.parse(item.config).icon:''):''"></i>
                    <span slot="title">{{item.label}}</span>
                </el-menu-item>
                <el-submenu :index="i.toString()" v-for="(item,i) in setupMenus" :key="item.key" v-show="item.children&&item.children.length>0">
                    <template slot="title">
                        <i :class="item.config?(JSON.parse(item.config).icon?JSON.parse(item.config).icon:''):''"></i>
                        <span>{{item.label}}</span>
                    </template>
                    <el-menu-item :index="'/setUp/'+(c.config?JSON.parse(c.config)['route']['path']:'')" v-show="item.children&&item.children.length>0" v-for="c in item.children" :key="c.key">
                        <i :class="c.config?(JSON.parse(c.config).icon?JSON.parse(c.config).icon:''):''"></i>
                        <span slot="title">{{c.label}}</span>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-col>
        <el-col :xs="24" :sm="21" class="h100">
            <router-view></router-view>
        </el-col>
    </el-row>

</div>
</template>
<script>
import gh_table from '@/components/common/table'
import pagination from '@/components/common/pagination'
import loadjs from '@/lib/loadMap'
export default {
    name: 'setUp',
    components: {
        gh_table,
        pagination
    },
    data() {
        return {
            setupMenus: [],
        }
    },

    mounted() {
        if (sessionStorage.header) {
            let activeheader = JSON.parse(sessionStorage.header);
            this.LoadFunArea(activeheader);

        } else {
            this.$ajax.get(this.$URL + '/account/GetUserMenus', {}).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$store.commit('change_menu', result.data.menus);
                    var config = null
                    result.data.menus.forEach(v => {
                        if (v.isConfig === 1) {
                            config = v;
                            return false;
                        }
                    })
                    this.LoadFunArea(config);
                }
            }).catch((err) => {
                console.log(err);
            });
        }
        this.$store.commit('chanage_fun_menu', []);
        this.$store.commit('change_activeFunc', '');
    },
    methods: {
        LoadFunArea(item) {
            this.$ajax.get(this.$URL + '/funMenu/GetUserFunArea', {
                params: {
                    menuId: item.key
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    if (result.data.funs.length > 0) {
                        this.setupMenus = result.data.funs;
                    } else {}
                }
            }).catch((err) => {
                console.log(err);
            });
        },
    },

};
</script>

<style lang="less" scoped>
.filter-line {
    height: 100%;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #14C5D4;
    cursor: pointer;
    font-size: 14px;

    &.active {
        color: white;
    }
}

.dialog-button {
    margin-top: 50px;
    text-align: center;

    >button {
        cursor: pointer;
        width: 188px;
        height: 54px;
        background: rgba(30, 99, 158, 1);
        border-radius: 4px 4px 4px 4px;
        color: white;
        border: none;
        outline: none;
        font-size: 14px;
    }
}

/*弹框*/

.dialog-box {
    padding: 0 20px;
}

.dialog-line {
    margin-bottom: 30px;
    height: auto;
    display: flex;
    color: #B8C4DC;

    >span {
        width: 20%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
}

/*底部按钮*/

.box-btn {
    padding-right: 50px;
    width: calc(100% - 50px);
    text-align: right;
    height: 44px;

    >button {
        cursor: pointer;
        width: 146px;
        height: 44px;
        border-radius: 5px;
        border: none;
        outline: none;
        color: white;
        background-color: #408F89;
        margin-left: 20px;
    }
}

/*操作*/

.facilities-methods {
    display: flex;
    color: #17B2E5;
    justify-content: center;
    align-items: center;

    >span {
        width: 20px;
        margin: 0 5px;

        button {
            color: white;
            border: none;
            outline: none;
            background-color: #1F58A6;
            border-radius: 5px;
            width: 50px;
            height: 30px;
        }

        >i {
            font-size: 16px;
        }
    }
}

.filter_line {
    >button {
        cursor: pointer;
        color: white;
        outline: none;
        border: none;
        width: 146px;
        height: 44px;
        background: rgba(31, 88, 166, 1);
        border-radius: 5px;
    }
}

.ghy-box {
    .header {
        border-bottom: 1px solid #122d62
    }

    & /deep/ .el-menu,
    .el-menu--horizontal,
    .el-menu-item,
    .el-submenu__title {
        background: transparent !important;
    }

    & /deep/ .el-submenu__title {
        background: transparent !important;
    }
}

.el-menu-vertical-demo {
    // width: 15%;
    height: 100%;
    border-right: 1px solid #122d62;
    background-color: transparent !important;
    overflow-y: auto;

    .el-menu-item {
        &:hover {
            background-color: rgb(1, 3, 8)
        }

        .is-active {
            background-color: rgb(1, 3, 8)
        }
    }

}
</style>
