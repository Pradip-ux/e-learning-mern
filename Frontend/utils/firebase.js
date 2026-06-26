// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginskillnest-e803f.firebaseapp.com",
  projectId: "loginskillnest-e803f",
  storageBucket: "loginskillnest-e803f.firebasestorage.app",
  messagingSenderId: "677816921252",
  appId: "1:677816921252:web:04ec6c5e5566a4f370ca31"
};
console.log("KEY:", import.meta.env.VITE_FIREBASE_APIKEY);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth,provider}