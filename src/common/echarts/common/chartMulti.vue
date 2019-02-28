<template>
    <div :id="id" class="target-box">
        <el-row>
            <el-col :span="column" v-for="(target, index) in targets" :key="index" class="mt10 target"
                    :style="{height: as.height}">
                <component :is="chart" :setting="setting" :id="id + 'children' +index" :chartData="target"
                           :oneOption="oneOption" :chartInfo="chartInfo" :drillInfo="drillInfo" @drill="drill"></component>
            </el-col>
            <el-col :span="24" class="mt10 load-more" @click.native="loadMore()" v-show="page < chartBeifen.length">
                加载更多
            </el-col>
        </el-row>
    </div>
</template>

<script>
import * as echarts from 'echarts/src/echarts';
import {sliceArray} from './common.js';

export default {
  data () {
    return {
      targets: [],
      chartBeifen: [],
      page: 1,
      as: {
        height: ''
      }
    };
  },
  props: {
    id: String,
    setting: Array,
    chartData: Object,
    chartType: String,
    oneOption: Object,
    chartInfo: {},
    drillInfo: {},
    column: Number
  },
  components: {
    'dc-chart-column': resolve => { // 柱
      require(['@/common/echarts/column.vue'], resolve);
    },
    'dc-chart-stack': resolve => { // 堆积
      require(['@/common/echarts/stack.vue'], resolve);
    },
    'dc-chart-doubleaxis': resolve => { // 双轴
      require(['@/common/echarts/doubleAxis.vue'], resolve);
    },
    'dc-chart-area': resolve => { // 面积
      require(['@/common/echarts/area.vue'], resolve);
    },
    'dc-chart-line': resolve => { // 线
      require(['@/common/echarts/line.vue'], resolve);
    },
    'dc-chart-gauge': resolve => { // 表盘
      require(['@/common/echarts/gauge.vue'], resolve);
    }
  },
  mounted () {
    this.resolveData();
  },
  methods: {
    resolveData () {
      this.chartBeifen = [];
      this.targets = [];
      this.page = 1;
      if (this.chartData && this.chartData.xaxis) {
        let yaxis = this.chartData.yaxis;
        let yaxisDouble = this.chartData.yaxisDouble; // 双轴图情况
        if (yaxis.length > 0 || yaxisDouble.length > 0) {
          if (this.chartType !== 'gauge') {
            const indexL = this.chartInfo.indexCondition.length;
            const indexL2 = this.chartInfo.reportParam.indexDoubleCondition ? this.chartInfo.reportParam.indexDoubleCondition.length : 0; // 双轴图情况
            if (indexL > 1 || indexL2 > 1) { // 双轴数值个数同时大于1
              const array = sliceArray(yaxis, yaxis.length / indexL);
              // 双轴图情况 数值2
              const array2 = sliceArray(yaxisDouble, yaxisDouble.length / indexL2);
              let dataLength = array.length ? array[0].length : array2[0].length;
              for (let i = 0; i < dataLength; i++) {
                let items = [];
                let items2 = [];
                array.forEach((aa) => {
                  items.push(aa[i]);
                });
                array2.forEach((aa) => {
                  items2.push(aa[i]);
                });
                this.chartBeifen.push(
                  {
                    xaxis: this.chartData.xaxis,
                    yaxis: [...items],
                    yaxisDouble: [...items2]
                  }
                );
              }
            } else if (indexL === 1 && !indexL2) { // 第一个轴数值个数大于1 ，第二轴0个
              yaxis.forEach((item) => {
                this.chartBeifen.push(
                  {
                    xaxis: this.chartData.xaxis,
                    yaxis: [item],
                    yaxisDouble: []
                  }
                );
              });
            } else if (indexL2 === 1 && !indexL) { // 第二个轴数值个数大于1 ，第一轴0个
              yaxisDouble.forEach((item) => {
                this.chartBeifen.push(
                  {
                    xaxis: this.chartData.xaxis,
                    yaxis: [],
                    yaxisDouble: [item]
                  }
                );
              });
            } else { // 双轴个数同时是1个
              yaxis.forEach((item, index) => {
                this.chartBeifen.push(
                  {
                    xaxis: this.chartData.xaxis,
                    yaxis: [item],
                    yaxisDouble: [yaxisDouble[index]]
                  }
                );
              });
            }
          } else { // gauge
            yaxis.forEach((item) => {
              const array = item.name.split(':%');
              const name = array[0];
              array.shift();
              const compare = array.join('/');
              this.chartBeifen.push(
                {
                  businessGoal: this.chartData.businessGoal,
                  compare: compare,
                  xaxis: [],
                  yaxis: [{name: name, data: item.data}]
                }
              );
            });
          }
          this.chartBeifen = sliceArray(this.chartBeifen, (24 / this.column) * 3);
          this.$nextTick(() => { // 保证重绘完，targets是销毁的，然后重新初始化
            this.targets = [...this.chartBeifen[0]];
          });
          // this.targets = [...this.chartBeifen[0]];
        }
      }
      this.resize();
      this.chart = `dc-chart-${this.chartType}`;
    },
    loadMore () {
      this.targets = [...this.targets, ...this.chartBeifen[this.page]];
      this.page++;
    },
    resize () {
      var width = document.getElementById(this.id).offsetWidth;
      if (width < 200) {
        this.as = {
          height: '60px'
        };
      } else if (width < 400) {
        this.as = {
          height: '100px'
        };
      } else if (width < 600) {
        this.as = {
          height: '150px'
        };
      } else {
        this.as = {
          height: '250px'
        };
      }

      this.$nextTick(() => { // 确认父层div重绘后执行
        this.targets.forEach((target, $index) => {
          const dom = document.getElementById(this.id + 'children' + $index);
          if (dom) {
            const chart = echarts.getInstanceByDom(dom);
            chart.resize();
          }
        });
      });
    },
    drill (absolutePath) {
      this.$emit('drill', absolutePath);
    }
  }
};
</script>
<style lang="scss" scoped>
    .target-box {
        padding: 10px;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        //align-items:center;
        flex-direction: column;
        justify-content: flex-start;

        .target {
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            padding: 0 10px;
            > div {
                height: 100%;
            }
        }
        .load-more {
            text-align: center;
            &:hover {
                cursor: pointer;
            }
        }
    }
</style>
