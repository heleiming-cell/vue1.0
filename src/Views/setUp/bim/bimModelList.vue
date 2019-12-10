<template>
<div class="h100">
    <div class="filter">
        <div class="filter_line">
            <el-input placeholder="支持 名称 查询" v-model="modelname"></el-input>
        </div>
        <div class="filter_line">
            <button class="search" @click="search"> 查询</button>
            <button @click="modelDelete" style="width: 114px;background-color: RGBA(30, 144, 158, 1);position: absolute;top: 50%;right: 20px;transform: translate(0,-50%)" class="a-upload mr10 search hidden-md-and-down">删除</button>
        </div>
    </div>
    <el-table :data="tableData" style="width: 100%" class="usertable" @select-all="selectionAll" @select="selectionAll">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="ModelName" label="模型名称">
        </el-table-column>
        <el-table-column prop="Fileid" label="文件ID">
        </el-table-column>
        <el-table-column prop="UpDateTime" label="上传时间">
        </el-table-column>
    </el-table>

    <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>
  
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
            modelname: '',
            tableData: [],
            total: 0,
            currentPage: 1,
            // User: new User(),
            deleteModels: [],
            // role: "",
            // roleVisible: false,
            // roleData: [],
        }
    },
    mounted() {
        this.loadAllModels();
    },
    methods: {
        selectionAll(selection) {
            if (selection.length > 0) {
                let id = [];
                selection.forEach((v, k) => {
                    id.push(v.ID+'|'+v.FullPath);
                });
                this.deleteModels = id;
            } else if (selection.length === 0) {
                this.deleteModels = [];
            }
        },
        search() {
            this.loadAllModels();
        },
     
        modelDelete() {
            if (this.deleteModels.length === 0) {
                this.$message.error("请选择要删除的模型");
                return;
            }
            this.$ajax.get(this.$URL + '/bim/DeleteModels', {
                params: {
                    ids: this.deleteModels
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type:'success',
                        message:"删除成功"
                    });
                    this.loadAllModels();
                } else if (!result.data.success) {
                    this.$message.error("删除失败");
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadAllModels() {
            this.$ajax.get(this.$URL + '/bim/GetModels', {
                params: {
                    modelName: this.modelname,
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
            this.loadAllModels();
        },
       
      
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
