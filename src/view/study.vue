<template>
  <div>

    <Tree :data="data2" show-checkbox></Tree>
    <Button type="primary" @click="handleClick">点击</Button>
    <img src="http://192.168.0.100:8080/act-process/get-process-image/125041?accessToken=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqaW5nbGkxIiwiZXhwIjoxNTQ3Nzg3OTM4fQ.TMEEtzvek2dvlxz0rZa-A8yCCLfv5azFTTpTH75tKR57mgRcnM0BPVINiV-JFURTKFitjXnulRTg3KkvgdkXMg" alt="">
  </div>

</template>
<script>
export default {
  data() {
    return {
      data2: [
        {

          title: 'parent 1',
          expand: true,
          children: [
            {

              title: 'parent 1-1',
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1'
                },
                {
                  title: 'leaf 1-1-2'
                }
              ]
            },
            {
              title: 'parent 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1'
                },
                {
                  title: 'leaf 1-2-1'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleClick() {
      let Vue = this
      this.data2.forEach((item, index) => {
        item.children.forEach((node, i) => {
          if (node.title === 'parent 1-2') {
            node.checked = true
            Vue.$set(item.children, i, node)
          }
        })
      })
      // this.data2 = []
    }
  }
}
</script>