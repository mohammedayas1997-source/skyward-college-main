import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Ensure this path is correct
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, User, ShieldCheck, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Logic for Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      
      // ROLE REDIRECTION LOGIC
      // Note: In a real app, roles should be fetched from Firestore.
      // For now, we use your specific email logic:
      
      if (email === "owner@skyward.edu.ng") {
        localStorage.setItem("userRole", "proprietor");
        navigate("/portal/proprietor");
      } 
      else if (email === "rector@skyward.edu.ng") {
        localStorage.setItem("userRole", "rector");
        navigate("/portal/rector");
      } 
      else if (email === "admin@skyward.edu.ng") {
        localStorage.setItem("userRole", "exam-officer");
        navigate("/admin/exam-office");
      } 
      else if (email === "finance@skyward.edu.ng") {
        localStorage.setItem("userRole", "accountant");
        navigate("/admin/accountant"); 
      }
      else if (email.includes("staff")) {
        localStorage.setItem("userRole", "staff");
        navigate("/staff/dashboard");
      }
      else {
        // Default for students
        localStorage.setItem("userRole", "student");
        navigate("/portal/dashboard");
      }
    } catch (error) {
      alert("System Authentication Failed: Check credentials or Network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-[#002147] p-8 text-center">
          <div className="w-16 h-16 bg-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center rotate-3 shadow-lg">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-white text-2xl font-black uppercase tracking-tight">Access Portal</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Skyward College Management System</p>
        </div>

        <form className="p-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-[10px] font-black text-[#002147] uppercase mb-2">Institutional Email</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skyward.edu.ng"
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
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600 focus:outline-none text-sm font-bold"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#002147] hover:bg-red-600 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Authorize Login"}
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