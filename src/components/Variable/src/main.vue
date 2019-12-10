<template>
  <!-- 接收 paramEditVisibale 打开和关闭
   close 事件回调 -->
<el-dialog @close="Close"  @open="open" title="变量绑定" :visible.sync="paramEditVisibale" :modal-append-to-body="false" width="400px" center>
    <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="IOserver">
            <el-select v-model="selectServer" @change="serverChange">
                <el-option v-for="item in ioservers" :value="item.ID" :label="item.Name" :key="item.ID">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="通道">
            <el-select v-model="selectCha" @change="chalChange">
                <el-option v-for="item in channel" :value="item.ID" :label="item.Name" :key="item.ID">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="控制器">
            <el-select v-model="selectControl" @change="controlChange">
                <el-option v-for="item in controller" :value="item.ID" :label="item.Name" :key="item.ID">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="变量">
            <el-select v-model="selectVar">
                <el-option v-for="item in vars" :value="item.ID" :label="item.Name" :key="item.ID">
                </el-option>
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
    props: ['paramEditVisibale','linkProp'],
  
    data() {
        return {
            ioservers: [],
            channel: [],
            controller: [],
            vars: [],
            selectServer: "",
            selectCha: '',
            selectControl: '',
            selectVar: '',
            diglogVisible: false
        }
    },
    methods: {
        open() {
            this.$ajax.get(this.$URL + '/ioServer/GetIoServers').then((result) => {
                this.ioservers = [];
                if (result.status === 200 && result.data.success) {
                    this.ioservers = result.data.data;
                }
            }).catch((err) => {
                this.ioservers = [];
            });
        },
        Close() {
            this.$emit('close', false,this.selectServer+":"+this.selectCha+":"+this.selectControl+":"+this.selectVar,this.linkProp);
        },
        serverChange(value) {
            this.selectCha = '';
            this.selectControl = '';
            this.selectVar = '';
            this.channel=[];this.controller=[];this.vars=[];
            this.$ajax.get(this.$URL + '/ioServer/GetChannels', {
                params: {
                    ioSvr: value
                },
            }).then((result) => {
                this.channel = [];
                if (result.status === 200 && result.data.success) {
                    this.channel = result.data.data;
                }
            }).catch((err) => {
                this.channel = [];
                this.$message.error(err);
            });
        },
        chalChange(value) {
            this.selectControl = '';
            this.selectVar = '';
            this.controller=[];this.vars=[];
            if (this.selectServer) {
                this.$ajax.get(this.$URL + '/ioServer/GetController', {
                    params: {
                        ioSvr: this.selectServer,
                        chlKey: value
                    },
                }).then((result) => {
                    this.controller = [];
                    if (result.status === 200 && result.data.success) {
                        this.controller = result.data.data;
                    }
                }).catch((err) => {
                    this.controller = [];
                    this.$message.error(err);
                });
            }
        },
        controlChange(value) {
            this.selectVar = '';
            this.vars=[];
            if (this.selectServer && this.selectCha && this.selectControl) {
                this.$ajax.get(this.$URL + '/ioServer/GetVariable', {
                    params: {
                        ioSvr: this.selectServer,
                        chlKey: this.selectCha,
                        ctrlKey: value
                    },
                }).then((result) => {
                    this.vars = [];
                    if (result.status === 200 && result.data.success) {
                        this.vars = result.data.data;
                    }
                }).catch((err) => {
                    this.vars = [];
                    this.$message.error(err);
                });
            }
        },
       

    }
}
</script>
