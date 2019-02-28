<template>
    <div  class="farther" ref="parent" :class="parentClass">
        {{title}}
        <component :chartType="chartType" ref="chartTemplate" :is="'dc-chart-template-' + chartType" :theme="theme"
                   :id="specialId" :chartData="chartData"  v-if="isShowChart && !loading" style="height:calc(100% - 5px);">
        </component>
        <div v-show="!isShowChart && !loading" class="child" v-text="chartMsg"></div>
    </div>

</template>

<script>
import {mapGetters} from 'vuex';
export default {
  data () {
    return {
      loading: false,
      isShowChart: true,
      chart: '',
      chartMsg: '当前图表无数据'
    };
  },
  computed: {
    ...mapGetters({theme: 'bigScreenTheme'}),
    parentClass () {
      return `chart-parent-${this.theme}`;
    }
  },
  props: {
    chartType: String,
    chartData: Object,
    title: String,
    specialId: {
      default: function () {
        return new Date().getTime().toString();
      }
    }
  },
  methods: {
    loaderStop () {
      this.loading = false;
      if (typeof this.chartData === 'string') {
        this.chartMsg = this.chartData;
      } else {
        this.chartMsg = '当前图表无数据';
      }
    },
    loader () {
      this.loading = true;
    },
    isShowChartUI () {
      if (this.chartData) {
        this.loaderStop();
        this.isShowChart = true;
      }
    },
    resize () {
      this.$refs.chartTemplate.resize();
    }
  },
  components: { // 图表组件注册机
    'dc-chart-template-pie': resolve => { // 饼
      require(['@/common/echarts-template/pie/pie.vue'], resolve);
    },
    'dc-chart-template-ring': resolve => { // 环
      require(['@/common/echarts-template/ring/ring.vue'], resolve);
    },
    'dc-chart-template-gauge': resolve => { // 计量图
      require(['@/common/echarts-template/gauge/gauge.vue'], resolve);
    },
    'dc-chart-template-line': resolve => { // 线
      require(['@/common/echarts-template/line/line.vue'], resolve);
    },
    'dc-chart-template-number': resolve => { // 翻牌器
      require(['@/common/echarts-template/number/number.vue'], resolve);
    },
    'dc-chart-template-column': resolve => { // 柱
      require(['@/common/echarts-template/column/column.vue'], resolve);
    },
    'dc-chart-template-stack': resolve => { // 堆积
      require(['@/common/echarts-template/stack/stack.vue'], resolve);
    },
    'dc-chart-template-bars': resolve => { // 条形图
      require(['@/common/echarts-template/bars/bars.vue'], resolve);
    },
    'dc-chart-template-area': resolve => { // 面积
      require(['@/common/echarts-template/area/area.vue'], resolve);
    },
    'dc-chart-template-target': resolve => { // 指标卡
      require(['@/common/echarts-template/target/target.vue'], resolve);
    },
    'dc-chart-template-table': resolve => { // 表
      require(['@/common/echarts-template/table/table.vue'], resolve);
    },
    'dc-chart-template-map': resolve => { // 地图
      require(['@/common/echarts-template/map/map.vue'], resolve);
    }
  }
};
</script>
<style lang="scss" scoped>
    .farther {
        width: 100%;
        height: 100%;
        position: relative;
        display: inline-block;
    }
    @mixin chart-parent($font-color, $border-image){
        font-size:18px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color: $font-color;
        border:15px solid transparent;
        border-image: url($border-image) 30 30 stretch;
        -moz-border-image:url($border-image) 30 30 stretch;/* Old Firefox */
        -webkit-border-image:url($border-image) 30 30 stretch;/* Safari and Chrome */
        -o-border-image:url($border-image) 30 30 stretch;
    }
    .chart-parent-purple{
        $font-color: rgba(226,202,255,1);
        $border-image: '~@/assets/static/chart/purple_border.png';
        background:rgba(139,45,255,0.07);
        @include chart-parent($font-color, $border-image);
    }
    .chart-parent-orange{
        $font-color: #FFB617;
        $border-image: '~@/assets/static/chart/orange_border.png';
        background:rgba(31,21,13,0.5);
        @include chart-parent($font-color, $border-image);
    }
    .chart-parent-blue{
        $font-color: #65B8FF;
        $border-color: rgba(63,95,252,1);
        @include chart-parent($font-color, '');
        > div{
            margin-top: 5px;
            padding-top: 10px;
            border-top: $border-color 1px solid;
            background:rgba(80,102,244, .1);
            background-clip: content-box;
        }
        &:before{
            $height: 3px;
            content:"..";
            color: transparent;
            background-color:$border-color;
            height: $height;
            width: $height * 2;
            margin-top: 28px - ($height / 2);
            position: absolute;
            z-index: 2;
        }
    }
</style>
