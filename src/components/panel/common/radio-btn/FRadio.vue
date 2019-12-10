<template>
<div class="radio-box">
    <div v-for="(item,index) in tabs" :key="index" :class="{active:isActive == (index+1)}" @click="OnClickRadio(index+1)">
        <i :class="item.icon"></i>
        <!-- <img :src="isActive==index ? item.srcAc :item.src" alt=""> -->
        <div>{{item.name}}</div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            isActive: 1,
            tabs: [{
                name: '制冷',
                icon: 'iconfont icon-zhileng',
                // src: require('./images/summer11.svg'),
                // srcAc: require('./images/summer1.svg'),
            }, {
                name: '制热',
                icon: 'iconfont icon-zhire',
                // src: require('./images/winter22.svg'),
                // srcAc: require('./images/winter2.svg'),
            }, {
                name: '自动制冷',
                icon: 'iconfont icon-zhileng1',
                // src: require('./images/ventilate33.svg'),
                // srcAc: require('./images/ventilate3.svg'),
            }, {
                name: '自动制热',
                icon: 'iconfont icon-zhire1',
                // src: require('./images/arefaction44.svg'),
                // srcAc: require('./images/arefaction4.svg'),
            }]
        }
    },
    methods: {
        OnClickRadio(num) {
            this.isActive = num;
            this.$emit('setMode', num);
        }
    }
}
</script>

<style scoped>
.radio-box {
    display: flex;
}

.radio-box>div {
    flex: 1;
    cursor: pointer;
}

.active {
    color: #13D3D1;
}
</style>
