<template>
  <div>
    <card>
      <row>
        <Col span="4">
        <row class="row">
          <Input suffix="ios-search" v-model="searchForm.dictName" placeholder="请输入名称搜索" @on-change="searchDict"
          />
        </row>
        <Alert show-icon>
          当前选择：
          <span style="margin-right:5px">{{currentDict.name}}</span>
          <a v-if="currentDict.name" @click="clearCurrentDict">清空</a>
        </Alert>
        <!-- 数据表格 -->
        <Row>
          <div class="dict-side-left">
            <Table border :columns="columns" :data="dataList" :height="height" @on-current-change="handleCurrentChange"
              highlight-row ref="dictTable" />
          </div>
        </Row>
        <!-- 分页 -->
        <Row type="flex" justify="end" class="page">
          <Page size="small" @on-change="changePage" />
        </Row>
        </Col>
        <Col span="20" class="col-right">
        <row class="row row-action">
          <Button type="primary" class="action-btn" icon="md-create" @click="handleEditDict('edit')">编辑字典</Button>
          <Button type="primary" class="action-btn" icon="md-add" @click="handleEditDict('add')">添加字典</Button>
          <Button type="primary" icon="md-add">添加选项</Button>
        </row>
        <!-- <Divider style="margin:12px 0" /> -->
        <Table border :columns="optionPage.columns" :data="optionPage.dataList" :loading="loading"
        />

        </Col>
      </row>
    </card>

    <Modal v-model="dictModal" @on-ok="dictModalOk" :loading="true" title="编辑字典" ok-text="提交">
      <Form :model="dictForm" :label-width="80">
        <FormItem label="名称：">
          <Input v-model="dictForm.name" style="width: 300px"></Input>
        </FormItem>
        <FormItem label="字典code：">
          <Input v-model="dictForm.dictCode" style="width: 300px"></Input>

        </FormItem>
        <FormItem label="排序：">
          <!-- <Input v-model="dictForm.rank" style="width: 300px"></Input> -->
          <InputNumber :max="1000" :min="1" :step="1.2" v-model="dictForm.rank || 1"></InputNumber>
        </FormItem>
        <FormItem label="描述：">
          <Input v-model="dictForm.description" style="width: 300px" type="textarea" :rows="3"></Input>
        </FormItem>

      </Form>
    </Modal>

  </div>

</template>

<script>

import { getTree, getPage, getOptionByCode, saveOrUpdateDict } from '@/api/dict'

export default {
  mounted() {
    //TODO 默认显示总部详情

    this.init()
  },
  data() {
    return {
      loading: false,
      dictModal: false,
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
        rank: '',
        description: ''
      },
      dictForm: {
        id: "",
        dictCode: '',
        name: '',
        rank: '',
        description: ''
      },
      dataList: [],
      // height:
      columns: [
        {
          title: '字典类别',
          key: 'name'
        }
      ],
      optionPage: {
        columns: [
          {
            title: '类别名称',
            key: 'dictName'
          },
          {
            title: '选项名称',
            key: 'name'
          },
          {
            title: '排序',
            key: 'rank'
          },
          {
            title: '状态',
            key: 'state'
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
      // this.currentDict.id = ''
      // this.currentDict.name = ''
      // this.currentDict.dictCode = ''
      // let a = Object.ownKeys(this.currentDict.dictCode)
      this.clearObj(this.currentDict)
      this.$refs.dictTable.clearCurrentRow();

    },
    //字典input事件
    searchDict() {
      this.getData()
    },
    //提交dict modal表单提交
    dictModalOk() {
      // let data = {}
      // data.id = this.dictForm.id
      // data.name = this.dictForm.name
      // data.description = this.dictForm.description
      // data.rank = this.dictForm.rank
      // data.dictCode = this.dictForm.dictCode
      saveOrUpdateDict(this.dictForm).then(res => {
        this.$Message.success("提交成功")
        this.dictModal = false
        this.getData()
      })
    },
    handleEditDict(action) {
      if (action === 'add') {
        this.clearObj(this.dictForm)
      } else {
        if (!this.currentDict.id) {
          this.$Message.warning("请选择一个字典进行编辑")
          return
        }
        this.dictForm = Object.assign(this.dictForm, this.currentDict)
      }
      this.dictModal = true
      
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
</style>
