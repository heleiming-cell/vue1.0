<template>
<el-cascader clearable :options="departmentMenuTree" v-model="departmentMenu" @change="handleChange" :props="defaultProps"></el-cascader>
</template>

<script>
export default {
    props: {
        //是否多选
        optional: {
            default: true,
            type: Boolean
        },
        departmentData: {
            default: null
        },
        defaultProps: {
            default: function () {
                return {
                    label: "label",
                    value: "key"
                };
            }
        },
        styles: {
            default: function () {
                return {
                    width: ""
                };
            }
        }
    },
    data() {
        return {
            departmentMenuTree: [],
            departmentMenu: this.departmentData
        };
    },
    mounted() {
        this.GetDepartment();
    },
    methods: {
        GetDepartment() {
            this.$ajax.get(this.$URL + '/department/LoadDeparts').then(result => {
                if (result.status == 200 && result.data.success) {
                    this.departmentMenuTree = result.data.data;
                    this.deleteNullData(this.departmentMenuTree);
                }
            });
        },
        handleChange(val) {
            this.$emit("value", val);
        },
        // 递归删除区域下面的空data
        deleteNullData(data) {
            for (let i in data) {
                if (data[i].children && data[i].children.length == 0) {
                    delete data[i].children;
                } else {
                    this.deleteNullData(data[i].children);
                }
            }
            data = eval(data);
        }
    },
    watch: {
        departmentData(val) {
            this.departmentMenu = this.departmentData;
            console.log(this.departmentMenu);
        }
    }
};
</script>

<style>
.filter_span {
    font-size: 12px !important;
}
</style>
