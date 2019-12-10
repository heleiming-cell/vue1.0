<template>
<el-dialog style="z-index:2009" title="图标选择" :visible.sync="iconEditVisibale" :modal-append-to-body="false" width="557px" center>
    <ul class="icon-list">
        <li v-for="item in classNames" :key="item">
            <i :class="item" @click="iconSelected(item)"></i>
        </li>
    </ul>
</el-dialog>
</template>

<script>
export default {
    name: "icon",
    data() {
        return {
            iconEditVisibale: false,
            classNames: [
                "iconfont icon-tubiaotongji",
                "iconfont icon-chart",
                "iconfont  icon-tubiaoshu",
                "iconfont  icon-tubiao",
                "iconfont icon-jian",
                "iconfont  icon-guangbo",
                "iconfont  icon-shanchu",
                "iconfont  icon-jiankong1",
                "iconfont  icon-app_icons--",
                "iconfont icon-qiche",
                "iconfont icon-jianzhuanquan",
                "iconfont  icon-jiankong",
                "iconfont  icon-menjin",
                "iconfont icon-ziyuan",
                "iconfont  icon-jingwuicon_svg-",
                "iconfont  icon-xiaofanggongcheng",
                "iconfont  icon-icon_location",
                "iconfont  icon-weibiaoti555",
                "iconfont icon-chaxun",
                "iconfont icon-jia",
                "iconfont  icon-weizhi",
                "iconfont  icon-21",
                "iconfont icon-chazuo",
                "iconfont  icon-kongtiao",
                "iconfont  icon-zuo1",
                "iconfont  icon-you",
                "iconfont  icon-icon-arrow-btm4",
                "iconfont icon-icon-arrow-top4",
                "iconfont icon-banqiuji",
                "iconfont icon-shebeileiqiuji",
                "iconfont icon-guzhang",
                "iconfont icon-pm",
                "iconfont icon-ye",
                "iconfont icon-qiangji1",
                "iconfont icon-qiuji2",
                "iconfont icon-banqiu1",
                "iconfont icon-paishuibeng",
                "iconfont icon-yunhang",
                "iconfont icon-zhuangtai",
                "iconfont icon-shuibeng3",
            ],
            propVar: "",
            callback: null
        };
    },
    methods: {
        iconSelected(name) {
            this.iconEditVisibale = false;
            if (this.callback && this.propVar) {
                this.callback(this.propVar, name);
            }
        },
        open(callback, propvar) {
            this.callback = callback;
            this.propVar = propvar;
            this.iconEditVisibale = true;
        }
    }
};
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
    transition: color 0.15s linear;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-right: -1px;
    margin-bottom: -1px;
    color: white;
    cursor: pointer;

    &:hover {
        background: #101a32;
    }
}
</style>
