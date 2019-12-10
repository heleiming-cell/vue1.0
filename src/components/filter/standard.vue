<template>
<el-select clearable v-model="areaMenu" @change="handleChange" :change-on-select="optional" placeholder="请选择" multiple>
    <el-option v-for="item in areaMenuTree" :key="item.Id" :label="item.StandardName" :value="item.Id">
    </el-option>
</el-select>
</template>

<script>

export default {
    props: {
        //是否多选
        optional: {
            default: true,
            type: Boolean
        },
        areaData: {
            default: null
        },
        defaultProps: {
            default: function () {
                return {
                    label: 'Name',
                    value: 'ID'
                }
            }
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
            areaMenuTree: [],
            areaMenu: []
        }
    },
    mounted() {
        this.$ajax.get(this.$URL + '/SysStandard/GetStandardList', {
            params: {
                page: 1,
                size: 1000,
                keyWord: "",
                type: "现场巡保标准",
            }
        }).then(result => {
            if (result.status == 200 && result.data.success) {
                this.areaMenuTree = result.data.data;
                this.areaMenu = this.areaData
            }
        });
    },
    methods: {
        handleChange(val) {
            this.$emit('value', val)
        },

    }
}
</script>

<style>
.filter_span {
    font-size: 12px !important;
}
</style>
