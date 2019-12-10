<template>
<el-row class="boxpanel">
    <el-col :xs="24" :sm="3" class="h100" style="border-right: 1px solid #122d62">
        <div class="menuheader">
            <div style="float:left"><span>模型分类</span></div>
            <div style="float:right">
            </div>
        </div>
        <el-tree ref="tree" node-key="key" :data="treedata" show-checkbox check-strictly @check-change="handleCheckChange" :props="defaultProps"></el-tree>
    </el-col>
    <el-col :xs="24" :sm="21" class="upload">
        <el-upload  :http-request="upload" :show-file-list="false" class="upload-demo" drag action="abc" multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-table :data="tableData" style="width: 100%" class="usertable">
            <el-table-column prop="name" label="文件名称">
            </el-table-column>
            <el-table-column prop="type" label="文件类型">
            </el-table-column>
            <el-table-column prop="Status" label="状态">
                <template slot-scope="scope">
                    <p :class="scope.row.Status=='1'?'active':'inactive'">{{ scope.row.Status=="1"?"完成":"未完成" }}</p>
                </template>
            </el-table-column>
        </el-table>
    </el-col>
</el-row>
</template>

<script>
export default {
    name: 'bimUpload',
    data() {
        return {
            node: null,
            treedata: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            tableData: [],
        }
    },
    mounted() {
        this.loadArea();
    },

    methods: {
        upload(f) {
            let _this=this;
            if (!this.node) {
                this.$message.error('请选择分类节点');
                return false;
            }
            let menuid, areaid, areacode;
            if (this.node && this.node.code) //选择的是区域
            {
                menuid = this.node.menuid;
                areacode = this.node.code;
                areaid = this.node.key;
            } else if (this.node && !this.node.code) {
                menuid = this.node.key;
                areacode = '0';
                areaid = '0';
            }
            let form = new FormData();
            form.append(f.name, f.file);
            form.append('menuid', menuid);
            form.append('areaid', areaid);
            form.append('areacode', areacode);
            this.$ajax({
                method: 'Post',
                url: this.$URL + '/bim/UpFile',
                data: form,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }).then(function (result) {
                if (result.data.success) {
                    _this.tableData.push({
                        name: f.file.name,
                        type: f.file.name.split('.')[1],
                        Status: 1,
                    })
                } else {
                    _this.tableData.push({
                        name: f.file.name,
                        type: f.file.name.split('.')[1],
                        Status: 0,
                    })
                }
            })
            return true;
        },
        handleCheckChange(node, status) {
            let _this = this;
            if (status) {
                if (this.node && this.node.key != node.key) {
                    this.$refs.tree.setChecked(this.node, false);
                }
                this.node = node;
                this.i = 0; //复位

            } else {

            }

        },
        loadArea(node, resolve) {
            this.$ajax.get(this.$URL + '/bim/GetArea').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.treedata = result.data.data;
                }
            }).catch((err) => {
                console.log(err);
            });

        },

    }
}
</script>

<style lang="less" scoped>
.boxpanel {
    height: 100%;
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

.upload {
    height: 100%;
    padding: 10px;
}

.upload-demo {
    height: 30%;

    & /deep/ .el-upload {
        height: 100%;
        width: 100%;
    }

    & /deep/ .el-upload-dragger {
        background-color: transparent;
    }
}

.upload-demo /deep/ .el-upload-dragger {
    width: 100%;
    height: 100%;
}

.active {
    color: green;
}

.inactive {
    color: red;
}
</style>
