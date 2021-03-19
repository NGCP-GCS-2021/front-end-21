import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import ERU from '../views/ERU.vue'
import MEA from '../views/MEA.vue'
import MAC from '../views/MAC.vue'
import Geofence from '../views/Geofence.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    props: true,
  },
  {
    path: '/mac',
    name: 'MAC',
    component: MAC,
    props: true,
  },
  {
    path: '/eru',
    name: 'ERU',
    component: ERU,
    props: true,
  },
  {
    path: '/mea',
    name: 'MEA',
    component: MEA,
    props: true,
  },
  {
    path: '/geofence',
    name: 'Geofence',
    component: Geofence
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
