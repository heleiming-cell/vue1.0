<template>
<div class="box">
    <el-table :data="tableData" element-loading-text="Loading" fit  style="width: 100%">
        <el-table-column label="模板名称" prop="Name" align="center"></el-table-column>
        <el-table-column label="创建人" prop="CreaterName" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="CreateTime" align="center"></el-table-column>

        <el-table-column label="模板状态" prop align="center">
            <template slot-scope="scope">
                <el-tag @click="ChangeCategoryState(scope.row)" :type="scope.row.State===1?'nomal':'info'">{{scope.row.State===1?'启用':'停用'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.row.Id)">编辑</el-button>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="bottom-btn">
        <el-button type="primary" @click="handleEdit(null)">新增模版</el-button>
    </div>
    <el-pagination :page-size="Size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
</div>
</template>

<script>
export default {
    data() {
        return {
            Page: 1,
            Size: 10,
            total: 0,
            tableData: []
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            let data = {
                page: this.Page,
                size: this.Size,
                state: 2
            };
            this.$ajax.get(this.$URL + '/Sheet/GetCategoryList', {
                params: data
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.tableData = result.data.data;
                    this.total = result.data.count;
                }
            });
        },
        // 编辑模版
        handleEdit(Id) {
            this.$router.push({
                path: "/editModal",
                query: {
                    id: Id
                }
            });
        },
        // 删除模版
        handleDelete(row) {
            this.$confirm("是否确认删除该模板？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$ajax.get(this.$URL + '/Sheet/RemoveSheetCategory', {
                    params: {
                        id: row.Id
                    }
                }).then(result => {
                    if (result.status == 200 && result.data.success) {
                        this.getList();
                        this.$message.success("删除成功");
                    }
                });
            });
        },
        // 预览模版
        clickPreview() {},
        //设置模板状态
        ChangeCategoryState(row) {
            let data = {
                "CateId": row.Id,
                "State": row.State == 1 ? 0 : 1
            }
            this.$ajax.post(this.$URL + '/Sheet/ChangeCategoryState', data).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.$message.success('设置成功！')
                    this.getList();
                }
            });
        },
        handleCurrentChange(val) {
            this.Page = val
            this.getList();
        }
        // 新增模版
        // clickAddModal(Id) {
        //     this.$router.push({
        //         path:'/editModal',
        //         query:{id:Id}
        //     })
        // }
    }
};
</script>

