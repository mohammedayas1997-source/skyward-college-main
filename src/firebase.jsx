// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBv-zKXx2on0QXPbqRp5j5YxIUSkCwPQ50",
  authDomain: "skyward-college-main.firebaseapp.com",
  projectId: "skyward-college-main",
  storageBucket: "skyward-college-main.firebasestorage.app",
  messagingSenderId: "725637791570",
  appId: "1:725637791570:web:092bb19c5e6b0fc5ffc48b",
  measurementId: "G-V80H690PR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);