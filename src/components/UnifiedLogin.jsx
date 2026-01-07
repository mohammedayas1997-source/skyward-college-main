import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase"; 
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Lock, User, ShieldCheck, Loader2, AlertCircle, ArrowRight } from "lucide-react";

const UnifiedLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Tabbatar an share tsohon zama (session) idan an shigo shafin
  useEffect(() => {
    const clearSession = async () => {
      await signOut(auth);
      localStorage.clear();
    };
    clearSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const lowerEmail = email.toLowerCase().trim();
    
    // 1. TANTANCE ROLE DA INDA ZA A JE (Logic Check)
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
      setError("ACCESS DENIED: This portal is strictly for Management & Staff.");
      setLoading(false);
      return;
    }

    try {
      // 2. FIREBASE AUTHENTICATION
      const userCredential = await signInWithEmailAndPassword(auth, lowerEmail, password);
      
      if (userCredential.user) {
        // 3. ADANA BAYANAI CIKIN SAURI (Instant Storage)
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", lowerEmail);

        // 4. TSARO: Jinkiri na milisakan 300 don tabbatar Browser ta adana Role
        // Wannan shi ne sirrin da zai hana "ProtectedRoute" mayar da kai Home
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 300);
      }
    } catch (error) {
      console.error("Login Error:", error.code);
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        setError("Invalid official credentials. Please try again.");
      } else {
        setError("Connection error. Please check your network.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001524] px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="max-w-md w-full z-10">
        <div className="bg-white rounded-[45px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20">
          <div className="p-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#002147] to-red-600 rounded-3xl mx-auto mb-6 flex items-center justify-center rotate-6 shadow-2xl">
                <ShieldCheck className="text-white -rotate-6" size={40} />
              </div>
              <h2 className="text-[#002147] text-3xl font-black uppercase tracking-tighter">Staff Portal</h2>
              <div className="h-1 w-12 bg-red-600 mx-auto mt-2 rounded-full" />
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-4">Secure Management Access</p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-xs font-black border-l-4 border-red-600 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={20} className="shrink-0" /> {error}
                </div>
              )}

              <div className="space-y-2">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" size={20} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Official Email Address"
                    className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[22px] focus:border-[#002147] focus:bg-white outline-none text-sm font-bold transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" size={20} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Security Password"
                    className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[22px] focus:border-[#002147] focus:bg-white outline-none text-sm font-bold transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#002147] hover:bg-red-600 text-white font-black py-5 rounded-[22px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    Authorize Login <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Skyward College Security Infrastructure v2.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;