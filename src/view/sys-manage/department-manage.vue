<template>
  <div>

    <card>
      <Row>
        <Col span="4" class="tree">
        <Tree :data="treeData" @on-select-change="handSelectChange" ref="departmentTree"></Tree>
        <div></div>
        </Col>
        <Col span="20">
        <div class='content-wrapper'>
          <!-- <Tabs @on-click="handleTabClick" value="tableValue"> -->
          <Tabs type="card">
            <TabPane label="部门信息" icon="md-information-circle" name='info'>
              <!-- <p>{{department.id}}</p>
              <p>{{department.name}}</p>
              <p>{{department.description}}</p> -->
              <Form :model="department" :label-width="80">
                <FormItem label="名称：">
                  <!-- <Input v-model="department.name" style="width: 200px"></Input> -->
                  <span>{{department.name}}</span>
                </FormItem>
                <FormItem label="描述：">
                  <!-- <Input v-model="department.name" style="width: 200px"></Input> -->
                  <span v-if="department.description">{{department.description}}</span>
                  <span v-else>空</span>
                </FormItem>
                <FormItem label="排序：">
                  <!-- <Input v-model="department.name" style="width: 200px"></Input> -->
                  <span v-if="department.rank">{{department.rank}}</span>
                  <span v-else>空</span>
                </FormItem>
              </Form>
            </TabPane>
            <TabPane label="部门成员" icon="md-people" name='people'>
              <!-- 数据表格 -->
              <Row>
                <Table border :columns="columns" :data="dataList"></Table>
              </Row>

              <!-- 分页 -->
              <Row type="flex" justify="end" class="page">
                <Page :total="totalCount" show-elevator show-sizer show-total
                  @on-change="changePage" size="small" @on-page-size-change="changePageSize"
                />
              </Row>

            </TabPane>
            <Button type="primary" slot="extra" class="action-btn" @click="handleImportUser">人员导入</Button>
            <Button type="primary" slot="extra" class="action-btn" @click="userModal = true">添加人员</Button>
            <Button type="primary" slot="extra" class="action-btn" @click="handleAddDepartment(department.pid,'新建同级部门')">新建同级部门</Button>
            <Button type="primary" slot="extra" class="action-btn" @click="handleAddDepartment(department.id,'新建下级部门')">新建下级部门</Button>
          </Tabs>
        </div>
        </Col>
      </Row>
    </card>

    <Modal v-model="userModal" @on-ok="userModalOk" :loading="loading"
      title="添加用户">
      <Form :model="user" :label-width="80">
        <FormItem label="用户名：">
          <Input v-model="user.username" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="部门：">
          <!-- <Input v-model="department.name" style="width: 200px"></Input> -->
          <span>{{department.name}}</span>
        </FormItem>
        <FormItem label="头像：">
          <Input v-model="user.avatar" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="昵称：">
          <Input v-model="user.nickname" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="性别：">
          <RadioGroup v-model="user.sex">
            <Radio :label=1>男</Radio>
            <Radio :label=2>女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="邮箱：">
          <Input v-model="user.email" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="手机：">
          <Input v-model="user.mobile" style="width: 300px"></Input>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="departmentModal.show" @on-ok="addDepartmentOk"
      :loading="loading" :title="departmentModal.title">
      <Form :model="departmentModal.department" :label-width="80">
        <!-- <FormItem label="父id：">
          <Input v-model="departmentModal.department.pid" style="width: 300px"></Input>
        </FormItem> -->
        <FormItem label="名称：">
          <Input v-model="departmentModal.department.name" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="描述：">
          <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入部门描述"
            v-model="departmentModal.department.description" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="排序：">
          <!-- <Input v-model="departmentModal.department.rank" style="width: 300px"></Input> -->
          <InputNumber :max="1000" :min="0" :step="0.8" :value="departmentModal.department.rank"></InputNumber>
        </FormItem>

      </Form>
    </Modal>

    <Modal v-model="importUserModal.show" title="人员导入">

      <Upload type="drag" action="#" :before-upload="handleUpload">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>点击或者拖拽文件至此处上传</p>
        </div>
      </Upload>
      <div v-if="importUserModal.file !== null" class="file-tip">
        已选择文件: {{ importUserModal.file.name }}
      </div>
      <div class="message-wrapper">
        <p v-if="importUserModal.message">
          <Icon style="color:#ed4014;" type="md-close-circle" size="13"
            v-if="importUserModal.error && importUserModal.error.length"
          />
          <Icon style="color:#19be6b;" type="md-checkmark-circle" size="13"
            v-else/> {{importUserModal.message}}：
        </p>
        <ul v-if="importUserModal.error && importUserModal.error.length"
          class="error-msg">
          <li v-for="item in importUserModal.error">第{{item.row}}行,{{item.message}}</li>
        </ul>
      </div>

      <div slot="footer">
        <Button @click="importUserModal.show=false">关闭</Button>
        <Button>
          <a href="/api/user/download-import-template" style="color: #515a6e">下载模板</a>
        </Button>
        <Button type="primary" @click="importUserOk" :loading="importUserModal.loading">导入</Button>
      </div>
    </Modal>

  </div>

</template>

<script>
import { getTree, addDepartment } from '@/api/department'
import { getUserPage, addUse, importUser, downloadTemplateUrl } from '@/api/user'
import responseCode from '@/libs/response.code'

export default {
  mounted() {
    //TODO 默认显示总部详情
    this.init()
  },
  data() {
    return {
      searchForm: {
        pageNumber: 1,
        pageSize: 10,
        departmentId: 0
      },
      treeData: [],
      dataList: [],
      department: {
        name: '',
        id: '',
        description: '',
        pid: '',
        rank: ''
      },
      departmentModal: {
        show: false,
        title: '新建部门',
        department: {
          name: '',
          pid: '',
          description: '',
          rank: 1
        }
      },
      importUserModal: {
        show: false,
        file: null,
        loading: false,
        error: [],
        message: ""
      },
      columns: [{
        title: '用户名',
        key: 'username'
      },
      {
        title: '昵称',
        key: 'nickname'
      },
      {
        title: '电话',
        key: 'mobile'
      },
      {
        title: '邮箱',
        key: 'email'
      },
      {
        title: '住址',
        key: 'address'
      }],
      totalCount: 0,
      userModal: false,
      loading: true,
      user: {
        username: '',
        password: '123456',
        nickname: '',
        sex: 1,
        avatar: '',
        email: '',
        mobile: '',
        departmentId: 0
      },
      tableValue: 'info'
    }
  },
  methods: {
    init() {
      this.getTree()
    },
    getTree() {
      getTree().then(res => {
        this.treeData = this.transferData2Tree(res.data)

        //初始化默认选择根节点的数据
        this.$nextTick(function () {
          console.log(222222);
          let selectArr = this.$refs.departmentTree.getSelectedNodes()
          if (selectArr && selectArr.length > 0) {
            this.department.id = selectArr[0].id
            this.department.name = selectArr[0].title
            this.department.rank = selectArr[0].rank
            this.getUserData()
          }
        })
      })
    },
    //递归映射数据
    transferData2Tree(data) {
      if (data.length > 0) {
        return data.map(({ pid, id, name, children, description, rank }) => ({
          id,
          title: name,
          pid: pid,
          rank: rank,
          description: description,
          expand: pid ? false : true,
          selected: pid ? false : true,
          children: this.transferData2Tree(children)
        }))
      } else {
        return []
      }
    },
    handSelectChange(data) {
      if (data && data.length) {
        this.department.id = data[0].id
        this.department.name = data[0].title
        this.department.pid = data[0].pid
        this.department.description = data[0].description
        this.department.rank = data[0].rank
        this.getUserData()
      }

    },
    getUserData() {
      this.searchForm.departmentId = this.department.id
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
    changePage(pageNumber) {
      this.searchForm.pageNumber = pageNumber
      this.getUserData()
    },
    changePageSize(pageSize) {
      this.searchForm.pageSize = pageSize
      this.getUserData()
    },
    userModalOk() {
      this.user.departmentId = this.department.id
      addUser(this.user).then(res => {
        this.$Message.success("添加成功")
        this.userModal = false;
        this.getUserData()
        this.clearUser()
      })
    },
    clearUser() {
      this.user.username = ''
      this.user.nickname = ''
      this.user.sex = 1
      this.user.avatar = ''
      this.user.email = ''
      this.user.mobile = ''
      this.user.departmentId = 0
    },
    //新建同级部门
    handleAddDepartment(pid, title) {
      this.departmentModal.show = true
      this.departmentModal.department.pid = pid
      this.departmentModal.title = title
    },
    addDepartmentOk() {
      addDepartment(this.departmentModal.department).then(res => {
        this.$Message.success("添加部门成功")
        this.getTree()
        this.departmentModal.show = false
        //清空
        this.departmentModal.department.name = ''
        this.departmentModal.department.pid = ''
        this.departmentModal.department.description = ''
        this.departmentModal.department.rank = 1
      })
    },
    //人员导入
    handleImportUser() {
      // this.$Message.warning("待开发")
      this.importUserModal.show = true
      this.importUserModal.error = []
      this.importUserModal.message = ''
    },
    importUserOk() {
      //todo 执行上传文件 this.importUserModal.file
      let formData = new FormData()
      formData.append('file', this.importUserModal.file)
      importUser(formData).then(res => {
        this.importUserModal.message = res.message
        if (res.code === responseCode.IMPORT_USER_ERROR) {
          this.importUserModal.error = res.data
        } else {
          this.importUserModal.error = []
          // this.$Notice.success({
          //   title: '导入人员成功',
          //   desc: `${res.message}`,
          //   duration: 5
          // });
        }
      })
    },
    handleUpload(file) {
      this.importUserModal.file = file;
      return false;
    }



    // //tab栏点击事件
    // handleTabClick(name) {

    // }

  }

}
</script>

<style lang="less"  scoped>
.file-tip {
  font-weight: bold;
}
.message-wrapper {
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
    color: #ed4014;
  }
  p {
    font-weight: bold;
  }
}
</style>

