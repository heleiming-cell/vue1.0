<template>
<!-- 维保计划-新建计划 -->
<div class="dialogAddContainer">
    <el-dialog :title="title" :visible.sync="addDialogVisible" v-if="addDialogVisible">
        <el-form :model="planForm" label-width="120px" :inline="true">
            <el-form-item label="计划名称：">
                <el-input v-model="planForm.PlanName"></el-input>
            </el-form-item>
            <el-form-item label="资产类型：">
                <el-select v-model="planForm.DeviceCategoryName" placeholder="请选择" @change="deviceChange">
                    <el-option v-for="(item,index) in options" :key="index" :label="item.Name" :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="计划状态：">
                <el-radio-group v-model="planForm.State">
                    <el-radio label="启用">启用</el-radio>
                    <el-radio label="停用">停用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="维保间隔：">
                <el-input v-model="planForm.Days" class="interval">
                    <template slot="append">天</template></el-input>
            </el-form-item>
            <el-form-item label="执行周期：">
                <el-radio-group v-model="planForm.Period">
                    <el-radio label="单次">单次</el-radio>
                    <el-radio label="循环">循环</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="执行时间：">
                <el-date-picker v-model="planForm.ExecuteTime" type="datetime" placeholder="选择日期时间：">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="关联维保标准：">
                <el-select v-model="planForm.knowledge" placeholder="请选择" @change="knowledgeChange">
                    <el-option v-for="(item,i) in relevanceOption" :key="i" :label="item.Name" :value="item.Id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关联设备：">
                <el-button type="primary" size="mini" @click="addDevice">添加设备</el-button>
                <el-input type="textarea" v-model="planForm.DeviceList"></el-input>
            </el-form-item>
            <el-form-item label="计划详情：">
                <el-input type="textarea" :rows="5" v-model="planForm.textarea" class="textArea"></el-input>
            </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {
    Device_QueryList
} from '../../api/planList'
export default {
    props: {
        visible: {
            type: Boolean,
            default: ''
        },
        pageType: {
            type: String,
            default: ''
        },
        modification: {
            default: ''  //修改单条数据的值
        },
        deviceoption: {
            type: Array,
            default: "",
        }
    },
    data() {
        return {
            addDialogVisible: false,
            planForm: {
                PlanName: "",
                DeviceCategoryName: "",
                State: "",
                Days: "",
                Period: "", //周期
                ExecuteTime: "",
                knowledge: "", //维保标准
                DeviceList: "", //关联设备
            },
            title: "",
            options: this.deviceoption,
            relevanceOption: [],
            deviceId: null, //资产类型id
            DeviceCategoryId: '',
        }
    },
    methods: {
        addClose() {

        },
        // 资产类型下拉列表
        deviceChange(val) {
            this.deviceId = val
        },
        //关联维保标准
        knowledgeChange(val) {
            console.log(val)
        },
        // 添加设备
        addDevice() {
            let params = {
                page: 1,
                size: 200,
                OrderBys: [],
                Conditions: [{
                    Key: "CategoryId",
                    Operator: 0,
                    Value: this.DeviceCategoryId,
                }]
            }
            Device_QueryList(params).then(res => {
                // console.log(res)
            })
        }

    },
    watch: {
        visible(n) {
            this.addDialogVisible = n;
        },
        addDialogVisible(n) {
            if (!n) {
                this.$emit('close')
            }
        },
        pageType(n) {
            if (n == "edit") {
                this.title = "修改计划详情"
            } else {
                this.title = "新建计划详情"
            }
        },
        modification(n) {
            this.planForm = n;
            console.log(n)
            this.relevanceOption = n.StandardItem;
        },
        deviceoption(n) {
            // console.log(n)

        }
    },
    mounted() {
        // if (this.modification) {
        //     console.log(this.deviceoption)
        //     this.deviceoption.forEach(item => {
        //         if (item.Name == this.modification.Name) {
        //             console.log(item.Id)
        //         }

        //     })

        // }
    }
}
</script>

<style lang="scss" scoped>
.dialogAddContainer {
    .el-dialog__body {
        padding: 50px 10px !important;
    }

    .el-form--inline .el-form-item {
        width: 440px;
        text-align: left;

        &:last-child {
            width: 95%;

            .textArea {
                width: 400%;
            }
        }

        .interval {
            width: 90%;
        }

    }

    // .textArea{
    //   width: 1000px;
    // }
}

.el-dialog__body {
    text-align: left;
}
</style>
