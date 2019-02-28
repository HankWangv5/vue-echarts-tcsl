import {dealXaxisValue, getLayout, initChart, addingUnit, fmoney} from './common/common';
import {colorList, legend, media, toolbox, tooltip, datazoom, yaxis} from './common/constant';
import 'echarts/src/chart/bar';
import 'echarts/src/chart/line';
import 'echarts/src/component/tooltip';
import 'echarts/src/component/title';
import 'echarts/src/component/legend';
import 'echarts/src/component/legendScroll';
import 'echarts/src/component/dataZoom';
import 'echarts/src/component/markLine';
import {LEGEND_DISPLAY, DATAZOOM_AXIS, CHART_STYLE, LINE_STYLE, CHART_COLOR, MARK_LINE, MARK_LINE_DOUBLE} from '@/common/chartConfigType.js';
import _ from 'lodash';
let _yaxis = _.cloneDeep(yaxis);
/**
 * @module common/echarts/column
 * @author ashen
 * @description  柱图，调用initColumn方法初始化chart
 * @requires module:common/echarts/theme
 */

/**
 * @param  {Integer} id - 页面id或者class
 * @returns {Object} 图表实例dcChart
 */
export function initColumn (id, optionParam = columnOption) {
  return initChart(id, optionParam);
}
let max = 1;

export function initColumnOption (setting, settings, linesData = [], isSymmetry) {
  let legend = {};
  let color = [];
  let DATA_ZOOM = {};
  let SERIES_LABEL = {};
  let SERIES_TYPE = {};
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
          position: 'inside',
          formatter: (x, c, v, b) => {
            let _s = Math.abs(x.data.value / max * 100) > 10;
            var res = '';
            let pres = x.data.pres;
            let value = parseFloat(x.data.tip || x.data.value);
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
            return _s ? res : '';
          }
        };
      } else {
        SERIES_LABEL = { // 不显示数值
          show: false
        };
      }
      break;
    }
    case LINE_STYLE:
      SERIES_SMOOTH = {
        smooth: setting.value === 1
      };
      break;
    case CHART_COLOR:
      color = colorList[setting.value - 1];
      break;
    case SERIES_TYPE:
      SERIES_TYPE = setting.value;
      break;
  }
  Object.assign(columnOption.baseOption.legend, legend);
  Object.assign(columnOption.baseOption.color, color);
  Object.assign(columnOption.baseOption.grid, grid);
  Object.assign(columnOption.baseOption.dataZoom, DATA_ZOOM);
  let mediaOption = columnOption.media.find(item => {
    return !item.query;
  });
  Object.assign(mediaOption.option.legend, legend);
  Object.assign(mediaOption.option.dataZoom, DATA_ZOOM);
  Object.assign(mediaOption.option.grid, grid);
  if (columnOption.baseOption.series[0] && columnOption.baseOption.series[0].yAxisIndex !== 0) {
    mediaOption.option.grid.left = '10%';
  }
  // 以下内容为控制媒体查询的label方案
  columnOption.media.forEach((media) => {
    media.option.series = [media.option.series[0]];
  });

  let markLineSetter = settings.find((set) => {
    return set.type === MARK_LINE;
  });
  let markLineDoubleSetter = settings.find((set) => {
    return set.type === MARK_LINE_DOUBLE;
  });
  columnOption.baseOption.series.forEach((item, index) => {
    // 辅助线
    if (markLineSetter && markLineSetter.value.length && item.yAxisIndex !== 1) { // 如果当前配置是辅助线的配置
      item.markLine = _.cloneDeep(columnOption.baseOption.series[index].markLine);
      item.markLine.label.position = 'end';
      let arr = [];
      for (let line of linesData) {
        if (line.yAxisIndex !== 1) {
          if (line.type) {
            if (line.name.indexOf(item.name.split('/')[0]) > -1) {
              arr.push(line);
            }
          } else {
            arr.push(line);
          }
        }
      }
      item.markLine.data = arr;
    } else if (markLineDoubleSetter && markLineDoubleSetter.value.length && item.yAxisIndex === 1) { // 如果当前配置是次轴辅助线的配置
      item.markLine = _.cloneDeep(columnOption.baseOption.series[index].markLine);
      item.markLine.label.position = 'start';
      let arr = [];
      for (let line of linesData) {
        if (line.yAxisIndex === 1) {
          if (line.type) {
            if (line.name.indexOf(item.name.split('/')[0]) > -1) {
              arr.push(line);
            }
          } else {
            arr.push(line);
          }
        }
      }
      item.markLine.data = arr;
    } else {
      item.markLine.data = [];
    }
    Object.assign(item, SERIES_SMOOTH);
    // todo 找对应name，符合的加标签
    Object.assign(item.label, SERIES_LABEL); // 先让所有的label控制生效
    Object.assign(item.type, SERIES_TYPE); // 控制图表类型
    if (index !== 0) { // 以下为对比情况
      let oo;
      if (item.label) {
        oo = Object.assign({label: {show: item.label.show}}, SERIES_LABEL); // 查询label继承自本身label规则
      } else {
        oo = Object.assign({label: {show: true}}, SERIES_LABEL); // 查询label强制显示label
      }
      mediaOption.option.series.push(oo);
      columnOption.media[0].option.series.push(columnOption.media[0].option.series[0]);
      columnOption.media[1].option.series.push(columnOption.media[1].option.series[0]);
    } else {
      Object.assign(mediaOption.option.series[0].label, SERIES_LABEL);
    }
  });
  _yaxis.max = setSymmetrys(true, isSymmetry);
  _yaxis.min = setSymmetrys(false, isSymmetry);
  return columnOption;
}

/** 导出图表配置option */
export const columnOption = {
  baseOption: { // 这里是基本的『原子option』。
    title: [{
      text: '',
      textStyle: {
        color: 'grey',
        fontSize: 18
      }
    }],
    color: [],
    dataZoom: datazoom,
    legend: legend,
    toolbox: toolbox,
    tooltip: {
      ...tooltip,
      formatter: (x, c, v, b) => {
        var dimension = x[0].name + '<br/>';
        let res = '';
        for (var i = 0, length = x.length; i < length; i++) {
          let pres = x[i].data.pres;
          let value = x[i].data.value;
          if (pres) {
            if (pres.type === 'dec') {
              value = addingUnit(value, pres.state.unit);
              value = fmoney(value, pres.state.dec, pres.state.commas);
            } else {
              value = addingUnit(value, pres.state.unit);
              value = fmoney(value, pres.state.dec, pres.state.commas);
            }
          }
          res += `${x[i].seriesName} : ${value + (pres ? pres.state.unit : '')}<br/>`;
        }
        return dimension + res;
      }
    },
    grid: {containLabel: true, left: '10%'},
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
        // rotate: 45,
        // interval: 0,
        formatter: dealXaxisValue
      },
      splitLine: {
        show: false
      }
    },
    yAxis: [_yaxis, _yaxis],
    series: [{
      name: '',
      type: 'bar',
      data: [],
      // barMinHeight: 30,
      label: {
        show: false,
        // color: '#939393',
        fontSize: 11,
        position: 'top' // inner
      },
      stack: '',
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
let setSymmetrys = (sign, isSymmetry) => {
  if (!isSymmetry) return (val) => sign ? Math.ceil(val.max) : 0;
  return (val) => {
    let scale = Math.ceil(Math.max(Math.abs(val.min), Math.abs(val.max)));
    max = scale || 1;
    return sign ? scale : -scale;
  };
};
