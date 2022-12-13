// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/app';
import { getDatabase } from "firebase/database";
import 'firebase/storage';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQrELzAV59epg_H32Rk4LMiUoEWJa5yx0",
  authDomain: "scrowbazzar.firebaseapp.com",
  projectId: "scrowbazzar",
  storageBucket: "scrowbazzar.appspot.com",
  messagingSenderId: "198815809844",
  appId: "1:198815809844:web:553a3de72397d012f1e561",
  measurementId: "G-ZJK2NRJTL6"
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);
const db = getDatabase(app);
export const storage = getStorage(app)
export default db;
