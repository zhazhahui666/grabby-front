<template>
  <Card>
    <p slot="title">基本信息</p>
    <Form :model="user" :label-width="80">
      <FormItem label="用户名：">
        <span>{{user.username}}</span>
        <!-- <Input v-model="user.username" style="width: 200px"></Input> -->
      </FormItem>
      <FormItem label="头像：">
        <div class="upload-list" v-if="user.avatar">
          <template>
            <img :src="user.avatar">
            <div class="upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </template>
        </div>
        <Upload action="/api/file/upload" :headers="accessToken" :on-success="handleUploadSuccess"
          :show-upload-list="false" :on-format-error="handleFormatError" :format="['jpg','jpeg','png']"
          style="display: inline-block;width:58px;" type="drag">
          <div class="camera-box">
            <Icon type="md-camera" size="20"></Icon>
          </div>
        </Upload>
      </FormItem>
      <FormItem label="昵称：">
        <Input v-model="user.nickname" style="width: 200px"></Input>
      </FormItem>
      <FormItem label="性别：">
        <RadioGroup v-model="user.sex">
          <Radio :label=1>男</Radio>
          <Radio :label=2>女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="邮箱：">
        <Input v-model="user.email" style="width: 200px"></Input>
      </FormItem>
      <FormItem label="手机：">
        <Input v-model="user.mobile" style="width: 200px"></Input>
      </FormItem>
      <FormItem label="创建时间：">
        <span>{{user.createTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
      </FormItem>
      <FormItem>
        <Button type="primary" class="action-btn" @click="handleSave" size="default">
          保存
        </Button>
      </FormItem>

    </Form>

  </Card>
</template>

<script>
import {
  getStore
} from '@/libs/util'
import {
  selfUpdate
} from '@/api/user'

export default {
  mounted() {
    const userInfo = JSON.parse(getStore('userInfo'))
    Object.assign(this.user, userInfo)
    // this.user.username = userInfo.username
    // this.user.nickname = userInfo.nickname
    // this.user.avatar = userInfo.avatar
    // this.user.email = userInfo.email
    // this.user.sex = userInfo.sex
    // this.user.mobile = userInfo.mobile
    // this.user.createTime = userInfo.createTime
    this.accessToken = {
      accessToken: this.getToken()
    }
  },
  methods: {
    handleSave() {
      let temp ={avatar:'',sex:'',email:'',mobile:''}
      temp.avatar = this.user.avatar
      temp.sex = this.user.sex
      temp.email = this.user.email
      temp.mobile = this.user.mobile
      temp.nickname = this.user.nickname
      console.log(temp);
      selfUpdate(temp).then(res => {
        this.$Message.success('更新成功')
      })
    },
    handleUploadSuccess(res, file) {
      if (res.success) {
        this.user.avatar = res.data
      } else {
        this.$Message.error(res.message)
      }
    },
    handleFormatError(file) {
      this.$Message.error("只支持'jpg','jpeg','png'格式的文件")
    }
  },
  data() {
    return {
      user: {
        username: '',
        nickname: '',
        sex: 0,
        avatar: '',
        email: '',
        mobile: '',
        createTime: ''
      },
      accessToken: {},
      uploadFinish: false
    }
  }
}
</script>

<style>
.upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}

.upload-list img {
  width: 100%;
  height: 100%;
}

.upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}

.upload-list:hover .upload-list-cover {
  display: block;
}

.upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}

.camera-box {
  width: 58px;
  height: 58px;
  line-height: 58px;
}
</style>