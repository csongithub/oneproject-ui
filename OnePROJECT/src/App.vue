<template>
  <main class="container-fluid main-canvas">
    <div id="app">
      <section class="app-main">
        <nav-bar/>
      </section>
    </div>
  </main>
</template>

<script>
import NavBar from './components/nav/NavBar.vue'
export default {
  name: 'App',
  components: {
    'nav-bar': NavBar
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="css">
@import "../node_modules/font-awesome/css/font-awesome.min.css";
@import "../src/assets/style/comon-custom.css";
.app-main {
  padding-top: 30px;
}

.main-canvas {
  min-height: 100vh;
  max-height: calc(100vh - 90px);
  margin: 0 auto;
  background-color:rgba(0, 87, 125, 0.16);
}
</style>
