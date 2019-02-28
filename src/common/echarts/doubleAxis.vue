<template>
    <div :id="id"></div>
</template>

<script>
import {columnOption, initColumn, initColumnOption} from './doubleAxis.js';
import {getAiLabel, dealMarklines, dealLegendText} from './common/common';
import minXinChart from './common/mixin';
import * as CONFIG from '@/components/BI/editChart/chartConfig/Config';
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
        const oneOption = initColumnOption(set, this.setting, dealMarklines(this.setting, this.chartData), this.calculationScale(this.chartData));
        Object.assign(columnOption, oneOption);
      });
      this.chart = initColumn(`${this.id}`, columnOption);
      /* this.chart.on('datazoom', (params) => { // 拖动datazoom
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
        this.chart.setOption(columnOption, true);
      }); */
    },
    calculationScale (chartData) {
      let {yaxis, yaxisDouble} = chartData;
      let symmetry = false;
      if (!yaxis || !yaxisDouble) {
        return null;
      }
      yaxis.forEach(e => {
        let min = Math.min(...e.data);
        if (min < 0) symmetry = true;
      });
      yaxisDouble.forEach(e => {
        let min = Math.min(...e.data);
        if (min < 0) symmetry = true;
      });
      return symmetry;
    },
    resolveData () {
      columnOption.baseOption.series[0].data = ['0'];
      let tempOption = Object.assign({}, columnOption.baseOption);
      let tempOptionDouble = Object.assign({}, columnOption.baseOption);
      let _typeOption = CONFIG.getConfigByType(CONFIG.DOUBLE_INDEX.type, this.setting);
      let typeOption = []; // 双轴图的两种图表类型
      typeOption[0] = _typeOption.value[0].split('-')[2];
      typeOption[1] = _typeOption.value[1].split('-')[2];
      if (this.chartData.xaxis) {
        let yaxis = JSON.parse(JSON.stringify(this.chartData.yaxis));
        let yaxisDouble = JSON.parse(JSON.stringify(this.chartData.yaxisDouble));
        if (yaxis.length > 0) {
          // let len = yaxis.length;
          tempOption.series = [tempOption.series[0]];// 初始化保证series只保留单条数据(唯一性)
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
            /*  let _arr = this.array.filter((item, index) => index % len === 0);
            _arr.forEach((temp) => {
              yaxis[temp.latitude[0]].data[temp.latitude[1]] = temp;
            }); */
            yaxis.forEach((y, index) => {
              let item = Object.assign({}, tempOption.series[0]);
              /** 处理legend坐标轴系列对比和无对比各种情况的显示 **/
              item.name = dealLegendText(this.chartInfo, y);
              if (typeOption[0] === 'line') { item.type = 'line'; item.stack = ''; };
              if (typeOption[0] === 'column') { item.type = 'bar'; item.stack = ''; };
              if (typeOption[0] === 'stack') { item.type = 'bar'; item.stack = 'st1'; };
              item.data = y.data;
              item.yAxisIndex = 0;
              if (index === 0) {
                tempOption.series[0] = item;
              } else {
                tempOption.series.push(item);
              }
            });
          } else {
            let item = Object.assign({}, tempOption.series[0]);
            // item.name = yaxis[0].name.replace(/:%/g, '/'); // /g全文匹配标识
            item.data = yaxis[0].data;
            item.name = dealLegendText(this.chartInfo, yaxis[0]);
            item.yAxisIndex = 0;
            if (typeOption[0] === 'line') { item.type = 'line'; item.stack = ''; };
            if (typeOption[0] === 'column') { item.type = 'bar'; item.stack = ''; };
            if (typeOption[0] === 'stack') { item.type = 'bar'; item.stack = 'st1'; };
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
            tempOption.series[0] = item;
          }
          // tempOption.series[len - 1].data = getAiLabel(tempOption.series[len - 1].data, this.id);
        } else {
          tempOption.series = [];
        }
        if (yaxisDouble.length > 0) {
          // let len = yaxisDouble.length;
          // let _pres = this.chartInfo.reportParam.indexDoubleCondition[0].numDisplayed; // 第一个数值的单位
          tempOptionDouble.series = [Object.assign({}, tempOptionDouble.series[0])];// 初始化保证series只保留单条数据(唯一性)
          if (yaxisDouble.length > 1) {
            this.array = [];
            for (let j = 0; j < yaxisDouble[0].data.length; j++) {
              for (let i = 0; i < yaxisDouble.length; i++) {
                if (typeof yaxisDouble[i].data[j] !== 'object') {
                  // 为对应数值设置添加单位
                  let pres = null;
                  let nameList = yaxisDouble[i].name.split(':%');
                  this.chartInfo.reportParam.indexDoubleCondition.forEach((x) => {
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
                  var dada = {value: yaxisDouble[i].data[j], label: {show: false}, latitude: [i, j], pres};
                  this.array.push(dada);
                } else {
                  yaxisDouble[i].data[j].label = {show: false};
                  this.array.push(yaxisDouble[i].data[j]);
                }
              }
            }
            this.array = getAiLabel(this.array, this.id);
            this.array.forEach((temp) => {
              yaxisDouble[temp.latitude[0]].data[temp.latitude[1]] = temp;
            });
            /* let _arr = this.array.filter((item, index) => index % len === 0);
            _arr.forEach((temp) => {
              yaxisDouble[temp.latitude[0]].data[temp.latitude[1]] = temp;
            }); */
            yaxisDouble.forEach((y, index) => {
              let item = Object.assign({}, tempOptionDouble.series[0]);
              /** 处理legend坐标轴系列对比和无对比各种情况的显示 **/
              item.name = dealLegendText(this.chartInfo, y);
              // TODo
              item.data = y.data;
              // item.type = typeOption[1];
              if (typeOption[1] === 'line') { item.type = 'line'; item.stack = ''; };
              if (typeOption[1] === 'column') { item.type = 'bar'; item.stack = ''; };
              if (typeOption[1] === 'stack') { item.type = 'bar'; item.stack = 'st2'; };
              item.yAxisIndex = 1;
              if (index === 0) {
                tempOptionDouble.series[0] = item;
              } else {
                tempOptionDouble.series.push(item);
              }
            });
          } else {
            let item = Object.assign({}, tempOptionDouble.series[0]);
            // item.name = yaxisDouble[0].name.replace(/:%/g, '/'); // /g全文匹配标识
            item.data = yaxisDouble[0].data;
            item.name = dealLegendText(this.chartInfo, yaxisDouble[0]);
            if (typeOption[1] === 'line') { item.type = 'line'; item.stack = ''; };
            if (typeOption[1] === 'column') { item.type = 'bar'; item.stack = ''; };
            if (typeOption[1] === 'stack') { item.type = 'bar'; item.stack = 'st2'; };
            item.data = item.data.map((da) => {
              if (typeof da !== 'object') {
                let daa = {value: da, label: {show: false}, pres: this.chartInfo.reportParam.indexDoubleCondition[0].numDisplayed};
                return daa;
              } else {
                da.label = {show: false};
                return da;
              }
            });
            item.yAxisIndex = 1;
            item.data = getAiLabel(item.data, this.id);
            tempOptionDouble.series[0] = item;
          }
          // tempOptionDouble.series[len - 1].data = getAiLabel(tempOptionDouble.series[len - 1].data, this.id);
        } else {
          tempOptionDouble.series = [];
        }
        columnOption.baseOption.series = tempOption.series.concat(tempOptionDouble.series);
        columnOption.baseOption.xAxis.data = this.chartData.xaxis.length ? this.chartData.xaxis[0].data : ['暂无'];
      }
    }
  },
  watch: {
    oneOption: {
      handler (newValue) {
        let option = initColumnOption(newValue, this.setting, dealMarklines(this.setting, this.chartData), this.calculationScale(this.chartData));
        this.chart.clear();
        this.chart.setOption(option, true);
      },
      deep: true
    }
  }
};
</script>
