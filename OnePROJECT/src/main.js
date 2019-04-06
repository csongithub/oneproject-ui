// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuelidate from 'vuelidate'

// importing bootstrap vue packages
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// importing awn for awesome notifications
import VueAWN from 'vue-awesome-notifications'

// importing font awesom packages
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faCogs, faTasks, faCreditCard, faTruck, faMale, faBars, faListAlt, faIdCard, faPlus, faFilter, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// exposing icon from font awesom library
// library.add(faCogs, faTasks, faCreditCard, faTruck, faMale, faBars, faListAlt, faIdCard, faPlus, faFilter, faPencilAlt, faTrashAlt)
// Vue.component('font-awesome-icon', FontAwesomeIcon)

// exposing bootstrap
Vue.use(BootstrapVue)

// exporting vuelidate
Vue.use(Vuelidate)
// exposing AWN to be used for showing notifications. available functions are
Vue.use(VueAWN, {position: 'top-right', duration: 3000, icons: {'icons.success': 'check-circle'}})
require('vue-awesome-notifications/dist/styles/style.css')

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

export const config = new Vue({
  data: {
    SERVER_URL: 'http://localhost:8001/'
    // SERVER_URL: 'http://13.233.102.181:8001/'
  }
})
