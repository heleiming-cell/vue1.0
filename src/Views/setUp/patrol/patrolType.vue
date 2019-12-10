<template>
<div class="h100">
    <div class="filter">
        <div class="filter_line">
            <button class="search" @click="addData" style="width: 114px;background-color: green;position: absolute;top: 50%;right: 154px;transform: translate(0,-50%)">新增</button>
        </div>
    </div>
    <el-table :data="tableData" fit style="width: 100%">
        <el-table-column prop="Code" label="类型编码" align="center">
        </el-table-column>
        <el-table-column prop="Name" label="类型名称" align="center">
        </el-table-column>
        <el-table-column prop="Description" label="类型描述" align="center">
        </el-table-column>
        <el-table-column prop="CreaterName" label="创建人" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" @click="editData(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteData(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination :page-size="size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <el-dialog title="编辑类型" :visible.sync="dialog_visible" v-if="dialog_visible" :modal-append-to-body="false" width="400px" top="100px">
        <div class="dialogClass">
            <el-form :model="formInline" label-width="100px" ref="formDialog">
                <el-form-item label="类型编码：" prop="Code">
                    <el-input v-model="formInline.Code" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="类型名称：" prop="Name">
                    <el-input v-model="formInline.Name" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="类型描述：">
                    <el-input v-model="formInline.Description" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer" width="400px" top="100px">
            <el-button @click="dialog_visible = false" size="medium">关 闭</el-button>
            <el-button type="primary" @click="dialog_submit('formDialog')" size="medium">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
export default {
    name: "patrolType",
    data() {
        return {
            keyword: '',
            tableData: [],
            total: 0,
            size: 10,
            currentPage: 1,
            edit: false,
            dialog_visible: false,
        }
    },
    mounted() {
        this.loadAllContents();
    },
    methods: {
        editData(row) {
            this.formInline = {
                ID: row.Id,
                Name: row.Name,
                Description: row.Description,
                Code: row.Code,
            }
            this.dialog_visible = true
        },
        addData() {
            this.formInline = {
                ID: "",
                Name: "",
                Description: "",
                Code: "",
            }
            this.dialog_visible = true
        },
        loadAllContents() {
            this.$ajax.get(this.$DMURL + '/SysStandardType/GetList', {
                params: {
                    name: this.keyword,
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
            this.loadAllContents();
        },
        dialog_submit() {
            this.$ajax.post(this.$DMURL + '/SysStandardType/UpdateOrNew', this.$QS.stringify({
                ID: this.formInline.ID,
                Name: this.formInline.Name,
                Description: this.formInline.Description,
                Code: this.formInline.Code,
            })).then((result) => {
                this.loadAllContents()
                this.dialog_visible = false
            }).catch((err) => {
                console.log(err);
            });
        },
        deleteData(row) {
            this.$confirm('此操作将永久删除该类型, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get(this.$DMURL + '/SysStandardType/Del', {
                    params: {
                        ID: row.Id
                    }
                }).then((result) => {
                    this.loadAllContents()
                }).catch((err) => {
                    console.log(err);
                });
            })
        },
    }
}
</script>

<style lang="less" scoped>
// .h100 {
//     height: 100%;
//     position: relative;
// }

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
