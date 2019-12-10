<template>
<el-row class="box">
    <el-col :xs="24" :sm="24" class="center main cursor" @click.native="changeRoute('homepage')">首页</el-col>
    <el-col :xs="24" :sm="24" class="center energy cursor" @click.native="changeRoute('home2')">能源</el-col>
    <el-col :xs="24" :sm="24" class="center bim cursor">
        <div @click="changeRoute('home3')">BIM三维</div>
        <div class="nav">

            <el-col :xs="6" :sm="6" class="cursor" :class="[index===item.value?'active':'']" @click.self.native="LoadData(item.value)" v-for="item in systems" :key="item.value">{{item.label}}</el-col>
            <el-col :xs="6" :sm="6" class="cursor" @click.native="LoadData(1010)">旋转</el-col>

        </div>

    </el-col>
</el-row>
</template>

<script>
import system from '@/lib/System'
import {
    mapState
} from "vuex";
export default {

    name: 'navigate',
    data() {
        return {
            systems: system
        }
    },
    computed: {
        ...mapState({
            connection: state => state.signalr.connection,
            scadaHub: state => state.signalr.scadaHub,
            realData: state => state.signalr.realData,
            isconnection: state => state.signalr.isconnection,

        }),
    },
    methods: {
        changeRoute(routeName) {
            if (this.connection && this.isconnection) {
                this.$store.state.signalr.scadaHub.invoke('changeRoute', routeName);
            } else {
                this.$message.error("尚未连接服务,请稍后再试");
            }
        },
        LoadData(id) {
            if (this.connection && this.isconnection) {
                this.$store.state.signalr.scadaHub.invoke('changeSytem', id);
            } else {
                this.$message.error("尚未连接服务,请稍后再试");
            }
        }
    }
}
</script>

<style lang="less" scoped>
.box {
    height: 100%;
}

.main {
    background: #FFCC99;
    height: 33.33%;
}

.energy {
    height: 33.33%;
    background: #99CC99;
}

.bim {
    height: 33.33%;
    background: #1F6FB5;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .nav {
        width: 100%;
        top: 0px;
        font-size: 14px;
        font-weight: 400;
        z-index: 1000;
        left: 0;
        background-color: #1A4063; // border: 1px solid #333;
        color: #BCC4D6;
        // border-bottom-left-radius: 10px;
        // border-bottom-right-radius: 10px;
        opacity: 0.9;

        >div {
            display: inline-block;
            padding: 10px; // border-right: 1px solid #32538E;
            border-right: 1px solid black;
        }

        >div:nth-of-type(14) {
            border: 0;
        }
    }
}
</style>
