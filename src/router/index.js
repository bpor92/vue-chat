import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Chat from '@/components/Chat'
import User from '@/components/User'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
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
        },
        {
          path: '/user/:login',
          name: 'User',
          component: User,
        },
      ]
    },
    {
    path: '*',
    redirect: '/'
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
        name: 'Login'
      })
    }
  } else {
    next()
  }
})

export default router
