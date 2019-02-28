export const Option = {
  legend: {
    show: false
  },
  color: ['#FF7417', '#FFF65F', '#5B95FF', '#5A4EFF', '#B54CFF', '#F754D3', '#FF5539', '#55F696', '#B9FF21', '#FFC343'],
  xAxis: [{
    type: 'category',
    data: ['新虹桥', '中山公园', '虹桥', '镇宁路', '天山古北'],
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
    name: '物业费',
    type: 'bar',
    stack: 'st',
    data: [20, 12, 31, 34, 31],
    barWidth: 26
  }, {
    name: '物费',
    type: 'bar',
    stack: 'st',
    data: [24, 22, 25, 24, 21],
    barWidth: 26
  }, {
    name: '费',
    type: 'bar',
    stack: 'st',
    data: [14, 12, 15, 14, 11],
    barWidth: 26
  }]
};
