<template>
<el-row class="box">
    <el-col :xs="24" :sm="3" class="h100 " style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>IOServer服务器</span></div>
            <div style="float:right">
                <span class="pointer" @click="deleteNode" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>
            </div>
        </div>
        <el-tree ref="tree" :load="asyncLoad" lazy class="paneltree" node-key="pkey" check-strictly show-checkbox :data="treedata" @check="handleCheckChange" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="24" :sm="21" class="h100 " style="border-right: 1px solid #122d62;padding:10px">
        <el-row class="status">
            <div>
                <el-progress type="circle" :percentage="100" status="text">{{count}}</el-progress>
                <div style="text-align:center">总数</div>
            </div>
            <div>
                <el-progress type="circle" :percentage="100" status="text">{{online}}</el-progress>
                <div style="text-align:center">在线</div>
            </div>
            <div>
                <el-progress type="circle" :percentage="100" status="text">{{count-online}}</el-progress>
                <div style="text-align:center">离线</div>
            </div>
        </el-row>
        <el-table :data="tableData" style="width: 100%" class="usertable">
            <!-- <el-table-column type="selection" width="55">
            </el-table-column> -->
            <el-table-column prop="ID" label="IO服务器ID" v-if="!node">
            </el-table-column>
            <el-table-column prop="Name" label="IO服务器" v-if="!node">
            </el-table-column>
            <el-table-column prop="Name" label="通道名称" v-if="node&&node.level==1">
            </el-table-column>
            <el-table-column prop="Name" label="协议名称" v-if="node&&node.level==1">
            </el-table-column>

            <el-table-column prop="LastTime" label="上次同步时间" v-if="!node">
            </el-table-column>
            <el-table-column prop="IPAddress" label="IP地址" v-if="!node">
            </el-table-column>
            <el-table-column prop="Host" label="主机名" v-if="!node">
            </el-table-column>

            <el-table-column prop="ID" label="控制器ID" v-if="node&&node.level==2">
            </el-table-column>
            <el-table-column prop="Name" label="控制器名称" v-if="node&&node.level==2">
            </el-table-column>
            <el-table-column prop="Address" label="控制器地址" v-if="node&&node.level==2">
            </el-table-column>

            <!-- <el-table-column prop="State" label="活动状态" v-if="node&&(node.level==1||node.level==2)">
                <template slot-scope="scope">
                    <span>{{scope.row.State?'启用':'停止'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="Enable" label="启用状态" v-if="node&&(node.level==1||node.level==2)">
                <template slot-scope="scope">
                    <span>{{scope.row.Enable?'启用':'停止'}}</span>
                </template>
            </el-table-column> -->

            <el-table-column prop="ID" label="变量ID" v-if="node&&node.level==3">
            </el-table-column>
            <el-table-column prop="Name" label="变量名称" v-if="node&&node.level==3">
            </el-table-column>
            <el-table-column prop="Address" label="变量地址" v-if="node&&node.level==3">
            </el-table-column>
            <el-table-column prop="Value" label="变量值" v-if="node&&node.level==3">
            </el-table-column>

            <el-table-column prop="DateStamp" label="时间戳" v-if="node&&(node.level==1||node.level==2)">
            </el-table-column>

        </el-table>
        <el-pagination :page-size="size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
        </el-pagination>
    </el-col>
</el-row>
</template>

<script>
import {
    Tree
} from '@/lib/Common'
import Variable from '@/components/Dialog/Variable/src'
export default {
    name: "ioserverManager",
    data() {
        return {
            treedata: [],
            defaultProps: {
                children: 'children',
                label: 'label',
                isLeaf: false,
            },
            tableData: [],
            total: 0,
            size: 10,
            currentPage: 1,
            node: null,
            count: 0,
            online: 0

        }
    },
    mounted() {
        this.loadServer();
    },
    methods: {
        loadParams(resolve, params, url, node) {
            this.$ajax.get(this.$URL + url, {
                params: params
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    let data = [];
                    result.data.data.forEach((v, i) => {
                        let pkey = "";
                        data.push({
                            label: v.Name,
                            key: v.ID,
                            pkey: node.data.pkey ? node.data.pkey + ":" + v.ID : v.ID,
                            level: node.level + 1
                        });
                    });
                    return resolve(data);
                } else {
                    return resolve([]);
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        asyncLoad(node, resolve) {
            if (node.level === 0) {
                this.loadParams(resolve, null, '/ioServer/GetIoServers', node);
            } else if (node.level === 1) {
                this.loadParams(resolve, {
                    ioSvr: node.key,
                }, '/ioServer/GetChannels', node);
            } else if (node.level === 2) {
                this.loadParams(resolve, {
                    ioSvr: node.data.pkey.split(':')[0],
                    chlKey: node.data.pkey.split(':')[1],
                }, '/ioServer/GetController', node);
            } else {
                return resolve([]);
            }
        },
        remove(node, data) {
            const parent = node.parent;
            // const children = parent.data.children || parent.data;
            children = parent.childNodes;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
            this.node = null;
        },
        deleteNode() {
            var node = this.$refs.tree.getNode(this.node);
            if (!this.node) {
                this.$message.error("请选择要删除的节点");
                return;
            }
            this.$ajax.get(this.$URL + '/ioServer/DeleteChlOrCtrl', {
                params: {
                    level: this.node.level,
                    key: this.node.pkey
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: '删除成功！'
                    });
                    this.$refs.tree.remove(this.node);
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        handleCheckChange(node, obj) {
            if (obj.checkedKeys.length > 0) //true
            {
                if (this.node && this.node.pkey !== node.pkey) {
                    this.$refs.tree.setChecked(this.node, false);
                }
                this.node = node;

                // if (this.node.pkey === node.pkey) {
                //     this.node = null;
                // }
            } else {
               this.node=null;
            }
            // if (this.$refs.tree.getCheckedNodes().length == 0 && this.node) {
            //     this.node = null;
            // }
            // if (!this.node) {
            //     this.node = node;
            // } else if (this.node.pkey === node.pkey) {
            //     this.node = null;
            // } else if (this.node && this.node.pkey !== node.pkey) {
            //     this.$refs.tree.setChecked(this.node, false);
            //     this.node = node;
            // }

            if (obj.checkedKeys.length === 0) {
                this.drawTable({
                    data: {
                        data: [],
                        count: 0
                    }
                })
            } else if (node.level === 1) {
                this.loadChal();
            } else if (node.level == 2) {
                this.loadContrl();
            } else if (node.level == 3) {
                this.loadVars();
            }
        },
        handleCurrentChange(page) {
            this.currentPage = page;
            //this.loadGroupVars();
        },
        drawTable(result) {
            this.tableData = result.data.data;
            this.total = result.data.data.length;
            if (!this.node || (this.node && this.node.level !== 3)) {
                this.count = result.data.data.length;
                this.online = result.data.online;
            }
        },
        loadServer() {
            this.$ajax.get(this.$URL + '/ioServer/LoadIoserverStatusCount', {
                params: {
                    size: this.size,
                    page: this.currentPage
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.drawTable(result);
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadChal() {
            if (!this.node) {
                return;
            }
            this.$ajax.get(this.$URL + '/ioServer/LoadChannelStatusCount', {
                params: {
                    sid: this.node.pkey
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.drawTable(result);
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadContrl() {
            if (!this.node) {
                return;
            }
            this.$ajax.get(this.$URL + '/ioServer/LoadControllerStatusCount', {
                params: {
                    sid: this.node.pkey.split(':')[0],
                    cid: this.node.pkey.split(':')[1]
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.drawTable(result);
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadVars() {
            if (!this.node) {
                return;
            }
            this.$ajax.get(this.$URL + '/ioServer/GetVariableList', {
                params: {
                    ioSvr: this.node.pkey.split(':')[0],
                    chlKey: this.node.pkey.split(':')[1],
                    ctrlKey: this.node.pkey.split(':')[2],
                    size: this.size,
                    page: this.currentPage
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.drawTable(result);
                }
            }).catch((err) => {
                console.log(err);
            });
        }

    }
}
</script>

<style lang="less" scoped>
.box {
    font-size: 12px;
    height: calc(100% - 115px);
}

.menuheader {
    line-height: 36px;
    vertical-align: middle;
    padding: 0 10px;
    overflow: hidden;
    background: #010308;

    i {
        cursor: pointer;
    }
}

.paneltree {
    height: calc(100% - 37px);
    overflow-y: auto;
}

.btn {
    display: flex;
    flex-direction: row-reverse
}

.status {
    display: flex;
    justify-content: space-around;
}
</style>
