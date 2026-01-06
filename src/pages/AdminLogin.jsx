import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // A nan za mu saka misalin bayanan sirri na Admin
    const adminUser = "admin@skyward.edu.ng";
    const adminPass = "SkywardAdmin2026";

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === adminUser && password === adminPass) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid Administrative Credentials!");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#00152b] py-12 px-4">
      <div className="max-w-md w-full">
        
        {/* Admin Shield Icon */}
        <div className="text-center mb-8">
          <div className="bg-red-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl rotate-3">
            <ShieldCheck className="text-white" size={45} />
          </div>
          <h1 className="text-white text-3xl font-black uppercase tracking-tighter">Admin Portal</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Authorized Access Only</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-10 border border-white/10">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 text-xs font-bold border border-red-100 animate-bounce">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-[#002147] uppercase mb-2 ml-1">Admin ID / Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={18} />
                </span>
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="admin@skyward.edu.ng"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#002147] focus:outline-none transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-[#002147] uppercase mb-2 ml-1">Security Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </span>
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#002147] focus:outline-none transition-all text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#002147]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button className="w-full bg-[#002147] hover:bg-red-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[9px] text-slate-400 uppercase font-black leading-relaxed">
              Security Warning: Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => navigate("/")} className="text-slate-500 text-[10px] font-black uppercase hover:text-white transition-colors">
            ← Back to Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;