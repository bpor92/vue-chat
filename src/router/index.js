import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'
import Welcome from '@/components/Welcome'
import Home from '@/components/Home'
import Chat from '@/components/Chat'

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
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/chat',
          name: 'Chat',
          component: Chat,
        }
      ]
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
