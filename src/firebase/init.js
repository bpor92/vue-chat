import firebase from 'firebase'
import 'firebase/firestore'
import firebaseConfig from './config'

const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.firestore().settings({ timestampsInSnapshots: true })

export default firebaseApp.firestore()
