<template>
<div class="dialogDetailContainer">
    <el-dialog :visible.sync="dialogVisible" :title="title+'-详情'" v-if="dialogVisible">
        <el-row>
            <el-col>
                <el-form :model="detailForm" label-width="140px" :inline="true" ref="detailForm">
                    <el-form-item label="计划名称：">
                        <div>{{detailForm.PlanName}}</div>
                    </el-form-item>
                    <el-form-item label="计划编号：">
                        <div>{{detailForm.PlanNumber}}</div>
                    </el-form-item>
                    <el-form-item label="创建人：">
                        <div>{{detailForm.CreaterName}}</div>
                    </el-form-item>
                    <el-form-item label="创建时间：">
                        <div>{{detailForm.CreateTime}}</div>
                    </el-form-item>
                    <el-form-item label="修改人：">
                        <div>{{detailForm.UpdaterName}}</div>
                    </el-form-item>
                    <el-form-item label="修改时间：">
                        <div>{{detailForm.LastUpdateTime}}</div>
                    </el-form-item>
                    <el-form-item label="资产类型：">
                        <div>{{detailForm.DeviceCategoryName}}</div>
                    </el-form-item>
                    <el-form-item label="关联维保标准：">
                        <span v-for="(item,i) in detailForm.StandardItem" :key="item.Id" class="standard">{{i+1}}、{{item.Name}} </span>
                    </el-form-item>
                    <el-form-item label="计划状态：">
                        <el-button size="small" class="start">{{detailForm.State}}</el-button>
                    </el-form-item>
                    <el-form-item label="维保周期：">
                        <div>{{detailForm.Days}} 天</div>
                    </el-form-item>
                    <el-form-item label="执行次数：" class="Period">
                        <div>{{detailForm.Period}}</div>
                    </el-form-item>
                    <el-form-item label="项目">
                        <Project :value="detailForm.ProjectId" :cate="'project'" @change="changeProjectId" />
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col class="equipmentTable">
                <div>关联设备：</div>
                <div class="equipment">
                    <span v-for="(item,i) in detailForm.DeviceList" :key="i">{{item.Name}}</span>
                </div>
            </el-col>
        </el-row>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false" size="small">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import Project from '@/components/filter/Project'
export default {
    components: {
        Project
    },
    props: {
        visible: {
            type: Boolean,
            default: '',
        },
        detailData: {
            default: '',
        }
    },
    data() {
        return {
            dialogVisible: false,
            detailForm: this.detailData,
            title: "",

        }
    },
    watch: {
        visible(n) {
            this.dialogVisible = n;
        },
        dialogVisible(n) {
            if (!n) {
                this.$emit('close')
            }
        },
        detailData(row) {
            this.detailForm = row;
            this.title = this.detailForm.PlanNumber
        }
    }
}
</script>

<style lang="scss" scoped>
.dialogDetailContainer {
    .el-form--inline .el-form-item {
        width: 440px;
        text-align: left;

        .standard {
            font-size: 12px;
        }
    }

    .Period {
        float: left;
    }

    .equipmentTable {
        margin: 0 0 0 62px;
        color: #D2D3D5;

        div {
            text-align: left;
            margin-bottom: 10px;
        }

        .equipment {
            max-width: 600px;
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #376BCB;

            span {
                display: inline-block;
                width: 200px;
                box-sizing: border-box;
                padding: 10px 15px;
                border-right: 1px solid #376BCB;
                border-bottom: 1px solid #376BCB;
            }
        }
    }
}

.start {
    border: 1px solid #0072FF;
    background: #03265A;
    color: #CADBF8;
}

.el-dialog__body {
    text-align: left !important;
}

::-webkit-scrollbar {
    display: none;
}
</style>
