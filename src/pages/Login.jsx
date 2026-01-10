import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Mail, Lock, Hash, Loader2, AlertCircle, ChevronRight, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Can be Email or Student ID
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let emailToAuth = identifier.trim();

      // 1. DYNAMIC IDENTITY RESOLVER (Strict Staff/Student Logic)
      if (!identifier.includes("@")) {
        // STUDENT PATH: Requires ID Number if no @ is present
        const studentId = identifier.toUpperCase().trim();
        const q = query(collection(db, "users"), where("idNumber", "==", studentId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("Student ID number not found. Contact Admin.");
        }
        
        // Fetch the linked email for the student from Firestore
        emailToAuth = querySnapshot.docs[0].data().email;
      } else {
        // STAFF PATH: If @ exists, it must be an official Staff Email
        if (!identifier.toLowerCase().endsWith("@skyward.edu.ng")) {
          throw new Error("Official @skyward.edu.ng email required for staff.");
        }
      }

      // 2. FIREBASE AUTHENTICATION
      const userCredential = await signInWithEmailAndPassword(auth, emailToAuth, password);
      const user = userCredential.user;

      // 3. ROLE & STATUS BASED ACCESS CONTROL (RBAC)
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // CHECK IF ACCOUNT IS ACTIVE
        if (userData.status !== "active") {
          await signOut(auth); // Log them out immediately
          throw new Error("Account is inactive. Please contact the Administrator.");
        }

        const role = userData.role.toLowerCase().trim();

        // Store role in localStorage
        localStorage.setItem("userRole", role);
        localStorage.setItem("isAuth", "true");

        // 4. SMART REDIRECTION ENGINE
        const routes = {
          student: "/portal/dashboard",
          admin: "/admin/dashboard",
          staff: "/staff/dashboard",
          rector: "/portal/rector",
          proprietor: "/portal/proprietor",
          accountant: "/admin/accountant",
          "exam-officer": "/admin/exam-office",
          admission: "/admin/admission-officer"
        };

        const targetRoute = routes[role] || "/";
        navigate(targetRoute, { replace: true });

      } else {
        throw new Error("Access denied. User profile missing.");
      }

    } catch (err) {
      console.error("Login Error:", err.code);
      let message = "Login failed. Please check your credentials.";
      
      if (err.code === "auth/invalid-credential") {
        message = "Incorrect Password or Identity.";
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#001524] italic tracking-tighter">
            SKYWARD <span className="text-red-600">PORTAL</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-2 italic">Unified Authentication</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3 border border-red-100">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#001524] uppercase ml-4 tracking-widest">
                {identifier.includes("@") ? "Staff Official Email" : "Student ID Number"}
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-4 text-slate-300 group-focus-within:text-red-600 transition-colors">
                  {identifier.includes("@") ? <Mail size={18} /> : <Hash size={18} />}
                </div>
                <input 
                  type="text" required
                  placeholder={identifier.includes("@") ? "name@skyward.edu.ng" : "SKW/2026/001"}
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-sm font-bold outline-none ring-2 ring-transparent focus:ring-red-600/10 focus:bg-white border border-slate-100 transition-all shadow-inner"
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#001524] uppercase ml-4 tracking-widest">Security Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-4 text-slate-300 group-focus-within:text-red-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required placeholder="••••••••"
                  className="w-full bg-slate-50 p-4 pl-12 pr-12 rounded-2xl text-sm font-bold outline-none ring-2 ring-transparent focus:ring-red-600/10 focus:bg-white border border-slate-100 transition-all shadow-inner"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-300 hover:text-red-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#001524] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>Authorize Access <ChevronRight size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;