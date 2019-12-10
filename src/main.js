// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue, { jsonp } from 'vue'
import App from './App'
import router from './router'

//引入filter
import DeviceType from './components/filter/DeviceType.vue'
import DeviceArea from './components/filter/DeviceArea.vue'
import DeviceDepartMent from './components/filter/DeviceDepartMent.vue'
Vue.component('select-DeviceType', DeviceType);
Vue.component('select-DeviceArea', DeviceArea);
Vue.component('select-DeviceDepartMent', DeviceDepartMent);

//引入jQuery
import $ from 'jquery'

//引入状态管理vuex
import store from './store'
import moment from 'moment'
// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import VCharts from 'v-charts'
Vue.use(VCharts)

//工单流程模板设计器
import FormMaking from 'form-making'

Vue.use(FormMaking);
// iconfont
import './assets/iconfont/iconfont.css'

//引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

//引入axios
import axios from 'axios'

import Cookie from 'js-cookie'
Vue.prototype.$moment = moment;
axios.interceptors.request.use(function (config) {
  var token = Cookie.get("token")
  // 在发送请求之前做些什么
  if (token && token.slice(token.length - 3) === "@@@") {
    config.headers.Authorization = 'bearer ' + token.slice(0, token.length - 3);
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
Vue.prototype.$ajax = axios
//请求头

//引入qs
import qs from 'qs'
Vue.prototype.$QS = qs


//请求地址
// https://ipm.pgjn.com.cn
// Vue.prototype.$URL = "http://" + window.location.hostname + ":6003";
// Vue.prototype.$URL = "https://ipm.pgjn.com.cn:6003";
// Vue.prototype.$URL = "https://ipm.pgjn.com.cn:6003";
 Vue.prototype.$URL = "http://localhost:6003";
Vue.prototype.$SHEDULEURL = "http://" + window.location.hostname + ":6005";
Vue.prototype.$DMURL = "http://" + window.location.hostname + ":6711";
Vue.prototype.$Order = "https://ipm.pgjn.com.cn:1142";
// Vue.prototype.$URL = "http://117.184.65.46:6003";
// Vue.prototype.$Order = "http://117.184.65.46:1142";
// Vue.prototype.$URL = process.env.baseurl
//文件路径
Vue.prototype.$Static = './static'

//引入css动画
import 'vue2-animate/dist/vue2-animate.min.css'

import '@/static/css/common.css'
import '@/static/css/global.less'
//signalr
import './lib/signalr'


import {
  mapMutations
} from 'vuex';

Vue.prototype.guid = function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份   
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时   
    "m+": this.getMinutes(), //分   
    "s+": this.getSeconds(), //秒   
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
    "S": this.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};



Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>',
  created() {
    // alert(123);
  },
  methods: {
    ...mapMutations(['updateConnection', 'updateAlarmData']),
  },
  method: {
    connectionSignalr() {

    }
  },
  mounted() {
    let _this = this;
    
    var connection = new signalR.HubConnectionBuilder().
      // withUrl("http://"+location.hostname+":9005/scada")
      withUrl("http://localhost:9005/scada")
      .build();


    //全局订阅，订阅全局报警
  //  let connection = $.hubConnection();
    // connection.url = "http://"+location.hostname+":9005/signalr";
  //  connection.url = "http://171.221.238.16:8005/signalr";
   // let contosoChatHubProxy = connection.createHubProxy('alarmhub');
  //  let scadaHub = connection.createHubProxy('scadahub');
    // connection.reconnected(function () {
    //   _this.updateConnection({
    //     isconnection: false,
    //   });
    //   connection.start().done(function () {
    //     console.log("连接成功----" + connection.id);
    //     contosoChatHubProxy.invoke('sendHisAlarm');
    //     _this.updateConnection({
    //       connection,
    //       hubproxy: contosoChatHubProxy,
    //       scadaHub: scadaHub,
    //       isconnection: true,
    //     });
    //   });
    // });
    // connection.disconnected(function () {
    //   _this.updateConnection({
    //     isconnection: false,
    //   });
    //   connection.start().done(function () {
    //     console.log("连接成功----" + connection.id);
    //     contosoChatHubProxy.invoke('sendHisAlarm');
    //     _this.updateConnection({
    //       connection,
    //       hubproxy: contosoChatHubProxy,
    //       scadaHub: scadaHub,
    //       isconnection: true,
    //     });
    //   });
    // });
    connection.on('onVarsChangedCallback', function (data) {
      if (data) {
        data = JSON.parse(data);
        if (data.success && data.data && data.data.length > 0) {
          _this.$store.commit('updateRealData', data.data);
        }
      }

    });
    connection.on('onChangeRoute', function (data) { //手机端切换
      if (data) {
        _this.$store.commit('change_routename', data);
      }
    });
    // scadaHub.on('onChangeSystemID', function (data) { //手机端切换
    //   if (data) {
    //     if (data == "1010") {
    //       _this.$store.commit('change_systemid', null);
    //       setTimeout(function () {
    //         _this.$store.commit('change_systemid', data);
    //         return;
    //       }, 0);
    //     } else
    //       _this.$store.commit('change_systemid', data);
    //   }
    // });
    // contosoChatHubProxy.on('addContosoChatMessageToPage', function (name, message) {
    //   console.log(name + ' ' + message);
    // });
    connection.on('getHisAlarm', function (data) {
      if(data)
      {
        _this.updateAlarmData(JSON.parse(data))
      }
    });
    connection.on('getRealAlarm', function (data) {
      if (data) {
        data = JSON.parse(data);
        if (data  && data.length > 0) {
          _this.updateAlarmData(data);
          if (_this.$store.state.app.openAlarm) {
            _this.$store.commit('change_alarmlist', true);
            _this.$store.commit('change_alarmlink', true);
          }

          _this.$store.commit('change_linkinfo', data[0]);

        }
      }

    });
    // contosoChatHubProxy.on('getAlarmReset', function (Msg) {
    //   if (Msg) {
    //     Msg = JSON.parse(Msg);
    //     if (Msg && Msg.success) {
    //       contosoChatHubProxy.invoke('sendHisAlarm')
    //     }
    //   }

    // });
    connection.start().then(result=>{
       if(connection.state===1)
       {
         console.log("连接成功")
       }
      connection.invoke('SendHisAlarm');
      _this.updateConnection({
        connection,
        // hubproxy: contosoChatHubProxy,
        // scadaHub: scadaHub,
        isconnection: true,
      });
    });

  }
})
