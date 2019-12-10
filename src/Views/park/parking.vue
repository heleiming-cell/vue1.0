<template>
<div class="ghy-box">
    <el-row class="itemlist">
        <el-row :gutter="10" class="itemrow">
            <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" class="itemcol">
                <div class="item">
                    <el-progress type="circle" :percentage="80" color="rgb(245, 105, 84)"></el-progress>
                    <div style="font-size:20px;">总车位</div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" class="itemcol">
                <div class="item">
                    <el-progress type="circle" :percentage="20" color="rgb(57, 204, 204)"></el-progress>
                    <div style="font-size:20px;">占用</div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" class="itemcol">
                <div class="item">
                    <el-progress type="circle" :percentage="60" color="rgb(0, 192, 239)"></el-progress>
                    <div style="font-size:20px;">剩余</div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" class="itemcol">
                <div class="item">
                    <el-progress type="circle" :percentage="25" color="rgb(0, 166, 90)"></el-progress>
                    <div style="font-size:20px;">利用率</div>
                </div>
            </el-col>
        </el-row>

    </el-row>
</div>
</template>

<script>
export default {
    name: 'parking',
    data() {
        return {
            circle: 'circle',
            color: '#8e71c7',
            percentage: '100',
            w: 10
        }

    },

}
</script>

<style lang="less" scoped>
.itemlist {
    height: calc(100% - 20px);
    margin: 0 5px;
    padding: 10px 0;

    .itemrow {
        height: 33.33%;
    }

    .itemrow:nth-of-type(2) {
        margin-top: 10px;
        margin-bottom: 10px;
    }

}

.itemcol {
    height: 100%;

    .item {
        height: 100%;
        width: 100%;
        display: flex;
        flex: 1 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(53, 95, 177, 1);
        padding: 0 76px 0 52px;
        overflow: hidden;

        .itemicon {
            font-size: 121px;
        }

        .itemdata {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

        }
    }
}

.item {
    .itemcmd {
        font-size: 38px;
        line-height: 38px;
        color: #B0D4FB;
    }

    .itemdes {
        font-size: 21px;

        line-height: 64px;
    }
}
</style>
