<template>
<el-dialog class="dialog" title="变量绑定" :visible.sync="diglogVisible" :modal-append-to-body="false" width="400px" center>
    <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="IOserver">
            <el-select clearable v-model="config.selectServer" style="width:100%" @change="serverChange">
                <el-option v-for="item in ioservers" :value="item.ID.toString()" :label="item.Name" :key="item.ID">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="通道">
            <el-select clearable v-model="config.selectCha" @change="chalChange" style="width:100%">
                <el-option v-for="item in channel" :value="item.ID.toString()" :label="item.Name" :key="item.ID">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="控制器">
            <el-select clearable v-model="config.selectControl" @change="controlChange" style="width:100%">
                <el-option v-for="item in controller" :value="item.ID.toString()" :label="item.Name" :key="item.ID">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="变量">
            <el-select multiple collapse-tags v-model="config.selectVar" style="width:100%">
                <el-option v-for="item in vars" :value="item.ID+'|'+item.Name" :label="item.Name" :key="item.ID">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备类型">
            <el-select v-model="config.devicetype" style="width:100%">
                <el-option label="电" value="1">
                </el-option>
                <el-option label="水" value="2">
                </el-option>
                <el-option label="气" value="3">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备名称">
            <el-input v-model="deviceName"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="Close">确 定</el-button>
        </span>
</el-dialog>
</template>

<script>
export default {
    name: 'diagramDialog',
  
    computed: {
        deviceName() {
            
            let names = [];
            this.config.selectVar.forEach((v, i) => {
                names.push(v.split('|')[1]);
            })
            return names.toString();
        }

    },
    data() {
        return {
            servers: [], //视频服务器
            cams: [],
            diglogVisible: false,
            data: null,
            defaultProps: {
                children: 'children',
                label: 'label',
                isLeaf: 'isLeaf'
            },
            count: 0,
            diagrams: [],
            page: 1,
            nodeid: 0,
            callback: null,
            ioservers: [],
            channel: [],
            controller: [],
            vars: [],
            config: {
                devicetype: '',
                selectVar: [],
                selectCha: '',
                selectControl: '',
                selectServer: "",
            }
        }
    },

    methods: {
        open(callback,data) {
            
            // this.type = type;
            this.callback = callback;
            this.diglogVisible = true;
            this.loadioserver();
            if(data)//编辑模式
            {
                this.loadioserver();
                
            }
        },
        controlChange(value) {
            this.config.selectVar = [];
            this.vars = [];
            if (this.config.selectServer && this.config.selectCha && this.config.selectControl) {
                this.$ajax.get(this.$URL + '/ioServer/GetVariable', {
                    params: {
                        ioSvr: this.config.selectServer,
                        chlKey: this.config.selectCha,
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
        Close() {
            let _this=this;
            Object.assign(this.config,{name:_this.deviceName})
            this.callback(this.config);
            this.diglogVisible = false;
        },
        chalChange(value) {
            this.config.selectControl = '';
            this.config.selectVar = [];
            this.controller = [];
            this.vars = [];
            if (this.config.selectServer) {
                this.$ajax.get(this.$URL + '/ioServer/GetController', {
                    params: {
                        ioSvr: this.config.selectServer,
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
        serverChange(value) {
            this.config.selectCha = '';
            this.config.selectControl = '';
            this.config.selectVar = [];
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
        pageChange(page) {
            let _this = this;
            this.page = page;
            this.loadDiagram(8, _this.page, _this.nodeid);
        },
        nodeClick(obj, node, _tree) {
            let _this = this;
            this.nodeid = obj.key;
            this.loadDiagram(8, _this.page, obj.key);
        },
        clickDiagram(id) {
            this.callback(id);
            this.diglogVisible = false;
        },
        loadDiagram(len, page, category) {
            this.$ajax.get(this.$URL + '/diagram/GetAllDiagram?len=' + len + '&page=' + page + '&category=' + category).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.count = result.data.count;
                    console.log(result.data.data)
                    this.diagrams = result.data.data;
                }
            }).catch((err) => {

            });
        },

        loadioserver() {
            this.$ajax.get(this.$URL + '/ioServer/GetIoServers').then((result) => {
                this.ioservers = [];
                if (result.status === 200 && result.data.success) {
                    this.ioservers = result.data.data;
                }
            }).catch((err) => {
                this.ioservers = [];
            });
        }
    }
}
</script>

<style lang="less" scoped>
.dialog /deep/ .el-dialog__footer {
    font-size: 12px;
}
</style>
