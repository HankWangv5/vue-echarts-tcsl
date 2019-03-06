import Vue from 'vue'
import App from './App.vue'
import vEchartsTcsl from './myPlugin/echarts-template/index.js'
Vue.use(vEchartsTcsl);

new Vue({
  el: '#app',
  render: h => h(App)
})
