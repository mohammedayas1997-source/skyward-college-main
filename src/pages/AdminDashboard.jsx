import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Users, GraduationCap, Building2, 
  BarChart, PieChart, Bell, Settings, 
  UserPlus, FileText, Briefcase, Zap, Menu, X, Trash2, Phone, Mail, Printer, LogOut, CheckCircle
} from "lucide-react";
import { db } from "../firebase"; 
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";

const AdminDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // LISTEN TO FIREBASE DATA
  useEffect(() => {
    const q = query(collection(db, "applications"), orderBy("appliedAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(appList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // DELETE APPLICATION
  const deleteApp = async (id) => {
    if(window.confirm("Kana da tabbas kana so ka goge wannan bayanan?")) {
      try {
        await deleteDoc(doc(db, "applications", id));
      } catch (err) {
        alert("An samu matsala wurin gogewa");
      }
    }
  };

  // APPROVE APPLICATION (Simulated)
  const approveApp = async (id) => {
    if(window.confirm("Shin kana so ka amince da wannan admission din?")) {
        const appRef = doc(db, "applications", id);
        await updateDoc(appRef, { status: "Approved" });
        alert("An amince da Admission din!");
    }
  };

  const handlePrint = () => window.print();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const overviewStats = [
    { title: "Total Students", count: "1,250", icon: <Users className="text-blue-600" size={20}/>, bg: "bg-blue-50", trend: "+12%" },
    { title: "Total Staff", count: "85", icon: <Briefcase className="text-purple-600" size={20}/>, bg: "bg-purple-50", trend: "+2" },
    { title: "Revenue Index", count: "82%", icon: <BarChart className="text-green-600" size={20}/>, bg: "bg-green-50", trend: "Stable" },
    { title: "New Applicants", count: applications.length, icon: <UserPlus className="text-orange-600" size={20}/>, bg: "bg-orange-50", trend: "Live" },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex font-sans overflow-x-hidden relative text-left">
      
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#001529] text-white p-8 transform transition-transform duration-300 lg:relative lg:translate-x-0 no-print
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600 rounded-2xl shadow-lg shadow-red-600/30">
              <ShieldCheck size={24} />
            </div>
            <div>
                <h2 className="font-black text-lg uppercase tracking-tighter leading-none">Skyward</h2>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Admin Portal</p>
            </div>
          </div>
          <button className="lg:hidden text-white/50" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2">
          <SidebarLink icon={<Zap size={18}/>} label="Overview" active />
          <SidebarLink icon={<UserPlus size={18}/>} label="Admissions" />
          <SidebarLink icon={<GraduationCap size={18}/>} label="Academic Staff" />
          <SidebarLink icon={<Building2 size={18}/>} label="Departments" />
          <SidebarLink icon={<Settings size={18}/>} label="System Settings" />
        </nav>

        <div className="absolute bottom-8 left-8 right-8">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl font-black text-[10px] uppercase text-red-400 bg-red-400/5 border border-red-400/20 hover:bg-red-600 hover:text-white transition-all">
            <LogOut size={18} /> Exit System
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto w-full print:p-0">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10 no-print">
          <div>
            <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Control Center</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Institution Resource Planning • 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right mr-2">
                <p className="text-[10px] font-black text-[#002147] uppercase">Super Admin</p>
                <p className="text-[9px] font-bold text-green-600 uppercase">System Online</p>
            </div>
            <div className="h-12 w-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm relative cursor-pointer hover:bg-slate-50 transition-colors">
              <Bell size={20} />
              <span className="absolute top-3 right-3 h-2 w-2 bg-red-600 rounded-full"></span>
            </div>
            <button className="lg:hidden p-3 bg-white rounded-xl shadow-sm border border-slate-200" onClick={() => setSidebarOpen(true)}>
                <Menu size={20} className="text-[#002147]"/>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 no-print">
          {overviewStats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[40px] border border-white shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className={`h-12 w-12 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:bg-opacity-80 transition-all`}>
                    {stat.icon}
                </div>
                <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl uppercase">{stat.trend}</span>
              </div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">{stat.title}</h4>
              <p className="text-4xl font-black text-[#002147] tracking-tight">{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Applications Table Section */}
        <div className="bg-white rounded-[50px] p-10 border border-white shadow-2xl shadow-slate-200/60 mb-10 print:shadow-none print:p-0">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                <UserPlus size={24}/>
              </div>
              <div>
                <h3 className="font-black text-[#002147] uppercase text-sm tracking-tighter">Registration Pipeline</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Real-time Cloud Sync Active</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 no-print w-full lg:w-auto">
              <button 
                onClick={handlePrint}
                className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-[#002147] text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-red-600 transition-all shadow-xl active:scale-95"
              >
                <Printer size={18} /> Export List
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-24 text-center">
                <div className="animate-spin h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Connecting to Secure Database...</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-6 pl-4">Applicant Profile</th>
                    <th className="pb-6">Academic Course</th>
                    <th className="pb-6">Contact Channels</th>
                    <th className="pb-6">Status</th>
                    <th className="pb-6 text-right pr-4 no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="py-6 pl-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#002147] font-black text-xs uppercase">
                                {app.fullName?.charAt(0)}
                            </div>
                            <span className="font-black text-[#002147] uppercase text-xs">{app.fullName}</span>
                        </div>
                      </td>
                      <td className="py-6">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{app.course}</span>
                      </td>
                      <td className="py-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-600 flex items-center gap-2 mb-1"><Phone size={12} className="text-blue-500"/> {app.phone}</span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-2"><Mail size={12} className="text-slate-300"/> {app.email}</span>
                        </div>
                      </td>
                      <td className="py-6">
                        <span className={`text-[8px] font-black px-4 py-1.5 rounded-full uppercase ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                          {app.status || 'Reviewing'}
                        </span>
                      </td>
                      <td className="py-6 text-right pr-4 no-print">
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={() => approveApp(app.id)} className="p-2.5 text-slate-300 hover:text-green-600 transition-colors bg-white border border-slate-100 rounded-xl hover:shadow-md">
                                <CheckCircle size={18} />
                            </button>
                            <button onClick={() => deleteApp(app.id)} className="p-2.5 text-slate-300 hover:text-red-600 transition-colors bg-white border border-slate-100 rounded-xl hover:shadow-md">
                                <Trash2 size={18} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print { display: none !important; }
          aside { display: none !important; }
          body { background-color: white !important; }
          .bg-white { background-color: white !important; border: none !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border-bottom: 1px solid #eee !important; padding: 12px !important; }
          * { -webkit-print-color-adjust: exact; }
        }
      `}} />
    </div>
  );
};

// HELPER COMPONENT FOR SIDEBAR
const SidebarLink = ({ icon, label, active = false }) => (
    <button className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all text-left ${active ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
        {icon} {label}
    </button>
);

export default AdminDashboard;