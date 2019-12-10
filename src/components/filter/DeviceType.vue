<template>
<el-select clearable v-model="areaMenu" @change="handleChange" :change-on-select="optional" placeholder="请选择">
    <el-option v-for="item in areaMenuTree" :key="item.ID" :label="item.Name" :value="item.ID">
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
        this.$ajax.get(this.$URL + '/Device/TypeList', {
            params: {
                page: 1,
                size: 1000,
                keyWord: ""
            }
        }).then(result => {
            if (result.status == 200 && result.data.success) {
                this.areaMenuTree = result.data.data;
                // this.deleteNullData(this.areaMenuTree)
                // this.areaMenu = Init(this.areaMenuTree,Number(this.areaData))
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
