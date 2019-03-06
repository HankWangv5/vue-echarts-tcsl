import Vue from 'vue'
import App from './App.vue'
import VueEcharts from './common/echarts-template/index.js'
Vue.use(VueEcharts);

new Vue({
  el: '#app',

  render: h => h(App)
})
