import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Mail, Lock, ArrowRight, Home } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Nan ne za a sa logic na shiga (Authentication)
    console.log("Admin Login Attempt:", { email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-6 font-sans">
      {/* Back to Home */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-[#002147] font-black text-[10px] uppercase tracking-[0.2em] hover:text-red-600 transition-all">
        <Home size={16} /> Back to Home
      </Link>

      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 overflow-hidden border border-slate-100">
        {/* Header Section */}
        <div className="bg-[#002147] p-12 text-center relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck size={150} className="text-white" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
             <img src="/logo.png" alt="Logo" className="h-16 w-16 mb-4 bg-white p-2 rounded-2xl shadow-lg" />
             <h2 className="text-white text-2xl font-black uppercase tracking-tighter">Admin Access</h2>
             <div className="h-1 w-10 bg-red-600 mt-2 rounded-full"></div>
             <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] mt-4">Authorized Personnel Only</p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Official Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border border-slate-100 py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600 transition-all font-bold text-[#002147] placeholder:text-slate-300" 
                placeholder="admin@skywardcollege.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                required
                className="w-full bg-slate-50 border border-slate-100 py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-600 transition-all font-bold text-[#002147] placeholder:text-slate-300" 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#002147] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl shadow-blue-900/20 active:scale-95 group"
          >
            Verify & Enter <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="pt-4 flex flex-col items-center gap-4">
            <Link to="/contact" className="text-slate-400 text-[9px] font-black uppercase tracking-widest hover:text-[#002147] transition-colors">Forgot Credentials?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;