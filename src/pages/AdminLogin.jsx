import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Na tabbatar an saka 'db' a nan
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Don duba role a database
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value.toLowerCase().trim();
    const password = e.target.password.value;

    try {
      // 1. Shiga ta Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Nemo Matsayin Ma'aikaci (Role) daga Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role ? userData.role.toLowerCase().trim() : "";

        // 3. Saita Inda kowa zai dosa (Dynamic Paths)
        let destination = "/";
        if (role === "admin") destination = "/admin/dashboard";
        else if (role === "proprietor") destination = "/portal/proprietor";
        else if (role === "rector") destination = "/portal/rector";
        else if (role === "accountant" || role === "finance") destination = "/admin/accountant";
        else if (role === "exam-officer" || role === "exam") destination = "/admin/exam-office";
        else if (role === "admission-officer" || role === "admission") destination = "/admin/admission-officer";
        else if (role === "news-admin") destination = "/admin/news";
        else if (role === "staff" || role === "lecturer") destination = "/staff/dashboard";

        // 4. SECURE STORAGE (Goge tsohon sannan a saka sabo)
        localStorage.clear();
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("skyward_admin_setup", "done");

        // 5. JINKIRI (DELAY) - Don tabbatar da LocalStorage ya adana
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 500);

      } else {
        // Idan babu shi a Firestore, kada a bar shi ya zauna a login
        setError("ACCESS DENIED: No official profile found in Database.");
        await auth.signOut();
        setLoading(false);
      }

    } catch (err) {
      console.error("Auth Error:", err.code);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Login Failed: Incorrect email or security pin.");
      } else if (err.code === "auth/user-not-found") {
        setError("Unauthorized ID: This account is not registered.");
      } else {
        setError("Network Error: Could not reach the security server.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#00152b] py-12 px-4 font-sans text-left">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        
        <div className="text-center mb-8">
          <div className="bg-red-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <ShieldCheck className="text-white" size={45} />
          </div>
          <h1 className="text-white text-3xl font-black uppercase tracking-tighter">Command Center</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Administrative Access Only</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden p-8 md:p-12 border border-white/10">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 flex items-center gap-3 text-[10px] font-black border border-red-100 uppercase tracking-wider animate-bounce">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest text-left">Authorized Email</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                  <User size={18} />
                </span>
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="name@skyward.edu.ng"
                  className="w-full pl-14 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-600 focus:outline-none transition-all text-sm font-bold shadow-inner outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest text-left">Security Password</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                  <Lock size={18} />
                </span>
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-600 focus:outline-none transition-all text-sm font-bold shadow-inner outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#002147] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#002147] hover:bg-red-600'} text-white font-black py-5 rounded-[25px] uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mt-4`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Authorizing...
                </>
              ) : (
                "Authorize Access"
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-[9px] text-slate-400 uppercase font-black leading-relaxed tracking-widest">
              System Monitor: IP Address Logged <br/>
              <span className="text-red-500 font-bold">Encrypted Session Layer 7</span>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => navigate("/")} 
            className="text-slate-500 text-[10px] font-black uppercase hover:text-white transition-colors tracking-widest outline-none"
          >
            ← Terminate & Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;