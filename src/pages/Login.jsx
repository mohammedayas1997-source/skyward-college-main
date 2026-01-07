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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const lowerEmail = email.toLowerCase().trim();
    
    // --- CIKAKKEN TSARO: MANAGEMENT & STAFF ONLY ---
    // Mun fito da kowane email daki-daki domin kaucewa kuskure
    const isProprietor = lowerEmail === "owner@skyward.edu.ng";
    const isAdmin = lowerEmail === "admin@skyward.edu.ng";
    const isRector = lowerEmail === "rector@skyward.edu.ng";
    const isAccountant = lowerEmail === "finance@skyward.edu.ng";
    const isStaff = lowerEmail.includes("staff");

    // Idan baka daya daga cikin wadannan ba, to kai dalibi ne - KORE SHI!
    if (!isProprietor && !isAdmin && !isRector && !isAccountant && !isStaff) {
      setError("Access Denied: This portal is for Staff and Management only.");
      setLoading(false);
      return;
    }

    try {
      // 1. Firebase Authentication
      await signInWithEmailAndPassword(auth, lowerEmail, password);

      // 2. Clear Session
      localStorage.clear();
      localStorage.setItem("isAuth", "true");

      // 3. Tura kowa gidansa (Redirection Logic)
      let role = "";
      let destination = "";

      if (isProprietor) {
        role = "proprietor";
        destination = "/portal/proprietor";
      } else if (isAdmin) {
        role = "admin";
        destination = "/admin/dashboard";
      } else if (isRector) {
        role = "rector";
        destination = "/portal/rector";
      } else if (isAccountant) {
        role = "accountant";
        destination = "/admin/accountant";
      } else {
        role = "staff";
        destination = "/staff/dashboard";
      }

      localStorage.setItem("userRole", role);
      
      // Dan jinkiri kadan domin tabbatar da localStorage ya zauna
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 200);

    } catch (error) {
      setError("Authentication Failed: Invalid Email or Password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001524] px-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden p-10 border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center rotate-3 shadow-lg">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-[#002147] text-2xl font-black uppercase tracking-tight italic">Management Portal</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Authorized Access Control</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase border border-red-100">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-[#002147] uppercase mb-2 ml-2">Official Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@skyward.edu.ng"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#002147] uppercase mb-2 ml-2">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-600 outline-none text-sm font-bold"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#002147] hover:bg-red-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Authorize Entry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;