<template>
<div class="ghy-box">
    <el-row :gutter="10" style="height:100%;margin:0 5px;">
        <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4" class="Terminallist">
            <!-- <div class="filter">
                <el-input placeholder="查询终端" v-model="filterText">
                </el-input>
            </div> -->
            <el-tree show-checkbox node-key="key" ref="tree" :filter-node-method="filterNode" @node-click="handleCheckChange" :data="data" :props="defaultProps"></el-tree>
        </el-col>
        <el-col :xs="24" :sm="24" :md="20" :lg="20" :xl="20" class="h100">
            <div class="template">
                <el-form :inline="true">
                    <el-form-item label="模板选择">
                        <el-select size="small" v-model="template">
                            <el-option v-for="(item,i) in templates" :key="i" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
             <!-- <vue-editor v-model="content" class="editor" v-show="template==2"></vue-editor> -->
            <!-- <quill-editor v-model="content" class="editor"></quill-editor> -->
            <el-input v-show="template==1" v-model="content" type="textarea" rows="10"></el-input>
            <div class="btn">
                <el-button type="success" @click="send">发送</el-button>
                <el-button type="success" @click="sendAll">群发</el-button>
            </div>
        </el-col>

    </el-row>
</div>
</template>

<script>

// import { VueEditor, Quill } from "vue2-editor"

export default {
    name: "live",
    components: {
        // VueEditor
    },
    data() {
        return {
            selectCol: 1,
            selectRow: 1,
            map: new Map(),
            defaultProps: {
                children: "children",
                label: "label"
            },
            data: null,
            filterText: "",
            template: "1",
            templates: [{
                    label: "纯文本",
                    value: "1"
                },
                // {
                //     label: "HTML文本",
                //     value: "2"
                // },
                // {
                //     label: "模板3",
                //     value: "3"
                // },
                // {
                //     label: "模板4",
                //     value: "4"
                // }
            ],
            content: ""
        };
    },
    watch: {
        filterText(val) {
            this.$refs.cam.filter(val);
        }
    },
    mounted() {
        this.loadTerminal();
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        loadTerminal() {
            let _this = this;
            this.$ajax
                .get(this.$URL + "/info/GetAreaTerminal")
                .then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.data = result.data.data;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        handleCheckChange(data, node, self) {
            if (data.token) {
                let vid = "h" + this.selectRow + this.selectCol;
                let conf = {
                    videoid: vid,
                    protocol: window.location.protocol, //http: or https:
                    host: data.ip + ":" + data.port, //localhost:8080
                    rootpath: "/", // '/'
                    token: data.token,
                    hlsver: "v1", //v1 is for ts, v2 is for fmp4
                    session: data.session //session got from login
                };
                if (this.map.has(vid)) {
                    let config = this.map.get(vid);
                    config.disconnect();
                    // H5sPlayerDelete(config)
                    this.map.delete(vid);
                }
                this.map.set(vid, H5sPlayerCreate(conf));
                this.map.get(vid).connect();
            }
        },
        sendAll() {
            this.$ajax
                .post(
                    "http://" + window.location.hostname + ":9005/api/PushMessage",
                    this.$QS.stringify({
                        tid: JSON.stringify([]),
                        msg: this.content,
                        templateid: this.template
                    })
                )
                .then(result => {
                    let _this = this;
                    if (result.status === 200 && result.data.success) {
                        if (result.data.data) {
                            let all = true;
                            result.data.data.forEach((v, i) => {
                                if (!v.Value) {
                                    all = false
                                    _this.$message.error("终端:" + v.Key + "发送失败");
                                }
                            });
                            if (all) {
                                _this.$message({
                                    type: 'success',
                                    message: '全部发送成功'
                                });
                            }
                        } else {
                            _this.$message.error("发送失败");
                        }
                    }
                })
                .catch(err => {
                    _this.$message.error("发送失败");
                    console.log(err);
                });
        },
        send() {
            let nodes = this.$refs.tree.getCheckedNodes();
            if (nodes.length === 0) {
                this.$message.error("请选择终端发送");
                return;
            }
            let ids = [];
            nodes.forEach((v, i) => {
                if (v.uuid) {
                    ids.push(v.uuid);
                }
            });
            this.$ajax
                .post(
                    "http://" + window.location.hostname + ":9005/api/PushMessage",
                    this.$QS.stringify({
                        tid: ids,
                        msg: this.content,
                        templateid: this.template
                    })
                )
                .then(result => {
                    let _this = this;
                    if (result.status === 200 && result.data.success) {
                        if (result.data.data) {
                            result.data.data.forEach((v, i) => {
                                if (!v.Value) {
                                    _this.$message.error("终端:" + v.Key + "发送失败");
                                }
                            });
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
};
</script>

<style lang="less" scoped>
.header {
    border-bottom: 1px solid rgba(33, 61, 112, 1);
}

.Terminallist {
    height: 100%;
    padding-top: 10px;
    background: #122c4a;
    background-clip: content-box;
    padding: 10px !important;
    position: relative;
    display: flex;
    flex-direction: column;

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
            background: #4773a4 !important;
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

.Terminallist /deep/ .el-tree {
    // background: #ffffff14 !important;
    height: calc(100% - 34px);
    overflow-y: auto;
}

.template {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    font-size: 12px;
    // background: #122c4a;
    // margin-top:10px;
}

.template /deep/ .el-form-item {
    margin: 0;
}

.editor {
    height: calc(100% - 200px);
}

.editor /deep/ .ql-container {
    height: calc(100% - 42px);
}

.h100 {
    overflow-y: auto;
    padding: 10px;
}

.h100 .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
}
</style>
