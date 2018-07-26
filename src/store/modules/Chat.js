import Vue from 'vue'
import db from '@/firebase/init'
import router from "@/router/index"
import moment from 'moment'

const state = {
  loader: true,
  chatID: null,
  conversation: []
}

const getters = {
  getConversation: state => state.conversation
}

const mutations = {
  initConversation(state, payload) {
    state.conversation.push(payload)
  },
  chatID(state, payload) {
    Vue.set(state, 'chatID', payload)
  },
  clearConversation(state, payload) {
    state.conversation = []
  },
  loader(state, payload) {
    Vue.set(state, 'loader', payload)
  }
}

const actions = {
  initConversation({commit, state}, payload){
    commit('chatID', payload)
    let ref = db.collection('chat').doc(payload).collection('conversation').orderBy('timestamp')
    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let doc = change.doc
        if (change.type === "added") {
          let conversation = {
            name: doc.data().name,
            message: doc.data().message,
            timestamp: moment(doc.data().timestamp).format('lll')
          }
          commit('initConversation', conversation)
        }
      })
      commit('loader', false)
    })
  },
  initChat({commit}, payload) {
    commit('loader', true)
    commit('clearConversation')
  },
  sendMessage({commit, rootState, state}, payload){
    db.collection('chat').doc(state.chatID).collection('conversation').add({
      message: payload,
      name: rootState.User.user.login,
      timestamp: Date.now()
    }).catch(err => {
      console.log(err)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
