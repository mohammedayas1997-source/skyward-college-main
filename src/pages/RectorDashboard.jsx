import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Tabbatar kana da wannan
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, onSnapshot, query, serverTimestamp } from "firebase/firestore";
import { 
  ShieldAlert, Users, Landmark, Activity, Bell, 
  X, CheckCircle2, UserX, UserCheck, CreditCard, 
  ArrowUpRight, History, MoreVertical, Search, Menu, LogOut, UserPlus, ShieldCheck,
  Eye, FileBarChart, Newspaper // Na kara wadannan icons din
} from "lucide-react";

const RectorDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state don kirkirar sabon User
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "staff"
  });

  // --- BAYANAN STAFF DAGA FIREBASE (Idan kana so su zama live) ---
  const [staffList, setStaffList] = useState([
    { id: 1, name: "Dr. Aliyu Musa", role: "Science Teacher", status: "Active" },
    { id: 2, name: "Ishaq Ibrahim", role: "Accountant", status: "Suspended" },
    { id: 3, name: "Fatima Adamu", role: "HOD Tourism", status: "Active" },
  ]);

  const [financialRequests, setFinancialRequests] = useState([
    { id: 101, title: "Staff Salary - January", amount: "₦8,200,000", requester: "Accountant", date: "Jan 04" },
    { id: 102, title: "Lab Chemical Purchase", amount: "₦350,000", requester: "HOD Science", date: "Jan 03" },
  ]);

  // AIKIN KIRKIRAR SABON USER (ADMIN, STAFF, NEWS ADMIN ETC)
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        status: "Active",
        createdAt: serverTimestamp()
      });

      alert(`An samar da asusun ${newUser.role} cikin nasara!`);
      setNewUser({ fullName: "", email: "", password: "", role: "staff" });
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStaffStatus = (id) => {
    setStaffList(staffList.map(staff => {
      if (staff.id === id) {
        return { ...staff, status: staff.status === "Active" ? "Suspended" : "Active" };
      }
      return staff;
    }));
  };

  const approvePayment = (id) => {
    setFinancialRequests(financialRequests.filter(req => req.id !== id));
    alert("An amince da fitar da wannan kudi! An tura sanarwa ga Accountant.");
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col lg:flex-row font-sans overflow-x-hidden relative text-left">
      
      {/* MOBILE MENU TOGGLE */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] bg-red-600 text-white p-3 rounded-2xl shadow-xl"
      >
        {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
      </button>

      {/* SIDEBAR */}
      <div className={`
        fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-72 bg-[#001529] text-white p-8 flex flex-col z-50 h-screen lg:sticky top-0 shadow-2xl
      `}>
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-red-600 rounded-xl shadow-lg shadow-red-900/40">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="font-black text-xl tracking-tighter italic text-red-500 uppercase">Rector</h2>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Supreme Control</p>
          </div>
        </div>

        <nav className="space-y-6 flex-1">
          <button className="w-full flex items-center gap-3 bg-red-600 p-4 rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all text-left">
            <Activity size={18}/> Global Oversight
          </button>
          <button className="w-full flex items-center gap-3 hover:bg-white/5 p-4 rounded-2xl font-black text-[10px] uppercase text-slate-400 text-left transition-all">
            <Users size={18}/> Staff Management
          </button>
          <button className="w-full flex items-center gap-3 hover:bg-white/5 p-4 rounded-2xl font-black text-[10px] uppercase text-slate-400 text-left transition-all">
            <Landmark size={18}/> Financial Vouchers
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 p-4 rounded-2xl font-black text-[10px] uppercase text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all w-full"
        >
          <LogOut size={18}/> Termination Session
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto pt-16 lg:pt-12">
        
        <header className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl font-black text-[#001529] uppercase tracking-tighter">Command Center</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Ikon Gudanarwa na Rector • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white h-14 w-14 rounded-2xl border border-slate-200 flex items-center justify-center text-[#001529] shadow-sm relative cursor-pointer hover:bg-slate-50 transition-all">
                <Bell size={24}/>
                <span className="absolute top-4 right-4 h-2 w-2 bg-red-600 rounded-full border-2 border-white animate-pulse"></span>
             </div>
          </div>
        </header>

        {/* RECTOR OVERSIGHT - GANIN AIKIN KOWA */}
        <section className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-200 mb-10">
          <h3 className="font-black text-[#001529] uppercase text-xs tracking-widest mb-8 flex items-center gap-2">
            <Eye className="text-blue-600" size={18}/> Live Departmental Oversight
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100">
              <Landmark className="text-emerald-600 mb-3" size={20}/>
              <p className="text-[9px] font-black text-emerald-800 uppercase">Revenue Today</p>
              <h4 className="text-xl font-black text-emerald-900">₦1.2M</h4>
            </div>
            <div className="p-5 bg-purple-50 rounded-3xl border border-purple-100">
              <FileBarChart className="text-purple-600 mb-3" size={20}/>
              <p className="text-[9px] font-black text-purple-800 uppercase">Results Uploaded</p>
              <h4 className="text-xl font-black text-purple-900">85%</h4>
            </div>
            <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100">
              <UserPlus className="text-blue-600 mb-3" size={20}/>
              <p className="text-[9px] font-black text-blue-800 uppercase">New Admissions</p>
              <h4 className="text-xl font-black text-blue-900">42 Today</h4>
            </div>
            <div className="p-5 bg-orange-50 rounded-3xl border border-orange-100">
              <Newspaper className="text-orange-600 mb-3" size={20}/>
              <p className="text-[9px] font-black text-orange-800 uppercase">News Updates</p>
              <h4 className="text-xl font-black text-orange-900">03</h4>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          <div className="xl:col-span-2 space-y-8">
            {/* 1. FINANCIAL APPROVALS */}
            <div className="bg-white rounded-[45px] p-8 lg:p-10 shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black text-[#001529] uppercase text-xs tracking-widest flex items-center gap-2">
                    <CreditCard className="text-green-600" size={18}/> Pending Fund Approvals
                  </h3>
                  <span className="bg-red-50 text-red-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter animate-bounce">Needs Immediate Action</span>
                </div>

                <div className="space-y-4">
                  {financialRequests.length > 0 ? financialRequests.map((req) => (
                    <div key={req.id} className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50 rounded-[30px] border border-slate-100 group hover:border-red-500 transition-all gap-4">
                       <div className="flex items-center gap-5 w-full sm:w-auto">
                          <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm"><Landmark size={20}/></div>
                          <div>
                             <h4 className="font-black text-[#001529] text-xs uppercase">{req.title}</h4>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{req.requester} • {req.date}</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                          <span className="text-lg font-black text-[#001529]">{req.amount}</span>
                          <div className="flex gap-2">
                             <button onClick={() => alert("Payment Rejected")} className="h-10 w-10 bg-white border border-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><X size={18}/></button>
                             <button onClick={() => approvePayment(req.id)} className="h-10 w-10 bg-[#001529] text-white rounded-xl hover:bg-green-600 transition-all flex items-center justify-center shadow-lg"><CheckCircle2 size={18}/></button>
                          </div>
                       </div>
                    </div>
                  )) : (
                    <p className="text-center py-10 text-slate-400 font-black text-[10px] uppercase">No pending requests</p>
                  )}
                </div>
            </div>

            {/* 2. ADD NEW USER SECTION */}
            <div className="bg-white rounded-[45px] p-8 lg:p-10 shadow-sm border border-slate-200">
                <h3 className="font-black text-[#001529] uppercase text-xs tracking-widest mb-8 flex items-center gap-2">
                  <UserPlus className="text-red-600" size={18}/> Provision New Official
                </h3>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    type="text" placeholder="Full Name" required
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 ring-red-600 font-bold text-xs"
                    value={newUser.fullName} onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                  />
                  <input 
                    type="email" placeholder="Email Address" required
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 ring-red-600 font-bold text-xs"
                    value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                  <input 
                    type="password" placeholder="Temporary Password" required
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 ring-red-600 font-bold text-xs"
                    value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                  <select 
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 ring-red-600 font-black uppercase text-[10px]"
                    value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="staff">Staff/Lecturer</option>
                    <option value="accountant">Accountant</option>
                    <option value="exam-officer">Exams Officer</option>
                    <option value="admission-officer">Admission Officer</option>
                    <option value="news-admin">News Admin</option> {/* AN KARA WANNAN */}
                    <option value="admin">System Admin</option>
                  </select>
                  <button 
                    type="submit" disabled={loading}
                    className="md:col-span-2 bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#001529] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? "Processing..." : <><ShieldCheck size={16}/> Activate Security Credentials</>}
                  </button>
                </form>
            </div>
          </div>

          <div className="space-y-8">
            {/* 3. STAFF CONTROL PANEL */}
            <div className="bg-white rounded-[45px] p-8 shadow-sm border border-slate-200">
               <h3 className="font-black text-[#001529] uppercase text-xs tracking-widest mb-6">Security Logs</h3>
               <div className="space-y-4">
                  {staffList.map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                       <div>
                          <p className="font-black text-[10px] uppercase text-[#001529]">{staff.name}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">{staff.role}</p>
                       </div>
                       <button onClick={() => toggleStaffStatus(staff.id)} className={`p-2 rounded-xl ${staff.status === 'Active' ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'}`}>
                          {staff.status === 'Active' ? <UserX size={16}/> : <UserCheck size={16}/>}
                       </button>
                    </div>
                  ))}
               </div>
            </div>

            {/* AUDIT LOG */}
            <div className="bg-[#001529] rounded-[45px] p-8 text-white shadow-2xl relative overflow-hidden h-full">
               <h3 className="font-black uppercase text-xs tracking-widest mb-8 flex items-center gap-2">
                 <History className="text-red-500" size={18}/> Audit Trail
               </h3>
               <div className="space-y-6 border-l border-white/10 ml-2 pl-6 text-[10px]">
                  {[
                    { time: "10:15 AM", log: "Accountant generated fee report", type: "Finance" },
                    { time: "09:40 AM", log: "Lecturer uploaded attendance", type: "Academic" },
                    { time: "08:00 AM", log: "New admission processed", type: "Admission" },
                  ].map((log, i) => (
                    <div key={i}>
                       <p className="font-black text-red-400 uppercase">{log.time}</p>
                       <p className="font-bold text-slate-300 uppercase">{log.log}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RectorDashboard;