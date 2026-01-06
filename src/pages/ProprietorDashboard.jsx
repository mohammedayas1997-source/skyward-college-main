import React, { useState } from "react";
import { db, auth } from "../firebase"; 
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Don fita zuwa login
import { 
  Crown, Users, TrendingUp, Landmark, ShieldCheck, 
  Eye, AlertCircle, ArrowDownCircle, ArrowUpCircle, 
  Briefcase, MessageSquare, Settings, Activity, Menu, X,
  FileBarChart, ChevronRight, ZapOff, CheckCircle2, UserPlus, ShieldAlert, LogOut
} from "lucide-react";

const ProprietorDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showVetoModal, setShowVetoModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "staff"
  });

  const [rectorActions, setRectorActions] = useState([
    { id: 1, action: "Approved Staff Salaries", target: "January Payroll", date: "10:30 AM", impact: "High", status: "Active" },
    { id: 2, action: "Suspended Staff", target: "Ishaq Ibrahim (Accountant)", date: "09:15 AM", impact: "Critical", status: "Active" },
    { id: 3, action: "Approved Lab Equipment Fund", target: "₦350,000", date: "Yesterday", impact: "Medium", status: "Active" },
  ]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("userRole");
    navigate("/portal/login");
  };

  const handleCreateOfficial = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      const uid = userCredential.user.uid;

      // Save user profile in Firestore
      await setDoc(doc(db, "users", uid), {
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        status: "Active",
        createdAt: serverTimestamp(),
        createdBy: "Proprietor"
      });

      alert(`Success: ${newUser.role.toUpperCase()} account created!`);
      setNewUser({ fullName: "", email: "", password: "", role: "staff" });
    } catch (error) {
      alert("Registration Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVeto = (id) => {
    setRectorActions(rectorActions.map(act => 
      act.id === id ? { ...act, status: "Overruled", impact: "Neutral" } : act
    ));
    setShowVetoModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 flex flex-col lg:flex-row font-sans overflow-x-hidden relative">
      
      {/* MOBILE MENU TOGGLE */}
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-[120] bg-amber-500 p-3 rounded-xl text-[#0f172a]"
      >
        {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
      </button>

      {/* VETO POWER MODAL */}
      {showVetoModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#1e293b] w-full max-w-md rounded-[32px] p-8 border border-red-500/30 shadow-2xl">
            <div className="h-16 w-16 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mb-6 mx-auto">
              <ZapOff size={32} />
            </div>
            <h3 className="text-xl font-black text-white text-center uppercase tracking-tighter italic">Invoke Veto Power?</h3>
            <p className="text-slate-400 text-sm text-center mt-4">Soke matakin: <br/> <span className="text-white font-bold italic">"{selectedAction?.action}"</span></p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button onClick={() => setShowVetoModal(false)} className="py-4 rounded-2xl bg-slate-700 text-white font-black uppercase text-[10px] tracking-widest hover:bg-slate-600">Cancel</button>
              <button onClick={() => handleVeto(selectedAction.id)} className="py-4 rounded-2xl bg-red-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-700 shadow-lg shadow-red-600/20">Overrule</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 w-80 bg-[#1e293b] p-8 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out z-[110]`}>
        <div className="flex items-center gap-4 mb-16 px-2 text-left">
          <div className="h-12 w-12 bg-amber-500 rounded-2xl flex items-center justify-center text-[#0f172a] shadow-lg shrink-0">
            <Crown size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">Proprietor</h2>
            <p className="text-[8px] font-bold text-amber-500 uppercase tracking-[0.3em] mt-1">Command Center</p>
          </div>
        </div>
        
        <nav className="space-y-4 flex-1">
          <NavItem icon={<TrendingUp size={18}/>} label="Master Overview" active />
          <NavItem icon={<Landmark size={18}/>} label="Financial Vault" />
          <NavItem icon={<ShieldCheck size={18}/>} label="Rector's Audit" />
          <NavItem icon={<Users size={18}/>} label="Staff Directory" />
          <NavItem icon={<Settings size={18}/>} label="System Control" />
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-800">
           <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 font-black text-[10px] uppercase tracking-widest transition-all">
              <LogOut size={18}/> Sign Out Office
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto pt-10">
        
        <header className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6 border-b border-slate-800 pb-8 text-left">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none italic">Proprietor Suite</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-4">Integrity & Oversight Dashboard</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center gap-4 shadow-xl">
            <div className="text-right">
              <p className="text-[10px] font-black text-white uppercase leading-none italic">Alhaji Abubakar</p>
              <p className="text-[8px] font-bold text-amber-500 uppercase mt-1">The Founder</p>
            </div>
            <div className="h-10 w-10 bg-amber-500 rounded-xl flex items-center justify-center font-black text-[#0f172a]">AA</div>
          </div>
        </header>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard title="Total Revenue" value="₦148.5M" color="from-emerald-600 to-emerald-900" icon={<ArrowDownCircle size={100}/>} />
          <StatsCard title="Total Expenses" value="₦52.8M" color="from-red-600 to-red-900" icon={<ArrowUpCircle size={100}/>} />
          <div className="bg-white p-8 rounded-[40px] shadow-2xl flex flex-col justify-center text-left relative overflow-hidden">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Net Balance</p>
              <h4 className="text-3xl md:text-4xl font-black text-[#0f172a] italic tracking-tighter">₦95.7M</h4>
              <div className="h-1.5 w-full bg-slate-100 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-emerald-500 w-[65%] rounded-full"></div>
              </div>
              <Activity className="absolute -right-4 -bottom-4 text-slate-100" size={100} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {/* SECTION: RECTOR'S ACTIVITY */}
          <section className="bg-[#1e293b] rounded-[45px] p-10 border border-slate-800 text-left shadow-2xl">
             <h3 className="font-black text-white uppercase text-xs tracking-widest mb-10 flex items-center gap-3">
                <Activity className="text-amber-500" size={20}/> Rector's Executive Audit
             </h3>
             <div className="space-y-4">
                {rectorActions.map((act) => (
                  <div key={act.id} className={`p-6 rounded-[30px] border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${act.status === 'Overruled' ? 'bg-red-500/5 border-red-500/10 opacity-60' : 'bg-slate-800 border-slate-700 hover:border-amber-500/30'}`}>
                    <div className="flex items-center gap-4 w-full">
                       <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${act.status === 'Overruled' ? 'bg-red-500 text-white' : 'bg-slate-900 text-amber-500'}`}>
                          {act.status === 'Overruled' ? <ZapOff size={18}/> : <CheckCircle2 size={18}/>}
                       </div>
                       <div>
                          <h4 className={`font-black text-[11px] uppercase tracking-tighter ${act.status === 'Overruled' ? 'text-red-400 line-through' : 'text-white'}`}>{act.action}</h4>
                          <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 italic">{act.target} • {act.date}</p>
                       </div>
                    </div>
                    {act.status !== 'Overruled' && (
                      <button 
                        onClick={() => {setSelectedAction(act); setShowVetoModal(true);}}
                        className="text-[8px] font-black text-red-500 border border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest"
                      >
                        Veto
                      </button>
                    )}
                  </div>
                ))}
             </div>
          </section>

          {/* SECTION: CREATE NEW STAFF / OFFICIALS */}
          <section className="bg-white rounded-[45px] p-10 shadow-2xl text-left border border-slate-100">
             <h3 className="font-black text-[#0f172a] uppercase text-xs tracking-widest mb-10 flex items-center gap-3">
                <UserPlus className="text-amber-600" size={20}/> Provision Credentials
             </h3>
             <form onSubmit={handleCreateOfficial} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="Full Name" required
                    className="p-4 bg-slate-100 rounded-2xl text-xs font-bold text-[#0f172a] outline-none focus:ring-2 ring-amber-500 transition-all"
                    value={newUser.fullName} onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                  />
                  <input 
                    type="email" placeholder="Email Address" required
                    className="p-4 bg-slate-100 rounded-2xl text-xs font-bold text-[#0f172a] outline-none focus:ring-2 ring-amber-500 transition-all"
                    value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <input 
                  type="password" placeholder="Temporary Password" required
                  className="w-full p-4 bg-slate-100 rounded-2xl text-xs font-bold text-[#0f172a] outline-none focus:ring-2 ring-amber-500 transition-all"
                  value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
                <select 
                  className="w-full p-4 bg-slate-100 rounded-2xl font-black uppercase text-[10px] tracking-widest outline-none focus:ring-2 ring-amber-500"
                  value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="rector">Rector</option>
                  <option value="accountant">Accountant</option>
                  <option value="exam-officer">Exams Officer</option>
                  <option value="staff">Staff / Lecturer</option>
                </select>
                <button 
                  type="submit" disabled={loading}
                  className="w-full py-5 bg-[#0f172a] text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
                >
                  {loading ? "Authorizing..." : <><ShieldAlert size={16}/> Issue Command Credentials</>}
                </button>
             </form>
          </section>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-[10px] uppercase transition-all ${active ? "bg-white/10 text-white border border-white/5 shadow-xl" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"}`}>
    <span className={active ? "text-amber-500" : ""}>{icon}</span>
    {label}
  </button>
);

const StatsCard = ({ title, value, color, icon }) => (
  <div className={`bg-gradient-to-br ${color} p-8 rounded-[40px] shadow-2xl relative overflow-hidden group text-left transition-transform hover:-translate-y-1`}>
    <div className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <p className="text-[10px] font-black uppercase text-white/60 mb-2 tracking-widest">{title}</p>
    <h4 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter leading-none">{value}</h4>
  </div>
);

export default ProprietorDashboard;