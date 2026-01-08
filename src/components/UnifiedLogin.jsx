import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; 
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

const UnifiedLogin = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Clear session on mount to ensure a clean login
  useEffect(() => {
    const clearSession = async () => {
      try {
        await signOut(auth);
        localStorage.clear();
      } catch (err) {
        console.error("Session Clear Error", err);
      }
    };
    clearSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. FIREBASE AUTHENTICATION (Using Email)
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (user) {
        // 2. FETCH ROLE FROM FIRESTORE
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          throw new Error("User profile not found in database.");
        }

        const userData = userDoc.data();
        const role = userData.role ? userData.role.toLowerCase().trim() : "";
        
        // Save session data
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", email);

        // 3. AUTOMATED SMART REDIRECT
        const routes = {
          admin: "/admin/dashboard",
          proprietor: "/portal/proprietor",
          rector: "/portal/rector",
          accountant: "/admin/accountant",
          finance: "/admin/accountant",
          exam: "/admin/exam-office",
          admission: "/admin/admission-officer",
          staff: "/staff/dashboard",
          lecturer: "/staff/dashboard",
          student: "/portal/dashboard"
        };

        const destination = routes[role] || "/";

        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 300);
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
        setError("Invalid Email or Password.");
      } else {
        setError(error.message || "Access denied. Please contact support.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans text-left">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-red-100 rounded-full blur-[130px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#002147]/10 rounded-full blur-[130px] opacity-50" />

      <div className="w-full max-w-[480px] p-6 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[2.2rem] shadow-2xl border border-slate-100 mb-6 group hover:rotate-6 transition-transform duration-500">
             <img src="/logo.png" alt="Skyward" className="w-14 h-14 object-contain" />
          </div>
          <h2 className="text-3xl font-black text-[#002147] uppercase tracking-tighter italic">Skyward <span className="text-red-600">Portal</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Universal Access Gateway</p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,33,71,0.08)] border border-white/40">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-[10px] font-black border border-red-100">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-red-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="user@skyward.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100/50 border-none py-5 pl-14 pr-6 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-600/20 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Security Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-red-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-100/50 border-none py-5 pl-14 pr-14 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-600/20 transition-all outline-none"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-5 flex items-center text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#002147] text-white py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-red-600 transition-all active:scale-[0.97] disabled:bg-slate-300 shadow-xl shadow-blue-900/10"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Authorize Access"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;