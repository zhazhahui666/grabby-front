<template>
  <div>
    <card>
      <!-- 搜索区域 -->
      <Row>
        用户名：
        <Input v-model="searchForm.name" placeholder="请输入用户名" style="width: auto" />
        <Button type="primary" @click="handSearch">搜索</Button>
      </Row>
      <Divider style="margin:12px 0" />

      <!-- 数据表格 -->
      <Row>
        <Table border :columns="columns" :data="dataList">

          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" @click="showProcessImage(row)">流程图</Button>
            <Button type="error" size="small" @click="remind(row)">催办</Button>
          </template>
        </Table>
      </Row>

      <!-- 分页 -->
      <Row type="flex" justify="end" class="page">
        <Page :total="totalCount" size="small" show-elevator show-sizer
          show-total @on-change="changePage" @on-page-size-change="changePageSize" />
      </Row>

    </card>
  </div>

</template>

<script>

import { getMyApply,getProcessImage } from '@/api/activiti'
import { formatDate } from '@/libs/date'

export default {
  mounted() {
    //TODO 默认显示总部详情
    this.init()
  },
  data() {
    return {
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      dataList: [],
      totalCount: 0,
      columns: [{
        title: '流程定义id',
        key: 'processInsId'
      }, {
        title: '标题',
        key: 'title'
      },
      {
        title: '当前节点',
        key: 'currentActName'
      },
      {
        title: '申请时间',
        key: 'createTime',
        align: 'center',
        render(h, params) {
          return h('span', formatDate(params.row.createTime, 'yyyy-MM-dd hh:mm'))
        },
      },
      {
        title: '操作',
        slot: 'action',
        width: 150,
        align: 'center'
      }]
    }
  },
  methods: {
    init() {
      this.getData()
    },
    getData() {
      getMyApply(this.searchForm).then(res => {
        if (res.data.records && res.data.records.length > 0) {
          this.dataList = res.data.records
          this.totalCount = res.data.total
        } else {
          this.dataList = []
          this.totalCount = 0
        }
      })
    },
    changePage(pageNumber) {
      this.searchForm.pageNumber = pageNumber
      this.getData()
    },
    changePageSize(pageSize) {
      this.searchForm.pageSize = pageSize
      this.getData()
    },
    handSearch() {
      //todo
    },
    //查看流程图
    showProcessImage(row){
      console.log(row);
      getProcessImage(row.processInsId).then(res=>{
        console.log("获取成功");
      })
    },
    //催办
    remind(row){
      console.log(row);
    }
  }
}
</script>

<style>
</style>
