// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics'
import { FirebaseOptions, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
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
export const storage = getStorage(app)
export const rtdb = getDatabase(app)
// export const appCheck = initializeAppCheck(app, {
//     provider: new ReCaptchaV3Provider('6Lc1_h8pAAAAAD6QuqbiqGnpVaN1xf3ZwbY_xzda'),
//     isTokenAutoRefreshEnabled: true
// })
