<template>
<el-select v-model="checked_value" :filterable="filterable" :multiple="multiple" :style="styles" placeholder="请选择" clearable @change="change_select">
    <el-option v-for="item in data_select" :key="item.key" :label="item.label" :value="item.key" />
</el-select>
</template>

<script>

export default {
    props: {
        //是否多选
        type: {
            default: 'department'
        },
        multiple: {
            default: false
        },
        //是否可搜索
        filterable: {
            default: false
        },
        data_checked_value: {
            default: ''
        },
        styles: {
            default: function () {
                return {
                    width: ''
                }
            }
        },
    },
    data() {
        return {
            data_select: [],
            checked_value: this.data_checked_value
        }
    },
    mounted() {
        if (this.type == 'department') {
            this.$ajax.get(this.$URL + '/department/LoadDeparts').then(result => {
                if (result.status == 200 && result.data.success) {
                    this.data_select = result.data.data;
                }
            });
        } else if (this.type == 'area') {
            this.$ajax.get(this.$URL + '/sysArea/LoadSysArea').then(result => {
                if (result.status == 200 && result.data.success) {
                    this.data_select = result.data.data;
                }
            });

        }
    },
    methods: {
        change_select(val) {
            this.$emit('value', val)
        }

    }
}
</script>

<style>
.filter_span {
    font-size: 12px !important;
}
</style>
