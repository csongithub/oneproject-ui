<template>
  <div>
    <div v-if="!authenticated">
      <login @login="getLoginStatus" />
      <!-- <footer class="d-flex flex-col justify-content-center">
        <small id="appSubFooter">COPYRIGHT &copy; 2019 OnePROJECT, INC. ALL RIGHTS RESERVED.</small>
      </footer> -->
    </div>
    <div v-if="authenticated" class="container-fluid" :style="'min-height: 100vh'">
      <div id="app">
        <section class="app-main">
          <nav-bar/>
        </section>
      </div>
      <footer class="d-flex flex-col justify-content-center mt-15">
        <small  class="mt-2" id="appSubFooter">COPYRIGHT &copy; 2019 OnePROJECT, INC. ALL RIGHTS RESERVED.</small>
      </footer>
    </div>
  </div>

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
  },
  created () {
    this.authenticated = false
  }
}
</script>
<style lang="css">
@import "../node_modules/font-awesome/css/font-awesome.min.css";
@import "../src/assets/style/comon-custom.css";
</style>
