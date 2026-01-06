import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Na kara wannan
import { getFirestore } from "firebase/firestore"; // Na kara wannan
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- DOLE KA SAKA WADANNAN DOMIN SAURAN PAGES SU GAN SU ---
export const auth = getAuth(app); // Don Login
export const db = getFirestore(app); // Don Database (Users, Students etc.)
export const analytics = getAnalytics(app);

export default app;