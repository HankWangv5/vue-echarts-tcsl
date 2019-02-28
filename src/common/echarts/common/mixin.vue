<script>
import {mapGetters} from 'vuex';

export default {
  data () {
    return {
      change: Function
    };
  },
  props: {
    id: String,
    setting: Array,
    chartData: Object,
    oneOption: Object,
    drillInfo: Object,
    chartInfo: Object
  },
  mounted () {
    this.initChart();
    window.addEventListener('resize', this.resize);
    this.isClick();
  },
  beforeDestroy () {
    this.chart.dispose();
    window.removeEventListener('resize', this.resize);
  },
  computed: {
    ...mapGetters({theme: 'theme'})
  },
  methods: {
    resize () {
      this.chart.resize();
    },
    isClick (optionTask) { // 是否可点击（是否支持钻取）
      this.chart.off('click');
      if (this.drillInfo && this.drillInfo.activeLevel.length > 0) {
        const level = this.drillInfo.activeLevel[0].split('-');
        const isClick = this.drillInfo.drillCondition[parseInt(level[0])].length > (parseInt(level[1]) + 1);
        if (isClick) {
          optionTask.baseOption.series.forEach((serie) => { // 鼠标经过改成小手
            serie.cursor = 'pointer';
          });
          this.chart.on('click', (param) => {
            // console.log(param);
            if (typeof param.seriesIndex !== 'undefined' && param.componentType !== 'markLine') {
              const demensionId = this.drillInfo.drillCondition[level[0]][level[1]].uniqId;
              this.$emit('drill', {demensionId: demensionId, value: param.name});
            }
          });
          /* this.chart.getZr().on('click', (params) => {
            var pointInPixel = [params.offsetX, params.offsetY];
            if (this.chart.containPixel('grid', pointInPixel)) {
              let xIndex = this.chart.convertFromPixel({seriesIndex: 0}, [params.offsetX, params.offsetY])[0];
              this.chart.getZr().setCursorStyle('pointer');
              let op = this.chart.getOption();
              let name = op.xAxis[0].data[xIndex];
              const demensionId = this.drillInfo.drillCondition[level[0]][level[1]].uniqId;
              this.$emit('drill', {demensionId: demensionId, value: name});
            }
          }); */
        } else {
          optionTask.baseOption.series.forEach((serie) => {
            serie.cursor = 'default';
          });
        }
      } else {
        optionTask.baseOption.series.forEach((serie) => {
          serie.cursor = 'default';
        });
      }
      this.chart.setOption(optionTask);
    },
    changeSetting (initFun, option) { // 每个图表动态传参
      this.setting.forEach(set => {
        const oneOption = initFun(set, this.setting);
        Object.assign(option, oneOption);
      });
      this.chart.setOption(option);
    }
  },
  watch: {
    theme () {
      this.chart.dispose();
      this.initChart();
    },
    drillInfo: {
      handler () {
        this.isClick();
        this.changeSetting(); // 下钻路径切换时，要把路径节点对应的配置加载并应用到图表
      },
      deep: true
    }
  }
};
</script>
