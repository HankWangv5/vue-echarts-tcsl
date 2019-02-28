<template>
    <div :id="id"></div>
</template>

<script>
// import * as echarts from 'echarts/src/echarts';
import 'echarts/lib/chart/pie';
import minXinChart from '../mixin';
export default {
  mixins: [minXinChart],
  data () {
    return {
    };
  }
};
</script>

<style scoped>

</style>
