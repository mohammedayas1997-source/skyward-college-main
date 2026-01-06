import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, User, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Detects if the user is on the staff or student login path
  const isStaffLoginPage = window.location.pathname.includes("staff");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const lowerEmail = email.toLowerCase();
    
    // --- SECURITY CHECKS ---
    const isStaffEmail = lowerEmail.includes("staff");
    const isAdminEmail = ["owner@skyward.edu.ng", "rector@skyward.edu.ng", "admin@skyward.edu.ng"].includes(lowerEmail);

    try {
      // 1. STAFF LOGIN VALIDATION
      if (isStaffLoginPage) {
        if (!isStaffEmail) {
          setError("Access Denied: This portal is for Staff members only.");
          setLoading(false);
          return;
        }
      } 
      // 2. STUDENT LOGIN VALIDATION
      else {
        if (isStaffEmail || isAdminEmail) {
          setError("Access Denied: Staff and Admins must use their designated portals.");
          setLoading(false);
          return;
        }
      }

      // Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);

      // --- REDIRECTION LOGIC ---
      if (isStaffEmail) {
        localStorage.setItem("userRole", "staff");
        navigate("/staff/dashboard");
      } else {
        localStorage.setItem("userRole", "student");
        navigate("/portal/dashboard");
      }

    } catch (error) {
      setError("Authentication Failed: Invalid Email or Password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#002147] p-8 text-center">
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center rotate-3 shadow-lg">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-white text-2xl font-black uppercase tracking-tight">
            {isStaffLoginPage ? "Staff Portal" : "Student Portal"}
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
            Skyward Management System
          </p>
        </div>

        <form className="p-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase border border-red-100 animate-shake">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-[#002147] uppercase mb-2">
              {isStaffLoginPage ? "Staff Email Address" : "Student Email Address"}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isStaffLoginPage ? "staff@skyward.edu.ng" : "student@skyward.edu.ng"}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none text-sm font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#002147] uppercase mb-2">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none text-sm font-bold"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#002147] hover:bg-red-600 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Authorize Login"}
          </button>
        </form>
        
        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
            Institutional Security Layer © 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;