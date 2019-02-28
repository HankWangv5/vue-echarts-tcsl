交叉表
|
|-- Example.vue:整理数据成交叉表所需要的数据结构
|
|-- index.vue：交叉表入口，绘制canvas，滚动条，执行交叉表创建函数，根据配置生成对应数据及引用拆分的js。
|-- calculate.js：交叉表计算宽高，计算canvas宽高，计算滚动条大小，计算各种坐标，生成需要绘制的数据，和交叉表窗口内需要绘制的数据
|-- event.js：为交叉表添加mousedown、mousemove、mouseup、resize、mousewheel、click、mousemove的事件
|-- painted.js：交叉表绘制函数，根据calculate生成的数据，按坐标从交叉表背景，头部，主题，文字，渲染，绘制，
|-- scroller.js：生成滚动条，和滚动条事件函数
|-- utils.js：工具方法
|--|


调用Example传入配置项以及接口数据，调用setChartData方法，监听chartData等各种变化数据调用setChartData重新生成图表，setChartData整理数据成交叉表所用通用数据，然后调用index.vue里面
setOption传入配置项及刚刚生成的交叉表数据，index.vue的mounted生命周期注册事件initEvent（），setOption（）根据配置项生成小计总计或者合并单元格数据整理，调用initCanvas（）函数，里面
调用setbodyWidth（），clearAllCells（）清楚上一次生成图标的数据，setAllCells（），setBodyHeight（），initSize（），setMaxpoint（），resetScrollBar（），生成cavnas各种宽高大小临界点，
initSize函数调用rePainted函数开始绘制，initDisplayItems()函数生成要绘画的各种数据，经painted函数开始绘制
    this.paintBGColor(ctx);
    this.paintBGC(ctx, displayCells);
    this.paintLine(ctx, displayRows, displayColumns);
    this.paintBody(ctx, displayCells);
    ctx.textAlign = 'center';
    this.paintHeader(ctx, displayColumns);
    if (displayFixedCells.length > 0 && this.fillWidth === 0) {
       this.paintFixedCells(ctx, displayFixedCells, displayColumns);
    }
    this.painScroller(ctx, this.scrollerWidth);

    逐步完成绘制，
   initDisplayItems () {  //函数计算出当时canvas视图大小能看到的数据，根据滚动条位置及canvas宽高和body最大宽高，
      const displayColumns = this.getDisplayColumns();
      const displayRows = this.getDisplayRows();
      const displayCells = this.getDisplayCells(displayRows, displayColumns);
      const displayFixedCells = this.getDisplayFixedCells(displayRows);
      const displayLayeredColumns = this.getHeaderTree(JSON.parse(JSON.stringify(displayColumns)));
      return {displayColumns, displayRows, displayCells, displayFixedCells, displayLayeredColumns};
    },
getAllCells函数计算出所有数据宽高起始想x、y坐标，供initDisplayItems函数计算视图内数据使用。