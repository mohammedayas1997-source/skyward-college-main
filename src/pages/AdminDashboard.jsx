import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Users, GraduationCap, Building2, 
  BarChart, PieChart, Bell, Settings, 
  UserPlus, FileText, Briefcase, Zap, Menu, X, Trash2, Phone, Mail, Printer, LogOut
} from "lucide-react";
// GYARA: Mun kara ../ domin fita daga folder 'pages' zuwa 'src' inda 'firebase' take
import { db } from "../firebase"; 
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";

const AdminDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const deleteApp = async (id) => {
    if(window.confirm("Kana da tabbas kana so ka goge wannan?")) {
      await deleteDoc(doc(db, "applications", id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const overviewStats = [
    { title: "Total Students", count: "1,250", icon: <Users className="text-blue-600" />, bg: "bg-blue-50", trend: "+12%" },
    { title: "Total Staff", count: "85", icon: <Briefcase className="text-purple-600" />, bg: "bg-purple-50", trend: "+2" },
    { title: "Financial Health", count: "82%", icon: <BarChart className="text-green-600" />, bg: "bg-green-50", trend: "Stable" },
    { title: "Admission Req.", count: applications.length, icon: <UserPlus className="text-orange-600" />, bg: "bg-orange-50", trend: "Live" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans overflow-x-hidden relative">
      
      {/* SIDEBAR */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#002147] text-white p-8 transform transition-transform duration-300 lg:relative lg:translate-x-0 no-print
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-600/30">
              <ShieldCheck size={24} />
            </div>
            <h2 className="font-black text-xl uppercase tracking-tighter">Skyward Admin</h2>
          </div>
          <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-6 flex-1">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</div>
          <button className="w-full flex items-center gap-3 bg-white/10 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl text-left transition-all">
            <Zap size={18} className="text-red-500"/> Overview
          </button>
          <button className="w-full flex items-center gap-3 hover:bg-white/5 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 transition-all hover:text-white text-left">
            <UserPlus size={18}/> Admissions
          </button>
          <button className="w-full flex items-center gap-3 hover:bg-white/5 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 transition-all hover:text-white text-left">
            <GraduationCap size={18}/> Courses
          </button>
          <button className="w-full flex items-center gap-3 hover:bg-white/5 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 transition-all hover:text-white text-left">
            <Settings size={18}/> Settings
          </button>
        </nav>

        <div className="mt-10 pt-10 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 rounded-2xl font-black text-[10px] uppercase text-red-400 border border-red-400/20 hover:bg-red-600 hover:text-white transition-all">
            <LogOut size={18} /> Exit System
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-4 md:p-10 lg:p-12 overflow-y-auto w-full print:p-0 bg-white md:bg-[#f8fafc]">
        
        {/* Mobile Header Toggle */}
        <header className="flex justify-between items-center mb-10 no-print">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-3 bg-white rounded-xl shadow-md border border-slate-100" onClick={() => setSidebarOpen(true)}>
                <Menu size={20} className="text-[#002147]"/>
            </button>
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-[#002147] uppercase tracking-tighter leading-none">Management</h1>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mt-2 italic">Skyward ERP • 2026 Control</p>
            </div>
          </div>
          <div className="no-print">
            <div className="h-12 w-12 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-400 relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 h-2 w-2 bg-red-600 rounded-full animate-pulse"></span>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 no-print">
          {overviewStats.map((stat, i) => (
            <div key={i} className="bg-white p-7 rounded-[35px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`h-14 w-14 ${stat.bg} rounded-[20px] flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                    {stat.icon}
                </div>
                <span className="text-[9px] font-black bg-green-100 text-green-700 px-2 py-1 rounded-lg uppercase">{stat.trend}</span>
              </div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">{stat.title}</h4>
              <p className="text-4xl font-black text-[#002147] tracking-tighter">{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Applications Table Section */}
        <div className="bg-white rounded-[45px] p-8 border border-slate-100 shadow-sm mb-10 print:border-none print:shadow-none">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 px-2 gap-4">
            <h3 className="font-black text-[#002147] uppercase text-xs tracking-widest flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg no-print"><UserPlus className="text-orange-600" size={18}/></div> 
              Recent Admission Applications
            </h3>
            
            <div className="flex items-center gap-3 no-print w-full sm:w-auto">
              <button 
                onClick={handlePrint}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#002147] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-red-600 transition-all shadow-lg active:scale-95"
              >
                <Printer size={16} /> Print Report
              </button>
              <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-3 py-3 rounded-xl uppercase">
                {applications.length} Students
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Cloud Data...</p>
              </div>
            ) : (
              <table className="w-full text-left border-separate border-spacing-y-3 print:border-collapse print:border-spacing-0">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-black">
                    <th className="pb-4 pl-6 print:border-b print:pb-2">Full Name</th>
                    <th className="pb-4 print:border-b print:pb-2">Course Applied</th>
                    <th className="pb-4 print:border-b print:pb-2">Contact Info</th>
                    <th className="pb-4 print:border-b print:pb-2">Status</th>
                    <th className="pb-4 pr-6 no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {applications.map((app) => (
                    <tr key={app.id} className="bg-slate-50/50 hover:bg-slate-100/50 transition-colors group print:bg-white">
                      <td className="py-5 pl-6 rounded-l-[25px] font-black text-[#002147] uppercase text-xs tracking-tighter print:border-b print:rounded-none">
                        {app.fullName}
                      </td>
                      <td className="py-5 font-bold text-slate-500 italic text-[11px] print:border-b print:text-black">
                        {app.course}
                      </td>
                      <td className="py-5 print:border-b">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-slate-600 flex items-center gap-1.5 print:text-black"><Phone size={10}/> {app.phone}</span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 print:text-black"><Mail size={10}/> {app.email}</span>
                        </div>
                      </td>
                      <td className="py-5 print:border-b">
                        <span className="bg-orange-100 text-orange-600 text-[8px] font-black px-3 py-1 rounded-full uppercase print:border print:border-black print:text-black">
                          Pending
                        </span>
                      </td>
                      <td className="py-5 pr-6 rounded-r-[25px] no-print">
                        <button 
                          onClick={() => deleteApp(app.id)}
                          className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-20 text-center text-slate-400 font-black uppercase text-[10px]">No Applications Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Styles for Printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print { display: none !important; }
          body { background-color: white !important; }
          .print\\:border-b { border-bottom: 1px solid #e2e8f0 !important; }
          .print\\:text-black { color: black !important; }
          @page { margin: 1cm; }
          .bg-white { background-color: white !important; }
          * { -webkit-print-color-adjust: exact; }
        }
      `}} />
    </div>
  );
};

export default AdminDashboard;