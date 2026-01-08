import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { auth, db } from "./firebase"; 
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Mail, Lock, Hash, Eye, EyeOff, Loader2, AlertCircle, LogOut } from "lucide-react";

// --- 1. LOGIN COMPONENT ---
const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let emailToAuth = identifier.trim();

      // Idan ID Number ne (ba shi da @)
      if (!identifier.includes("@")) {
        const studentId = identifier.toUpperCase().trim();
        const q = query(collection(db, "users"), where("idNumber", "==", studentId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) throw new Error("Student ID not found.");
        emailToAuth = querySnapshot.docs[0].data().email;
      }

      const userCredential = await signInWithEmailAndPassword(auth, emailToAuth, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role.toLowerCase();
        navigate(`/${role}/dashboard`);
      } else {
        throw new Error("User record not found in database.");
      }
    } catch (err) {
      setError(err.code === "auth/invalid-credential" ? "Wrong ID/Email or Password." : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#002147] italic uppercase">SKYWARD <span className="text-red-600">PORTAL</span></h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Unified Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2"><AlertCircle size={16}/> {error}</div>}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Email or ID Number</label>
            <div className="relative">
              <div className="absolute left-4 top-4 text-slate-400">{identifier.includes("@") ? <Mail size={18}/> : <Hash size={18}/>}</div>
              <input type="text" required placeholder="SKW/2026/001" className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20" onChange={(e) => setIdentifier(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 text-slate-400" size={18}/>
              <input type={showPassword ? "text" : "password"} required placeholder="••••••••" className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20" onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-400">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#002147] text-white py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-red-600 transition-all shadow-lg">
            {loading ? <Loader2 className="animate-spin mx-auto" size={20}/> : "SIGN IN"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 2. PROTECTED DASHBOARD WRAPPER ---
const DashboardWrapper = ({ title, color, allowedRole }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
      } else {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists() && docSnap.data().role.toLowerCase() === allowedRole) {
          setUserName(docSnap.data().fullName || "User");
          setLoading(false);
        } else {
          navigate("/");
        }
      }
    });
    return () => unsubscribe();
  }, [navigate, allowedRole]);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-[#002147] italic">AUTHENTICATING...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <div>
            <h1 className={`text-3xl font-black italic uppercase ${color}`}>{title}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Welcome, {userName}</p>
          </div>
          <button onClick={() => signOut(auth)} className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all">
            <LogOut size={16}/> Logout
          </button>
        </div>
        <div className="h-48 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 font-bold italic">Dashboard Content Coming Soon...</div>
      </div>
    </div>
  );
};

// --- 3. MAIN APP ROUTING ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student/dashboard" element={<DashboardWrapper title="Student Portal" color="text-slate-700" allowedRole="student" />} />
        <Route path="/staff/dashboard" element={<DashboardWrapper title="Staff Faculty" color="text-red-600" allowedRole="staff" />} />
        <Route path="/rector/dashboard" element={<DashboardWrapper title="Rector Office" color="text-blue-900" allowedRole="rector" />} />
        <Route path="/accountant/dashboard" element={<DashboardWrapper title="Finance Dept" color="text-green-600" allowedRole="accountant" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}