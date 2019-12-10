<template>
<el-cascader clearable :options="areaMenuTree" v-model="areaMenu" @change="handleChange" :props="defaultProps"></el-cascader>
<!-- :change-on-select="optional" -->
</template>

<script>
// import { GetArea } from "@/api/select.js";
// import { Init } from "@/unils/allCateTree";
export default {
    props: {
        //是否多选
        optional: {
            default: true,
            type: Boolean
        },
        areaData: {
            default: []
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
            areaMenuTree: [],
            areaMenu: []
        };
    },
    mounted() {
        // GetArea().then(result => {
        //   this.areaMenuTree = result.data;
        //   this.deleteNullData(this.areaMenuTree);
        //   this.areaMenu = this.areaData;
        // });
        this.GetArea();
    },
    methods: {
        GetArea() {
            this.$ajax.get(this.$URL + '/sysArea/LoadSysArea').then(result => {
                if (result.status == 200 && result.data.success) {
                      this.areaMenuTree = result.data.data;
                      this.deleteNullData(this.areaMenuTree);
                      this.areaMenu = this.areaData;
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
    }
};
</script>

<style>
.filter_span {
    font-size: 12px !important;
}
</style>
