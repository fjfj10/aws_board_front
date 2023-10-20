// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD_h4bzxt05hzcxX2nySNkL5OWajHUn6vM",
    authDomain: "board-bab5a.firebaseapp.com",
    projectId: "board-bab5a",
    storageBucket: "board-bab5a.appspot.com",
    messagingSenderId: "746411888354",
    appId: "1:746411888354:web:6165a3a8aa9db1992ed8bb",
    measurementId: "G-RHCWTEKQ16"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);