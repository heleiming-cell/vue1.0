<template>
<ul class="icon-list">
    <li v-for="item in classNames" :key="item"> <i :class="item" @click="iconSelected(item)"></i> </li>
</ul>
</template>

<script>
export default {
    name: 'icon',
    data() {
        return {
            classNames: ['fa fa-video-camera fa-2x',
                'fa fa-shield fa-2x',
                'fa fa-volume-off fa-2x',
                'fa fa-bell fa-2x',
                'fa fa-fire-extinguisher fa-2x',
                'fa fa-car fa-2x',
                'fa fa-fire fa-2x',
                'fa fa-user fa-2x',
                'fa fa-cog fa-2x',
                'fa fa-cogs fa-2x',
                'fa fa-area-chart fa-2x',
                'fa fa-vcard-o fa-2x',
                'fa fa-id-card fa-2x',
                'fa fa-minus fa-2x',
                'fa fa-plus fa-2x',
                'fa fa-remove fa-2x',
                'fa fa-map-marker fa-2x',
                'fa fa-magic fa-2x',
                'fa fa-paper-plane fa-2x',
                'fa fa-angle-down fa-2x',
                'fa fa-angle-up fa-2x',
                'fa fa-angle-right fa-2x',
                'fa fa-angle-left fa-2x',
                'fa fa-circle fa-2x',
                'fa fa-bar-chart fa-2x',
                'fa fa-building fa-2x',
                'fa fa-line-chart fa-2x',
                'fa fa-sitemap fa-2x',
                'fa fa-table fa-2x',
                'fa fa-pie-chart fa-2x',
                'fa fa-clock-o fa-2x',
                'fa fa-cubes fa-2x',
            ]
        }
    },
    methods: {
        iconSelected(name) {
            this.$emit('iconClick', name)
        }
    }

}
</script>

<style lang="less">
.icon-list {
    overflow: hidden;
    list-style: none;
    padding: 0;
    border: 1px solid #eaeefb;
    border-radius: 4px;
    /* ; */
}

.icon-list li {
    float: left;
    width: 16.66%;
    text-align: center;
    line-height: 4em;
    color: #666;
    font-size: 13px;
    transition: color .15s linear;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-right: -1px;
    margin-bottom: -1px;
    color: white;
    cursor: pointer;

    &:hover {
        background: #101a32
    }
}
</style>
