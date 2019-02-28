<template>
    <div :id="id"></div>
</template>

<script>
import 'echarts/lib/chart/map';
import 'echarts/map/js/china';
import minXinChart from '../mixin';
export default {
  mixins: [minXinChart],
  data () {
    return {
    };
  },
  mounted () {
    // console.log(liquidfill);
  }
};
</script>

<style scoped>

</style>
