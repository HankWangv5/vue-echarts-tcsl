export default {
  data () {
    let dpr = window.devicePixelRatio || 1;
    const rowHeight = 30 * dpr;
    const serialWidth = 0;
    const checkboxWidth = 30 * dpr;
    const scrollerWidth = 16 * dpr;
    const height = 0;
    let originPointX = serialWidth;
    if (this.showCheckbox) {
      originPointX += checkboxWidth;
    }
    const toolbarHeight = 0;
    return {
      dpr: window.devicePixelRatio || 1,
      width: 0,
      height,
      rowHeight,
      scrollerWidth,
      fixedWidth: 0,
      fixedColumnsWidth: 0,
      bodyWidth: 0,
      bodyHeight: 0,
      serialWidth,
      checkboxWidth: 30 * dpr,
      fillWidth: 0,
      toolbarHeight,

      allCells: [],
      displayCells: [],
      allRows: [],
      displayRows: [],
      allColumns: [],
      displayColumns: [],
      displayLayeredColumns: [],
      allFixedCells: [],
      displayallFixedCells: [],
      fixedColumns: [],

      Hierarchy: 0,
      offset: {
        x: 0,
        y: 0
      },
      originPoint: {
        x: originPointX,
        y: rowHeight
      },
      maxPoint: {
        x: 0,
        y: height - scrollerWidth
      }
    };
  },
  methods: {
    /**
     * 获取所有数据单元格，首次渲染调用一次（较耗时）
     * @param {*} value
     * @param {*} columns
     */
    calculationWidth (arr) {
      // debugger;
      let {ctx} = this;
      return arr.map((v) => {
        if (typeof v === 'string') {
          return this.i((ctx.measureText(v).width)) + (100 * this.dpr);
        }
        return 100 * this.dpr;
      }).sort((a, b) => b - a)[0] || 100;
    },
    setbodyWidth () {
      this.width = (this.$refs.grid.offsetWidth - 2) * this.dpr;
      this.height = (this.$refs.grid.offsetHeight - 2) * this.dpr;
      this.maxPoint.y = this.height - this.scrollerWidth;

      this.bodyWidth = this.originPoint.x;
      for (const column of this.columns) {
        this.bodyWidth += this.calculationWidth(column.compare_names);
      }
      this.fillWidth = 0;
      if (this.bodyWidth < this.width - this.scrollerWidth) {
        this.fillWidth = this.columns.length ? (this.width - this.bodyWidth - this.scrollerWidth) / this.columns.length : 0;
        this.bodyWidth = this.width - this.scrollerWidth;
      }
    },
    clearAllCells () {
      this.data = [];
      this.allCells = [];
      this.allRows = [];
      this.allColumns = [];
      this.allFixedCells = [];
      this.fixedColumns = [];
    },
    getAllCells (value, columns, startIndex) {
      console.log(value);

      this.fixedWidth = 0;
      const {rowHeight, ctx, getTextLine, allRows, allCells, allColumns, fixedColumns} = this;
      let rowIndex = startIndex;
      for (let i = startIndex; i < value.length; i += 1) {
        let item = value[i];
        let maxHeight = rowHeight;
        let cellIndex = 0;
        const cellTemp = [];
        let startX = 0;
        for (const column of columns) {
          if (rowIndex === 0) {
            if (column.fixed) {
              fixedColumns.push({
                cellIndex,
                ...column,
                x: startX,
                checked: true,
                canJump: column.canJump,
                fieldId: column.fieldId
              });
              allColumns.push({
                height: rowHeight,
                cellIndex,
                ...column,
                checked: true,
                fieldId: column.fieldId,
                canJump: column.canJump
              });
              startX += column.width;
            } else {
              allColumns.push({
                height: rowHeight,
                cellIndex,
                ...column,
                checked: true,
                canJump: column.canJump,
                fieldId: column.fieldId
              });
            }
          }
          let text = item[column.key];
          let textLine;
          if (text || text === 0) {
            textLine = getTextLine(ctx, text, column.width, column);
            let textLineCount = 0;
            if (textLine) {
              textLineCount = textLine.length;
            }
            if (textLineCount > 1) {
              if (maxHeight < rowHeight + ((textLineCount - 1) * 18 * this.dpr)) {
                maxHeight = rowHeight + ((textLineCount - 1) * 18 * this.dpr);
              }
            }
          }

          if (column.fixed) {
            cellTemp.push({
              width: column.width,
              content: item[column.key],
              key: column.key,
              rowIndex,
              cellIndex,
              paintText: textLine,
              fixed: column.fixed === true,
              renderText: column.renderText,
              rowData: item,
              pres: column.pres,
              type: column.type,
              isX: column.isX
            });
          } else {
            cellTemp.push({
              width: column.width,
              content: item[column.key],
              key: column.key,
              rowIndex,
              cellIndex,
              paintText: textLine,
              fixed: column.fixed === true,
              renderText: column.renderText,
              rowData: item,
              pres: column.pres,
              type: column.type,
              isX: column.isX
            });
          }

          cellIndex += 1;
        }
        this.Hierarchy = Math.max(...allColumns.map(v => v.compare_names.length)) - 1;
        allCells.push(cellTemp);
        // console.log(cellTemp);
        allRows.push({
          height: maxHeight,
          rowIndex
        });
        rowIndex += 1;
      }
      this.originPoint.y = ((Math.max(...allColumns.map(v => v.compare_names.length))) * rowHeight);
      this.allFixedCells = [];
      if (this.allFixedCells.length === 0) {
        for (const item of fixedColumns) {
          const temp = [];
          let index = 0;
          for (const row of allCells) {
            const cell = row[item.cellIndex];
            // console.log(cell.width);
            temp.push({
              ...cell,
              height: allRows[index].height,
              canJump: item.canJump,
              x: item.x
            });
            index += 1;
          }
          this.allFixedCells.push(temp);
        }
      }
      this.fixedColumnsWidth = this.getHeaderTree(JSON.parse(JSON.stringify(fixedColumns))).reduce((p, e) => p + e.width, 0);
    },
    initSize () {
      if (this.$refs.grid) {
        this.width = (this.$refs.grid.offsetWidth - 2) * this.dpr;
        this.height = (this.$refs.grid.offsetHeight - 2) * this.dpr;

        this.originPoint.x = this.serialWidth;

        this.bodyWidth = this.originPoint.x;
        let columnCount = 0;
        for (const column of this.allColumns) {
          this.bodyWidth += this.calculationWidth(column.compare_names);
          columnCount += 1;
        }
        // 填充宽度
        this.fillWidth = 0;
        if (this.bodyWidth < this.width - this.scrollerWidth) {
          this.fillWidth = columnCount ? (this.width - this.bodyWidth - this.scrollerWidth) / columnCount : 0;
          this.bodyWidth = this.width - this.scrollerWidth;
        }
        this.setBodyHeight(this.allRows, this.originPoint);
        this.setMaxpoint(this.width, this.height, this.scrollerWidth);
        this.resetScrollBar(this.maxPoint, this.bodyWidth, this.bodyHeight, this.fixedWidth);
        requestAnimationFrame(this.rePainted);
      }
    },
    setBodyHeight (allRows, {y}) {
      this.bodyHeight = y + this.toolbarHeight;
      for (const row of allRows) {
        this.bodyHeight += row.height;
      }
    },
    setMaxpoint (width, height, scrollerWidth) {
      this.maxPoint.x = width - scrollerWidth;
      this.maxPoint.y = height - scrollerWidth;
    },
    setAllCells (startIndex, first = false) {
      let loadNum = 40;
      let maxCeLL = this.allData[0] ? Object.keys(this.allData[0]).length : 0;
      if (this.allData.length > 200 && maxCeLL < 500 && !first) {
        loadNum = 25;
      } else if (maxCeLL > 500 && !first) {
        loadNum = 10;
      }
      // console.log(loadNum);
      let maxIndex = startIndex + loadNum > this.allData.length ? this.allData.length : startIndex + loadNum;
      for (let i = startIndex; i < maxIndex; i += 1) {
        let item = this.allData[i];
        this.data.push(item);
      }
      if (first) {
        this.columns.forEach((v) => {
          v.width = this.calculationWidth(v.compare_names);
        });
      }
      this.getAllCells(this.data, this.columns, startIndex);
      this.setBodyHeight(this.allRows, this.originPoint);
      this.resetScrollBar(this.maxPoint, this.bodyWidth, this.bodyHeight, this.fixedWidth);
    },
    getHeaderTree (arr, option = {fixed: true}) {
      // 这个方法优化的地方是把递归放入内层   把现有递归里面的判断提取出来
      // 这点地方看的懂看不懂就看缘分吧    也别强行琢磨   我也不太懂
      //  反正就是交叉表表头部分
      if (!this.Hierarchy) {
        return arr.map((v) => {
          v.i = this.Hierarchy;
          return v;
        });
      }
      const headerTree = [];
      const headerTreeIsX = [];
      if (!option.fixed) {
        arr = arr.filter(v => !v.fixed);
      }
      arr.forEach((v, i) => {
        v.i = this.Hierarchy;
        let isFirst = true;
        let num = headerTree.length;
        if (v.isX) {
          v.child = [];
          headerTreeIsX.push(v);
          return;
        }
        for (const ii in headerTree) {
          if (headerTree[ii] && headerTree[ii].title === v.compare_names[0] && !headerTree[ii].isX && (headerTree[ii].index + 1 === i)) {
            isFirst = false;
            num = ii;
          }
        }
        if (!isFirst) {
          headerTree[num].width += v.width;
          v.compare_names = v.compare_names.slice(1);
          headerTree[num].i = this.Hierarchy - v.compare_names.length;
          headerTree[num].y = (this.Hierarchy - v.compare_names.length) * this.rowHeight;
          headerTree[num].height = this.rowHeight;
          const obj = {
            width: v.width,
            x: v.x,
            child: [],
            compare_names: v.compare_names,
            i: this.Hierarchy,
            ...v
          };
          headerTree[num].child.push(obj);
          headerTree[num].index = i;
        } else {
          headerTree[num] = {
            width: v.width,
            x: v.x,
            child: [],
            title: v.compare_names[0],
            compare_names: v.compare_names,
            i: (this.Hierarchy - v.compare_names.length) + 1,
            y: ((this.Hierarchy - v.compare_names.length) + 1) * this.rowHeight,
            height: this.rowHeight,
            index: i
          };

          if (v.compare_names.slice(1).length >= 1) {
            headerTree[num].child = [v];
            headerTree[num].child[0].compare_names = v.compare_names.slice(1);
          }
        }
      });
      headerTree.forEach((e) => {
        if (e.child[0] && e.child[0].compare_names.length > 1) {
          e.child = this.getHeaderTree(e.child);
        }
      });
      return [...headerTreeIsX, ...headerTree];
    },
    /**
     * 初始化显示行列
     */
    initDisplayItems () {
      const displayColumns = this.getDisplayColumns();
      const displayRows = this.getDisplayRows();
      const displayCells = this.getDisplayCells(displayRows, displayColumns);
      const displayFixedCells = this.getDisplayFixedCells(displayRows);
      const displayLayeredColumns = this.getHeaderTree(JSON.parse(JSON.stringify(displayColumns)));
      return {displayColumns, displayRows, displayCells, displayFixedCells, displayLayeredColumns};
    },
    getDisplayColumns () {
      const {offset: {x}, originPoint, maxPoint, allColumns, fillWidth, getHeaderTree} = this;
      const temp = [];
      let startX = originPoint.x + x;
      // console.log(allColumns);
      for (const column of allColumns) {
        if (column.checked) {
          const width = column.width + fillWidth;
          if (width + startX > originPoint.x && startX < maxPoint.x) {
            const columnClone = Object.assign({}, column, {x: startX, width});
            temp.push(columnClone);
          }
          startX += width;
        }
      }
      setTimeout(() => {
        this.displayColumns = [...temp];
      }, 0);
      this.displayLayeredColumns = getHeaderTree(JSON.parse(JSON.stringify(this.displayColumns)));
      return temp;
    },
    getDisplayRows () {
      const {offset: {y}, originPoint, maxPoint, allRows, toolbarHeight} = this;
      const temp = [];
      let startY = originPoint.y + y + toolbarHeight;
      for (const row of allRows) {
        if (startY + row.height > originPoint.y + toolbarHeight &&
          startY < maxPoint.y) {
          const rowClone = Object.assign({}, row, {y: startY});
          temp.push(rowClone);
        } else if (startY >= maxPoint.y) {
          break;
        }
        startY += row.height;
      }
      setTimeout(() => {
        this.displayRows = [...temp];
      }, 0);
      return temp;
    },
    getDisplayCells (displayRows, displayColumns) {
      // window.console.log(displayRows, displayColumns)
      const temp = [];
      const {allCells, fillWidth} = this;
      for (const row of displayRows) {
        const cellTemp = [];
        for (const column of displayColumns) {
          // console.log(column);
          let cell = allCells[row.rowIndex][column.cellIndex];
          const cellClone = Object.assign({}, cell, {
            x: column.x,
            y: row.y,
            width: cell.width + fillWidth,
            height: row.height,
            canJump: column.canJump,
            fieldId: column.fieldId

          }); //eslint-disable-line
          if (cellClone.content === '小计' || cellClone.content === '列总计' || cellClone.content === 'dontPaintX' || cellClone.content === 'dontPaintY') {
            cellClone.canJump = false;
          }
          cellTemp.push(cellClone);
        }
        temp.push(cellTemp);
      }
      setTimeout(() => {
        this.displayCells = [...temp];
      }, 0);
      return temp;
    },
    getDisplayFixedCells (displayRows) {
      const temp = [];
      const {allFixedCells, fillWidth} = this;
      for (const fixedCell of allFixedCells) {
        const fixedCellTemp = [];
        for (const row of displayRows) {
          const fixed = fixedCell[row.rowIndex];
          const fixedCellClone = Object.assign({}, fixed, {
            y: row.y,
            x: fixed.x,
            width: fixed.width + fillWidth,
            height: row.height,
            canJump: fixed.canJump
          });
          if (fixedCellClone.content === '小计' || fixedCellClone.content === '列总计' || fixedCellClone.content === 'dontPaintX' || fixedCellClone.content === 'dontPaintY') {
            fixedCellClone.canJump = false;
          }
          fixedCellTemp.push(fixedCellClone);
        }
        temp.push(fixedCellTemp);
      }
      setTimeout(() => {
        this.displayallFixedCells = [...temp];
      }, 0);
      return temp;
    }
  },
  destroyed () {
    this.allCells = null;
    this.allColumns = null;
    this.allRows = null;
    this.displayCells = null;
    this.displayRows = null;
    this.displayColumns = null;
    this.displayLayeredColumns = null;
    this.allFixedCells = null;
    this.displayallFixedCells = null;
    this.fixedColumns = null;
    this.checkboxs = null;
    this.selected = null;
  }
};
