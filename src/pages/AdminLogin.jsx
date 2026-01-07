import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
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

    // Jerin ma'aikata da inda ya kamata su nufa
    const authorizedUsers = {
      "owner@skyward.edu.ng": { role: "proprietor", path: "/portal/proprietor" },
      "admin@skyward.edu.ng": { role: "admin", path: "/admin/dashboard" },
      "rector@skyward.edu.ng": { role: "rector", path: "/portal/rector" },
      "finance@skyward.edu.ng": { role: "accountant", path: "/admin/accountant" },
      "exams@skyward.edu.ng": { role: "exam-officer", path: "/admin/exam-office" },
      "admission@skyward.edu.ng": { role: "admission-officer", path: "/admin/admission" },
      "news@skyward.edu.ng": { role: "news-admin", path: "/admin/news" }
    };

    // 1. Duba idan email din yana cikin wadanda aka amincewa
    if (!authorizedUsers[email]) {
      setError("Access Denied: Unauthorized Administrative ID.");
      setLoading(false);
      return;
    }

    try {
      // 2. Shiga ta Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      const userData = authorizedUsers[email];
      
      // 3. GYARA MAI KYAU: Goge komai na tsohon login don gujewa conflict
      localStorage.clear();

      // 4. Sanya sabbin bayanai na wannan Admin din
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("skyward_admin_setup", "done");

      // 5. JINKIRI (DELAY): Wannan 500ms din yana da matukar muhimmanci 
      // domin baiwa App.js damar ganin LocalStorage kafin a canza shafi
      setTimeout(() => {
        navigate(userData.path, { replace: true });
      }, 500);

    } catch (err) {
      setError("Login Failed: Please verify your security credentials.");
      console.error("Auth Error:", err.message);
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
                  placeholder="admin@skyward.edu.ng"
                  className="w-full pl-14 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-600 focus:outline-none transition-all text-sm font-bold shadow-inner"
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
                  className="w-full pl-14 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-red-600 focus:outline-none transition-all text-sm font-bold shadow-inner"
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
              disabled={loading}
              className={`w-full ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#002147] hover:bg-red-600'} text-white font-black py-5 rounded-[25px] uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mt-4`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Verifying...
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
            className="text-slate-500 text-[10px] font-black uppercase hover:text-white transition-colors tracking-widest"
          >
            ← Terminate & Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;