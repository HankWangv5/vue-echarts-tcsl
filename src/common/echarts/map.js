import _ from 'lodash';

import mapIconLoc from '@/assets/static/map/ic_map_loc.svg.txt';
import mapIconTriangle from '@/assets/static/map/ic_map_triangle.svg.txt';

let inMap = null;
// 地图假数据
const mapDataPoint = [];

let alpahImg = new Image();
alpahImg.src = require('@/assets/static/map/1x1.png');
// 需要将inmap对象传入此JS中才可以使用
export function init (inmap) {
  inMap = inmap;
}

// 根据图层类型得到图层实例
export function getOverlayInstanceByType ({type, data = mapDataPoint, config}) {
  switch (type) {
    case 'img':
      return getImgOverlayInstance(data, config);
    case 'pointAnimation':
      return getPointAnimationOverlayInstance(data, config);
    case 'heat':
      return getHeatOverlayInstance(data, config);
    case 'point':
    default:
      return getPointOverlayInstance(data, config);
  }
}

// 根据svg和颜色生成图片
export function getImageByColor (svg, color = '#d6d6d6') {
  let imgStr = svg;
  let svgDom = document.createElement('div');
  svgDom.innerHTML = imgStr;

  if (color) {
    let pathEles = svgDom.querySelectorAll('path, polygon, circle');
    for (let i = 0; i < pathEles.length; i++) {
      pathEles[i].style = `fill:${color}`;
    }
  }

  return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgDom.innerHTML)))}`;
}

// 得到矢量图实例
export function getImgOverlayInstance (data, config) {
  let {colorListRange, sizeListRange} = config;
  let splitList = mergeSplitList(colorListRange, sizeListRange);
  let color = '#FFFFFF';
  let size = 20;
  if (splitList[0].start === splitList[splitList.length - 1].start) {
    splitList = [];
    color = colorListRange[0].color;
    size = sizeListRange[0].size * 3;
  }
  splitList = splitList.map((item) => {
    let icon = new Image();
    if (config.locShape === 'loc') {
      icon.src = getImageByColor(mapIconLoc, item.color);
    } else {
      icon.src = getImageByColor(mapIconTriangle, item.color);
    }
    item.icon = icon;
    item.width = item.size * 3;
    item.height = item.size * 3;
    return item;
  });

  let defaultImage = new Image();
  let offsets = {
    top: '-50%',
    left: '-50%'
  };

  if (config.locShape === 'loc') {
    defaultImage.src = getImageByColor(mapIconLoc, color);
    offsets = {
      top: '-100%',
      left: '-50%'
    };
  } else {
    defaultImage.src = getImageByColor(mapIconTriangle, color);
  }

  let overlay = new inMap.ImgOverlay({
    style: {
      normal: {
        icon: defaultImage,
        width: size,
        height: size,
        offsets
      },
      splitList
    },
    tooltip: {
      show: data[0] && data[0].toolTipsData.length > 0,
      formatter (params) {
        return params.toolTipsData.map(({name, data}) => `
          <div>
            ${name}:${data}
          </div>
        `).join('');
      }
    },
    data
  });
  return [overlay];
}

// 得到点图动画实例
export function getPointAnimationOverlayInstance (data, config) {
  let {colorListRange, sizeListRange} = config;
  let splitList = mergeSplitList(colorListRange, sizeListRange);
  let color = '#FAFA32';
  let size = 5;
  if (splitList[0].start === splitList[splitList.length - 1].start) {
    splitList = [];
    color = colorListRange[0].color;
    size = sizeListRange[0].size * 0.8;
  }
  let overlay = new inMap.PointAnimationOverlay({
    style: {
      fps: 60,
      color,
      size: 20,
      speed: 0.5
    },
    data
  });

  let pointData = data.map((item) => ({
    ...item,
    style: undefined
  }));

  var pointOverlay = new inMap.ImgOverlay({
    style: {
      normal: {
        icon: alpahImg,
        width: size,
        height: size,
        offsets: {
          top: '-50%',
          left: '-50%'
        }
      },
      splitList: splitList.map((item) => ({
        icon: alpahImg,
        width: size * 3,
        height: size * 3,
        start: item.start,
        end: item.end,
        offsets: {
          top: '-50%',
          left: '-50%'
        }
      }))
    },
    tooltip: {
      show: data[0] && data[0].toolTipsData.length > 0,
      formatter (params) {
        return params.toolTipsData.map(({name, data}) => `
          <div>
            ${name}:${data}
          </div>
        `).join('');
      }
    },
    data: pointData
  });
  return [pointOverlay, overlay];
}

// 得到点图实例
export function getPointOverlayInstance (data, config) {
  let {colorListRange, sizeListRange} = config;
  let backgroundColor = 'rgba(200, 200, 50, 1)';
  let size = 5;
  let splitList = mergeSplitList(colorListRange, sizeListRange);
  if (splitList[0].start === splitList[splitList.length - 1].start) {
    splitList = [];
    backgroundColor = colorListRange[0].color;
    size = sizeListRange[0].size;
  }
  let overlay = new inMap.PointOverlay({
    style: {
      normal: {
        backgroundColor, // 填充颜色
        size // 半径
      },
      splitList: splitList.map((item) => {
        item.backgroundColor = item.color;
        return item;
      })
    },
    tooltip: {
      show: data[0] && data[0].toolTipsData.length > 0,
      formatter (params) {
        return params.toolTipsData.map(({name, data}) => `
          <div>
            ${name}:${data}
          </div>
        `).join('');
      }
    },
    data
  });
  return [overlay];
}

// 得到热力图实例
export function getHeatOverlayInstance (data, config) {
  let renderRadius = 10;
  if (config) {
    if (config.renderRadius) renderRadius = config.renderRadius;
  }

  let overlay = new inMap.HeatOverlay({
    style: {
      radius: renderRadius
    },
    data
  });
  return [overlay];
}

// 根据start和end合并两个split配置
function mergeSplitList (listA, listB) {
  let lcmLen = lcm(listA.length, listB.length);
  let newList = [];
  let min = listA[0].start;
  let max = listA[listA.length - 1].end;
  let stepLen = (max - min) / lcmLen;
  for (let index = 0; index < lcmLen; index++) {
    let start = min + (stepLen * index);
    let end = min + (stepLen * (index + 1));
    if (index + 1 === lcmLen) end = undefined;
    let Aobj = listA.find(({end: endA, start: startA}) => _.inRange(start, startA, endA));
    let Bobj = listB.find(({end: endB, start: startB}) => _.inRange(start, startB, endB));
    newList.push({
      ...Aobj,
      ...Bobj,
      start,
      end
    });
  }
  return newList;
}

// 最大公约数
function gcd (x, y) {
  let max, min, temp;
  max = x > y ? x : y;
  min = x < y ? x : y;
  while (max % min) {
    temp = max % min;
    max = min;
    min = temp;
  }
  return min;
}
// 最小公倍数
function lcm (x, y) {
  return x * y / gcd(x, y);
}

export const MapStyle = {
  WhiteLover: [
    {
      'featureType': 'water',
      'elementType': 'all',
      'stylers': {
        'color': '#dbe0e7'
      }
    },
    {
      'featureType': 'land',
      'elementType': 'all',
      'stylers': {
        'color': '#f1f3f5'
      }
    },
    {
      'featureType': 'green',
      'elementType': 'all',
      'stylers': {
        'color': '#e9ecf2'
      }
    },
    {
      'featureType': 'manmade',
      'elementType': 'all',
      'stylers': {
        'color': '#dde1e8'
      }
    },
    {
      'featureType': 'building',
      'elementType': 'all',
      'stylers': {
        'color': '#dde1e8'
      }
    },
    {
      'featureType': 'boundary',
      'elementType': 'geometry',
      'stylers': {
        'color': '#d7dadf'
      }
    },
    {
      'featureType': 'railway',
      'elementType': 'geometry',
      'stylers': {
        'hue': '#3d85c6',
        'lightness': 63,
        'saturation': 21,
        'visibility': 'on'
      }
    },
    {
      'featureType': 'local',
      'elementType': 'all',
      'stylers': {
        'color': '#e7ebf2',
        'visibility': 'off'
      }
    },
    {
      'featureType': 'local',
      'elementType': 'geometry.stroke',
      'stylers': {
        'color': '#b5bfc7',
        'visibility': 'off'
      }
    },
    {
      'featureType': 'subway',
      'elementType': 'all',
      'stylers': {
        'color': '#73b1df'
      }
    },
    {
      'featureType': 'poi',
      'elementType': 'all',
      'stylers': {
        'color': '#b5bfc7',
        'visibility': 'off'
      }
    },
    {
      'featureType': 'subway',
      'elementType': 'all',
      'stylers': {
        'color': '#d9e3ea',
        'visibility': 'off'
      }
    },
    {
      'featureType': 'highway',
      'elementType': 'labels',
      'stylers': {
        'color': '#c6d4df',
        'visibility': 'off'
      }
    },
    {
      'featureType': 'highway',
      'elementType': 'geometry.stroke',
      'stylers': {
        'color': '#c1c9d5'
      }
    },
    {
      'featureType': 'highway',
      'elementType': 'geometry.fill',
      'stylers': {
        'color': '#d3d8e1',
        'visibility': 'on'
      }
    },
    {
      'featureType': 'arterial',
      'elementType': 'labels',
      'stylers': {
        'visibility': 'on'
      }
    },
    {
      'featureType': 'administrative',
      'elementType': 'labels',
      'stylers': {
        'visibility': 'on'
      }
    },
    {
      'featureType': 'background',
      'elementType': 'labels',
      'stylers': {
        'visibility': 'off'
      }
    },
    {
      'featureType': 'arterial',
      'elementType': 'geometry.fill',
      'stylers': {
        'color': '#e9ecf2'
      }
    },
    {
      'featureType': 'arterial',
      'elementType': 'geometry.stroke',
      'stylers': {
        'color': '#d9dce3'
      }
    },
    {
      'featureType': 'arterial',
      'elementType': 'labels.text.fill',
      'stylers': {
        'visibility': 'off'
      }
    }
  ],
  Blueness: [
    {
      'featureType': 'water',
      'elementType': 'all',
      'stylers': {
        'color': '#566382'
      }
    },
    {
      'featureType': 'land',
      'elementType': 'all',
      'stylers': {
        'color': '#202636'
      }
    },
    {
      'featureType': 'green',
      'elementType': 'all',
      'stylers': {
        'color': '#282f57'
      }
    },
    {
      'featureType': 'manmade',
      'elementType': 'all',
      'stylers': {
        'color': '#3f4b8c'
      }
    },
    {
      'featureType': 'building',
      'elementType': 'all',
      'stylers': {
        'color': '#3f4b8c'
      }
    },
    {
      'featureType': 'boundary',
      'elementType': 'geometry',
      'stylers': {
        'color': '#4f6b9e'
      }
    },
    {
      'featureType': 'railway',
      'elementType': 'geometry',
      'stylers': {
        'color': '#4f6b9e'
      }
    },
    {
      'featureType': 'highway',
      'elementType': 'geometry.stroke',
      'stylers': {
        'color': '#202749',
        'visibility': 'off'
      }
    },
    {
      'featureType': 'arterial',
      'elementType': 'geometry.fill',
      'stylers': {
        'color': '#4f6b9e',
        'visibility': 'off'
      }
    },
    {
      'featureType': 'local',
      'elementType': 'geometry.fill',
      'stylers': {
        'color': '#303a6d'
      }
    },
    {
      'featureType': 'local',
      'elementType': 'geometry.stroke',
      'stylers': {
        'color': '#2d3667',
        'visibility': 'off'
      }
    },
    {
      'featureType': 'subway',
      'elementType': 'all',
      'stylers': {
        'color': '#445195',
        'visibility': 'off'
      }
    },
    {
      'featureType': 'all',
      'elementType': 'labels.text.stroke',
      'stylers': {
        'color': '#141831'
      }
    },
    {
      'featureType': 'all',
      'elementType': 'labels.text.fill',
      'stylers': {
        'color': '#5564b2'
      }
    },
    {
      'featureType': 'poi',
      'elementType': 'all',
      'stylers': {
        'color': '#141831',
        'visibility': 'off'
      }
    },
    {
      'featureType': 'subway',
      'elementType': 'all',
      'stylers': {
        'visibility': 'off'
      }
    },
    {
      'featureType': 'arterial',
      'elementType': 'geometry.stroke',
      'stylers': {
        'color': '#181e3e'
      }
    },
    {
      'featureType': 'highway',
      'elementType': 'geometry',
      'stylers': {
        'color': '#324160',
        'weight': '0.9'
      }
    },
    {
      'featureType': 'highway',
      'elementType': 'labels',
      'stylers': {
        'color': '#172137',
        'visibility': 'off'
      }
    },
    {
      'featureType': 'label',
      'elementType': 'labels',
      'stylers': {
        'visibility': 'off'
      }
    },
    {
      'featureType': 'administrative',
      'elementType': 'geometry',
      'stylers': {}
    },
    {
      'featureType': 'administrative',
      'elementType': 'labels',
      'stylers': {
        'visibility': 'on'
      }
    }
  ]
};
