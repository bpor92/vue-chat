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
  getAllFriends: state => state.friends,
  getFriends: state => state.friends.filter(friend => friend.confirm),
  getFriendsRequest: state => state.friends.filter(friend => friend.confirm === false && friend.ownRequest === false),
  getUsersList: state => state.usersList,
  getUserLogin: state => state.user.login
}

const mutations = {
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
  sendFriendRequest({commit, state}, payload) {
    let userRef = db.collection('users').doc(payload.document)
    const friends = payload.friends
    friends.push({id: payload.requestUserId, confirm: payload.confirm, login: payload.login, ownRequest: payload.ownRequest})
    return userRef.update({
      friends
    })
  },
  logout() {
    firebase.auth().signOut().then(() => {
      router.go({ name: 'Login' });
    });
  },
  setFriendRequest({commit, dispatch, state}, payload) {
    dispatch('sendFriendRequest', {...payload, requestUserId: state.user.id, login: state.user.login, ownRequest: false, confirm: false})
    dispatch('sendFriendRequest', {friends: JSON.parse(JSON.stringify(state.friends)), confirm: false, ownRequest: true, requestUserId: payload.requestUserId, document: state.user.login, login: payload.document})
  },
  initUsersList({commit, state}){
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
  },
  acceptFriendRequest({commit, dispatch, state}, payload){
    const friendRef = db.collection('users').doc(payload.login)
    const friendRefArr = friendRef.get().then(item => {
      let friends = item.data().friends
      let friendFromRequest = friends.filter(user => user.login === state.user.login)
      let friendFromRequestIndex = friends.findIndex(user => user.login === state.user.login)

      db.collection("chat").add({conversation: []}).then(function(docRef) {
        friends[friendFromRequestIndex] = Object.assign({}, ...friendFromRequest, {confirm: true, chatID: docRef.id})
        friendRef.update({
          friends
        })

        dispatch('confirmRequest', {login: payload.login, chatID: docRef.id})
      })

    })
  },
  confirmRequest({commit, state}, payload) {
    const userRef = db.collection('users').doc(state.user.login)
    const userRefArr = userRef.get().then(item => {
      let friends = item.data().friends
      let friendFromRequest = friends.filter(user => user.login === payload.login)
      let friendFromRequestIndex = friends.findIndex(user => user.login === payload.login)
      friends[friendFromRequestIndex] = Object.assign({}, ...friendFromRequest, {confirm: true, chatID: payload.chatID})
      userRef.update({
        friends
      })
    })
  },
  declineFriendRequest({commit, state}, payload){

  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
