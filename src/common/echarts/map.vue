<template>
  <div ref="map" class="map" unselectable="on"></div>
</template>
<script>
/* global BMap */

import _ from 'lodash';
import * as colorUtil from '@/common/color';
import * as mapUtil from './map.js';
import {MAP_ALIASNAME_LONGITUDE, MAP_ALIASNAME_LATITUDE} from '@/components/BI/editChart/chartConfig/Config';
import {setTimeout} from 'timers';
import {addingUnit, fmoney} from './common/common';
import * as TYPE from '@/common/chartConfigType';

let inMap = null;

// imMap实例
let inmapInstance = null;

export default {
  props: {
    setting: Array,
    chartData: Object | String,
    oneOption: Object,
    chartInfo: {}
  },
  data () {
    return {
      layers: [],
      currentLayer: 0
    };
  },
  mounted () {
    this.loadBaiduMap().then(() => {
      this.$nextTick(() => {
        this.initMap();
      });
    });
  },
  watch: {
    mapSkin (styleType) {
      this.changeStyle(styleType);
    },
    chartData: {
      handler () {
        this.debounceUpdateMap();
      },
      deep: true
    },
    mapConfig: {
      deep: true,
      handler () {
        this.debounceUpdateMap();
      }
    }
  },
  computed: {
    // 色阶列表
    colorListRange () {
      let max = 0;
      let min = 0;
      let stepLen = 0;
      let colorNumber = this.mapConfig.colorNumber ? this.mapConfig.colorNumber : 1;
      if (this.chartData.yaxis && this.chartData.yaxis[0]) {
        max = Number(_.maxBy(this.chartData.yaxis[0].data, (num) => Number(num)));
        min = Number(_.minBy(this.chartData.yaxis[0].data, (num) => Number(num)));
        stepLen = (max - min) / colorNumber;
      }
      let colorList = colorUtil.gradientColor(this.mapConfig.startColor, this.mapConfig.endColor, colorNumber);
      return colorList.map((color, index) => ({
        start: min + (stepLen * index),
        end: min + (stepLen * (index + 1)),
        color
      }));
    },
    // 尺寸列表
    sizeListRange () {
      let max = 0;
      let min = 0;
      let stepLen = 0;
      let [start, end] = this.mapConfig.sizeRange;
      let sizeNumber = end - start + 1;
      if (this.chartData.yaxis && this.chartData.yaxis[0]) {
        max = Number(_.maxBy(this.chartData.yaxis[0].data, (num) => Number(num)));
        min = Number(_.minBy(this.chartData.yaxis[0].data, (num) => Number(num)));
        stepLen = (max - min) / sizeNumber;
      }

      let sizeRangeList = [];

      for (let index = 0; index < sizeNumber; index++) {
        sizeRangeList.push({
          start: min + (stepLen * index),
          end: min + (stepLen * (index + 1)),
          size: 4.5 * (index + start)
        });
      }

      return sizeRangeList;
    },
    // map的皮肤名字
    mapSkin () {
      return this.$store.getters.theme === 'purpleNight' ? 'Blueness' : 'WhiteLover';
    },
    // 地图配置
    mapConfig () {
      let config = this.setting;
      let mapConfig = {};
      for (let index = 0; index < config.length; index++) {
        const {type, value} = config[index];
        switch (type) {
          case TYPE.MAP_CHART_TYPE:
            mapConfig.mapType = value;
            break;
          case TYPE.SHAPE_CHOOSE:
            mapConfig.locShape = value;
            break;
          case TYPE.COLOR_INTERVAL:
            mapConfig.startColor = value.startColor;
            mapConfig.endColor = value.endColor;
            mapConfig.colorNumber = value.colorNumber;
            break;
          case TYPE.DIMENSION_INTERVAL:
            mapConfig.sizeRange = value;
            break;
          case TYPE.RENDER_RADIUS:
            mapConfig.renderRadius = value;
            break;
        }
      }
      return mapConfig;
    }
  },
  methods: {
    // 初始化地图
    initMap () {
      inmapInstance = new inMap.Map({
        id: this.$refs.map,
        skin: mapUtil.MapStyle[this.mapSkin],
        center: [105.403119, 38.028658], // 地图中心点
        zoom: {
          value: 5, // 当前地图级别
          show: false,
          max: 18,
          min: 5
        }
      });

      let navigationControl = new BMap.NavigationControl();
      let bdMap = inmapInstance.getMap();
      bdMap.addControl(navigationControl);
      // fix bug 68593
      bdMap.addEventListener('zoomstart', () => {
        bdMap.dispatchEvent(new Event('resize'));
        bdMap.panBy(0, 0);
      });

      this.updataMap();
    },
    // 得到地图数据
    getMapData () {
      if (typeof this.chartData === 'string') {
        this.$message.error(this.chartData);
        return;
      }
      if (!this.chartData.xaxis) {
        return;
      }
      let longData = this.chartData.xaxis.find(({name}) => name === MAP_ALIASNAME_LONGITUDE);
      let latData = this.chartData.xaxis.find(({name}) => name === MAP_ALIASNAME_LATITUDE);

      let xToolTipsData = this.chartData.xaxis.filter(({name}) => name !== MAP_ALIASNAME_LONGITUDE && name !== MAP_ALIASNAME_LATITUDE);
      let toolTipsData = xToolTipsData.concat(this.chartData.yaxis.map((item) => {
        item.isValueField = true;
        return item;
      }));
      if (!longData || longData.data.length === 0) return [];
      if (!latData || latData.data.length === 0) return [];

      const dataMap = longData.data.reduce((total, long, index) => {
        if (isNaN(Number(long)) || isNaN(latData.data[index])) return total;
        let count = 10;
        if (this.chartData.yaxis && this.chartData.yaxis[0]) {
          count = Number(this.chartData.yaxis[0].data[index]);
        }
        if (isNaN(count)) count = 10;

        const repeatPoint = total[`${Number(long)}+${Number(latData.data[index])}`];
        if (repeatPoint) {
          repeatPoint.toolTipsData = repeatPoint.toolTipsData.concat(this.getToolTipDataByIndex(toolTipsData, index));
        } else {
          total[`${Number(long)}+${Number(latData.data[index])}`] = {
            count,
            toolTipsData: this.getToolTipDataByIndex(toolTipsData, index),
            geometry: {
              type: 'Point',
              coordinates: [Number(long), Number(latData.data[index])]
            },
            style: this.getPointStyleByCount(count)
          };
        }

        return total;
      }, {});
      const dataList = Object.values(dataMap);

      return dataList;
    },
    // 根据Index获取维度数据
    getToolTipDataByIndex (toolTipsData, index) {
      return toolTipsData.map(({name, data, isValueField}) => {
        let value = data[index];
        let pres;
        if (isValueField) {
          pres = this.chartInfo.reportParam.indexCondition[0].numDisplayed;
          if (pres.type === 'dec') {
            value = addingUnit(value, pres.state.unit);
            value = fmoney(value, pres.state.dec, pres.state.commas);
          } else {
            value = addingUnit(value, pres.state.unit);
            value = fmoney(value, pres.state.dec, pres.state.commas);
          }
        }
        return {
          name,
          data: `${value + (pres ? pres.state.unit : '')}`
        };
      });
    },
    // 根据数据获取点样式,只有散点动画会设置颜色大小
    getPointStyleByCount (count) {
      if (this.mapConfig.mapType !== 'point' || this.mapConfig.locShape !== 'flash') {
        return {};
      }
      let color = 'rgb(200, 200, 50)';
      let size = 10;
      let colorRangeInfo = this.findInRangeData(count, this.colorListRange);
      if (colorRangeInfo) {
        color = colorRangeInfo.color;
      }
      let sizeRangeInfo = this.findInRangeData(count, this.sizeListRange);
      if (sizeRangeInfo) {
        size = sizeRangeInfo.size;
      }
      if (this.colorListRange[0].start === this.colorListRange[this.colorListRange.length - 1].start) {
        color = this.colorListRange[0].color;
      }
      if (this.sizeListRange[0].start === this.sizeListRange[this.sizeListRange.length - 1].start) {
        size = this.sizeListRange[0].size;
      }
      return {
        color,
        size
      };
    },
    // 找到在范围内的数据
    findInRangeData (count, arrData) {
      return arrData.find(({start, end}, index, {length}) => {
        if (length === index + 1) end++;
        return _.inRange(count, start, end);
      });
    },
    // 延时更新地图
    debounceUpdateMap: _.debounce(function () {
      window.$_hasLoadedMap && this.updataMap();
    }, 300),
    // 更新地图
    updataMap () {
      this.deleteLayer(this.currentLayer);
      let type = this.mapConfig.mapType;
      if (type === 'point') {
        if (this.mapConfig.locShape !== 'dot') type = 'img';
        if (this.mapConfig.locShape === 'flash') type = 'pointAnimation';
      }
      let data = this.getMapData();
      let config = {colorListRange: this.colorListRange, sizeListRange: this.sizeListRange, ...this.mapConfig};
      let overlay = mapUtil.getOverlayInstanceByType({type, data, config});
      this.addLayer(type, overlay);
    },
    // 添加图层
    addLayer (layerType, overlay) {
      overlay.forEach(overlayItem => {
        inmapInstance.add(overlayItem);
      });
      this.layers.push({
        type: layerType,
        overlay
      });
    },
    // 删除图层
    deleteLayer (layerIndex) {
      if (!this.layers[layerIndex]) return;
      this.layers[layerIndex].overlay.forEach(overlayItem => {
        inmapInstance.remove(overlayItem);
      });
      this.layers.splice(layerIndex, 1);
    },
    // 更改样式
    changeStyle (styleType = 'WhiteLover') {
      if (!inmapInstance || !mapUtil.MapStyle[styleType]) return;
      inmapInstance.getMap().setMapStyle({
        styleJson: mapUtil.MapStyle[styleType]
      });
    },
    // 加载inMap
    loadInMap () {
      return import('inmap').then((inmap) => {
        inMap = inmap;
        mapUtil.init(inmap);
      });
    },
    // 加载百度地图脚本，并在加载完百度地图后加载inmap和地图工具
    loadBaiduMap () {
      if (document.querySelector('script#baiduMap')) {
        if (window.$_hasLoadedMap) {
          return this.loadInMap();
        } else {
          if (!window.$_initMapHandleList) window.$_initMapHandleList = [];
          return new Promise((resolve) => {
            window.$_initMapHandleList.push(() => {
              this.loadInMap().then(() => resolve());
            });
          });
        }
      }
      return new Promise((resolve) => {
        window.$_initializeMap = function () {
          window.$_hasLoadedMap = true;
          window.$_initMapHandleList && setTimeout(() => {
            window.$_initMapHandleList.forEach((handle) => handle());
          }, 0);
          resolve();
        };
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = 'baiduMap';
        script.src = 'https://api.map.baidu.com/api?v=2.0&ak=pm4Wy2VqVREvQcHUizZHFSlVQmc3tCpK&callback=$_initializeMap';
        document.body.appendChild(script);
      }).then(() => this.loadInMap());
    }
  }
};
</script>
<style lang="scss" scoped>
.map{
  width: 100%;
  height: 100%;
  background-color: rgb(32, 38, 54) !important;
  .theme-purple & {
    background-color: #FFF !important;
  }
  /* fix bug 69053*/
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
}
</style>
<style>
.map .BMap_cpyCtrl.BMap_noprint.anchorBL{
  display: none;
}
.map .anchorBL img{
  opacity: .3;
  transform: scale(0.8);
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
  height: 32px;
  width: auto;
}
</style>
