<template>
    <div :id="id" class="number">
        <div v-for="(number, $index) in numbers" :key="$index" :class="numberClass" :style="{fontSize: parseInt(fontSize) + 'px'}">{{number}}</div>
    </div>
</template>

<script>
import {fmoney} from '../common.js';
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
      numbers: [],
      fontSize: 12,
      medias: [100, 200, 300, 400, 500, 900, 1100, 1300, 1500, 1700, 1900, 2100]
    };
  },
  mounted () {
    this.initChart();
    window.addEventListener('resize', this.resize);
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
      this.$nextTick(() => {
        this.resize();
      });
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
    resize () {
      const width = document.getElementById(this.id).offsetWidth;
      for (let $index = 0; $index < this.medias.length; $index++) {
        if (width < this.medias[$index]) {
          this.fontSize = ($index * 12) + 'px';
          break;
        }
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize);
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
}
@mixin number-class($border-image, $font-color){
    background-image: url($border-image);
    background-repeat: no-repeat;
    background-position: 0px 0px;
    background-size: 100% 100%;
    padding:5px;
    margin:0 3px;
    color: $font-color;
}
.number-orange{
    $font-color: #FFB617;
    $transation-color: #FF612A;
    $border-image: '~@/assets/static/chart/number_orange.png';
    @include number-class($border-image, $font-color);
    //background: linear-gradient(0deg, #FF612A 0%, #FFB617 100%);
    //color: $font-color;
}
.number-blue{
    $font-color: #65E3FF;
    $transation-color: #FF612A;
    $border-image: '~@/assets/static/chart/number_blue.png';
    @include number-class($border-image, $font-color);
}
.number-purple{
    $font-color: #FFFFFF;
    $transation-color: #FF612A;
    $border-image: '~@/assets/static/chart/number_purple.png';
    @include number-class($border-image, $font-color);
}
</style>
