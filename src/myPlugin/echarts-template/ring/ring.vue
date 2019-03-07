<template>
    <div :id="id"></div>
</template>

<script>
// import * as echarts from 'echarts/src/echarts';
import 'echarts/lib/chart/pie';
import minXinChart from '../mixin';
import {Option as ringblue} from './ring-blue.js';
import {Option as ringorange} from './ring-orange.js';
import {Option as ringpurple}  from './ring-purple.js';
export default {
  mixins: [minXinChart],
  props: {
    data: {
      default: function () {
        return [
          {value: 935, name: '订单量'},
          {value: 410, name: '取消量'},
          {value: 334, name: '支付量'},
          {value: 235, name: '投诉量'},
          {value: 110, name: '被投诉'}];
      }
    }
  },
  data () {
    return {
    };
  },
  created () {
    this.ringblue = ringblue;
    this.ringorange = ringorange;
    this.ringpurple = ringpurple;
  },
  methods: {
    resolveData (Option) {
      // Todo根据返回数据格式处理数据
      Option.series[0].data = this.data;
      // Todo根据返回数据格式处理lengend
    }
  }
};
</script>

<style scoped>

</style>
