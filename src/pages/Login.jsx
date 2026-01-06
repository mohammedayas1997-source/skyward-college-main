import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; 
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Lock, User, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // --- 1. PRE-LOGIN VALIDATION ---
    const lowerEmail = email.toLowerCase();
    const isAdminEmail = ["owner@skyward.edu.ng", "rector@skyward.edu.ng", "admin@skyward.edu.ng", "finance@skyward.edu.ng"].includes(lowerEmail);
    const isStaffEmail = lowerEmail.includes("staff");

    try {
      // Firebase Authentication check
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // --- 2. ROLE-BASED ACCESS CONTROL (STAFF vs STUDENT) ---
      
      // If it's an Admin/Executive trying to use this portal
      if (isAdminEmail) {
        if (lowerEmail === "owner@skyward.edu.ng") {
          localStorage.setItem("userRole", "proprietor");
          navigate("/portal/proprietor");
        } else if (lowerEmail === "rector@skyward.edu.ng") {
          localStorage.setItem("userRole", "rector");
          navigate("/portal/rector");
        } else if (lowerEmail === "admin@skyward.edu.ng") {
          localStorage.setItem("userRole", "exam-officer");
          navigate("/admin/exam-office");
        } else {
          localStorage.setItem("userRole", "accountant");
          navigate("/admin/accountant");
        }
      } 
      // STRICT STAFF LOGIN
      else if (isStaffEmail) {
        localStorage.setItem("userRole", "staff");
        navigate("/staff/dashboard");
      } 
      // STRICT STUDENT LOGIN
      else {
        // We assume any other institutional email that isn't admin or staff belongs to a student
        localStorage.setItem("userRole", "student");
        navigate("/portal/dashboard");
      }

    } catch (error) {
      console.error("Login Error:", error.code);
      setError("Invalid Email or Password. Access Denied.");
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
          <h2 className="text-white text-2xl font-black uppercase tracking-tight">Skyward Portal</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Staff & Student Access</p>
        </div>

        <form className="p-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase border border-red-100">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-[#002147] uppercase mb-2 tracking-widest">Institutional Email</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@skyward.edu.ng or student@skyward.edu.ng"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none text-sm font-bold transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#002147] uppercase mb-2 tracking-widest">Portal Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none text-sm font-bold transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#002147] hover:bg-red-600 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Authorize Access"}
          </button>
        </form>
        
        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
            Security Verified Layer © 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;