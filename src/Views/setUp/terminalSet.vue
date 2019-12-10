<template>
<el-row class="boxpanel">
    <el-col :xs="24" :sm="3" class="h100" style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>终端列表</span></div>
            <div style="float:right">
                <span @click="addTerminal" class="pointer"><i class="iconfont icon-jia"></i></span>
                <span class="pointer" @click="deleteTerminal" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>
                <span  @click="editTerminal" class="pointer"><i class="iconfont icon-bianji"></i></span>
            </div>
        </div>
        <el-tree ref="tree" class="tree" node-key="key" :data="treedata" show-checkbox check-strictly @check-change="handleCheckChange" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="24" :sm="21" class="h100 eidtarea">
        <div>
            <el-button @click="addDIV" circle type="primary" size="mini">
                <i class="iconfont icon-jia"></i>
            </el-button>

            <el-button @click="uploadPic" circle type="primary" size="mini">
                <i class="iconfont icon-shangchuan-copy"></i>
            </el-button>
            <el-button @click="addPic" circle type="primary" size="mini">
                <i class="iconfont icon-tianjiatupian"></i>
            </el-button>
            <el-button @click="saveConfig" circle type="primary" size="mini">
                <i class="iconfont icon-baocun"></i>
            </el-button>
            <input multiple type="file" id="fileimg" style="display:none;" @change="handleFiles($event)"  accept="image/jpeg,image/png,image/gif"/>
        </div>
            <div class="draggableContainer">
                <div v-for="(item,i) in divs" :key="i" @contextmenu.prevent="delDIV" :class="[item.control==0?'gray':'',item.control==1&&item.panelid?'green':'']" class="draggable" :index="i" :style="{left:item.x+'px',top:item.y+'px',width:item.width+'px',height:item.height+'px',transform:'rotate('+item.angle+'deg)'}" @dblclick="eidtConfig(i)"></div>
                <img :src="src" v-if="src&&picSrc">
            </div>
    </el-col>
    <el-dialog title="终端编辑" :visible.sync="panelDialog" :modal-append-to-body="false" width="400px">
        <el-form :model="ruleForm" :rules="rules" label-width="100px" label-position="left" ref="panel">
            <el-form-item label="终端名称" prop="TerminalName">
                <el-input v-model="ruleForm.TerminalName"></el-input>
            </el-form-item>

            <el-form-item label="终端IP" prop="TerminalIP">
                <el-input v-model="ruleForm.TerminalIP"></el-input>
            </el-form-item>
            <el-form-item label="终端选择" prop="TerminalID">
                <el-select clearable v-model="ruleForm.TerminalID" filterable style="width:100%">
                    <el-option v-for="item in panels" :key="item.ID" :label="item.PanelName" :value="item.PanelID"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="saveTerminal">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="图片选择" :visible.sync="picDialog" :modal-append-to-body="false" width="400px">
        <el-form label-width="100px" label-position="left">
            <el-form-item label="背景图片">
                <el-select clearable v-model="picSrc" filterable style="width:100%">
                    <el-option v-for="item in pics" :key="item" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog title="参数配置" :visible.sync="editDialog" :modal-append-to-body="false" width="400px" :modal="false" v-draggable>
        <el-form label-width="100px" label-position="left">
            <el-form-item label="设备面板">
                <el-select clearable v-model="eidtObj.panelid" filterable style="width:100%">
                    <el-option v-for="item in FCUPanels" :key="item.PanelID" :label="item.label" :value="item.PanelID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备角度">
                <el-slider v-model="eidtObj.angle" max="360" show-input>
                </el-slider>
            </el-form-item>
            <el-form-item label="高度">
                <el-input v-model="eidtObj.height"></el-input>
            </el-form-item>
            <el-form-item label="宽度">
                <el-input v-model="eidtObj.width"></el-input>
            </el-form-item>
            <el-form-item label="是否可控">
                <el-radio v-model="eidtObj.control" label="0">否</el-radio>
                <el-radio v-model="eidtObj.control" label="1">是</el-radio>
            </el-form-item>
        </el-form>
    </el-dialog>
</el-row>
</template>

<script>
import Draggabilly from 'draggabilly'
export default {
    name: 'terminalSet',
    // components:{
    //    'el-dialog':DlgDraggable
    // },
    data() {
        return {
            ruleForm: {
                // panelType: '',
                TerminalName: '',
                TerminalIP: '',
                TerminalID: ''

            },
            rules: {
                TerminalName: [{
                    required: true,
                    message: '名称不能为空',
                    trigger: 'blur'
                }],
                TerminalIP: [{
                    required: true,
                    message: 'IP不能为空',
                    trigger: 'blur'
                }],
                TerminalID: [{
                    required: true,
                    message: '终端',
                    trigger: 'change'
                }],
            },
            treedata: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            panelDialog: false,
            picDialog: false,
            editDialog: false,
            node: null,
            panels: [],
            pics: [],
            picSrc: '',
            divs: [],
            FCUPanels: [],
            eidtObj: {
                // id:'',
                control: '1',
                height: 50,
                width: 50,
                angle: 0,
                panelid: ''
            },

        }
    },
    mounted() {
        this.loadTerminal();
        this.loadPanels("EM");

        var draggableElems = document.querySelectorAll('.el-dialog');
        for (var i = 0; i < draggableElems.length; i++) {
            var draggableElem = draggableElems[i];
            var draggie = new Draggabilly(draggableElem, {
                containment: 'body'
            });
            // draggie.on('dragEnd', (event, pointer) => {

            //     let index = event.target.getAttribute("index");
            //     _this.divs[index].x = event.target.offsetLeft;
            //     _this.divs[index].y = event.target.offsetTop;
            //     event.target.style.transform = "rotate(" + _this.divs[index].angle + "deg)";
            // });
        }

    },

    computed: {
        src() {
            // console.log("http://" + location.hostname + ":6003/imgs/" + this.picSrc);
            return "http://" + location.hostname + ":6003/imgs/" + this.picSrc;
            //return "http://" + location.hostname + ":6003/imgs/1.gif";
        }
    },
    methods: {
        handleCheckChange(node, status) {
            let _this = this;
            if (status) {
                if (this.node && this.node.key != node.key) {
                    this.$refs.tree.setChecked(this.node, false);
                }
                this.node = node;
                this.bindobj = {}; //复位
                this.i = 0; //复位

                if (this.node.ip) {
                    // this.src = imgs[this.node.PanelType];
                    // this.tableData = JSON.parse(JSON.stringify(panelConfig[this.node.PanelType]));
                    this.$ajax.get(this.$URL + '/info/GetTerminalConfig', {
                        params: {
                            id: this.node.key
                        }
                    }).then((result) => {
                        if (result.status === 200 && result.data.success) {
                            if (result.data.data) {
                                this.divs = result.data.data;
                                this.picSrc = result.data.pic;
                                this.$nextTick(() => {
                                    var draggableElems = document.querySelectorAll('.draggable');
                                    for (var i = 0; i < draggableElems.length; i++) {
                                        var draggableElem = draggableElems[i];
                                        var draggie = new Draggabilly(draggableElem, {
                                            containment: '.draggableContainer'
                                        });
                                        draggie.on('dragEnd', (event, pointer) => {

                                            let index = event.target.getAttribute("index");
                                            _this.divs[index].x = event.target.offsetLeft;
                                            _this.divs[index].y = event.target.offsetTop;
                                            event.target.style.transform = "rotate(" + _this.divs[index].angle + "deg)";
                                        });
                                    }
                                });
                                // _this.bindobj = config;

                            }
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    this.picSrc = ''
                    this.divs = [];
                    //  this.tableData = [];
                }
            } else {
                if (this.node && this.node.key === node.key) {
                    this.node = null;
                    this.picSrc = '';
                    this.divs = [];
                    // this.tableData = [];
                }
            }

        },
        loadTerminal(node, resolve) {
            this.$ajax.get(this.$URL + '/info/GetAreaTerminal').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.treedata = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });

        },
        addTerminal() {
            if (!this.node) {
                this.$message.error("请先选择区域节点");
                return;
            } else if (this.node && this.node.areacode) {
                this.$message.error("改节点下不支持添加终端");
                return;
            }
            this.panelDialog = true;
            // this.ruleForm.panelType = '';
            this.ruleForm.TerminalName = '';

            this.edit = false;
            this.$refs['panel'].resetFields();
        },
        deleteTerminal() {
            if (!this.node) {
                this.$message.error("请选择要删除的终端");
                return;
            } else if (this.node && !this.node.areacode) {
                this.$message.error("改节点不支持删除");
                return;
            }
            this.$ajax.get(this.$URL + '/info/DeleteTerminal', {
                params: {
                    id: this.node.key
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.loadTerminal();

                }
            }).catch((err) => {
                console.log(err);
            });
        },
        editTerminal() {
            if (!this.node) {
                this.$message.error("请选择要编辑的终端");
                return;
            } else if (this.node && !this.node.areacode) {
                this.$message.error("改节点不支持编辑");
                return;
            }
            this.panelDialog = true;
            this.edit = true;
            this.ruleForm.TerminalName = this.node.label;
            this.ruleForm.TerminalID = this.node.uuid;
            this.ruleForm.TerminalIP = this.node.ip;
        },
        saveTerminal() {
            let _this = this;
            this.$refs['panel'].validate((valid) => {
                if (valid) {
                    this.$ajax.get(this.$URL + '/info/AddTerminal', {
                        params: {
                            name: this.ruleForm.TerminalName,
                            // TerminalUUID: this.ruleForm.TerminalUUID,
                            areaid: this.edit ? this.node.areaid : this.node.key,
                            code: this.edit ? this.node.areacode : this.node.code,
                            id: this.edit ? this.node.key : 0,
                            TerminalID: this.ruleForm.TerminalID,
                            TerminalIP: this.ruleForm.TerminalIP,
                        }
                    }).then((result) => {
                        if (result.status === 200 && result.data.success) {
                            this.$message({
                                'message': '操作成功',
                                type: 'success'
                            });
                            this.panelDialog = false;
                            this.loadTerminal();
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            });
        },
        loadPanels(type) {
            this.$ajax.get(this.$URL + '/panel/GetPanels', {
                params: {
                    type: type
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    if (type === "EM")
                        this.panels = result.data.data;
                    else if (type === "FCU") {
                        this.FCUPanels = result.data.data;
                    }
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        addDIV() {
            let _this = this;
            if (this.src && this.picSrc) {
                this.divs.push({
                    id: _this.guid(),
                    x: 0,
                    y: 0,
                    panelid: '',
                    panelname: '',
                    angle: 0,
                    control: "1",
                    width: 50,
                    height: 50,
                });
                this.$nextTick(() => {
                    var draggableElems = document.querySelectorAll('.draggable');
                    for (var i = 0; i < draggableElems.length; i++) {
                        var draggableElem = draggableElems[i];
                        var draggie = new Draggabilly(draggableElem, {
                            containment: '.draggableContainer'
                        });
                        draggie.on('dragEnd', (event, pointer) => {

                            let index = event.target.getAttribute("index");
                            _this.divs[index].x = event.target.offsetLeft;
                            _this.divs[index].y = event.target.offsetTop;

                            event.target.style.transform = "rotate(" + _this.divs[index].angle + "deg)";

                        });
                    }
                });
            } else {
                this.$message.error("请先添加背景图片");
                return;
            }
        },
        delDIV(event) {
            this.$confirm('此操作将删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // this.$message({
                //     type: 'success',
                //     message: '删除成功!'
                // });
                let index = event.target.getAttribute("index")
                this.divs.splice(index, 1);
            })

        },
        addPic() {
            this.loadpic();
            this.picDialog = true;

        },
        loadpic() {
            let _this = this;
            this.$ajax.get(this.$URL + '/info/DownFile').then(function (result) {
                if (result.data.success) {
                    _this.pics = result.data.data;
                }
            })
        },
        uploadPic() {
            let filedom = document.getElementById('fileimg');
            if (filedom) {
                filedom.click();
            }
        },
        handleFiles($event) {
            let _this = this;
            if ($event.target.files.length > 0) {
                let form = new FormData();
                for (let index = 0; index < $event.target.files.length; index++) {
                    form.append($event.target.files[index].name, $event.target.files[index]);
                }
                this.$ajax({
                    method: 'Post',
                    url: this.$URL + '/info/UpFile',
                    data: form,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }).then(function (result) {
                    if (result.data.success) {
                        _this.$message({
                            type: 'success',
                            message: '上传成功',
                        });
                    }
                })
            }

        },
        eidtConfig(index) {
            this.editDialog = true;
            this.loadPanels("FCU");
            this.eidtObj = this.divs[index];
        },
        saveConfig() {
            let _this = this;
            if (this.node && this.node.ip) {
                this.$ajax.post(this.$URL + '/info/SaveConfig', this.$QS.stringify({
                    divs: this.divs.length > 0 ? this.divs : JSON.stringify([]),
                    clientid: this.node.uuid,
                    pic: this.src
                })).then(function (result) {
                    if (result.data.success) {
                        _this.$message({
                            type: 'success',
                            message: '保存成功',
                        });
                    }
                })
            } else {
                _this.$message.error("请选择终端再保存");
            }

        }

    }
}
</script>

<style lang="less" scoped>
.green {
    background: green !important;
}

.gray {
    background: gray !important;
}

.boxpanel {
    height: 100%;
}

.menuheader {
    line-height: 36px;
    height: 36px;
    vertical-align: middle;
    padding: 0 10px;
    overflow: hidden;
    background: #010308;

    i {
        cursor: pointer;
    }
}

.tree{
    height: calc(100% - 36px);
    overflow-y: auto;
}

.config {
    display: flex;
    flex: 1 1;
    height: 100%;
    width: 100%;
    justify-content: flex-start;
    flex-wrap: nowrap;
    padding: 10px;
    overflow-y: auto;
}

.eidtarea {
    padding: 10px;

    &>div:nth-of-type(1) {
        height: 40px;
    }

    &>div:nth-of-type(2) {
        position: relative;
        height: calc(100% - 40px);
        //  background: red;
        overflow: auto;

        &::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }

        &::-webkit-scrollbar-track {
            background-color: gray;
        }

        &>img {
            // width: 100%;
            // height: 100%;
            // border: 0;
        }

        .draggable {
            background: #FF7800;
            // height: 50px;
            // width: 50px;
            position: absolute;
            cursor: pointer;
        }
    }
}
</style>
