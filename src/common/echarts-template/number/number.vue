<template>
    <div :id="id" class="number">
        <div v-for="(number, $index) in numbers" :key="$index" :class="numberClass">{{number}}</div>
    </div>
</template>

<script>
import {fmoney} from '@/common/echarts/common/common.js';
export default {
  props: {
    id: String,
    data: {
      default: function () {
        return {data: '3968.3'};
      }
    },
    theme: String
  },
  data () {
    return {
      numbers: []
    };
  },
  mounted () {
    this.initChart();
  },
  methods: {
    initChart () {
      this.numberClass = `number-${this.theme}`;
      const numbers = this.data.data.toString();
      let decimalCount = numbers.length - (numbers.indexOf('.') + 1); // 获取小数点后的个数
      if (numbers.indexOf('.') < 0) {
        decimalCount = 0;
      }
      let index = 0;
      const maxChangeTimes = 15; // maxChangeTimes * 100MS
      const interval = setInterval(_ => {
        if (index < maxChangeTimes) {
          this.numbers = fmoney(this.getRandomNum(numbers, decimalCount), decimalCount, true);
          index++;
        } else if (index === maxChangeTimes) {
          this.numbers = fmoney(this.data.data, decimalCount, true).toString();
          index++;
        } else {
          clearInterval(interval);
        }
      }, 100);
    },
    getRandomNum (numbers, decimalCount) {
      let integerCount;
      if (numbers.indexOf('.') < 0) { // 全整型
        integerCount = numbers.length;
      } else { // 浮点型
        integerCount = numbers.length - decimalCount - 1; // 再减1是减逗号位
      }

      var temp = Math.floor(Math.random() * Math.pow(10, integerCount));
      temp = String(temp);
      if (temp.length !== numbers.length) { // 随机出来的位数和真值位数不等，当然要候补少出来的位数
        if (decimalCount > 0) {
          var templen = numbers.length - temp.length;
          for (var i = 0; i < templen - decimalCount - 1; i++) {
            temp += Math.floor(Math.random() * 10);
          }
          const decimal = parseFloat(Math.random().toFixed(decimalCount));
          temp = parseInt(temp) + decimal;
        } else {
          const templen = numbers.length - temp.length;
          for (var j = 0; j < templen; j++) {
            temp += Math.floor(Math.random() * 10);
          }
        }
      }
      return parseFloat(temp).toString();
    },
    resize () {}
  },
  watch: {
    theme () { // 监听主题变化,编辑页面切换主题重新渲染
      this.initChart();
    }
  }
};
</script>

<style lang="scss" scoped>
.number {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap; //wrap
    justify-content: center;
    align-items: center;
    font-weight: 900;
    $populor-color: #FFB617;
    > div {
        position: relative;
        padding: 6px;
        margin: 2px;
        border: $populor-color solid 1px;
        // border-radius: 2px;
        height: 82px;
        width: 67px;
        vertical-align: middle;
        text-align: center;
        font-size: 57px;
        -webkit-background-clip: text;
        // color: transparent;
        $trangle-distance: -4px;
        @mixin Pseudo-classes {
            box-sizing: content-box;
            width: 5px;
            height: 5px;
            background-color: #191f3a;
            position: absolute;
            top: 38px;
            border: 1px solid #FFB617;
            transform: rotate(45deg);
            display: block;
            content: '';
        }
        &:before {
            right: $trangle-distance;
            @include Pseudo-classes;
            border-top: 1px solid transparent;
            border-right: 1px solid transparent;
            z-index: 12;
        }
        &:after {
            left: $trangle-distance;
            @include Pseudo-classes;
            border-bottom: 1px solid transparent;
            border-left: 1px solid transparent;
            z-index: 10;
        }
    }
}
@mixin number-class($border-color, $font-color, $transation-color){
    border: $border-color solid 1px !important;
    &:before{
        border: 1px solid $border-color !important;
        border-top: 1px solid transparent !important;
        border-right: 1px solid transparent !important;
    }
    &:after {
        border: 1px solid $border-color !important;
        border-bottom: 1px solid transparent !important;
        border-left: 1px solid transparent !important;
    }
}
.number-orange{
    $border-color: #FFB617;
    $font-color: #FFB617;
    $transation-color: #FF612A;
    @include number-class(#FFB617, #FFB617, #FF612A);
    background: linear-gradient(0deg, #FF612A 0%, #FFB617 100%);
    color: transparent;
}
.number-blue{
    $border-color: #3F5FFC;
    $font-color: #65E3FF;
    $transation-color: #FF612A;
    @include number-class(#3F5FFC, #65E3FF, #FF612A);
    color: $font-color;
}
.number-purple{
    $border-color: #FF3795;
    $font-color: #FFFFFF;
    $transation-color: #FF612A;
    @include number-class(#FF3795, #FFFFFF, #FF612A);
    color: $font-color;
}
</style>
