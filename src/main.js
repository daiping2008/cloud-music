import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
// import fastclick from 'fastclick'

import './assets/styles/index.styl'

// fastclick.attach(document.body)

Vue.config.productionTip = false
Vue.use(VueLazyload, {
  loading: require('./assets/images/default.png')
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
