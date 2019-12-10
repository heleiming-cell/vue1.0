<template>
<div class="box">
    <el-row :gutter="10" style="height:100%;margin:0 5px;">
        <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20" class="livepanel">
            <div name='flex' v-for="r in rows" :key="r" class="panel">
                <!-- @mouseover="showPtz" @mouseout="hidePtz" -->
                <div class="col" :class="[(selectCol==c&&selectRow==r)?'active':'']" style="flex:1;" name="flex" v-for="c in cols" @contextmenu.prevent="stopVideo('h'+r+c,$event)" @click="videoClick(r,c,$event)" :key="c">
                    <video @dblclick="full($event)" class="h5video" v-bind:id="'h'+r+c" autoplay>
                        <!-- <video  @dblclick="full($event)" class="h5video" v-bind:id="'h'+((r-1)*(cols)+c)" autoplay> -->
                    </video>
                    <div class="ptz">
                        <div class="ptzbtn">
                            <div class="up">
                                <div>
                                    <el-button @mousedown.native="PtzAction('up','h'+r+c)" @mouseup.native="PtzAction('stop','h'+r+c)" type="primary" icon="el-icon-arrow-up" size="mini" circle></el-button>
                                </div>
                            </div>
                            <div class="mid">
                                <div>
                                    <el-button @mousedown.native="PtzAction('left','h'+r+c)" @mouseup.native="PtzAction('stop','h'+r+c)" type="primary" icon="el-icon-arrow-left" size="mini" circle></el-button>
                                </div>
                                <div>
                                    <el-button @mousedown.native="PtzAction('right','h'+r+c)" @mouseup.native="PtzAction('stop','h'+r+c)" type="primary" icon="el-icon-arrow-right" size="mini" circle></el-button>
                                </div>
                            </div>
                            <div class="down">
                                <div>
                                    <el-button @mousedown.native="PtzAction('down','h'+r+c)" @mouseup.native="PtzAction('stop','h'+r+c)" type="primary" icon="el-icon-arrow-down" size="mini" circle></el-button>
                                </div>
                            </div>
                        </div>
                        <div class="ptzzoom">
                            <div>
                                <el-button @mousedown.native="PtzAction('zoomin','h'+r+c)" @mouseup.native="PtzAction('stop','h'+r+c)" type="primary" icon="el-icon-plus" size="mini" circle></el-button>
                            </div>
                            <div>
                                <el-button @mousedown.native="PtzAction('zoomout','h'+r+c)" @mouseup.native="PtzAction('stop','h'+r+c)" type="primary" icon="el-icon-minus" size="mini" circle></el-button>
                            </div>

                        </div>
                        <div class="record">
                            <div>
                                <el-button @mousedown.native="snap('snap','h'+r+c)" type="primary" icon="el-icon-camera" size="mini" circle></el-button>
                            </div>
                            <div>
                                <el-button @mousedown.native="record('snap','h'+r+c)" type="primary" icon="el-icon-video-camera" size="mini" circle></el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4" class="camlist">
            <div class="filter">
                <el-input placeholder="查询设备" v-model="filterText">
                </el-input>
            </div>
            <el-tree node-key="key" ref="cam" :filter-node-method="filterNode" check-strictly @node-click="handleCheckChange" :data="data" :props="defaultProps"></el-tree>
            <div class="btngroup">
                <el-button-group>
                    <el-button type="primary" size="medium" @click="changePanel('1|1')">1x1</el-button>
                    <el-button type="primary" size="medium" @click="changePanel('2|2')">2x2</el-button>
                    <el-button type="primary" size="medium" @click="changePanel('3|3')">3x3</el-button>
                    <el-button type="primary" size="medium" @click="changePanel('4|4')">4x4</el-button>
                </el-button-group>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import '@/lib/h5splayer'
import {
    H5siOS,
    H5sPlayerCreate
} from '@/lib/h5splayerhelper'
import VAPI from '@/lib/videoapi'
export default {
    name: 'live',
    data() {
        return {
            rows: 2,
            cols: 2,
            selectCol: 1,
            selectRow: 1,
            map: new Map(),
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            data: null,
            filterText: '',
            panelid: 1,
            start:true,
        }
    },
    watch: {
        filterText(val) {
            this.$refs.cam.filter(val);
        }
    },
    mounted() {
        this.loadCam();
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        changePanel(val) {
            if (this.map.size > 0) { //清空视频，防止内存
                this.map.forEach((v, i) => {
                    v.disconnect();
                });
                this.map.clear();
                $("video").attr("src", "");
                $("video").attr("poster", "");
            }
            //  let data = $(event.target).data('row');
            let cols = val.split('|')[1];
            let rows = val.split('|')[0];
            // this.map.clear();
            Object.assign(this.$data, {
                rows: parseInt(rows),
                cols: parseInt(cols)
            });
        },
        videoClick(r, c, $event) {
            this.selectCol = c;
            this.selectRow = r;

        },
        loadCam() {
            let _this = this;
            var id = JSON.parse(sessionStorage.header).key || 0;
            this.$ajax.get(this.$URL + '/video/CamAll', {
                params: {
                    sysId: id
                }
            }).then(result => {
                if (result.status === 200 && result.data.status) {
                    this.data = result.data.data;
                }
            }).catch(error => {
                console.log(error);
            });
        },
        handleCheckChange(data, node, self) {

            if (data.token) {
                let vid = 'h' + this.selectRow + this.selectCol;
                let conf = {
                    videoid: vid,
                    protocol: window.location.protocol, //http: or https:
                    host: data.ip + ":" + data.port, //localhost:8080
                    rootpath: '/', // '/'
                    token: data.token,
                    hlsver: 'v1', //v1 is for ts, v2 is for fmp4
                    session: data.session //session got from login
                };
                if (this.map.has(vid)) {
                    let config = this.map.get(vid);
                    config.disconnect();
                    // H5sPlayerDelete(config)
                    this.map.delete(vid);
                }
                this.map.set(vid, H5sPlayerCreate(conf))
                this.map.get(vid).connect();
            }

        },
        stopVideo(id, event) {
            if (this.map.has(id)) {
                let config = this.map.get(id)
                config.disconnect();
                this.map.delete(config);
                event.target.src = "";
                event.target.poster = "";
            }
        },
        snap(action, domid) {
            let config = this.map.get(domid);
            if (config) {
                this.$ajax.get(this.$URL + '/video/SnapImage', {
                    params: {
                        host: config._conf.host,
                        token: config._token
                    }
                }).then(result => {
                    if (result.data.success) {
                        this.$message({
                            type: 'success',
                            message: '抓拍成功'
                        });
                    }
                });
            }
        },
        record(action, domid) {
            let config = this.map.get(domid);
            if (config) {
                this.$ajax.get(this.$URL + '/video/CamRecord', {
                    params: {
                        host: config._conf.host,
                        token: config._token,
                        tag:this.start?'ManualRecordStart':'ManualRecordStop'
                    }
                }).then(result => {
                    if (result.data.data.bStatus) {
                        this.start=false;
                        this.$message({
                            type: 'success',
                            message: result.data.data.strCode
                        });
                    }else
                    {
                       this.$message.error(result.data.data.strCode);
                    }
                });
            }
        },
        PtzAction(action, domid) {
            if (this.map.has(domid)) {
                let config = this.map.get(domid);
                VAPI.PtzAction(this, config._token, action, "http://" + config._conf.host, config._conf.session);
            }
            return;

        },
        full(element) {
            if (element.currentTarget.requestFullscreen) {
                element.currentTarget.requestFullscreen();
            } else if (element.currentTarget.mozRequestFullScreen) {
                element.currentTarget.mozRequestFullScreen();
            } else if (element.currentTarget.webkitRequestFullScreen) {
                element.currentTarget.webkitRequestFullScreen();
            }
        },

    },
    beforeRouteLeave(to, from, next) {
        if (this.map.size > 0) {
            this.map.forEach((v, i) => {
                v.disconnect();
            });
            this.map.clear();
        }
        next();
    }
}
</script>

<style lang="less" scoped>
.active {
    color: red;
}

.ptz {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 6000;
    border: 0 !important;

    div {
        border: 0 !important;
    }

    display: none;
    align-items: center;

    .ptzbtn {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        align-content: space-between;
        align-items: center;
        margin-right: 20px;

        .mid {
            display: flex;
            justify-content: space-between;

            div:nth-of-type(1) {
                margin-right: 20px;
            }
        }

    }

    .record {
        margin-left: 10px;
    }

}

.header {
    border-bottom: 1px solid rgba(33, 61, 112, 1);
}

div[name='flex'] {
    display: flex;
    position: relative;
    cursor: pointer;

}

video {
    height: 100%;
    width: 100%;

}

.active {
    background-color: black;
}

.h5video {
    object-fit: fill
}

.panel {
    height: 100%;
    box-sizing: border-box;

    &:nth-of-type(1) {
        margin-bottom: 10px;
    }

    div {
        border: 1px solid #0C3369;
        box-sizing: border-box;
    }

    .col {
        margin-right: 10px;
        background: #121013;

        &:hover .ptz {
            display: flex;
        }
    }

}

.livepanel {
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px !important;
}

.camlist {
    height: 100%;
    padding-top: 10px;
    background: #122c4a;
    background-clip: content-box;
    padding: 10px !important;
    position: relative;
    display: flex;
    flex-direction: column;

    // justify-content: space-between;
    .btngroup {
        text-align: center;
        align-self: center;
        background: #122c4a !important;
        width: 100%;
        height: 158px;
        display: flex;
        align-items: center;
        justify-content: center;

        & /deep/ button {
            background: #4773A4 !important;
        }
    }

    .filter {
        background: #122c4a;
        height: 95px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .filter /deep/ .el-input .el-input__inner {
        border-radius: 22px;
        background: #0a192b;
    }

}

.el-tree {
    // background: #ffffff14 !important;
    height: calc(100% - 253px);
    overflow-y: scroll;

}
</style>
