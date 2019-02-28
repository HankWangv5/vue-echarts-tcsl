export const Option = {
  title: [{
    text: '75%',
    subtext: '完成率',
    x: 'center',
    y: 'center',
    textStyle: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'normal'
    },
    subtextStyle: {
      color: 'rgba(255,255,255,.45)',
      fontSize: 14,
      fontWeight: 'normal'
    }
  }],
  series: [{
    name: '',
    type: 'gauge',
    radius: '50%',
    startAngle: 0,
    endAngle: 359.9,
    splitNumber: 8,
    itemStyle: {
      color: '#111220'
    },
    axisTick: {
      show: false
    },
    splitLine: {
      length: '28%',
      lineStyle: {
        width: 8,
        color: '#20274E'
      }
    },
    axisLabel: {
      show: false
    },
    pointer: {
      show: false
    },
    axisLine: {
      lineStyle: {
        opacity: 0
      }
    },
    detail: {
      show: false
    },
    data: [{
      value: 0,
      name: ''
    }]
  },
  {
    name: '',
    type: 'pie',
    radius: ['37%', '50%'],
    silent: true,
    label: {
      show: false
    },
    labelLine: {
      show: false
    },
    z: 0,
    data: [{
      value: 75,
      name: '',
      label: {
        normal: {
          show: false
        }
      },
      itemStyle: {
        normal: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(101, 228, 255, 1)' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(63, 95, 252, 1)' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
          }
        }
      }
    },
    {
      value: 25,
      name: '',
      label: {
        normal: {
          show: false
        }
      },
      itemStyle: {
        normal: {
          color: '#111220'
        }
      }
    }
    ]
  }]
};
