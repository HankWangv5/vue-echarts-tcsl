<template>
    <div :id="id" class="target-box" :style="{justifyContent: !option? 'center':'flex-start'}">
        <el-row>
            <el-col :span="column" v-for="(target, index) in targets" :key="index" class="target"
                    :style="{minHeight: as.height}">
                <div :class="!option ? 'el-col el-col-12 special-div':''">
                    <h4>{{target.compare}}</h4>
                    <div class="number-title" :style="{fontSize: as.num + 'px', lineHeight: (parseInt(as.num) + 4) + 'px'}">{{target.array[0].name}}</div>
                    <article :style="{fontSize: as.title, color: target.array[0].color === '#778899' ? (theme === 'purple' ? '#000' : '#fff') : target.array[0].color}">{{formatter(target.array[0].value, target.array[0].pres)}}
                    </article>
                    <div v-if="target.array[1]" :style="{fontSize: (parseInt(as.num) - 4) + 'px'}">
                        <span class="number-title">{{target.array[1].name}}&nbsp;</span><span
                            :style="{color: target.array[1].color === '#778899' ? (theme === 'purple' ? '#000' : '#fff') : target.array[1].color}">{{formatter(target.array[1].value, target.array[1].pres)}}</span>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {sliceArray, addingUnit, fmoney} from './common/common';
import {TARGET_COND_SET, ARRAY_MODE} from '@/common/chartConfigType.js';
import {mapGetters} from 'vuex';

export default {
  data () {
    return {
      targets: [],
      column: 6,
      as: {
        title: '',
        num: '',
        height: ''
      },
      option: '',
      layout: [200, 400, 600, 750, 900, 1100, 1300, 1500, 1700, 1900, 2100]
    };
  },
  props: {
    id: String,
    setting: Array,
    chartData: Object,
    oneOption: Object,
    chartInfo: Object
  },
  mounted () {
    this.resolveData();
    window.addEventListener('resize', this.resize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize);
    this.targets = null;
  },
  computed: {
    ...mapGetters({theme: 'theme'})
  },
  methods: {
    getColor () {
      let option = this.setting.find((set) => {
        return set.type === TARGET_COND_SET;
      });
      if (option.value.length !== 0) {
        if (this.targets) {
          this.targets.forEach((target) => {
            target.array.forEach((one) => {
              const num = parseFloat(one.value);
              const rules = option.value.find((rule) => {
                return rule.fieldName === one.name;
              });
              if (rules) {
                for (let rule of rules.value) {
                  const max = parseFloat(rule.max);
                  const min = parseFloat(rule.min);
                  switch (rule.compare) {
                    case 0:// 区间
                      if (num <= max && num >= min) {
                        one.color = rule.color;
                      }
                      break;
                    case 1:// 等于
                      if (num === min) {
                        one.color = rule.color;
                      }
                      break;
                    case 2:// 不等于
                      if (num !== min) {
                        one.color = rule.color;
                      }
                      break;
                    case 3:// 大于
                      if (num > min) {
                        one.color = rule.color;
                      }
                      break;
                    case 4:// 大于等于
                      if (num >= min) {
                        one.color = rule.color;
                      }
                      break;
                    case 5:// 小于
                      if (num < min) {
                        one.color = rule.color;
                      }
                      break;
                    case 6:// 小于等于
                      if (num <= min) {
                        one.color = rule.color;
                      }
                      break;
                  }
                }
              }
            });
          });
        }
      }
    },
    setLayout (index, height) {
      this.as = {
        title: 16 + (index * 3) + 'px',
        num: 4 + (index * 3),
        height: 50 + (index * 15) + 'px'
      };
      if (this.targets.length === 1) {
        this.as = {
          title: 50 + (index * 6) + 'px',
          num: 10 + (index * 4)
        };
        if (height < 200 && this.layout[index] >= 1100) {
          this.as = {
            title: '50px',
            num: 30
          };
        }
        if (height < 200 && this.layout[index] <= 600) {
          this.as = {
            title: 20 + (index * 6) + 'px',
            num: 10 + (index * 4)
          };
        }
      }
      return false;
    },
    resize () {
      const width = document.getElementById(this.id).offsetWidth;
      const height = document.getElementById(this.id).offsetHeight;
      for (let $index = 0; $index < this.layout.length; $index++) {
        if ($index === 0) {
          if (width < this.layout[$index]) {
            this.setLayout($index);
          }
        } else {
          if (width < this.layout[$index] && width >= this.layout[$index - 1]) {
            this.setLayout($index, height);
          }
        }
      }
    },
    resolveData () {
      let option = this.setting.find((option) => {
        return option.type === ARRAY_MODE;
      });
      this.option = option;
      if (this.option) {
        this.column = 24 / parseInt(option.value);
      } else {
        this.column = 24;
      }

      let _chartData = [];
      if (this.chartData && this.chartData.yaxis) {
        let yAxis = this.chartData.yaxis;
        if (this.chartInfo.compareCondition.length > 0) { // 有对比
          const indexLength = this.chartInfo.indexCondition.length;

          if (this.chartData.yaxis.length > 1) {
            const newArray = sliceArray(yAxis, this.chartData.yaxis.length / indexLength);
            let nana = [];
            newArray[0].forEach((array, $index) => {
              if (newArray[1]) {
                nana.push([array, newArray[1][$index]]);
              } else {
                nana.push([array]);
              }
            });
            nana.forEach((item) => {
              const array = item[0].name.split(':%');
              // let indexConditionName = array.shift();
              const compare = array.splice(1).join('/');// 删除第一个数值名称，留下所有维度名
              let value = [];
              item.forEach((i) => {
                const array = i.name.split(':%');
                const name = array[0];
                // 为对应数值设置添加单位
                let pres = null;
                // let nameList = yaxis[i].name.split(':%');
                this.chartInfo.reportParam.indexCondition.forEach((x) => {
                  let val;
                  if (x.fieldGroup === 6) {
                    val = `${x.aliasName}`;
                  } else {
                    val = `${x.aliasName}(${x.aggregatorName})`;
                  }
                  if (name === val) {
                    pres = x.numDisplayed;
                  }
                });
                // 为对应数值设置添加单位
                value.push({name: name, value: i.data[0], color: '#778899', pres});
              });
              _chartData.push({
                compare: compare,
                array: value,
                color: 'black'
              });
            });
          } else {
            const array = yAxis[0].name.split(':%');
            array.shift();
            const compare = array.join('/');// 删除第一个数值名称，留下所有维度名
            _chartData.push({
              compare: compare,
              array: [{
                name: yAxis[0].name.split(':%')[0],
                value: yAxis[0].data[0],
                color: '#778899',
                pres: this.chartInfo.reportParam.indexCondition[0].numDisplayed
              }],
              color: 'black'
            });
          }
        } else { // 无对比
          let value = [];
          yAxis.forEach((i) => {
            const name = i.name;
            let pres = null;
            this.chartInfo.reportParam.indexCondition.forEach((x) => {
              let val;
              if (x.fieldGroup === 6) {
                val = `${x.aliasName}`;
              } else {
                val = `${x.aliasName}(${x.aggregatorName})`;
              }
              if (name === val) {
                pres = x.numDisplayed;
              }
            });
            value.push({name: i.name, value: i.data[0], color: '#778899', pres});
          });
          _chartData.push({
            compare: '',
            array: value,
            color: 'black'
          });
        }
      }
      this.targets = _chartData;

      this.$nextTick(() => {
        this.resize();
      });
      this.getColor();
    },
    formatter (value, pres) {
      if (pres) {
        if (pres.type === 'dec') {
          value = addingUnit(value, pres.state.unit);
          value = fmoney(value, pres.state.dec, pres.state.commas);
        } else {
          value = addingUnit(value, pres.state.unit);
          value = fmoney(value, pres.state.dec, pres.state.commas);
        }
      }
      return value + (pres ? pres.state.unit : '');
    }
  },
  destroyed () {
    window.removeEventListener('resize', this.resize);
  },
  watch: {
    oneOption: {
      handler () {
        this.resolveData();
      },
      deep: true
    },
    chartData: {
      handler () {
        this.resolveData();
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
    .target-box {
        padding: 10px;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        //align-items:center;
        flex-direction: column;
        justify-content: center;

        .target {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0 10px;
            margin-bottom: 20px;
            article, div, h3 {
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              -o-text-overflow: ellipsis;
              overflow: hidden;
            }
            article {
              margin: 3px 0 0;
              // font-weight: 600;
            }
            .number-title {
              color: #666;
              .theme-purpleNight & {
                color: #ccc;
              }
            }
            .special-div {
                width: auto;
                margin: 0 auto;
            }
        }
    }
</style>
