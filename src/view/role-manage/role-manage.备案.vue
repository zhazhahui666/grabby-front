<template>
  <div>
    <card>
      <!-- 搜索区域 -->
      <Row>
        <Form :model="searchForm" :label-width="80" inline>
          <FormItem label="名称">
            <Input v-model="searchForm.name" placeholder="请输入名称"></Input>
          </FormItem>
          <FormItem style="margin-left: -40px;">
            <Button type="primary" @click="handSearch">搜索</Button>
          </FormItem>
        </Form>
      </Row>

      <!-- 数据表格 -->
      <Row>
        <Table border :columns="columns" :data="dataList"></Table>
      </Row>

      <!-- 分页 -->
      <Row type="flex" justify="end" class="page">
        <Page :total="totalCount"  show-elevator show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" />
      </Row>

    </card>

    <Modal v-model="roleShowFlag" width="600">
      <div class="modal-header">
        <span @click="modalSelect = 'info'">基本信息</span>
        <span> | </span>
        <span @click="modalSelect = 'permission'">功能权限</span>
        <span> | </span>
        <span @click="showUserList">成员列表</span>
        <Button type="primary" >添加</Button>
      </div>
      <div class="modal-content">
        <div v-if="modalSelect=='info'">
          <Form :model="role" :label-width="80">
            <FormItem label="名称：">
              <Input v-model="role.name" style="width: 300px"></Input>
            </FormItem>
            <FormItem label="描述：">
              <Input v-model="role.description" style="width: 300px"></Input>
            </FormItem>
          </Form>
        </div>
        <div v-else-if="modalSelect=='permission'">我是功能权限</div>
        <div v-else-if="modalSelect=='people'">

          <!-- 数据表格 -->
          <Row>
            <Table :columns="userBlock.columns" :data="userBlock.dataList" ></Table>
          </Row>

          <!-- 分页 -->
          <Row type="flex" justify="end" class="page">
            <Page :total="userBlock.totalCount"  show-elevator show-sizer show-total @on-change="changeUserPage" @on-page-size-change="changeUserPageSize" />
          </Row>

        </div>
      </div>

      <!-- <Button @click="addUserModal = true">弹框</Button> -->
    </Modal>

    <Modal v-model="addUserModal" title="添加人员" class-name="vertical-center-modal">
      2222
    </Modal>
  </div>
</template>

<script>

import { getRolePage } from '@/api/role'
import { getUserByRole } from '@/api/user'


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
      userBlock: {
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '用户名',
            key: 'username'
          },
          {
            title: '电话',
            key: 'mobile'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('a', {

              }, '删除')
            }
          }
        ],
        dataList: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10
      },
      dataList: [],
      permissionList: [],
      roleShowFlag: false,
      addUserModal: false,
      modalSelect: 'info',
      totalCount: 0,
      role: {
        id: '',
        name: '',
        description: ''
      },
      columns: [{
        title: 'ID',
        key: 'id'
      },
      {
        title: '名称',
        key: 'name'
      },
      {
        title: '权限数量',
        key: 'permissionCount',
        render: (h, params) => {
          return h('a', {
            on: {
              click: () => {
                this.showRoleModal(params, 'permission')
              }
            }
          }, params.row.permissionCount)
        }
      },
      {
        title: '成员数量',
        key: 'userCount',
        render: (h, params) => {
          // return (<a on-click={this.showRoleModal(params.row.id)}>{params.row.userCount}</a>)
          return h('a', {
            on: {
              click: () => {
                this.showRoleModal(params, 'user')
              }
            }
          }, params.row.userCount)
        }
      },
      ]
    }
  },
  methods: {
    init() {
      this.getData()
    },
    getData() {
      getRolePage(this.searchForm).then(res => {
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

    changeUserPage(pageNumber) {
      this.userBlock.pageNumber = pageNumber
      this.initUserList
    },
    changeUserPageSize(pageSize) {
      this.userBlock.pageSize = pageSize
      this.initUserList
    },
    handSearch() {
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.getData()
    },
    showRoleModal({ row: { id, name, description } }, type) {
      this.roleShowFlag = true
      this.role.id = id
      this.role.name = name
      this.role.description = description
      // if (type === 'permission') {
      //   //todo
      // } else {
      //   this.initUserList(roleId)
      // }

    },
    initUserList() {
      let params = {}
      params.roleId = this.role.id
      params.pageNumber = this.userBlock.pageNumber
      params.pageSize = this.userBlock.pageSize
      getUserByRole(params).then(res => {
        if (res.data.records && res.data.records.length > 0) {
          this.userBlock.dataList = res.data.records
          this.userBlock.totalCount = res.data.total
        } else {
          this.userBlock.dataList = []
          this.userBlock.totalCount = 0
        }
      })
    },
    showUserList() {
      this.modalSelect = 'people'
      this.initUserList()
    }

  }

}
</script>

<style lang='less'>
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
.modal-header {
  margin-bottom: 20px;
}
</style>
