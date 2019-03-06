export const Option = {
  title: [{
    text: '75%',
    subtext: '完成率',
    x: 'center',
    y: '60%',
    textStyle: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'normal'
    },
    subtextStyle: {
      color: 'rgba(255,255,255,.6)',
      fontSize: 14,
      fontWeight: 'normal'
    }
  }],
  series: [{
    name: '',
    type: 'gauge',
    radius: '50%',
    center: ['50%', '50%'],
    splitNumber: 1,
    axisLine: { // 仪表盘颜色
      lineStyle: {
        width: 25,
        color: [[0.75, '#6727EA'], [1, '#0C0918']]
      }
    },
    axisLabel: {
      show: false
    },
    itemStyle: {
      color: '#A39FAE'
    },
    pointer: {
      width: 10,
      length: '50%'
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
        color: '#191F3A', // 中心圆圈颜色
        borderColor: '#A39FAE',
        borderWidth: 12
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
      show: false
    },
    data: [{value: 75, name: ''}]
  }, {
    name: '',
    type: 'gauge',
    radius: '56%',
    splitNumber: 5,
    axisLine: { // 仪表盘颜色
      lineStyle: {
        width: 2,
        color: [[1, '#A39FAE']]
      }
    },
    axisLabel: {
      distance: -56,
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
    detail: {
      show: false
    },
    data: []
  }]
};
