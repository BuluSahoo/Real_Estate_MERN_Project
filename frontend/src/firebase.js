// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-mern-project.firebaseapp.com",
  projectId: "real-estate-mern-project",
  storageBucket: "real-estate-mern-project.appspot.com",
  messagingSenderId: "981912929569",
  appId: "1:981912929569:web:d2f92ffea117fb86852a60"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);