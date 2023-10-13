import { initializeApp } from "firebase/app"; //app
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; //authentication
import { getFirestore } from "firebase/firestore"; //fire store

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCd_OZu9Ew29z-qDrVaOUGVIhxx1DjrVlY",
  authDomain: "bill-manager-38ca3.firebaseapp.com",
  projectId: "bill-manager-38ca3",
  storageBucket: "bill-manager-38ca3.appspot.com",
  messagingSenderId: "408812410453",
  appId: "1:408812410453:web:fe91d0839e4c8a62b3e6dc",
  measurementId: "G-X14HHQPHRN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//initialize database

const auth = getAuth(app);
const fireStore = getFirestore(app);

console.log(app.name); // "[DEFAULT]"

export { app, auth, fireStore };
