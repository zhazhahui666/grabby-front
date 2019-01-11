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
      <row class="row">
        <Button type="primary" class="action-btn" icon="md-eye" @click="showDetail">查看</Button>
        <Button type="primary" class="action-btn" icon="md-checkmark-circle" @click="handPass">通过</Button>
        <Button type="primary" class="action-btn" icon="md-return-left" @click="handReject">驳回</Button>
        <Button type="primary" class="action-btn" icon="md-people">转办</Button>
      </row>

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

import { getTodoList, taskPass } from '@/api/activiti'
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
      }, {
        title: '申请时间',
        key: 'createTime',
        align: 'center',
        render(h, params) {
          return h('span', formatDate(params.row.createTime, 'yyyy-MM-dd hh:mm'))
        },
      }, {
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
            h('Button', {
              props: {
                type: 'primary',
                icon: 'md-people'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.remove(params.index)
                }
              }
            }, '转办')
          ]);
        }

      },]
    }
  },
  methods: {
    init() {
      this.getData()
    },
    getData() {
      getTodoList(this.searchForm).then(res => {
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
    showDetail() {
      //todo
    },
    handPass(params) {
      console.log();
      taskPass({ taskId: params.row.taskId }).then(res => {
        this.$Message.info('通过成功')
        this.getData()
      })
    },
    handReject() {

    }
  }
}
</script>

<style>
</style>
