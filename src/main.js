import Vue from 'vue'
import App from './App.vue'
import vEchartsTcsl from './index.js'
import element from 'element-ui';
Vue.use(vEchartsTcsl);
Vue.use(element);
new Vue({
  el: '#app',
  render: h => h(App)
})
