import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; 
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"; 
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff, Hash } from "lucide-react";

const UnifiedLogin = () => {
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const clearSession = async () => {
      try {
        await signOut(auth);
        localStorage.clear();
      } catch (err) {
        console.error("Logout error", err);
      }
    };
    clearSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let emailToAuth = "";
      const input = identifier.trim();

      // 1. Staff Identifier Logic
      if (input.includes("@")) {
        emailToAuth = input;
      } 
      // 2. Student Identifier (Find Email using Student ID)
      else {
        const studentId = input.toUpperCase();
        const q = query(collection(db, "users"), where("idNumber", "==", studentId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("Invalid Student ID. Please check and try again.");
        }
        emailToAuth = querySnapshot.docs[0].data().email;
      }

      // --- FIREBASE AUTHENTICATION ---
      const userCredential = await signInWithEmailAndPassword(auth, emailToAuth, password);
      const user = userCredential.user;

      // --- ROLE & STATUS BASED ROUTING ---
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // ACCOUNT STATUS CHECK
        if (userData.status !== "active") {
          await signOut(auth);
          throw new Error("Access Denied: This account is currently inactive. Please contact the administrator.");
        }

        const role = userData.role?.toLowerCase().trim();
        localStorage.setItem("userRole", role);
        localStorage.setItem("isAuth", "true");

        // Routing Configuration
        const routes = {
          rector: "/rector/dashboard",
          proprietor: "/proprietor/dashboard",
          accountant: "/accountant/dashboard",
          admission: "/admission/dashboard",
          exam: "/exam/dashboard",
          news_admin: "/news/admin",
          staff: "/staff/portal",
          student: "/student/dashboard",
          admin: "/admin/dashboard"
        };

        const targetPath = routes[role];
        
        if (targetPath) {
          navigate(targetPath, { replace: true });
        } else {
          throw new Error("Access Denied: Your role does not have an assigned dashboard.");
        }
      } else {
        throw new Error("User profile not found in database.");
      }
    } catch (err) {
      console.error("Login Error:", err.code);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
        setError("Invalid login details. Please check your Email/ID and Password.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] font-sans text-left relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-red-50 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px]" />

      <div className="w-full max-w-[460px] p-6 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-[#002147] uppercase tracking-tighter italic">
            SKYWARD <span className="text-red-600">PORTAL</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-3 italic">
             {identifier.includes("@") ? "Staff Access Point" : "Student Access Point"}
          </p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-[0_30px_70px_-10px_rgba(0,33,71,0.1)] border border-slate-100 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-600 rounded-t-full"></div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3 border border-red-100 animate-in fade-in duration-300">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">
                {identifier.includes("@") ? "Email Address" : "Student ID Number"}
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-5 text-slate-300 group-focus-within:text-red-600 transition-colors">
                  {identifier.includes("@") ? <Mail size={18} /> : <Hash size={18} />}
                </div>
                <input 
                  type="text" required
                  placeholder={identifier.includes("@") ? "name@skyward.edu.ng" : "e.g. SKW/2026/001"}
                  className="w-full bg-slate-50 p-5 pl-14 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-red-600/10 focus:bg-white transition-all shadow-inner"
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Security Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-5 text-slate-300 group-focus-within:text-red-600 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  className="w-full bg-slate-50 p-5 pl-14 pr-14 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-red-600/10 focus:bg-white transition-all shadow-inner"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-5 text-slate-300 hover:text-red-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#002147] text-white py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Authorize Sign-In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;