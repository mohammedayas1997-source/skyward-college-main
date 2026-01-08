import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Mail, Lock, Hash, Loader2, AlertCircle } from "lucide-react";

const PortalLogin = () => {
  const [identifier, setIdentifier] = useState(""); // Zai iya zama Email ko ID
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let emailToAuth = identifier.trim();

      // --- DUBAWA: Shin Student ID ne ko Email? ---
      if (!identifier.includes("@")) {
        // Idan babu "@", to lallai Student ID ne
        const studentId = identifier.toUpperCase().trim();
        const q = query(collection(db, "users"), where("idNumber", "==", studentId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("Invalid Student ID Number.");
        }
        // Nemo Email din da ke jikin wannan ID din
        emailToAuth = querySnapshot.docs[0].data().email;
      } else {
        // Idan akwai "@", to Email ne na Staff/Admin
        if (!identifier.endsWith("@skyward.edu.ng")) {
          throw new Error("Please use your official @skyward.edu.ng email.");
        }
      }

      // --- SIGN IN ---
      const userCredential = await signInWithEmailAndPassword(auth, emailToAuth, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role;
        
        // --- SMART ROUTING ---
        const routes = {
          student: "/student/dashboard",
          staff: "/staff/portal",
          admission: "/admission/dashboard",
          rector: "/rector/dashboard",
          accountant: "/accountant/dashboard"
        };

        navigate(routes[role] || "/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
      <div className="w-full max-w-[450px]">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-[#002147] uppercase tracking-tighter italic italic">
            SKYWARD <span className="text-red-600">PORTAL</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Unified Access Point</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 border border-red-100">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">
                {identifier.includes("@") ? "Staff Email" : "Student ID Number"}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-slate-400">
                  {identifier.includes("@") ? <Mail size={18} /> : <Hash size={18} />}
                </div>
                <input 
                  type="text" required
                  placeholder={identifier.includes("@") ? "staff@skyward.edu.ng" : "SKW/2026/001"}
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20 transition-all"
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-4 tracking-widest">Password</label>
              <div className="relative text-slate-400">
                <Lock className="absolute left-4 top-4" size={18} />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20 transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#002147] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all shadow-xl"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Authorize Access"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PortalLogin;