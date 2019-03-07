<template>
  <div id="app">
    <Vue-Echarts-Tcsl specialId="3"  chartType="area" theme='purple' title="test2"></Vue-Echarts-Tcsl>
    <Vue-Echarts-Tcsl specialId="4" chartType="target" theme='purple' title="test3"></Vue-Echarts-Tcsl>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
}

</style>
