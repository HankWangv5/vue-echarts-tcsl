<template>
    <div ref="reference" class='excel-table-box'>
        <div ref="grid" class="excel-table">
            <div class="horizontal-container" v-show="!isLoading" :style="{width:`${(width-scrollerWidth)/dpr+2}px`}"
                 @click="scroll($event,0)">
                <div class="scroll-bar-horizontal" ref="horizontal" @mousedown="dragMove($event,0)"
                     :style="{width:(horizontalBar.size/dpr)+'px',left:(horizontalBar.x/dpr)+'px'}">
                    <div></div>
                </div>
            </div>

            <div class="vertical-container" v-show="!isLoading" :style="{height:`${(height-scrollerWidth)/dpr+2}px`}"
                 @click="scroll($event,1)">
                <div class="scroll-bar-vertical" ref="horizontal" @mousedown="dragMove($event,1)"
                     :style="{height:(verticalBar.size/dpr)+'px',top:(verticalBar.y/dpr)+'px'}">
                    <div></div>
                </div>
            </div>
            <canvas ref="canvas" :width="width" :height="height"
                    :style="`width:${width/dpr}px;height:${height/dpr}px;`"></canvas>
        </div>
    </div>
</template>

<script>
import painted from './painted';
import events from './events';
import calculate from './calculate';
import scroller from './scroller';
import utils from './utils';

const isAvailableData = (v) => {
  let boo = false;
  if (typeof v === 'number') boo = true;
  if (typeof v === 'string') {
    if (!isNaN(parseFloat(v))) boo = true;
  }
  return boo;
};
const flatten = arr => arr.reduce((prev, item) => prev.concat(Array.isArray(item) ? flatten(item) : item), []);

const mergeTheLineKey = (data = [], key, oneOption = {}) => {
  if (oneOption.mergeTheLineKey) {
    return data.map(vi => {
      vi.map((v, i) => {
        // v = Object.assign({}, v)
        if (vi.length === 1 && !v.stripe) {
          Object.defineProperty(v, 'stripe', {
            enumerable: false,
            value: key,
            configurable: true
          });
        }
        if (i === 0) return v;
        v[key] = 'dontPaintX';
        return v;
      });
      return vi;
    });
  }
  return data;
};
export default {
  mixins: [utils, calculate, painted, events, scroller],
  props: {
    propsColumns: Array, // 参照Example里面data的数据；
    gridData: Array// 参照Example里面data的数据；
    // oneOption: {
    //     type: Object,
    // },
  },
  data () {
    return {
      keys: {37: 1, 38: 1, 39: 1, 40: 1},
      ctx: null, // canvas实例
      isDown: false, // 鼠标点击标识
      allData: [], // 图表body区域数据
      columns: [], // 表头数据
      oneOption: {
        mergeTheLineKey: false, // 是否何必单元格
        totalColumn: false, // 行总计
        totalLine: false, // 列总计
        keyOfSubtotalColumn: [], // 行小计
        keyOfSubtotalLine: [], // 列小计
        sortCallback: (lkey) => { // 排序点击事件回调函数
          window.console.log(lkey);
        }
      },
      option: {}
    };
  },
  mounted () {
    this.initEvent();
    this.height = this.$refs.grid.offsetHeight - 2;
  },
  destroyed () {
    this.removeEvent();
  },
  methods: {
    setOption (option) {
      this.horizontalBar.x = 0;
      this.verticalBar.y = 0;
      this.offset.y = 0;
      this.offset.x = 0;
      this.height = this.$refs.grid.offsetHeight - 2;
      this.theme = option.theme;
      this.option = option;
      const painted = () => {
        this.oneOption = {...this.oneOption, ...option.oneOption};
        let data = this.gridDataToData(option);
        this.columns = [...option.propsColumns];
        if (this.oneOption.keyOfSubtotalColumn.length > 0) {
          this.oneOption.keyOfSubtotalColumn = this.oneOption.keyOfSubtotalColumn.map((v, i) => ({
            key: ('hangxiaoji' + i),
            name: v
          }));
          this.oneOption.keyOfSubtotalColumn.forEach((v) => {
            data = this.getSubtotalcolumn(data, {
              title: `${v.name}总计`,
              key: v.key,
              compare_names: [v.name],
              isX: 'true'
            });
          });
        }
        if (this.oneOption.totalLine) {
          data = this.getTotalcolumn(data, {
            title: '行总计',
            key: 'totalLine',
            compare_names: ['列总计'],
            isX: 'true'
          });
        }
        this.allData = data;
        // this.data = data;
        // this.initSize();
        this.initCanvas();
        // this.painted(this.initDisplayItems());
        // this.rePainted();
      };
      window.requestAnimationFrame(painted);
    },
    gridDataToData (option) {
      const {gridData, propsColumns} = option;
      const columnkeys = Object.keys(gridData[0]);
      const isXkeys = [];
      this.isYkeys = [];
      for (const item in propsColumns) {
        if (propsColumns[item].isX) {
          isXkeys.push(propsColumns[item].key);
        } else {
          this.isYkeys.push(propsColumns[item].key);
        }
      }
      const isXColumns = gridData.map((v) => {
        const obj = {};
        for (const item in propsColumns) {
          if (propsColumns[item].isX) {
            obj[propsColumns[item].key] = v[propsColumns[item].key];
          }
        }
        return obj;
      });
      const isYColumns = gridData.map((v) => {
        const obj = {};
        for (const item in propsColumns) {
          if (!propsColumns[item].isX) {
            obj[propsColumns[item].key] = v[propsColumns[item].key];
          }
        }
        return obj;
      });
      const newColumns = [];
      for (const e in isYColumns) {
        newColumns[e] = {...isXColumns[e], ...isYColumns[e]};
      }
      const factorialRemoval = (Columns, isXkey, option) => {
        const obj = {};
        let num = 1;
        // isXkey = JSON.parse(JSON.stringify(isXkey));
        isXkey = [...isXkey];
        const key = isXkey.shift();
        for (const val of Columns) {
          if (!obj[val[key]]) {
            obj[val[key]] = num;
            num += 1;
          }
        }
        let data = new Array(num - 1).fill(1).map(() => []);
        for (const i of Columns) {
          data[obj[i[key]] - 1].push(i);
        }
        data = mergeTheLineKey(data, key, option);
        if (Array.isArray(data) && (~option.keyOfSubtotalLine.indexOf(key))) {
          data.forEach((v) => {
            const obj = {};
            if (~v.findIndex(e => e.isSubtotal_js)) return;
            for (const k of columnkeys) {
              obj[k] = v.reduce((prev, e) => {
                let num = 0;
                if (isAvailableData(e[k])) {
                  num = +e[k];
                }
                return num + prev;
              }, 0).toFixed(6);
              if (~isXkeys.indexOf(k)) {
                if (isXkeys.indexOf(k) > isXkeys.indexOf(key)) {
                  obj[k] = 'dontPaintY';
                } else {
                  obj[k] = 'dontPaintX';
                }
              }
              if (k === key) {
                obj[k] = '小计';
              }
            }
            obj.isSubtotal_js = true;
            v.push(obj);
          });
        }
        if (isXkey.length > 0) {
          data = data.map(v => factorialRemoval(v, isXkey, option));
        }

        return data;
      };
      let data;
      if (this.oneOption.mergeTheLineKey) {
        data = factorialRemoval(newColumns, isXkeys, this.oneOption);
        data = flatten(data);
      } else {
        data = newColumns.map(v => {
          Object.defineProperty(v, 'stripe', {
            enumerable: false,
            value: isXkeys[0],
            configurable: true
          });
          return v;
        });
      }
      if (this.oneOption.totalColumn) {
        const totalColumn = this.getTotalLine(gridData, isXkeys);
        data = [...data, totalColumn];
      }
      return data;
    },
    getTotalLine (gridData, isXkey) {
      const Total = {};
      for (const v in gridData[0]) {
        Total[v] = '0';
      }
      isXkey.forEach((e, i) => {
        Total[e] = (i === 0 ? '列总计' : 'dontPaintY');
      });
      for (const v in Total) {
        if (!(~isXkey.indexOf(v))) {
          Total[v] = gridData.reduce((prev, e) => {
            let num = 0;
            if (isAvailableData(e[v])) {
              num = e[v];
            }
            return (+num) + prev;
          }, 0).toFixed(6);
        }
      }
      return Total;
    },
    getTotalcolumn (data, option) {
      this.columns.push(option);
      return data.map((v) => {
        let num = 0;
        for (const i of this.isYkeys) {
          if (isAvailableData(v[i]) && !~this.oneOption.keyOfSubtotalColumn.findIndex(v => v.key === i)) {
            num += parseFloat(v[i]);
          }
        }
        v[option.key] = num.toFixed(2);
        return v;
      });
    },
    getSubtotalcolumn (data, option) {
      const keys = this.columns.reduce((arr, v) => {
        if (v.compare_names[0] === option.compare_names[0]) {
          arr.push(v.key);
        }
        return arr;
      }, []);
      // console.log(this.columns, keys[0]);
      option.pres = this.columns.find((x) => x.key === keys[0]).pres;
      this.columns.push(option);
      return data.map((v) => {
        let num = 0;
        for (const i of this.isYkeys) {
          if (isAvailableData(v[i]) && ~keys.indexOf(i)) {
            num += +(v[i]);
          }
        }
        v[option.key] = num.toFixed(6);
        return v;
      });
    },
    validateKeyType (key) {
      for (const item of this.allColumns) {
        if (item.key === key) {
          if (item.type === 'number') {
            return {
              type: 'number',
              title: item.title
            };
          }
          return {
            type: 'string',
            title: item.title
          };
        }
      }
      return {
        type: 'string'
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/variable.scss';
* {
  box-sizing: border-box;
}

.excel-table-box {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.excel-table {
  width: 100%;
  height: 100%;
  border: 1px solid #d4d4d4;
  position: relative;
  box-sizing: border-box;
  //   min-width: 714px;
  .horizontal-container {
    position: absolute;
    height: px;
    left: 0;
    bottom: 0;
    background: #f1f1f1;
    user-select: none;
    .scroll-bar-horizontal {
      position: absolute;
      bottom: 2px;
      height: 10px;
      // padding: 0 2px;
      // margin: 0 2px;
      > div {
        width: 100%;
        border-radius: 6px;
        height: 10px;
      }
    }
  }
  .vertical-container {
    user-select: none;
    position: absolute;
    width: 14px;
    top: 0;
    right: 0;
    background: #f1f1f1;
    .scroll-bar-vertical {
      position: absolute;
      right: 0px;
      width: 12px;
      padding: 2px 0;
      > div {
        border-radius: 6px;
        width: 10px;
        height: 100%;
      }
    }
  }

  .input-content {
    padding: 5px;
    top: -10000px;
    left: -10000px;
    outline: none;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 5px;
    border: 2px solid #4285f4;
    color: #666;
    border-radius: 0px;
    font-size: 12px;
    position: fixed;
    background-color: #fff;
    z-index: 10;
  }
  .focus-area {
    display: none;
    border: 2px solid #4285f4;
    top: -10000px;
    left: -10000px;
    position: absolute;
    z-index: 5;
  }
  .select-area {
    z-index: 5;
    display: none;
    border: 1px solid #03a2fe;
    top: -10000px;
    left: -10000px;
    background-color: rgba(160, 195, 255, 0.2);
    position: absolute;
    transition: 0.1s all;
  }
  canvas {
    user-select: none;
    // background-color: #fff;
  }
  //   .slide-fade-enter-active {
  //     transition: all 0.2s ease;
  //   }
  //   .slide-fade-leave-active {
  //     transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
  //   }
  //   .slide-fade-enter,
  //   .slide-fade-leave-to {
  //     transform: translateX(10px);
  //     opacity: 0;
  //   }
  //   .select-tip-btn {
  //     z-index: 10;
  //     position: absolute;
  //     width: 70px;
  //     border: 1px solid #bbb;
  //     box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  //   }
}
</style>
