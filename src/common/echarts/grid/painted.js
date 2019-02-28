let tableColor = {
  purple: {
    bodyBGColor: '#fff',
    bodyColor: '#333',
    headerColor: '#333333',
    textColor: '#666666',
    borderColor: '#E1E2E6',
    white: '#ffffff',
    shadowColor: 'rgba(0,0,0,0.2)',
    fillColor: '#f9f9f9',
    headFillColor: '#F7F9FC',
    buttonColor: '#20a0ff',
    TotleColor: '#E6ECF5',
    selectColor: '#6bc9ff',
    selectAreaColor: 'rgba(160, 195, 255, 0.2)',
    selectRowColor: '#f6f6f6',
    dotColor: '#74d337',
    stripeColor: '#f7f9fc'
  },
  purpleNight: {
    bodyBGColor: '#272e42',
    bodyColor: '#FEFEFE',
    headerColor: '#fff',
    textColor: '#FEFEFE',
    borderColor: '#10141b',
    white: '#272e42',
    shadowColor: 'rgba(0,0,0,0.2)',
    fillColor: '#f9f9f9',
    headFillColor: '#303952',
    buttonColor: '#20a0ff',
    TotleColor: '#757d94',
    selectColor: '#6bc9ff',
    selectAreaColor: 'rgba(160, 195, 255, 0.2)',
    selectRowColor: '#f6f6f6',
    dotColor: '#74d337',
    stripeColor: '#303952'
  }
};

export default {
  data () {
    const naturalOrder = new window.Image();
    naturalOrder.src = require('./img/ic_sort_1.png');
    const stringsIcon = new window.Image();
    stringsIcon.src = require('./img/ic_sort_2.png');
    const DescendingIcon = new window.Image();
    DescendingIcon.src = require('./img/ic_sort_0.png');
    const unfixedIcon = new window.Image();
    unfixedIcon.src = require('./img/ic_pin.png');
    const fixedIcon = new window.Image();
    fixedIcon.src = require('./img/ic_pin_sel.png');
    let one = 1 * window.devicePixelRatio;
    const fontSize = 14 * window.devicePixelRatio || 1;
    return {
      theme: 'purple',
      fontSize,
      stringsIcon,
      DescendingIcon,
      naturalOrder,
      unfixedIcon,
      fixedIcon,
      lineWidth: one,
      halfLineWidth: one / 2,
      isLoading: null,
      blodFont: `bold ${fontSize}px Roboto`,
      normalFont: `normal ${fontSize}px Roboto`
    };
  },
  methods: {
    /**
     * 初始化canvas
     */
    initCanvas () {
      const canvas = this.$refs.canvas;
      let ctx = '';
      if (this.ctx) {
        ctx = this.ctx;
      } else {
        ctx = canvas.getContext('2d');
        this.ctx = ctx;
      }
      ctx.font = this.normalFont;

      this.ratio = (window.devicePixelRatio || 1);
      this.setbodyWidth();
      this.clearAllCells();
      this.setAllCells(0, true);
      this.setBodyHeight(this.allRows, this.originPoint);
      this.initSize();
      this.setMaxpoint(this.width, this.height, this.scrollerWidth);
      this.resetScrollBar(this.maxPoint, this.bodyWidth, this.bodyHeight, this.fixedWidth);
    },
    /**
     * 重新绘制
     */
    rePainted () {
      let items = this.initDisplayItems();
      this.clearPainted();
      this.painted(items);
      return items;
    },
    /**
     * 清空画布
     */
    clearPainted () {
      this.ctx && this.ctx.clearRect(0, 0, this.width, this.height);
    },
    /**
     * 绘制主驱动方法
     * @param {*} displayItems
     */
    painted ({displayColumns, displayRows, displayCells, displayFixedCells}) {
      const ctx = this.ctx;
      if (!ctx) return;
      ctx.fillStyle = tableColor[this.theme].headerColor;// text color
      ctx.textAlign = 'center';
      ctx.lineWidth = this.lineWidth;
      ctx.strokeStyle = tableColor[this.theme].borderColor;
      ctx.textBaseline = 'middle';
      this.paintBGColor(ctx);
      this.paintStripeBGC(ctx, displayCells);
      this.paintBGC(ctx, displayCells);
      this.paintLine(ctx, displayRows, displayColumns);
      this.paintBody(ctx, displayCells);
      ctx.textAlign = 'center';
      this.paintHeader(ctx, displayColumns);

      if (displayFixedCells.length > 0 && this.fillWidth === 0) {
        this.paintFixedCells(ctx, displayFixedCells, displayColumns);
      }
      // this.paintHeadWord(ctx, displayColumns)

      this.painScroller(ctx, this.scrollerWidth);
    },
    /**
     * 绘制表格线条
     * @param {*} ctx
     * @param {*} displayRows
     * @param {*} displayColumns
     */
    paintBGColor (ctx) {
      const {p, i, maxPoint, rowHeight, rowFocus, serialWidth, bodyHeight, toolbarHeight, originPoint} = this;//eslint-disable-line
      ctx.fillStyle = tableColor[this.theme].bodyBGColor;
      ctx.fillRect(i(0), p(0), i(maxPoint.x), p(bodyHeight));
    },
    paintLine (ctx, displayRows, displayColumns) {
      const {p, i, maxPoint, rowHeight, serialWidth, bodyHeight, toolbarHeight, originPoint} = this;//eslint-disable-line
      ctx.beginPath();
      ctx.strokeStyle = tableColor[this.theme].borderColor;
      ctx.lineWidth = this.lineWidth;

      displayColumns.forEach((column, index) => {
        if (!column.fixed && index !== displayColumns.length - 1) {
          ctx.moveTo(p(column.x + column.width) + 0.25 * this.dpr, originPoint.y);
          ctx.lineTo(p(column.x + column.width), i(bodyHeight));
        }
      });
      // 横线
      displayRows.forEach((item) => {
        ctx.moveTo(serialWidth, p(item.y + item.height));
        ctx.lineTo(i(maxPoint.x), p(item.y + item.height));
        // }
      });
      ctx.moveTo(serialWidth, p(rowHeight + toolbarHeight));
      ctx.lineTo(i(maxPoint.x), p(rowHeight + toolbarHeight));

      ctx.stroke();
    },
    /**
     * 绘制数据
     * @param {*} ctx
     * @param {*} displayCells
     */
    paintBody (ctx, displayCells) {
      const {paintText, i, lineWidth, paintUnderline} = this;
      ctx.font = this.normalFont;
      for (const rows of displayCells) {
        for (const item of rows) {
          if (!item.fixed || this.fillWidth > 0) {
            if (item.content === 'dontPaintX') {
              ctx.beginPath();
              ctx.strokeStyle = tableColor[this.theme].bodyBGColor;
              ctx.lineWidth = 4 * this.dpr;

              ctx.moveTo(i(item.x + (item.x ? lineWidth : 0)), i(item.y));
              ctx.lineTo(i(item.x + item.width - this.halfLineWidth), i(item.y));
              ctx.stroke();
            } else if (item.content === 'dontPaintY') {
              ctx.beginPath();
              ctx.strokeStyle = tableColor[this.theme].TotleColor;
              ctx.lineWidth = 6 * this.dpr;
              ctx.moveTo(i(item.x + this.lineWidth), i(item.y + this.lineWidth));
              ctx.lineTo(i(item.x + this.lineWidth), i((item.y + item.height)));
              ctx.stroke();
            } else if (item.paintText && item.paintText.length > 0) {
              ctx.beginPath();
              ctx.fillStyle = tableColor[this.theme].bodyColor;
              if (item.isX && !(~item.key.indexOf('hangxiaoji') || item.key === 'totalLine')) {
                ctx.textAlign = 'start';
                paintText(ctx, i(item.x + 16 * this.dpr), i(16 * this.dpr + item.y), item.paintText, this.dpr);
              } else {
                ctx.textAlign = 'end';
                paintText(ctx, i(item.x + (item.width - 20 * this.dpr)), i(16 * this.dpr + item.y), item.paintText, this.dpr);
              }
              ctx.stroke();
              if (item.canJump) {
                ctx.beginPath();
                ctx.strokeStyle = tableColor[this.theme].headerColor;
                ctx.lineWidth = this.lineWidth / 8;
                paintUnderline(ctx, this.dpr, item, item.x);
                ctx.stroke();
              }
            }
          }
        }
      }
    },
    paintStripeBGC (ctx, displayCells) {
      const {i, bodyWidth} = this;
      let lineWidth = this.lineWidth;
      ctx.fillStyle = tableColor[this.theme].stripeColor;
      ctx.strokeStyle = tableColor[this.theme].stripeColor;
      ctx.beginPath();
      for (const rows of displayCells) {
        for (const item of rows) {
          // console.log(item);
          if (item.rowIndex % 2 === 1) {
            if (item.key === item.rowData.stripe) {
              ctx.fillRect(i(item.x + (lineWidth * this.dpr)), i(item.y + (lineWidth * this.dpr)), (item.x + (lineWidth * this.dpr) + bodyWidth), i(item.height - (lineWidth * this.dpr)));
            } else if (~item.key.indexOf('lishide')) {
              ctx.fillRect(i(item.x + (lineWidth * this.dpr)), i(item.y + (lineWidth * this.dpr)), (item.x + (lineWidth * this.dpr) + bodyWidth), i(item.height - (lineWidth * this.dpr)));
            }
          }
        }
      }
      ctx.stroke();
    },
    paintBGC (ctx, displayCells) {
      const {i, width} = this;
      let lineWidth = this.lineWidth;
      ctx.fillStyle = tableColor[this.theme].TotleColor;
      ctx.strokeStyle = tableColor[this.theme].TotleColor;
      ctx.beginPath();
      for (const rows of displayCells) {
        for (const item of rows) {
          if (!item.fixed || this.fillWidth > 0) {
            for (const key in item.rowData) {
              if (item.rowData[key] === '小计' || item.rowData[key] === '列总计' || ~item.key.indexOf('hangxiaoji')) {
                if (item.content !== 'dontPaintX') {
                  if (item.x < 0) {
                    ctx.fillRect(i(item.x + (lineWidth * this.dpr)), i(item.y + (lineWidth * this.dpr)), ((lineWidth * this.dpr) + item.width), i(item.height - (lineWidth * this.dpr)));
                  } else {
                    ctx.fillRect(i(item.x + (lineWidth * this.dpr)), i(item.y + (lineWidth * this.dpr)), (item.x + (lineWidth * this.dpr) + width), i(item.height - (lineWidth * this.dpr)));
                  }
                }
              } else if (item.key === 'totalLine') {
                ctx.fillRect(i(item.x + (lineWidth * this.dpr)), i(item.y + (lineWidth * this.dpr)), (item.x + (lineWidth * this.dpr) + item.width), i(item.height - (lineWidth * this.dpr)));
              }
            }
          }
        }
      }
      ctx.stroke();
    },
    /**
     * 绘制文字（多行）
     * @param {*} ctx
     * @param {number} x
     * @param {number} y
     * @param {array} row
     */
    paintText (ctx, x, y, row, dpr) {
      for (let b = 0; b < row.length; b += 1) {
        ctx.fillText(row[b], x, y + (b * 18 * dpr));
      }
    },
    // paintUnderline (ctx, x, y, item) {
    //   for (let b = 0; b < item.paintText.length; b += 1) {
    //     ctx.moveTo(x, y);
    //     ctx.lineTo(x, y);
    //   }
    // },
    paintUnderline (ctx, dpr, item, x) {
      let {p} = this;
      for (let b = 0; b < item.paintText.length; b += 1) {
        // ctx.moveTo(p(x + (item.width - ctx.measureText(item.paintText[b]).width - 2) / 2), p(item.y + 25 * dpr) + (b * 18 * dpr));
        // ctx.lineTo(p(x + item.width - (item.width - ctx.measureText(item.paintText[b]).width - 2) / 2), p(item.y + 25 * dpr) + (b * 18 * dpr));
        ctx.moveTo(p(x + 16 * dpr), p(item.y + 25 * dpr) + (b * 18 * dpr));
        ctx.lineTo(p(x + ctx.measureText(item.paintText[b]).width + 16 * dpr), p(item.y + 25 * dpr) + (b * 18 * dpr));
      }
    },
    /**
     * 绘制表头
     * @param {*} ctx
     * @param {*} displayColumns
     */
    paintHeader (ctx, displayColumns) {
      const {width, paintHeadWord, toolbarHeight, originPoint, blodFont} = this;
      ctx.fillStyle = tableColor[this.theme].headFillColor;
      ctx.fillRect(0, toolbarHeight, width, originPoint.y);
      ctx.beginPath();
      ctx.strokeStyle = tableColor[this.theme].borderColor;
      ctx.font = blodFont;
      ctx.lineWidth = this.lineWidth;
      const newArr = this.getHeaderTree(JSON.parse(JSON.stringify(displayColumns)), {fixed: false});
      for (const column of newArr) {
        if (!column.fixed) {
          ctx.fillStyle = tableColor[this.theme].headerColor;
          paintHeadWord(column, ctx);
        }
      }
      ctx.stroke();
    },
    /**
     * 绘制固定列
     * @param {*} ctx
     * @param {*} displayFixedCells
     * @param {*} displayColumns
     */
    paintFixedCells (ctx, displayFixedCells, displayColumns) {
      const {bodyHeight, rowHeight, maxPoint, paintText, p, i, allColumns, fixedColumns, toolbarHeight, Hierarchy, paintHeadWord, blodFont, normalFont, lineWidth, paintUnderline} = this;
      const lastDisplayColumn = displayColumns[displayColumns.length - 1];
      const newArr = this.getHeaderTree(JSON.parse(JSON.stringify(fixedColumns)));
      if (lastDisplayColumn.cellIndex === allColumns.length - 1 - fixedColumns.length) {
        if (lastDisplayColumn.x + lastDisplayColumn.width > maxPoint.x) {
          ctx.shadowColor = tableColor[this.theme].shadowColor;
        }
      } else {
        ctx.shadowColor = tableColor[this.theme].shadowColor;
      }
      ctx.fillStyle = tableColor[this.theme].white;
      ctx.fillRect(p(0 - 1), p(toolbarHeight), i(this.fixedColumnsWidth + 1), i(bodyHeight));
      ctx.restore();
      // let lineWidth = this.lineWidth;

      let cellX = 0;
      let cellX2 = 0;
      for (const rows of displayFixedCells) {
        let width = 0;
        for (const item of rows) {
          width = item.width;
          ctx.beginPath();
          ctx.fillStyle = tableColor[this.theme].stripeColor;
          ctx.lineWidth = lineWidth;
          ctx.font = normalFont;
          if (item.rowIndex % 2 === 1) {
            if (item.key === item.rowData.stripe) {
              ctx.fillRect(i(cellX2 + (lineWidth * this.dpr)), i(item.y + (lineWidth * this.dpr)), (this.fixedColumnsWidth - cellX2), i(item.height - (lineWidth * this.dpr)));
            } else if (~item.key.indexOf('lishide')) {
              ctx.fillRect(i(cellX2 + (lineWidth * this.dpr)), i(item.y + (lineWidth * this.dpr)), (this.fixedColumnsWidth - cellX2), i(item.height - (lineWidth * this.dpr)));
            }
          }
          ctx.stroke();
        }
        cellX2 += width;
      }
      for (const rows of displayFixedCells) {
        let width = 0;
        // console.log(rows);
        for (const item of rows) {
          width = item.width;
          ctx.beginPath();
          //   // ctx.fillStyle = tableColor[this.theme].stripeColor;
          // ctx.fillStyle = '#666111';
          ctx.lineWidth = lineWidth;
          ctx.font = normalFont;
          //   if (item.rowIndex % 2 === 1) {
          //     if (item.key === item.rowData.stripe) {
          //       ctx.fillRect(i(cellX + (lineWidth * this.dpr)), i(item.y + (lineWidth * this.dpr)), (this.fixedColumnsWidth - cellX), i(item.height - (lineWidth * this.dpr)));
          //     } else if (~item.key.indexOf('lishide')) {
          //       ctx.fillRect(i(cellX + (lineWidth * this.dpr)), i(item.y + (lineWidth * this.dpr)), (this.fixedColumnsWidth - cellX), i(item.height - (lineWidth * this.dpr)));
          //     }
          //   }
          //   ctx.stroke();

          ctx.fillStyle = tableColor[this.theme].textColor;
          ctx.strokeStyle = tableColor[this.theme].borderColor;
          ctx.lineWidth = lineWidth;
          ctx.moveTo(p(cellX + width), p(item.y));
          ctx.lineTo(p(cellX + width), p(item.y + item.height));
          ctx.lineTo(p(cellX), p(item.y + item.height));
          ctx.stroke();

          ctx.fillStyle = tableColor[this.theme].textColor;
          ctx.strokeStyle = tableColor[this.theme].borderColor;
          ctx.lineWidth = lineWidth;
          if (item.content === 'dontPaintX') {
            ctx.beginPath();
            ctx.strokeStyle = tableColor[this.theme].white;
            ctx.lineWidth = 3 * this.dpr;
            ctx.moveTo(i(cellX + (cellX ? lineWidth : 0)), i(item.y));
            ctx.lineTo(i(cellX + width), i(item.y));
            ctx.stroke();
          } else if (item.content === 'dontPaintY') {
            ctx.beginPath();
            ctx.strokeStyle = tableColor[this.theme].TotleColor;
            ctx.lineWidth = 6 * this.dpr;
            ctx.moveTo(i(cellX + lineWidth), i(item.y + lineWidth));
            ctx.lineTo(i(cellX + lineWidth), i((item.y + item.height) - lineWidth));
            ctx.stroke();
          } else if (item.paintText && item.paintText.length > 0) {
            ctx.beginPath();
            ctx.fillStyle = tableColor[this.theme].TotleColor;
            ctx.strokeStyle = tableColor[this.theme].TotleColor;
            for (const key in item.rowData) {
              if (item.rowData[key] === '小计' || item.rowData[key] === '列总计') {
                if (item.content !== 'dontPaintX') {
                  ctx.fillRect(i(cellX + lineWidth), i(item.y + lineWidth), (this.fixedColumnsWidth - cellX), i(item.height - lineWidth));
                  if (cellX < 0) {
                    ctx.fillRect(i(cellX + lineWidth), i(item.y + lineWidth), (this.fixedColumnsWidth), i(item.height - lineWidth));
                  }
                }
              } else if (item.key === 'totalLine') {
                ctx.fillRect(i(cellX + lineWidth), i(item.y + lineWidth), (this.fixedColumnsWidth), i(item.height - lineWidth));
              }
            }
            ctx.stroke();
            ctx.beginPath();

            ctx.fillStyle = tableColor[this.theme].bodyColor;
            ctx.lineWidth = lineWidth;
            ctx.font = normalFont;
            if (item.isX) {
              ctx.textAlign = 'start';
              paintText(ctx, i(cellX + 16 * this.dpr), i(16 * this.dpr + item.y), item.paintText, this.dpr);
            } else {
              ctx.textAlign = 'end';
              paintText(ctx, i(cellX + (width - 20 * this.dpr)), i(16 * this.dpr + item.y), item.paintText, this.dpr);
            }
            ctx.stroke();
            if (item.canJump) {
              ctx.beginPath();
              ctx.strokeStyle = tableColor[this.theme].headerColor;
              ctx.lineWidth = 1 * this.dpr;
              paintUnderline(ctx, this.dpr, item, cellX);
              ctx.stroke();
            }
            // 表格横线
          }
          ctx.fillStyle = tableColor[this.theme].textColor;
          ctx.strokeStyle = tableColor[this.theme].borderColor;
          ctx.lineWidth = lineWidth;
        }
        cellX += width;
      }

      ctx.beginPath();
      ctx.font = blodFont;
      ctx.fillStyle = tableColor[this.theme].headFillColor;
      ctx.fillRect(0, 0, this.fixedColumnsWidth, (Hierarchy + 1) * rowHeight);
      ctx.stroke();
      ctx.textAlign = 'center';
      for (const column of newArr) {
        ctx.beginPath();

        ctx.fillStyle = tableColor[this.theme].headerColor;
        paintHeadWord(column, ctx);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.strokeStyle = tableColor[this.theme].borderColor;
      ctx.lineWidth = lineWidth;

      ctx.moveTo(p(this.fixedColumnsWidth), p(0));
      ctx.lineTo(p(this.fixedColumnsWidth), p(this.bodyHeight));
      ctx.stroke();
    },
    /**
     * 绘制滚动条
     * @param {*} ctx
     * @param {*} height
     */
    painScroller (ctx, height) {
      let lineWidth = this.lineWidth;
      const p = this.p;
      ctx.fillStyle = tableColor[this.theme].white;
      ctx.fillRect((this.width - height) + lineWidth, 0, height - lineWidth, this.height);
      ctx.fillRect(0, (this.height - height) + lineWidth, this.width, height - lineWidth);
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = tableColor[this.theme].borderColor;
      ctx.moveTo(p((this.width - height) + lineWidth), p(0));
      ctx.lineTo(p((this.width - height) + lineWidth), p((this.height - height) + lineWidth));
      ctx.lineTo(p(0), p((this.height - height) + lineWidth));
      ctx.fillStyle = tableColor[this.theme].white;
      ctx.fillRect(p((this.width - height) + lineWidth), p((this.height - height) + lineWidth), height - lineWidth, height - lineWidth);
      ctx.stroke();
    },
    /**
     * 绘制头部分层
     */

    paintHeadWord (col, ctx) {
      const {paintHeadWord, rowHeight, p, stringsIcon, naturalOrder, DescendingIcon, unfixedIcon, fixedIcon, dpr} = this;
      let sortIcon = naturalOrder;
      const fixedIc = col.fixedIcon ? fixedIcon : unfixedIcon;
      if (col.isSort === 1) {
        sortIcon = DescendingIcon;
      } else if (col.isSort === 2) {
        sortIcon = stringsIcon;
      }
      if (!col.isX) {
        ctx.fillText(col.title, p(col.x + (col.width / 2)), p((col.i * rowHeight) + (rowHeight / 2)));
        ctx.moveTo(p(col.x + col.width), p(rowHeight * col.i));
        ctx.lineTo(p(col.x + col.width), p(rowHeight * (col.i + 1)));
        ctx.moveTo(p(col.x), p(rowHeight * (col.i + 1)));
        ctx.lineTo(p(col.x + col.width), p(rowHeight * (col.i + 1)));
        if (col.child && col.child.length > 0) {
          col.child.forEach((element) => {
            paintHeadWord(element, ctx);
          });
        } else {
          if (col.isSort === 1 || col.isSort === 2) {
            ctx.drawImage(sortIcon, p((col.x + (col.width / 2 + ctx.measureText(col.title).width / 2))), p((col.i * rowHeight) + (6 * dpr)), (20 * dpr), (20 * dpr));
          }
          if (col.fixedIcon) {
            ctx.drawImage(fixedIc, p((col.x + col.width) - (25 * dpr)), p((col.i * rowHeight) + (6 * dpr)), (20 * dpr), (20 * dpr));
          }
          if (col.isShowIcon) {
            ctx.drawImage(sortIcon, p((col.x + (col.width / 2 + ctx.measureText(col.title).width / 2))), p((col.i * rowHeight) + (6 * dpr)), (20 * dpr), (20 * dpr));
            ctx.drawImage(fixedIc, p((col.x + col.width) - (25 * dpr)), p((col.i * rowHeight) + (6 * dpr)), (20 * dpr), (20 * dpr));
          }
        }
      } else {
        ctx.fillText(col.title, p(col.x + (col.width / 2)), p((col.i + 1) * (rowHeight / 2)));
        ctx.moveTo(p(col.x + col.width), p(0));
        ctx.lineTo(p(col.x + col.width), p(rowHeight * (col.i + 1)));
        ctx.moveTo(p(col.x), p(rowHeight * (col.i + 1)));
        ctx.lineTo(p(col.x + col.width), p(rowHeight * (col.i + 1)));
        if (col.child && col.child.length > 0) {
          col.child.forEach((element) => {
            paintHeadWord(element, ctx);
          });
        } else {
          if (col.isSort === 1 || col.isSort === 2) {
            ctx.drawImage(sortIcon, p(col.x + (col.width / 2 + ctx.measureText(col.title).width / 2)), p(((col.i) * (rowHeight / 2)) + (5 * dpr)), (20 * dpr), (20 * dpr));
          }
          if (col.fixedIcon) {
            ctx.drawImage(fixedIc, p(col.x + col.width - (25 * dpr)), p(((col.i) * (rowHeight / 2)) + (5 * dpr)), (20 * dpr), (20 * dpr));
          }
          if (col.isShowIcon) {
            ctx.drawImage(sortIcon, p(col.x + (col.width / 2 + ctx.measureText(col.title).width / 2)), p(((col.i) * (rowHeight / 2)) + (5 * dpr)), (20 * dpr), (20 * dpr));
            ctx.drawImage(fixedIc, p((col.x + col.width) - (25 * dpr)), p(((col.i) * (rowHeight / 2)) + (5 * dpr)), (20 * dpr), (20 * dpr));
          }
        }
      }
    },

    /**
     * 随机数取 小数 .5 (解决canvas绘制1px线出现模糊)
     * @param {number} value
     */
    p (value) {
      const temp = `${value}`;
      if (temp && temp.indexOf && temp.indexOf('.') === -1) {
        return value + 0.5;
      }
      return value;
    },
    /**
     * 小数取整
     * @param {number} value
     */
    i (value) {
      return Math.round(value);
    }
  }
};
