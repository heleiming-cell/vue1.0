<template>
<!-- 接收 paramEditVisibale 打开和关闭
   close 事件回调 -->
<el-dialog title="变量绑定" :visible.sync="paramEditVisibale" :modal-append-to-body="false" width="400px" center class="videoDialog">
    <el-form ref="ruleForm" label-width="100px">
        <el-form-item label="视频服务器" prop="name">
            <el-select style="width:100%" @change="serverSelectChange" v-model="server">
                <el-option v-for="item in servers" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="摄像机" prop="name">
            <el-select style="width:100%" v-model="cam">
                <el-option v-for="item in cams" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Close">确 定</el-button>
        </span>
</el-dialog>
</template>

<script>
export default {
    name: 'VariableDiglog',
    // props: ['paramEditVisibale', 'linkProp'],

    data() {
        return {
            paramEditVisibale: false,
            server: '',
            cam: '',
            servers: [],
            cams: [],
            callback: null,
            prop: '',
        }
    },
    methods: {
        open(callback, prop) {
            this.paramEditVisibale = true;
            this.callback = callback;
            this.prop = prop;
            this.$ajax.get(this.$URL + '/video/LoadServerName').then((result) => {
                if (result.status === 200 & result.data.success) {
                    this.servers = result.data.data;
                    return;
                }
                this.servers = [];
            }).catch((err) => {
                console.log(err);
                this.servers = [];
            });
        },
        Close() {
            this.paramEditVisibale = false;
            this.callback(this.server + '|' + this.cam, this.prop);
        },
        serverSelectChange(value) {
            this.$ajax.get(this.$URL + '/video/LoadCamByServer?sid=' + value.split("|")[0]).then((result) => {
                if (result.status === 200 & result.data.success) {
                    this.cams = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
                this.cams = [];
            });
        },

    }
}
</script>

<style lang="less" scoped>
.videoDialog /deep/ .el-dialog__footer {
    font-size: 12px;
}
</style>
