<template>
  <el-select v-model="checked_value" :style="styles" placeholder="请选择" @change="change_select">
    <el-option v-for="item in data_select" :key="item" :label="item" :value="item"/>
  </el-select>

</template>
<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
export default {
  props: {
    data_checked_value: {
      default: ''
    },
    styles: {
      default: function() {
        return {
          width: 'auto'
        }
      }
    },
    span_style: {
      default: function() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters([
      'allEnums'
    ])
  },
  data() {
    return {
      data_select: [],
      checked_value: this.data_checked_value
    }
  },
  mounted() {
    this.data_select = this.allEnums.SheetLevel  || JSON.parse(Cookies.get("AllEnums")).SheetLevel
  },
  methods: {
    change_select(val) {
      this.$emit('value', val)
    }
  }
}
</script>
<style scoped>
.filter_span {
  font-size: 12px;
}
</style>
