export const Option = {
  title: [{ // 有坑: 字数变化不会居中对齐
    text: '54%',
    subtext: '订单数',
    x: '34%',
    y: '40%',
    textAlign: 'center',
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
  color: ['#3F5FFC', '#46A6FF', '#4DDDF7', '#43FFD1', '#22FF6B', '#FFFD56', '#FFBF37', '#FF782F', '#FF416E', '#B351FF'],
  legend: {
    textStyle: {
      color: '#efefef'
    },
    data: ['订单量', '取消量', '支付量', '投诉量', '被投诉'],
    orient: 'vertival',
    selectedMode: false,
    itemGap: 10,
    itemWidth: 14,
    itemHeight: 14,
    // left: 'right',
    right: '4%',
    top: 'center'
  },
  series: [{ // 数据部分
    data: [
      {value: 935, name: '订单量'},
      {value: 410, name: '取消量'},
      {value: 334, name: '支付量'},
      {value: 235, name: '投诉量'},
      {value: 110, name: '被投诉'}
    ],
    type: 'pie',
    label: {show: false},
    labelLine: {show: false},
    hoverAnimation: false,
    radius: ['35%', '50%'],
    center: ['35%', '50%']
  }, { // 外部圆圈
    data: [10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1, 10, 1],
    type: 'pie',
    itemStyle: {
      normal: {
        color: function (a) {
          if (a.data === 10) {
            return '#35387E';
          }
          if (a.data === 1) {
            return 'rgba(0,0,0, 0)';
          }
        }
      },
      emphasis: {
        color: function (a) {
          if (a.data === 10) {
            return '#35387E';
          }
          if (a.data === 1) {
            return 'rgba(0,0,0, 0)';
          }
        }
      }
    },
    hoverAnimation: false,
    labelLine: {show: false},
    radius: ['56%', '60%'],
    center: ['35%', '50%']
  }, { // 内部圆圈
    data: [
      {value: 100, name: ''}
    ],
    type: 'pie',
    label: {show: false},
    labelLine: {show: false},
    itemStyle: {
      normal: {
        color: '#323B81'
      },
      emphasis: {
        color: '#323B81'
      }
    },
    hoverAnimation: false,
    radius: ['30%', '31%'],
    center: ['35%', '50%']
  }]
};
