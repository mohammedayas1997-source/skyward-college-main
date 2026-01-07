import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ShieldCheck, Lock, User, Loader2, AlertCircle } from "lucide-react";

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

    try {
      // 1. Firebase Authentication - Tantance Email da Password
      const userCredential = await signInWithEmailAndPassword(auth, lowerEmail, password);
      
      if (userCredential.user) {
        // Share tsoffin bayanan session
        localStorage.clear();
        localStorage.setItem("isAuth", "true");

        let role = "";
        let destination = "";

        // 2. Tantance Matsayin Mutum (The Logic Fix)
        // Ba ma sake duba ".includes('staff')" kadai ba
        
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
        } else if (lowerEmail === "exams@skyward.edu.ng") {
          role = "exam-officer";
          destination = "/admin/exam-office";
        } else if (lowerEmail.includes("staff")) {
          role = "staff";
          destination = "/staff/dashboard";
        } else {
          // Idan dalibi ne ya shigo nan, tura shi Dashboard din sa
          role = "student";
          destination = "/portal/dashboard";
        }

        // 3. Adana Matsayin (Role) a Storage
        localStorage.setItem("userRole", role);

        // 4. Redirect zuwa Dashboard
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 300);
      }

    } catch (err) {
      console.error("Login Error:", err.code);
      // Fassarar kurakuran Firebase
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid Email or Password. Please try again.");
      } else {
        setError("Authentication Failed. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#011627] px-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10">
        <div className="text-center mb-8">
          <div className="bg-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl rotate-3">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-[#002147] text-2xl font-black uppercase tracking-tighter italic">Skyward Command</h1>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-2">Institutional Management Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black border border-red-100 uppercase flex items-center gap-2">
              <AlertCircle size={16}/> {error}
            </div>
          )}
          
          <div>
            <label className="block text-[10px] font-black text-[#002147] uppercase ml-2 mb-2">Login ID / Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-red-600 outline-none font-bold text-sm" 
                placeholder="admin@skyward.edu.ng" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#002147] uppercase ml-2 mb-2">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-red-600 outline-none font-bold text-sm" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#002147] text-white font-black py-5 rounded-[20px] uppercase text-[11px] hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Authorize Entry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnifiedLogin;