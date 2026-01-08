import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { UserPlus, Shield, Mail, Lock, Hash, Loader2 } from "lucide-react";

const AddUser = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    idNumber: "",
    password: "",
    role: "student" // default role
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1. Create account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Save detailed info in Firestore (IMPORTANT FOR LOGIN)
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email.toLowerCase().trim(),
        idNumber: formData.idNumber.toUpperCase().trim(),
        role: formData.role,
        createdAt: new Date()
      });

      setMessage(`Success! ${formData.role} account created.`);
      setFormData({ fullName: "", email: "", idNumber: "", password: "", role: "student" });
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-[2rem] shadow-xl border border-slate-100 mt-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-red-100 rounded-2xl text-red-600">
          <UserPlus size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#002147] uppercase">Add New User</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Create Student or Staff Accounts</p>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        {message && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase border border-blue-100">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-50 border-none py-4 px-5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20 transition-all"
              placeholder="Sani Musa"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              value={formData.fullName}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest">ID Number</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-50 border-none py-4 px-5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20 transition-all"
              placeholder="SKW/2026/001"
              onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
              value={formData.idNumber}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest">Email Address</label>
          <input 
            type="email" 
            required
            className="w-full bg-slate-50 border-none py-4 px-5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20 transition-all"
            placeholder="student@skyward.edu.ng"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            value={formData.email}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest">Assign Role</label>
            <select 
              className="w-full bg-slate-50 border-none py-4 px-5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20 transition-all"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              value={formData.role}
            >
              <option value="student">Student</option>
              <option value="staff">Staff / Lecturer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-50 border-none py-4 px-5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-600/20 transition-all"
              placeholder="******"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              value={formData.password}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-[#002147] text-white py-5 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all disabled:bg-slate-300 shadow-lg shadow-blue-900/20"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Create Account & ID"}
        </button>
      </form>
    </div>
  );
};

export default AddUser;