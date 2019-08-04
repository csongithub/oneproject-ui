// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import 'bootstrap-css-only/css/bootstrap.min.css'
// import 'mdbvue/build/css/mdb.css'
import App from './App'
import router from './router'
import Vuelidate from 'vuelidate'

// importing bootstrap vue packages
import BootstrapVue from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// importing awn for awesome notifications
import VueAWN from 'vue-awesome-notifications'

import numFormat from 'vue-filter-number-format'
import VueHtmlToPaper from 'vue-html-to-paper'

import Multiselect from 'vue-multiselect'

import IdleVue from 'idle-vue'
import VueSession from 'vue-session'
import ToggleButton from 'vue-js-toggle-button'
Vue.use(VueSession)
Vue.use(ToggleButton)
Vue.component('multiselect', Multiselect)

const eventsHub = new Vue()
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 60000 // prod idle logout time, uncomment this during production
})

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}

Vue.use(VueHtmlToPaper, options)

// exposing bootstrap
Vue.use(BootstrapVue)

// exporting vuelidate
Vue.use(Vuelidate)
// exposing AWN to be used for showing notifications. available functions are
Vue.use(VueAWN, {position: 'top-right', duration: 3000, icons: {'icons.success': 'check-circle'}})
require('vue-awesome-notifications/dist/styles/style.css')
require('vue-multiselect/dist/vue-multiselect.min.css')

Vue.filter('numFormat', numFormat)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  data () {
    return {
      messageStr: 'Hello'
    }
  },
  onIdle () {
  },
  onActive () {
  },
  template: '<App/>'
})
