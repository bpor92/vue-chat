import firebase from 'firebase'
import firestore from 'firebase/firestore'


const config = {
  apiKey: "AIzaSyDa4VUUlfITmiGSG8aOLJI0e1hj-ejIMxw",
  authDomain: "vue-chat-app-3079d.firebaseapp.com",
  databaseURL: "https://vue-chat-app-3079d.firebaseio.com",
  projectId: "vue-chat-app-3079d",
  storageBucket: "vue-chat-app-3079d.appspot.com",
  messagingSenderId: "16182428003"
};
const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({ timestampsInSnapshots: true })

export const db = firebaseApp.firestore()
export default firebaseApp

