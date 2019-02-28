export const Option = {
  visualMap: {
    min: 0,
    max: 100,
    left: 'left',
    bottom: '8%',
    text: ['40K', '0'],
    calculable: false,
    inRange: {
      color: ['#3B2C0B', '#F4A900']
    },
    itemWidth: 8,
    itemHeight: 60,
    orient: 'horizontal',
    align: 'right',
    textStyle: {
      color: '#fff'
    }
  },
  series: [
    {
      name: '中国',
      type: 'map',
      mapType: 'china',
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: false
        },
        itemStyle: {
          areaColor: ''
        }
      },
      data: [
        {name: '上海', value: 102.76},
        {name: '甘肃', value: 14.29},
        {name: '贵州', value: 6.12},
        {name: '海南', value: 3.4},
        {name: '安徽', value: 92.96},
        {name: '江苏', value: 239.27},
        {name: '浙江', value: 214.79},
        {name: '新疆', value: 37.38},
        {name: '青海', value: 2.31},
        {name: '西藏', value: 2.27},
        {name: '宁夏', value: 4.88},
        {name: '内蒙古', value: 37.38},
        {name: '广东', value: 77.64},
        {name: '福建', value: 62.54},
        {name: '广西', value: 3.36},
        {name: '河南', value: 202.06},
        {name: '湖北', value: 40.31},
        {name: '湖南', value: 11.19},
        {name: '江西', value: 37.55},
        {name: '北京', value: 57.34},
        {name: '吉林', value: 20.89},
        {name: '辽宁', value: 67.42},
        {name: '黑龙江', value: 21.21},
        {name: '天津', value: 48.61},
        {name: '山东', value: 326.43},
        {name: '山西', value: 47.75},
        {name: '河北', value: 114.15},
        {name: '陕西', value: 55.26},
        {name: '四川', value: 48.64},
        {name: '重庆', value: 16.1},
        {name: '云南', value: 21.64}
      ]
    }
  ]
};
