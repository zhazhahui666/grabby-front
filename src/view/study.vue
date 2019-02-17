<template>
  <div>

   <Icon type="ios-add-circle-outline" />
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