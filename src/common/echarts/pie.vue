<template>
    <div :id="id"></div>
</template>

<script>
import {initPie, initPieOption, pieOption} from './pie';
import minXinChart from './common/mixin';

export default {
  mixins: [minXinChart],
  beforeMount () {
    this.changeSetting = this.changeSetting.bind({}, initPieOption, pieOption);
    this.isClick = this.isClick.bind({}, pieOption);
  },
  methods: {
    initChart () {
      this.setting.forEach(set => {
        const oneOption = initPieOption(set);
        Object.assign(pieOption, oneOption);
      });
      this.resolveData();
      this.chart = initPie(`${this.id}`, pieOption);
      this.chart.on('legendunselected', (selected) => {
        console.log(selected);
      });
      this.chart.on('legendselectchanged', (selected) => { // 拖动datazoom
        // this.chart.getOption().series[0].data;
        // console.log(this.chart.getOption().series[0].data);
        /* let _chartData = this.chart.getOption().series[0].data;
        _chartData = _chartData.map((dd) => {

          return selected.selected[dd.name];
        });
        console.log(_chartData);
        pieOption.baseOption.series[0].data = _chartData; */
        console.log(selected.selected);
        // this.resolveData(selected.selected);
        // this.chart.getOption().series[0].data;
        // this.chart.setOption(pieOption);
        // this.chart.setOption(pieOption);
      });
    },
    resolveData (selected) {
      let _chartData = [];
      if (this.chartData.xaxis.length && this.chartData.yaxis.length) {
        let xAxis = this.chartData.xaxis[0].data;
        let yAxis = this.chartData.yaxis.length ? this.chartData.yaxis[0].data : [];
        let totalNum = 0;
        yAxis.forEach((yi, index) => {
          if (parseFloat(yi) < 0) { // bug:对于负值和0进行归0处理，统一计算为0%
            yi = 0;
          }
          totalNum += parseFloat(yi);
          let obj = {
            name: xAxis[index],
            value: yi,
            pres: this.chartInfo.reportParam.indexCondition[0].numDisplayed
          };
          _chartData.push(obj);
        });
        if (pieOption.baseOption.legend.show) {
          _chartData.forEach((item, index) => {
            if (parseFloat(item.value) / totalNum < 0.04) { // 小于360° * 0.04则不显示
              let he = parseFloat(item.value) / totalNum;
              // console.log('-----', index + 1, _chartData.length - index);
              for (let i = index + 1; i < _chartData.length; i++) {
                if (he < 0.04) { // 相邻相加小于360° * 0.04则不显示
                  he += parseFloat(_chartData[i].value) / totalNum;
                  _chartData[i].labelLine = {
                    show: false,
                    emphasis: {show: false},
                    lineStyle: {opacity: 0}
                  };
                  _chartData[i].label = {show: false};
                } else { // 相邻相加大于360° * 0.04显示
                  return;
                }
              }
              item.labelLine = {show: false, emphasis: {show: false}, lineStyle: {opacity: 0}};
              item.label = {show: false};
            }
          });
        }
      } else {
        if (this.chartData.yaxis.length) { // 只有数值
          let yAxis = this.chartData.yaxis[0].data;
          yAxis.forEach((item) => {
            _chartData.push({
              name: '暂无',
              value: item,
              pres: this.chartInfo.reportParam.indexCondition[0].numDisplayed
            });
          });
        } else { // 只有维度
          this.chartData.xaxis[0].data.forEach((item) => {
            _chartData.push({
              name: item,
              value: 0
            });
          });
        }
      }
      if (_chartData.length > 1 && ((_chartData.length - 1) % 10 === 0)) { // 是否(10 * n )  + 1, 解决10倍数 + 1条数量时，相邻两个扇区颜色相同的问题
        _chartData[_chartData.length - 1].itemStyle = {color: pieOption.baseOption.color[3]};
      }
      pieOption.baseOption.series[0].data = _chartData;
    }
  },
  watch: {
    oneOption: {
      handler (newValue) {
        let option = initPieOption(newValue);
        this.chart.clear();
        this.chart.setOption(option);
      },
      deep: true
    }
  }
};
</script>
