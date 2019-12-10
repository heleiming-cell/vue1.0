<template>
<el-cascader clearable :options="systemAreaTree" v-model="systemArea" @change="handleChange" :props="defaultProps">
</el-cascader>
</template>

<script>
export default {
    props: {
        systemAreaData: {
            default: null
        },
        SysCode: {
            default: null
        },
        defaultProps: {
            default: function () {
                return {
                    label: 'Name',
                    value: 'ID'
                }
            }
        }
    },
    data() {
        return {
            systemAreaTree: [],
            systemArea: this.systemAreaData
        }
    },
    mounted() {
        if (this.SysCode != null && this.SysCode != '') {
            this.getSystemAreaList()
        }
    },
    methods: {
        getSystemAreaList() {
            this.$ajax.get(this.$URL + '/AreaMenu/LoadAreaMenuBySysId', {
                params: {
                    id: this.SysCode
                }
            }).then(result => {
                if (result.status == 200 && result.data.success) {
                    this.systemAreaTree = result.data.data;
                    this.deleteNullData(this.systemAreaTree);
                }
            });
        },
        deleteNullData(data) {
            for (let i in data) {
                if (data[i].children && data[i].children.length == 0) {
                    delete data[i].children;
                } else {
                    this.deleteNullData(data[i].children);
                }
            }
            data = eval(data);
        },
        handleChange(val) {
            this.$emit("value", val)
        }
    },
    watch: {
        SysCode(val) {
            if (this.SysCode != null && this.SysCode != '') {
                this.getSystemAreaList()
            }
        },
        systemAreaData(val) {
            this.systemArea = this.systemAreaData
        }
    }
}
</script>

<style>

</style>
