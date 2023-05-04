import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWTo3wSODQjVDJVSnPXzu4ah3MlLAjVsE",
  authDomain: "astral-d3ff5.firebaseapp.com",
  projectId: "astral-d3ff5",
  storageBucket: "astral-d3ff5.appspot.com",
  messagingSenderId: "404637096308",
  appId: "1:404637096308:web:b70f799ee61e66c9b0b421",
  measurementId: "G-K2P8EFFST0",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
