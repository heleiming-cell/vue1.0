<template>
<div class="Container">
    <div class="filter">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
            <el-form-item label="模版名称：">
                <el-input v-model="formInline.Name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData">
        <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
        <el-table-column label="模版名称" prop="Name" align="center"></el-table-column>
        <el-table-column label="创建人" prop="CreaterName" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="CreateTime" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleEditTemplate(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="handleDelete(scope.row)" style="color:#F18573">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="add-new">
        <el-button type="primary" @click="handleEditTemplate(null)" size="small">新建模版</el-button>
    </div>
</div>
</template>

<script>
import {Templet_QueryList,Templet_Del,Templet_AddOrUpdate} from '@/api/Templet'
export default {
    data() {
        return {
            formInline: {
                Name: ''
            },
            tableData: []
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList(){
            let data = {
                Page:1,
                Size:0,
                OrderBys:[
                  {
                    Sort:"CreateTime",
                    Order:"Desc"
                  }
                ],
                Conditions:[{
                    Sort:"CreateTime",
                    Order:"DESC"
                }]
            }
            Templet_QueryList(data).then(result =>{
                this.tableData = result.Data.Data
            })
        },
        handleEdit(row) {

        },
        handleDelete(row) {
            this.$confirm('是否确认删除该模版?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                Templet_Del({id:row.Id}).then(result =>{
                    this.getList();
                    this.$message.success("删除成功")
                })
            })
        },
        handleEditTemplate(row) {
            this.$router.push({
                path:"/templateEdit",
                query: {
                    data: row
                }
            })
        }
    }
}
</script>

<style lang="scss" scope>
.filter {
    text-align: left;
    padding: 10px;
}

.add-new {
    text-align: right;

    >button {
        margin-top: 10px;
        margin-right: 10px;
    }
}
</style>
