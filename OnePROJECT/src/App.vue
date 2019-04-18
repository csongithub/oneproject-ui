<template>
  <main class="container-fluid" :style="authenticated ? 'min-height: 100vh':''">
    <div id="app">
      <login @login="getLoginStatus" v-if="!authenticated"/>
      <section class="app-main">
        <nav-bar v-if="authenticated"/>
      </section>
    </div>
    <footer class="d-flex flex-col justify-content-center mt-15">
      <small  class="mt-2" id="appSubFooter">COPYRIGHT &copy; 2019 OnePROJECT, INC. ALL RIGHTS RESERVED.</small>
    </footer>
  </main>
</template>

<script>
import NavBar from './components/nav/NavBar.vue'
import login from './components/nav/Login'
export default {
  name: 'App',
  components: {
    'nav-bar': NavBar,
    login
  },
  data () {
    return {
      authenticated: false
    }
  },
  methods: {
    getLoginStatus: function (obj) {
      if (obj.status) {
        this.authenticated = true
      }
    }
  },
  mounted () {
    // this.authenticated = false
  },
  created () {
    this.authenticated = false
  }
}
</script>
<style lang="css">
@import "../node_modules/font-awesome/css/font-awesome.min.css";
@import "../src/assets/style/comon-custom.css";
.app-main {
  padding-top: 30px;
}
</style>
