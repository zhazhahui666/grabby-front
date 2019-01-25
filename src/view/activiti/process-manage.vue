<template>
  <div>
    <card>
      <Row>
        <Col span="3">
        <Menu :active-name="currentProcess.id" style="height:90vh" :open-names="openName"
          v-if="dataList && dataList.length" width="100%" @on-select="MenuSelectChange">
          <Submenu :name="item.id" v-for="(item,index) in dataList" :key="index" >
            <template slot="title" >
              <Icon type="ios-folder-open-outline" /> {{item.name}}
            </template>
            <div v-if="item.processDefinitionDtos">
              <MenuItem :name="def.id" v-for="def in item.processDefinitionDtos"
                :key="def.id" style="padding:7px 35px">
              <Icon type="md-document" /> {{def.name}}
              </MenuItem>
            </div>
          </Submenu>
        </Menu>
        </Col>
        <Col span="21" class="right-col">
        <Tabs v-model="tabSelect">
          <TabPane label="基本设置" icon="logo-apple" name="info">
            <Button type="primary" @click="handDeploy">发布</Button>
          </TabPane>
          <TabPane label="图形编辑" icon="logo-tux" name="diagram">
            <iframe id="iframe" :src="modelerUrl" frameborder="0" width="100%"
              height="800px" scrolling="auto"></iframe>
          </TabPane>
          <TabPane label="节点设置" icon="logo-windows" name="node">
            <!-- 数据表格 -->
            <Row>
              <Table :columns="nodeConfig.columns" :data="nodeConfig.dataList"></Table>
            </Row>

            <!-- 分页 -->
            <Row type="flex" justify="end" class="page">
              <Page :total="nodeConfig.totalCount" size="small" show-elevator
                show-sizer show-total @on-change="changeNodePage"
                @on-page-size-change="changeNodePageSize" />
            </Row>

          </TabPane>
          <TabPane label="出口规则" icon="logo-tux" name="export">
            出口规则功能是对流程的流向进行条件控制，待开发中
          </TabPane>

          <Button type="error" v-if="this.currentProcess" icon="md-trash" slot="extra"
            @click="deleteProcessModal = true" style="margin-right:10px">删除流程</Button>
          <Button type="primary" icon="md-add" slot="extra" @click="showProcessModal">添加流程</Button>
        </Tabs>
        </Col>
      </Row>
    </card>

    <Modal v-model="handlerModel" title="操作人设置" loading @on-ok="setHandlerOk"
      @on-cancel="setHandlerCancel" :closable="false" ok-text="保存">

      <Form :model="nodeConfig.currentNode" :label-width="80">
        <FormItem label="节点名称：">
          <span>{{nodeConfig.currentNode.actName}}</span>
        </FormItem>
        <FormItem label="角色选择：">
          <Select style="width:200px" label-in-value v-model="nodeConfig.roleSelectId"
            filterable remote clearable :remote-method="getRoleList" @on-change="selectRoleChange"
            :loading="nodeConfig.loading">
            <Option v-for="(role, index) in nodeConfig.roleList" :value="role.id"
              :key="role.id">{{role.name}}</Option>
          </Select>
        </FormItem>

      </Form>
      <!-- <div class="add-action">
        <Button type="primary" icon="md-add">添加</Button>
      </div> -->
      <Row>
        <Col span="21"> 已选择『{{this.nodeConfig.selectHandlers.length}}』位操作者
        </Col>
        <Col span="3">
        <Button type="primary" icon="md-add" @click="handAddHandler">添加</Button>
        </Col>
      </Row>

      <Divider style="margin:12px 0" />
      <!-- 选中数据表格 -->
      <Row>
        <Table :columns="nodeConfig.roleColumns" :data="nodeConfig.selectHandlers"></Table>
      </Row>

    </Modal>

    <Modal v-model="processModal" title="流程添加" loading @on-ok="addProcessOk">
      <Form :model="process" :label-width="80">
        <FormItem label="名称：">
          <Input v-model="process.name" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="类别：">
          <Select v-model="process.categoryId" style="width:300px">
            <Option v-for="item in dataList" :value="item.id" :key="item.id">{{
              item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="deleteProcessModal" title="流程删除" loading @on-ok="deleteProcessOk">
      确定要删除『{{this.currentProcess.name}}』流程吗？删除后记录将不可恢复!!!
    </Modal>

  </div>

</template>

<script>

import {  getProcesscategory, getActNodes,
  updateActNodeHandler, addProcess,
  deployProcess, deleteProcess} from '@/api/activiti'
import { getRolePage } from '@/api/role'

export default {

  mounted() {
    //TODO 默认显示总部详情
    this.init()
  },
  data() {
    return {
      dataList: [],
      treeData: [],
      processCategoryId: 1,
      tabSelect: 'node',
      handlerModel: false,
      modelerUrl: '',
      process: {
        name: '',
        categoryId: ''
      },
      currentProcess: {},
      openName: [],
      processModal: false,
      deleteProcessModal: false,
      nodeConfig: {
        searchForm: {
          pageNumber: 1,
          pageSize: 10
        },
        currentNode: {},
        handler: {},
        roleList: [],
        roleSelectId: '',
        roleSelect: {},
        loading: false,
        totalCount: 0,
        dataList: [],
        columns: [
          {
            title: '节点名称',
            key: 'actName'
          },
          {
            title: '节点类型',
            key: 'actType'
          },
          {
            title: '操作者',
            key: 'handlerName'
          },
          {
            title: '表单(未开发)',
            key: 'form'
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
                    icon: 'md-settings'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showHandlerModel(params)
                    }
                  }
                }, '操作者'),
              ])
            }
          }
        ],
        selectHandlers: [],
        roleColumns: [
          {
            title: 'ID',
            key: 'handler'
          },
          {
            title: '名称',
            key: 'handlerName'
          },
          {
            title: '类型',
            key: 'handlerType'
          },
          {
            title: '会签',
            key: 'type'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',

            render: (h, params) => {
              return h('Icon', {
                style: {
                  cursor: 'pointer'
                },
                props: {
                  size: '12',
                  type: 'md-trash',
                },
                on: {
                  click: () => {
                    this.spliceSelectHandler(params)
                  }
                }
              })
            }
          }
        ]
      }
    }
  },
  methods: {
    init() {
      this.getData()
    },
    initTabContent() {
      getActNodes({
        processId: this.currentProcess.id,
        pageNumber: this.nodeConfig.searchForm.pageNumber,
        pageSize: this.nodeConfig.searchForm.pageSize
      }).then(res => {
        if (res.data.records && res.data.records.length > 0) {
          this.nodeConfig.dataList = res.data.records
          this.nodeConfig.totalCount = res.data.total
        } else {
          this.nodeConfig.dataList = []
          this.nodeConfig.totalCount = 0
        }
      })
    },
    getData() {
      getProcesscategory().then(res => {
        this.dataList = res.data
        if (this.dataList && this.dataList.length
          && this.dataList[0].processDefinitionDtos
          && this.dataList[0].processDefinitionDtos.length) {
          this.openName.push(this.dataList[0].id)
          this.currentProcess = this.dataList[0].processDefinitionDtos[0]
          this.modelerUrl = `//127.0.0.1:8080/modeler.html?modelId=${this.currentProcess.modelId}&time=${new Date().getTime()}&accessToken=${this.getToken()}`
          this.initTabContent()
        }
      })
    },

    changeNodePageSize() {

    },
    changeNodePage() {

    },
    showHandlerModel(params) {
      this.nodeConfig.currentNode = params.row
      this.handlerModel = true
      if (params.row.handler) {
        let handler = {}
        handler.handlerType = 2 //角色
        handler.handler = params.row.handler
        handler.handlerName = params.row.handlerName
        //清空原来的数组
        let tempArray = this.nodeConfig.selectHandlers
        tempArray.splice(0, this.nodeConfig.selectHandlers.length)
        tempArray.push(handler)
      }
    },
    setHandlerOk() {
      //提交selectHandlers到后台
      let temp = Object.assign({ handlerType: '', handler: '', handlerName: '' }, this.nodeConfig.selectHandlers[0])
      temp.nodeConfigId = this.nodeConfig.currentNode.id
      updateActNodeHandler(temp).then(res => {
        this.$Message.success("更新成功")
        this.handlerModel = false
      })
      //todo 请求后台失败的情况可能不会清空
      this.nodeConfig.selectHandlers = []
      this.initTabContent()
    },
    setHandlerCancel() {
      //清空
      this.nodeConfig.selectHandlers = []
      this.handlerModel = false
    },
    handAddHandler() {
      if (!this.nodeConfig.roleSelectId) {
        this.$Message.error("请选择一个角色")
        return
      }
      let handlers = this.nodeConfig.selectHandlers
      if (handlers && handlers.length == 1) {
        this.$Message.warning("目前只支持添加一个")
        return
      }
      if (handlers.length) {
        for (let i = 0; i < handlers.length; i++) {
          if (handlers[i].handler === this.nodeConfig.roleSelect.handler) {
            this.$Message.warning("已存在，请勿重复添加")
            return
          }
        }
      }
      handlers.push(this.nodeConfig.roleSelect)
      this.nodeConfig.roleSelectId = ''
    },
    getRoleList(query) {
      if (query !== '') {
        this.nodeConfig.loading = true
        getRolePage({ name: query, pageSize: 10, pageNumber: 1 }).then(res => {
          if (res.data.records && res.data.records.length > 0) {
            this.nodeConfig.roleList = res.data.records
          } else {
            this.nodeConfig.roleList = []
          }
          this.nodeConfig.loading = false
        })
      }
    },
    selectRoleChange(params) {
      if (params) {
        let handler = {}
        handler.handlerType = 2 //角色
        handler.handler = params.value
        handler.handlerName = params.label
        this.nodeConfig.roleSelect = handler
      }
    },
    spliceSelectHandler(params) {
      this.nodeConfig.selectHandlers.splice(params.index, 1)
    },
    showProcessModal() {
      this.processModal = true
    },
    addProcessOk() {
      let temp = {}
      temp.processName = this.process.name
      temp.categoryId = this.process.categoryId
      addProcess(temp).then(res => {
        this.processModal = false;
        this.$Message.success("添加成功")
        this.getData()
      })
    },
    //左侧菜单点击
    MenuSelectChange(processId) {
      this.dataList.forEach((item, index) => {
        let process = item.processDefinitionDtos.find(el => el.id === processId)
        if (process) {
          this.currentProcess = process
          this.modelerUrl = `//127.0.0.1:8080/modeler.html?modelId=${process.modelId}&time=${new Date().getTime()}&accessToken=${this.getToken()}`
        }
      })
      this.initTabContent()
    },
    handDeploy() {
      //流程发布
      deployProcess(this.currentProcess.id).then(res => {
        this.$Message.success("发布成功")
      })
    },
    //删除流程
    deleteProcessOk() {
      deleteProcess(this.currentProcess.id).then(res => {
        this.$Message.success("删除成功")
        this.deleteProcessModal = false
        this.getData()
      })
    }
  }

}
</script>

<style>
.right-col {
  padding: 0 12px;
}
.add-action {
  display: flex;
  flex-direction: row-reverse;
}
</style>
