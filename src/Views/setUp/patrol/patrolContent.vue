<template>
<div class="h100" style="overflow:scroll">
    <div class="filter">
        <div class="filter_line">
            <el-input placeholder="支持 名称 查询" v-model="KeyWord"></el-input>
        </div>
        <div class="filter_line">
            <button class="search" @click="loadAllContents"> 查询</button>
            <button class="search" @click="addData" style="width: 114px;background-color: green;position: absolute;top: 50%;right: 154px;transform: translate(0,-50%)">新增</button>
        </div>
    </div>
    <el-table class="standardTable" :data="list" fit :highlight-current-row="false">
        <el-table-column align="center" label="编号" width="95">
            <template slot-scope="scope">
                {{ scope.row.Code }}
            </template>
        </el-table-column>
        <el-table-column align="center" label="标准名称">
            <template slot-scope="scope">
                {{ scope.row.Name }}
            </template>
        </el-table-column>
        <el-table-column align="center" label="标准详情">
            <template slot-scope="scope">
                <el-tree :data="StandardDetail(scope.row.Standard)" v-if="StandardDetail(scope.row.Standard).length>0" :props="defaultProps">
                    <span class="custom-tree-node-div" slot-scope="{ node, data }" :title="data.label">{{data.label}}</span>
                </el-tree>
            </template>
        </el-table-column>
        <el-table-column align="center" label="标准类型">
            <template slot-scope="scope">
                {{ scope.row.StandardTypeName }}
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="editStandard(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteData(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination :page-size="size" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <el-dialog :visible.sync="dialogVisible" v-if="dialogVisible" :title="dialogTitle" center>
        <div class="dialogClass">
            <el-form label-position="right" :model="StandardData" :rules="formPointStandardRules" ref="dialogPointStandard">
                <el-form-item label="标准名称：" label-width="120px" prop="StandardName">
                    <el-input v-model="StandardData.StandardName" placeholder="标准名称"></el-input>
                </el-form-item>
                <el-form-item label="标准编号：" label-width="120px" prop="Code">
                    <el-input v-model="StandardData.Code" placeholder="标准编号"></el-input>
                </el-form-item>
                <el-form-item label="标准类型：" label-width="120px" prop="TypeId">
                    <AllCate :data_checked_value="StandardData.TypeId" @value="selectAllCate" :type="'StandardType'" />
                </el-form-item>
                <el-form-item label="标准内容：" label-width="120px">
                    <el-button size="mini" type="primary" @click="append(StandardData.Standard)" v-if="StandardData.Standard.length == 0">添加</el-button>
                    <el-tree v-if="StandardData.Standard.length>0" :data="StandardData.Standard" node-key="label" default-expand-all :expand-on-click-node="false">
                        <span class="custom-tree-node" slot-scope="{ node, data }" :title="node.label">
                            <span>{{ node.label }}</span>
                            <span style="position: absolute;top: 0;right: 0;">
                                <el-button type="text" size="mini" @click="() => append(data)">
                                    添加
                                </el-button>
                                <el-button type="text" size="mini" v-if="data.label!=='标准列表'" @click="() => edit(node, data)">
                                    修改
                                </el-button>
                                <el-button type="text" size="mini" v-if="data.label!=='标准列表'" @click="() => remove(node, data)">
                                    删除
                                </el-button>
                            </span>
                        </span>
                    </el-tree>
                </el-form-item>
            </el-form>

        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关 闭</el-button>
            <el-button type="primary" @click="UpdateStandard('dialogPointStandard')">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogStandard" :title="dialogStandardTitle" center>
        <el-form label-position="right" :model="formStandard" :rules="formStandardRules" ref="dialogStandard">
            <el-form-item label="名称：" label-width="120px" prop="name">
                <el-input v-model="formStandard.name" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="分值：" label-width="120px" prop="score">
                <el-input v-model="formStandard.score" placeholder="分值"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogStandard = false">关 闭</el-button>
            <el-button type="primary" @click="addStandard('dialogStandard')">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import AllCate from '@/components/filter/AllCate.vue'
export default {
    name: "patrolContent",
    components: {
        AllCate
    },
    data() {
        return {
            KeyWord: '',
            list: [],
            total: 0,
            size: 10,
            currentPage: 1,
            pointVisible: false,
            dialogVisible: false,
            dialogStandard: false,
            Name: '',
            content: '',
            deletePoints: [],
            role: "",
            roleVisible: false,
            roleData: [],
            ID: 0,
            // edit: false,
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            formPointStandardRules: {
                StandardName: [{
                    required: true,
                    message: '请输入标准名称',
                    trigger: 'blur'
                }, ],
                Code: [{
                    required: true,
                    message: '请输入标准编号',
                    trigger: 'blur'
                }, ],
                DepartmentCode: [{
                    required: true,
                    message: '请选择部门',
                    trigger: 'change'
                }, ],
            },
            formStandardRules: {
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }, ],
            },
            StandardItemData: '',
            formStandard: {
                name: '',
                score: ''
            },
            dialogStandardTitle: '',
            StandardData: {
                Id: '',
                StandardName: '',
                DepartmentCode: '',
                Standard: [],
                State: 1,
                Code: "",
                TypeId: "",
            },
        }
    },
    mounted() {
        this.loadAllContents();
    },
    methods: {
        selectAllCate(val) {
            this.StandardData.TypeId = val
        },
        append(data) {
            this.formStandard = {
                name: '',
                score: ''
            }
            this.dialogStandardTitle = '新建标准'
            this.StandardItemData = data
            this.dialogStandard = true
        },
        StandardDetail(s) {
            if (s == '') {
                return []
            }
            return JSON.parse(s)
        },
        addData() {
            this.dialogTitle = "新建标准"
            this.StandardData = {
                Id: '',
                StandardName: '',
                DepartmentCode: '',
                Standard: [],
                State: 1,
                Code: "",
                TypeId: "",
            }
            this.dialogVisible = true
        },
        addStandard(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.dialogStandardTitle == '新建标准') {
                        if (!this.StandardItemData.children) {
                            let newChild = {
                                label: this.formStandard.name,
                                score: this.formStandard.score ? this.formStandard.score : 0,
                                flag: 1,
                                children: [],
                                id: this.randomWord(false, 6),
                                pid: null
                            };
                            this.StandardItemData.push(newChild)
                        } else {
                            let newChild = {
                                label: this.formStandard.name,
                                score: this.formStandard.score ? this.formStandard.score : 0,
                                flag: 1,
                                children: [],
                                id: this.randomWord(false, 6),
                                pid: this.StandardItemData.id
                            };
                            this.StandardItemData.children.push(newChild);
                        }

                    } else {
                        this.StandardItemData.label = this.formStandard.name
                        this.StandardItemData.score = this.formStandard.score
                        this.StandardItemData.flag = 1
                    }
                    this.dialogStandard = false
                } else {
                    return false
                }
            })

        },
        remove(node, data) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
        },
        edit(node, data) {
            this.dialogStandardTitle = '编辑标准'
            this.StandardItemData = data
            this.formStandard.name = data.label
            this.formStandard.score = data.score
            this.dialogStandard = true
        },
        deptDelete() {
            if (this.deletePoints.length === 0) {
                this.$message.error("请选择要删除的巡检事项");
                return;
            }
            this.$ajax.get(this.$URL + '/patrol/DeleteContents', {
                params: {
                    ids: this.deletePoints
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.$message({
                        type: 'success',
                        message: "删除成功"
                    });
                    this.loadAllContents();
                } else if (!result.data.success) {
                    this.$message.error("删除失败");
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        loadAllContents() {
            this.$ajax.get(this.$DMURL + '/SysStandard/GetList', {
                params: {
                    KeyWord: this.KeyWord,
                    Page: this.currentPage,
                    Size: this.size,
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.list = result.data.data;
                    this.total = result.data.count;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        UpdateStandard(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        Id: this.StandardData.Id,
                        Name: this.StandardData.StandardName,
                        TypeId: this.StandardData.TypeId,
                        Standard: JSON.stringify(this.StandardData.Standard),
                        Code: this.StandardData.Code,
                    }
                    this.$ajax.post(this.$DMURL + '/SysStandard/UpdateOrNew', data).then((result) => {
                        if (result.status === 200 && result.data.success) {
                            this.dialogVisible = false
                            this.loadAllContents()
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    return false
                }
            })

        },
        deleteData(row) {
            this.$confirm('此操作将永久删除该标准, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.get(this.$DMURL + '/SysStandard/Del', {
                    params: {
                        ID: row.Id
                    }
                }).then(result => {
                    if (result.status === 200 && result.data.success) {
                        this.loadAllContents()
                    }
                });
            })
        },
        editStandard(row) {
            this.dialogTitle = "编辑标准"
            this.StandardData = {
                Id: row.Id,
                StandardName: row.Name,
                DepartmentCode: "",
                Standard: JSON.parse(row.Standard),
                // State:JSON.parse(row.State),
                Code: row.Code,
                TypeId: row.StandardTypeId,
            }
            this.dialogVisible = true
        },
        //随机字符串
        randomWord(randomFlag, min, max) {
            var str = "",
                range = min,
                arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

            // 随机产生
            if (randomFlag) {
                range = Math.round(Math.random() * (max - min)) + min;
            }
            for (var i = 0; i < range; i++) {
                let pos = Math.round(Math.random() * (arr.length - 1));
                str += arr[pos];
            }
            return str;
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.currentPage = val
            this.loadAllContents();
        },
    }
}
</script>

<style lang="less" scoped>

table {
    height: 100% !important;
}

.custom-tree-node {
    width: 80%;
    position: relative;
    padding-right: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.custom-tree-node-div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
