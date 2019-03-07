<template>
    <div :id="id"></div>
</template>

<script>
import 'echarts/lib/chart/bar';
import minXinChart from '../mixin';
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
