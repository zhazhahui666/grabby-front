<template>
  <div>
    <card>
      <!-- 搜索区域 -->
      <Row>
            用户名：<Input v-model="searchForm.username" placeholder="请输入用户名" style="width: auto" />
            手机号：<Input v-model="searchForm.mobile" placeholder="请输入手机号" style="width: auto" />
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

import { getUserPage,resetPassword } from '@/api/user'
import { Tag } from 'iview';

export default {
  mounted() {
    this.init()
  },

  components: {
    Tag
  },

  data() {
    return {
      searchForm: {
        username: '',
        mobile: '',
        pageNumber: 1,
        pageSize: 10
      },
      dataList: [],
      totalCount: 0,
      columns: [{
        title: '用户名',
        align: "center",
        key: 'username'
      },
      {
        title: '昵称',
        align: "center",
        key: 'nickname'
      },
      {
        title: '电话',
        align: "center",
        key: 'mobile'
      },
      {
        title: '部门',
        align: "center",
        key: 'departmentName'
      },
      {
        title: '邮箱',
        align: "center",
        key: 'email'
      },
      {
        title: '住址',
        align: "center",
        key: 'address'
      },
      {
        title: '状态',
        key: 'status',
        align: "center",
        render: (h, params) => {
          if (params.row.status === 1) {
            return (
              <Tag type="dot" color="primary">正常</Tag>
            )
          } else {
            return (
              <Tag type="dot" color="error">禁用</Tag>
            )
          }
        }
      },
      {
        title: '操作',
        key: 'action',
        width: 250,
        align: 'center',
        render: (h, params) => {
          return h('div', [
            // h('Button', {
            //   props: {
            //     type: 'primary',
            //     size: 'small'
            //   },
            //   style: {
            //     marginRight: '5px'
            //   },
            //   on: {
            //     click: () => {
            //       this.showUser(params)
            //     }
            //   }
            // }, '编辑'),
            // h('Button', {
            //   props: {
            //     type: 'error',
            //     size: 'small'
            //   },
            //   style: {
            //     marginRight: '5px'
            //   },
            //   on: {
            //     click: () => {
            //       this.remove(params.index)
            //     }
            //   }
            // }, '删除'),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  this.resetPassword(params)
                }
              }
            }, '重置密码')
          ]);
        }
      }
      ],
    }
  },

  methods: {
    init() {
      this.getData()
    },
    getData() {
      getUserPage(this.searchForm).then(res => {
        if (res.data.records && res.data.records.length > 0) {
          this.dataList = res.data.records
          this.totalCount = res.data.total
        } else {
          this.dataList = []
          this.totalCount = 0
        }
      })
    },
    remove() {
      console.log("删除")
    },
    showUser(params) {
      console.log(params);
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
    },
    resetPassword({row:{id:uid}}){
      resetPassword(uid).then(res=>{
        this.$Message.success("重置密码成功")
      })
    }
  },

}


</script>
