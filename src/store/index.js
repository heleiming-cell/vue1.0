import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app';
import signalr from './modules/signalr'
import alarm from './modules/alarm'
Vue.use(Vuex)

const  store = new Vuex.Store({
  state:{},
  mutations:{},
  actions:{},
  modules:{
    app,signalr,alarm
  }
})

export default store
