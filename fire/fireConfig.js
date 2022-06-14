import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.A1,
  authDomain: process.env.A2,
  projectId: process.env.A3,
  storageBucket: process.env.A4,
  messagingSenderId: process.env.A5,
  appId: process.env.A6,
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = firebase.auth();
const fire = firebase;

export { auth, db, fire };
