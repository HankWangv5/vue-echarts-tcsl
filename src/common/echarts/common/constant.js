import {addingUnit, dealXaxisValue, dealYaxisValue, fmoney} from './common';

/**
 * title
 * @version  v1.0
 * @createTime: 2018/4/02 0028
 * @createAuthor LSZ
 * @updateHistory
 *                2018/4/02 0028  ashen   create
 *                2018/12/26 1107  ashen   update
 */
export const colorList = [
  ['#7875e7', '#35c58d', '#7dd864', '#ceec58', '#ffd33b',
    '#fdb01c', '#ff8d40', '#eb712f', '#b24022', '#7f3280'], // 默认
  ['#5980e5', '#50b2f3', '#65d5d7', '#43bd8c', '#99c860',
    '#f7c844', '#f28e40', '#fd575b', '#5854ab', '#8354d4'], // bdp
  ['#ffca6f', '#ffb545', '#ffcda2', '#fead80', '#ff8e62',
    '#f56933', '#e54821', '#d02f13', '#b41c11', '#8f0c0c'], // 暖色
  ['#6ccb82', '#53b781', '#31ac79', '#30b2af', '#5ab6e6',
    '#3fa1d5', '#3f90d5', '#2b74c6', '#1f56b2', '#193ca1'], // 冷色
  ['#f6ce89', '#dfb979', '#d3a950', '#c79848', '#5a9c7f',
    '#55b3b4', '#5597b4', '#5575b4', '#3b5b99', '#2d497f'], // 质朴
  ['#ff7c36', '#ffa521', '#ffbf4d', '#8ed387', '#46b594',
    '#399ea3', '#3d7ea6', '#2066a3', '#0a4f93', '#123a71'], // 对比
  ['#ff6f85', '#ffe3b2', '#7cabeb', '#afe39a', '#fcd36a',
    '#46bfaa', '#64ccdc', '#8be1bd', '#5575b4', '#866a57'] // 其它
];

export let media = [ // 这里定义了 media query 的逐条规则。
  {
    query: { // 规则。
      maxHeight: 240
    },
    option: { // 这里写此规则满足下的option。
      legend: {
        show: false
      },
      dataZoom: {
        show: false
      },
      grid: {
        top: '10%',
        bottom: '6%',
        left: '10%',
        right: '10%',
        containLabel: true
      },
      series: [
        {
          label: {
            show: false
          }
        }
      ],
      xAxis: {
        axisLabel: {
          show: false
        }
      },
      yAxis: {
        axisLabel: {
          show: false
        }
      }
    }
  },
  {
    query: { // 规则。
      maxAspectRatio: 1
    },
    option: { // 这里写此规则满足下的option。
      legend: {
        show: false
      },
      dataZoom: {
        show: false
      },
      grid: {
        top: '10%',
        bottom: '6%',
        left: '10%',
        right: '10%',
        containLabel: true
      },
      series: [
        {
          label: {
            show: false
          }
        }
      ],
      xAxis: {
        axisLabel: {
          show: false
        }
      },
      yAxis: {
        axisLabel: {
          show: false
        }
      }
    }
  },
  {
    option: { // 这里写此规则满足下的option。
      legend: {
        show: true
      },
      dataZoom: {
        show: true
      },
      grid: {},
      series: [
        {
          label: {
            show: true
          }
        }
      ],
      xAxis: {
        axisLabel: {
          show: true
        }
      },
      yAxis: {
        axisLabel: {
          show: true
        }
      }
    }
  }
];

export const graphic = [
  {
    type: 'image',
    id: 'logo',
    bottom: 20,
    right: 10,
    z: -10,
    rotation: Math.PI / 4,
    bounding: 'raw',
    style: {
      image: 'https://tcsl-lb.oss-cn-beijing.aliyuncs.com/prod-apk/icon.png',
      width: 110,
      height: 48,
      opacity: 0.5
    }
  }
];

export let datazoom = {
  show: false,
  xAxisIndex: [0],
  height: '18',
  handleSize: '20',
  bottom: '2%',
  backgroundColor: 'rgba(000, 000, 000, 0)',
  fillerColor: 'rgba(105, 102, 205, 0.5)'
};

export let legend = {
  type: 'scroll', // 超多时显示分页
  // padding: [0, 20, 0, 10],
  itemGap: 10,
  itemWidth: 5,
  itemHeight: 5,
  borderRadius: 5,
  align: 'auto',
  tooltip: {
    show: true
  },
  textStyle: {
    color: '#909090',
    rich: {
      grey: {
        color: '#7d7d83',
        align: 'center'
      }
    }
  },
  pageIconSize: 10,
  // formatter: dealXaxisValue
  formatter: function (name) {
    let array = name.split('/');
    if (array.length > 1) {
      let arr = [`{grey| ${dealXaxisValue(array.shift())} }`];
      const shuzhi = array.join('/');
      arr.push(`{grey| ${dealXaxisValue(shuzhi)} }`);
      return arr.join('\n');
    } else {
      return dealXaxisValue(name);
    }
  }
};

export let yaxis = {

  axisLine: {
    show: false,
    lineStyle: {
      color: '#999'
    }
  },
  axisLabel: {
    show: true,
    formatter: dealYaxisValue
  },
  splitLine: {
    show: true
  },
  axisTick: {
    show: false
  }
};

export const tooltip = {
  confine: true,
  trigger: 'axis',
  axisPointer: { // 坐标轴指示器，坐标轴触发有效
    type: 'cross' // 默认为直线，可选为：'line' | 'shadow'
  },
  enterable: false,
  extraCssText: 'max-height:180px;z-index: 999;overflow-y:auto;border-color: #6966cdbd;background-color: #6966cdbd;border-width: 1px;', // height:140px;overflow-y:scroll
  transitionDuration: 0,
  formatter: (x, c, v, b) => {
    var res = x[0].name + '<br/>';
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
    return res;
  }
};

export const toolbox = {
  show: false,
  orient: 'horizontal',
  right: '10',
  top: 'top',
  feature: {}
};
