import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Ensure this path is correct
import { signInWithEmailAndPassword } from "firebase/auth";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

const UnifiedLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const lowerEmail = email.toLowerCase().trim();

    // --- AUTHORIZED ADMINISTRATIVE ACCOUNTS ---
    const authorizedUsers = {
      "owner@skyward.edu.ng": { role: "proprietor", path: "/portal/proprietor" },
      "admin@skyward.edu.ng": { role: "admin", path: "/admin/dashboard" },
      "rector@skyward.edu.ng": { role: "rector", path: "/portal/rector" },
      "finance@skyward.edu.ng": { role: "accountant", path: "/admin/accountant" },
      "exams@skyward.edu.ng": { role: "exam-officer", path: "/admin/exam-office" },
      "admission@skyward.edu.ng": { role: "admission-officer", path: "/admin/admission" },
      "news@skyward.edu.ng": { role: "news-admin", path: "/admin/news" }
    };

    try {
      // 1. Firebase Authentication
      await signInWithEmailAndPassword(auth, lowerEmail, password);

      // 2. Role-Based Redirection
      if (authorizedUsers[lowerEmail]) {
        const user = authorizedUsers[lowerEmail];
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("isAuth", "true");
        navigate(user.path);
      } else if (lowerEmail.includes("staff")) {
        localStorage.setItem("userRole", "staff");
        localStorage.setItem("isAuth", "true");
        navigate("/staff/dashboard");
      } else {
        localStorage.setItem("userRole", "student");
        localStorage.setItem("isAuth", "true");
        navigate("/portal/student-dashboard");
      }
    } catch (err) {
      setError("Authentication Failed: Invalid credentials or unauthorized access.");
      console.error("Login Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#002147] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[450px] bg-white rounded-[40px] shadow-2xl p-8 md:p-12 relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-red-50 rounded-[24px] mb-4 group hover:bg-red-600 transition-all duration-500 cursor-pointer">
            <ShieldCheck size={40} className="text-red-600 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Skyward Portal</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Central Authentication System</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 flex items-center gap-3 text-[10px] font-black border border-red-100 uppercase animate-bounce">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-widest">Institutional Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-4 text-slate-300 group-focus-within:text-red-600 transition-colors" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@skyward.edu.ng" 
                className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl outline-none focus:border-red-600/30 focus:bg-white transition-all font-bold text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Password</label>
              <button type="button" className="text-[9px] font-black uppercase text-red-600 hover:underline">Forgot Access?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-slate-300 group-focus-within:text-red-600 transition-colors" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 pr-12 rounded-2xl outline-none focus:border-red-600/30 focus:bg-white transition-all font-bold text-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-300 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#002147] hover:bg-red-600 text-white p-5 rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-70"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Initialize Access <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
            Protected by Skyward Security Framework v4.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;