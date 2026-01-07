import React, { useState } from "react";
import { 
  LayoutDashboard, FileEdit, History, Search, User, LogOut, 
  Printer, Send, AlertCircle, CheckCircle2, Clock, Loader2, 
  TrendingUp, Users, BookOpen, ChevronRight
} from "lucide-react";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Sample Data
  const [studentResults, setStudentResults] = useState([
    { id: 1, name: "Musa Ibrahim", reg: "SKY/2026/001", ca: 25, exam: 55, total: 80, grade: "A" },
    { id: 2, name: "Zainab Aliyu", reg: "SKY/2026/002", ca: 20, exam: 45, total: 65, grade: "B" },
    { id: 3, name: "Fatima Yusuf", reg: "SKY/2026/003", ca: 15, exam: 30, total: 45, grade: "D" },
  ]);

  const updateScore = (id, field, value) => {
    if (isLocked) return;
    const newVal = parseInt(value) || 0;
    setStudentResults(studentResults.map(s => {
      if (s.id === id) {
        const updated = { ...s, [field]: newVal };
        updated.total = (field === 'ca' ? newVal : s.ca) + (field === 'exam' ? newVal : s.exam);
        updated.grade = updated.total >= 70 ? "A" : updated.total >= 60 ? "B" : "C";
        return updated;
      }
      return s;
    }));
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === id ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-left">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-72 bg-[#002147] text-white p-8 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg">S</div>
          <div>
            <h2 className="font-black text-sm uppercase tracking-tighter leading-none">Skyward</h2>
            <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-1">Staff Portal</p>
          </div>
        </div>

        <nav className="space-y-2 flex-grow">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="entry" icon={FileEdit} label="Score Entry" />
          <NavItem id="edit" icon={Search} label="Review & Edit" />
          <NavItem id="history" icon={History} label="Result History" />
        </nav>

        <button className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-[11px] uppercase text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20">
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        {/* DASHBOARD HOME */}
        {activeTab === "dashboard" && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
              <h1 className="text-4xl font-black text-[#002147] tracking-tighter uppercase">Welcome, Lecturer</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Academic Session: 2025/2026</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={Users} label="Assigned Students" value="142" color="blue" />
              <StatCard icon={BookOpen} label="Total Courses" value="04" color="red" />
              <StatCard icon={TrendingUp} label="Average Performance" value="68%" color="green" />
            </div>

            <section className="bg-white p-8 rounded-[30px] shadow-sm border border-slate-100">
              <h3 className="font-black text-[#002147] uppercase text-xs tracking-widest mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <ActivityRow label="GST 101 - Result Uploaded" time="2 hours ago" status="Success" />
                <ActivityRow label="MTH 201 - Sheet Generated" time="5 hours ago" status="Pending" />
              </div>
            </section>
          </div>
        )}

        {/* SCORE ENTRY SECTION */}
        {activeTab === "entry" && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">New Score Entry</h1>
                <p className="text-slate-400 text-[10px] font-black uppercase mt-1">Course: GST 101 (Use of English)</p>
              </div>
              <button 
                onClick={() => setIsLocked(true)}
                className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-red-900/20 hover:bg-[#002147] transition-all"
              >
                <Send size={16} /> Submit to Exams Office
              </button>
            </div>

            <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-8">Student Detail</th>
                    <th className="p-8 text-center">Continuous Assessment (40)</th>
                    <th className="p-8 text-center">Examination (60)</th>
                    <th className="p-8 text-center">Total Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {studentResults.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-8">
                        <p className="font-black text-[#002147] text-sm uppercase">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{s.reg}</p>
                      </td>
                      <td className="p-8 text-center">
                        <input 
                          type="number" 
                          value={s.ca} 
                          onChange={(e) => updateScore(s.id, 'ca', e.target.value)}
                          className="w-24 p-4 bg-slate-50 rounded-2xl text-center font-black border border-transparent focus:border-red-600/20 outline-none transition-all"
                        />
                      </td>
                      <td className="p-8 text-center">
                        <input 
                          type="number" 
                          value={s.exam} 
                          onChange={(e) => updateScore(s.id, 'exam', e.target.value)}
                          className="w-24 p-4 bg-slate-50 rounded-2xl text-center font-black border border-transparent focus:border-red-600/20 outline-none transition-all"
                        />
                      </td>
                      <td className="p-8 text-center font-black text-[#002147] text-xl">{s.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HISTORY SECTION (Placeholders) */}
        {(activeTab === "history" || activeTab === "edit") && (
           <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="h-20 w-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-4">
                <Clock size={40} />
              </div>
              <h2 className="text-[#002147] font-black uppercase text-sm tracking-widest">{activeTab} Section</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase mt-2">Fetching records from secure database...</p>
           </div>
        )}
      </main>
    </div>
  );
};

// Sub-components for better organization
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-8 rounded-[35px] border border-slate-100 flex items-center gap-6 group hover:shadow-xl transition-all">
    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</p>
      <h3 className="text-3xl font-black text-[#002147]">{value}</h3>
    </div>
  </div>
);

const ActivityRow = ({ label, time, status }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
    <div className="flex items-center gap-4">
      <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
      <div>
        <p className="text-[11px] font-black text-[#002147] uppercase">{label}</p>
        <p className="text-[9px] text-slate-400 font-bold">{time}</p>
      </div>
    </div>
    <ChevronRight size={16} className="text-slate-300" />
  </div>
);

export default StaffDashboard;