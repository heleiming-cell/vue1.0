<template>
  <transition enter-active-class="fadeInDown" leave-active-class="fadeOutUp">
    <el-card class="box-card" v-show="el_card_show" :style="el_card_style">
      <!--header-->
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
        <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-close" @click="close"></i>
        </el-button>
      </div>
      <div class="border-b">
        <el-row>
          <el-col :span="24">
            <img :src="operation ? fengj : fengjh" alt="" :class="status && operation? 'rotation' : ''">
          </el-col>
        </el-row>
        <!--状态-->
        <el-row>
          <el-col :span="12">
            <img :src="operation ? zhengc : huise" alt="">
            <div class="status">运行</div>
          </el-col>
          <el-col :span="12">
            <img :src="!operation ? guzang : huise" alt="">
            <div class="status">故障</div>
          </el-col>
        </el-row>
      </div>
      <!--开关-->
      <el-row class="border-b">
        <el-col>
          <img :src="switchOn ? kai : guan" alt="" @click="switchChange">
        </el-col>
      </el-row>
      <!--手动 自动-->
      <el-row class="HM-box">
        <el-col>
          <span class="manual">手动</span>
          <span class="self-motion">自动</span>
          <img :src="HM ? shoudong : zhidong" alt="" @click="HMChange">
        </el-col>
      </el-row>
    </el-card>
  </transition>
</template>
<script type="text/ecmascript-6">
  export default {
    props:{
      props_id: {
        default: ''
      }
    },
    data() {
      return {
        fengj: require('./images/fengj.svg'),
        fengjh: require('./images/fengjh.svg'),
        zhengc: require('./images/zhengc.svg'),
        guzang: require('./images/guzang.svg'),
        huise: require('./images/huise.svg'),
        kai: require('./images/kai.svg'),
        guan: require('./images/guan.svg'),
        shoudong: require('./images/shoudong.svg'),
        zhidong: require('./images/zhidong.svg'),
        title: '送排风',
        status: true,   //状态
        switchOn: false,  //开关
        operation: true,  // 故障/运行
        HM: true,
        el_card_show: false,
        el_card_style: '',
      }
    },
    mounted(){
      this.el_card_show = true
    },
    methods: {
      close() {
        this.el_card_show = false;
        setTimeout(() => {
          this.$el.parentNode.removeChild(this.$el);
        }, 2000);
      },
//      切换开关
      switchChange(){
        this.switchOn = !this.switchOn
        if (this.switchOn) {
          this.status = false
        } else {
          this.status = true
        }
      },
//      手动 自动
      HMChange(){
        this.HM = !this.HM
      }
    }
  };
</script>
<style scoped>
  .box-card {
    width: 428px;
    margin: 0px auto;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .rotation {
    transform: rotate(360deg);
    animation: rotation 2s linear infinite;
  }

  .status {
    font-size: 18px;
    color: #616265;
    line-height: 48px;
  }

  .HM-box {
    position: relative;
    padding: 10px 0;
  }

  .manual, .self-motion {
    position: absolute;
    top: 8px;
    font-size: 12px;
    color: #616265;
  }

  .manual {
    left: 130px;
  }

  .self-motion {
    right: 130px;
  }

</style>

