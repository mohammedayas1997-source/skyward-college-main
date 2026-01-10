import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogOut, Loader2, Hash, AlertCircle, ShieldCheck } from "lucide-react";
import { auth, db } from "./firebase"; 
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// --- IMPORT PAGES ---
import { Home } from "./pages/Home"; 
import Apply from "./pages/Apply"; 
import { CreateUserAccount } from "./pages/AdminUserManagement";

// --- IMPORT ACTUAL DASHBOARD PAGES ---
// Wadannan su ne ainihin files din da kake dasu
import RectorDashboard from "./pages/RectorDashboard";
import AccountantDashboard from "./pages/AccountantDashboard";
import AdmissionDashboard from "./pages/AdmissionDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ExamDashboard from "./pages/ExamDashboard";
import NewsAdminDashboard from "./pages/NewsAdminDashboard";
import StaffPortal from "./pages/StaffDashboard";
import ProprietorDashboard from "./pages/ProprietorDashboard"; // Na kara wannan

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

      if (!identifier.includes("@")) {
        const studentId = identifier.toUpperCase().trim();
        const q = query(collection(db, "users"), where("idNumber", "==", studentId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) throw new Error("Invalid ID Number.");
        emailToAuth = querySnapshot.docs[0].data().email;
      }

      const userCredential = await signInWithEmailAndPassword(auth, emailToAuth, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        if (userData.status === "inactive") {
            throw new Error("Your account has been deactivated. Contact Admin.");
        }

        const role = userData.role?.toLowerCase(); 
        localStorage.setItem("userRole", role);

        const routes = {
          student: "/student/dashboard",
          rector: "/rector/dashboard",
          proprietor: "/proprietor/dashboard",
          accountant: "/accountant/dashboard",
          admission: "/admission/dashboard",
          staff: "/staff/portal",
          exam: "/exam/dashboard",
          news_admin: "/news/admin",
          admin: "/admin/users"
        };

        if (routes[role]) {
          navigate(routes[role], { replace: true });
        } else {
          throw new Error("Unauthorized role or no dashboard assigned.");
        }
      } else {
        throw new Error("User record not found.");
      }
    } catch (err) {
      setError(err.message.includes("auth/") ? "Invalid Email or Password." : err.message);
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
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Authorized Access Only</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 border border-red-100">
                <AlertCircle size={14} /> {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Identify Yourself</label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-slate-400">
                   {identifier.includes("@") ? <Mail size={18} /> : <Hash size={18} />}
                </div>
                <input 
                  type="text" required placeholder="Email or Student ID"
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20"
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-4 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#002147] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Verify & Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- PROTECTED DASHBOARD WRAPPER ---
const DashboardWrapper = ({ title, color, allowedRole, children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const storedRole = localStorage.getItem("userRole");
      if (!user || storedRole !== allowedRole) {
        navigate("/portal/login", { replace: true });
      } else {
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, [navigate, allowedRole]);

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-[#002147]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white min-h-[90vh] rounded-[3rem] shadow-sm border border-slate-100 flex flex-col">
        <div className="flex justify-between items-center p-8 border-b border-slate-50">
          <div>
            <h1 className={`text-2xl font-black uppercase italic ${color}`}>{title} Portal</h1>
            <p className="text-slate-400 font-bold text-[8px] tracking-[0.3em] uppercase mt-1 italic">Skyward Multi-Level Management</p>
          </div>
          <button 
            onClick={async () => { await signOut(auth); localStorage.clear(); navigate("/portal/login"); }} 
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-black text-[9px] uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
        
        <div className="flex-grow p-6 md:p-10">
            {children ? children : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                    <ShieldCheck size={60} />
                    <p className="font-black uppercase tracking-widest mt-4 italic text-xs">Module Content Loading...</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portal/login" element={<Login />} />
        <Route path="/admission/apply" element={<Apply />} />
        
        {/* ADMIN */}
        <Route path="/admin/users" element={<DashboardWrapper title="Admin" color="text-blue-900" allowedRole="admin"><CreateUserAccount /></DashboardWrapper>} />
        
        {/* RECTOR */}
        <Route path="/rector/dashboard" element={<DashboardWrapper title="Rector" color="text-blue-900" allowedRole="rector"><RectorDashboard /></DashboardWrapper>} />

        {/* PROPRIETOR */}
        <Route path="/proprietor/dashboard" element={<DashboardWrapper title="Proprietor" color="text-purple-900" allowedRole="proprietor"><ProprietorDashboard /></DashboardWrapper>} />

        {/* ACCOUNTANT */}
        <Route path="/accountant/dashboard" element={<DashboardWrapper title="Accountant" color="text-green-600" allowedRole="accountant"><AccountantDashboard /></DashboardWrapper>} />

        {/* ADMISSION */}
        <Route path="/admission/dashboard" element={<DashboardWrapper title="Admission" color="text-orange-600" allowedRole="admission"><AdmissionDashboard /></DashboardWrapper>} />

        {/* STAFF */}
       <Route 
          path="/staff/portal" 
          element={
            <DashboardWrapper title="Staff" color="text-red-600" allowedRole="staff">
                <StaffPortal /> 
            </DashboardWrapper>
          } 
        />

        {/* EXAM */}
        <Route path="/exam/dashboard" element={<DashboardWrapper title="Exams" color="text-indigo-600" allowedRole="exam"><ExamDashboard /></DashboardWrapper>} />

        {/* STUDENT */}
        <Route path="/student/dashboard" element={<DashboardWrapper title="Student" color="text-slate-700" allowedRole="student"><StudentDashboard /></DashboardWrapper>} />

        {/* NEWS ADMIN */}
        <Route path="/news/admin" element={<DashboardWrapper title="News Admin" color="text-pink-600" allowedRole="news_admin"><NewsAdminDashboard /></DashboardWrapper>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}