<template>
    <div :id="id"></div>
</template>

<script>
import {columnOption, initColumn, initColumnOption} from './column';
import {getAiLabel, dealMarklines, dealLegendText} from './common/common';
import minXinChart from './common/mixin';

export default {
  mixins: [minXinChart],
  beforeMount () {
    this.changeSetting = this.changeSetting.bind({}, initColumnOption, columnOption);
    this.isClick = this.isClick.bind({}, columnOption);
  },
  methods: {
    initChart () {
      this.resolveData();
      this.setting.forEach(set => {
        const oneOption = initColumnOption(set, this.setting, dealMarklines(this.setting, this.chartData));
        Object.assign(columnOption, oneOption);
      });
      this.chart = initColumn(`${this.id}`, columnOption);
      this.chart.on('datazoom', (params) => { // 拖动datazoom
        let columnOption = this.chart.getOption();
        if (columnOption.series.length > 1) {
          const Num = this.array.length * ((params.end - params.start) / 100);
          this.array = getAiLabel(this.array, this.id, Num);
          this.array.forEach((temp) => {
            columnOption.series[temp.latitude[0]].data[temp.latitude[1]] = temp;
          });
        } else {
          let data = columnOption.series[0].data;
          const Num = data.length * ((params.end - params.start) / 100);
          data = getAiLabel(data, this.id, Num);
        }
        this.chart.setOption(columnOption);
      });
    },
    resolveData () {
      columnOption.baseOption.series[0].data = ['0'];
      if (this.chartData.xaxis) {
        let yaxis = JSON.parse(JSON.stringify(this.chartData.yaxis));
        if (yaxis.length > 0) {
          columnOption.baseOption.series = [columnOption.baseOption.series[0]];// 初始化保证series只保留单条数据(唯一性)
          if (yaxis.length > 1) {
            this.array = [];
            for (let j = 0; j < yaxis[0].data.length; j++) {
              for (let i = 0; i < yaxis.length; i++) {
                if (typeof yaxis[i].data[j] !== 'object') {
                  // 为对应数值设置添加单位
                  let pres = null;
                  let nameList = yaxis[i].name.split(':%');
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
                  // 为对应数值设置添加单位
                  var da = {value: yaxis[i].data[j], label: {show: false}, latitude: [i, j], pres};
                  this.array.push(da);
                } else {
                  yaxis[i].data[j].label = {show: false};
                  this.array.push(yaxis[i].data[j]);
                }
              }
            }
            this.array = getAiLabel(this.array, this.id);
            this.array.forEach((temp) => {
              yaxis[temp.latitude[0]].data[temp.latitude[1]] = temp;
            });
            yaxis.forEach((y, index) => {
              let item = Object.assign({}, columnOption.baseOption.series[0]);
              /** 处理legend坐标轴系列对比和无对比各种情况的显示 **/
              item.name = dealLegendText(this.chartInfo, y);
              // TODo
              item.data = y.data;
              if (index === 0) {
                columnOption.baseOption.series[0] = item;
              } else {
                columnOption.baseOption.series.push(item);
              }
            });
          } else {
            let item = Object.assign({}, columnOption.baseOption.series[0]);
            // item.name = yaxis[0].name.replace(/:%/g, '/'); // /g全文匹配标识
            item.name = dealLegendText(this.chartInfo, yaxis[0]);
            item.data = yaxis[0].data;
            item.data = item.data.map((da) => {
              if (typeof da !== 'object') {
                let daa = {value: da, label: {show: false}, pres: this.chartInfo.reportParam.indexCondition[0].numDisplayed};
                return daa;
              } else {
                da.label = {show: false};
                return da;
              }
            });
            item.data = getAiLabel(item.data, this.id);
            columnOption.baseOption.series[0] = item;
          }
        }
        columnOption.baseOption.xAxis.data = this.chartData.xaxis.length ? this.chartData.xaxis[0].data : ['暂无'];
      }
    }
  },
  watch: {
    oneOption: {
      handler (newValue) {
        let option = initColumnOption(newValue, this.setting, dealMarklines(this.setting, this.chartData));
        this.chart.clear();
        this.chart.setOption(option);
      },
      deep: true
    }
  }
};
</script>
