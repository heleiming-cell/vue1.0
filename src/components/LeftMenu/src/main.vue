<template>
<div class="leftmenu" v-if="funs.length>0">
    <ul>
        <!-- <li>
                <div class="jiao"></div>123
            </li>
            <li>123</li>
            <li>123</li> -->
        <li @click="LoadSecond(item)" v-for="(item,i) in funs" :key="i">{{item.label}}</li>
        <!-- <li v-for="(item,i) in areas" :key="i">{{item.label}}</li> -->
    </ul>
</div>
</template>

<script>
export default {
    name: 'LeftMenu',
    props: ['funs']
}
</script>

<style lang="less" scoped>
.leftmenu {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    max-height: 294px;
    min-height: 294px;
    box-sizing: border-box;
    border-left: 20px solid #183B70;
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 200px;
        max-height: 294px;
        min-height: 294px;
        background: rgba(7, 22, 37, 1);

        li {
            height: 58px;
            opacity: 0.5;
            border: 1px solid #183B70;
            text-align: center;
            line-height: 58px;
            font-size: 19px;
            cursor: pointer;
            position: relative;
        }

        li:last-of-type {
            border: 0;
        }

        // li::before {
        //     content: "";
        //     display: block;
        //     position: absolute;
        //     /* top: 230px; */
        //     bottom: -8px;
        //     left: calc(50% - 10px);
        //     width: 0;
        //     height: 0;
        //     border-left: 10px solid transparent;
        //     border-right: 10px solid transparent;
        //     border-top: 8px solid #3259A7;
        // }
    }

}
</style>
