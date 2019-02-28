import {dealXaxisValue, getLayout, initChart, addingUnit, fmoney} from './common/common';
import {colorList, legend, media, toolbox, tooltip, datazoom, yaxis} from './common/constant';
import 'echarts/src/chart/line';
import 'echarts/src/component/tooltip';
import 'echarts/src/component/title';
import 'echarts/src/component/legend';
import 'echarts/src/component/legendScroll';
import 'echarts/src/component/dataZoom';
import 'echarts/src/component/markLine';
import {LEGEND_DISPLAY, DATAZOOM_AXIS, CHART_STYLE, CHART_COLOR, LINE_STYLE, MARK_LINE} from '@/common/chartConfigType.js';
/**
 * @module common/echarts/area
 * @author dym
 * @description  面积图，调用initArea方法初始化chart
 * @requires module:common/echarts/theme
 */

/**
 * @param  {Integer} id - 页面id或者class
 * @returns {Object} 图表实例dcChart
 */
export function initLine (id, optionParam = lineOption) {
  return initChart(id, optionParam);
}

export function initLineOption (setting, settings, linesData = []) {
  let legend = {};
  let color = [];
  let SERIES_LABEL = {};
  let DATA_ZOOM = {};
  let SERIES_SMOOTH = true;
  let grid = {};
  switch (setting.type) {
    case LEGEND_DISPLAY:
    case DATAZOOM_AXIS: {
      const layout = getLayout(legend, grid, DATA_ZOOM, settings);
      legend = layout.legend;
      DATA_ZOOM = layout.DATA_ZOOM;
      grid = layout.grid;
      break;
    }
    case CHART_STYLE: {
      const slect = setting.value;
      if (slect.num) {
        SERIES_LABEL = { // 显示数值
          show: true,
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
            res = `${value + (pres ? pres.state.unit : '')}`;
            return res;
          }
        };
      } else {
        SERIES_LABEL = { // 不显示数值
          show: false
        };
      }
      break;
    }
    case CHART_COLOR:
      color = colorList[setting.value - 1];
      break;
    case LINE_STYLE:
      SERIES_SMOOTH = {
        smooth: setting.value === 1
      };
      break;
  }
  Object.assign(lineOption.baseOption.legend, legend);
  Object.assign(lineOption.baseOption.grid, grid);
  Object.assign(lineOption.baseOption.color, color);
  Object.assign(lineOption.baseOption.dataZoom, DATA_ZOOM);
  let mediaOption = lineOption.media.find(item => {
    return !item.query;
  });
  Object.assign(mediaOption.option.legend, legend);
  Object.assign(mediaOption.option.dataZoom, DATA_ZOOM);
  Object.assign(mediaOption.option.grid, grid);
  Object.assign(mediaOption.option.series[0].label, SERIES_LABEL);
  // 以下内容为控制媒体查询的label方案
  lineOption.media.forEach((media) => {
    media.option.series = [mediaOption.option.series[0]];
  });

  let markLineSetter = settings.find((set) => {
    return set.type === MARK_LINE;
  });
  // 生成辅助线配置List
  // let linesData = [];
  // if (markLineSetter) {
  //   for (let item of markLineSetter.value) {
  //     if (item.markLineType === 1) { // 固定值
  //       let obj = {
  //         name: item.name + ' : ' + item.content,
  //         yAxis: item.fixedValue
  //       };
  //       linesData.push(obj);
  //     } else if (item.markLineType === 2) { // 计算值
  //       let type = '';
  //       if (item.calculatedValue === 1) {
  //         type = 'average';
  //       } else if (item.calculatedValue === 2) {
  //         type = 'max';
  //       } else if (item.calculatedValue === 3) {
  //         type = 'min';
  //       }
  //       let obj = {
  //         name: item.name + ' : ' + item.content,
  //         type: type
  //       };
  //       linesData.push(obj);
  //     }
  //   }
  //   // console.log('辅助线配置List: ', linesData);
  // }

  lineOption.baseOption.series.forEach((item, index) => {
    // 辅助线
    if (markLineSetter) { // 如果当前配置是辅助线的配置
      item.markLine = Object.assign({}, lineOption.baseOption.series[index].markLine);
      let arr = [];
      for (let line of linesData) {
        if (line.type) {
          if (line.name.indexOf(item.name.split('/')[0]) > -1) {
            arr.push(line);
          }
        } else {
          arr.push(line);
        }
      }
      item.markLine.data = arr;
    } else {
      item.markLine.data = [];
    }

    Object.assign(item, SERIES_SMOOTH);
    Object.assign(item.label, SERIES_LABEL);
    if (index !== 0) {
      item.label.show = false;
    }
  });
  return lineOption;
}

/** 导出图表配置option */
export const lineOption = {
  baseOption: { // 这里是基本的『原子option』。
    title: [{
      text: '',
      textStyle: {
        color: 'grey',
        fontSize: 18
      }
    }],
    dataZoom: datazoom,
    color: ['#7875e7', '#35c58d', '#7dd864', '#ceec58', '#ffd33b', '#fdb01c'],
    tooltip: tooltip,
    toolbox: toolbox,
    legend: legend,
    grid: {containLabel: true},
    xAxis: {
      data: [],
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        formatter: dealXaxisValue
      },
      splitLine: {
        show: false
      }
    },
    yAxis: yaxis,
    series: [{
      name: '',
      type: 'line',
      data: [],
      smooth: true,
      // symbol: 'none',
      label: {
        show: true,
        // color: '#939393',
        fontSize: 11,
        position: 'outside', // inner
        formatter: '{b}\n{c}\n{d}%',
        align: 'left'
      },
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      sampling: 'average', // 取过滤点的平均值
      markLine: {
        silent: false,
        symbol: 'none',
        precision: 2,
        label: {
          show: true,
          position: 'end',
          formatter: (params) => {
            return params.name.split(':')[0];
          }
        },
        lineStyle: {
          color: '#9391FF',
          width: 1,
          type: 'dashed'
        },
        data: []
      }
    }]
  },
  media: JSON.parse(JSON.stringify(media))
};
