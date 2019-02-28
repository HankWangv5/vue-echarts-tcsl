export const Option = {
  title: [{
    text: '54%',
    subtext: '订单数',
    x: '34%',
    y: '44%',
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
  color: ['#FF7417', '#FFF65F', '#5B95FF', '#5A4EFF', '#B54CFF', '#F754D3', '#FF5539', '#55F696', '#B9FF21', '#FFC343'],
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
    left: 'right',
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
    hoverAnimation: false,
    labelLine: {show: false},
    radius: ['35%', '50%'],
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
        color: '#A47202'
      },
      emphasis: {
        color: '#A47202'
      }
    },
    hoverAnimation: false,
    radius: ['31%', '31.5%'],
    center: ['35%', '50%']
  }]
};
