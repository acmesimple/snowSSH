import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'index',
      path: '/',
      component: require('@/components/index').default
    },
    {
      name: 'ssh',
      path: '/ssh/:k',
      component: require('@/components/ssh').default
    },
    {
      name: 'web',
      path: '/web',
      component: require('@/components/web').default
    },
    {
        name: 'mdb',
        path: '/mdb',
        component: require('@/components/mdb').default
    }
  ]
})
