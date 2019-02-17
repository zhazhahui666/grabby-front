<template>
  <div>
    <card>
      <row>
        <Col span="4">
        <row class="row">
          <Input suffix="ios-search" v-model="searchForm.dictName" placeholder="请输入名称搜索"
            @on-change="searchDict" />
        </row>
        <Alert show-icon>
          当前选择：
          <span style="margin-right:5px">{{currentDict.name}}</span>
          <a v-if="currentDict.name" @click="clearCurrentDict">清空</a>
        </Alert>

        <!-- 数据表格 -->
        <Row>
          <div class="dict-side-left">
            <Table :columns="columns" :data="dataList" :height="height" @on-current-change="handleCurrentChange"
              highlight-row ref="dictTable">

              <!-- <template slot-scope="{ row, index }" slot="action">
                <Icon type="md-open" title="编辑" size="18" color="#2d8cf0" class="action-icon"
                  @click="handleEditDict('edit')" />
              </template> -->
            </Table>
          </div>
        </Row>
        <!-- 分页 -->
        <Row type="flex" justify="end" class="page">
          <Page size="small" @on-change="changePage" />
        </Row>
        </Col>
        <Col span="20" class="col-right">
        <row class="row row-action">
          <Button type="primary" icon="md-add" @click="handleOptionAction('add')">添加选项</Button>
        </row>
        <!-- <Divider style="margin:12px 0" /> -->
        <Table :columns="optionPage.columns" :data="optionPage.dataList"
          :loading="loading">
          <template slot-scope="{ row, index }" slot="action">

            <Icon type="md-open" title="编辑" size="18" color="#2d8cf0" class="action-icon"
              @click="handleOptionAction('edit',row)" />
            <Icon type="md-checkmark-circle-outline" title="启用" size="18"
              color="#19be6b" class="action-icon" @click="handleOptionAction('enable',row)"
            />
            <Icon type="ios-close-circle-outline" title="禁用" size="18" color="#ed4014"
              class="action-icon" @click="handleOptionAction('disable',row)"
            />
            <Icon type="md-trash" title="删除" size="18" class="action-icon"
              @click="handleOptionAction('delete',row)" />
          </template>
        </Table>

        </Col>
      </row>
    </card>

    <Modal v-model="optionModal" @on-ok="optionModalOk" loading
      :title="optionTitle" ok-text="提交" draggable>
      <Form :model="currentOption" :label-width="80">
        <FormItem label="名称：">
          <Input v-model="currentOption.name" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="字典：">
          <!-- <Input v-model="currentDict.name" style="width: 300px"></Input> -->
          <span>{{currentDict.name}}</span>
        </FormItem>
        <FormItem label="值(value)：">
          <Input v-model="currentOption.value" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="排序：">
          <!-- <Input v-model="dictForm.rank" style="width: 300px"></Input> -->
          <InputNumber :max="1000" :min="0" :step="0.8" v-model="currentOption.rank"></InputNumber>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="dictModal" @on-ok="dictModalOk" loading
      :title="dictTitle" ok-text="提交">
      <Form :model="dictForm" :label-width="80">
        <FormItem label="名称：">
          <Input v-model="dictForm.name" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="字典code：">
          <Input v-model="dictForm.dictCode" style="width: 300px"></Input>

        </FormItem>
        <FormItem label="排序：">
          <!-- <Input v-model="dictForm.rank" style="width: 300px"></Input> -->
          <InputNumber :max="1000" :min="0" :step="0.8" v-model="dictForm.rank"></InputNumber>
        </FormItem>
        <FormItem label="描述：">
          <Input v-model="dictForm.description" style="width: 300px" type="textarea"
            :rows="3"></Input>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="deleteOptionModal" title="选项删除" @on-ok="deleteOptionOk" loading>
      <p>确认要删除『{{this.currentOption.name}}』吗？数据删除后将不可恢复</p>
    </Modal>

  </div>

</template>

<script>

import { getTree, getPage, getOptionByCode, saveOrUpdateDict, saveOrUpdateOption, deleteOption } from '@/api/dict'

export default {
  mounted() {
    //TODO 默认显示总部详情

    this.init()
  },
  data() {
    return {
      loading: false,
      dictModal: false,
      optionModal: false,
      deleteOptionModal: false,
      dictTitle: "新增字典",
      optionTitle: "新增选项",
      // dictModalLoding: true,
      searchForm: {
        dictName: '',
        pageNumber: 1,
        pageSize: 10
      },
      height: window.innerHeight - 162 - 39 - 110,
      currentDict: {
        id: "",
        dictCode: '',
        name: '',
        rank: 0,
        description: ''
      },
      currentOption: {
        id: '',
        name: '',
        dictId: '',
        value: '',
        rank: 0
      },
      dictForm: {
        id: "",
        dictCode: '',
        name: '',
        rank: 0,
        description: ''
      },
      dataList: [],
      // height:
      columns: [
        {
          title: '字典名称',
          key: 'name',
          renderHeader: (h, params) => {
            return h('div', [
              h('strong', params.column.title),
              h('div', {
                style: {
                  position: 'absolute',
                  right: '5px',
                  top: '5px',
                },
                'class': { 'action-icon': true }
              }, [
                  h('Icon', {
                    props: {
                      type: "md-open",
                      size: "16",
                      color: "#2d8cf0"
                    },
                    attrs: {
                      title: "编辑字典",
                    },
                    on: {
                      click: () => {
                        this.handleEditDict('edit')
                      }
                    }
                  }),
                  h('Icon', {
                    props: {
                      type: "md-add",
                      title: "编辑",
                      size: "16",
                      color: "#2d8cf0"
                    },
                    attrs: {
                      title: "添加字典",
                    },
                    on: {
                      click: () => {
                        // this.show(params.index)
                        this.handleEditDict('add')
                      }
                    }
                  })
                ]),

            ]);
          }
        },

      ],
      optionPage: {
        columns: [
          {
            title: '字典名称',
            key: 'dictName'
          },
          {
            title: '选项名称',
            key: 'name'
          },
          {
            title: '值(value)',
            key: 'value'
          },
          {
            title: '排序',
            key: 'rank'
          },
          {
            title: '状态',
            key: 'state'
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
            align: 'center'
          }
        ],
        dataList: [],
      }
    }
  },
  methods: {
    init() {
      // this.initTree()
      this.getData()
      this.getOptionData()
    },

    getData() {
      getPage(this.searchForm).then(res => {
        if (res.data.records && res.data.records.length > 0) {
          this.dataList = res.data.records
          this.totalCount = res.data.total
        } else {
          this.dataList = []
          this.totalCount = 0
        }
      })
    },
    getOptionData() {
      this.loading = true
      getOptionByCode(this.currentDict.dictCode).then(res => {
        if (res.data && res.data.length > 0) {
          this.optionPage.dataList = res.data
        } else {
          this.optionPage.dataList = []
        }
        this.loading = false
      })
    },
    changePage(pageNumber) {
      this.searchForm.pageNumber = pageNumber
      this.getData()
    },

    handSearch() {
      //todo
    },

    handleCurrentChange(currentRow, oldCurrentRow) {
      Object.assign(this.currentDict, currentRow)
      // this.currentDict.id = currentRow.id
      // this.currentDict.dictCode = currentRow.dictCode
      // this.currentDict.name = currentRow.name
      this.getOptionData()
    },
    //清空字典选择
    clearCurrentDict() {
      this.clearObj(this.currentDict)
      this.$refs.dictTable.clearCurrentRow();
    },
    //字典input事件
    searchDict() {
      this.getData()
    },
    //提交dict modal表单提交
    dictModalOk() {
      saveOrUpdateDict(this.dictForm).then(res => {
        this.$Message.success("提交成功")
        this.dictModal = false
        this.getData()
      })
    },
    //编辑或修改选项
    optionModalOk() {
      this.currentOption.dictId = this.currentDict.id
      saveOrUpdateOption(this.currentOption).then(res => {
        this.$Message.success("提交成功")
        this.optionModal = false
        this.getOptionData()
      })
    },
    //字典编辑
    handleEditDict(action) {
      if (action === 'add') {
        this.clearObj(this.dictForm)
        this.dictTitle = "添加字典"
      } else {
        if (!this.currentDict.id) {
          this.$Message.warning("请选择一个字典进行编辑")
          return
        }
        this.dictTitle = "编辑字典"
        this.dictForm = Object.assign(this.dictForm, this.currentDict)
      }
      this.dictModal = true
    },
    //字典选项操作
    handleOptionAction(action, row) {
      Object.assign(this.currentOption, row)
      switch (action) {
        case 'edit':
          this.optionTitle = "编辑选项"
          this.optionModal = true
          break;
        case 'add':
          if (!this.currentDict.id) {
            this.$Message.warning("请先选择一个字典")
            return;
          }
          this.optionTitle = "新增选项"
          this.clearObj(this.currentOption)
          this.optionModal = true
          break;
        case 'enable':
          this.$Message.warning("开发中")
          break;
        case 'disable':
          this.$Message.warning("开发中")
          break;
        case 'delete':
          this.deleteOptionModal = true;
          break;
      }
    },
    deleteOptionOk() {
      deleteOption(this.currentOption.id).then(res => {
        this.$Message.success("删除成功");
        this.getOptionData()
        this.deleteOptionModal = false
      })
    }
  }
}
</script>

<style lang='less'>
.dict-side-left {
  .ivu-table-tbody tr {
    cursor: pointer;
  }
}
.col-right {
  padding-left: 10px;
}
.action-dict {
  display: flex;
  .btn-wrapper {
    flex: 1;
  }
  .btn {
    flex: 1;
  }
}
</style>
