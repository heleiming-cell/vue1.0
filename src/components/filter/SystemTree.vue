<template>
  <el-cascader
    clearable
    :options="systemMenuList"
    v-model="systemMenu"
    :props="systemDefaultProp"
    @change="handleChange"
    :change-on-select="changeOnSelect"
  ></el-cascader>
</template>

<script>
// import { GetSystemMenuList } from "@/api/select";
export default {
  props: {
    systemData: {
      default: []
    },
    systemDefaultProp: {
      default: function() {
        return {
          label: "name",
          value: "id"
        };
      }
    },
    // 是否可以选择任意一级
    changeOnSelect:{
      type:Boolean,
      default:false,
    }

  },
  data() {
    return {
      systemMenuList: [],
      systemMenu: this.systemData
    };
  },
  mounted() {
   
    this.GetSystemMenuList();
  },
  methods: {
    GetSystemMenuList(){
       this.$ajax.get(this.$URL+'/SysMenu/GetMenus').then(result=>{
         if(result.status==200&&result.data.success)
         {
            this.systemMenuList=result.data.data;
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
    systemData(val) {
      this.systemMenu = this.systemData;
    }
  }
};
</script>

<style>
</style>
