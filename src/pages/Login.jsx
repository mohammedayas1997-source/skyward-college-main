import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, LogOut } from "lucide-react";
// Shigo da Firebase config dinka
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// --- LOGIN COMPONENT ---
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Shiga da Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Nemo Role din sa daga Firestore collection na "users"
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        
        // 3. Tura shi shafin da ya dace dangane da ROLE
        if (role === "rector") navigate("/rector/dashboard");
        else if (role === "proprietor") navigate("/proprietor/dashboard");
        else if (role === "accountant") navigate("/accountant/dashboard");
        else if (role === "admission") navigate("/admission/dashboard");
        else if (role === "staff") navigate("/staff/portal");
        else if (role === "exam") navigate("/exam/dashboard");
        else if (role === "student") navigate("/student/dashboard");
        else alert("Ba a saita matsayinka a system ba.");
      } else {
        alert("Ba a sami bayananka a database din ma'aikata ba.");
      }
    } catch (error) {
      alert("Kuskure wurin Login: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-sans p-6">
      <div className="w-full max-w-[450px]">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Skyward <span className="text-red-600">Portal</span></h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Secure Multi-Role Access</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4">Email Address</label>
              <input 
                type="email" required placeholder="user@skyward.edu.ng"
                className="w-full bg-slate-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-red-600/20"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  className="w-full bg-slate-50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-red-600/20"
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
              className="w-full bg-[#002147] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login to System"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- GENERIC DASHBOARD COMPONENT ---
const DashboardWrapper = ({ title, color }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-12">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-black uppercase tracking-tighter ${color}`}>{title}</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Skyward Management System</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-50 rounded-3xl h-32 flex items-end font-black text-slate-300 uppercase">Statistics</div>
          <div className="p-6 bg-slate-50 rounded-3xl h-32 flex items-end font-black text-slate-300 uppercase">Recent Activity</div>
          <div className="p-6 bg-slate-50 rounded-3xl h-32 flex items-end font-black text-slate-300 uppercase">Notifications</div>
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
        <Route path="/rector/dashboard" element={<DashboardWrapper title="Rector Dashboard" color="text-blue-900" />} />
        <Route path="/proprietor/dashboard" element={<DashboardWrapper title="Proprietor Dashboard" color="text-purple-900" />} />
        <Route path="/accountant/dashboard" element={<DashboardWrapper title="Accountant Portal" color="text-green-600" />} />
        <Route path="/admission/dashboard" element={<DashboardWrapper title="Admission Office" color="text-orange-600" />} />
        <Route path="/staff/portal" element={<DashboardWrapper title="Staff Portal" color="text-red-600" />} />
        <Route path="/exam/dashboard" element={<DashboardWrapper title="Exam Officer" color="text-indigo-600" />} />
        <Route path="/student/dashboard" element={<DashboardWrapper title="Student Center" color="text-slate-700" />} />
      </Routes>
    </BrowserRouter>
  );
}