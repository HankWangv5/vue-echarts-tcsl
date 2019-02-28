import {initChart, addingUnit, fmoney} from './common/common';
import {toolbox, tooltip} from './common/constant';
import 'echarts/src/chart/gauge';
import 'echarts/src/chart/pie';
import 'echarts/src/component/tooltip';
import 'echarts/src/component/title';
import 'echarts/src/component/legend';
// import 'echarts/src/component/graphic';
import 'echarts/src/component/markPoint';
import {GAUGE_COND_SET, TARGET_VALUE} from '@/common/chartConfigType.js';
/**
 * @module common/echarts/gauge
 * @author ashen
 * @description  仪表图，调用initGauge方法初始化chart
 * @requires module:common/echarts/theme
 */

/**
 * @param  {Integer} id - 页面id或者class
 * @returns {Object} 图表实例dcChart
 */
export function initGauge (id, optionParam = gaugeOption) {
  return initChart(id, optionParam);
}
export const utils = {
  addingUnit,
  fmoney
};
const unfinishColor = [1, 'rgba(153, 153, 153, 0.2)'];

const setColor = (rule, percent) => {
  const max = parseFloat(rule.max);
  const min = parseFloat(rule.min);
  const num = percent * 100;
  let color = false;
  switch (rule.compare) {
    case 0:// 区间
      if (num <= max && num >= min) color = true;
      break;
    case 1:// 等于
      if (num === min) color = true;
      break;
    case 2:// 不等于
      if (num !== min) color = true;
      break;
    case 3:// 大于
      if (num > min) color = true;
      break;
    case 4:// 大于等于
      if (num >= min) color = true;
      break;
    case 5:// 小于
      if (num < min) color = true;
      break;
    case 6:// 小于等于
      if (num <= min) color = true;
      break;
  }
  if (color) {
    return [[percent, rule.color], unfinishColor];
  }
};

export function initGaugeOption (setting, settings, chartData) {
  let percent = parseFloat(gaugeOption.baseOption.series[0].detail.formatter) / 100;
  let SERIES_AXISLINE_LINESTYLE_COLOR = [[percent, '#6966cd'], unfinishColor];
  switch (setting.type) {
    case GAUGE_COND_SET:
      setting.value.forEach((rule) => {
        let color = setColor(rule, percent);
        if (color) {
          SERIES_AXISLINE_LINESTYLE_COLOR = color;
        }
      });
      gaugeOption.baseOption.series[0].axisLine.lineStyle.color = SERIES_AXISLINE_LINESTYLE_COLOR;
      break;
    case TARGET_VALUE:
      if (chartData) {
        percent = (chartData.yaxis[0].data[0] / setting.value * 100).toFixed(2) / 100;
        const lValue = settings.find((setting) => {
          return setting.type === GAUGE_COND_SET;
        });
        lValue.value.forEach((rule) => {
          let color = setColor(rule, percent);
          if (color) {
            SERIES_AXISLINE_LINESTYLE_COLOR = color;
          }
        });
        gaugeOption.baseOption.series[0].axisLine.lineStyle.color = SERIES_AXISLINE_LINESTYLE_COLOR;
      }
      break;
  }
  return gaugeOption;
}

/** 导出图表配置option */
export const gaugeOption = {
  baseOption: {
    title: [{
      show: true,
      text: 'name',
      top: '0',
      left: '18%',
      textStyle: {
        fontSize: 14
        // color: '#6b6868'
      }
    },
    {
      show: true,
      text: 'name',
      top: '6%',
      left: '18%',
      textStyle: {
        fontSize: 16
        // color: '#6b6868'
      }
    }, {
      show: true,
      text: '12345',
      top: '12%',
      left: '18%',
      textStyle: {
        fontSize: 18
        // color: '#6b6868'
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
        res += `${x.seriesName} : ${value + (pres ? pres.state.unit : '')}<br/>`;
        return res;
      }
    },
    toolbox: toolbox,
    series: [
      {
        name: '',
        type: 'gauge',
        radius: '55%',
        center: ['50%', '50%'],
        splitNumber: 1,
        axisLine: { // 仪表盘颜色
          lineStyle: {
            width: 18,
            color: [[0.4, '#6966cd'], unfinishColor]
          }
        },
        axisLabel: {
          distance: -60,
          color: '#AFB0B3'
        },
        itemStyle: {
          color: '#DBDDE6'
        },
        pointer: {
          width: 3,
          length: '60%'
        },
        splitLine: {
          show: false
        },
        axisTick: { // 刻度样式
          show: false
        },
        max: 100,
        min: 0,
        markPoint: {
          symbol: 'circle',
          symbolSize: 28,
          silent: true,
          itemStyle: {
            // color: '#fff',
            borderColor: '#DBDDE6',
            borderWidth: 10
          },
          data: [
            {
              name: '',
              x: '50%',
              y: '50%'
            }
          ]
        },
        detail: {
          formatter: '',
          fontSize: 16,
          // color: '#666',
          fontWeight: 'bolder',
          offsetCenter: [0, '50%']
        },
        data: [{value: 100, name: ''}],
        markLine: {
          silent: false,
          symbol: 'none',
          precision: 2,
          label: {
            show: true,
            position: 'end',
            formatter: '{b}' // '{b}:\n{c}'
          },
          lineStyle: {
            color: '#9391FF',
            width: 2,
            type: 'dashed'
          },
          data: []
        }
      }]
  },
  media: [ // 这里定义了 media query 的逐条规则。
    {
      query: { // 规则。
        maxHeight: 400
      },
      option: { // 这里写此规则满足下的option。
        legend: {
          show: false
        },
        title: [
          {
            show: true,
            textStyle: {
              fontSize: 12
            }
          },
          {
            show: true,
            textStyle: {
              fontSize: 13
            }
          }, {
            show: true,
            textStyle: {
              fontSize: 15
            }
          }
        ],
        series: [
          {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            axisLine: { // 仪表盘颜色
              lineStyle: {
                width: 15
              }
            },
            markPoint: {
              symbolSize: 22,
              itemStyle: {
                borderWidth: 6
              }
            },
            pointer: {
              width: 6,
              length: '45%'
            },
            detail: {
              fontSize: 14
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
        title: [
          {
            show: true,
            textStyle: {
              fontSize: 10
            }
          },
          {
            show: true,
            textStyle: {
              fontSize: 11
            }
          }, {
            show: true,
            textStyle: {
              fontSize: 12
            }
          }
        ],
        series: [
          {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            axisLine: { // 仪表盘颜色
              lineStyle: {
                width: 13
              }
            },
            markPoint: {
              symbolSize: 15,
              itemStyle: {
                borderWidth: 5
              }
            },
            pointer: {
              width: 5,
              length: '46%'
            },
            detail: {
              fontSize: 12
            }
          }
        ]
      }
    },
    {
      query: { // 规则。
        maxWidth: 160
      },
      option: { // 这里写此规则满足下的option。
        legend: {
          show: false
        },
        title: [
          {
            show: true,
            textStyle: {
              fontSize: 10
            }
          },
          {
            show: true,
            textStyle: {
              fontSize: 11
            }
          }, {
            show: true,
            textStyle: {
              fontSize: 12
            }
          }
        ],
        series: [
          {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            axisLine: { // 仪表盘颜色
              lineStyle: {
                width: 13
              }
            },
            markPoint: {
              symbolSize: 14,
              itemStyle: {
                borderWidth: 5
              }
            },
            pointer: {
              width: 6,
              length: '40%'
            },
            detail: {
              fontSize: 11
            }
          }
        ]
      }
    },
    {
      query: { // 规则。
        maxHeight: 150
      },
      option: { // 这里写此规则满足下的option。
        legend: {
          show: false
        },
        title: [
          {
            show: false,
            textStyle: {
              fontSize: 6
            }
          },
          {
            show: false,
            textStyle: {
              fontSize: 7
            }
          }, {
            show: false,
            textStyle: {
              fontSize: 8
            }
          }
        ],
        series: [
          {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            axisLine: { // 仪表盘颜色
              lineStyle: {
                width: 7
              }
            },
            markPoint: {
              symbolSize: 10
            },
            pointer: {
              width: 6,
              length: '40%'
            },
            detail: {
              fontSize: 10
            }
          }
        ]
      }
    },
    {
      option: { // 这里写此规则满足下的option。
        legend: {
          show: false
        },
        title: [
          {
            show: true,
            textStyle: {
              fontSize: 14
            }
          },
          {
            show: true,
            textStyle: {
              fontSize: 16
            }
          }, {
            show: true,
            textStyle: {
              fontSize: 19
            }
          }
        ],
        series: [
          {
            label: {
              show: true
            },
            labelLine: {
              show: true
            },
            axisLine: { // 仪表盘颜色
              lineStyle: {
                width: 30
              }
            },
            markPoint: {
              symbolSize: 28,
              itemStyle: {
                borderWidth: 10
              }
            },
            pointer: {
              width: 9,
              length: '60%'
            },
            detail: {
              fontSize: 24
            }
          }
        ]
      }
    }
  ]
};
