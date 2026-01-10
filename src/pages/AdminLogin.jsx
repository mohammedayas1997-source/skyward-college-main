import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ShieldCheck, Mail, Lock, ArrowRight, Home, Loader2, AlertCircle } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch User Profile & Status Check
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Strict Status Check
        if (userData.status !== "active") {
          await signOut(auth);
          throw new Error("This admin account is currently inactive. Contact System Admin.");
        }

        const role = userData.role.toLowerCase().trim();

        // 3. Authorization Check (Ensures only Admins/Staff use this specific page)
        const privilegedRoles = ["admin", "rector", "proprietor", "accountant", "admission", "exam"];
        if (!privilegedRoles.includes(role)) {
          await signOut(auth);
          throw new Error("Unauthorized access. Please use the Student Portal.");
        }

        // 4. Save Session & Redirect
        localStorage.setItem("userRole", role);
        localStorage.setItem("isAuth", "true");
        navigate("/admin/dashboard", { replace: true });

      } else {
        throw new Error("Admin profile not found in database.");
      }
    } catch (err) {
      console.error("Admin Login Error:", err.message);
      setError(err.message.includes("auth/") ? "Invalid administrative credentials." : err.message);
    } finally {
      setLoading(false);
    }
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
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[9px] font-black uppercase flex items-center gap-3 border border-red-100">
              <AlertCircle size={16} /> {error}
            </div>
          )}

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
            disabled={loading}
            className="w-full bg-[#002147] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl shadow-blue-900/20 active:scale-95 group disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : (
              <>Verify & Enter <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
            )}
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