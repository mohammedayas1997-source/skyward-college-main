import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; 
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Lock, User, ShieldCheck, Loader2, AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";

const UnifiedLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Clear session on load
  useEffect(() => {
    const clearSession = async () => {
      try {
        await signOut(auth);
        localStorage.clear();
      } catch (err) {
        console.error("SignOut Error", err);
      }
    };
    clearSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const lowerEmail = email.toLowerCase().trim();
    
    // 1. ROLE DETERMINATION LOGIC
    let role = "";
    let destination = "";

    if (lowerEmail === "owner@skyward.edu.ng") {
      role = "proprietor";
      destination = "/portal/proprietor";
    } else if (lowerEmail === "admin@skyward.edu.ng") {
      role = "admin";
      destination = "/admin/dashboard";
    } else if (lowerEmail === "rector@skyward.edu.ng") {
      role = "rector";
      destination = "/portal/rector";
    } else if (lowerEmail === "finance@skyward.edu.ng") {
      role = "accountant";
      destination = "/admin/accountant";
    } else if (lowerEmail.includes("staff")) {
      role = "staff";
      destination = "/staff/dashboard";
    } else {
      setError("ACCESS DENIED: Restricted to Management & Staff.");
      setLoading(false);
      return;
    }

    try {
      // 2. FIREBASE AUTH
      const userCredential = await signInWithEmailAndPassword(auth, lowerEmail, password);
      
      if (userCredential.user) {
        // 3. SECURE STORAGE
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", lowerEmail);

        // 4. SMART DELAY FOR BROWSER PERSISTENCE
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 300);
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        setError("Invalid official credentials. Access Revoked.");
      } else {
        setError("Network instability detected. Check connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-red-100 rounded-full blur-[130px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#002147]/10 rounded-full blur-[130px] opacity-50" />

      <div className="w-full max-w-[480px] p-6 relative z-10">
        
        {/* Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[2.2rem] shadow-2xl border border-slate-100 mb-6 group hover:rotate-6 transition-transform duration-500">
             <img src="/logo.png" alt="Skyward" className="w-14 h-14 object-contain" />
          </div>
          <h2 className="text-3xl font-black text-[#002147] uppercase tracking-tighter italic">Staff <span className="text-red-600">Portal</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Advanced Command & Control</p>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="bg-white/70 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,33,71,0.08)] border border-white/40">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-[10px] font-black border border-red-100 animate-pulse">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Official Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-red-600 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@skyward.edu.ng"
                  className="w-full bg-slate-100/50 border-none py-5 pl-14 pr-6 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-600/20 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Security Pin</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-red-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-100/50 border-none py-5 pl-14 pr-14 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-red-600/20 transition-all outline-none"
                  required
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

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#002147] text-white py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-red-600 shadow-xl shadow-blue-900/10 hover:shadow-red-600/20 transition-all group active:scale-[0.97] disabled:bg-slate-300"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>Authorize Access <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
            <ShieldCheck size={14} className="text-[#002147]" />
            <span className="text-[9px] font-black text-[#002147] uppercase tracking-tighter">Skyward Security Infrastructure v2.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;