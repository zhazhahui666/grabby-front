<template>
  <div class="document-wrapper">
    <div v-show="currentAction === 'view' || currentAction === 'preview'">
      <div class="header">

        <div class="title">
         <Icon type="md-document" size="35" />
          <H2> {{document.title}}</H2>
        </div>
        <div class="btn-wrapper">
          <Button type="primary" @click="currentAction='edit'">编辑</Button>
        </div>
      </div>
      <div class="content">
        <div v-html="document.content"></div>
      </div>
    </div>
    <div v-show="currentAction === 'edit'">
      <div class="header">
        <div class="title">
          <Icon type="md-document" size="35" />
          <span>文档标题：</span>
          <input v-model="document.title" placeholder="请输入文档标题" style="width: 300px"
          />
        </div>

        <div class="btn-wrapper">
          <Button type="primary" @click="currentAction = 'preview'">预览</Button>
          <Button @click="commit">提交</Button>
          <Button>草稿</Button>
        </div>

      </div>
      <div class="editor-wrapper">
        <vue-ueditor-wrap v-model="document.content" :config="myConfig"></vue-ueditor-wrap>
      </div>
    </div>
  </div>

</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module

import { getDetail, saveOrUpdate } from '@/api/document'


export default {
  components: {
    VueUeditorWrap
  },
  data() {
    return {
      currentAction: 'view',
      documentId: '',
      document: {
        id: "",
        title: '',
        content: '',
        directory: ''
      },
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 800,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        // serverUrl: 'http://35.201.165.105:8000/controller.php',
        serverUrl: '/api/file/ueditor',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: '/UEditor/',
        // headers:{
        //   accessToken:"11111111"
        // }
        webAppKey: 'OjTOw5alYfSNvxZgqLepXfls5kMKlGmd', //百度地图的appKey
        headers: {
          accessToken: ''
        }
      }
    }
  },
  mounted() {
    this.document.id = this.$route.query.id
    this.currentAction = this.$route.query.action
    this.myConfig.headers.accessToken = this.getToken()
    this.init()

  },
  methods: {
    init() {
      getDetail(this.document.id).then(res => {
        this.document = Object.assign({}, res.data)
      })
    },
    commit() {
      saveOrUpdate(this.document).then(res => {
        this.$Message.success("提交成功")
        this.currentAction = 'preview'
      })
    }


  }

}
</script>

<style lang="less"  scoped>
.document-wrapper {
  font: initial;
}
.header {
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #dadada;
  padding: 20px 0 5px 10px;
  display: flex;

  .title {
    display: flex;
    align-items: flex-end;
    span {
      font-size: 15px;
    }
  }
  span {
    font-weight: 500;
  }
  input {
    height: 25px;
    padding-left: 5px;
    font-weight: bold;
  }
  .btn-wrapper {
    position: absolute;
    right: 10px;
  }
}
.content {
  position: absolute;
  top: 50px;
  padding: 10px;
  bottom: 0px;
  left: 0px;
  overflow: scroll;
}
</style>
