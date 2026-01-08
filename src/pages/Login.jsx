import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogOut, Loader2 } from "lucide-react";
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
      // 1. Authenticate using Email only
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email.trim(), 
        formData.password
      );
      
      // 2. Fetch User Role from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (userDoc.exists()) {
        const role = userDoc.data().role?.toLowerCase();
        
        // 3. Automated Routing Map
        const routes = {
          student: "/student/dashboard",
          rector: "/rector/dashboard",
          proprietor: "/proprietor/dashboard",
          accountant: "/accountant/dashboard",
          admission: "/admission/dashboard",
          staff: "/staff/portal",
          exam: "/exam/dashboard"
        };

        const destination = routes[role];
        if (destination) {
          navigate(destination);
        } else {
          setError("User role is not recognized by the system.");
        }
      } else {
        setError("User profile not found in database.");
      }
    } catch (error) {
      setError("Invalid Email or Password. Access Denied.");
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
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 italic">Authorized Access Gateway</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase text-center border border-red-100 italic">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-slate-400">
                  <Mail size={18}/>
                </div>
                <input 
                  type="email" required 
                  placeholder="Enter your email"
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-red-600/20 font-bold"
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
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-red-600/20 font-bold"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-4 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#002147] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-blue-900/10"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Authorize Access"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD WRAPPER ---
const DashboardWrapper = ({ title, color }) => {
  const navigate = useNavigate();
  const handleLogout = async () => { await signOut(auth); navigate("/"); };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-left">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-10 border-b pb-8">
          <div>
            <h1 className={`text-4xl font-black uppercase tracking-tighter ${color} italic`}>{title}</h1>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mt-2">Skyward Management System</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-slate-50 rounded-[2rem] border border-slate-100"></div>
            <div className="h-32 bg-slate-50 rounded-[2rem] border border-slate-100"></div>
            <div className="h-32 bg-slate-50 rounded-[2rem] border border-slate-100"></div>
        </div>
      </div>
    </div>
  );
};

// --- APP COMPONENT ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/rector/dashboard" element={<DashboardWrapper title="Rector Portal" color="text-blue-900" />} />
        <Route path="/proprietor/dashboard" element={<DashboardWrapper title="Proprietor Center" color="text-purple-900" />} />
        <Route path="/accountant/dashboard" element={<DashboardWrapper title="Finance Unit" color="text-green-600" />} />
        <Route path="/admission/dashboard" element={<DashboardWrapper title="Admission Office" color="text-orange-600" />} />
        <Route path="/staff/portal" element={<DashboardWrapper title="Academic Staff" color="text-red-600" />} />
        <Route path="/exam/dashboard" element={<DashboardWrapper title="Exam Center" color="text-indigo-600" />} />
        <Route path="/student/dashboard" element={<DashboardWrapper title="Student Center" color="text-slate-700" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}