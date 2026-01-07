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
    
    // --- SECURITY CHECK: ALLOW STAFF & MANAGEMENT ONLY ---
    const managementEmails = [
      "owner@skyward.edu.ng", 
      "rector@skyward.edu.ng", 
      "admin@skyward.edu.ng", 
      "finance@skyward.edu.ng"
    ];

    const isManagement = managementEmails.includes(lowerEmail);
    const isStaff = lowerEmail.includes("staff");

    // Idan ba Management bane kuma ba Staff bane, kore shi
    if (!isManagement && !isStaff) {
      setError("Access Denied: This portal is for Staff and Management only.");
      setLoading(false);
      return;
    }

    try {
      // 1. Firebase Authentication
      await signInWithEmailAndPassword(auth, lowerEmail, password);

      // 2. Clear session for fresh login
      localStorage.clear();
      localStorage.setItem("isAuth", "true");

      // 3. Smart Redirect Logic
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
      } else {
        role = "staff";
        destination = "/staff/dashboard";
      }

      // 4. Save and Go
      localStorage.setItem("userRole", role);
      navigate(destination, { replace: true });

    } catch (error) {
      setError("Authentication Failed: Invalid Credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001524] px-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center rotate-3 shadow-lg">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-[#002147] text-2xl font-black uppercase tracking-tight italic">Management Hub</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Authorized Access Only</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase border border-red-100 animate-pulse">
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
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Unlock Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;