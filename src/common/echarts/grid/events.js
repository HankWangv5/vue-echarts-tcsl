import throttle from 'throttle-debounce/throttle';

export default {
  data () {
    return {
      rowFocus: null,
      isFirefox: false,
      ishandleMouseOver: null,
      throttleHandleResize: null,
      throttleHandleMousemove: null,
      activeBodyColumn: null
    };
  },
  created () {
    this.isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  },
  watch: {
    retract () {
      this.handleResize();
    }
  },
  mounted () {
  },
  methods: {
    /**
     * 移除全局事件方法
     */
    removeEvent () {
      window.removeEventListener('mouseup', this.handleMouseup, false);
      window.removeEventListener('resize', this.handleResize, false);
    },
    /**
     * 注册事件
     */
    initEvent () {
      this.$refs.reference.addEventListener('mousedown', this.handleMousedown, false);
      this.$refs.reference.addEventListener('mousemove', throttle(16, this.handleMousemove), true);
      window.addEventListener('mouseup', this.handleMouseup, false);
      window.addEventListener('resize', this.handleResize, false);
      this.$refs.canvas.addEventListener(this.isFirefox ? 'DOMMouseScroll' : 'mousewheel', throttle(16, this.handleWheel));
      this.$refs.canvas.addEventListener('click', this.handleClick, false);
      this.$refs.canvas.addEventListener('mousemove', throttle(16, this.handleMouseOver), false);
    },
    handleMousedown () {
      this.isDown = true;
    },
    handleMouseOver (evt) {
      evt.stopPropagation();
      const x = evt.offsetX * this.dpr;
      const y = evt.offsetY * this.dpr;
      let headColumn = null;
      let bodyColumn = null;
      if (x > this.fixedColumnsWidth) {
        headColumn = this.getHeadWord(x, y, this.displayColumns);
        bodyColumn = this.getDrillObj(x, y, this.displayCells);
      } else {
        headColumn = this.getHeadWord(x, y, this.displayColumns);
        bodyColumn = this.getDrillObj(x, y, this.displayallFixedCells);
      }
      if (headColumn) {
        this.allColumns = this.allColumns.map((v) => {
          if (v.key === headColumn.key) {
            v.isShowIcon = true;
          } else {
            v.isShowIcon = false;
          }
          return v;
        });
        this.fixedColumns = this.fixedColumns.map((v) => {
          if (v.key === headColumn.key) {
            v.isShowIcon = true;
          } else {
            v.isShowIcon = false;
          }
          return v;
        });
        // this.getAllCells(this.data, this.columns)
        window.requestAnimationFrame(this.rePainted);
      } else {
        this.allColumns = this.allColumns.map((v) => {
          v.isShowIcon = false;
          return v;
        });
        this.fixedColumns = this.fixedColumns.map((v) => {
          v.isShowIcon = false;
          return v;
        });
        // this.getAllCells(this.data, this.columns)
        window.requestAnimationFrame(this.rePainted);
      }
      // this.activeBodyColumn = null;
      if (this.$refs.canvas.style.cursor === 'pointer') {
        this.$refs.canvas.style.cursor = 'Default';
      }
      if (bodyColumn && bodyColumn.canJump) {
        if (bodyColumn.content !== '小计' && bodyColumn.content !== '列总计' && bodyColumn.content !== 'dontPaintX' && bodyColumn.content !== 'dontPaintY') {
          // this.activeBodyColumn = bodyColumn;
          this.$refs.canvas.style.cursor = 'pointer';
        }
      }
    },
    handleResize () {
      if (this.throttleHandleResize) {
        clearInterval(this.throttleHandleResize);
      }
      this.throttleHandleResize = setTimeout(() => {
        this.offset.y = 0;
        this.offset.x = 0;
        this.horizontalBar.x = 0;
        this.selectArea = null;
        this.isSelect = false;
        this.columns = this.columns.map((v) => {
          v.fixed = false;
          v.fixedIcon = false;
          return v;
        });
        this.setOption(this.option);
        this.throttleHandleResize = null;
      }, 500);
    },
    handleWheel (e) {
      if (e.target.tagName === 'CANVAS') {
        if (!this.isEditing) {
          const {deltaX, deltaY} = e;
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            const lastScrollX = this.offset.x;
            let maxWidth = 0;
            if (this.fillWidth > 0) {
              maxWidth = this.maxPoint.x;
            } else {
              maxWidth = this.maxPoint.x + this.fixedWidth;
            }
            if (this.offset.x - deltaX > 0) {
              this.offset.x = 0;
            } else if ((this.bodyWidth - maxWidth) + this.offset.x < deltaX) {
              this.offset.x = maxWidth - this.bodyWidth;
              if (maxWidth - this.bodyWidth < 0) {
                this.offset.x = maxWidth - this.bodyWidth;
              } else {
                e.preventDefault();
                e.returnValue = false;
              }
            } else {
              e.preventDefault();
              e.returnValue = false;
              this.offset.x -= deltaX;
            }
            if (lastScrollX !== this.offset.x) {
              requestAnimationFrame(this.rePainted);
              this.$emit('scroll');
            }
          } else {
            const lastScrollY = this.offset.y;
            if (lastScrollY - deltaY > 0) {
              this.offset.y = 0;
            } else if ((this.bodyHeight - this.maxPoint.y) + lastScrollY < deltaY) {
              if (this.maxPoint.y - this.bodyHeight < 0) {
                this.offset.y = this.maxPoint.y - this.bodyHeight;
                // this.setAllCells(this.data.length);
              } else {
                e.preventDefault();
                e.returnValue = true;
              }
            } else {
              // e.preventDefault();
              e.returnValue = false;
              this.offset.y -= deltaY;
            }
            if (lastScrollY !== this.offset.y) {
              if (this.verticalBar.y + this.verticalBar.size > this.height * 0.8) {
                this.setAllCells(this.data.length);
              }
              requestAnimationFrame(this.rePainted);
              this.$emit('scroll');
            }
          }
        }
      }
    },
    handleMousemove (evt) {
      evt.stopPropagation();
      if (this.verticalBar.move) {
        const height = this.maxPoint.y - this.verticalBar.size;
        const moveHeight = this.verticalBar.y + (evt.screenY - this.verticalBar.cursorY);
        if (moveHeight > 0 && moveHeight < height) {
          this.verticalBar.y += (evt.screenY - this.verticalBar.cursorY) * this.dpr;
        } else if (moveHeight <= 0) {
          this.verticalBar.y = 0;
        } else {
          this.verticalBar.y = height;
        }
        this.verticalBar.cursorY = evt.screenY;
        this.offset.y = -this.verticalBar.y / this.verticalBar.k;
        if (this.verticalBar.y + this.verticalBar.size > this.height * 0.9) {
          this.setAllCells(this.data.length);
        }
        requestAnimationFrame(this.rePainted);
      }
      if (this.horizontalBar.move) {
        let width = 0;
        if (this.fillWidth > 0) {
          width = this.maxPoint.x - this.horizontalBar.size;
        } else {
          width = (this.maxPoint.x + this.fixedWidth) - this.horizontalBar.size;
        }
        const moveWidth = this.horizontalBar.x + (evt.screenX - this.horizontalBar.cursorX);
        if (moveWidth > 0 && moveWidth < width) {
          this.horizontalBar.x += (evt.screenX - this.horizontalBar.cursorX) * this.dpr;
        } else if (moveWidth <= 0) {
          this.horizontalBar.x = 0;
        } else {
          this.horizontalBar.x = width;
        }
        this.horizontalBar.cursorX = evt.screenX;
        this.offset.x = -this.horizontalBar.x / this.horizontalBar.k;
        requestAnimationFrame(this.rePainted);
        // this.rePainted()
      }
    },
    handleMouseup () {
      this.isDown = false;
      this.horizontalBar.move = false;
      this.verticalBar.move = false;
    },
    handleClick (evt) {
      evt.stopPropagation();
      if (!this.isSelect) {
        const x = evt.offsetX * this.dpr;
        const y = evt.offsetY * this.dpr;
        let headSortIcon = null;
        if (x > this.fixedColumnsWidth) {
          headSortIcon = this.getSortHeadIcon(x, y, this.displayColumns, 20 * this.dpr, 25 * this.dpr);
        } else {
          headSortIcon = this.getSortHeadIcon(x, y, this.fixedColumns, 20 * this.dpr, 25 * this.dpr);
        }
        if (headSortIcon) {
          this.columns = this.columns.map((v) => {
            if (v.key === headSortIcon.key) {
              if (!v.isSort) {
                v.isSort = 1;
                headSortIcon.isSort = 1;
              } else if (v.isSort === 1) {
                v.isSort = 2;
                headSortIcon.isSort = 2;
              } else if (v.isSort === 2) {
                v.isSort = 1;
                headSortIcon.isSort = 1;
              }
            } else {
              v.isSort = 0;
            }
            return v;
          });
          typeof (this.oneOption.sortCallback) === 'function' && this.oneOption.sortCallback(headSortIcon);
        }
        let headFixedIcon = null;
        if (x > this.fixedColumnsWidth) {
          headFixedIcon = this.getFixedHeadIcon(x, y, this.displayColumns, 25 * this.dpr, 25 * this.dpr);
        } else {
          headFixedIcon = this.getFixedHeadIcon(x, y, this.fixedColumns, 25 * this.dpr, 25 * this.dpr);
        }
        if (headFixedIcon && this.horizontalBar.size > 0) {
          const index = this.columns.findIndex(v => v.key === headFixedIcon.key);
          if (this.columns[index].fixedIcon) {
            this.columns = this.columns.map((v) => {
              v.fixed = false;
              v.fixedIcon = false;
              return v;
            });
          } else {
            this.columns = this.columns.map((v, i) => {
              v.fixedIcon = false;
              v.fixed = false;
              if (!(i > index)) {
                v.fixed = true;
              }
              return v;
            });
            this.columns[index].fixedIcon = true;
          }
          this.setOption(this.option);
        }
        let drillObj = null;
        if (x > this.fixedColumnsWidth) {
          drillObj = this.getDrillObj(x, y, this.displayCells);
        } else {
          drillObj = this.getDrillObj(x, y, this.displayallFixedCells);
        }
        if (drillObj && drillObj.canJump) {
          this.$emit('drill', {demensionId: drillObj.key, value: drillObj.content});
        }
      }
    }
  }
};
