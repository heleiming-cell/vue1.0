<template>
<div class="h100">
    <div class="filter">
        <div class="filter_line">
            <el-input placeholder="支持 名称 查询" v-model="keyword"></el-input>
        </div>
        <div class="filter_line">
            <el-select v-model="server1">
                <el-option :label="item.Name" :value="item.Id" v-for="item in servers" :key="item.Id"></el-option>
            </el-select>
        </div>
        <div class="filter_line">
            <button class="search" @click="search"> 查询</button>
            <el-upload style="width: 114px;position: absolute;top: 50%;right: 290px;transform: translate(0,-50%)" ref="upload" :show-file-list="false" :action="uploadUrl" :headers="{'enctype':'multipart/form-data'}" accept="{'xls','xlsx'}" :on-success="uploadSuccess" :on-error="uploadError" :on-progress="uploadProgress">
                <el-button type="success" :loading="Buttonloading">批量导入</el-button>
            </el-upload>
            <button class="search" @click="camAdd" style="width: 114px;background-color: RGBA(30, 99, 158, 1);position: absolute;top: 50%;right: 154px;transform: translate(0,-50%)">新增</button>
            <button @click="camDelete" style="width: 114px;background-color: #F56C6C;position: absolute;top: 50%;right: 20px;transform: translate(0,-50%)" class="a-upload mr10 search hidden-md-and-down">删除</button>
        </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="usertable" @select-all="selectionAll" @select="selectionAll">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="Name" label="名称">
        </el-table-column>
        <el-table-column prop="Ip" label="摄像机ip">
        </el-table-column>
        <el-table-column prop="ServerIp" label="流媒体ip">
        </el-table-column>
        <el-table-column prop="ServerPort" label="流媒体端口">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination background @current-change="handleCurrentChange" :page-size="size" layout="total, prev, pager, next" :total="total">
    </el-pagination>
    <el-dialog title="摄像机" :visible.sync="funAddVisible" :modal-append-to-body="false" width="663px" top="100px">
        <el-form label-width="100px" label-position="right" class="demo-ruleForm">
            <el-form-item label="所属系统">
                <el-select v-model="cam.SysId" clearable style="width:100%" @change="changeMenu" filterable>
                    <el-option :value="item.ID" :label="item.Name" v-for="item in menus" :key="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属区域">
                <el-select v-model="cam.AreaId" clearable style="width:100%">
                    <el-option :value="item.ID" :label="item.Name" v-for="item in areas" :key="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="流媒体名称">
                <el-select v-model="ServerId" clearable style="width:100%">
                    <el-option :value="item.Id+'|'+item.Ip+'|'+item.Port" :label="item.Name" v-for="item in servers" :key="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="摄像机名称">
                <el-input v-model="cam.Name" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="ip地址">
                <el-input v-model="cam.Ip" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="端口">
                <el-input v-model="cam.Port" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="cam.UserName" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="cam.Password" auto-complete="false"></el-input>
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
    name: "camSet",
    data() {
        return {
            keyword: '',
            tableData: [],
            total: 0,
            currentPage: 1,
            funAddVisible: false,
            deleteCams: [],
            server: "",
            server1: "",
            servers: [],
            menus: [],
            menu: "",
            areas: [],
            area: '',
            cam: {
                Id: 0, //摄像机id
                Token: "",
                Name: "", //摄像机名称
                ServerId: '', //流媒体id
                AreaId: "", //区域菜单id
                UserName: "", //摄像机用户名
                Password: "", //摄像机密码
                Ip: "", //摄像机ip
                Port: "", //摄像机端口
                ServerIp: "", //流媒体ip
                ServerPort: "", //流媒体端口
                SysId: '' //系统菜单id
            },
            ServerId: '',
            size: 10,
            uploadUrl: this.$URL + '/video/ImportCams',
            Buttonloading: false
        }
    },
    mounted() {
        this.LoadCams();
        this.LoadServers();
        this.LoadSysMenu();
    },
    methods: {
        selectionAll(selection) {
            if (selection.length > 0) {
                let id = [];
                selection.forEach((v, k) => {
                    id.push(v.Token + '|' + v.ServerIp + '|' + v.ServerPort);
                });
                this.deleteCams = id;
            } else if (selection.length === 0) {
                this.deleteCams = [];
            }
        },
        search() {
            this.LoadCams();
        },
        camAdd() {
            this.funAddVisible = true;
            this.cam = {
                Id: 0, //摄像机id
                Token: "",
                Name: "", //摄像机名称
                ServerId: '', //流媒体id
                AreaId: "", //区域菜单id
                UserName: "", //摄像机用户名
                Password: "", //摄像机密码
                Ip: "", //摄像机ip
                Port: "", //摄像机端口
                ServerIp: "", //流媒体ip
                ServerPort: "", //流媒体端口
                SysId: '' //系统菜单id
            };
        },
        camDelete() {
            if (this.deleteCams.length === 0) {
                this.$message.error("请选择要删除的功能");
                return;
            }
            this.$confirm('此操作将永久删除改摄像机, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get(this.$URL + '/video/DeleteCams', {
                    params: {
                        ids: this.deleteCams
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message("删除成功");
                        this.LoadCams();
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
                    this.servers = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.LoadCams();
        },
        dialog_submit() {
            if (this.ServerId && this.ServerId.split('|').length == 3) {
                this.cam.ServerId = this.ServerId.split('|')[0];
                this.cam.ServerIp = this.ServerId.split('|')[1];
                this.cam.ServerPort = this.ServerId.split('|')[2];
            }
            this.$ajax.post(this.$URL + '/video/AddCam', this.cam).then(res => {
                if (res.status === 200 && res.data.success) {
                    this.funAddVisible = false;
                    this.LoadCams();
                }
            }).catch(error => {
                console.log(error);
            });
        },
        handleEdit(i, scope) {
            let data = JSON.parse(JSON.stringify(scope));
            this.funAddVisible = true;
            if (data) {
                if (data.AreaId == 0) {
                    data.AreaId = "";
                }
                this.ServerId = data.ServerId + '|' + data.ServerIp + "|" + data.ServerPort
                this.cam = data;
            }
        },
        LoadSysMenu() {
            this.$ajax.get(this.$URL + '/SysMenu/GetMenuInfo').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.menus = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        changeMenu(val) {
            this.LoadAreas(val);
        },
        LoadAreas(id) {
            this.$ajax.get(this.$URL + '/AreaMenu/LoadAreaMenuBySysId', {
                params: {
                    id: id
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.areas = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        LoadCams() {
            this.$ajax.get(this.$URL + '/video/LoadCams', {
                params: {
                    keyword: this.keyword,
                    size: this.size,
                    page: this.currentPage,
                    serverId: this.server1 || 0
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.total = result.data.count;
                    this.tableData = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        // 上传文件成功
        uploadSuccess(response, file, fileList) {
            this.Buttonloading = false
            if (response.success) {
                //this.LoadCams();
                this.$message.success("上传成功")
            } else {
                this.$message.error("上传失败")
            }
        },
        // 上传文件失败
        uploadError(err, file, fileList) {
            this.Buttonloading = false
            this.$message.error('上传文件失败')
        },
        // 上传文件时
        uploadProgress(event, file, fileList) {
            this.Buttonloading = true
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
