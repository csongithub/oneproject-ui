<template>
    <div id = "main">
      <label style="margin-left:45%">{{footerText}}</label>
    </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      footerText: 'copyright@OnePROJECT'
    }
  },
  methods: {
  },
  mounted () {
  },
  watch: {
  }
}
</script>
<style scoped>
#main{
  background-color:aliceblue;
}
</style>
