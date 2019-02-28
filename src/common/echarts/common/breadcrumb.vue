<template>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="ml10">
        <el-breadcrumb-item v-for="(drill, $index) in localPath" :key="$index">
            <a @click="drillDown(drill, $index)" v-if="$index === 0"><i class="iconfont icon-ic-delall"></i></a>
            <a @click="drillDown(drill, $index)" v-else>{{drill.name}}</a>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  props: {
    drillPath: Array
  },
  computed: {
    localPath: function () {
      return [0, ...this.drillPath];
    }
  },
  methods: {
    drillDown (id, $index) {
      this.$emit('drill', $index);
    }
  }
};
</script>

<style scoped>
 .icon-ic-delall {
  line-height: 1.2;
 }
 .el-breadcrumb__item{
     line-height: 20px;
 }
</style>
