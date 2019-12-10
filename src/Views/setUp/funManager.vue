<template>
<div class="h100">
    <div class="filter">
        <div class="filter_line">
            <el-input placeholder="支持 功能名称 查询" v-model="funname"></el-input>
        </div>
        <div class="filter_line">
            <button class="search" @click="search"> 查询</button>
            <button class="search" @click="roleAdd" style="width: 114px;background-color: RGBA(30, 99, 158, 1);position: absolute;top: 50%;right: 154px;transform: translate(0,-50%)">新增功能</button>
            <button @click="funDelete" style="width: 114px;background-color: RGBA(30, 144, 158, 1);position: absolute;top: 50%;right: 20px;transform: translate(0,-50%)" class="a-upload mr10 search hidden-md-and-down">删除</button>
        </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="usertable" @select-all="selectionAll" @select="selectone">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="FunName" label="功能名称">
        </el-table-column>
        <el-table-column prop="Description" label="功能描述">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
        </el-table-column>
    </el-table>

    <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>
    <el-dialog title="功能操作" :visible.sync="funAddVisible" :modal-append-to-body="false" width="663px" top="100px">
        <el-form label-width="100px" label-position="right" class="demo-ruleForm">
            <el-form-item label="功能名称">
                <el-input v-model="FUN.FunName" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="Controller">
                <el-input v-model="FUN.Controller" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="Action">
                <el-input v-model="FUN.Action" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="功能描述">
                <el-input v-model="FUN.Description"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
            <el-button type="primary" @click="dialog_submit" style="background-color: #1e639e;border: none">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import Route from '@/router/routes'
import pagination from '@/components/common/pagination'
export default {
    name: "userManager",
    components: {
        // 'gh_table': gh_table,
        'pagination': pagination,
    },
    data() {
        return {
            funname: '',
            user_list: [],
            tableData: [],
            total: 0,
            currentPage: 1,
            funAddVisible: false,
            FUN: {
                FunID: 0,
                FunName: '',
                Description: '',
                Controller: '',
                Action: ''
            },
            deleteFuns: [],
        }
    },
    mounted() {
        this.loadAllFuns();
    },
    methods: {
        selectionAll(selection) {
            if (selection.length > 0) {
                let id = [];
                selection.forEach((v, k) => {
                    id.push(v.FunID);
                });
                this.deleteFuns = id;
            } else if (selection.length === 0) {
                this.deleteFuns = [];
            }
        },
        selectone(selection) {
            if (selection.length === 0) {
                this.deleteFuns = [];
            } else if (selection.length > 0) {
                let id = [];
                selection.forEach((v, k) => {
                    id.push(v.FunID);
                });
                this.deleteFuns = id;
            }

        },
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
        funDelete() {
            if (this.deleteFuns.length === 0) {
                this.$message.error("请选择要删除的功能");
                return;
            }
            this.$confirm('此操作将永久删除改功能, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get(this.$URL + '/fun/DeleteFun', {
                    params: {
                        ids: this.deleteFuns
                    }
                }).then((result) => {
                    if (result.status === 200 && result.data.success) {
                        this.$message("删除成功");
                        this.loadAllFuns();
                    } else if (!result.data.success) {
                        this.$message.error("删除失败");
                    }
                }).catch((err) => {
                    console.log(err);
                });
            });

        },
        loadAllFuns() {
            this.$ajax.get(this.$URL + '/fun/GetFunsInfo', {
                params: {
                    funname: this.funname,
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
        onSelect(v) {
            console.log(v);
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val
            this.loadAllFuns();
        },
        dialog_submit() {
            this.$ajax.post(this.$URL + '/fun/AddFun', JSON.stringify(this.FUN), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message(result.data.Message);
                    this.funAddVisible = false;
                    this.loadAllFuns();
                } else if (!result.data.success) {
                    this.$message.error(result.data.Message);
                }
            }).catch((err) => {
                this.$message.error(result.data.Message);
            });
        },
        handleEdit(i, data) {
            this.funAddVisible = true;
            if (data) {
                this.FUN = data;
                //  this.dialog_submit();
            }
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
