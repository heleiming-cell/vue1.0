<template>
<div class="h100">
    <div class="filter">
        <div class="filter_line">
            <el-input placeholder="支持 部门 查询" v-model="keyword"></el-input>
        </div>
        <div class="filter_line">
            <button class="search" @click="search"> 查询</button>
            <!-- <button class="search" @click="userAdd" style="width: 114px;background-color: RGBA(30, 99, 158, 1);position: absolute;top: 50%;right: 287px;transform: translate(0,-50%)">新增部门</button> -->
            <button class="search"  @click="deptAdd" style="width: 114px;background-color: green;position: absolute;top: 50%;right: 154px;transform: translate(0,-50%)">新增部门</button>
            <button @click="deptDelete" style="width: 114px;background-color: RGBA(30, 144, 158, 1);position: absolute;top: 50%;right: 20px;transform: translate(0,-50%)" class="a-upload mr10 search hidden-md-and-down">删除</button>
        </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="usertable" @select-all="selectionAll" @select="selectone">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="ID" label="序号">
        </el-table-column>
        <el-table-column prop="Name" label="部门名称">
        </el-table-column>
        <el-table-column prop="Description" label="部门描述">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
        </el-table-column>
    </el-table>

    <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>
    <el-dialog title="部门操作" :visible.sync="deptAddVisible" :modal-append-to-body="false" width="663px" top="100px">
        <el-form label-width="100px" label-position="right" class="demo-ruleForm">
            <el-form-item label="部门名称">
                <el-input v-model="Name" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item label="部门描述">
                <el-input v-model="Description"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
            <el-button type="primary" @click="dialog_submit" style="background-color: #1e639e;border: none">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import gh_table from '@/components/common/table'
import pagination from '@/components/common/pagination'
export default {
    name: "userManager",
    components: {
        'gh_table': gh_table,
        'pagination': pagination,
    },
    data() {
        return {
            keyword: '',
            tableData: [],
            total: 0,
            currentPage: 1,
            deptAddVisible: false,
            // User: new User(),
            Name:'',
            Description:'',
            deleteUsers: [],
            role: "",
            roleVisible: false,
            roleData: [],
            ID:0,
            edit:false,
            
        }
    },
    mounted() {
        this.loadAllDepts();
    },
    methods: {
        selectionAll(selection) {
            if (selection.length > 0) {
                let id = [];
                selection.forEach((v, k) => {
                    id.push(v.ID);
                });
                this.deleteUsers = id;
            } else if (selection.length === 0) {
                this.deleteUsers = [];
            }
        },
        selectone(selection) {
            if (selection.length === 0) {
                this.deleteUsers = [];
            } else if (selection.length > 0) {
                let id = [];
                selection.forEach((v, k) => {
                    id.push(v.ID);
                });
                this.deleteUsers = id;
            }

        },
        search() {
            this.loadAllDepts();
        },
        deptAdd() {
            this.edit=false;
            this.deptAddVisible = true;
            this.Name="";
            this.Description="";
        },
        deptDelete() {
            if (this.deleteUsers.length === 0) {
                this.$message.error("请选择要删除的用户");
                return;
            }
            this.$ajax.get(this.$URL + '/config/DeleteDepts', {
                params: {
                    ids: this.deleteUsers
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type:'success',
                        message:"删除成功"
                    });
                    this.loadAllDepts();
                } else if (!result.data.success) {
                    this.$message.error("删除失败");
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadAllDepts() {
            this.$ajax.get(this.$URL + '/config/GetTableDept', {
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
        onSelect(v) {
            console.log(v);
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val
            this.loadAllDepts();
        },
        dialog_submit() {
            this.$ajax.get(this.$URL + '/config/AddDepartment',{
                params:{
                    id:this.edit?this.ID:0,
                    name:this.Name,
                    description:this.Description?this.Description:''
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type:'success',
                        message:'操作成功'
                    });
                    this.deptAddVisible = false;
                    this.loadAllDepts();
                } else if (!result.data.success) {
                    this.$message.error("操作失败");
                }
            }).catch((err) => {
                this.$message.error(err);
            });
        },
        handleEdit(i, data) {
            this.deptAddVisible = true;
            this.edit=true;
            if (data) {
                this.ID=data.ID;
                this.Name = data.Name;
                this.Description=data.Description;
            }
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
