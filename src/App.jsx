import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";

// Firebase Imports
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Shafukanmu (Pages)
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import Login from "./components/UnifiedLogin"; // Mun mayar da Login daban don sauki

// --- SECURITY WRAPPER ---
const DashboardWrapper = ({ title, color, allowedRole }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const storedRole = localStorage.getItem("userRole");
      if (!user || storedRole !== allowedRole) {
        localStorage.clear();
        navigate("/portal/login", { replace: true });
      } else {
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, [navigate, allowedRole]);

  if (checking) return (
    <div className="h-screen flex items-center justify-center bg-white italic font-black text-[#002147] tracking-widest">
        <Loader2 className="animate-spin mr-2" /> VERIFYING...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm border border-slate-100 text-left">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-black uppercase italic ${color}`}>{title} Portal</h1>
            <p className="text-slate-400 font-bold text-[10px] tracking-[0.3em] uppercase mt-2 italic">Authorized Management Environment</p>
          </div>
          <button 
            onClick={async () => { await signOut(auth); localStorage.clear(); navigate("/"); }} 
            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
        <div className="h-64 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
            <p className="text-slate-300 font-black uppercase tracking-[0.2em] italic text-xs">Ready for Module Injection</p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN ROUTING ---
export default function App() {
  const [activeTab, setActiveTab] = useState("HOME");

  return (
    <BrowserRouter>
      {/* Navbar zai fito a kowane shafi amma ba a Login ba */}
      <Routes>
        <Route path="/portal/login" element={null} />
        <Route path="*" element={<Navbar activeTab={activeTab} setActiveTab={setActiveTab} />} />
      </Routes>

      <Routes>
        {/* PUBLIC ROUTES - KOWA NA IYA GANI */}
        <Route path="/" element={<Home />} />
        <Route path="/portal/login" element={<Login />} />
        
        {/* PROTECTED ROUTES - SAI AN YI LOGIN */}
        <Route path="/rector/dashboard" element={<DashboardWrapper title="Rector" color="text-blue-900" allowedRole="rector" />} />
        <Route path="/proprietor/dashboard" element={<DashboardWrapper title="Proprietor" color="text-purple-900" allowedRole="proprietor" />} />
        <Route path="/accountant/dashboard" element={<DashboardWrapper title="Accountant" color="text-green-600" allowedRole="accountant" />} />
        <Route path="/admission/dashboard" element={<DashboardWrapper title="Admission" color="text-orange-600" allowedRole="admission" />} />
        <Route path="/staff/portal" element={<DashboardWrapper title="Staff" color="text-red-600" allowedRole="staff" />} />
        <Route path="/exam/dashboard" element={<DashboardWrapper title="Exams" color="text-indigo-600" allowedRole="exam" />} />
        <Route path="/student/dashboard" element={<DashboardWrapper title="Student" color="text-slate-700" allowedRole="student" />} />

        {/* Idan aka yi kuskuren rubuta link, a maida su Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}