<template>
<el-select v-model="checked_value" placeholder="请选择" @change="change_select" filterable clearable :disabled="disabled" :multiple="multiple">
    <el-option v-for="item in options" :key="item.Id" :label="item.Name" :value="item.Id">
    </el-option>
</el-select>
</template>

<script>
import {
    Public_GetAllCate
} from '@/api/Public'
export default {
    props: {
        value: {
            default: null
        },
        cate: {
            type: String,
            default: () => {
                return 'user'
            }
        },
        id: {
            type: String,
            default: () => {
                return ''
            }
        },
        disabled: {
            type: Boolean,
            default: () => {
                return false
            }
        },
        multiple: {
            type: Boolean,
            default: () => {
                return false
            }
        },
    },
    watch: {
        id() {
            this.getList()
            this.checked_value = null
        }
    },
    data() {
        return {
            options: [],
            checked_value: this.value,
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        change_select(val) {
            this.$emit('change', val)
        },
        getList() {
            let data = {
                cate: this.cate,
                id: this.id
            }
            Public_GetAllCate(data).then(res => {
                this.options = res.Data
            })
        },

    }
}
</script>

<style scoped>
.filter_span {
    font-size: 12px;
}
</style>
