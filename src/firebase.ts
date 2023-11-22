// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { doc, getFirestore, setDoc } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBeF8dZQvpvkqV03HCB1dpIthZVBwJ4qkw',
    authDomain: 'twot-4beac.firebaseapp.com',
    databaseURL: 'https://twot-4beac-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'twot-4beac',
    storageBucket: 'twot-4beac.appspot.com',
    messagingSenderId: '12860156642',
    appId: '1:12860156642:web:6b6ba8ef83cb90e4420cbb',
    measurementId: 'G-2JQ4X9GGJB'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const analytics = getAnalytics(app)
export const db = getFirestore(app)

auth.onAuthStateChanged(function (user) {
    // update avatar for every logind
    if (user) {
        const docRef = doc(db, 'users', user.uid)
        setDoc(docRef, {
            avatar: user.photoURL,
            name: user.displayName,
            email: user.email
        })
    }
})
