<template>
  <main class="container-fluid main-canvas">
    <div id="app">
      <section class="app-main">
        <nav-bar/>
      </section>
    </div>
    <footer-comp/>
  </main>
</template>

<script>
import NavBar from './components/nav/NavBar.vue'
import Footer from './components/nav/Footer'
export default {
  name: 'App',
  components: {
    'nav-bar': NavBar,
    'footer-comp': Footer
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
  background-color:rgba(0, 87, 125, 0.16);
}
</style>
