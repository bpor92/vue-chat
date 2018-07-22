<template>
  <div>
    test {{id}}
  </div>
</template>

<script>
export default {
  props: ['id'],
  created() {
    const chatID = this.$route.params
    debugger
  }
}
</script>

