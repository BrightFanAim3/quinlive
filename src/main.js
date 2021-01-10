import Vue from 'vue'
import App from './App.vue'
import './global.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'video.js/dist/video-js.css'
import axios from 'axios'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.prototype.$axios = axios

axios.defaults.timeout = 5000 // 请求超时

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
