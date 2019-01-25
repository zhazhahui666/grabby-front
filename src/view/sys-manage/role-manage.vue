<template>
  <div>
    <row>
      <Col span="12">
      <card>
        <!-- 搜索区域 -->
        <row class="row">
          <!-- <Form :model="searchForm" :label-width="80" inline>
            <FormItem label="名称">
              <Input v-model="searchForm.name" placeholder="请输入名称"></Input>
            </FormItem>
            <FormItem style="margin-left: -40px;">
              <Button type="primary" @click="handSearch">搜索</Button>
            </FormItem>
            </Form>-->
          名称：
          <Input v-model="searchForm.name" placeholder="请输入名称" style="width: auto" @on-enter="handSearch"></Input>
          <Button type="primary" @click="handSearch" icon="md-search">搜索</Button>
          <Button type="primary" @click="resetSearch" icon="md-refresh">重置</Button>
        </row>
        <Divider style="margin:12px 0" />
        <row class="row">
          <Button type="primary" class="action-btn" icon="md-add" @click="handleAddRole('add')">新增角色</Button>
          <Button type="primary" class="action-btn" icon="md-create" @click="handleAddRole('edit')">编辑角色</Button>
          <Button type="primary" class="action-btn" icon="md-trash" @click="handleAddRole('delete')">删除角色</Button>

        </row>

        <!-- 数据表格 -->
        <row>
          <div class="row-table-wrapper">
            <Table border highlight-row @on-current-change="handCurrentChange" :columns="columns"
              :data="dataList"></Table>
          </div>

        </row>

        <!-- 分页 -->
        <row type="flex" justify="end" class="page">
          <Page size="small" :total="totalCount" show-elevator show-sizer show-total @on-change="changePage"
            @on-page-size-change="changePageSize" />
        </row>
      </card>
      </Col>
      <Col span="12">
      <card>
        <div class="tabs-wrapper">
          <Tabs v-model="tabSelect" @on-click="handTabClick">
            <TabPane label="基本信息" icon="md-information-circle" name="info">
              <Form :model="currentRole" :label-width="80">
                <FormItem label="名称：">
                  <span>{{currentRole.name}}</span>
                </FormItem>
                <FormItem label="描述：">
                  <span v-if="currentRole.description != '' && currentRole.description!= null ">{{currentRole.description}}</span>
                  <span v-else>(空)</span>
                </FormItem>
              </Form>
            </TabPane>
            <TabPane label="功能权限" icon="logo-windows" name="permission">
              <row v-if="permissionTab.dataList && permissionTab.dataList.length">
                <Button type="primary" class="action-btn" icon="md-people" @click="savePermission">保存修改</Button>
                <!-- <Col span="12" v-for="item in permissionTab.dataList" :key="item.id">{{item.name}}</Col> -->
                <Tree :data="permissionTab.dataList" ref="permissionTree" show-checkbox></Tree>
              </row>
              <row v-else>暂无数据</row>
            </TabPane>
            <TabPane label="成员列表" icon="md-person" name="people">
              <div style="padding-left:5px">
                <row class="row">
                  <Button type="primary" class="action-btn" icon="md-person-add" @click="userAddModalShow">添加成员</Button>
                </row>
                <!-- 数据表格 -->
                <row>

                  <Table border :columns="userBlock.columns" :data="userBlock.dataList"></Table>

                </row>
                <!-- 分页 -->
                <row type="flex" justify="end" class="page">
                  <Page :total="userBlock.totalCount" size="small" show-elevator show-sizer show-total
                    @on-change="changeUserPage" @on-page-size-change="changeUserPageSize"
                  />
                </row>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </card>
      </Col>
    </row>

    <Modal v-model="roleModal.show" title="角色添加" @on-ok="addRoleOk" loading>
      <Form :model="currentRole" :label-width="80">
        <FormItem label="名称：">
          <Input v-model="currentRole.name" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="描述：">
          <Input v-model="currentRole.description" type="textarea" autosize style="width: 300px"></Input>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="deleteRoleModal.show" title="角色删除" @on-ok="deleteRoleOk" loading>
      <span>确定要删除「{{currentRole.name}}」角色吗，删除后,数据将不可恢复</span>
    </Modal>

    <Modal v-model="userAddModal.show" title="成员添加" @on-ok="addUserOk" loading okText="添加">名称：
      <Input v-model="userAddModal.searchForm.username" placeholder="请输入名称" style="width: auto"
        @on-enter="handSearch"></Input>
      <Button type="primary" @click="handUserModaloSearch" icon="md-search">搜索</Button>
      <Divider style="margin:12px 0" />
      <!-- 数据表格 -->
      <row>
        <Table border :columns="userAddModal.columns" :data="userAddModal.dataList" @on-selection-change="userModalSelectChange"></Table>
      </row>
      <!-- 分页 -->
      <row type="flex" justify="end" class="page">
        <Page :total="userAddModal.totalCount" size="small" show-elevator show-sizer show-total
          @on-change="changeUserModalPage" @on-page-size-change="changeUserModalPageSize"
        />
      </row>
    </Modal>
  </div>
</template>

<script>
import {
  getRolePage,
  saveOrUpdateRole,
  addUserRole,
  deleteRole
} from "@/api/role";
import { getUserPage } from "@/api/user";
import { getUserByRole, getPermissionTree, saveRolePermisisons } from "@/api/role";
import { getPermissionByGroup } from "@/api/permission";

export default {
  mounted() {
    this.init();
  },
  data() {
    return {
      dataList: [],
      tabSelect: "info",
      totalCount: 0,
      searchForm: {
        name: "",
        pageNumber: 1,
        pageSize: 10
      },
      userBlock: {
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "用户名",
            key: "username"
          },
          {
            title: "电话",
            key: "mobile"
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (h, params) => {
              return h("a", {}, "删除");
            }
          }
        ],
        dataList: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10
      },
      permissionTab: {
        dataList: [],
        checkedList: []
      },
      roleModal: {
        show: false,
        role: {
          id: "",
          name: "",
          description: ""
        }
      },
      deleteRoleModal: {
        show: false
      },
      userAddModal: {
        show: false,
        dataList: [],
        totalCount: 0,
        searchForm: {
          pageNumber: 1,
          pageSize: 10,
          username: ""
        },
        roleUser: {
          roleId: "",
          uids: ""
        },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "用户名",
            key: "username"
          },
          {
            title: "电话",
            key: "mobile"
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (h, params) => {
              return h("a", {}, "删除");
            }
          }
        ]
      },
      currentRole: {
        id: "",
        name: "",
        description: ""
      },
      columns: [
        {
          title: "ID",
          key: "id"
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "权限数量",
          key: "permissionCount"
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
          title: "成员数量",
          key: "userCount"
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
        }
      ]
    };
  },
  computed: {

  },
  methods: {
    init() {
      this.getData();
    },
    getData() {
      getRolePage(this.searchForm).then(res => {
        if (res.data.records && res.data.records.length > 0) {
          this.dataList = res.data.records;
          this.totalCount = res.data.total;
        } else {
          this.dataList = [];
          this.totalCount = 0;
        }
      });
    },
    changePage(pageNumber) {
      this.searchForm.pageNumber = pageNumber;
      this.getData();
    },
    changePageSize(pageSize) {
      this.searchForm.pageSize = pageSize;
      this.getData();
    },

    changeUserPage(pageNumber) {
      this.userBlock.pageNumber = pageNumber;
      this.initUserList();
    },
    changeUserPageSize(pageSize) {
      this.userBlock.pageSize = pageSize;
      this.initUserList();
    },

    handSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getData();
    },

    initUserList() {
      let params = {};
      params.roleId = this.currentRole.id;
      params.pageNumber = this.userBlock.pageNumber;
      params.pageSize = this.userBlock.pageSize;
      getUserByRole(params).then(res => {
        if (res.data.records && res.data.records.length > 0) {
          this.userBlock.dataList = res.data.records;
          this.userBlock.totalCount = res.data.total;
        } else {
          this.userBlock.dataList = [];
          this.userBlock.totalCount = 0;
        }
      });
    },
    //权限保存修改
    savePermission() {
      let checkedList = this.$refs.permissionTree.getCheckedNodes()
      //过滤掉分类
      let permissionIds = []
      if (checkedList && checkedList.length) {
        checkedList.map(item => {
          if (!item.isRoot) {
            permissionIds.push(item.id)
          }
        })
      }
      saveRolePermisisons({ roleId: this.currentRole.id, permissionIds }).then(res => {
        this.$Message.success("更新成功")
      })
    },

    showUserList() {
      this.modalSelect = "people";
      this.initUserList();
    },
    resetSearch() {
      alert("待开发");
    },
    handCurrentChange({ id, name, description }, oldCurrentRow) {
      this.currentRole.id = id;
      this.currentRole.name = name;
      this.currentRole.description = description;
      this.tabSelect = "info";
    },
    handTabClick(name) {
      if (!this.currentRole.id) {
        this.$Message.warning({
          content: "请在角色列表中选中一个角色进行操作,单击表格即可选中",
          duration: 3
        })
        return
      }
      switch (name) {
        case "info":
          break;
        case "permission":
          getPermissionTree(this.currentRole.id).then(res => {
            let dataList = this.permissionTab.dataList
            if (res.data && res.data.length) {
              this.permissionTab.dataList = res.data.map(item => {
                let temp = {}
                temp.id = item.id
                temp.title = item.name
                temp.expand = true
                temp.isRoot = true
                temp.children = item.permissionList.map(node => {
                  let temp2 = {}
                  temp2.id = node.id
                  temp2.title = node.title
                  temp2.checked = node.checked
                  return temp2
                })
                return temp
              })
            }
          })
          break;
        case "people":
          this.initUserList();
          break;
      }
    },
    handleAddRole(action) {
      if (action === "add") {
        this.currentRole.id = "";
        this.currentRole.name = "";
        this.currentRole.description = "";
        this.roleModal.show = true;
      } else {
        if (this.currentRole.id) {
          this.roleModal.role = Object.assign({}, this.currentRole);
          if (action === "edit") {
            this.roleModal.show = true;
          } else if (action === "delete") {
            this.deleteRoleModal.show = true;
          }
        } else {
          this.$Message.warning({
            content: "请在角色列表中选中一个角色进行操作,单击表格即可选中",
            duration: 3
          });
        }
      }
    },
    deleteRoleOk() {
      deleteRole(this.currentRole.id).then(res => {
        this.$Message.success("删除成功");
        this.deleteRoleModal.show = false;
        this.getData();
      });
    },
    addRoleOk() {
      saveOrUpdateRole(this.currentRole).then(res => {
        this.roleModal.show = false;
        this.$Message.info("操作成功");
        this.getData();
      });
    },
    addUserOk() {
      let temp = this.userAddModal.roleUser;
      if (temp.roleId && temp.uids && temp.uids.length) {
        addUserRole(this.userAddModal.roleUser).then(res => {
          this.userAddModal.show = false;
          this.$Message.info("操作成功");
          this.getData();
        });
      }
    },
    changeUserModalPage() {
      //todo
      this.userAddModal.searchForm.pageNumber = pageNumber;
      this.getUserModalData();
    },
    handUserModaloSearch() {
      this.getUserModalData();
    },
    getUserModalData() {
      getUserPage(this.userAddModal.searchForm).then(res => {
        if (res.data.records && res.data.records.length > 0) {
          this.userAddModal.dataList = res.data.records;
          this.userAddModal.totalCount = res.data.total;
        } else {
          this.userAddModal.dataList = [];
          this.userAddModal.totalCount = 0;
        }
      });
    },
    changeUserModalPage(pageNumber) {
      this.userAddModal.searchForm.pageNumber = pageNumber;
      this.getUserModalData();
    },
    changeUserModalPageSize(pageSize) {
      this.userAddModal.searchForm.pageSize = pageSize;
      this.getUserModalData();
    },
    userAddModalShow() {
      if (this.currentRole.id) {
        this.userAddModal.show = true;
      } else {
        this.$Message.warning("请先选择一个角色");
      }
    },
    userModalSelectChange(selection) {
      if (selection && selection.length > 0) {
        let selectIds = selection.map(({ id }) => id);
        this.userAddModal.roleUser.roleId = this.currentRole.id;
        this.userAddModal.roleUser.uids = selectIds + "";
        return selectIds;
      } else {
        this.userAddModal.roleUser.roleId = "";
        this.userAddModal.roleUser.uids = "";
      }
    }
  }
};
</script>

<style lang='less' >
.row-table-wrapper {
  .ivu-table-tbody tr {
    cursor: pointer;
  }
}

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
