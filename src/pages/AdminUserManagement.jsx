import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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
    
    // Tabbatar an sanya ID Number idan dalibi ne
    if (formData.role === "student" && !formData.idNumber) {
      return alert("Dan Allah sanya ID Number (Reg No) na dalibin nan.");
    }

    setLoading(true);
    try {
      // 1. Create in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;
      
      // 2. Shirya ID Number
      const finalId = formData.role === "student" 
        ? formData.idNumber.toUpperCase() 
        : "STAFF-" + Math.floor(1000 + Math.random() * 9000);

      // 3. Create the User Document a Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        idNumber: finalId,
        status: "active",
        isFirstLogin: true, // Wannan zai sa su canza password a karon farko
        createdAt: serverTimestamp(), // Amfani da lokacin server yafi gaskiya
        course: "", // Za'a iya update daga baya ta Admission Officer
        balance: "₦ 0.00"
      });

      alert(`Success! Created ${formData.role} account for: ${formData.fullName}\nID: ${finalId}`);
      
      // 4. Reset Form bayan an gama
      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "staff",
        idNumber: ""
      });

    } catch (err) {
      console.error("Creation Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        alert("Wannan Email din riga an bude account da shi.");
      } else if (err.code === 'auth/weak-password') {
        alert("Password din yayi rauni sosai (akalla ya kai baki 6).");
      } else {
        alert("Kuskure: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-[2rem] shadow-xl max-w-2xl mx-auto border border-slate-100 mt-10 text-left animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8 border-b pb-6 text-left">
        <div className="p-3 bg-[#002147] rounded-2xl text-white shadow-lg shadow-blue-900/20">
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
          <label className="text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest">Full Name</label>
          <input 
            type="text" required 
            value={formData.fullName}
            placeholder="Example: Ahmad Musa" 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 font-bold text-sm"
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest">Email (Login ID)</label>
            <input 
              type="email" required 
              value={formData.email}
              placeholder="admin@skyward.com" 
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 font-bold text-sm"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          {/* ID Number */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest">Reg No (Students Only)</label>
            <input 
              type="text" 
              value={formData.idNumber}
              disabled={formData.role !== "student"}
              placeholder={formData.role === "student" ? "SKY/2026/001" : "Auto-generated for Staff"} 
              className={`w-full p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 font-bold uppercase text-sm ${formData.role === "student" ? "bg-white border-2 border-red-500/20" : "bg-slate-100 border border-slate-200 cursor-not-allowed"}`}
              onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
            />
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest">Select User Role</label>
          <select 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 font-black uppercase text-xs cursor-pointer"
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
          <label className="text-[10px] font-black text-[#002147] uppercase ml-2 tracking-widest">Temporary Password</label>
          <input 
            type="password" required 
            value={formData.password}
            placeholder="••••••••" 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 font-bold text-sm"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full bg-[#002147] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 mt-4 disabled:bg-slate-400"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> Creating Account...</>
          ) : (
            <><ShieldCheck size={20} /> Confirm Account Creation</>
          )}
        </button>
      </form>
    </div>
  );
};