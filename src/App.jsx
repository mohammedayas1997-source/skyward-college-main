import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogOut, Hash, Loader2, AlertCircle } from "lucide-react";
import { auth, db } from "./firebase"; // Tabbatar path din firebase.js dinka yana nan
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// --- LOGIN COMPONENT ---
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

      if (!isEmail) {
        // --- STUDENT ID PATH ---
        const formattedId = input.toUpperCase();
        const q = query(collection(db, "users"), where("idNumber", "==", formattedId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("Invalid Student ID Number.");
        }
        emailToUse = querySnapshot.docs[0].data().email;
      } else {
        // --- STAFF EMAIL PATH (Security Check) ---
        if (!input.toLowerCase().endsWith("@skyward.edu.ng")) {
          // Idan kana so ka kyale Gmail ma, za ka iya goge wannan layin na kasa
          throw new Error("Staff must use official @skyward.edu.ng email.");
        }
      }

      // LOGIN TO FIREBASE
      const userCredential = await signInWithEmailAndPassword(auth, emailToUse, formData.password);
      const user = userCredential.user;

      // FETCH ROLE & REDIRECT
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role.toLowerCase();
        
        const routes = {
          student: "/student/dashboard",
          rector: "/rector/dashboard",
          proprietor: "/proprietor/dashboard",
          accountant: "/accountant/dashboard",
          admission: "/admission/dashboard",
          staff: "/staff/portal",
          exam: "/exam/dashboard"
        };

        if (routes[role]) navigate(routes[role]);
        else setError("Authorized but role not assigned.");
      } else {
        setError("User record not found in database.");
      }
    } catch (err) {
      setError(err.message.includes("auth/") ? "Invalid ID/Email or Password." : err.message);
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
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mt-2 italic">Official Academic Gateway</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,33,71,0.1)] border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 border border-red-100 italic text-left">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Identify Yourself</label>
              <div className="relative">
                <div className="absolute left-5 top-5 text-slate-400">
                  {formData.identifier.includes("@") ? <Mail size={18}/> : <Hash size={18}/>}
                </div>
                <input 
                  type="text" required 
                  placeholder="ID Number or Email"
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
              type="submit" disabled={loading}
              className="w-full bg-[#002147] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Authorize Access"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- PROTECTED DASHBOARD WRAPPER ---
const DashboardWrapper = ({ title, color, allowedRole }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
        return;
      }
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (allowedRole && userData.role.toLowerCase() !== allowedRole.toLowerCase()) {
          navigate("/"); 
          return;
        }
        setUserName(userData.fullName || "User");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate, allowedRole]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-[#002147]" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-6 md:p-12 text-left">
      <div className="max-w-5xl mx-auto bg-white p-8 md:p-14 rounded-[3.5rem] shadow-sm border border-white">
        <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-8 text-left">
          <div>
            <h1 className={`text-4xl font-black uppercase tracking-tighter italic ${color}`}>{title}</h1>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mt-2 italic">
              Authenticated: {userName}
            </p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-end min-h-[160px]">
              <span className="text-slate-200 font-black text-[40px] leading-none mb-2 italic">0{i}</span>
              <span className="text-[#002147] font-black text-[10px] uppercase tracking-widest">Skyward Module</span>
            </div>
          ))}
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
        <Route path="/" element={<Login />} />
        <Route path="/rector/dashboard" element={<DashboardWrapper title="Rector Office" color="text-blue-900" allowedRole="rector" />} />
        <Route path="/proprietor/dashboard" element={<DashboardWrapper title="Proprietor Center" color="text-purple-900" allowedRole="proprietor" />} />
        <Route path="/accountant/dashboard" element={<DashboardWrapper title="Finance Portal" color="text-green-600" allowedRole="accountant" />} />
        <Route path="/admission/dashboard" element={<DashboardWrapper title="Admission Unit" color="text-orange-600" allowedRole="admission" />} />
        <Route path="/staff/portal" element={<DashboardWrapper title="Staff Faculty" color="text-red-600" allowedRole="staff" />} />
        <Route path="/exam/dashboard" element={<DashboardWrapper title="Exam Office" color="text-indigo-600" allowedRole="exam" />} />
        <Route path="/student/dashboard" element={<DashboardWrapper title="Student Portal" color="text-slate-700" allowedRole="student" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}