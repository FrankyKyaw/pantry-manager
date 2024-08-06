// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import dotenv from 'dotenv';
import config from "./firebaseConfig";
dotenv.config();



// const firebaseConfig = {
//   apiKey: "AIzaSyBmaY9iNcDwAlVtTZ9g29JXwuEw1dn_JCA",
//   authDomain: "pantry-management-b0536.firebaseapp.com",
//   projectId: "pantry-management-b0536",
//   storageBucket: "pantry-management-b0536.appspot.com",
//   messagingSenderId: "770911901457",
//   appId: "1:770911901457:web:2b5c98a6c2b8adf367deb0",
//   measurementId: "G-JQ319FR0V8"
// };

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(config.firebase);
const firestore = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { firestore, auth, provider, signInWithPopup, signOut };