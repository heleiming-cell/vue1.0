<template>
<div class="container">
    <component :is="Header" ></component>
    <!-- <component is="Header" v-show="showHeader"></component> -->
    <router-view></router-view>
</div>
</template>

<script>
import Header from '@/components/common/header'
export default {
    name: 'Main',
    components: {
        Header,
    },
    data() {
        return {
            Header:Header
        }
    },
    methods: {
     
    },
}
</script>


<style>
@import "../static/css/common.css";
</style><style lang="less" scoped>
@htmlBg: #32475c;
@basePx: 10px;

.px2rem(@name, @px) {
    @{name}: @px / @basePx * 1rem;
}

.padding2rem(@name, @top, @left, @down, @right) {
    @{name}: (@top / @basePx * 1rem) (@left / @basePx * 1rem) (@down / @basePx * 1rem) (@right / @basePx * 1rem);
}

#btn {
    position: fixed;
    top: 100px;
    left: 0;
    z-index: 11;
}
.container{
    height: 100%;
}
</style>
