/**
 * title
 * @version  v1.0
 * @createTime: 2018/3/28 0028
 * @createAuthor LSZ
 * @updateHistory
 *                2018/3/28 0028  ashen   create
 */
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
