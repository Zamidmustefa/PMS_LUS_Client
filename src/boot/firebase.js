import firebase from 'firebase/compat/app';
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/functions"
import "firebase/compat/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCoQ5VIki-QIDxZudEUdNG9b689aQSx_ig",
    authDomain: "pms-lus-22f3a.firebaseapp.com",
    projectId: "pms-lus-22f3a",
    storageBucket: "pms-lus-22f3a.appspot.com",
    messagingSenderId: "855918826084",
    appId: "1:855918826084:web:7de518618eac33b13cc571",
    measurementId: "G-ESK5WJP7TV"
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);