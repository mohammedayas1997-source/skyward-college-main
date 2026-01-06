import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBv-zKXx2on0QXPbqRp5j5YxIUSkCwPQ50",
  authDomain: "skyward-college-main.firebaseapp.com",
  projectId: "skyward-college-main",
  storageBucket: "skyward-college-main.firebasestorage.app",
  messagingSenderId: "725637791570",
  appId: "1:725637791570:web:092bb19c5e6b0fc5ffc48b",
  measurementId: "G-V80H690PR4"
};

const app = initializeApp(firebaseConfig);

// GYARA: Cire analytics na farkon nan, bar guda daya kawai a kasa
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app); // Guda daya kacal

export default app;