<template>
  <div>

    <List :list='list' :render="renderFunc"></List>

    <Tag type="dot" closable color="primary">标签一</Tag>

    <Icon type="md-add" />

     <Upload action="/api/file/upload" :headers="accessToken">
        <Button icon="ios-cloud-upload-outline" >Upload files</Button>
    </Upload>

     <Upload
        ref="upload"
        :show-upload-list="false"
        :format="['jpg','jpeg','png','gif']"
        :max-size="5120"
        type="drag"
        action="//127.0.0.1:8080/file/upload"
        :headers="accessToken"
        style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
          <Icon type="md-camera" size="20"></Icon>
      </div>
  </Upload>

    

  </div>
</template>
<script>
import List from '_c/list'
export default {
  components: {
    List
  },
  data() {
    return {
      list: [
        { name: 'lisonn' },
        { name: 'lili' }
      ],
      accessToken:{},
      dataList: [
        {
          id: 1,
          name: '菜单1',
          processDefinitionDtos: [
            {
              id: 11,
              name: "菜单1-1"
            },
            {
              id: 12,
              name: "菜单1-2"
            }
          ]
        },
        {
          id: 2,
          name: '菜单2',
          processDefinitionDtos: [
            {
              id: 21,
              name: "菜单2-1"
            },
            {
              id: 22,
              name: "菜单2-2"
            }
          ]
        }

      ]
    }
  },
  methods: {
    renderFunc(h, name) {
      //render函数
      // return h('i', {
      //   style: {
      //     color: 'pink'
      //   }
      // },name)

      //jsx
      return (
        <i on-click={this.handClick} style={{ color: 'pink' }}>{name}</i>
      )

    },
    handClick(e) {
      console.log(e)
    }
  },
  mounted(){
    this.accessToken = {
      accessToken:this.getToken()
    }
  }
}

</script>


<style lang="less" scoped>
</style>

