import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { 
  doc, setDoc, serverTimestamp, collection, 
  onSnapshot, query, updateDoc, orderBy 
} from "firebase/firestore";
import { 
  UserPlus, ShieldCheck, Loader2, BadgeCheck, 
  UserMinus, UserCheck, KeyRound, History, 
  Search, ShieldAlert, Users, Trash2 
} from "lucide-react";

export const CreateUserAccount = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "staff",
    idNumber: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("create"); 

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

  // REAL-LIFE DATA FETCHING
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setUsersList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 1. REAL-LIFE FUNCTION: CHANGE PASSWORD WITHOUT OTP
  const handleAdminPasswordReset = async (userId) => {
    const newPass = window.prompt("Enter new Password (at least 6 characters):");
    if (!newPass || newPass.length < 6) return alert("Password must be at least 6 characters!");

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", userId), {
        password: newPass, 
        isFirstLogin: true,
        lastModified: serverTimestamp(),
        modifiedBy: "Accountant"
      });
      alert("Password changed successfully! ✅");
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  // 2. REAL-LIFE FUNCTION: SUSPEND / UNSUSPEND USER
  const toggleUserStatus = async (user) => {
    const newStatus = user.status === "suspended" ? "active" : "suspended";
    const confirmMsg = `Are you sure you want to ${newStatus === 'suspended' ? 'Suspend' : 'Activate'} ${user.fullName}?`;
    
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.id), {
        status: newStatus,
        suspendedAt: newStatus === "suspended" ? serverTimestamp() : null,
        suspendedBy: "Accountant"
      });
      alert(`User status updated to: ${newStatus.toUpperCase()}`);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (formData.role === "student" && !formData.idNumber) {
      return alert("Please provide an ID Number (Reg No) for this student.");
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;
      
      const finalId = formData.role === "student" 
        ? formData.idNumber.toUpperCase() 
        : "STAFF-" + Math.floor(1000 + Math.random() * 9000);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        idNumber: finalId,
        status: "active",
        isFirstLogin: true,
        createdAt: serverTimestamp(),
        balance: "₦ 0.00"
      });

      alert(`Success! Created ${formData.role} account for: ${formData.fullName}\nID: ${finalId}`);
      setFormData({ fullName: "", email: "", password: "", role: "staff", idNumber: "" });

    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 font-sans">
      
      {/* HEADER WITH TABS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[#002147] rounded-3xl text-white shadow-2xl">
            <Users size={32} />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-black text-[#002147] tracking-tighter uppercase leading-none">Global Control</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Advanced User Management System</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('create')}
            className={`flex-1 md:px-8 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${activeTab === 'create' ? 'bg-white shadow-md text-[#002147]' : 'text-slate-500'}`}
          >
            Create New
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            className={`flex-1 md:px-8 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${activeTab === 'manage' ? 'bg-white shadow-md text-[#002147]' : 'text-slate-500'}`}
          >
            Manage Users ({usersList.length})
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-2xl mx-auto text-left transition-all">
          <div className="flex items-center gap-3 mb-8 border-b pb-6">
            <BadgeCheck size={24} className="text-emerald-500" />
            <h2 className="text-xl font-black text-[#002147] uppercase italic">Account Onboarding</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-2">Full Name</label>
              <input type="text" required value={formData.fullName} placeholder="Ahmad Musa" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#002147] uppercase ml-2">Email Address</label>
                <input type="email" required value={formData.email} placeholder="user@skyward.com" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#002147] uppercase ml-2">ID (Students Only)</label>
                <input type="text" value={formData.idNumber} placeholder="SKY/2026/001" disabled={formData.role !== "student"} className="w-full p-4 bg-slate-100 border rounded-2xl font-bold uppercase" onChange={(e) => setFormData({...formData, idNumber: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-2">User Access Level</label>
              <select className="w-full p-4 bg-slate-50 border rounded-2xl font-black uppercase text-xs" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#002147] uppercase ml-2">Temporary Password</label>
              <input type="password" required value={formData.password} placeholder="••••••••" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#002147] text-white py-5 rounded-3xl font-black uppercase text-[11px] hover:bg-emerald-600 transition-all shadow-xl shadow-blue-900/10">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Authorize & Create Account"}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-5">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, role or email..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5 font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden text-left">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-[#002147] uppercase tracking-widest">
                    <th className="p-6">User Details</th>
                    <th className="p-6">Role</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                    <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-all group text-left">
                      <td className="p-6 text-left">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-xs ${user.status === 'suspended' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-[#002147]'}`}>
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className={`font-black text-sm uppercase ${user.status === 'suspended' ? 'line-through text-slate-400' : 'text-[#002147]'}`}>{user.fullName}</p>
                            <p className="text-[10px] font-bold text-slate-400">{user.email} • ID: {user.idNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-tighter italic">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1 text-left">
                          <div className={`flex items-center gap-1.5 font-black text-[9px] uppercase ${user.status === 'suspended' ? 'text-red-500' : 'text-emerald-500'}`}>
                            {user.status === 'suspended' ? <ShieldAlert size={12}/> : <ShieldCheck size={12}/>}
                            {user.status || 'Active'}
                          </div>
                          {user.suspendedBy && <p className="text-[7px] text-slate-400 font-bold uppercase">By: {user.suspendedBy}</p>}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleAdminPasswordReset(user.id)}
                            title="Reset Password"
                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <KeyRound size={16} />
                          </button>
                          
                          <button 
                            onClick={() => toggleUserStatus(user)}
                            title={user.status === 'suspended' ? "Activate User" : "Suspend User"}
                            className={`p-2.5 rounded-xl transition-all shadow-sm ${user.status === 'suspended' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
                          >
                            {user.status === 'suspended' ? <UserCheck size={16} /> : <UserMinus size={16} />}
                          </button>

                          <button 
                            title="View History"
                            className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-[#002147] hover:text-white transition-all shadow-sm"
                          >
                            <History size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between items-center px-6 py-4 bg-white/50 rounded-3xl border border-slate-100 italic">
          <p className="text-[10px] font-bold text-slate-400 uppercase">SKYWARD ACADEMY MANAGEMENT SYSTEM © 2026</p>
          <div className="flex gap-4">
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase"><div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div> Server Active</span>
          </div>
      </div>
    </div>
  );
};