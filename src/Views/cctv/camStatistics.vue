<template>
<div class="ghy-box">
    <el-row class="itemlist">
        <el-row :gutter="10" class="vitemrow">
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="itemcol">
                <div class="item">
                    <div class="itemicon">
                        <i style="color:#347FEC" class="iconfont icon-cpu"></i>
                    </div>
                    <div class="itemdata">
                        <span class="itemcmd">{{params.strCPU}}</span>
                        <span class="itemdes">CPU</span>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="itemcol">
                <div class="item">
                    <div class="itemicon">
                        <i style="color:#F8BB7F" class="iconfont icon-iconset0449"></i>
                    </div>
                    <div class="itemdata">
                        <span class="itemcmd">{{params.strNetworkIn}}</span>
                        <span class="itemdes">Network In</span>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="itemcol">
                <div class="item">
                    <div class="itemicon">
                        <i style="color:#355FB1" class="iconfont icon-tubiaoshu "></i>
                    </div>
                    <div class="itemdata">
                        <span class="itemcmd">{{params.online}}</span>
                        <span class="itemdes">Online Cams</span>
                    </div>
                </div>
            </el-col>

        </el-row>
        <el-row :gutter="10" class="vitemrow">
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="itemcol">
                <div class="item">
                    <div class="itemicon">
                        <i style="color:#8EFAEF" class="iconfont icon-neicun"></i>
                    </div>
                    <div class="itemdata">
                        <span class="itemcmd">{{params.strMemory}}</span>
                        <span class="itemdes">Memory</span>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="itemcol">
                <div class="item">
                    <div class="itemicon">
                        <i style="color:#7F99F8" class="iconfont icon-iconset0449-copy"></i>
                    </div>
                    <div class="itemdata">
                        <span class="itemcmd">{{params.strNetworkOut}}</span>
                        <span class="itemdes">Network out</span>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="itemcol">
                <div class="item">
                    <div class="itemicon">
                        <i style="color:#8EFAEF" class="iconfont icon-jiankong "></i>
                    </div>
                    <div class="itemdata">
                        <span class="itemcmd">{{params.total}}</span>
                        <span class="itemdes">Total Cams</span>
                    </div>
                </div>
            </el-col>

        </el-row>
        <el-row :gutter="10" class="vitemrow">
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="itemcol">
                <div class="item">
                    <div class="itemicon">
                        <i style="color:#34C3EC" class="iconfont icon-21"></i>
                    </div>
                    <div class="itemdata">
                        <span class="itemcmd">{{params.strRunTime}}</span>
                        <span class="itemdes">Running</span>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="itemcol">
                <div class="item">
                    <div class="itemicon">
                        <i style="color:#255BAC" class="iconfont icon-loudou"></i>
                    </div>
                    <div class="itemdata">
                        <span class="itemcmd">{{params.strFreeSpace}}</span>
                        <span class="itemdes">Free Space</span>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="itemcol">
                <div class="item">
                    <div class="itemicon">
                        <i style="color:#AD94F4" class="iconfont icon-tubiao"></i>
                    </div>
                    <div class="itemdata">
                        <span class="itemcmd">{{params.strTotalSpace}}</span>
                        <span class="itemdes">Total Space</span>
                    </div>
                </div>
            </el-col>

        </el-row>
    </el-row>

</div>
</template>

<script>
export default {
    name: 'live',
    data() {
        return {
            params: {
                strCPU: '',
                strNetworkIn: '',
                strNetworkOut: '',
                strMemory: '',
                strRunTime: '',
                strFreeSpace: '',
                online: 0,
                total: 0,
                strTotalSpace: '',
                timeTick: null,
                // stop:false,
            }
        }
    },
    mounted() {
        this.loadRunInfo();
        this.GetSrcInfo();
    },

    methods: {
        loadRunInfo() {
            if (this.timeTick) {
                clearTimeout(this.timeTick);
                this.timeTick=null;
            }
            let root = window.location.protocol + '//' + window.location.hostname + ":8083"
            let url = root + '/api/v1/GetRunInfo?session=null'
            this.$ajax.get(url).then(result => {
                if (result.status === 200 && result.data) {
                    Object.assign(this.params, result.data);
                    // if(!this.stop)
                    this.timeTick = setTimeout(this.loadRunInfo, 5000);
                }
            }).catch(error => {
                console.log()
            })

        },
        GetSrcInfo() {
            let _this = this;
            let root = window.location.protocol + '//' + window.location.hostname + ":8083"
            var url = root + "/api/v1/GetSrc?session=null";
            this.$ajax.get(url).then(result => {
                if (result.status == 200) {
                    var data = result.data;
                    _this.params.total = data.src.length;
                    _this.params.online = 0;
                    for (var i = 0; i < data.src.length; i++) {
                        var item = data.src[i];
                        if (item['bOnline']) {
                            _this.params.online++;
                        }
                    }
                }
            }).catch(error => {
                console.log('GetSrc', error);
            });
        },
        

    },
    beforeRouteLeave(to, from, next) {
            if (this.timeTick) {
                clearTimeout(this.timeTick);
                this.timeTick=null;
                // this.stop=true;
            }
            next();
        }

}
</script>

<style lang="less" scoped>
.itemlist {
    height: calc(100% - 20px);
    margin: 0 5px;
    padding: 10px 0;

    .vitemrow {
        height: 33.33%;
    }

    .vitemrow:nth-of-type(2) {
        margin-top: 10px;
        margin-bottom: 10px;
    }

}

.itemcol {
    height: 100%;

    .item {
        height: 100%;
        width: 100%;
        display: flex;
        flex: 1 1;
        align-items: center;
        justify-content: space-between;
        border: 1px solid rgba(53, 95, 177, 1);
        padding: 0 76px 0 52px;
        overflow: hidden;

        .itemicon {
            i {
                font-size: 121px !important;
            }
        }

        .itemdata {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

        }
    }
}

.item {
    .itemcmd {
        font-size: 38px;
        line-height: 38px;
        color: #B0D4FB;
    }

    .itemdes {
        font-size: 21px;

        line-height: 64px;
    }
}
</style>
