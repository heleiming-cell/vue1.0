<template>
<div class="index-container">
    <div class="tab-btn">
        <el-button type="primary" size="small" :class="isActive == item.label?'isActive':''" v-for="(item,index) in funMenu" :key="index" @click="clickBtn(item)">{{item.label}}</el-button>
    </div>
    <div class="router-view">
        <router-view></router-view>
    </div>
</div>
</template>

<script>
import {
    mapState
} from 'vuex'
export default {
    computed: {
        ...mapState({
            funMenu: state => state.funMenu //功能菜单
        }),
          routePath() {
            return this.$route.path
        }
    },
    data() {
        return {
            isActive: '资产总览',
        }
    },
    watch: {
        routePath(n) {
            this.setRoute()
        }
    },
    mounted() {
      this.setRoute()
    },
    methods: {
        clickBtn(item) {
            this.isActive = item.label
            let path = JSON.parse(item.config).route.path
            this.$router.push(path)
        },
        setRoute(){
          switch (this.routePath) {
                case '/statistics':
                    this.isActive = '巡检统计'
                    break
                case '/center':
                    this.isActive = '巡检中心'
                    break
                case '/inspectionTask':
                    this.isActive = '巡检任务'
                    break
                case '/inspectionPoint':
                    this.isActive = '巡检点'
                    break
                case '/standard':
                    this.isActive = '巡检标准'
                    break
                case '/record':
                    this.isActive = '巡检记录'
                    break
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.index-container {
    height: 100%;
    width: 100%;

    .tab-btn {
        padding: 9px;
        text-align: right;

        .el-button {
            background: #000;
            border: none;
            color: #0066FF;

            &.isActive {
                background: #3C88E6 !important;
                border: 1px solid #3C88E6;
                color: #FFF;
            }
        }
    }

    .router-view {
        width: 100%;
        height: calc(100% - 50px);
    }
}
</style>
