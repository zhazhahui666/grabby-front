<template>
  <div>
    <card>
      <!-- 搜索区域 -->
      <Row>
        用户名：
        <Input v-model="searchForm.name" placeholder="请输入用户名" style="width: auto"></Input>
        <Button type="primary" @click="handSearch">搜索</Button>
      </Row>
      <Divider style="margin:12px 0" />

      <!-- 数据表格 -->
      <Row>
        <Table border :columns="columns" :data="dataList"></Table>
      </Row>

      <!-- 分页 -->
      <Row type="flex" justify="end" class="page">
        <Page :total="totalCount" size="small" show-elevator show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" />
      </Row>

    </card>
  </div>

</template>

<script>

import { getModelPage } from '@/api/activiti'

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
        title: '用户名',
        key: 'username'
      },
      {
        title: '昵称',
        key: 'nickname'
      }, {
        title: '电话',
        key: 'mobile'
      }, {
        title: '邮箱',
        key: 'email'
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                icon: 'md-eye'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.showDetail(params)
                }
              }
            }, '查看'),
            h('Button', {
              props: {
                type: 'primary',
                icon: 'md-checkmark-circle'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.handPass(params)
                }
              }
            }, '通过'),
            h('Button', {
              props: {
                type: 'primary',
                icon: 'md-return-left'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.remove(params.index)
                }
              }
            }, '驳回'),
          ]);
        }
      }]
    }
  },
  methods: {
    init() {
      this.getData()
    },
    getData() {
      getModelPage(this.searchForm).then(res => {
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
  }
}
</script>

<style>
</style>
