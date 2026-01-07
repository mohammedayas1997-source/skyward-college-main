import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email } = formData;

    // Role-Based Routing Logic
    if (email.toLowerCase().includes("@admin.skyward.edu.ng")) {
      // Redirects to Admin Dashboard
      navigate("/admin/dashboard");
    } else if (email.toLowerCase().includes("@staff.skyward.edu.ng")) {
      // Redirects to Staff Portal
      navigate("/staff/portal");
    } else {
      // Default redirect for Students
      navigate("/student/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-50 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#002147]/10 rounded-full blur-[120px] opacity-60"></div>

      <div className="w-full max-w-[450px] p-8 md:p-12 relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[2rem] shadow-xl border border-slate-100 mb-6 group hover:scale-105 transition-transform duration-500">
             <img src="/logo.png" alt="Skyward" className="w-14 h-14 object-contain" />
          </div>
          <h2 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Welcome <span className="text-red-600">Back</span></h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Skyward Student & Staff Portal</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,33,71,0.1)] border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-red-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="name@skyward.edu.ng"
                  className="w-full bg-slate-50 border-none py-4 pl-14 pr-6 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-600/20 transition-all outline-none"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black text-[#002147] uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-black text-red-600 uppercase hover:underline">Forgot?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-red-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-none py-4 pl-14 pr-14 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-600/20 transition-all outline-none"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-5 flex items-center text-slate-400 hover:text-[#002147]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              className="w-full bg-[#002147] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-600 shadow-lg shadow-blue-900/10 hover:shadow-red-600/20 transition-all group active:scale-[0.98]"
            >
              Secure Login <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
            <ShieldCheck size={14} className="text-green-600" />
            <span className="text-[9px] font-black text-green-700 uppercase tracking-tighter">End-to-end encrypted portal</span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold">
            Don't have an account? <button onClick={() => navigate('/courses')} className="text-[#002147] hover:text-red-600 underline">Apply Now</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;