export const Option = {
  legend: {
    show: false
  },
  xAxis: [{
    type: 'category',
    data: ['新虹桥', '中山公园', '虹桥', '镇宁路', '天山古北', '长亭外', '古道边', '碧连天'],
    axisLabel: {
      rotate: 45,
      color: 'rgba(255,255,255,0.6)'
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.4)'
      }
    },
    axisTick: {
      alignWithLabel: true
    }
  }],
  yAxis: [{
    type: 'value',
    name: '',
    axisLabel: {
      formatter: '{value}',
      color: 'rgba(255,255,255,0.6)'
    },
    axisLine: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(55,55,55,0.6)'
      }
    }
  }],
  series: [{
    name: '移动',
    type: 'line',
    showSymbol: false,
    lineStyle: {
      normal: {
        color: 'rgba(91, 149, 255, 1)',
        width: 3
      }
    },
    areaStyle: {
      normal: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(91, 149, 255, 0.8)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255, 173, 20, 0.1)' // 100% 处的颜色
          }]
        }
      }
    },
    data: [110, 122, 111, 118, 109, 105, 128, 125]
  }, {
    name: '电信',
    type: 'line',
    showSymbol: false,
    lineStyle: {
      normal: {
        color: 'rgba(255, 246, 95, 1)',
        width: 3
      }
    },
    areaStyle: {
      normal: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(255, 246, 95, 0.8)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255, 173, 20, 0.1)' // 100% 处的颜色
          }]
        }
      }
    },
    data: [100, 110, 105, 108, 103, 93, 118, 105]
  }, {
    name: '联通',
    type: 'line',
    showSymbol: false,
    lineStyle: {
      normal: {
        color: 'rgba(255, 116, 23, 1)',
        width: 3
      }
    },
    areaStyle: {
      normal: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(255, 116, 23, 0.8)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(255, 173, 20, 0.1)' // 100% 处的颜色
          }]
        }
      }
    },
    data: [88, 100, 96, 98, 90, 86, 88, 95]
  } ]
};
