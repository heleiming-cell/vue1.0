<template>
<el-select v-model="checked_value" :filterable="filterable" :multiple="multiple" :style="styles" placeholder="请选择" clearable @change="change_select">
    <el-option v-for="item in data_select" :key="isCode?item.Code:item.Id" :label="item.Name" :value="isCode?item.Code:item.Id" />
</el-select>
</template>

<script>
//  import { AllCate } from '@/api/select'

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
        //是否多选
        multiple: {
            default: false
        },
        //是否搜索
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
        span_style: {
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            data_select: [],
            checked_value: this.data_checked_value
        }
    },
    mounted() {
        console.log('334545654')
        console.log(this.checked_value)
        // let data = {
        //     key: this.type
        // }
       this.AllCate();
    },
    methods: {
        change_select(val) {
            this.$emit('value', val)
        },
        AllCate() {
            this.$ajax.get(this.$DMURL + '/user/AllCate', {
                params: {
                    key: this.type
                }
            }).then((result) => {
                if (result.status === 200 && result.data.success) {
                    this.data_select = result.data.data
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }
}
</script>

<style>
.filter_span {
    font-size: 12px !important;
}
</style>
