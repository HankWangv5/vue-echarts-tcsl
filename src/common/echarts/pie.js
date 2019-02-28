import {initChart, fmoney, addingUnit} from './common/common';
import {colorList, legend, toolbox, tooltip, graphic} from './common/constant';
import 'echarts/src/chart/pie';
import 'echarts/src/component/tooltip';
import 'echarts/src/component/title';
import 'echarts/src/component/legend';
import 'echarts/src/component/legendScroll';
import {LEGEND_DISPLAY, CHART_STYLE, CHART_COLOR} from '@/common/chartConfigType.js';
/**
 * @module common/echarts/pie
 * @author ashen
 * @description  饼图，调用initPie方法初始化chart
 * @requires module:common/echarts/theme
 */

/**
 * @param  {Integer} id - 页面id或者class
 * @returns {Object} 图表实例dcChart
 */
export function initPie (id, optionParam = pieOption) {
  return initChart(id, optionParam);
}

export function initPieOption (setting) {
  let legend = {};
  let color = [];
  let SERIES_LABEL = {};
  // let SERIES_ITEMSTYLE = {};
  switch (setting.type) {
    case LEGEND_DISPLAY: {
      const selected = setting.value;
      if (selected === 4) {
        legend = {// 图例不显示配置
          show: false
        };
      } else if (selected === 2) {
        legend = {// 图例上方配置
          show: true,
          orient: 'horizontal',
          top: 10,
          bottom: undefined,
          left: 'center'
        };
      } else if (selected === 1) {
        legend = {// 图例下方配置
          show: true,
          orient: 'horizontal',
          bottom: 10,
          top: undefined,
          left: 'center'
        };
      } else if (selected === 3) {
        legend = {// 图例右侧配置
          show: true,
          orient: 'vertical',
          left: 'right',
          top: '10%'
          // right: 10
        };
      }
      break;
    }
    case CHART_STYLE: {
      const slect = setting.value;
      if (slect.label && !slect.num) {
        SERIES_LABEL = { // 显示类别不显示数值
          show: true,
          formatter: '{b}'
        };
      } else if (!slect.label && slect.num) {
        SERIES_LABEL = { // 不显示类别显示数值
          show: true,
          formatter: '{d}%'
        };
      } else if (!slect.label && !slect.num) {
        SERIES_LABEL = { // 不显示类别标签，不显示数值
          show: false
        };
      } else {
        SERIES_LABEL = { // 显示类别显示数值
          show: true,
          formatter: '{b}\n{d}%'
        };
      }
      break;
    }
    case CHART_COLOR:
      color = colorList[setting.value - 1];
      break;
  }

  Object.assign(pieOption.baseOption.legend, legend);
  Object.assign(pieOption.baseOption.series[0].label, SERIES_LABEL);
  Object.assign(pieOption.baseOption.series[0].labelLine, SERIES_LABEL);
  Object.assign(pieOption.baseOption.color, color);
  // Object.assign(pieOption.baseOption.series[0].itemStyle, SERIES_ITEMSTYLE);
  let mediaOption = pieOption.media.find(item => {
    return !item.query;
  });
  Object.assign(mediaOption.option.legend, legend);
  Object.assign(mediaOption.option.series[0].label, SERIES_LABEL);
  Object.assign(mediaOption.option.series[0].labelLine, SERIES_LABEL);
  return pieOption;
}

/** 导出图表配置option */
export const pieOption = {
  baseOption: { // 这里是基本的『原子option』。
    title: [{
      text: '',
      textStyle: {
        color: 'grey',
        fontSize: 18
      }
    }],
    tooltip: {
      ...tooltip,
      trigger: 'item',
      formatter: (x, c, v, b) => {
        var res = '';
        let pres = x.data.pres;
        let value = x.data.value;
        if (pres) {
          if (pres.type === 'dec') {
            value = addingUnit(value, pres.state.unit);
            value = fmoney(value, pres.state.dec, pres.state.commas);
          } else {
            value = addingUnit(value, pres.state.unit);
            value = fmoney(value, pres.state.dec, pres.state.commas);
          }
        }
        res += `${x.name} : (${value + (pres ? pres.state.unit : '')})${x.percent}%<br/>`;
        return res;
      }
    },
    color: [],
    toolbox: toolbox,
    legend: legend,
    graphic: graphic,
    series: [
      {
        name: '',
        type: 'pie',
        radius: '75%', // 饼图半径，可调大小
        center: ['50%', '50%'],
        avoidLabelOverlap: false, // 启用防止标签重叠策略
        // stillShowZeroSum: false,
        data: [{value: 0, name: '当前无数据'}],
        /* 这么强大的api早就应该出了https://github.com/apache/incubator-echarts/pull/8997 */
        // labelDisplayThreshold: 1,
        label: {
          show: true,
          // color: '#939393',
          fontSize: 12,
          position: 'outside', // inner
          formatter: '{b}\n{c}\n{d}%'
          // verticalAlign: 'top',
          // align: 'left'
        },
        labelLine: {
          show: true,
          smooth: false,
          length: 0, // 第一条直线长度
          length2: 50 // 第二条直线长度
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  },
  media: [ // 这里定义了 media query 的逐条规则。
    {
      query: { // 规则。
        maxWidth: 500
      },
      option: { // 这里写此规则满足下的option。
        legend: {
          show: false
        },
        series: [
          {
            radius: '55%',
            label: {
              show: true
            },
            labelLine: {
              show: true,
              length2: 20 // 第二条直线长度
            }
          }
        ]
      }
    },
    {
      query: { // 规则。
        maxWidth: 300
      },
      option: { // 这里写此规则满足下的option。
        legend: {
          show: false
        },
        series: [
          {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          }
        ]
      }
    },
    {
      option: { // 这里写此规则满足下的option。
        legend: {
          show: true
        },
        series: [
          {
            radius: '75%',
            label: {
              show: true
            },
            labelLine: {
              length2: 50,
              show: true
            }
          }
        ]
      }
    }
  ]
};
