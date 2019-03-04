<template>
    <div :id="id" class="table-list" :class="tableClass">
      <el-table
        class="table-list"
        :data="data"
        stripe>
        <el-table-column
          prop="date"
          label="门店数">
        </el-table-column>
        <el-table-column
          prop="name"
          label="字段名称">
        </el-table-column>
        <el-table-column
          prop="address"
          label="金额">
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
// import {fmoney} from '@/common/echarts/common/common.js';
export default {
  props: {
    id: String,
    data: {
      default: function () {
        return [{
          date: '2016',
          name: '北京店',
          address: '2245'
        }, {
          date: '2016',
          name: '天津分店',
          address: '33466'
        }, {
          date: '2016',
          name: '山海分店',
          address: '223566'
        }, {
          date: '2016',
          name: '广州分店',
          address: '35677'
        }];
      }
    },
    theme: String
  },
  data () {
    return {
      tableClass: `table-${this.theme}`,
      numbers: []
    };
  },
  mounted () {
    this.initChart();
  },
  methods: {
    initChart () {
      this.tableClass = `table-${this.theme}`;
    },
    resize () {}
  },
  watch: {
    theme (val) { // 监听主题变化,编辑页面切换主题重新渲染
      this.initChart();
    }
  }
};
</script>
<style lang="scss">
.table-list {
  color: #fff;
  margin-top: 10px;
  overflow: auto;
  .el-table thead {
    color: #fff;
  }
  .el-table th.is-leaf {
     border-bottom: none;
   }
  .el-table td {
    padding: 0;
    border-bottom: none;
  }
  .el-table tr {
    height: 50px;
  }
  .el-table, .el-table::before {
    background-color: transparent;
  }
}

</style>

<style lang="scss">
@mixin table-class($headbg-color, $trbg-color, $strip-color){
  .has-gutter th{
    background-color: $headbg-color;
  }
  .el-table tr {
    background-color: $trbg-color;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: $strip-color
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: $trbg-color;
  }
}
.table-orange{
    $headbg-color: rgba(255, 173, 31, 0.1);
    $trbg-color: rgba(0,0,0,0.4);
    $strip-color: rgba(31,21,13,0.5);
    @include table-class(rgba(255, 173, 31, 0.1), rgba(0,0,0,0.4), rgba(31,21,13,0.5));
}
.table-blue{
    $headbg-color: #222B61;
    $trbg-color: #121533;
    $strip-color: #14193C;
    @include table-class(#222B61, #121533, #14193C);
}
.table-purple{
    $headbg-color: #2F276A;
    $trbg-color: #1F1138;
    $strip-color: #231544;
    @include table-class(#2F276A, #1F1138, #231544);
}
</style>
