<template>
    <div :id="id"></div>
</template>

<script>
import 'echarts/lib/chart/line';
import minXinChart from '../mixin';
import {Option as areablue} from './area-blue.js';
import {Option as areaorange} from './area-orange.js';
import {Option as areapurple}  from './area-purple.js';
export default {
  mixins: [minXinChart],
  props: {
    data: {
      default: function () {
        return [
          {value: 35, name: '订单量'},
          {value: 10, name: '取量'},
          {value: 10, name: '取消量'},
          {value: 34, name: '支付量'},
          {value: 34, name: '支量'},
          {value: 35, name: '投诉量'},
          {value: 25, name: '投量'},
          {value: 11, name: '被投诉'}];
      }
    }
  },
  data () {
    return {
    };
  },
  created () {
    this.areablue = areablue;
    this.areaorange = areaorange;
    this.areapurple = areapurple;
  },
  methods: {
    resolveData (Option) {
      //
      Option.series[0].data = this.data;
    }
  }
};
</script>

<style scoped>

</style>
