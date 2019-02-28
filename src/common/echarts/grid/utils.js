// import throttle from 'throttle-debounce/throttle'

export default {
  methods: {
    getTextLine (ctx, text, width, {isX, pres}) {
      if (!text && text !== 0) {
        return null;
      }
      // var reg = new RegExp('^(([1-9][0-9]*\.[0-9][0-9]*)|([0]\.[0-9][0-9]*)|([1-9][0-9]*)|([0]{1}))$');//eslint-disable-line
      if (pres) {
        if (pres.type === 'dec') {
          text = this.addingUnit(text, pres.state.unit);
          text = this.fmoney(text, pres.state.dec, pres.state.commas);
        } else {
          text = this.addingUnit(text, pres.state.unit);
          text = this.fmoney(text, pres.state.dec, pres.state.commas);
        }
        text = text + (pres ? pres.state.unit : '');
      }
      // text = this.fmoney(text, pres);
      const chr = `${text}`.split('');
      let temp = '';
      const row = [];
      for (let a = 0; a < chr.length; a += 1) {
        if (ctx.measureText(temp).width >= width - (36 * this.dpr) + this.fillWidth) {
          row.push(temp);
          temp = '';
        }
        temp += chr[a];
      }
      row.push(temp);
      return row;
    },
    addingUnit (val, unit) {
      let nVal = val;
      if (unit === '万') {
        nVal = val / 10000;
      } else if (unit === '亿') {
        nVal = val / 100000000;
      } else if (unit === 'K') {
        nVal = val / 1000;
      } else if (unit === 'M') {
        nVal = val / 1000000;
      } else if (unit === '%') {
        nVal = val * 100;
      }
      // return this.scientificToNumber(new Number(nVal));//eslint-disable-line
      return new Number(nVal).toFixed(6);//eslint-disable-line
    },
    // scientificToNumber (beforeCountTest) {
    //   // 转换之前的科学计数法表示
    //   var tempValue = beforeCountTest;
    //   var tempValueStr = new String(tempValue);//eslint-disable-line
    //   if ((tempValueStr.indexOf('E') !== -1) || (tempValueStr.indexOf('e') !== -1)) {
    //     // alert(tempValueStr + '是科学计数法表示!');
    //     var regExp = new RegExp('^((\\d+.?\\d+)[Ee]{1}(\\d+))$', 'ig');
    //     var result = regExp.exec(tempValue);
    //     var resultValue = '';
    //     var power = '';
    //     if (result != null) {
    //       resultValue = result[2];
    //       power = result[3];
    //       result = regExp.exec(tempValueStr);
    //     }
    //     if (resultValue !== '') {
    //       if (power !== '') {
    //         var powVer = Math.pow(10, power);
    //         resultValue = resultValue * powVer;
    //       }
    //     }
    //     return resultValue;
    //   }
    //   return tempValueStr;
    // },
    fmoney (s = 0, n = 2, f) {
      // n = n > 0 && n <= 20 ? n : 3;
      s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';//eslint-disable-line
      if (!f) return s;
      var source = s.split('.');// 按小数点分成2部分
      source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), '$1,');// 只将整数部分进行都好分割
      return source.join('.');// 再将小数部分合并进来
    },
    getHeadWord (x, y, columns) {
      let selectColumn = null;
      const digui = (displayColumns) => {
        for (const column of displayColumns) {
          if (column.child && column.child.length > 0) {
            digui(column.child);
          } else if (x > column.x && x < column.x + column.width && y > (column.isX ? 0 : column.i * this.rowHeight) && y < (column.i + 1) * this.rowHeight) {
            selectColumn = Object.assign({}, column);
          }
        }
      };
      digui(this.getHeaderTree(JSON.parse(JSON.stringify(columns))));
      return selectColumn;
    },
    getFixedHeadIcon (x, y, columns, position, size) {
      let selectColumn = null;
      const digui = (displayColumns) => {
        for (const column of displayColumns) {
          if (column.child && column.child.length > 0) {
            digui(column.child);
          } else if (x > (column.x + column.width) - (position) && x < (column.x + column.width) - (position - size) && y > (column.isX ? 0 : column.i * this.rowHeight) && y < (column.i + 1) * this.rowHeight) {
            selectColumn = Object.assign({}, column);
          }
        }
      };
      digui(this.getHeaderTree(JSON.parse(JSON.stringify(columns))));
      return selectColumn;
    },
    getSortHeadIcon (x, y, columns, size) {
      let selectColumn = null;
      const digui = (displayColumns) => {
        for (const column of displayColumns) {
          if (column.child && column.child.length > 0) {
            digui(column.child);
          } else if (x > (column.x + column.width / 2 + this.ctx.measureText(column.title).width / 2) && x < (column.x + (column.width / 2 + this.ctx.measureText(column.title).width / 2) + size) && y > (column.isX ? 0 : column.i * this.rowHeight) && y < (column.i + 1) * this.rowHeight) {
            selectColumn = Object.assign({}, column);
          }
        }
      };
      digui(this.getHeaderTree(JSON.parse(JSON.stringify(columns))));
      return selectColumn;
    },
    getDrillObj (x, y, rows) {
      // console.log(rows);
      let obj = null;
      for (const row of rows) {
        // console.log(row);
        for (const column of row) {
          // console.log(column);
          if (x > column.x && x < (column.x + column.width) && y > column.y && y < column.height + column.y) {
            obj = column;
          }
        }
      }
      return obj;
    }
  }
};
