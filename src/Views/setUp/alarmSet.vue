<template>
<el-row :gutter="10" class="h100" style="margin:0">
    <el-col :xs="12" :sm="12" :md="4" :lg="4" class="h100 vartree">
        <el-tree node-key="key" ref="tree" show-checkbox :load="loadNode" lazy @check-change="handleCheckChange" :data="data" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="12" :sm="12" :md="20" :lg="20" class="h100 config">
        <el-row type="flex" justify="start" class="itemrow" align="middle">
            <el-col :xs="24" :sm="24" :md="6" :lg="6">
                <span>超低报警</span>
            </el-col>
            <el-col :xs="24" :sm="24" :md="6" :lg="6">
                <el-checkbox v-model="config.AlarmLLEnable">是否启用</el-checkbox>
            </el-col>
            <el-col :xs="24" :sm="24" :md="6" :lg="6">
                级别: <el-select size="mini" v-model="config.AlarmLevelLL">
                    <el-option v-for="item in levevs" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
            <el-col :xs="24" :sm="24" :md="6" :lg="6">
                阀值: <el-input size="mini" v-model="config.AlarmLL"></el-input>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center" class="itemrow" align="middle">
            <el-col :xs="12" :sm="12" :md="6" :lg="6">
                <span>超高报警</span>
            </el-col>
            <el-col :xs="12" :sm="12" :md="6" :lg="6">
                <el-checkbox v-model="config.AlarmHHEnable">是否启用</el-checkbox>
            </el-col>
            <el-col :xs="12" :sm="12" :md="6" :lg="6">
                级别: <el-select size="mini" v-model="config.AlarmLevelHH">
                    <el-option v-for="item in levevs" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
            <el-col :xs="12" :sm="12" :md="6" :lg="6">
                阀值: <el-input v-model="config.AlarmHH" size="mini"></el-input>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center" class="itemrow" align="middle">
            <el-col :xs="12" :sm="12" :md="6" :lg="6">
                <span>底限报警</span>
            </el-col>
            <el-col :xs="12" :sm="12" :md="6" :lg="6">
                <el-checkbox v-model="config.AlarmLEnable">是否启用</el-checkbox>
            </el-col>
            <el-col :xs="12" :sm="12" :md="6" :lg="6">
                级别: <el-select v-model="config.AlarmLevelL" size="mini">
                    <el-option v-for="item in levevs" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
            <el-col :xs="12" :sm="12" :md="6" :lg="6">
                阀值: <el-input size="mini" v-model="config.AlarmL"></el-input>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center" class="itemrow" align="middle">
            <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <span>高限报警</span>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <el-checkbox v-model="config.AlarmHEnable">是否启用</el-checkbox>
            </el-col>
            <el-col :xs="12" :sm="12" :md="6" :lg="6">
                级别: <el-select size="mini" v-model="config.AlarmLevelH">
                    <el-option v-for="item in levevs" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
            <el-col :xs="12" :sm="12" :md="6" :lg="6">
                阀值: <el-input size="mini" v-model="config.AlarmH"></el-input>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center" class="itemrow" align="middle">
            <el-col :xs="12" :sm="12" :md="4" :lg="2">
                <span>状态报警</span>
            </el-col>
            <el-col :xs="12" :sm="12" :md="4" :lg="4">
                级别: <el-select size="mini" v-model="config.AlarmLevelST" style="width:60%">
                    <el-option v-for="item in levevs" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-col>
            <el-col :xs="12" :sm="12" :md="4" :lg="4">
                <el-checkbox v-model="config.AlarmST0">状态0</el-checkbox>
            </el-col>
            <el-col :xs="12" :sm="12" :md="4" :lg="4">
                <el-checkbox v-model="config.AlarmST1">状态1</el-checkbox>
            </el-col>
            <el-col :xs="12" :sm="12" :md="4" :lg="4">
                <el-checkbox v-model="config.AlarmST2">状态2</el-checkbox>
            </el-col>
            <el-col :xs="12" :sm="12" :md="4" :lg="4">
                <el-checkbox v-model="config.AlarmST3">状态3</el-checkbox>
            </el-col>

        </el-row>
        <el-row type="flex" justify="center" class="link" align="middle">
            <el-col :xs="12" :sm="12" :md="4" :lg="4">
                <span>联动配置</span>
            </el-col>
            <el-col :xs="12" :sm="12" :md="20" :lg="20">
                <el-row type="flex" justify="center" class="link" align="middle">
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" class="linkitem">
                        联动视频1 &nbsp;<el-input v-model="config.AssociateVideo" size="mini">
                            <el-button @click="openVideo('AssociateVideo')" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" class="linkitem">
                        联动视频2 &nbsp;<el-input v-model="config.AssociateVideo2" size="mini">
                            <el-button @click="openVideo('AssociateVideo2')" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" class="linkitem">
                        联动动作1 &nbsp;<el-input v-model="config.Action1" size="mini" suffix-icon="el-icon-search"></el-input>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" class="link" align="middle">
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" class="linkitem">
                        联动动作2 &nbsp;<el-input size="mini" v-model="config.Action2" suffix-icon="el-icon-search"></el-input>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" class="linkitem">
                        联动地图1 &nbsp;<el-input size="mini" v-model="config.AssociateForm">
                            <el-button @click="openDiagram('AssociateForm')" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" class="linkitem">
                        联动地图2 &nbsp;<el-input size="mini" v-model="config.AssociateForm2">
                            <el-button @click="openDiagram('AssociateForm2')" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" class="link" align="middle">
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" class="linkitem">
                        手机号码1 &nbsp;<el-input size="mini" v-model="config.Phone"></el-input>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" class="linkitem">
                        <el-checkbox v-model="config.EnableRecord">联动录像</el-checkbox>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="8" class="linkitem">
                        <el-checkbox v-model="config.EnableSnap">联动抓拍</el-checkbox>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center" class="link" align="middle">
            <el-button type="primary" @click="saveConfig">保存配置</el-button>
        </el-row>
    </el-col>
    <!-- </el-col>
    </el-col> -->
</el-row>
</template>

<script>
import {alarm} from '@/lib/configParmas'
import Diagram from '@/Views/diagramBind/src'
import video from '@/components/Dialog/video/src'
export default {
    name: 'alarmset',
    data() {
        return {
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            config: new alarm(),
            levevs: [{
                    label: '普通',
                    value: '1'
                }, {
                    label: '紧急',
                    value: '2'
                },
                {
                    label: '严重',
                    value: '3'
                }
            ],
            FormName: 'AssociateForm', //默认地图1

        }
    },
    methods: {
        loadNode(node, resolve) {
            if (node.level === 0) {
                let nodes = [];
                this.$ajax.get(this.$URL + '/ioServer/GetIoServers').then((result) => {
                    if (result.status === 200 && result.data.success) {
                        if (result.data.data.length > 0) {
                            result.data.data.forEach((v, i) => {
                                nodes.push({
                                    label: v.Name,
                                    key: v.ID
                                });
                            });
                            return resolve(nodes);
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            } else if (node.level === 1) {
                let nodes = [];
                this.$ajax.get(this.$URL + '/ioServer/GetChannels', {
                    params: {
                        ioSvr: node.key
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        if (result.data.data.length > 0) {
                            result.data.data.forEach((v, i) => {
                                nodes.push({
                                    label: v.Name,
                                    key: node.key + '|' + v.ID
                                });
                            });
                            return resolve(nodes);
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            } else if (node.level === 2) {
                let nodes = [];
                this.$ajax.get(this.$URL + '/ioServer/GetController', {
                    params: {
                        ioSvr: node.key.split('|')[0],
                        chlKey: node.key.split('|')[1],
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        if (result.data.data.length > 0) {
                            result.data.data.forEach((v, i) => {
                                nodes.push({
                                    label: v.Name,
                                    key: node.key + '|' + v.ID
                                });
                            });
                            return resolve(nodes);
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            } else if (node.level === 3) {
                let nodes = [];
                this.$ajax.get(this.$URL + '/ioServer/GetVariable', {
                    params: {
                        ioSvr: node.key.split('|')[0],
                        chlKey: node.key.split('|')[1],
                        ctrlKey: node.key.split('|')[2]
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        if (result.data.data.length > 0) {
                            result.data.data.forEach((v, i) => {
                                nodes.push({
                                    label: v.Name,
                                    key: node.key + '|' + v.ID
                                });
                            });
                            return resolve(nodes);
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                });
            } else if (node.level === 4) {
                return resolve([]);
            }

        },
        handleCheckChange(node, status) {
            if (status) {
                let nodes = this.$refs.tree.getCheckedNodes();
                if (nodes.length === 1 && nodes[0].key.indexOf('|') > 0 && nodes[0].key.split('|').length === 4) {
                    this.$ajax.get(this.$URL + '/alarm/GetVarProperties', {
                        params: {
                            data: nodes[0].key
                        }
                    }).then((result) => {
                        if (result.status === 200 && result.data.success) {
                            this.config = result.data.data;
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    this.config = new alarm();
                }
            } else {
                let nodes = this.$refs.tree.getCheckedNodes();
                if (nodes.length === 0) {
                    this.config = new alarm();
                }
            }
        },
        saveConfig() {
            let nodes = this.$refs.tree.getCheckedNodes();
            if (nodes.length > 0) {
                let vars = [];
                nodes.forEach((v, i) => {
                    if (v.key.indexOf('|') > 0 && v.key.split('|').length === 4) {
                        vars.push(v.key);
                    }
                });
                if (vars.length > 0) {
                    this.$ajax.post(this.$URL + '/alarm/PublishAlarm', this.$QS.stringify({
                        array: vars,
                        config: JSON.stringify(this.config).toString(),
                    })).then((result) => {
                        if (result.status === 200 && result.data.success) {
                            this.$message({
                                type: 'success',
                                message: '配置成功'
                            });
                            return;
                        }
                        this.$message.error("配置失败");
                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    this.$message.error("请先选择变量节点");
                    return;
                }
            } else {
                this.$message.error("请先选择变量节点");
                return;
            }
        },
        setDiagram(id) {
            this.config[this.FormName] = id
        },
        setVideo(val, prop) {
            console.log(prop);
            this.config[prop] = val;
        },
        openDiagram(name) {
            this.FormName = name;
            Diagram.newInstance().diagram.open(this.setDiagram);
        },
        openVideo(name) {
            video.newInstance().diagram.open(this.setVideo, name);
        }
    },
}
</script>

<style lang="less" scoped>
.vartree {
    background: #131D34;
    overflow-y: auto;
}

.config {
    overflow-y: auto;
}

.itemrow {
    // height: 40px;
    background: #131D34;
    padding: 10px 15px;
    margin-bottom: 22px;

    & /deep/ .el-input {
        width: 60%;
    }

    & /deep/ .el-select .el-input {
        width: 100%;
    }

    span {
        color: #5E89D0;
        font-size: 12px;
    }
}

.link {
    background: #131D34;
    padding: 10px 15px;

    & /deep/ .el-input {
        width: 60%;
    }

    .linkitem {
        margin-bottom: 15px;
        display: flex;
        align-items: center
    }
}
</style>
