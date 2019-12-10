<template>
<el-row class="box" :gutter="10">
    <el-col :xs="24" :sm="24" :md="4" class="h100">
        <div class="menuheader">
            <div style="float:left"><span>文件分类</span></div>
            <div style="float:right">
                <span @click="addCategory" class="pointer"><i class="iconfont icon-jia"></i></span>
                <span class="pointer" @click="deleteCategory" style="margin:0 5px"><i class="iconfont icon-shanchu"></i></span>
                <span @click="editCategory" class="pointer"><i class="iconfont icon-bianji"></i></span>
            </div>
        </div>
        <el-tree ref="tree" class="tree" node-key="key" :data="treedata" show-checkbox check-strictly @check-change="handleCheckChange" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="24" :sm="24" :md="20" class="h100">
        <el-row :gutter="10" class="search">
            <el-col :xs="12" :sm="12" :md="12" :lg="4" :xl="4">
                <el-input placeholder="支持 歌曲名称 查询" v-model="keyword" size="mini"></el-input>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="4" :xl="4">
                <el-button size="mini" @click="getFiles" type="primary"> 查询</el-button>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="4" :xl="4" :offset="12">
                <el-button size="mini" type="success" @click="upload">上传</el-button>
                <el-button size="mini" type="danger" @click="deleteFiles">删除</el-button>
            </el-col>
        </el-row>
        <el-table :data="tableData" style="width: 100%" height="calc(100% - 80px)" @select-all="select" @select="select">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="ID" label="编号">
            </el-table-column>
            <!-- <el-table-column prop="CarplateNum" label="车牌号">
                <template slot-scope="scope">
                    {{scope.row.Province}}{{scope.row.CarplateNum}}
                </template>
            </el-table-column> -->
            <el-table-column prop="Name" label="文件名称">
            </el-table-column>
            <el-table-column prop="Size" label="文件大小">
                <template slot-scope="scope">
                    {{scope.row.Size}}M
                </template>
            </el-table-column>
            <el-table-column prop="UpDateTime" label="上传时间">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="downFile(scope.row)">下载</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination> -->
        <el-pagination :background="true" @current-change="handleCurrentChange" :page-size="size" layout="total, prev, pager, next" :total="total">
        </el-pagination>
    </el-col>
    <input multiple type="file" id="filemp3" style="display:none;" @change="handleFiles($event)"  accept="audio/mpeg"/>
    <el-dialog title="分类编辑" :visible.sync="categoryDialog" :modal-append-to-body="false" width="400px">
        <el-form label-width="100px" label-position="left" ref="panel">
            <el-form-item label="分类名称">
                <el-input v-model="CategoryName"></el-input>
            </el-form-item>
            <el-form-item label="分类描述">
                <el-input v-model="Description"></el-input>
            </el-form-item>
            <el-form-item label="分类编号">
                <el-input v-model="OrderNo"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="saveCategory">确 定</el-button>
        </span>
    </el-dialog>
</el-row>
</template>

<script>
// import pagination from '../../common/pagination'
import {
    Tree
} from '@/lib/Common'
export default {
    name: "userManager",

    data() {
        return {
            keyword: '',
            tableData: [],
            treedata: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            tree: new Tree(),
            categoryDialog: false,
            edit: false,
            CategoryName: '',
            Description: '',
            OrderNo: '',
            size: 10,
            page: 1,
            total: 0,
            tableData: [],
            deleteItems: [],
            ids: [],
        }
    },
    mounted() {
        this.tree.loadTreeNodes(this, '/itc/GetCategory', "treedata");
        this.getFiles();
    },
    methods: {
        handleCurrentChange(page) {
            this.page = page;
            this.getFiles();
        },
        upload() {
            let filedom = document.getElementById('filemp3');
            if (filedom) {
                filedom.click();
            }
        },
        handleFiles($event) {
            let _this = this;
            let nodes = this.$refs.tree.getCheckedNodes();
            if (nodes.length >= 2) {
                this.$message.error("不能同时上传到多个分类");
                document.getElementById('filemp3').value = '';
                return;
            } else if (nodes.length === 0) {
                this.$message.error("请选择要分类节点");
                document.getElementById('filemp3').value = '';
                return;
            }
            if ($event.target.files.length > 0) {
                let form = new FormData();
                form.append("categoryid", nodes[0].key);
                for (let index = 0; index < $event.target.files.length; index++) {
                    form.append($event.target.files[index].name, $event.target.files[index]);
                }
                this.$ajax({
                    method: 'Post',
                    url: this.$URL + '/itc/UpFile',
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
                    document.getElementById('filemp3').value = '';
                    _this.page = 1;
                    _this.getFiles();
                })
            }
        },
        addCategory() {
            let nodes = this.$refs.tree.getCheckedNodes();
            if (nodes.length >= 2) {
                this.$message.error("不能同时编辑多个节点");
                return;
            }
            this.categoryDialog = true;
            this.CategoryName = '';
            this.Description = '';
            this.OrderNo = '';
            this.edit = false;
        },
        editCategory() {
            let nodes = this.$refs.tree.getCheckedNodes();
            if (nodes.length >= 2) {
                this.$message.error("不能同时编辑多个节点");
                return;
            } else if (nodes.length === 0) {
                this.$message.error("请选择要编辑的节点");
                return;
            }
            this.edit = true;
            this.categoryDialog = true;
            this.CategoryName = nodes[0].label;
            this.OrderNo = nodes[0].OrderNo;
            this.Description = nodes[0].Description;
        },
        deleteCategory() {
            this.$confirm('此操作将永久删除改目录下所有音乐文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let nodes = this.$refs.tree.getCheckedNodes();
                if (nodes.length === 0) {
                    this.$message.error("请选择要删除的分类");
                    return;
                }
                let ids = [];
                nodes.forEach((v, i) => {
                    ids.push(v.key);
                });
                this.$ajax.get(this.$URL + '/itc/DeleteCategorys', {
                    params: {
                        ids: JSON.stringify(ids)
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.tree.loadTreeNodes(this, '/itc/GetCategory', "treedata");
                        this.getFiles();
                    } else {
                        this.$message.error("删除失败！");
                    }
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        handleCheckChange(node, status) {
            this.getFiles();
        },
        saveCategory() {
            let _this = this;
            let nodes = this.$refs.tree.getCheckedNodes();
            this.$ajax.get(this.$URL + '/itc/AddCategory', {
                params: {
                    name: this.CategoryName,
                    pid: this.edit ? nodes[0].pkey : (nodes.length > 0 ? nodes[0].key : 0),
                    code: this.OrderNo || '',
                    id: this.edit ? nodes[0].key : 0,
                    description: this.Description || ''
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        'message': '操作成功',
                        type: 'success'
                    });
                    this.categoryDialog = false;
                    this.tree.loadTreeNodes(this, '/itc/GetCategory', "treedata");
                }
            }).catch((err) => {
                console.log(err);
            });

        },
        getFiles() {
            let ids = [];
            let nodes = this.$refs.tree.getCheckedNodes();
            nodes.forEach((v, i) => {
                ids.push(v.key);
            });
            this.$ajax.get(this.$URL + '/itc/GetFiles', {
                params: {
                    nodeid: nodes.length > 0 ? JSON.stringify(ids) : '',
                    page: this.page,
                    size: this.size,
                    keyword: this.keyword,
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
        openDownloadDialog(url, saveName) {
            if (typeof url == 'object' && url instanceof Blob) {
                url = URL.createObjectURL(url); // 创建blob地址
            }
            var aLink = document.createElement('a');
            aLink.href = url;
            aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
            var event;
            // if (window.MouseEvent) event = new MouseEvent('click');
            // else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            // }
            aLink.dispatchEvent(event);
        },
        downFile(row) {
            if (row) {
                let file = {
                    name: row.Name,
                    path: row.FullPath
                };
                // var aLink = document.createElement('a');
                // aLink.href = this.$URL + '/mp3/'+row.FullPath;
                // aLink.download =row.FullPath; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
                // aLink.click();
                // window.location.href=this.$URL + '/mp3/'+row.FullPath;

                this.$ajax.request({
                    responseType: 'arraybuffer',
                    url: this.$URL + '/itc/DownFile?file=' + JSON.stringify(file),
                    method: 'get',
                    headers: {
                        'Content-Type': 'audio/mpeg',
                    },
                }).then((result) => {
                    const content = result
                    const blob = new Blob([content.data]); //,{type : 'audio/mpeg'}
                    const fileName = row.Name;

                    this.openDownloadDialog(blob, row.Name);
                });
            }
        },
        deleteFiles() {
            if (this.deleteItems.length === 0) {
                this.$message.error("请选择要删除的文件");
                return;
            }
            this.$ajax.get(this.$URL + '/itc/DeleteFiles', {
                params: {
                    files: JSON.stringify(this.deleteItems),
                    ids: JSON.stringify(this.ids),
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                    this.page = 1;
                    this.getFiles();
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        select(items) {
            if (items.length === 0) {
                this.deleteItems = [];
                this.ids = [];
            } else {
                this.deleteItems = [];
                this.ids = [];
                items.forEach((v, i) => {
                    this.deleteItems.push(v.FullPath);
                    this.ids.push(v.ID);
                });
            }

        }
        
    }
}
</script>

<style lang="less" scoped>
.box {
    font-size: 12px;
    height: calc(100% - 115px);
    overflow-x: hidden;
    padding: 10px 0;
    margin: 0 !important;

    & /deep/ .el-tree.tree {
        height: calc(100% - 36px);
        overflow-y: auto;
        border-right: 1px solid #051b47
    }

    & /deep/ .el-pagination.is-background {
        text-align: center;
    }
}

.search {
    height: 50px;
    display: flex;
    align-items: flex-start;
}

.table {
    height: calc(100% - 50px);

}

.menuheader {
    line-height: 36px;
    height: 36px;
    vertical-align: middle;
    padding: 0 10px;
    overflow: hidden;
    background: #051b47;

    i {
        cursor: pointer;
    }
}
</style>
