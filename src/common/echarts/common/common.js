/**
 * title
 * @version  v1.0
 * @createTime: 2018/3/28 0028
 * @createAuthor LSZ
 * @updateHistory
 *                2018/3/28 0028  ashen   create
 */
import white from './theme.json';
import black from './black.json';
import * as echarts from 'echarts/src/echarts';
import {LEGEND_DISPLAY, DATAZOOM_AXIS} from '@/common/chartConfigType';
// import 'zrender/src/svg/svg';
export function fmoney (s, n = 2, f) {
  s = parseFloat((s + '').replace(/[^\d\\.-]/g, '')).toFixed(n) + '';
  if (!f) return s;
  var source = s.split('.');// 按小数点分成2部分
  source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), '$1,');// 只将整数部分进行都好分割
  return source.join('.');// 再将小数部分合并进来
}
export function addingUnit (val, unit) {
  let nVal = val;
  if (unit === '万') {
    nVal = val / 10000;
  } else if (unit === '亿') {
    nVal = val / 100000000;
  } else if (unit === 'K') {
    nVal = val / 1000;
  } else if (unit === 'M') {
    nVal = val / 1000000;
  } else if (unit === '%') {
    nVal = val * 100;
  }
  // return scientificToNumber(new Number(nVal));//eslint-disable-line
  return new Number(nVal).toFixed(6);//eslint-disable-line
};

export function initChart (id, option,theme) {
  const map = new Map([
    ['purple', white],
    ['purpleNight', black]
  ]);
  const dcChart = echarts.init(document.getElementById(id), map.get(theme), {renderer: 'svg'});
  let ts = option.baseOption.textStyle;
  if (ts) {
    ts.fontFamily = 'Roboto';
  } else {
    ts = {
      fontFamily: 'Roboto'
    };
  }
  dcChart.setOption(option);
  return dcChart;
};

export function sliceArray (array, groupNum) { // 数组分组
  return Array.apply(null, {
    length: Math.ceil(array.length / groupNum)
  }).map((x, i) => {
    return array.slice(i * groupNum, (i + 1) * groupNum);
  });
};

export function dealYaxisValue (value) { // 处理Y轴数值单位显示
  if (Math.abs(value) / 1000000 >= 1) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (Math.abs(value) / 10000 >= 1) {
    return (value / 10000).toFixed(1) + 'W';
  } else if (Math.abs(value) / 1000 >= 1) {
    return (value / 1000).toFixed(1) + 'K';
  } else {
    return value.toFixed(1);
  }
};

export function dealXaxisValue (val) { // 处理X轴数值单位显示
  var re = '';
  var bytes = 0;
  if (val) {
    for (var i = 0; i < val.length; i++) {
      var code = val.charCodeAt(i);
      bytes += code < 256 ? 1 : 2;
      if (bytes > 20) {
        re += '...';
        break;
      } else {
        re += val[i];
      }
    }
  }
  return re;
};

export function getLayout (legend, grid, DATA_ZOOM, settings) { // merge zoom && legend
  const lValue = settings.find((setting) => {
    return setting.type === LEGEND_DISPLAY;
  });
  const dValue = settings.find((setting) => {
    return setting.type === DATAZOOM_AXIS;
  });
  const getLegendGrid = (value) => {
    const GRID_PADDING_TOP = 25; // grid距离顶部边缘间隔
    const GRID_PADDING_BOTTOM = 18; // grid距离底部边缘间隔
    const GRID_PADDING_RIGHT = 25; // grid距离右侧边缘间隔
    const DATAZOOM_PADDING_BOTTOM = (!dValue || !dValue.value) ? 0 : 25;
    const LEGEND_PADDING_TOP = value === 2 ? 25 : 0;
    const LEGEND_PADDING_BOTTOM = value === 1 ? 10 : 0;
    const LEGEND_PADDING_RIGHT = value === 3 ? 120 : 0;
    const GAP = 15; // 任何两元素之间间隔
    const DATA_ZOOM = (!dValue || !dValue.value) ? {show: false} : {show: true, bottom: DATAZOOM_PADDING_BOTTOM};
    const grid = {
      top: GRID_PADDING_TOP + (LEGEND_PADDING_TOP ? (LEGEND_PADDING_TOP + GAP) : LEGEND_PADDING_TOP),
      bottom: GRID_PADDING_BOTTOM + (LEGEND_PADDING_BOTTOM ? (LEGEND_PADDING_BOTTOM + GAP) : LEGEND_PADDING_BOTTOM) + (DATAZOOM_PADDING_BOTTOM ? (DATAZOOM_PADDING_BOTTOM + GAP) : DATAZOOM_PADDING_BOTTOM),
      left: GRID_PADDING_RIGHT,
      right: GRID_PADDING_RIGHT + LEGEND_PADDING_RIGHT + GAP
    };
    const legend = {
      show: value !== 4, // 等于4不显示
      orient: value === 3 ? 'vertical' : 'horizontal',
      top: value === 2 ? LEGEND_PADDING_TOP : (value === 3 ? GAP : undefined),
      bottom: value === 1 ? LEGEND_PADDING_BOTTOM + (DATAZOOM_PADDING_BOTTOM ? (DATAZOOM_PADDING_BOTTOM + GAP) : DATAZOOM_PADDING_BOTTOM) : undefined,
      left: value === 3 ? 'right' : 'center'
    };
    return {legend, grid, DATA_ZOOM};
  };
  if (lValue) return getLegendGrid(lValue.value);
  return {legend, grid, DATA_ZOOM};
}

export function getAiLabel (data, id, Num = data.length) {
  const width = document.getElementById(id).offsetWidth;
  let xiShu = Num / (width / 100);
  xiShu = parseInt(xiShu);
  // console.log(xiShu);
  if (xiShu && xiShu !== 1) { // 等于1则不设置，即都显示
    data.forEach((da, $index) => { // label原始规则，每4个中取最大值和最小值显示
      da.label = {show: false};
      if ($index % xiShu === 0 && $index !== 0) {
        const testArray = [];
        for (let i = (xiShu - 1); i >= 0; i--) {
          testArray.push(data[$index - i].value);
        }
        const maxN = Math.max.apply(null, testArray);
        // const minN = Math.min.apply(null, testArray);
        const maxIndex = testArray.findIndex((aa) => {
          return parseFloat(aa) === maxN;
        });
        // const minIndex = testArray.findIndex((aa) => { return parseFloat(aa) === minN; });
        if (data[$index - (xiShu - maxIndex)] && data[$index - (xiShu - maxIndex)].label && !data[$index - (xiShu - maxIndex)].label.show) { // 相邻相等的数值只显示一个label
          // data[$index - (xiShu - 1 - maxIndex)].label.show = true;
          delete data[$index - (xiShu - 1 - maxIndex)].label;
          // data[$index - (xiShu - 1 - minIndex)].label.show = true;
        }
      }
    });
  } else {
    data = data.map((da) => {
      delete da.label;
      return da;
    });
  }
  return data;
}

export function dealMarklines (setting, chartData) {
  // console.log('setting ---->', setting);
  // console.log('chartData ---->', chartData);
  let linesData = [];
  // let compareSplitSetter = setting.find(item => item.type === 'compareSplit');
  let markLineSetter = setting.find(item => item.type === 'markLine');
  // 如果'辅助线'配置中的 value.length > 0
  if (markLineSetter && markLineSetter.value.length > 0) {
    // 如果‘对比拆分’配置中的 isCompareSplit 为 false
    // if (compareSplitSetter && !compareSplitSetter.value.isCompareSplit) { // 对辅助线数据进行特殊处理
    //   linesData = specialDealMarklinesData(markLineSetter, chartData, false);
    // } else { // 正常处理辅助线数据
    //   // linesData = generalDealMarklinesData(markLineSetter);
    //   linesData = specialDealMarklinesData(markLineSetter, chartData, true);
    // }
    linesData = specialDealMarklinesData(markLineSetter, chartData, true, 0);
  }
  let markLineSetterDouble = setting.find(item => item.type === 'markLine2');
  if (markLineSetterDouble && markLineSetterDouble.value.length > 0) {
    linesData = linesData.concat(specialDealMarklinesDataDouble(markLineSetterDouble, chartData, true, 1));
  }
  return linesData;
}

function specialDealMarklinesData (markLineSetter, chartData, isTrueZero, yAxisIndex) { // 特殊处理辅助线数据
  // 生成辅助线配置List
  let linesData = [];
  if (markLineSetter) {
    for (let item of markLineSetter.value) {
      if (item.markLineType === 1) { // 固定值
        let obj = {
          name: item.name + ' : ' + item.content,
          yAxis: item.fixedValue,
          yAxisIndex: yAxisIndex
        };
        linesData.push(obj);
      } else if (item.markLineType === 2) { // 计算值
        // console.log('markLineSetter.value ---->', markLineSetter.value);
        let resultArr = [];
        for (let data of chartData.yaxis) {
          // console.log('~~~~>', data, data.name.split('(')[0], item.fieldName);
          // if (data.name.indexOf(item.fieldName) > -1) {
          // if (data.name === item.fieldName) {
          if (data.uniqueId === item.uniqId) {
            // console.log('data ---->', data.data);
            let arr = [];
            if (isTrueZero) { // 是否区分 -0 / 0
              for (let i of data.data) {
                if (i !== '-0') {
                  arr.push(i);
                }
              }
            } else {
              arr = data.data;
            }
            // resultArr.push(...data.data); // 数组拼接,ES6写法,不会占用新的内存 perfect
            resultArr.push(...arr); // 数组拼接,ES6写法,不会占用新的内存 perfect
            // debugger;
          }
        }
        resultArr = resultArr.map(item => Number(item));
        // console.log('resultArr ---->', resultArr);
        // debugger;
        let resVal = 0;
        if (item.calculatedValue === 1) {
          resVal = resultArr.reduce((acc, val) => acc + val, 0) / resultArr.length; // 求平均值
          // console.log('====> avg', resVal);
        } else if (item.calculatedValue === 2) {
          resVal = Math.max.apply(null, resultArr); // 求最大值
        } else if (item.calculatedValue === 3) {
          resVal = Math.min.apply(null, resultArr); // 求最小值
        }
        let obj = {
          name: item.name + ' : ' + item.content,
          yAxis: resVal.toFixed(2),
          yAxisIndex: yAxisIndex
        };
        // console.log('obj ---->', obj);
        linesData.push(obj);
      }
    }
  }
  // console.log('special-deal-marklines-data ---->', linesData);
  return linesData;
}

function specialDealMarklinesDataDouble (markLineSetter, chartData, isTrueZero, yAxisIndex) { // 特殊处理次轴辅助线数据
  // 生成辅助线配置List
  let linesData = [];
  if (markLineSetter) {
    for (let item of markLineSetter.value) {
      if (item.markLineType === 1) { // 固定值
        let obj = {
          name: item.name + ' : ' + item.content,
          yAxis: item.fixedValue,
          yAxisIndex: yAxisIndex
        };
        linesData.push(obj);
      } else if (item.markLineType === 2) { // 计算值
        // console.log('markLineSetter.value ---->', markLineSetter.value);
        let resultArr = [];
        for (let data of chartData.yaxisDouble) {
          if (data.name.indexOf(item.fieldName) > -1) {
            // console.log('data ---->', data.data);
            let arr = [];
            if (isTrueZero) { // 是否区分 -0 / 0
              for (let i of data.data) {
                if (i !== '-0') {
                  arr.push(i);
                }
              }
            } else {
              arr = data.data;
            }
            // resultArr.push(...data.data); // 数组拼接,ES6写法,不会占用新的内存 perfect
            resultArr.push(...arr); // 数组拼接,ES6写法,不会占用新的内存 perfect
            // debugger;
          }
        }
        resultArr = resultArr.map(item => Number(item));
        // console.log('resultArr ---->', resultArr);
        // debugger;
        let resVal = 0;
        if (item.calculatedValue === 1) {
          resVal = resultArr.reduce((acc, val) => acc + val, 0) / resultArr.length; // 求平均值
        } else if (item.calculatedValue === 2) {
          resVal = Math.max.apply(null, resultArr); // 求最大值
        } else if (item.calculatedValue === 3) {
          resVal = Math.min.apply(null, resultArr); // 求最小值
        }
        let obj = {
          name: item.name + ' : ' + item.content,
          yAxis: resVal.toFixed(2),
          yAxisIndex: yAxisIndex
        };
        // console.log('obj ---->', obj);
        linesData.push(obj);
      }
    }
  }
  // console.log('special-deal-marklines-data ---->', linesData);
  return linesData;
}

export function dealLegendText (chartInfo, y) { //  处理legend坐标轴系列对比和无对比各种情况的显示
  // TODo  target="https://shimo.im/sheet/pEDJE5vMuEQ5hqVi/?tdsourcetag=s_pcqq_aiomsg"
  if (chartInfo.reportParam.compareCondition.length >= 1) {
    if (chartInfo.reportParam.indexCondition.length > 1 || chartInfo.reportParam.indexDoubleCondition.length > 1 ||
    chartInfo.reportParam.indexCondition.length + chartInfo.reportParam.indexDoubleCondition.length > 1) {
      return y.name.replace(/:%/g, '/');
    } else {
      let name = y.name.split(':%');
      name.shift();
      return name.join('/'); // /g全文匹配标识
    }
  } else {
    return y.name;
  }
};

/* export function dealLegendTextDouble (chartInfo, y) { //  处理legend坐标轴系列对比和无对比各种情况的显示
  // TODo  target="https://shimo.im/sheet/pEDJE5vMuEQ5hqVi/?tdsourcetag=s_pcqq_aiomsg"
  if (chartInfo.reportParam.compareCondition.length >= 1) {
    if (chartInfo.reportParam.indexDoubleCondition.length > 1) {
      return y.name.replace(/:%/g, '/');
    } else {
      let name = y.name.split(':%');
      name.shift();
      return name.join('/'); // /g全文匹配标识
    }
  } else {
    return y.name;
  }
}; */
