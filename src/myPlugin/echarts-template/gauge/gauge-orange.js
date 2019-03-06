export const Option = {
  series: [{
    name: '完成度',
    type: 'liquidFill',
    radius: '60%',
    data: [{value: 0.6}],
    outline: {
      show: true, // 是否显示轮廓 布尔值
      borderDistance: 4, // 外部轮廓与图表的距离 数字
      itemStyle: {
        borderColor: 'rgba(255, 173, 31, 0.6)', // 边框的颜色
        borderWidth: 5 // 边框的宽度
        // shadowBlur: 5 , //外部轮廓的阴影范围 一旦设置了内外都有阴影
        // shadowColor: '#000' //外部轮廓的阴影颜色
      }
    },
    backgroundStyle: {
      color: 'rgba(10, 10, 12, 0)', // 图表的背景颜色
      // borderWidth: '10',//图表的边框宽度
      // borderColor: '#000',//图表的边框颜色
      itemStyle: {
        shadowBlur: 100, // 设置无用
        shadowColor: '#f60', // 设置无用
        opacity: 1 // 设置无用
      }
    },
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: 'rgba(255, 182, 23, 1)' // 0% 处的颜色
        }, {
          offset: 1,
          color: 'rgba(255, 97, 42, 1)' // 100% 处的颜色
        }]
      }
      // opacity: 0.5, // 波浪的透明度
      // shadowBlur: 10, // 波浪的阴影范围
      // shadowColor: '#f60'// 阴影颜色
    },
    emphasis: {
      itemStyle: {
        opacity: 1 // 鼠标经过波浪颜色的透明度
      }
    }
  }]
};
