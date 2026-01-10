import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { UserPlus, ShieldCheck, Loader2, Mail, BadgeCheck } from "lucide-react";

export const CreateUserAccount = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "staff", 
    idNumber: "" 
  });
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: "admin", name: "Super Admin" },
    { id: "rector", name: "Rector" },
    { id: "proprietor", name: "Proprietor" },
    { id: "accountant", name: "Accountant" },
    { id: "admission", name: "Admission Officer" },
    { id: "exam", name: "Exam Officer" },
    { id: "news_admin", name: "News Admin" },
    { id: "staff", name: "Academic Staff" },
    { id: "student", name: "Student" }
  ];

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create in Auth (Email/Password)
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // 2. Create the User Document with Active Status
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        idNumber: formData.role === "student" ? formData.idNumber.toUpperCase() : "STAFF-" + Math.floor(1000 + Math.random() * 9000),
        status: "active", // Added status field
        createdAt: new Date().toISOString()
      });

      alert(`Success! Created ${formData.role} account for: ${formData.fullName}`);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-[2rem] shadow-xl max-w-2xl mx-auto border border-slate-100 mt-10">
      <div className="flex items-center gap-3 mb-8 border-b pb-6">
        <div className="p-3 bg-[#002147] rounded-2xl text-white">
          <BadgeCheck size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#002147] uppercase tracking-tighter">User Management</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Create new staff or student accounts</p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-[#002147] uppercase ml-2">Full Name</label>
          <input 
            type="text" required placeholder="Example: Ahmad Musa" 
            className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-red-600/20 font-bold"
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#002147] uppercase ml-2">Email Address (Login Username)</label>
            <input 
              type="email" required placeholder="admin@skyward.com" 
              className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-red-600/20 font-bold"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          {/* ID Number */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#002147] uppercase ml-2">ID Number (Students Only)</label>
            <input 
              type="text" placeholder="SKY/2026/001" 
              className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-red-600/20 font-bold uppercase"
              onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
            />
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-[#002147] uppercase ml-2">Select User Role</label>
          <select 
            className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-red-600/20 font-black uppercase text-xs"
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            value={formData.role}
          >
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-[#002147] uppercase ml-2">Login Password</label>
          <input 
            type="password" required placeholder="••••••••" 
            className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-red-600/20 font-bold"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full bg-[#002147] text-white py-5 rounded-xl font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/10"
        >
          {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
          Confirm Account Creation
        </button>
      </form>
    </div>
  );
};