<template>
<!-- 接收 paramEditVisibale 打开和关闭
   close 事件回调 -->
<el-dialog class="form" @opened="opened" :title="title" @close="Close" :visible.sync="paramEditVisibale" :modal-append-to-body="false" width="600px">
    <video  class="h5video" id="gisv1" autoplay>

    </video>
    <div class="ptz">
        <div class="ptzbtn">
            <div class="up">
                <div>
                    <el-button @mousedown.native="PtzAction('up')" @mouseup.native="PtzAction('stop')" type="primary" icon="el-icon-arrow-up" size="mini" circle></el-button>
                </div>
            </div>
            <div class="mid">
                <div>
                    <el-button @mousedown.native="PtzAction('left')" @mouseup.native="PtzAction('stop')" type="primary" icon="el-icon-arrow-left" size="mini" circle></el-button>
                </div>
                <div>
                    <el-button @mousedown.native="PtzAction('right')" @mouseup.native="PtzAction('stop')" type="primary" icon="el-icon-arrow-right" size="mini" circle></el-button>
                </div>
            </div>
            <div class="down">
                <div>
                    <el-button @mousedown.native="PtzAction('down')" @mouseup.native="PtzAction('stop')" type="primary" icon="el-icon-arrow-down" size="mini" circle></el-button>
                </div>
            </div>
        </div>
        <div class="ptzzoom">
            <div>
                <el-button @mousedown.native="PtzAction('zoomin')" @mouseup.native="PtzAction('stop')" type="primary" icon="el-icon-plus" size="mini" circle></el-button>
            </div>
            <div>
                <el-button @mousedown.native="PtzAction('zoomout')" @mouseup.native="PtzAction('stop')" type="primary" icon="el-icon-minus" size="mini" circle></el-button>
            </div>
        </div>
    </div>
</el-dialog>
</template>

<script>
import '@/lib/h5splayer'
import {
    H5siOS,
    H5sPlayerCreate
} from '@/lib/h5splayerhelper'
import VAPI from '@/lib/videoapi'
export default {
    name: 'VariableDiglog',

    data() {
        return {
            paramEditVisibale: false,
            title: '',
            callback: null,
            conf: null,
            url: '',
        }
    },
    methods: {
        open(url, callback) {
            this.paramEditVisibale = true;
            this.callback = callback;
            this.url = url;

        },
        Close() {
            this.paramEditVisibale = false;
            if (this.conf) {
                this.conf.disconnect();
                this.conf = null;
            }
            this.callback();
            this.callback = null;
            this.url = '';
        },
        opened() {
            if (this.url) {
                //56|171.221.238.16|8075|c1782caf-b670-42d8-ba90-2244d0b0ee83|10|室外球机
                let config = this.url.split('|');
                let server = config[1];
                let port = config[2];
                let session = config[3];
                let token = config[4];
                this.title = config[5];
                let conf = {
                    videoid: 'gisv1',
                    protocol: window.location.protocol, //http: or https:
                    host: server + ":" + port, //localhost:8080
                    rootpath: '/', // '/'
                    token: token,
                    hlsver: 'v1', //v1 is for ts, v2 is for fmp4
                    session: session //session got from login
                };
                this.conf = H5sPlayerCreate(conf);
                this.conf.connect();
            }
        },
        PtzAction(action) {
            // 61|112.19.169.2|2500||0159|2F-C-车道朝A区球机
            if (this.url) {
             
                VAPI.PtzAction(this, this.url.split('|')[4], action, "http://" + this.url.split('|')[1]+":"+this.url.split('|')[2], this.url.split('|')[3]);
            }
            return;

        },
    }
}
</script>

<style lang="less" scoped>
.h5video {
    width: 100%;
    height: 100%;
    position: relative;
}

.form /deep/ .el-dialog__footer {
    font-size: 12px;
}

.form /deep/ .el-dialog__body {
    padding: 5px !important;

    &:hover .ptz {
        display: flex;
    }
}

.ptz {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 6008;
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

}
</style>
