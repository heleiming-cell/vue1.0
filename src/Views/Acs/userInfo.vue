<template>
<el-row :gutter="10" class="box">
    <el-col class="h100" :xs="24" :sm="24" :md="24" :lg="3" :xl="3">
        <div class="menuheader">
            <div style="float:left"><span>系统部门</span></div>
        </div>
        <el-tree ref="tree" check-strictly @node-click="clickTreeNode" default-expand-all="true" :data="data" :props="defaultProps"></el-tree>
    </el-col>
    <el-col class="h100" :xs="24" :sm="24" :md="24" :lg="21" :xl="21">
        <div class="filter">
            <el-input v-model="keyword" placeholder="支持 姓名卡号 查询" style="width:200px;margin-right:30px"></el-input>
            <el-button type="primary" class="search" @click="search">查询</el-button>
        </div>
        <div class="table">
            <el-table :data="tableData" style="width: 100%" class="usertable">
                <el-table-column prop="employee_name" label="姓名">
                </el-table-column>
                <el-table-column prop="card_no" label="卡号">
                </el-table-column>
                <el-table-column prop="emplyee_code" label="员工编号">
                </el-table-column>
                 <el-table-column prop="deptname" label="部门">
                </el-table-column>
                 <el-table-column prop="emply_type_name" label="用户类型">
                </el-table-column>
                <el-table-column prop="invalidate" label="有效期">
                </el-table-column>
                <el-table-column prop="phone" label="联系方式">
                </el-table-column>
            </el-table>
            <pagination @current-change="handleCurrentChange" :page-size="10" :total="total"></pagination>
        </div>
    </el-col>
</el-row>
</template>

<script>
import pagination from '@/components/common/pagination'
export default {
    name: 'doorinfo',
    data() {
        return {
            data: [],
            tableData: [],
            deptid: '',
            total: 11,
            keyword: '',
            defaultProps: {
                children: 'children',
                label: 'label',
                isLeaf: 'isLeaf'
            },
            currentPage:1
        }
    },
    mounted() {
        this.loadDept();
        this.loadUsers();
    },
    components: {
        'pagination': pagination,
    },
    methods: {
        loadDept() {
            this.$ajax.get(this.$URL + '/acs/GetDeptInfo').then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.data = result.data.data;
                    this.count=result.data.count;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadUsers() {
            this.$ajax.get(this.$URL + '/acs/GetUsers', {
                params: {
                    keyword: this.keyword,
                    deptId: this.deptid,
                    page: this.currentPage,
                    size: 10,
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
        clickTreeNode(data, node, _this) {
            this.currentPage=1;
            if (data) {
                this.deptid = data.key;
                this.loadUsers();
            }
        },
        search() {
            this.currentPage=1;
            this.loadUsers();
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.loadUsers()
        }
    }
}
</script>

<style lang="less" scoped>
.filter {
    display: flex;
    padding: 10px 0;
}

.menuheader {
    line-height: 36px;
    vertical-align: middle;
    padding: 0 10px;
    overflow: hidden;
    background: #051b47;
    margin-top: 10px;
}

.box {
    font-size: 12px;
    margin: 0px !important;
    height: calc(100% - 115px);
}

.green {
    color: green;
}

.red {
    color: red;
}
</style>
