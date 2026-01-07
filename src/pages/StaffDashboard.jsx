import React, { useState } from "react";
import { 
  BookOpen, FileText, User, LogOut, Menu, X, Printer, Save, 
  Send, AlertCircle, CheckCircle2, Search, Book, Download, Upload, Clock, Loader2
} from "lucide-react";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("results");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // Lokacin da aka tura wa Exams Officer

  const [studentResults, setStudentResults] = useState([
    { id: 1, name: "Musa Ibrahim", ca: 25, exam: 55, total: 80, grade: "A", remarks: "Excellent", status: "Draft" },
    { id: 2, name: "Zainab Aliyu", ca: 20, exam: 45, total: 65, grade: "B", remarks: "Very Good", status: "Draft" },
    { id: 3, name: "Fatima Yusuf", ca: 15, exam: 30, total: 45, grade: "D", remarks: "Fair", status: "Draft" },
  ]);

  const getGrade = (total) => {
    if (total >= 70) return { g: "A", r: "Excellent" };
    if (total >= 60) return { g: "B", r: "Very Good" };
    if (total >= 50) return { g: "C", r: "Credit" };
    if (total >= 45) return { g: "D", r: "Pass" };
    return { g: "F", r: "Fail" };
  };

  const updateScore = (id, field, value) => {
    if (isLocked) return; // Ba za a iya edit ba idan an tura
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

  const handlePushToExamsOfficer = () => {
    setIsSubmitting(true);
    // Simulate API Call
    setTimeout(() => {
      setIsLocked(true);
      setIsSubmitting(false);
      alert("Results successfully pushed to Exams Officer Dashboard.");
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/portal/login";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
      
      {/* Sidebar - Same styling as Login for Global Standard */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-[#002147] text-white p-8 z-50`}>
        <div className="flex items-center gap-3 mb-12">
          <img src="/logo.png" className="h-10 w-10 brightness-200" alt="Logo" />
          <h2 className="font-black text-sm uppercase tracking-tighter">Staff Portal</h2>
        </div>

        <nav className="space-y-2">
          {[
            { id: "dashboard", icon: <BookOpen size={18}/>, label: "Overview" },
            { id: "results", icon: <FileText size={18}/>, label: "Result Manager" },
            { id: "research", icon: <Search size={18}/>, label: "E-Library" },
            { id: "profile", icon: <User size={18}/>, label: "Account" }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
          
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 mt-20 rounded-2xl font-bold text-[11px] uppercase text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={18} /> Sign Out
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        {activeTab === "results" && (
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl font-black text-[#002147] tracking-tighter uppercase">Result Center</h1>
                <div className="flex items-center gap-2 mt-2">
                   <span className="px-3 py-1 bg-blue-100 text-[#002147] text-[9px] font-black rounded-full uppercase tracking-widest">Semester 1</span>
                   <span className="px-3 py-1 bg-slate-200 text-slate-600 text-[9px] font-black rounded-full uppercase tracking-widest italic">Locked: {isLocked ? "YES" : "NO"}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all"><Printer size={20} className="text-[#002147]"/></button>
                <button 
                  disabled={isLocked || isSubmitting}
                  onClick={handlePushToExamsOfficer}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.1em] shadow-xl transition-all active:scale-95 ${isLocked ? 'bg-green-100 text-green-600 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-[#002147]'}`}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : isLocked ? <CheckCircle2 size={18}/> : <Send size={18}/>}
                  {isLocked ? "Pushed to Exams" : "Submit to Exams Officer"}
                </button>
              </div>
            </div>

            {/* Notification Alert */}
            {!isLocked && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-center gap-4">
                <AlertCircle className="text-amber-600" size={24} />
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-tight">
                  Attention: Results are in <span className="underline italic">Edit Mode</span>. Ensure all scores are correct before pushing to the Exams Officer.
                </p>
              </div>
            )}

            {/* Table Container */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,33,71,0.05)] border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                      <th className="p-8">Student Identity</th>
                      <th className="p-8">C.A (40)</th>
                      <th className="p-8">Exam (60)</th>
                      <th className="p-8 text-center">Score</th>
                      <th className="p-8 text-center">Grade</th>
                      <th className="p-8">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {studentResults.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-8">
                          <p className="font-black text-[#002147] text-sm uppercase">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">SKY/2026/00{s.id}</p>
                        </td>
                        <td className="p-8">
                          <input 
                            type="number" 
                            disabled={isLocked}
                            value={s.ca} 
                            onChange={(e) => updateScore(s.id, 'ca', e.target.value)} 
                            className={`w-16 p-3 rounded-xl text-sm font-black text-center outline-none transition-all ${isLocked ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 focus:ring-2 focus:ring-red-600/20'}`} 
                          />
                        </td>
                        <td className="p-8">
                          <input 
                            type="number" 
                            disabled={isLocked}
                            value={s.exam} 
                            onChange={(e) => updateScore(s.id, 'exam', e.target.value)} 
                            className={`w-16 p-3 rounded-xl text-sm font-black text-center outline-none transition-all ${isLocked ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 focus:ring-2 focus:ring-red-600/20'}`} 
                          />
                        </td>
                        <td className="p-8 text-center font-black text-[#002147] text-lg">{s.total}</td>
                        <td className="p-8 text-center">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black ${s.grade === 'A' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{s.grade}</span>
                        </td>
                        <td className="p-8">
                           <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isLocked ? "Finalized" : "Drafting"}</span>
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

        {/* Other tabs remain same logic */}
        {activeTab === "research" && (
          <div className="max-w-6xl mx-auto py-10 text-center">
            <h2 className="text-2xl font-black text-[#002147] uppercase tracking-tighter">Academic Library</h2>
            <p className="text-slate-400 text-xs font-bold mt-2">Section is currently syncing with world journals...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;