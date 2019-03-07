<template>
    <div :id="id"></div>
</template>

<script>
import 'echarts-liquidfill';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/gauge';
import 'echarts/lib/component/markPoint';
import minXinChart from '../mixin';
import {Option as gaugeblue} from './gauge-blue.js';
import {Option as gaugeorange} from './gauge-orange.js';
import {Option as gaugepurple}  from './gauge-purple.js';
export default {
  mixins: [minXinChart],
  data () {
    return {
    };
  },
  created () {
    this.gaugeblue = gaugeblue;
    this.gaugeorange = gaugeorange;
    this.gaugepurple = gaugepurple;
  },
  methods: {
    resolveData (Option) {
      // Todo 处理中间title blue
      // Todo 处理数据
      Option.series[0].data[0].value = 75;
      if (this.theme === 'orange') {
        Option.series[0].data[0].value = 0.75;
      }
    }
  }
};
</script>

<style scoped>

</style>
