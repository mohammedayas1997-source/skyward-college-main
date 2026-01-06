import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, ShieldCheck } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // --- 1. PROPRIETOR (SHUGABAN MAKARANTA) ---
    if (username === "owner" && password === "owner123") {
      localStorage.setItem("userRole", "proprietor");
      navigate("/portal/proprietor");
    } 
    // --- 2. RECTOR (SHUGABAN GUDANARWA) ---
    else if (username === "rector" && password === "rector123") {
      localStorage.setItem("userRole", "rector");
      navigate("/portal/rector");
    } 
    // --- 3. EXAM OFFICER (Kamar yadda ka saka a baya) ---
    else if (username === "sky-admin" && password === "admin123") {
      localStorage.setItem("userRole", "exam-officer");
      navigate("/admin/exam-office");
    } 
    // --- 4. ACCOUNTANT (MAI KUDI) ---
    else if (username === "finance" && password === "pay123") {
      localStorage.setItem("userRole", "accountant");
      navigate("/portal/finance");
    }
    // --- 5. STUDENT (Zai gane matric number dake farawa da SKY/) ---
    else if (username.startsWith("SKY/") && password === "student123") {
      localStorage.setItem("userRole", "student");
      navigate("/portal/dashboard");
    } 
    else {
      alert("Kuskure: Username ko Password bai yi daidai ba!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#002147] p-8 text-center">
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center rotate-3">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-white text-2xl font-black uppercase tracking-tight">Access Portal</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Skyward College Management System</p>
        </div>

        <form className="p-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-[10px] font-black text-[#002147] uppercase mb-2">Username / Matric No</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your ID"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none text-sm font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#002147] uppercase mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none text-sm"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#002147] hover:bg-red-600 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg active:scale-95">
            Authorize Login
          </button>
        </form>
        
        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Skyward Security Verified © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Login;