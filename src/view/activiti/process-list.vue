<template>
  <div>
    <row v-if="dataList && dataList.length">
      <Col span="8" v-for="(item,index) in dataList" :key="index">
      <card :title="item.name" style="height:260px">
        <div v-if="item.processDefinitionDtos && item.processDefinitionDtos.length">
          <div v-for="(def,idx) in item.processDefinitionDtos" :key="idx">
            <a @click="handClick(def)">{{def.name}}</a>
        </div>
  </div>
  <div v-else>
    暂无数据
  </div>
  </card>
  </Col>
  </row>
  <row v-else>
    暂无数据
  </row>
  </div>
</template>

<script>
import { getProcesscategory, startProcess } from '@/api/activiti'
export default {

  mounted() {
    //TODO 默认显示总部详情
    this.init()
  },
  data() {
    return {
      dataList: []
    }
  },
  methods: {
    init() {
      this.getData()
    },
    getData() {
      getProcesscategory().then(res => {
        if (res.data && res.data.length) {
          this.dataList = res.data
        }
      })
    },
    handClick(process) {
      console.log(process);
      startProcess({ processKey: process.processKey }).then(res => {
        this.$Message.success("创建成功")
      })
    }
  }




}
</script>

<style>
</style>
