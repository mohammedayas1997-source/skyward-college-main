import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; 
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Lock, User, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

const UnifiedLogin = () => {
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
    
    // 1. TANTANCE ROLE DA INDA ZA A JE
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
      setError("Unauthorized: Management/Staff emails only.");
      setLoading(false);
      return;
    }

    try {
      // 2. SHIGA SYSTEM (Firebase)
      await signInWithEmailAndPassword(auth, lowerEmail, password);

      // 3. TSAFTACE STORAGE (Wannan ne yake sa ka koma Student Dashboard)
      localStorage.clear(); // Goge komai na tsohon login (musamman na Student)
      
      // 4. SAKA SABON BAYANI
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("userRole", role);

      // 5. TILASTA WA BROWSER TA GANE CANJIN
      // Muna amfani da window.location maimakon navigate don App.js ya sake duba Role
      setTimeout(() => {
        window.location.href = destination;
      }, 300);

    } catch (error) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001524] px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden p-10 border border-white/20">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center rotate-3 shadow-lg">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-[#002147] text-2xl font-black uppercase italic tracking-tighter">Official Portal</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Management & Staff Access</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100 italic">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest italic">Official Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@skyward.edu.ng"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-600 focus:bg-white outline-none text-sm font-bold transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest italic">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-600 focus:bg-white outline-none text-sm font-bold transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#002147] hover:bg-red-700 text-white font-black py-5 rounded-2xl uppercase tracking-[0.3em] transition-all shadow-xl flex items-center justify-center gap-3 disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Authorize Entry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnifiedLogin;