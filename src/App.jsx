import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogOut, Loader2, Hash, AlertCircle } from "lucide-react";
// Firebase Imports
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// --- DUAL-PATH LOGIN COMPONENT ---
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let emailToAuth = identifier.trim();

      // 1. Check if Input is Student ID or Email
      if (!identifier.includes("@")) {
        const studentId = identifier.toUpperCase().trim();
        const q = query(collection(db, "users"), where("idNumber", "==", studentId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("Invalid Student ID Number.");
        }
        emailToAuth = querySnapshot.docs[0].data().email;
      } else {
        if (!identifier.toLowerCase().endsWith("@skyward.edu.ng")) {
          throw new Error("Staff must use official @skyward.edu.ng email.");
        }
      }

      // 2. Firebase Auth Login
      const userCredential = await signInWithEmailAndPassword(auth, emailToAuth, password);
      
      // 3. Role Checking & Routing
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (userDoc.exists()) {
        const role = userDoc.data().role?.toLowerCase();
        
        // Muna ajiye role a localStorage don gudun refresh
        localStorage.setItem("userRole", role);

        const routes = {
          student: "/student/dashboard",
          rector: "/rector/dashboard",
          proprietor: "/proprietor/dashboard",
          accountant: "/accountant/dashboard",
          admission: "/admission/dashboard",
          staff: "/staff/portal",
          exam: "/exam/dashboard"
        };

        if (routes[role]) {
          navigate(routes[role], { replace: true });
        } else {
          setError("No dashboard assigned to this role.");
        }
      } else {
        setError("User record not found in database.");
      }
    } catch (err) {
      let msg = err.message;
      if (err.code === "auth/invalid-credential") msg = "Incorrect ID/Email or Password.";
      if (err.code === "auth/too-many-requests") msg = "Too many attempts. Try again later.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
      <div className="w-full max-w-[450px]">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#002147] uppercase tracking-tighter italic">
            Skyward <span className="text-red-600">Portal</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2 italic">Unified Authentication</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase text-center border border-red-100 italic flex items-center justify-center gap-2 animate-shake">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">
                {identifier.includes("@") ? "Staff Email" : "Student ID / Email"}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-slate-400">
                   {identifier.includes("@") ? <Mail size={18} /> : <Hash size={18} />}
                </div>
                <input 
                  type="text" required 
                  placeholder={identifier.includes("@") ? "name@skyward.edu.ng" : "SKW/2026/001"}
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-sm font-bold outline-none ring-2 ring-transparent focus:ring-red-600/10 focus:bg-white transition-all border border-slate-100"
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-sm font-bold outline-none ring-2 ring-transparent focus:ring-red-600/10 focus:bg-white transition-all border border-slate-100"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-4 text-slate-400 hover:text-red-600 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#002147] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Authorize Access"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- SECURITY: DASHBOARD WRAPPER ---
const DashboardWrapper = ({ title, color, allowedRole }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const storedRole = localStorage.getItem("userRole");
      if (!user || storedRole !== allowedRole) {
        navigate("/", { replace: true });
      } else {
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, [navigate, allowedRole]);

  const handleLogout = async () => { 
    await signOut(auth); 
    localStorage.removeItem("userRole");
    navigate("/", { replace: true }); 
  };

  if (checking) return (
    <div className="h-screen flex items-center justify-center bg-white italic font-black text-[#002147]">
       <Loader2 className="animate-spin mr-2" /> VERIFYING SESSION...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm border border-slate-100 text-left">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-black uppercase italic ${color}`}>{title} Portal</h1>
            <p className="text-slate-400 font-bold text-[10px] tracking-[0.3em] uppercase mt-2 italic text-left">Skyward Management System</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
        <div className="h-64 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-1 bg-red-600/20 rounded-full animate-pulse"></div>
            <p className="text-slate-300 font-black uppercase tracking-[0.2em] italic text-xs">Awaiting Content Payload</p>
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
        
        {/* PROTECTED ROUTES */}
        <Route path="/rector/dashboard" element={<DashboardWrapper title="Rector" color="text-blue-900" allowedRole="rector" />} />
        <Route path="/proprietor/dashboard" element={<DashboardWrapper title="Proprietor" color="text-purple-900" allowedRole="proprietor" />} />
        <Route path="/accountant/dashboard" element={<DashboardWrapper title="Accountant" color="text-green-600" allowedRole="accountant" />} />
        <Route path="/admission/dashboard" element={<DashboardWrapper title="Admission" color="text-orange-600" allowedRole="admission" />} />
        <Route path="/staff/portal" element={<DashboardWrapper title="Staff" color="text-red-600" allowedRole="staff" />} />
        <Route path="/exam/dashboard" element={<DashboardWrapper title="Exams" color="text-indigo-600" allowedRole="exam" />} />
        <Route path="/student/dashboard" element={<DashboardWrapper title="Student" color="text-slate-700" allowedRole="student" />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}