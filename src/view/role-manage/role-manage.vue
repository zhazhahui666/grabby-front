<template>
  <div>

    <Row>
      <Col span="12">
      <card>
        <!-- 搜索区域 -->
        <Row class="row">
          <!-- <Form :model="searchForm" :label-width="80" inline>
            <FormItem label="名称">
              <Input v-model="searchForm.name" placeholder="请输入名称"></Input>
            </FormItem>
            <FormItem style="margin-left: -40px;">
              <Button type="primary" @click="handSearch">搜索</Button>
            </FormItem>
          </Form> -->
          名称：
          <Input v-model="searchForm.name" placeholder="请输入名称" style="width: auto" @on-enter="handSearch"></Input>
          <Button type="primary" @click="handSearch" icon="md-search">搜索</Button>
          <Button type="primary" @click="resetSearch" icon="md-refresh">重置</Button>
        </Row>
        <Divider style="margin:12px 0" />
        <row class="row">
          <Button type="primary" class="action-btn" icon="md-add" @click="handAddRole('add')">新增角色</Button>
          <Button type="primary" class="action-btn" icon="md-create" @click="handAddRole('edit')">编辑角色</Button>
          <Button type="primary" class="action-btn" icon="md-trash" @click="deleteRole">删除角色</Button>
          <Button type="primary" class="action-btn" icon="md-people">编辑权限</Button>
          <Button type="primary" class="action-btn" icon="md-person-add" @click="userAddModalShow">添加成员</Button>
        </row>

        <!-- 数据表格 -->
        <Row>
          <Table border highlight-row @on-current-change="handCurrentChange" :columns="columns" :data="dataList"></Table>
        </Row>

        <!-- 分页 -->
        <Row type="flex" justify="end" class="page">
          <Page size="small" :total="totalCount" show-elevator show-sizer show-total @on-change="changePage" @on-page-size-change="changePageSize" />
        </Row>

      </card>
      </Col>
      <Col span="12">
      <card>
        <div class="tabs-wrapper">
          <Tabs v-model="tabSelect" @on-click="handTabClick">
            <TabPane label="基本信息" icon="md-information-circle" name='info'>
              <Form :model="role" :label-width="80">
                <FormItem label="名称：">
                  <!-- <Input v-model="role.name" style="width: 300px"></Input> -->
                  <span>{{role.name}}</span>
                </FormItem>
                <FormItem label="描述：">
                  <!-- <Input v-model="role.description" style="width: 300px"></Input> -->
                  <span v-if="role.description != '' && role.description!= null ">{{role.description}}</span>
                  <span v-else>(空)</span>
                </FormItem>
              </Form>
            </TabPane>
            <TabPane label="功能权限" icon="logo-windows" name='permission'>
              我是功能权限
            </TabPane>
            <TabPane label="成员列表" icon="md-person" name='people'>
              <!-- 数据表格 -->
              <Row>
                <Table border :columns="userBlock.columns" :data="userBlock.dataList"></Table>
              </Row>
              <!-- 分页 -->
              <Row type="flex" justify="end" class="page">
                <Page :total="userBlock.totalCount" size="small" show-elevator show-sizer show-total @on-change="changeUserPage" @on-page-size-change="changeUserPageSize" />
              </Row>
            </TabPane>
          </Tabs>
        </div>
      </card>
      </Col>
    </Row>

    <Modal v-model="roleModal" title="角色添加" @on-ok="addRoleOk" loading>
      <Form :model="modalRole" :label-width="80">
        <FormItem label="名称：">
          <Input v-model="modalRole.name" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="描述：">
          <Input v-model="modalRole.description" type="textarea" autosize style="width: 300px"></Input>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="userAddModal.show" title="成员添加" @on-ok="addUserOk" loading okText="添加">
      名称：
      <Input v-model="userAddModal.searchForm.username" placeholder="请输入名称" style="width: auto" @on-enter="handSearch"></Input>
      <Button type="primary" @click="handUserModaloSearch" icon="md-search">搜索</Button>
      <Divider style="margin:12px 0" />
      <!-- 数据表格 -->
      <Row>
        <Table border :columns="userAddModal.columns" :data="userAddModal.dataList" @on-selection-change="userModalSelectChange"></Table>
      </Row>
      <!-- 分页 -->
      <Row type="flex" justify="end" class="page">
        <Page :total="userAddModal.totalCount" size="small" show-elevator show-sizer show-total @on-change="changeUserModalPage" @on-page-size-change="changeUserModalPageSize" />
      </Row>
    </Modal>
  </div>
</template>

<script>

import { getRolePage, saveOrUpdateRole, addUserRole, deleteRole } from '@/api/role'
import { getUserByRole, getUserPage } from '@/api/user'


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
      tabSelect: 'info',
      totalCount: 0,
      roleModal: false,
      userAddModal: {
        show: false,
        searchForm: {
          pageNumber: 1,
          pageSize: 10,
          username: ''
        },
        roleUser: {
          roleId: '',
          uids: ''
        },
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
      },
      role: {
        id: '',
        name: '',
        description: ''
      },
      modalRole: {
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
        // render: (h, params) => {
        //   return h('a', {
        //     on: {
        //       click: () => {
        //         this.tabSelect = 'permission'
        //       }
        //     }
        //   }, params.row.permissionCount)
        // }
      },
      {
        title: '成员数量',
        key: 'userCount',
        // render: (h, params) => {
        //   // return (<a on-click={this.showRoleModal(params.row.id)}>{params.row.userCount}</a>)
        //   return h('a', {
        //     on: {
        //       click: () => {
        //         this.tabSelect = 'people'
        //       }
        //     }
        //   }, params.row.userCount)
        // }
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
    },
    resetSearch() {
      alert("待开发")
    },
    handCurrentChange({ id, name, description }, oldCurrentRow) {
      this.role.id = id
      this.role.name = name
      this.role.description = description

      this.tabSelect = 'info'
    },
    handTabClick(name) {
      switch (name) {
        case 'info':
          break;
        case 'permission':
          alert("todo")
          break;
        case 'people':
          this.initUserList()
          break;
      }

    },
    handAddRole(action) {
      let flag = true
      if (action === 'add') {
        this.modalRole.id = ''
        this.modalRole.name = ''
        this.modalRole.description = ''
      } else {
        if (this.modalRole.id) {
          this.modalRole.id = this.role.id
          this.modalRole.name = this.role.name
          this.modalRole.description = this.role.description
        } else {
          this.$Message.warning({
            content: '请在角色列表中选中一个角色进行编辑,单击表格即可选中',
            duration: 3
          });
          flag = false
        }
      }
      this.roleModal = flag
    },
    deleteRole() {
      deleteRole(this.role.id).then(res => {
        this.$Message.success("删除成功")
        this.getData()
      })
    },
    addRoleOk() {
      saveOrUpdateRole(this.modalRole).then(res => {
        this.roleModal = false
        this.$Message.info('操作成功')
        this.getData()
      })
    },
    addUserOk() {
      let temp = this.userAddModal.roleUser
      if (temp.roleId && temp.uids && temp.uids.length) {
        addUserRole(this.userAddModal.roleUser).then(res => {
          this.userAddModal.show = false
          this.$Message.info('操作成功')
          this.getData()
        })
      }
    },
    changeUserModalPage() {
      //todo
      this.userAddModal.searchForm.pageNumber = pageNumber
      this.getUserModalData()
    },
    handUserModaloSearch() {
      this.getUserModalData()
    },
    getUserModalData() {
      getUserPage(this.userAddModal.searchForm).then(res => {
        if (res.data.records && res.data.records.length > 0) {
          this.userAddModal.dataList = res.data.records
          this.userAddModal.totalCount = res.data.total
        } else {
          this.userAddModal.dataList = []
          this.userAddModal.totalCount = 0
        }
      })
    },
    changeUserModalPage(pageNumber) {
      this.userAddModal.searchForm.pageNumber = pageNumber
      this.getUserModalData()
    },
    changeUserModalPageSize(pageSize) {
      this.userAddModal.searchForm.pageSize = pageSize
      this.getUserModalData()
    },
    userAddModalShow() {
      if (this.role.id) {
        this.userAddModal.show = true
      } else {
        this.$Message.warning("请先选择一个角色")
      }
    },
    userModalSelectChange(selection) {
      if (selection && selection.length > 0) {
        let selectIds = selection.map(({ id }) => (id))
        this.userAddModal.roleUser.roleId = this.role.id
        this.userAddModal.roleUser.uids = selectIds + ""
        return selectIds
      } else {
        this.userAddModal.roleUser.roleId = ''
        this.userAddModal.roleUser.uids = ''
      }
    }
  }

}
</script>

<style lang='less'>
// .tabs-wrapper{
//   padding-inline-start: 5px;
// }
// .ivu-table-row-highlight td {
//   background-color: #2db7f5;
// }

// .ivu-table-row-hover:hover td{
//   background-color: #2db7f5;
// }
</style>
