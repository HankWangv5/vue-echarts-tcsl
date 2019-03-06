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
      window.addEventListener('resize', this.resize);
    }, 900);
  },
  methods: {
    initChart () {
      // debugger;
      try {
        const dcChart = echarts.init(document.getElementById(this.id), {render: 'svg'});
        this.setOption(dcChart, this.chartType);
        dcChart.resize();
      } catch (e) {
        console.trace(`'${this.id}' dom unRendered`);
      }
    },
    async setOption (dcChart, chartType) {
      const {Option} = await import(/* webpackChunkName: "[request]" */ `./${chartType}/${chartType}-${this.theme}.js`);
      this.resolveData(Option);
      dcChart.setOption(Option, true);
    },
    resize () {
      try {
        echarts.getInstanceByDom(document.getElementById(this.id)).resize();
      } catch (e) {
        console.trace(`'${this.id}' dom unRendered`);
      }
    }
  },
  watch: {
    theme () { // 监听主题变化,编辑页面切换主题重新渲染
      this.initChart();
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize);
  }
};
</script>
