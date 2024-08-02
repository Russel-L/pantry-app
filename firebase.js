// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdu5Op0TnEV5EQscWQEIW8PA1Jip4Hyx8",
  authDomain: "headstarter-pantry-56de1.firebaseapp.com",
  projectId: "headstarter-pantry-56de1",
  storageBucket: "headstarter-pantry-56de1.appspot.com",
  messagingSenderId: "704185294351",
  appId: "1:704185294351:web:0d5f75fd195bd591ac8d7a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {app, firestore};