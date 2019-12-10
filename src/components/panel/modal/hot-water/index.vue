<template>
  <transition enter-active-class="fadeInDown" leave-active-class="fadeOutUp">
    <el-card class="box-card" v-show="el_card_show" :style="el_card_style">
      <div slot="header" class="clearfix">
        <span>{{title}}</span>
        <el-button style="float: right; padding: 3px 0" type="text"><i class="el-icon-close" @click="close"></i>
        </el-button>
      </div>
      <el-row class="item-content">
        <el-col>
          <el-row class="item-supply">
            <el-col :span="24">
              <img :src="supply_water" alt="">
              <img :src="up" alt="" class="up_img1">
              <img :src="up" alt="" class="up_img2">
              <img :src="up" alt="" class="up_img3">
              <img :src="down" alt="" class="down_img1">
              <img :src="down" alt="" class="down_img2">
              <img :src="down" alt="" class="down_img3">
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="item-content">
        <el-col>
          <el-row :gutter="20" class="meter_img">
            <el-col :span="12">
              <compant-meter :min="0"
                             :max="100"
                             width="150px"
                             height="150px"
                             :value="supplyWeather"
                             :valueColor="supplyColor"
                             echart_id="supplyWeather"
                             textName="供水温度"
                             unit="℃">
              </compant-meter>

            </el-col>
            <el-col :span="12">
              <compant-meter :min="0"
                             :max="100"
                             width="150px"
                             height="150px"
                             :value="backWeather"
                             :valueColor="backColor"
                             echart_id="backWeather"
                             textName="回水温度"
                             unit="℃">
              </compant-meter>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="item-content">
        <el-col>
          <el-row class="item-value" :gutter="20">
            <el-col :span="6">
              <div>水管压力</div>
              <div class="box">
                <div class="pressure">{{pipe_pressure}}</div>
                <div>Pa</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div>水阀反馈检测</div>
              <div class="box">
                <div class="valve">{{valve}}</div>
                <div>%</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div>旁通差压检测</div>
              <div class="box">
                <div class="pressure">{{bypass_pressure}}</div>
                <div>Pa</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div>总管流量</div>
              <div class="box">
                <div class="flow">{{flow}}</div>
                <div>m³/h</div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-row class="item-install">
            <el-col :span="9">
              <span>旁通阀调节控制：</span>
            </el-col>

            <el-col :span="15">
              <progress-bar :min="0" :max="100" leftBg="#029cae" v-model="per"></progress-bar>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

    </el-card>
  </transition>
</template>

<script type="text/ecmascript-6">
  import compantMeter from '../../common/dash-doard/meter.vue'
  import progressBar from '../../common/progress/processBar.vue'
  export default {
    props: {
      props_id: {
        default: ''
      }
    },
    data() {
      return {
        title: '冷冻水供水总管',
        per: '30',
        supply_water: require('./image/lqsghszg.svg'),
        kaifa: require('./image/kaifa.svg'),
        up: require('./image/ghszd2.svg'),
        down: require('./image/ghszd3.svg'),
        supplyWeather: 25,
        backWeather: 30,
        pipe_pressure: '10',
        valve: '40',
        bypass_pressure: '25',
        flow: '10',
        water_open: '100%',
        bypass_switch: '1',  //0-关 1-开
        supplyColor: '#F2B204',
        backColor: '#00BAFF',
        el_card_show: false,
        el_card_style: ''
      }
    },
    components: {
      progressBar,
      compantMeter
    },
    mounted() {
      this.el_card_show = true
    },


    methods: {
      close() {
        this.el_card_show = false;
        setTimeout(() => {
          this.$el.parentNode.removeChild(this.$el);
        }, 2000);
      },
    }
  };
</script>
<style scoped>
  .box-card {
    width: 428px;
  }

  .item-content {
    color: #616265;
    border-bottom: solid 1px #272B36;
  }

  .item-supply {
    width: 100%;
    margin: 15px auto;
    text-align: center;
  }

  .item-value {
    width: 100%;
    margin: 20px auto;
    text-align: center;
    color: #616265;
    font-size: 12px;
  }

  .box {
    font-size: 16px;
    margin: 10px 0px;
    border: 1px solid #131518;
    border-radius: 5px;
    background: #1D1E1F;
    padding: 5px 0px;
  }

  .valve {
    color: #E58B21;
    font-size: 24px;
  }

  .pressure {
    color: #259594;
    font-size: 24px;
  }

  .flow {
    color: #255295;
    font-size: 24px;
  }

  .item-control {
    margin: 20px auto;
    font-size: 12px;
    color: #616265;
  }

  .water-valve {
    text-align: left;
    padding-left: 15px;
  }

  .bypass-switch {
    text-align: right;
    padding-right: 15px;
  }

  .item-control span {
    padding-left: 15px;
    color: #259594;
  }

  .item-install {
    padding: 20px 15px;
    color: #616265;
  }

  .up_img1, .up_img2, .up_img3 {
    animation: up 5s infinite steps(5, end);
  }

  @keyframes up {
    0% {
      transform: translate(0, 40px);
      opacity: 0;
    }
    50% {
      transform: translate(0, 10px);
      opacity: 0.5;
    }
    100% {
      transform: translate(0, -20px);
      opacity: 1;
    }
  }

  .down_img1, .down_img2, .down_img3 {
    animation: down 3s infinite steps(5, end);
  }

  @keyframes down {
    0% {
      transform: translate(0, -20px);
      opacity: 0;
    }
    50% {
      transform: translate(0, 10px);
      opacity: 0.5;
    }
    100% {
      transform: translate(0, 40px);
      opacity: 1;
    }
  }

  .up_img1, .up_img2, .up_img3 {
    position: absolute;
    top: 20px;
  }

  .up_img1 {
    left: 57px;
  }

  .up_img2 {
    left: 86px;
  }

  .up_img3 {
    left: 124px;
  }

  .down_img1, .down_img2, .down_img3 {
    position: absolute;
    top: -20px;
  }

  .down_img1 {
    right: 67px;
  }

  .down_img2 {
    right: 108px;
  }

  .down_img3 {
    right: 134px;
  }

  .meter_img {
    text-align: center;
    font-size: 12px;
    padding: 10px 0;
  }
</style>
