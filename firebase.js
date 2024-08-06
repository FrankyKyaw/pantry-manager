// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmaY9iNcDwAlVtTZ9g29JXwuEw1dn_JCA",
  authDomain: "pantry-management-b0536.firebaseapp.com",
  projectId: "pantry-management-b0536",
  storageBucket: "pantry-management-b0536.appspot.com",
  messagingSenderId: "770911901457",
  appId: "1:770911901457:web:2b5c98a6c2b8adf367deb0",
  measurementId: "G-JQ319FR0V8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { firestore, auth, provider, signInWithPopup, signOut };