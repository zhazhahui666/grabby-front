<template>

  <div style="height:100%">
    <iframe :src="apiUrl" frameborder="0" width="100%" height="100%" scrolling="auto"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apiUrl: ''
    }
  },
  mounted() {
    this.apiUrl = `//127.0.0.1:8080/swagger-ui.html#/`
  }


}
</script>

<style>
</style>
