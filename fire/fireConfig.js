import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYB6Ur3jfRl83kVOqfgvEP7AGpK0B9_JY",
  authDomain: "aylusirvinesuite.firebaseapp.com",
  projectId: "aylusirvinesuite",
  storageBucket: "aylusirvinesuite.appspot.com",
  messagingSenderId: "385538358332",
  appId: "1:385538358332:web:d030c2c9862b58396b9739",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = firebase.auth();
const fire = firebase;

export { auth, db, fire };
