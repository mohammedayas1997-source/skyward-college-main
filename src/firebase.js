// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBv-zKXx2on0QXPbqRp5j5YxIUSkCwPQ50",
  authDomain: "skyward-college-main.firebaseapp.com",
  projectId: "skyward-college-main",
  storageBucket: "skyward-college-main.firebasestorage.app",
  messagingSenderId: "725637791570",
  appId: "1:725637791570:web:092bb19c5e6b0fc5ffc48b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);