import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueGamepad from 'vue-gamepad';

Vue.use(VueGamepad);

Vue.config.productionTip = false
Vue.config.silent = true

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
