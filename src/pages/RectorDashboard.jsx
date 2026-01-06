import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; 
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { 
  ShieldAlert, Users, Landmark, Activity, Bell, 
  X, CheckCircle2, UserX, UserCheck, CreditCard, 
  ArrowUpRight, History, MoreVertical, Search, Menu, LogOut, UserPlus, ShieldCheck,
  Eye, FileBarChart, Newspaper 
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

  // --- BAYANAN STAFF ---
  const [staffList, setStaffList] = useState([
    { id: 1, name: "Dr. Aliyu Musa", role: "Science Teacher", status: "Active" },
    { id: 2, name: "Ishaq Ibrahim", role: "Accountant", status: "Suspended" },
    { id: 3, name: "Fatima Adamu", role: "HOD Tourism", status: "Active" },
  ]);

  const [financialRequests, setFinancialRequests] = useState([
    { id: 101, title: "Staff Salary - January", amount: "₦8,200,000", requester: "Accountant", date: "Jan 04" },
    { id: 102, title: "Lab Chemical Purchase", amount: "₦350,000", requester: "HOD Science", date: "Jan 03" },
  ]);

  // AIKIN KIRKIRAR SABON USER
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

      alert(`An samar da asusun ${newUser.role.toUpperCase()} cikin nasara!`);
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

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row font-sans overflow-x-hidden relative text-left">
      
      {/* MOBILE MENU TOGGLE */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-6 right-6 z-[100] bg-red-600 text-white p-4 rounded-2xl shadow-2xl active:scale-90 transition-all"
      >
        {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
      </button>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 transition-transform duration-500 ease-in-out
        w-80 bg-[#001529] text-white p-8 flex flex-col z-[90] h-screen lg:sticky top-0
      `}>
        <div className="flex items-center gap-4 mb-14 px-2">
          <div className="p-3 bg-red-600 rounded-[20px] shadow-lg shadow-red-900/40 animate-pulse">
            <ShieldAlert size={30} />
          </div>
          <div>
            <h2 className="font-black text-2xl tracking-tighter italic text-white uppercase leading-none">Rector</h2>
            <p className="text-[9px] font-bold text-red-500 uppercase tracking-[0.3em] mt-2">Skyward Admin</p>
          </div>
        </div>

        <nav className="space-y-4 flex-1">
          <SidebarLink icon={<Activity size={18}/>} label="Global Oversight" active />
          <SidebarLink icon={<Users size={18}/>} label="Staff Directory" />
          <SidebarLink icon={<Landmark size={18}/>} label="Financial Vouchers" />
          <SidebarLink icon={<Newspaper size={18}/>} label="School News" />
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center justify-center gap-3 p-5 rounded-[24px] font-black text-[11px] uppercase text-red-500 border-2 border-red-500/10 hover:bg-red-600 hover:text-white transition-all w-full shadow-lg"
        >
          <LogOut size={18}/> End Session
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 border-b border-slate-200 pb-10">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-[#001529] uppercase tracking-tighter italic">Command Center</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-3 bg-slate-100 w-fit px-3 py-1 rounded-full">System Authority • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-4">
              <div className="bg-white h-16 w-16 rounded-2xl border border-slate-200 flex items-center justify-center text-[#001529] shadow-sm relative cursor-pointer hover:shadow-md transition-all">
                <Bell size={24}/>
                <span className="absolute top-5 right-5 h-2.5 w-2.5 bg-red-600 rounded-full border-2 border-white"></span>
              </div>
              <div className="h-16 w-16 bg-[#001529] rounded-2xl flex items-center justify-center text-white font-black text-xl border-4 border-white shadow-xl">RM</div>
          </div>
        </header>

        {/* RECTOR OVERSIGHT CARDS */}
        <section className="bg-white rounded-[45px] p-8 lg:p-10 shadow-sm border border-slate-100 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <h3 className="font-black text-[#001529] uppercase text-[11px] tracking-[0.2em] mb-10 flex items-center gap-3 relative z-10">
            <Eye className="text-red-600" size={20}/> Live Departmental Oversight
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <StatsMiniCard icon={<Landmark size={20}/>} label="Revenue Today" value="₦1.2M" trend="+4%" color="text-emerald-600" bg="bg-emerald-50" />
            <StatsMiniCard icon={<FileBarChart size={20}/>} label="Results Uploaded" value="85%" trend="Normal" color="text-purple-600" bg="bg-purple-50" />
            <StatsMiniCard icon={<UserPlus size={20}/>} label="New Admissions" value="42" trend="Daily" color="text-blue-600" bg="bg-blue-50" />
            <StatsMiniCard icon={<Newspaper size={20}/>} label="News Updates" value="03" trend="Active" color="text-orange-600" bg="bg-orange-50" />
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          
          <div className="xl:col-span-2 space-y-10">
            {/* 1. FINANCIAL APPROVALS */}
            <div className="bg-white rounded-[50px] p-8 lg:p-12 shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                  <h3 className="font-black text-[#001529] uppercase text-xs tracking-widest flex items-center gap-3">
                    <CreditCard className="text-red-600" size={20}/> Pending Fund Approvals
                  </h3>
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full animate-pulse">
                    <ShieldAlert size={14}/>
                    <span className="text-[9px] font-black uppercase tracking-tighter">Requires Authorization</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {financialRequests.length > 0 ? financialRequests.map((req) => (
                    <div key={req.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-[#f8fafc] rounded-[32px] border border-transparent hover:border-red-200 hover:bg-white hover:shadow-xl transition-all duration-300 gap-6">
                       <div className="flex items-center gap-5 w-full md:w-auto">
                          <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100"><Landmark size={24}/></div>
                          <div>
                             <h4 className="font-black text-[#001529] text-sm uppercase tracking-tight">{req.title}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 italic">{req.requester} • {req.date}</p>
                          </div>
                       </div>
                       <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                          <span className="text-2xl font-black text-[#001529] tracking-tighter">{req.amount}</span>
                          <div className="flex gap-3">
                             <button onClick={() => alert("Payment Rejected")} className="h-12 w-12 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center shadow-sm"><X size={20}/></button>
                             <button onClick={() => approvePayment(req.id)} className="h-12 w-12 bg-[#001529] text-white rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center shadow-lg active:scale-90"><CheckCircle2 size={20}/></button>
                          </div>
                       </div>
                    </div>
                  )) : (
                    <div className="text-center py-16 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                      <CheckCircle2 size={40} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-slate-400 font-black text-xs uppercase tracking-widest">System Clear: No Pending Requests</p>
                    </div>
                  )}
                </div>
            </div>

            {/* 2. ADD NEW USER SECTION */}
            <div className="bg-white rounded-[50px] p-8 lg:p-12 shadow-sm border border-slate-100">
                <h3 className="font-black text-[#001529] uppercase text-xs tracking-widest mb-10 flex items-center gap-3">
                  <UserPlus className="text-red-600" size={20}/> Provision System Official
                </h3>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput label="Full Name" placeholder="e.g. Dr. Usman Ali" value={newUser.fullName} onChange={(e) => setNewUser({...newUser, fullName: e.target.value})} />
                  <FormInput label="Email Address" type="email" placeholder="official@skyward.com" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                  <FormInput label="Access Password" type="password" placeholder="••••••••" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                  
                  <div className="flex flex-col gap-2 text-left">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Security Role</label>
                    <select 
                      className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-100 outline-none focus:ring-2 ring-red-600 font-black uppercase text-[11px] h-[58px]"
                      value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="staff">Lecturer/Staff</option>
                      <option value="accountant">Chief Accountant</option>
                      <option value="exam-officer">Exams Officer</option>
                      <option value="admission-officer">Admission Officer</option>
                      <option value="news-admin">News Admin</option>
                      <option value="admin">System Administrator</option>
                    </select>
                  </div>

                  <button 
                    type="submit" disabled={loading}
                    className="md:col-span-2 mt-4 bg-red-600 text-white py-5 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] hover:bg-[#001529] hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? "Establishing Link..." : <><ShieldCheck size={20}/> Issue Security Credentials</>}
                  </button>
                </form>
            </div>
          </div>

          <div className="space-y-10">
            {/* 3. STAFF CONTROL PANEL */}
            <div className="bg-white rounded-[45px] p-8 shadow-sm border border-slate-100">
                <h3 className="font-black text-[#001529] uppercase text-[11px] tracking-widest mb-8 border-b pb-4">Personnel Status</h3>
                <div className="space-y-5">
                  {staffList.map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-3xl border border-transparent hover:border-slate-200 transition-all">
                       <div className="flex items-center gap-4">
                         <div className={`h-3 w-3 rounded-full ${staff.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                         <div>
                            <p className="font-black text-[11px] uppercase text-[#001529] tracking-tighter">{staff.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{staff.role}</p>
                         </div>
                       </div>
                       <button onClick={() => toggleStaffStatus(staff.id)} className={`p-3 rounded-2xl transition-all ${staff.status === 'Active' ? 'text-red-500 bg-red-50 hover:bg-red-500 hover:text-white' : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-500 hover:text-white'}`}>
                         {staff.status === 'Active' ? <UserX size={18}/> : <UserCheck size={18}/>}
                       </button>
                    </div>
                  ))}
                </div>
            </div>

            {/* AUDIT LOG */}
            <div className="bg-[#001529] rounded-[50px] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <Activity size={120} />
               </div>
               <h3 className="font-black uppercase text-xs tracking-[0.2em] mb-10 flex items-center gap-3 relative z-10">
                 <History className="text-red-500" size={20}/> Audit Trail
               </h3>
               <div className="space-y-8 border-l-2 border-white/5 ml-2 pl-8 relative z-10">
                 {[
                   { time: "10:15 AM", log: "Accountant generated fee report", type: "Finance" },
                   { time: "09:40 AM", log: "Lecturer uploaded ND I Results", type: "Academic" },
                   { time: "08:00 AM", log: "New student admission portal opened", type: "Admission" },
                 ].map((log, i) => (
                   <div key={i} className="relative">
                      <div className="absolute -left-[41px] top-1 h-4 w-4 bg-red-600 rounded-full border-4 border-[#001529]"></div>
                      <p className="font-black text-red-500 text-[10px] uppercase mb-1">{log.time}</p>
                      <p className="font-bold text-slate-300 text-[11px] uppercase tracking-tight leading-relaxed">{log.log}</p>
                      <p className="text-[8px] font-black text-white/20 mt-2 uppercase">{log.type}</p>
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

// --- HELPER COMPONENTS ---

const SidebarLink = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-[11px] uppercase transition-all duration-300 text-left ${active ? "bg-red-600 text-white shadow-xl shadow-red-900/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
    {icon} {label}
  </button>
);

const StatsMiniCard = ({ icon, label, value, trend, color, bg }) => (
  <div className={`p-6 ${bg} rounded-[32px] border border-transparent hover:border-white hover:shadow-lg transition-all`}>
    <div className={`${color} mb-4`}>{icon}</div>
    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <h4 className={`text-2xl font-black ${color} tracking-tighter`}>{value}</h4>
      <span className="text-[8px] font-black uppercase opacity-50">{trend}</span>
    </div>
  </div>
);

const FormInput = ({ label, ...props }) => (
  <div className="flex flex-col gap-2 text-left">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">{label}</label>
    <input 
      {...props}
      className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-100 outline-none focus:ring-2 ring-red-600 font-bold text-xs transition-all h-[58px]"
    />
  </div>
);

export default RectorDashboard;