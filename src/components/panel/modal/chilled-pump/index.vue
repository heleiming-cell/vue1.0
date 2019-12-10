<template>
  <transition enter-active-class="fadeInDown" leave-active-class="fadeOutUp">
    <el-card class="box-card" v-show="el_card_show" :style="el_card_style">
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
        <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-close" @click="close"></i>
        </el-button>
      </div>
      <el-row class="item_contert">
        <el-col>
          <el-row class="pump_img">
            <el-col>
              <img :src="status ? ldsb1 : ldsb2" alt="">
              <div class="status_confirg" v-show="status">
                <img :src="sy1" class="position" alt="" :class="openoff ?'rotation':''">
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="item_contert">
        <el-col>
          <el-row class="status_box">
            <el-col :span="12" class="status_left">
              <div>
                <img :src="status?zhengchang:huise"/>
              </div>
              <div><span>正常</span></div>
            </el-col>
            <el-col :span="12" class="status_right">
              <div>
                <img :src="status?huise:guzhang"/>
              </div>
              <div><span>故障</span></div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="item_contert">
        <el-col>
          <el-row class="flow_box">
            <el-col :span="12">
              水流开关
            </el-col>
            <el-col :span="12">
              <span>{{flow_switch==1?'开':'关'}}</span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-row class="item_install">
            <el-col :span="14" class="automatic_switch">
              <span class="manual">手动</span>
              <span class="self-motion">自动</span>
              <img :src="HM ? shoudong : zhidong" class="switch" alt="" @click="HMChange">
            </el-col>
            <el-col :span="10" class="status_switch">
              <img :src="openoff?open:off" @click="clickSwitch"/>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </transition>
  </transition>

</template>

<script type="text/ecmascript-6">
  import myProgress from '../../common/progress/progress.vue'
  export default {
    props: {
      props_id: {
        default: ''
      }
    },
    data() {
      return {
        title: '冷冻水泵',
        zhengchang: require('./image/zhengc.svg'),
        guzhang: require('./image/guzang.svg'),
        huise: require('./image/huise.svg'),
        shoudong: require('./image/shoudong.svg'),
        zhidong: require('./image/zhidong.svg'),
        open: require('./image/kai.svg'),
        off: require('./image/guan.svg'),
        ldsb1: require('./image/ldsb1.svg'),
        ldsb2: require('./image/ldsb2.svg'),
        ldsb3: require('./image/ldsb3.svg'),
        ldsb4: require('./image/ldsb4.svg'),
        sy1: require('./image/fs1.svg'),
        status: true,
        HM: true,
        openoff: true,
        flow_switch: 1,
        el_card_show: false,
        el_card_style: ''
      };
    },
    components: {
      myProgress
    },
    mounted() {
      this.el_card_show = true
    },
    destroyed(){
    },
    methods: {
      HMChange(){
        this.HM = !this.HM
      },
      clickSwitch(){
        this.openoff = !this.openoff
      },
      close(){
        this.el_card_show = false
        setTimeout(()=> {
          this.$el.parentNode.removeChild(this.$el);
        }, 2000)
      }
    }
  };
</script>
<style scoped>
  .box-card {
    width: 428px;
  }

  .pump_img {
    margin-bottom: 20px;
    text-align: center;
  }

  .normal {
    width: 120px;
    text-align: center;
    padding-right: 80px;
  }

  .malfunction {
    width: 120px;
    text-align: center;
  }

  .item_contert {
    color: #616265;
    border-bottom: solid 1px #272B36;
    font-size: 14px;
  }

  .status_box {
    width: 100%;
    margin: 10px auto;
  }

  .status_right, .status_left {
    text-align: center;
  }

  .item_install {
    margin: 0px auto;
    margin-top: 10px;
    text-align: center

  }

  .manual, .self-motion {
    position: absolute;
    top: 20px;
    font-size: 12px;
  }

  .manual {
    left: 40px;
  }

  .self-motion {
    right: 200px;
  }

  .heat_plate_switch {
    width: 20%;
    margin: 0px auto;
    padding: 20px 0px
  }

  .automatic_switch {
    border-right: solid 1px #272B36;
    color: #616265;
  }

  .status_switch {
    padding-top: 30px;
  }

  .flow_box {
    text-align: center;
    margin: 20px auto;
    font-size: 14px;
  }

  .flow_box span {
    color: #FFB400;
  }

  .status_confirg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: solid 3px #2288E4;
    position: absolute;
    top: 10px;
    right: 60px;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
    }
  }

  .rotation {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    animation: rotation 1s linear infinite;
    -webkit-animation: rotation 1s linear infinite;
    -o-animation: rotation 1s linear infinite;
    -moz-animation: rotation 1s linear infinite;
  }

  .position {
    margin: 4px 4px;
    width: 32px;
    height: 32px;
  }

</style>
