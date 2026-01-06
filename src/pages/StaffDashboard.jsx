import React, { useState } from "react";
import { 
  BookOpen, Users, Calendar, FileText, ClipboardCheck, 
  Upload, MessageSquare, Clock, Video, Link as LinkIcon, 
  X, CheckCircle, User, Mail, Award, Briefcase, Camera,
  Printer, Save, Download, RefreshCcw, Menu, LogOut
} from "lucide-react";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("results"); // dashboard, profile, results
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Bayanan dalibai don saka maki
  const [studentResults, setStudentResults] = useState([
    { id: 1, name: "Musa Ibrahim", ca: 25, exam: 55, total: 80, grade: "A", remarks: "Excellent" },
    { id: 2, name: "Zainab Aliyu", ca: 20, exam: 45, total: 65, grade: "B", remarks: "Very Good" },
    { id: 3, name: "Fatima Yusuf", ca: 15, exam: 30, total: 45, grade: "D", remarks: "Fair" },
  ]);

  // Aikin lissafa Grade
  const getGrade = (total) => {
    if (total >= 70) return { g: "A", r: "Excellent" };
    if (total >= 60) return { g: "B", r: "Very Good" };
    if (total >= 50) return { g: "C", r: "Credit" };
    if (total >= 45) return { g: "D", r: "Pass" };
    return { g: "F", r: "Fail" };
  };

  const updateScore = (id, field, value) => {
    const newVal = parseInt(value) || 0;
    setStudentResults(studentResults.map(s => {
      if (s.id === id) {
        const updated = { ...s, [field]: newVal };
        updated.total = (field === 'ca' ? newVal : s.ca) + (field === 'exam' ? newVal : s.exam);
        const { g, r } = getGrade(updated.total);
        updated.grade = g;
        updated.remarks = r;
        return updated;
      }
      return s;
    }));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/portal/staff-login";
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans relative">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-[#002147] text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center font-black italic">S</div>
          <span className="font-black uppercase text-xs tracking-tighter">Staff Portal</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        w-72 bg-[#002147] text-white p-8 z-40 h-screen md:h-auto overflow-y-auto
      `}>
        <div className="hidden md:flex items-center gap-3 mb-12">
          <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg">S</div>
          <h2 className="font-black text-white uppercase tracking-tighter text-lg">Staff Portal</h2>
        </div>

        <nav className="space-y-4">
          <button onClick={() => {setActiveTab("dashboard"); setIsMobileMenuOpen(false)}} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-[10px] uppercase transition-all ${activeTab === 'dashboard' ? 'bg-white text-[#002147] shadow-xl' : 'text-slate-400 hover:bg-white/5'}`}><BookOpen size={18} /> Dashboard</button>
          <button onClick={() => {setActiveTab("results"); setIsMobileMenuOpen(false)}} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-[10px] uppercase transition-all ${activeTab === 'results' ? 'bg-white text-[#002147] shadow-xl' : 'text-slate-400 hover:bg-white/5'}`}><FileText size={18} /> Generate Results</button>
          <button onClick={() => {setActiveTab("profile"); setIsMobileMenuOpen(false)}} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-[10px] uppercase transition-all ${activeTab === 'profile' ? 'bg-white text-[#002147] shadow-xl' : 'text-slate-400 hover:bg-white/5'}`}><User size={18} /> My Profile</button>
          
          <div className="pt-10">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 rounded-2xl font-black text-[10px] uppercase text-red-400 border border-red-400/20 hover:bg-red-500 hover:text-white transition-all">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10">
        
        {activeTab === "results" ? (
          /* --- RESULT GENERATOR VIEW --- */
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div className="animate-in fade-in duration-700">
                <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Result Manager</h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Skyward College • Academic Year 2026</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none bg-white border border-slate-200 p-3 rounded-xl text-[#002147] hover:bg-slate-50 shadow-sm transition-all flex justify-center"><Printer size={18}/></button>
                <button className="flex-[2] md:flex-none bg-green-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 shadow-lg hover:bg-green-700 transition-all active:scale-95"><Save size={18}/> Publish All</button>
              </div>
            </div>

            {/* Input Table */}
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                      <th className="p-8">Student Name</th>
                      <th className="p-8">CA (40)</th>
                      <th className="p-8">Exam (60)</th>
                      <th className="p-8">Total (100)</th>
                      <th className="p-8">Grade</th>
                      <th className="p-8">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {studentResults.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-8">
                          <p className="font-black text-[#002147] text-xs uppercase">{s.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter italic">REG: SKY/2026/0{s.id}</p>
                        </td>
                        <td className="p-8">
                          <input 
                            type="number" 
                            max="40"
                            value={s.ca} 
                            onChange={(e) => updateScore(s.id, 'ca', e.target.value)}
                            className="w-16 p-2 bg-slate-100 rounded-lg text-xs font-black text-center focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                        </td>
                        <td className="p-8">
                          <input 
                            type="number" 
                            max="60"
                            value={s.exam} 
                            onChange={(e) => updateScore(s.id, 'exam', e.target.value)}
                            className="w-16 p-2 bg-slate-100 rounded-lg text-xs font-black text-center focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                        </td>
                        <td className="p-8 font-black text-sm text-[#002147]">{s.total}</td>
                        <td className="p-8">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${s.grade === 'A' ? 'bg-green-100 text-green-600' : s.grade === 'F' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {s.grade}
                          </span>
                        </td>
                        <td className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Summary View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
               <div className="bg-blue-50 p-6 rounded-[30px] border border-blue-100">
                  <p className="text-[10px] font-black text-blue-400 uppercase mb-2">Class Average</p>
                  <p className="text-2xl font-black text-blue-900">63.3%</p>
               </div>
               <div className="bg-green-50 p-6 rounded-[30px] border border-green-100">
                  <p className="text-[10px] font-black text-green-400 uppercase mb-2">Highest Score</p>
                  <p className="text-2xl font-black text-green-900">80%</p>
               </div>
               <div className="bg-red-50 p-6 rounded-[30px] border border-red-100">
                  <p className="text-[10px] font-black text-red-400 uppercase mb-2">Pending</p>
                  <p className="text-2xl font-black text-red-900">0</p>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40">
             <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Clock size={32} className="animate-pulse" />
             </div>
             <p className="text-slate-400 text-center uppercase font-black text-[10px] tracking-[0.2em]">Section Under Development</p>
             <button onClick={() => setActiveTab('results')} className="mt-4 text-blue-600 font-black text-[10px] uppercase underline">Return to Manager</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;