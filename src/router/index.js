import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'
import Welcome from '@/components/Welcome'
import Dashboard from '@/components/Dashboard'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    }
  ]
})


router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    let user = firebase.auth().currentUser
    if (user) {
      next()
    } else {
      next({
        name: 'Welcome'
      })
    }
  } else {
    next()
  }
})

export default router
