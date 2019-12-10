<template>
<div class="box">
    <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="标准名称：">
            <el-input placeholder="标准名称" v-model="KeyWord" clearable @change="()=>{KeyWord==''?getList():''}" @keyup.enter.native="getList"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
    </el-form>
    <el-table class="standardTable" v-loading="listLoading" :data="list" element-loading-text="Loading"  fit >
        <el-table-column align="center" label="编号" width="200">
            <template slot-scope="scope">
                {{ scope.row.StandardCode }}
            </template>
        </el-table-column>
        <el-table-column align="center" label="标准名称">
            <template slot-scope="scope">
                {{ scope.row.StandardName }}
            </template>
        </el-table-column>
        <el-table-column align="center" label="标准详情">
            <template slot-scope="scope">
                <el-tree class="standardElTree" :data="StandardDetail(scope.row.Standard)" v-if="StandardDetail(scope.row.Standard).length>0" :props="defaultProps">
                    <span class="custom-tree-node-div" slot-scope="{ node, data }" :title="data.label">{{data.label}}</span>
                </el-tree>
            </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
            <template slot-scope="scope">
                <el-button size="mini" @click="SetStateStandard(scope.row)" :type="scope.row.State==1?'success':'info'" plain>{{scope.row.State==1?'启用':'停用'}}</el-button>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <!-- <el-button type="text" size="small" >删除</el-button> -->
                <el-button type="text" size="small" @click="editStandard(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="footerBtn">
        <el-button type="primary" @click="addData">新建标准</el-button>
    </div>
    <el-pagination :page-size="listQuery.limit" @current-change="handleCurrentChange" @prev-click="handleCurrentChange" @next-click="handleCurrentChange" background layout="total,prev, pager, next" :total="total">
    </el-pagination>
    <el-dialog  :visible.sync="dialogVisible" v-if="dialogVisible" :title="dialogTitle" center>
        <div class="dialogClass">
            <el-form label-position="right" :model="StandardData" :rules="formPointStandardRules" ref="dialogPointStandard">
                <el-form-item label="标准名称：" label-width="120px" prop="StandardName">
                    <el-input v-model="StandardData.StandardName" placeholder="标准名称"></el-input>
                </el-form-item>
                <el-form-item label="标准类型：" label-width="120px" prop="StandardName">
                    <el-select v-model="StandardData.Type" placeholder="请选择">
                        <el-option v-for="item in standardOptions" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="管理部门：" label-width="120px" prop="DepartStr" v-if="StandardData.Type=='现场巡保标准'">
                    <SelectDepartment :departmentData="StandardData.DepartStr" @value="selectAllCate" />
                </el-form-item>
                <el-form-item label="资产类型：" label-width="120px" prop="CatecotyId" v-if="StandardData.Type=='资产巡检标准'">
                    <deviceType :areaData="StandardData.CatecotyId" @value="selectCatecotyId" />
                </el-form-item>
                <el-form-item label="标准状态：" label-width="120px" prop="State">
                    <el-radio-group v-model="StandardData.State">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="标准内容：" label-width="120px">
                    <el-button size="mini" type="primary" @click="append(StandardData.Standard)" v-if="StandardData.Standard.length == 0">添加</el-button>
                    <el-tree v-if="StandardData.Standard.length>0" :data="StandardData.Standard" node-key="label" default-expand-all :expand-on-click-node="false" class="standardElTree">
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
    <el-dialog  :visible.sync="dialogStandard" :title="dialogStandardTitle" center>
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
import deviceType from '@/components/filter/DeviceType'
import SelectDepartment from '@/components/filter/SelectDepartment'
export default {
    components:{deviceType,SelectDepartment},
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: 'success',
                draft: 'gray',
                deleted: 'danger'
            }
            return statusMap[status]
        }
    },
    data() {
        return {
            list: null,
            listLoading: false,
            total: 0,
            listQuery: {
                page: 1,
                limit: 10,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: "+id"
            },
            KeyWord: '',
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            dialogVisible: false,
            dialogTitle: '新建标准',
            dialogStandardTitle: '新建标准',
            dialogStandard: false,
            formStandard: {
                name: '',
                score: ''
            },
            formPointStandardRules: {
                StandardName: [{
                    required: true,
                    message: '请输入标准名称',
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
                score: [{
                    required: true,
                    message: '请输入分值',
                    trigger: 'blur'
                }, ],
            },
            StandardData: {
                Id: '',
                StandardName: '',
                DepartmentCode: "",
                Standard: [],
                State: 1,
                Type: "",
                CatecotyId: 0
            },
            StandardItemData: '',
            standardOptions: ['资产巡检标准', '现场巡保标准']
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            let data = {
                KeyWord: this.KeyWord,
                Page: this.listQuery.page,
                Size: this.listQuery.limit,
                type: ""
            }
            this.$ajax.get(this.$URL + '/SysStandard/GetStandardList', {
                params: data
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.list = result.data.data;
                    this.total = result.data.count
                    this.listLoading = false
                }
            });
        },
        //标准详情
        StandardDetail(s) {
            if (s == '') {
                return []
            }
            return JSON.parse(s)
        },
        //新建标准
        addData() {
            this.dialogTitle = "新建标准"
            this.StandardData = {
                Id: '',
                StandardName: '',
                DepartmentCode: "",
                Standard: [],
                State: 1,
                Type: "",
                CatecotyId: 0
            }
            this.dialogVisible = true
        },
        //编辑标准
        editStandard(row) {
            this.dialogTitle = "编辑标准"
            this.StandardData = {
                Id: row.Id,
                StandardName: row.StandardName,
                DepartmentCode: row.DepartmentId,
                Standard: JSON.parse(row.Standard),
                State: JSON.parse(row.State),
                Type: row.StandardType,
                CatecotyId: row.CatecotyId,
                DepartStr: JSON.parse(row.DepartStr) || [],
            }
            console.log(this.StandardData)
            this.dialogVisible = true
        },
        //点击添加标准
        append(data) {
            this.formStandard = {
                name: '',
                score: ''
            }
            this.dialogStandardTitle = '新建标准'
            this.StandardItemData = data
            this.dialogStandard = true
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
            this.dialogStandard = true
        },
        //保存标准名称和分值
        addStandard(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.dialogStandardTitle == '新建标准') {
                        if (!this.StandardItemData.children) {
                            let newChild = {
                                label: this.formStandard.name,
                                score: this.formStandard.score,
                                flag: true,
                                children: [],
                                id: this.randomWord(false, 6),
                                pid: null
                            };
                            this.StandardItemData.push(newChild)
                        } else {
                            let newChild = {
                                label: this.formStandard.name,
                                score: this.formStandard.score,
                                flag: true,
                                children: [],
                                id: this.randomWord(false, 6),
                                pid: this.StandardItemData.id
                            };
                            this.StandardItemData.children.push(newChild);
                        }

                    } else {
                        this.StandardItemData.label = this.formStandard.name
                        this.StandardItemData.score = this.formStandard.score
                        this.StandardItemData.flag = true
                    }
                    this.dialogStandard = false
                } else {
                    return false
                }
            })

        },
        //提交标准
        UpdateStandard(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        Id: this.StandardData.Id,
                        StandardName: this.StandardData.StandardName,
                        DepartmentId: this.StandardData.DepartmentCode,
                        Standard: JSON.stringify(this.StandardData.Standard),
                        State: this.StandardData.State,
                        Type: this.StandardData.Type,
                        CatecotyId: this.StandardData.CatecotyId || 0,
                        DepartStr: this.StandardData.DepartStr,
                    }
                    this.$ajax.post(this.$URL + '/SysStandard/UpdateOrNew', data).then(result => {
                        if (result.status == 200 && result.data.success) {
                            this.dialogVisible = false
                            this.getList()
                            this.$message.success('保存成功！')
                        }
                    });
                } else {
                    return false
                }
            })

        },
        //选择部门
        selectAllCate(val) {
            this.StandardData.DepartmentCode = val[val.length - 1]
            this.StandardData.DepartStr = val
        },
        //选择资产类型
        selectCatecotyId(val) {
            this.StandardData.CatecotyId = val
        },
        //设置巡检点启用状态
        SetStateStandard(row) {
            let data = {
                standDard: row.Id,
                state: row.State == 1 ? 0 : 1
            }
            this.$ajax.get(this.$URL + '/SysStandard/SetStandardState', {
                params: data
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.getList()
                    this.$message.success('操作成功！')
                }
            });
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
            this.listQuery.page = val
            this.getList();
        }
    }
}
</script>

<style scoped>
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

.footerBtn {
    margin: 10px 0;
    width: 100%;
    text-align: right;
}
</style>
