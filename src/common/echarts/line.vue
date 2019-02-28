<template>
    <div :id="id"></div>
</template>

<script>
import {initLine, initLineOption, lineOption} from './line';
import {getAiLabel, dealMarklines, dealLegendText} from './common/common';
import minXinChart from './common/mixin';

export default {
  mixins: [minXinChart],
  beforeMount () {
    this.changeSetting = this.changeSetting.bind({}, initLineOption, lineOption);
    this.isClick = this.isClick.bind({}, lineOption);
  },
  methods: {
    initChart () {
      this.resolveData();
      this.setting.forEach(set => {
        const oneOption = initLineOption(set, this.setting, dealMarklines(this.setting, this.chartData));
        Object.assign(lineOption, oneOption);
      });
      this.chart = initLine(`${this.id}`, lineOption);
      this.chart.on('datazoom', (params) => { // 拖动datazoom
        let lineOption = this.chart.getOption();
        let data = lineOption.baseOption.series[0].data;
        const Num = data.length * ((params.end - params.start) / 100);
        this.computeLabel(Num);
        this.chart.setOption(lineOption);
      });
    },
    resolveData () {
      lineOption.baseOption.series[0].data = ['0'];
      if (this.chartData.xaxis) {
        let yaxis = JSON.parse(JSON.stringify(this.chartData.yaxis));
        if (yaxis.length > 0) {
          lineOption.baseOption.series = [lineOption.baseOption.series[0]];// 初始化保证series只保留单条数据(唯一性)
          if (yaxis.length > 1) {
            yaxis.forEach((y, index) => {
              // 为对应数值设置添加单位
              let item = Object.assign({}, lineOption.baseOption.series[0]);
              /** 处理legend坐标轴系列对比和无对比各种情况的显示 **/
              item.name = dealLegendText(this.chartInfo, y);
              item.data = y.data.map((x) => {
                let pres = null;
                let nameList = y.name.split(':%');
                this.chartInfo.reportParam.indexCondition.forEach((x) => {
                  let val;
                  if (x.fieldGroup === 6) {
                    val = `${x.aliasName}`;
                  } else {
                    val = `${x.aliasName}(${x.aggregatorName})`;
                  }
                  if (nameList[0] === val) {
                    pres = x.numDisplayed;
                  }
                });
                return {value: x, pres};
              });
              if (index === 0) {
                lineOption.baseOption.series[0] = item;
              } else {
                lineOption.baseOption.series.push(item);
              }
            });
          } else {
            let item = Object.assign({}, lineOption.baseOption.series[0]);
            item.name = dealLegendText(this.chartInfo, yaxis[0]);
            // item.data = [{value: yaxis[0].data, pres: this.chartInfo.reportParam.indexCondition[0].numDisplayed}];
            item.data = yaxis[0].data.map((x) => { return {value: x, pres: this.chartInfo.reportParam.indexCondition[0].numDisplayed}; });
            lineOption.baseOption.series[0] = item;
          }
          this.computeLabel(); // 无论如何只显示第一条线的label
        }
        lineOption.baseOption.xAxis.data = this.chartData.xaxis.length ? this.chartData.xaxis[0].data : ['暂无'];
      }
    },
    computeLabel (Num) {
      let data = lineOption.baseOption.series[0].data;
      const width = document.getElementById(this.id).offsetWidth;
      const weight = width / (Num || data.length);
      if (weight >= 11.3) {
        delete lineOption.baseOption.xAxis.axisLabel.interval;
        data = data.map((da) => {
          if (typeof da !== 'object') {
            let daa = {value: da, label: {show: false}};
            return daa;
          } else {
            da.label = {show: false};
            return da;
          }
        });
        data = getAiLabel(data, this.id, Num);
        lineOption.baseOption.series[0].data = data;
      } else {
        let xiShu = (Num || data.length) / (width / 100);
        data = data.map((da) => {
          if (typeof da !== 'object') {
            let daa = {value: da, label: {show: true}};
            return daa;
          } else {
            da.label = {show: true};
            return da;
          }
        });
        lineOption.baseOption.xAxis.axisLabel.interval = parseInt(xiShu);
      }
    }
  },
  watch: {
    oneOption: {
      handler (newValue) {
        let option = initLineOption(newValue, this.setting, dealMarklines(this.setting, this.chartData));
        this.chart.clear();
        this.chart.setOption(option);
      },
      deep: true
    }
  }
};
</script>
