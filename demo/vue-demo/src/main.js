// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import MeScroll from '../static/mescroll'
import '../static/mescroll.css'
Vue.config.productionTip = false
Vue.use(MeScroll)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
