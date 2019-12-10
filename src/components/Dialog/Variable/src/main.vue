<template>
<!-- 接收 paramEditVisibale 打开和关闭
   close 事件回调 -->
<el-dialog class="form" title="变量绑定" :visible.sync="paramEditVisibale" :modal-append-to-body="false" width="400px" center>
    <el-form ref="ruleForm" label-width="100px">
        <el-form-item label="IOserver" >
            <el-select v-model="selectServer" @change="serverChange" clearable class="select">
                <el-option v-for="item in ioservers" :value="item.ID" :label="item.Name" :key="item.ID">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="通道" >
            <el-select v-model="selectCha" @change="chalChange" class="select">
                <el-option v-for="item in channel" :value="item.ID" :label="item.Name" :key="item.ID">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="控制器" >
            <el-select v-model="selectControl" @change="controlChange" class="select">
                <el-option v-for="item in controller" :value="item.ID" :label="item.Name" :key="item.ID">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="变量">
            <el-select v-model="selectVar" class="select">
                <el-option v-for="item in vars" :value="item.ID" :label="item.Name" :key="item.ID">
                </el-option>
            </el-select>
        </el-form-item  >
          <el-form-item label="值" v-if="show">
            <el-input v-model="selectValue"></el-input>
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

    data() {
        return {
            paramEditVisibale: false,
            ioservers: [],
            channel: [],
            controller: [],
            vars: [],
            selectServer: "",
            selectCha: '',
            selectControl: '',
            selectVar: '',
            selectValue:'',
            diglogVisible: false,
            callback: null,
            prop: '',
            variable: '',
            show:false
        }
    },
    methods: {
        open(callback, prop, variable,show) {
            this.show=show;
            this.callback = callback;
            this.prop = prop;
            this.paramEditVisibale = true;
            this.$ajax.get(this.$URL + '/ioServer/GetIoServers').then((result) => {
                this.ioservers = [];
                if (result.status === 200 && result.data.success) {
                    this.ioservers = result.data.data;
                    if (variable && variable.indexOf(":") > 0 && variable.split(':').length === 4) {
                        this.variable = variable;
                        let Var = variable.split(':');
                        this.selectServer = Var[0];
                        this.loadEditVar(variable);
                    }
                }
            }).catch((err) => {
                this.ioservers = [];
            });

        },
        Close() {
            this.paramEditVisibale = false;
            if(this.show)
            {
              this.callback(this.prop, this.selectServer + ":" + this.selectCha + ":" + this.selectControl + ":" + this.selectVar,this.selectValue);
            }
            else
            {
             this.callback(this.prop, this.selectServer + ":" + this.selectCha + ":" + this.selectControl + ":" + this.selectVar);
            }
            this.callback = null;
            this.variable = '';
            this.prop = '';

        },
        serverChange(value) {
            this.selectCha = '';
            this.selectControl = '';
            this.selectVar = '';
            this.channel = [];
            this.controller = [];
            this.vars = [];
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
            this.controller = [];
            this.vars = [];
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
            this.vars = [];
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
        loadEditVar(variable) {
            let Var = variable.split(':');
            //通道
            this.$ajax.get(this.$URL + '/ioServer/GetChannels', {
                params: {
                    ioSvr: Var[0]
                },
            }).then((result) => {
                this.channel = [];
                if (result.status === 200 && result.data.success) {
                    this.channel = result.data.data;
                    this.selectCha = Var[1];
                    //控制器
                    this.$ajax.get(this.$URL + '/ioServer/GetController', {
                        params: {
                            ioSvr: Var[0],
                            chlKey: Var[1]
                        },
                    }).then((result) => {
                        this.controller = [];
                        if (result.status === 200 && result.data.success) {
                            this.controller = result.data.data;
                            this.selectControl = Var[2];
                            //变量
                            this.$ajax.get(this.$URL + '/ioServer/GetVariable', {
                                params: {
                                    ioSvr: Var[0],
                                    chlKey: Var[1],
                                    ctrlKey: Var[2]
                                },
                            }).then((result) => {
                                this.vars = [];
                                if (result.status === 200 && result.data.success) {
                                    this.vars = result.data.data;
                                    this.selectVar=Var[3]
                                }
                            })
                        }
                    })
                }
            });
        }

    }
}
</script>

<style scoped>
.select{
    width:100%;
}
.form /deep/ .el-dialog__footer {
    font-size: 12px;
}
</style>
