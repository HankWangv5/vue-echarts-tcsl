<template>
    <div :id="id"></div>
</template>

<script>
import 'echarts/lib/chart/bar';
import minXinChart from '../mixin';
import {Option as barsblue} from './bars-blue.js';
import {Option as barsorange} from './bars-orange.js';
import {Option as barspurple}  from './bars-purple.js';
export default {
  mixins: [minXinChart],
  props: {
    data: {
      default: function () {
        return [70, 62, 41];
      }
    }
  },
  data () {
    return {
    };
  },
  created () {
    this.barsblue = barsblue;
    this.barsorange = barsorange;
    this.barspurple = barspurple;
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
