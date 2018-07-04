import Vue from 'vue'
import db from '@/firebase/init'
import firebase from 'firebase/app'
import router from "@/router/index"

const state = {
  user: {
    id: null,
    friends: [],
    login: ''
  },
  usersList: []
}

const getters = {
  getUserFriends: state => state.user.friends,
  getUsersList: state => state.usersList
}

const mutations = {
  SET_USER(state, payload){
    Vue.set(state, 'user', payload)
  },
  INIT_USERS_LIST(state, payload) {
    Vue.set(state, 'usersList', payload)
  }
}
const actions = {
  setUser({commit}, payload){
    commit('SET_USER', payload)
  },
  initUserDetails({commit, dispatch}, payload){
    const loggedUserDetails = firebase.auth().currentUser
    db.collection('users').where('id', '==', loggedUserDetails.uid).get().then(snapshot => {
      snapshot.forEach(user => {
        const data = user.data()
        dispatch('setUser', { ...data, login: user.id})
      })
    })
  },
  initUsersList({commit, state}, payload){
    return db.collection('users').get().then(collection => {
      let usersList = collection.docs.map(user => user.id).filter(user => user !== state.user.login)
      commit('INIT_USERS_LIST', usersList)
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
