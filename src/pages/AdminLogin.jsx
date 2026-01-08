import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogOut, Loader2, ShieldCheck } from "lucide-react";
// Firebase Imports
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// --- UNIVERSAL LOGIN COMPONENT ---
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Authenticate with Firebase Auth using Email
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        formData.password
      );
      const user = userCredential.user;

      // 2. Fetch the User's Role from Firestore "users" collection
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const role = userDoc.data().role?.toLowerCase();
        
        // 3. Automated Routing based on Role
        const dashboardRoutes = {
          student: "/student/dashboard",
          rector: "/rector/dashboard",
          proprietor: "/proprietor/dashboard",
          accountant: "/accountant/dashboard",
          admission: "/admission/dashboard",
          staff: "/staff/portal",
          exam: "/exam/dashboard"
        };

        if (dashboardRoutes[role]) {
          navigate(dashboardRoutes[role]);
        } else {
          setError("Authorized but no dashboard assigned to this role.");
        }
      } else {
        setError("User record not found in database.");
      }
    } catch (error) {
      setError("Login failed. Please check your email and password.");
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
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Universal Access Point</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase text-center border border-red-100 italic">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                <input 
                  type="email" required placeholder="name@skyward.edu.ng"
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-4 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#002147] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Sign In to Portal"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- GENERIC DASHBOARD (PREVENTS REPETITION) ---
const DashboardWrapper = ({ title, color }) => {
  const navigate = useNavigate();
  const handleLogout = async () => { await signOut(auth); navigate("/"); };

  return (
    <div className="min-h-screen bg-slate-50 p-12">
      <div className="max-w-5xl mx-auto bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 text-left">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-black uppercase italic ${color}`}>{title}</h1>
            <p className="text-slate-400 font-bold text-[10px] tracking-[0.3em] uppercase mt-2">Authorized Session</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all">
            <LogOut size={16} /> Logout
          </button>
        </div>
        <div className="h-64 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center">
            <p className="text-slate-300 font-black uppercase tracking-widest italic">Content Module Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/rector/dashboard" element={<DashboardWrapper title="Rector" color="text-blue-900" />} />
        <Route path="/proprietor/dashboard" element={<DashboardWrapper title="Proprietor" color="text-purple-900" />} />
        <Route path="/accountant/dashboard" element={<DashboardWrapper title="Accountant" color="text-green-600" />} />
        <Route path="/admission/dashboard" element={<DashboardWrapper title="Admission" color="text-orange-600" />} />
        <Route path="/staff/portal" element={<DashboardWrapper title="Staff" color="text-red-600" />} />
        <Route path="/exam/dashboard" element={<DashboardWrapper title="Exams" color="text-indigo-600" />} />
        <Route path="/student/dashboard" element={<DashboardWrapper title="Student" color="text-slate-700" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}