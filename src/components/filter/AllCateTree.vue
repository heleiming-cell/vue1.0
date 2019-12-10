<template>
<!-- <el-select v-model="checked_value" :filterable="filterable" :multiple="multiple" :style="styles" placeholder="请选择" clearable @change="change_select">
    <el-option v-for="item in data_select" :key="isCode?item.Code:item.Id" :label="item.Name" :value="isCode?item.Code:item.Id"/>
  </el-select> -->
<el-cascader ref="cascaderAllCateTree" :options="data_select" v-model="checked_value" :filterable="filterable" :disabled="disabled" :multiple="multiple" :style="styles" :props="defaultProps" placeholder="请选择" :change-on-select="changeOnSelect" clearable @change="change_select">
</el-cascader>
</template>

<script>
// import { AllCateTree } from '@/api/select'
import { Init } from '@/lib/allCateTree'

export default {
    props: {
        //请求的数据
        type: {
            default: 'department'
        },
        //是否返回code
        isCode: {
            default: false
        },
        //是否禁止编辑
        disabled: {
            default: false
        },
        //是否允许选择任意一级
        changeOnSelect: {
            default: false
        },
        //是否多选
        multiple: {
            default: false
        },
        //是否多选
        filterable: {
            default: false
        },
        data_checked_value: {
            default: null
        },
        styles: {
            default: function () {
                return {
                    width: ''
                }
            }
        },
        span_style: {
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            data_select: [],
            checked_value: [],
            defaultProps: {
                label: "Name",
                value: "Id",
            }
        }
    },

    mounted() {
        if (!this.isCode) {
            this.defaultProps = {
                label: "Name",
                value: "Id",
            }
        } else {
            this.defaultProps = {
                label: "Name",
                value: "Code",
            }
        }
        let data = {
            key: this.type
        }
        this.AllCateTree();
    },
    methods: {
        AllCateTree() {
            this.$ajax.get(this.$DMURL + '/User/AllCateTree',{
              params:{
                key:this.type
              }
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.data_select = this.changeData(result.data.data);
                    this.checked_value = Init(this.data_select, Number(this.data_checked_value))
                }
            });
        },
        change_select(val) {
            let str = ""
            if (val.length > 0) {
                str = val[val.length - 1]
            }

            let label = this.$refs['cascaderAllCateTree'].getCheckedNodes()[0]?this.$refs['cascaderAllCateTree'].getCheckedNodes()[0].label:"";
            // if (this.$refs['cascaderAllCateTree'].currentLabels.length > 0) {
            //     label = this.$refs['cascaderAllCateTree'].currentLabels[this.$refs['cascaderAllCateTree'].currentLabels.length - 1]
            // }
            this.$emit('value', str, label)
        },
        changeData(TREE) {
            TREE.forEach(item => {
                item.Name = item.Code + " " + item.Name
                if (item.children && item.children.length > 0) {
                    this.changeData(item.children)
                }
            });

            return TREE
        }
    }
}
</script>

<style>
.filter_span {
    font-size: 12px !important;
}
</style>
