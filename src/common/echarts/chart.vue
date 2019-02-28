<template>
    <div  class="farther">
        <div v-loading='loading' :style="{height: isShowPath ? 'calc(100% - 25px)' : '100%'}">
            <div v-if="isShowChart && !loading" style="height: 100%;">
                <component :chartType="chartType" ref="thisChart" :chartInfo="info.info" :is="chart" :setting="info.info.reportConf"
                           :id="specialId||info.reportCode" :chartData="info.result" :drillInfo="{'activeLevel': drillLevel, 'drillCondition': info.info.drillThroughPath}" @drill="drill"
                           :oneOption="oneOption" style="height: 100%;" :column="column">
                </component>
            </div>
            <div v-if="!isShowChart && !loading" class="child" v-text="chartMsg"></div>
        </div>
        <dc-breadcrumb v-if="isShowPath" :drillPath="drillPath" @drill="drill"></dc-breadcrumb>
    </div>

</template>

<script>
import {COMPARE_SPLIT, ARRAY_MODE, GAUGE_COND_SET} from '@/common/chartConfigType.js';
export default {
  data () {
    return {
      loading: true,
      isShowChart: true,
      chart: '',
      column: 1,
      chartMsg: '当前图表无数据'
    };
  },
  props: {
    chartType: String,
    info: {},
    oneOption: {},
    drillLevel: Array,
    drillPath: {
      type: Array,
      default: function () {
        return [];
      }
    },
    specialId: {
      default: function () {
        return null;
      }
    }
  },
  methods: {
    loaderStop () {
      this.loading = false;
      if (typeof this.info.result === 'string') {
        this.chartMsg = this.info.result;
      } else {
        this.chartMsg = '当前图表无数据';
      }
    },
    loader () {
      this.loading = true;
    },
    drill (absolutePath) {
      this.$emit('drill', absolutePath);
    },
    isMultiChart () {
      const COMPARE_CHART = ['column', 'area', 'line', 'gauge', 'stack', 'doubleaxis']; // 支持对比的图表类型
      if (COMPARE_CHART.find((type) => (type === this.chartType))) {
        let option = this.info.info.reportConf.find((option) => {
          return (option.type === COMPARE_SPLIT && option.value.isCompareSplit) || (option.type === ARRAY_MODE);
        });
        if (option) {
          const count = option.value.columnCount || option.value;
          this.column = 24 / parseInt(count);
          this.$nextTick(() => {
            if (this.$refs.thisChart) this.$refs.thisChart.resolveData();
          });
        }
        this.chart = option ? `dc-chart-multi-chart` : `dc-chart-${this.chartType}`;
      } else { // map,target,table,pie
        this.chart = `dc-chart-${this.chartType}`;
      }
    },
    isShowChartUI () {
      if (this.info) {
        const chartData = this.info.result;
        if (chartData.hasOwnProperty('xaxis') || chartData.hasOwnProperty('yaxis')) {
          let xai = null;
          if (chartData.xaxis) {
            xai = chartData.xaxis.find((item) => {
              return item.data.length > 0;
            });
          }

          let yai = null;
          if (chartData.yaxis) {
            yai = chartData.yaxis.find((item) => {
              return item.data.length > 0;
            });
          }

          let yaid = null;
          if (chartData.yaxisDouble) {
            yaid = chartData.yaxisDouble.find((item) => {
              return item.data.length > 0;
            });
          }

          const tempArray = ['table', 'target', 'gauge', 'map', 'twoaxis'];
          if (((xai && yai) || (xai && yaid)) ||
            (tempArray.find((type) => (type === this.chartType)) && (xai || yai)) ||
            (this.chartType === 'pie' && yai)) {
            this.isMultiChart();
            this.loaderStop();
            this.isShowChart = true;
          } else {
            this.isMultiChart();
            this.loaderStop();
            this.isShowChart = false;
          }
        } else {
          this.loaderStop();
          this.isShowChart = false;
        }
      }
    }
  },
  computed: {
    isShowPath () { // 路径长度 > 0 && chartType不是目标和指标图
      const temp = ['target', 'gauge'];
      if (this.drillPath.length > 0 && !temp.find((type) => (type === this.chartType))) {
        return true;
      }
      return false;
    }
  },
  components: { // 图表组件注册机
    'dc-chart-target': resolve => { // 单指标
      require(['@/common/echarts/target.vue'], resolve);
    },
    'dc-chart-pie': resolve => { // 饼
      require(['@/common/echarts/pie.vue'], resolve);
    },
    'dc-chart-column': resolve => { // 柱
      require(['@/common/echarts/column.vue'], resolve);
    },
    'dc-chart-area': resolve => { // 面积
      require(['@/common/echarts/area.vue'], resolve);
    },
    'dc-chart-line': resolve => { // 线
      require(['@/common/echarts/line.vue'], resolve);
    },
    'dc-chart-gauge': resolve => { // 线
      require(['@/common/echarts/gauge.vue'], resolve);
    },
    'dc-chart-table': resolve => { // 表
      require(['@/common/echarts/grid/Example.vue'], resolve);
    },
    'dc-chart-map': resolve => { // 地图
      require(['@/common/echarts/map.vue'], resolve);
    },
    'dc-chart-stack': resolve => { // 堆积图
      require(['@/common/echarts/stack.vue'], resolve);
    },
    'dc-chart-doubleaxis': resolve => { // 双轴图
      require(['@/common/echarts/doubleAxis.vue'], resolve);
    },
    'dc-chart-multi-chart': resolve => { // 多线布局
      require(['@/common/echarts/common/chartMulti.vue'], resolve);
    },
    'dc-breadcrumb': resolve => { // 面包屑
      require(['@/common/echarts/common/breadcrumb.vue'], resolve);
    }

  },
  watch: {
    oneOption: {
      handler (newValue) {
        if (newValue.isNeedQuery) {
          this.loader();
        } else if ((newValue.type === COMPARE_SPLIT) || (newValue.type === ARRAY_MODE) || (newValue.type === GAUGE_COND_SET)) {
          this.isMultiChart();
        } else {
          this.isMultiChart();
        }
      },
      deep: true
    },
    info: {
      handler (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.isShowChartUI();
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/css/variable.scss';
    .farther {
        height: 100%;
        position: relative;
        overflow-y: auto;
        .child {
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            position: absolute;
            font-size: $font-size-2;
            color: #939393;
            height: 14px;
            text-align: center;
        }
    }
</style>
