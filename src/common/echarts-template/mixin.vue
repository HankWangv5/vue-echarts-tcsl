<script>
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';

export default {
  props: {
    id: String,
    chartType: String,
    data: Object,
    theme: String
  },
  mounted () {
    setTimeout(() => {
      this.initChart();
    }, 1000);
    window.addEventListener('resize', this.resize);
  },
  methods: {
    initChart () {
      const dcChart = echarts.init(document.getElementById(this.id), {render: 'svg'});
      this.setOption(dcChart, this.chartType);
    },
    async setOption (dcChart, chartType) {
      const {Option} = await require(/* webpackChunkName: "[request]" */ `./${chartType}/${chartType}-${this.theme}.js`);
      dcChart.setOption(Option, true);
    },
    resize () {
      // console.log(echarts.getInstanceByDom(document.getElementById(this.id)));
      echarts.getInstanceByDom(document.getElementById(this.id)).resize();
    }
  },
  watch: {
    theme () { // 监听主题变化,编辑页面切换主题重新渲染
      this.initChart();
    }
  },
  beforeDestroy () {
    // echarts.getInstanceByDom(document.getElementById(this.id)).dispose();
    window.removeEventListener('resize', this.resize);
  }
};
</script>
