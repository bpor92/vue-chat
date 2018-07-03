import Vue from 'vue'
import db from '../../firebase/init'

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
  initUsersList({commit, state}, payload){
    db.collection('users').get().then(collection => {
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
