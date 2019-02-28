<template>
    <div :id="id"></div>
</template>

<script>
import {columnOption, initColumn, initColumnOption} from './stack.js';
import {getAiLabel, dealMarklines, dealLegendText, addingUnit, fmoney} from './common/common';
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
      this.chart.on('legendselectchanged', (params) => { // 点击label事件
        let b = params.selected;
        let d = [];
        for (var key in b) {
          if (b[key]) {
            for (var i = 0, l = columnOption.baseOption.series.length; i < l; i++) {
              var changename = columnOption.baseOption.series[i]['name'];
              if (changename === key) {
                d.push(i);// 得到状态是true的legend对应的series的下标
              }
            }
          }
        }
        let arr = [];
        let yaxis = JSON.parse(JSON.stringify(this.chartData.yaxis));
        let dataLength = yaxis[0].data.length;
        for (let i = 0; i < dataLength; i++) {
          for (let j = 0; j < d.length; j++) {
            arr[i] = parseFloat(arr[i] || '0');
            arr[i] += parseFloat(yaxis[d[j]].data[i]);
          }
        }
        let _pres = this.chartInfo.reportParam.indexCondition[0].numDisplayed;
        arr.forEach((item, index) => {
          arr[index] = addingUnit(arr[index], _pres.state.unit);
          arr[index] = fmoney(arr[index], _pres.state.dec, _pres.state.commas);
          arr[index] = `${arr[index] + (_pres ? _pres.state.unit : '')}`;
        });
        let _len = d.length ? d[d.length - 1] : 0;
        for (let i = 0; i < columnOption.baseOption.series[_len].data.length; i++) {
          columnOption.baseOption.series[_len].data[i].tip = arr[i];
        }
        if (d.length < columnOption.baseOption.series.length) {
          columnOption.baseOption.series[_len].data = getAiLabel(columnOption.baseOption.series[_len].data, this.id);
        } else {
          columnOption.baseOption.series[columnOption.baseOption.series.length - 1].data = getAiLabel(columnOption.baseOption.series[columnOption.baseOption.series.length - 1].data, this.id);
        }
        this.chart.setOption(columnOption);
        // 清空点击label事件之前的label
        this.resetLabel();
      });
    },
    resolveData () {
      columnOption.baseOption.series[0].data = ['0'];
      if (this.chartData.xaxis) {
        let yaxis = JSON.parse(JSON.stringify(this.chartData.yaxis));
        if (yaxis.length > 0) {
          let len = yaxis.length;
          let arr = this.computedTotal(yaxis);
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
                  // var da = {value: yaxis[i].data[j], latitude: [i, j], pres, tip: arr[j]};
                  var da = {value: yaxis[i].data[j], label: {show: false}, latitude: [i, j], pres, tip: arr[j]};
                  this.array.push(da);
                } else {
                  yaxis[i].data[j].label = {show: false};
                  this.array.push(yaxis[i].data[j]);
                }
              }
            }
            // this.array = getAiLabel(this.array, this.id);
            this.array.forEach((temp) => {
              yaxis[temp.latitude[0]].data[temp.latitude[1]] = temp;
            });
            let _arr = this.array.filter((item, index) => index % len === 0);
            _arr.forEach((temp) => {
              yaxis[temp.latitude[0]].data[temp.latitude[1]] = temp;
            });
            yaxis.forEach((y, index) => {
              let item = Object.assign({}, columnOption.baseOption.series[0]);
              /** 处理legend坐标轴系列对比和无对比各种情况的显示 **/
              item.name = dealLegendText(this.chartInfo, y);
              item.stack = 'stack';
              item.data = y.data;
              if (index === 0) {
                columnOption.baseOption.series[0] = item;
              } else {
                columnOption.baseOption.series.push(item);
              }
            });
          } else {
            let item = Object.assign({}, columnOption.baseOption.series[0]);
            item.name = dealLegendText(this.chartInfo, yaxis[0]);
            item.data = yaxis[0].data;
            item.data = item.data.map((da, index) => {
              if (typeof da !== 'object') {
                let daa = {value: da, tip: arr[index], label: {show: false}, pres: this.chartInfo.reportParam.indexCondition[0].numDisplayed};
                return daa;
              } else {
                da.label = {show: false};
                return da;
              }
            });
            item.data = getAiLabel(item.data, this.id);
            columnOption.baseOption.series[0] = item;
          }
          // columnOption.baseOption.series[columnOption.baseOption.series.length - 1].label.formatter = computeTotal(columnOption.baseOption.series);
          columnOption.baseOption.series[len - 1].data = getAiLabel(columnOption.baseOption.series[len - 1].data, this.id);
        }
        columnOption.baseOption.xAxis.data = this.chartData.xaxis.length ? this.chartData.xaxis[0].data : ['暂无'];
      }
    },
    // 重新计算总和
    computedTotal (yaxis) {
      let arr = [];
      let len = yaxis.length;
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < yaxis[i].data.length; j++) {
          arr[j] = parseFloat(arr[j] || '0');
          arr[j] += parseFloat(yaxis[i].data[j]);
        }
      }
      let _pres = this.chartInfo.reportParam.indexCondition[0].numDisplayed;
      arr.forEach((item, index) => {
        arr[index] = addingUnit(arr[index], _pres.state.unit);
        arr[index] = fmoney(arr[index], _pres.state.dec, _pres.state.commas);
        arr[index] = `${arr[index] + (_pres ? _pres.state.unit : '')}`;
      });
      return arr;
    },
    // 还原label
    resetLabel () {
      let yaxis = JSON.parse(JSON.stringify(this.chartData.yaxis));
      let arr = this.computedTotal(yaxis);
      for (let i = 0; i < columnOption.baseOption.series.length; i++) {
        columnOption.baseOption.series[i].label.show = false;
        for (let j = 0; j < columnOption.baseOption.series[i].data.length; j++) {
          columnOption.baseOption.series[i].data[j].tip = arr[i];
          if (columnOption.baseOption.series[i].data[j].label) {
            columnOption.baseOption.series[i].data[j].label.show = false;
          } else {
            columnOption.baseOption.series[i].data[j].label = {};
            columnOption.baseOption.series[i].data[j].label.show = false;
          }
        }
      }
      columnOption.baseOption.series[columnOption.baseOption.series.length - 1].data = getAiLabel(columnOption.baseOption.series[columnOption.baseOption.series.length - 1].data, this.id);
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
