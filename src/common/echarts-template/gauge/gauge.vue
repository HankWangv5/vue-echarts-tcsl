<template>
    <div :id="id"></div>
</template>

<script>
import 'echarts-liquidfill';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/gauge';
import 'echarts/lib/component/markPoint';
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
