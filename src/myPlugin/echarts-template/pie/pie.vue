<template>
    <div :id="id"></div>
</template>

<script>
import 'echarts/lib/chart/pie';
import minXinChart from '../mixin';
import {Option as pieblue} from './pie-blue.js';
import {Option as pieorange} from './pie-orange.js';
import {Option as piepurple}  from './pie-purple.js';
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
    this.pieblue = pieblue;
    this.pieorange = pieorange;
    this.piepurple = piepurple;
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
