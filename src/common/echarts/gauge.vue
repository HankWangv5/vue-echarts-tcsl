<template>
    <div :id="id"></div>
</template>

<script>
import {gaugeOption, initGauge, initGaugeOption, utils} from './gauge';
import minXinChart from './common/mixin';
import {TARGET_VALUE} from '@/common/chartConfigType.js';

export default {
  mixins: [minXinChart],
  beforeMount () {
    this.changeSetting = this.changeSetting.bind({}, initGaugeOption, gaugeOption);
    this.isClick = this.isClick.bind({}, gaugeOption);
  },
  methods: {
    initChart () {
      this.resolveData();
      this.setting.forEach(set => {
        const oneOption = initGaugeOption(set, this.setting, this.chartData);
        Object.assign(gaugeOption, oneOption);
      });
      this.chart = initGauge(`${this.id}`, gaugeOption);
    },
    resolveData () {
      if (this.chartData.yaxis) {
        if (this.chartData.yaxis[0].data[0] === 'null') {
          this.chartData.yaxis[0].data[0] = 0;
        }
        let target = this.chartData.yaxis[0].data[0];
        let goaler = this.setting.find((setting) => {
          return setting.type === TARGET_VALUE;
        }).value;
        let serie = gaugeOption.baseOption.series[0];
        serie.min = 0;
        serie.data = {value: target, pres: this.chartInfo.reportParam.indexCondition[0].numDisplayed};
        if (!goaler) { // 没有设置目标值或目标值为0
          serie.max = target;
          serie.detail.formatter = '100%';
        } else {
          serie.max = goaler;
          if (parseFloat(target) <= 0) { // bug:对于负值和0进行归0处理，统一计算为0%
            serie.detail.formatter = '0%';
          } else {
            let percent = (target / goaler * 100).toFixed(2);
            serie.detail.formatter = percent + '%';
          }
        }
        gaugeOption.baseOption.title[0].text = this.chartData.compare || '';
        gaugeOption.baseOption.title[1].text = this.chartData.yaxis[0].name;
        gaugeOption.baseOption.title[2].text = this.formatter(this.chartData.yaxis[0].data[0], this.chartInfo.reportParam.indexCondition[0].numDisplayed);
        gaugeOption.baseOption.series[0].name = (this.chartData.compare || '') + ' ' + this.chartData.yaxis[0].name;
      }
    },
    formatter (value, pres) {
      if (!pres) return value;
      if (pres.type === 'dec') {
        value = utils.addingUnit(value, pres.state.unit);
        value = utils.fmoney(value, pres.state.dec, pres.state.commas);
      } else {
        value = utils.addingUnit(value, pres.state.unit);
        value = utils.fmoney(value, pres.state.dec, pres.state.commas);
      }
      return `${value + (pres ? pres.state.unit : '')}`;
    }
  },
  watch: {
    oneOption: {
      handler (newValue) {
        let option = initGaugeOption(newValue, this.setting, this.chartData);
        this.chart.clear();
        this.chart.setOption(option);
      },
      deep: true
    }
  }
};
</script>
