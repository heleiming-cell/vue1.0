<template>
<div class="box">
    <el-row :gutter="10" style="height:100%;margin:0 5px;">
        <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20" class="livepanel">
            <div name='flex' class="panel">
                <img :src="img" v-show="img" height="100%" width="100%"/>
                <video :src="video" controls="controls" v-show="video" autoplay="autoplay">
                    your browser does not support the video tag
                </video>
            </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4" class="camlist">
            <div class="filter">
                <el-input placeholder="查询设备" v-model="filterText">
                </el-input>
            </div>
            <el-tree node-key="key" ref="cam" :filter-node-method="filterNode" check-strictly @node-click="handleCheckChange" :data="data" :props="defaultProps"></el-tree>
            <!-- <div class="btngroup">
                <el-button-group>
                    <el-button type="primary" size="medium" @click="changePanel('1|1')">1x1</el-button>
                    <el-button type="primary" size="medium" @click="changePanel('2|2')">2x2</el-button>
                    <el-button type="primary" size="medium" @click="changePanel('3|3')">3x3</el-button>
                    <el-button type="primary" size="medium" @click="changePanel('4|4')">4x4</el-button>
                </el-button-group>
            </div> -->
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
            img: '',
            video: ''
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
        loadCam() {
            let _this = this;
            var id = JSON.parse(sessionStorage.header).key || 0;
            this.$ajax.get(this.$URL + '/video/CamAllRecord', {
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
            if (data.type == 1) {
                this.img='';
                this.video=data.host;
            }
            if (data.type == 0) {
                this.video='';
                this.img=data.host;
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
    border: 1px solid #0C3369;
    // &:nth-of-type(1) {
    //     margin-bottom: 10px;
    // }

    // div {
    //     border: 1px solid #0C3369;
    //     box-sizing: border-box;
    // }

    // .col {
    //     margin-right: 10px;
    //     background: #121013;

    //     &:hover .ptz {
    //         display: flex;
    //     }
    // }

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
