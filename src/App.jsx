import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogOut, Hash, Loader2, AlertCircle } from "lucide-react";
// Shigo da Firebase config
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// --- LOGIN COMPONENT (REAL LIFE LOGIC) ---
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const input = formData.identifier.trim();
    const isEmail = input.includes("@");

    try {
      let emailToUse = input;

      // --- LOGIC NA DALIBI (ID NUMBER ONLY) ---
      if (!isEmail) {
        const formattedId = input.toUpperCase();
        const usersRef = collection(db, "users");
        // Nemo dalibi mai wannan ID din kuma mu tabbatar "student" ne shi
        const q = query(
          usersRef, 
          where("idNumber", "==", formattedId), 
          where("role", "==", "student")
        );
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("Invalid Student ID Number.");
        }
        
        // Dauko email din dalibin da ke boye don yi masa login
        emailToUse = querySnapshot.docs[0].data().email;
      }

      // --- LOGIN NA GASKE (FIREBASE AUTH) ---
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        emailToUse, 
        formData.password
      );
      
      const user = userCredential.user;

      // --- DUBA ROLE DAGA FIRESTORE ---
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role.toLowerCase();

        // Tura kowa inda ya dace
        if (role === "student") navigate("/student/dashboard");
        else if (role === "rector") navigate("/rector/dashboard");
        else if (role === "proprietor") navigate("/proprietor/dashboard");
        else if (role === "accountant") navigate("/accountant/dashboard");
        else if (role === "admission") navigate("/admission/dashboard");
        else if (role === "staff") navigate("/staff/portal");
        else if (role === "exam") navigate("/exam/dashboard");
        else setError("Account role not recognized.");
      } else {
        setError("User profile not found in database.");
      }
    } catch (error) {
      setError(error.message.includes("auth/") ? "Wrong ID/Email or Password." : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans p-6">
      <div className="w-full max-w-[450px]">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#002147] uppercase tracking-tighter italic">
            Skyward <span className="text-red-600">Portal</span>
          </h2>
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mt-2">
            Secure Academic Gateway
          </p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,33,71,0.1)] border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 border border-red-100 italic text-left">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">
                Login Identity
              </label>
              <div className="relative">
                <div className="absolute left-5 top-5 text-slate-400">
                  {formData.identifier.includes("@") ? <Mail size={18}/> : <Hash size={18}/>}
                </div>
                <input 
                  type="text" required 
                  placeholder="Email (Staff) or ID (Student)"
                  className="w-full bg-slate-50 pl-14 pr-6 py-5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20 transition-all border-none"
                  onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Security Pin</label>
              <div className="relative">
                <Lock className="absolute left-5 top-5 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  className="w-full bg-slate-50 pl-14 pr-14 py-5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20 transition-all border-none"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-5 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#002147] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Authorize Access"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- REAL-TIME PROTECTED DASHBOARD WRAPPER ---
const DashboardWrapper = ({ title, color }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
        return;
      }
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) setUserName(docSnap.data().fullName);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-6 md:p-12 text-left">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-14 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-white">
        <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-8">
          <div>
            <h1 className={`text-4xl font-black uppercase tracking-tighter italic ${color}`}>{title}</h1>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mt-2 italic">
              Authenticated: {userName}
            </p>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-end min-h-[160px]">
            <span className="text-slate-300 font-black text-[40px] leading-none mb-2">01</span>
            <span className="text-[#002147] font-black text-[10px] uppercase tracking-widest">Main Overview</span>
          </div>
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-end min-h-[160px]">
             <span className="text-slate-300 font-black text-[40px] leading-none mb-2">02</span>
             <span className="text-[#002147] font-black text-[10px] uppercase tracking-widest">Recent Records</span>
          </div>
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-end min-h-[160px]">
             <span className="text-slate-300 font-black text-[40px] leading-none mb-2">03</span>
             <span className="text-[#002147] font-black text-[10px] uppercase tracking-widest">Notifications</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/rector/dashboard" element={<DashboardWrapper title="Rector Portal" color="text-[#002147]" />} />
        <Route path="/proprietor/dashboard" element={<DashboardWrapper title="Proprietor Center" color="text-purple-900" />} />
        <Route path="/accountant/dashboard" element={<DashboardWrapper title="Finance Portal" color="text-green-600" />} />
        <Route path="/admission/dashboard" element={<DashboardWrapper title="Admission Unit" color="text-orange-600" />} />
        <Route path="/staff/portal" element={<DashboardWrapper title="Staff Faculty" color="text-red-600" />} />
        <Route path="/exam/dashboard" element={<DashboardWrapper title="Exam Office" color="text-indigo-600" />} />
        <Route path="/student/dashboard" element={<DashboardWrapper title="Student Portal" color="text-slate-700" />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}