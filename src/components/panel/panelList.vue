<template>
<div class="box">
    <div class="leftmenu" v-if="firstarea.length>0">
        <ul>
            <li @click="LoadSecond(item)" v-for="(item,i) in firstarea" :key="i">
                <div :class="[item.label==label?'jiao':'']"></div>
                {{item.label}}
            </li>
        </ul>
    </div>
    <div class="rightfloor" v-if="secondarea&&secondarea.length>0">
        <div class="cm" v-for="(item,i) in secondarea" :key="i">
            <div class="mm"></div>
            <div class="mm"></div>
            <div class="mm">
                <div @click="LoadPanels(item)" class="num">{{item.label}}</div>
            </div>
            <div class="mm"></div>
        </div>
    </div>
    <!-- <div class="Panelbody"> -->
        <div class="panellist">
            <component  v-for="(item,i) in panellist" :key="i" v-bind:is="panels[item.PanelType]" :props_id="item.ID"></component>
        </div>
        <div class="page">
            <el-pagination :page-size="size" @current-change="changePage" @prev-click="changePage" @next-click="changePage" background layout="total,prev, pager, next" :total="total">
            </el-pagination>
        </div>
    <!-- </div> -->

</div>
</template>

<script>
import item from '../li'
import {
    mapState
} from 'vuex'
import LeftMenu from '../LeftMenu'
import {
    panelVm
} from '../../data/panelComponent.js'
import {
    panels,
    openModal
} from '../common/modal/panelModal.js'
export default {
    name: 'panelList',
    components: {
        'el-item': item,
        'el-leftmenu': LeftMenu
    },
    data() {
        return {
            data: [],
            label: '',
            second: new Map(),
            panels: panelVm,
            panellist: [],
            total:0,
            size:8,
            currentPage:1,
            floor:null,
        }
    },
    created() {

    },
  
    mounted() {
      
        if (sessionStorage.header) {
            let active = JSON.parse(sessionStorage.header);
            this.$store.commit('change_header_menu', active);
            this.LoadFunArea(active);
        }
    },
    computed: {
        ...mapState({
            activeHeader: state => {
                //[].concat
                return state.app.header_menu;
            },
            firstarea: state => {
                return state.app.firstArea;
            },
            secondarea: state => {
                return state.app.secondArea;
            },
        }),

    },
    beforeRouteUpdate(to, from, next) {
        // if (localStorage.header) {
        //     let header = JSON.parse(localStorage.header);
        //     this.LoadFunArea(header);
        // }
        if (sessionStorage.header) {
            let active = JSON.parse(sessionStorage.header);
            this.$store.commit('change_header_menu', active);
        }
        next();
    },
    methods: {
        LoadFunArea(item) {
            let _this = this;
            //重置菜单
            this.$store.commit('change_FirstArea', []);
            this.$store.commit('change_SecondArea', []);

            this.$ajax.get(this.$URL + '/funMenu/GetUserFunArea', {
                params: {
                    menuId: item.key
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    let first = [],
                        second = [];
                    if (result.data.areas && result.data.areas.length > 0) {
                        result.data.areas.forEach((v, i) => {
                            if (v.children && v.children.length > 0) {
                                first.push(v);
                                _this.second.set(v.menuid + '_' + v.key, v.children);
                            } else if (v.children && v.children.length === 0) {
                                second.push(v);
                            }
                        });
                    }
                    if (first.length > 0)
                        this.$store.commit('change_FirstArea', first);
                    if (second.length > 0) {
                        this.$store.commit('change_SecondArea', second);
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        openDiagram(config) {
            if (config && config.digramid) {
                this.src = window.location.protocol + "//" + window.location.hostname + ":9008/home/runview?diagramid=" + config.digramid
                console.log(this.src);
            }
        },
        LoadSecond(item) {
            this.label = item.label;
            if (item.config) //加载指定的路由
            {

            } else {
                let children = this.second.get(item.menuid + '_' + item.key);
                if (children) {
                    this.$store.commit('change_SecondArea', children);
                    return;
                }

                this.$ajax.get(this.$URL + '/AreaMenu/GetSecondArea', {
                    params: {
                        menuId: item.menuid,
                        pid: item.key,
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$store.commit('change_SecondArea', result.data.areas)
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
        LoadPanels(item) {
            this.floor=item;
            if (item && item.key && item.menuid) {
                this.$ajax.get(this.$URL + '/panel/GetPanelByIDs', {
                    params: {
                        areaId: item.key,
                        menuId: item.menuid,
                        size:this.size,
                        page:this.currentPage,
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.panellist = result.data.data;
                        this.total=result.data.total;
                        return;
                    }
                    this.panellist = [];
                }).catch((err) => {
                    console.log(err);
                    this.panellist = [];
                });
            }
            // console.log(item)
            // if (item && item.config) {
            //     let config = JSON.parse(item.config);
            //     let src = location.protocol + "//" + location.hostname + ":9008/home/runview?diagramId=" + config.digramid
            //     this.$store.commit('change_src', src);

            // } else {
            //     this.$store.commit('change_src', "");
            // }
        },
        changePage(page)
        {
            this.currentPage=page;
            if(this.floor)
            {
                this.LoadPanels(this.floor);
            }
        }
    }
}
</script>

<style lang="less" scoped>
.jiao {
    position: absolute;
    height: 0px;
    width: 0px;
    border-top: 7px solid transparent;
    border-right: 14px solid #091827;
    border-bottom: 8px solid transparent;
    left: -14px;
    // z-index: 7000;
    top: 50%;
    transform: translateY(-50%);
}

.box {
    height: calc(100% - 115px);
}

.leftmenu {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    max-height: 294px;
    box-sizing: border-box;
    border-left: 20px solid #183B70;
    z-index: 6007;
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 200px;
        max-height: 294px;
        background: rgba(7, 22, 37, 1);

        li {
            height: 58px;
            opacity: 0.5;
            border-bottom: 1px solid #183B70;
            text-align: center;
            line-height: 58px;
            font-size: 19px;
            cursor: pointer;
            position: relative;
        }

        li:last-of-type {
            border: 0;
        }

    }

}

.rightfloor {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    max-height: 500px;
    // min-height: 500px;
    box-sizing: border-box;
    // display: flex;
    flex-direction: column;

    &::-webkit-scrollbar {
        display: none;
    }

    padding-left: 50px;
    overflow: scroll;

    .cm {
        .mm {
            width: 22px;
            height: 4px;
            background: rgba(36, 62, 111, 1);
            margin: 14px 0;
            margin-right: 0;

            position: relative;

            &:hover {
                background: white;
            }

            .num {
                position: absolute;
                left: -33px;
                top: 50%;
                transform: translateY(-50%);
                color: #3897f4;
                font-size: 0.17rem;
                cursor: pointer;

                &:hover {
                    color: white;
                }
            }

        }

        .mm:nth-of-type(1),
        .mm:nth-of-type(3) {
            width: 30px;
        }

        .mm:nth-of-type(2),
        .mm:nth-of-type(4) {
            margin-left: 8px;
        }
    }
}



 .panellist {
        height:  calc(100% - 40px);
        overflow-y: auto;
        display: flex;
        // flex: 1 1;
        padding: 10px;
        justify-content:center;
        flex-wrap: wrap;
    }
    .page{
        text-align: center;
        height: 40px;
        & /deep/ .el-pagination{
            font-size: 12px;
        }
    }

.panellist /deep/ .box-card {
    margin: 10px 10px 0 0;

}
</style>
