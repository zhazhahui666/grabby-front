<template>
  <div>
    <card>
      <!-- 搜索区域 -->
      <Row>用户名：
        <Input v-model="searchForm.name" placeholder="请输入用户名" style="width: auto"/>
        <Button type="primary" @click="handSearch">搜索</Button>
      </Row>
      <Divider style="margin:12px 0"/>
      <row class="row">
        <Button type="primary" class="action-btn" icon="md-add" @click="handAdd">新增模型</Button>
      </row>

      <!-- 数据表格 -->
      <Row>
        <Table border :columns="columns" :data="dataList"></Table>
      </Row>

      <!-- 分页 -->
      <Row type="flex" justify="end" class="page">
        <Page
          :total="totalCount"
          size="small"
          show-elevator
          show-sizer
          show-total
          @on-change="changePage"
          @on-page-size-change="changePageSize"
        />
      </Row>
    </card>

    <Modal width="1400" :styles="{top: '0'}" v-model="modal">
      <iframe
        id="iframe"
        :src="modelerUrl"
        frameborder="0"
        width="100%"
        height="800px"
        scrolling="auto"
      ></iframe>
    </Modal>
  </div>
</template>

<script>
import { getModelPage, createModel } from "@/api/activiti";
import { formatDate } from "@/libs/date";

export default {
  mounted() {
    //TODO 默认显示总部详情
    this.init();
  },
  data() {
    return {
      searchForm: {
        pageNumber: 1,
        pageSize: 10
      },
      modal: false,
      modelerUrl: "",
      dataList: [],
      totalCount: 0,
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
          title: "key",
          key: "key",
          width: 270
        },
        {
          title: "版本",
          key: "version",
          align: "center",
          width: 80
        },
        {
          title: "创建时间",
          key: "createTime",
          align: "center",
          render(h, params) {
            return h(
              "span",
              formatDate(params.row.createTime, "yyyy-MM-dd hh:mm")
            );
          }
        },
        {
          title: "更新时间",
          key: "lastUpdateTime",
          align: "center",
          render(h, params) {
            return h(
              "span",
              formatDate(params.row.lastUpdateTime, "yyyy-MM-dd hh:mm")
            );
          }
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 280,
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    icon: "md-build"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showModel(params);
                    }
                  }
                },
                "模型设计"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    icon: "md-checkmark-circle"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.handPass(params);
                    }
                  }
                },
                "发布"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    icon: "md-trash"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    init() {
      this.getData();
    },
    getData() {
      getModelPage(this.searchForm).then(res => {
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
    handSearch() {
      //todo
    },
    showModel(params) {
      this.modal = true;
      this.modelerUrl = `//127.0.0.1:8080/modeler.html?modelId=${
        params.row.id
      }&time=${new Date().getTime()}`;
    },
    handAdd() {
      createModel().then(res => {
        this.$Message.success("创建模型成功");
        this.getData();
      });
    }
  }
};
</script>

<style>
</style>
