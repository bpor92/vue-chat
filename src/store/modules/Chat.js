import Vue from 'vue'
import db from '@/firebase/init'
import firebase from 'firebase/app'
import router from "@/router/index"

const state = {
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
  }
}

const actions = {
  initConversation({commit, state}, payload){
    commit('chatID', payload)


    let ref = db.collection('chat').doc(payload).collection('conversation')

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let doc = change.doc
        if (change.type === "added") {
          let conversation = {
            name: doc.data().name,
            message: doc.data().message,
            timestamp: doc.data().timestamp
          }
          commit('initConversation', conversation)
        }
      })

    })




  },
  sendMessage({commit, state}, payload){
    db.collection('chat').doc(state.chatID).collection('conversation').add({
      message: payload.message,
      name: 'TEST',
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
