<template>
  <div>
    <card>
      <!-- 搜索区域 -->
      <Row>
        
            名称：<Input v-model="searchForm.name" placeholder="请输入名称" style="width: auto"></Input>
          </FormItem>
        
      </Row>
      <Divider style="margin:12px 0" />

      <!-- 数据表格 -->
      <Row>
        <Table border :columns="columns" :data="dataList"></Table>
      </Row>

       <!-- 分页 -->
      <Row type="flex" justify="end" class="page">
        <Page size="small" :total="totalCount"  show-elevator show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" />
      </Row>

    </card>
  </div>
</template>

<script>

import { getPermissionPage } from '@/api/permission'


export default {
  mounted() {
    this.init()
  },
  data() {
    return {
      searchForm: {
        name: '',
        pageNumber: 1,
        pageSize: 10
      },
      dataList: [],
      totalCount: 0,
      columns: [{
        title: '名称',
        key: 'name'
      },
      {
        title: '标题',
        key: 'title'
      },
      {
        title: '路径',
        key: 'path'
      },
      ]
    }
  },
  methods: {
    init() {
      this.getData()
    },
    getData() {
      getPermissionPage(this.searchForm).then(res => {
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
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.getData()
    }
  }

}
</script>

<style>
</style>
