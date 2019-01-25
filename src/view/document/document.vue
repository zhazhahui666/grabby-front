<template>
  <div>
    <card>
      <row>

        <Col span="3">
        <Tree :data="treeData" @on-select-change="selectChange"></Tree>
        </Col>
        <Col span="21">
        <!-- 搜索区域 -->
        <!-- <Row>
          用户名：
          <Input v-model="searchForm.name" placeholder="请输入用户名" style="width: auto"></Input>
          <Button type="primary" @click="handSearch">搜索</Button>
        </Row>
        <Divider style="margin:12px 0" /> -->

        <!-- 数据表格 -->
        <Row>
          <Table border :columns="columns" :data="dataList">
            <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px" @click="showDocument(row,'view')">查看</Button>
              <Button type="error" size="small" @click="showDocument(row,'edit')">编辑</Button>
            </template>
          </Table>
        </Row>
        <!-- 分页 -->
        <Row type="flex" justify="end" class="page">
          <Page :total="totalCount" size="small" show-elevator show-sizer show-total @on-change="changePage"
            @on-page-size-change="changePageSize" />
        </Row>
        </Col>
      </row>
    </card>
  </div>

</template>

<script>

import { getDirectoryTree, getPage } from '@/api/document'

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
      treeData: [],
      currentDir: {
        id: ''
      },
      columns: [
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '目录',
          key: 'directoryName'
        }, {
          title: '创建人',
          key: 'createUser'
        }, {
          title: '创建日期',
          key: 'createTime'
        },
        {
          title: '修改时间',
          key: 'updateTime'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }]
    }
  },
  methods: {
    init() {
      this.initTree()
      this.getData()
    },
    initTree() {
      getDirectoryTree().then(res => {
        this.treeData = this.transfer2Tree(res.data)
      })
    },
    transfer2Tree(dataList) {
      let res = []
      if (dataList && dataList.length) {
        res = dataList.map(item => {
          let temp = {}
          temp.id = item.id
          temp.title = item.name
          if (item.children && item.children.length) {
            temp.children = this.transfer2Tree(item.children)
          }
          return temp
        })
      }
      return res
    },
    getData() {
      let params = Object.assign({}, this.searchForm)
      params.dirId = this.currentDir.id
      getPage(params).then(res => {
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
    //树节点改变事件
    selectChange(selectedList, currentDir) {
      this.currentDir.id = currentDir.id
      this.getData()
    },
    showDocument(row, action) {
      console.log(row);
      let url = `/document-edit?id=${row.id}&action=${action}`
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;

      window.open(url, "_blank", "top=0,left=0,height=" + (screenHeight - 90) + ",width="+screenWidth+",status=no,scrollbars=yes,toolbar=yes,menubar=no,location=no");

    }


  }
}
</script>

<style>
</style>
