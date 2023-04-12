// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { serverTimestamp } from 'firebase/firestore'
import { getDatabase, onValue, ref, child, get } from 'firebase/database'
import {
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBDcaObFOMRtE396HHkOHcnPNi1ZV8LsKg',
  authDomain: 'neon-hn.firebaseapp.com',
  projectId: 'neon-hn',
  storageBucket: 'neon-hn.appspot.com',
  messagingSenderId: '557115107795',
  appId: '1:557115107795:web:91cf67970fa04507ffa726',
  measurementId: 'G-G7K8TJN4PB',
  databaseURL: 'https://neon-hn-default-rtdb.asia-southeast1.firebasedatabase.app/',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);
const storage = getStorage(app)
const auth = getAuth(app)
const timestamp = serverTimestamp(app)
const db = getDatabase(app)
export { auth, storage, timestamp, db, ref, onValue }

export async function signInWithFacebook() {
  const provider = new FacebookAuthProvider()
  try {
    return await signInWithPopup(auth, provider)
  } catch (error) {
    console.error(error)
  }
}
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  try {
    return await signInWithPopup(auth, provider)
  } catch (error) {
    console.error(error)
  }
}

export async function signIn(email, password) {
  // eslint-disable-next-line no-useless-catch
  try {
    return signInWithEmailAndPassword(auth, email, password)
  } catch (e) {
    throw e
  }
}

const dbRef = ref(getDatabase())

export async function getFirebaseOrders() {
  try {
    const snapshot = await get(child(dbRef, `orders`))
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      console.log('No order available')
    }
  } catch (error) {
    console.error(error)
  }
}

export async function getFirebaseUsers() {
  try {
    const snapshot = await get(child(dbRef, `users`))
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      console.log('No order available')
    }
  } catch (error) {
    console.error(error)
  }
}
