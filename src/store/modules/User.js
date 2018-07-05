import Vue from 'vue'
import db from '@/firebase/init'
import firebase from 'firebase/app'
import router from "@/router/index"

const state = {
  user: {
    id: null,
    login: ''
  },
  friends: [],
  usersList: []
}

const getters = {
  getFriends: state => state.friends,
  getUsersList: state => state.usersList
}

const mutations = {
  SET_USER(state, payload){
    Vue.set(state, 'user', payload)
  },
  SET_USER_LOGIN(state, payload){
    Vue.set(state.user, 'login', payload)
  },
  SET_USER_ID(state, payload){
    Vue.set(state.user, 'id', payload)
  },
  SET_FRIENDS(state, payload) {
    Vue.set(state, 'friends', payload)
  },
  USERS_LIST(state, payload) {
    Vue.set(state, 'usersList', payload)
  },
}
const actions = {
  setUser({commit}, payload){
    commit('SET_USER', payload)
  },
  initUserDetailsWithFriends({commit}, payload){
    const loggedUserDetails = firebase.auth().currentUser
    let ref = db.collection('users').where('id', '==', loggedUserDetails.uid)
    return new Promise(resolve => {
      ref.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          let doc = change.doc
          if (change.type === "added" || change.type === "modified") {
            commit('SET_FRIENDS', doc.data().friends)
            commit('SET_USER_ID', doc.data().id)
            commit('SET_USER_LOGIN', doc.id)
          }
          resolve()
        })
      })
    })

  },
  getUserDetailsByLogin({commit, state}, payload){
    let userRef = db.collection('users').doc(payload)
    return userRef.get().then(user => {
      return user.data()
    })
  },
  updateUser({commit, state}, payload) {
    let userRef = db.collection('users').doc(payload.login)
    const friends = payload.friends
    friends.push({id: state.user.id, confirm: false})
    return userRef.update({
      friends
    })
  },
  logout({commit}, payload) {
    firebase.auth().signOut().then(() => {
      router.go({ name: 'Login' });
    });
  },
  initUsersList({commit, state}, payload){
    let users = []
    let ref = db.collection('users')

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let doc = change.doc
        if (change.type === "added" && doc.id !== state.user.login) {
          users.push(doc.id)
        }
      })
      commit('USERS_LIST', users)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
