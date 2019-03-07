let seried = () => { // 小方格背景
  let arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push({ // 背景
      name: '物业费',
      type: 'bar',
      data: [10, 10, 10],
      barWidth: 16,
      stack: 'st',
      z: 3,
      itemStyle: {
        color: 'transparent',
        borderWidth: 4,
        barBorderRadius: [1, 1, 1, 1],
        borderColor: '#191F3A'
      }
    });
  }
  return arr;
};
export const Option = {
  legend: {
    show: false
  },
  grid: {
    right: '20%'
  },
  color: ['#864BFF', '#F22569', '#65E3FF', '#2D37FF', '#89DC2F', '#FFD53E', '#FF5539', '#55F696', '#F754D3', '#368BFF'],
  xAxis: [{
    show: false
  },
  {
    show: false
  }
  ],
  yAxis: {
    type: 'category',
    inverse: true,
    show: false
  },
  series: [
    {
      name: '物业费',
      type: 'bar',
      data: [70, 92, 41],
      barWidth: 16,
      z: 2,
      barGap: '-100%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [{
            offset: 0,
            color: 'rgba(63, 95, 252, 1)' // 0% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(101, 228, 255, 1)' // 100% 处的颜色
          }]
        }
      }
    }, {
      name: '物', // 列表名称 如： 1 X店
      type: 'bar',
      xAxisIndex: 1,
      data: [{value: 50, name: '北京店'},
        {value: 50, name: '天津店'},
        {value: 50, name: '河北店'} ],
      barGap: '-100%',
      barWidth: 14,
      z: 3,
      label: {
        show: true,
        position: [0, '-160%'],
        color: '#fff',
        formatter: function (data) {
          // 富文本固定格式{colorName|这里填你想要写的内容}
          return '{a|' + (data.dataIndex + 1) + '}  ' + data.name;
        },
        rich: {
          a: {
            width: 16,
            height: 16,
            align: 'center',
            color: '#fff',
            backgroundColor: '#31489F'
          }
        }
      },
      itemStyle: {
        color: 'transparent',
        barBorderRadius: [8, 8, 8, 8]
      }
    }, ...seried(), { // 右侧百分比
      name: '物业费',
      type: 'bar',
      data: [100, 100, 100],
      barWidth: 16,
      z: 1,
      barGap: '-100%',
      label: {
        normal: {
          show: true,
          textStyle: {
            color: 'rgba(101, 227, 255, 1)', // 百分比颜色
            fontSize: 12
          },
          formatter: (data) => {
            // todo 接入接口后根据返回格式调整
            return ' ' + Option.series[0].data[data.dataIndex] + '%';
          },
          position: 'right'
        }
      },
      itemStyle: {
        color: '#000'
      }
    }, { // 最外边框
      name: '物业费',
      type: 'bar',
      data: [100, 100, 100],
      barWidth: 16,
      z: 0,
      barGap: '-100%',
      itemStyle: {
        color: '#000',
        borderWidth: 6,
        barBorderRadius: [1, 1, 1, 1],
        borderColor: '#999'
      }
    }]
};
