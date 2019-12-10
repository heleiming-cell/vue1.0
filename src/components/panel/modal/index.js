import Vue from 'vue';
import accressControl from './accress-control/index.vue';
import airConditioningUnit from './airConditioningUnit/index.vue';
import boiler from './boiler/index.vue';
import bulb from './bulb/index.vue';
import catchmentPit from './catchment-pit/index.vue';
import chilledPump from './chilled-pump/index.vue';
import coolingDN from './coolingDN/index.vue';
import coolingTower from './coolingTower/index.vue';
import encironmentalMonitor from './encironmental-monitor/index.vue';
import expansionTank from './expansion-tank/index.vue';
import feedWater from './feedWater/index.vue';
import fireAlarm from './fireAlarm/index.vue';
import fireControl from './fireControl/index.vue';
import heatExchangePlate from './heat-exchange-plate/index.vue';
import hotWater from './hot-water/index.vue';
import medicalGas from './medicalGas/index.vue';
import newTrend from './newTrend/index.vue';
import sewagePump from './sewage-pump/index.vue';
import waterPump from './water-pump/index.vue';
import waterSupply from './water-supply/index.vue';
import waterTank from './water-tank/index.vue';
import sendingAir from './sendingAir/index.vue'
import fanCoil from './fanCoil/index.vue'
import elevator from './elevator/index.vue'

let aniMateConstructor = ''
let instance;
let instances = [];
let zIndex = 1000;

var Animation = function (options) {
  options.el_card_style = 'position:fixed;top:100px;left:calc(50% - 214px);'

  switch (options.type) {
    case 'accressControl':   // 门禁
      aniMateConstructor = Vue.extend(accressControl);
      break
    case 'newTrend':   //新风
      aniMateConstructor = Vue.extend(newTrend);
      break
    case 'hotWater':  // 冷冻水供回水总管
      aniMateConstructor = Vue.extend(hotWater);
      break
    case 'waterTank':  // 软化水箱
      aniMateConstructor = Vue.extend(waterTank);
      break
    case 'airConditioningUnit': // 空调机组
      aniMateConstructor = Vue.extend(airConditioningUnit)
      break
    case 'boiler':  // 锅炉
      aniMateConstructor = Vue.extend(boiler)
      break
    case 'bulb':   //电灯
      aniMateConstructor = Vue.extend(bulb)
      break
    case 'catchmentPit':   //积水坑
      aniMateConstructor = Vue.extend(catchmentPit)
      break
    case 'chilledPump':   //冷冻水泵
      aniMateConstructor = Vue.extend(chilledPump)
      break
    case 'coolingDN':   //冷却水供回水温度
      aniMateConstructor = Vue.extend(coolingDN)
      break
    case 'coolingTower':   //冷却塔
      aniMateConstructor = Vue.extend(coolingTower)
      break
    case 'encironmentalMonitor':   //环境监测
      aniMateConstructor = Vue.extend(encironmentalMonitor)
      break
    case 'expansionTank':   //膨胀水箱
      aniMateConstructor = Vue.extend(expansionTank)
      break
    case 'waterSupply':   //冷冻水供水总管
      aniMateConstructor = Vue.extend(waterSupply)
      break
    case 'sewagePump':   //污水提升泵
      aniMateConstructor = Vue.extend(sewagePump)
      break
    case 'medicalGas':   //医疗气体
      aniMateConstructor = Vue.extend(medicalGas)
      break
    case 'heatExchangePlate':   //换热板
      aniMateConstructor = Vue.extend(heatExchangePlate)
      break
    case 'fireControl':   //消防
      aniMateConstructor = Vue.extend(fireControl)
      break
    case 'fireAlarm':   //火灾报警
      aniMateConstructor = Vue.extend(fireAlarm)
      break
    case 'feedWater':   //给水
      aniMateConstructor = Vue.extend(feedWater)
      break
    case 'waterPump':   //热水循环水泵
      aniMateConstructor = Vue.extend(waterPump)
      break
    case 'sendingAir':   //送排风
      aniMateConstructor = Vue.extend(sendingAir)
      break
    case 'fanCoil':  //风机盘管
      aniMateConstructor = Vue.extend(fanCoil)
      break
    case 'elevator':  // 电梯
      aniMateConstructor = Vue.extend(elevator)
      break
  }

  // console.log(aniMateConstructor, 'aniMateConstructor')

  if (aniMateConstructor == '') {
    return
  }

  instance = new aniMateConstructor({
    data: options
  });
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  instance.dom = instance.vm.$el;
  instance.dom.style.zIndex = zIndex++;
  instances.push(instance);
  return instance.vm;
};

export default Animation;
