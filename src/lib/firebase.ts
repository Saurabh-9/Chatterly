import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbtCi_LE9XD36u2jUcEzwJehjE8S0zoCM",
  authDomain: "chatapp-3b156.firebaseapp.com",
  projectId: "chatapp-3b156",
  storageBucket: "chatapp-3b156.firebasestorage.app",
  messagingSenderId: "399169663801",
  appId: "1:399169663801:web:2825aae85f7f493beb6ee8",
  measurementId: "G-BQ34F44C3B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);