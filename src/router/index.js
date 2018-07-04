import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Chat from '@/components/Chat'
import User from '@/components/User'
import Settings from '@/components/Settings'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        requiresGuest: true
      }
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
        {
          path: '/settings',
          name: 'Settings',
          component: Settings,
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
  }else if(to.matched.some(rec => rec.meta.requiresGuest)) {
    let user = firebase.auth().currentUser
    if (user) {
      next({
        name: 'Home',
        redirect: to.fullPath
      })
  } else {
    next()
  }
  }else {
    next()
  }
})

export default router
