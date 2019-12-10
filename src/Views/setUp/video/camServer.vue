<template>
<div class="h100">
    <div class="filter">
        <div class="filter_line">
            <el-input placeholder="支持 名称 查询" v-model="keyword"></el-input>
        </div>

        <div class="filter_line">
            <button class="search" @click="search"> 查询</button>
            <button class="search" @click="roleAdd" style="width: 114px;background-color: RGBA(30, 99, 158, 1);position: absolute;top: 50%;right: 154px;transform: translate(0,-50%)">新增</button>
            <button @click="serverDelete" style="width: 114px;background-color: RGBA(30, 144, 158, 1);position: absolute;top: 50%;right: 20px;transform: translate(0,-50%)" class="a-upload mr10 search hidden-md-and-down">删除</button>
        </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="usertable" @select-all="selectionAll" @select="selectionAll">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="Name" label="名称">
        </el-table-column>
        <el-table-column prop="Ip" label="IP">
        </el-table-column>
        <el-table-column prop="Port" label="端口">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                <el-button size="mini" @click="handleSync(scope.$index, scope.row)" type="primary">同步数据</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination background @current-change="handleCurrentChange" :page-size="currentPage" layout="total, prev, pager, next" :total="total">
    </el-pagination>
    <el-dialog title="流媒体" :visible.sync="funAddVisible" :modal-append-to-body="false" width="663px" top="100px">
        <el-form label-width="100px" label-position="right" class="demo-ruleForm">
            <el-form-item label="流媒体名称">
                <el-input v-model="server.Name" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="ip地址">
                <el-input v-model="server.Ip" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="端口">
                <el-input v-model="server.Port" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="server.UserName" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="server.Password" auto-complete="false"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
            <el-button type="primary" @click="dialog_submit" style="background-color: #1e639e;border: none">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
export default {
    name: "camServer",
    data() {
        return {
            keyword: '',
            tableData: [],
            total: 0,
            currentPage: 1,
            funAddVisible: false,
            deleteServers: [],
            server: {
                Id: 0,
                Name: '',
                Ip: '',
                Port: '',
                UserName: '',
                Password: ''
            }
        }
    },
    mounted() {
        this.LoadServers();
    },
    methods: {
        selectionAll(selection) {
            if (selection.length > 0) {
                let id = [];
                selection.forEach((v, k) => {
                    id.push(v.Id);
                });
                this.deleteServers = id;
            } else if (selection.length === 0) {
                this.deleteServers = [];
            }
        },
        // selectone(selection) {
        //     if (selection.length === 0) {
        //         this.deleteFuns = [];
        //     } else if (selection.length > 0) {
        //         let id = [];
        //         selection.forEach((v, k) => {
        //             id.push(v.FunID);
        //         });
        //         this.deleteFuns = id;
        //     }

        // },
        search() {
            this.loadAllFuns();
        },
        roleAdd() {
            this.funAddVisible = true;
            this.FUN = {
                FunID: 0,
                FunName: '',
                Description: '',
                Controller: '',
                Action: ''
            };
        },
        serverDelete() {
            if (this.deleteServers.length === 0) {
                this.$message.error("请选择要删除的流媒体");
                return;
            }
            this.$confirm('此操作将永久删除改流媒体, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get(this.$URL + '/video/DelServer', {
                    params: {
                        ids: this.deleteServers
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message("删除成功");
                        this.LoadServers();
                    } else if (!result.data.success) {
                        this.$message.error("删除失败");
                    }
                }).catch((err) => {
                    console.log(err);
                });
            });

        },
        LoadServers() {
            this.$ajax.get(this.$URL + '/video/GetServers', {
                params: {
                    keyword: this.keyword,
                    page: this.currentPage,
                    size: 10
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {

                    this.tableData = result.data.data;
                    this.total = result.data.count;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.LoadServers();
        },
        dialog_submit() {
            this.$ajax.post(this.$URL + '/video/AddServer', this.server).then(res => {
                if (res.status === 200 && res.data.status) {
                    this.funAddVisible = false;
                    this.LoadServers();
                }
            }).catch(error => {
                console.log(error);
            });
        },
        handleEdit(i, data) {
            this.funAddVisible = true;
            if (data) {
                this.server = data;
            }
        },
        handleSync(i, data) {
            this.$ajax.get(this.$URL + '/video/SyncServerData', {
                params: {
                    host: data.Ip + ":" + data.Port,
                    serverId: data.Id
                }
            }).then(res => {
                if (res.status === 200 && res.data.success) {
                    this.$message({
                        type: 'success',
                        message: '同步成功'
                    });
                }
            }).catch(error => {
                console.log(error);
            });
        }

    }
}
</script>

<style lang="less" scoped>
.h100 {
    height: 100%;
    position: relative;
}

table {
    height: 100% !important;
}

.dialog-line {
    height: 37px;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;

}

.dialog-line span {
    color: white;
    margin-right: 10px;
}

.dialog-line div span {
    color: white;
    margin-right: 10px;
}

.list-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;

    button.export {
        /*position: absolute;*/
        /*bottom: -69px;*/
        /*right: 0;*/
        background-color: #1f4083;
        border-radius: 5px;
        color: white;
        outline: none;
        border: none;
        cursor: pointer;
        margin-left: 0.25rem;
        height: 0.4rem;
        width: 1rem;
    }
}

.list-pagination {
    padding-top: 20px;
    text-align: center;

}

.dialog-box {
    display: flex;
    flex-wrap: wrap;
    max-height: 500px;
    overflow-y: scroll;
}

.active {
    color: green;
}

.inactive {
    color: red;
}
</style>
