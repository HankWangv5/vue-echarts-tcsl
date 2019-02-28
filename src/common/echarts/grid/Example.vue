<template>
    <div class="box" :id="id">
        <grid ref='refs' :left-height="height" @drill = 'drill' ></grid>
        <!-- <grid :grid-data="data" :propsColumns="columns" :showCheckbox="showCheckbox" :columnSet="columnSet" :left-height="700" @focus="focus" @updateValue="update" :showRate="true"></grid> -->
    </div>
</template>

<script>
import Grid from './index';
import {mapGetters} from 'vuex';

export default {
  components: {
    Grid
  },
  data () {
    return {
      data: [],
      columns: [
        {title: '大佬', key: 'brandName', compare_names: ['大佬'], isX: 'true', isSort: true},
        {title: 'ok', key: 'shipDesc', compare_names: ['ok'], isX: 'true'},
        {title: 'ok', key: 'shipDescq', compare_names: ['ok'], isX: 'true'},
        {title: 'ok', key: 'shipDescqq', compare_names: ['ok'], isX: 'true'},
        {title: '大佬的杰作', key: 'goodsName', compare_names: ['不含税金额', '2014年', '大佬的杰作']},
        {title: '大佬的杰作we', key: 'goodsName', compare_names: ['不含税金额', '2014年', '大佬的杰作we']},
        {title: '嗯', key: 'sn', compare_names: ['不含税金额', '2015年', 'yi']}
      ],
      height: 0
      // oneOption: {
      //   mergeTheLineKey: true,  // 合并单元格
      //   totalColumn: false,  // 列总计 最下边的那个
      //   totalLine: false,  // 行总计   最右边的那个
      //   // keyOfSubtotalColumn: ['brandName', 'shipDesc', 'shipDescq'],
      //   // keyOfSubtotalLine: ['brandName'],  // 列小计
      //   // keyOfSubtotalColumn: ['不含税金额', '不含税'], // 行小计
      //   sortCallback: () => {
      //     window.console.log(1);
      //   }
      // }
    };
  },
  props: {
    id: {},
    chartData: {},
    setting: {},
    chartInfo: {
      default: {
        compareCondition: []
      }
    },
    drillInfo: {}
  },
  mounted () {
    this.setChartData(this.chartData, this.chartInfo);
  },
  computed: {
    ...mapGetters({theme: 'theme'})
  },
  methods: {
    resize () {
      this.$refs.refs.handleResize();
    },
    setChartData (params, chartInfo) {
      let columns = [];
      let data = [];
      let arr = {};
      let lentgh = 0;
      let sortFlag = 0;
      console.log(chartInfo.sort);
      if (chartInfo.sort[0]) {
        sortFlag = chartInfo.sort[0].sortFlag === 'asc' ? 2 : 1;
      }
      params.xaxis.forEach((element, i) => {
        let obj = {};
        obj.isX = true;
        obj.compare_names = element.name.split(':%');
        obj.compare_values = element.name;
        obj.title = obj.compare_names[obj.compare_names.length - 1];
        // obj.key = `lishi${i}`;
        obj.key = chartInfo.dimensionCondition[i] ? chartInfo.dimensionCondition[i].uniqId : `lishi${i}`;
        obj.fieldId = chartInfo.dimensionCondition[i].fieldId;
        if (chartInfo.sort[0]) {
          obj.isSort = chartInfo.sort[0].fieldId === element.name ? sortFlag : 0;
        }

        if (this.drillInfo) {
          if (this.drillInfo.activeLevel && this.drillInfo.activeLevel.length > 0) {
            this.drillInfo.activeLevel.forEach((e) => {
              const level = e.split('-');
              const isClick = this.drillInfo.drillCondition[parseInt(level[0])].length > (parseInt(level[1]) + 1);
              if (isClick && this.drillInfo.drillCondition[parseInt(level[0])][level[1]].uniqId === chartInfo.dimensionCondition[i].uniqId) {
                obj.canJump = true;
              }
            });
          }
        }
        columns.push(obj);
        if (element.data.length) {
          lentgh = element.data.length;
        }
        arr[obj.key] = element.data;
      });

      params.yaxis.forEach((element, i) => {
        let obj = {};
        obj.isX = false;
        obj.compare_names = element.name.split(':%');
        obj.compare_values = element.name;
        obj.title = obj.compare_names[obj.compare_names.length - 1];
        obj.key = `lishide${i}`;
        this.chartInfo.reportParam.indexCondition.forEach((x) => {
          let val;
          if (x.fieldGroup === 6) {
            val = `${x.aliasName}`;
          } else {
            val = `${x.aliasName}(${x.aggregatorName})`;
          }
          if (obj.compare_names[0] === val) {
            obj.pres = x.numDisplayed;
          }
        });
        if (chartInfo.sort[0]) {
          obj.isSort = chartInfo.sort[0].fieldId === element.name ? sortFlag : 0;
        }
        columns.push(obj);
        if (element.data.length) {
          lentgh = element.data.length;
        }
        arr[obj.key] = element.data.map((e) => {
          let item = e !== 'null' ? parseFloat(e).toFixed(6) : '--';
          return item;
        });
      });
      for (let index = 0; index < lentgh; index++) {
        let obj = Object.keys(arr).reduce((p, e) => {
          p[e] = arr[e][index] || '';
          return p;
        }, {});
        data.push(obj);
      }
      this.columns = columns;
      this.data = data;
      this.$refs.refs.setOption({
        propsColumns: columns,
        gridData: data,
        oneOption: this.setting[1],
        theme: this.theme || 'purple'
      });
    },
    drill (obj) {
      this.$emit('drill', obj);
    }
  },
  watch: {
    drillInfo: {
      handler (newValue, oldValue) {
        this.setChartData(this.chartData, this.chartInfo);
      },
      deep: true
    },
    chartData: {
      handler (newValue, oldValue) {
        this.setChartData(newValue, this.chartInfo);
      },
      deep: true
    },
    setting: {
      handler (newValue, oldValue) {
        this.setChartData(this.chartData, this.chartInfo);
      },
      deep: true
    },
    oneOption: {
      handler (newValue, oldValue) {
        this.$refs.refs.setOption({
          propsColumns: this.columns,
          gridData: this.data,
          oneOption: this.setting[1]
        });
      },
      deep: true
    },
    theme () {
      this.setChartData(this.chartData, this.chartInfo);
    }
  }
};
</script>
<style lang="scss" scoped>
    .box {
        /* position: fixed; */
        width: 100%;
        height: calc(100% - 20px);
        // padding: 20px;
    }
</style>
