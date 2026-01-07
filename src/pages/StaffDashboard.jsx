import React, { useState } from "react";
import { 
  BookOpen, FileText, User, LogOut, Menu, X, Printer, Save, 
  Send, AlertCircle, CheckCircle2, Search, Book, Download, Upload, Clock, Loader2, Edit3
} from "lucide-react";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("results");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false); 

  const [studentResults, setStudentResults] = useState([
    { id: 1, name: "Musa Ibrahim", ca: 25, exam: 55, total: 80, grade: "A", remarks: "Excellent" },
    { id: 2, name: "Zainab Aliyu", ca: 20, exam: 45, total: 65, grade: "B", remarks: "Very Good" },
    { id: 3, name: "Fatima Yusuf", ca: 15, exam: 30, total: 45, grade: "D", remarks: "Fair" },
  ]);

  const getGrade = (total) => {
    if (total >= 70) return { g: "A", r: "Excellent" };
    if (total >= 60) return { g: "B", r: "Very Good" };
    if (total >= 50) return { g: "C", r: "Credit" };
    if (total >= 45) return { g: "D", r: "Pass" };
    return { g: "F", r: "Fail" };
  };

  const updateScore = (id, field, value) => {
    if (isLocked) return;
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
    setTimeout(() => {
      setIsLocked(true);
      setIsSubmitting(false);
      alert("An tura sakamakon zuwa ga Exams Officer!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans">
      
      {/* --- SIDEBAR --- */}
      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-[#002147] text-white p-8 z-50`}>
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg">S</div>
          <h2 className="font-black text-sm uppercase tracking-tighter">Staff Portal</h2>
        </div>

        <nav className="space-y-2">
          <button onClick={() => setActiveTab("results")} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === 'results' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <FileText size={20} /> Result Manager
          </button>
          <button onClick={() => setActiveTab("research")} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === 'research' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <Search size={20} /> E-Library
          </button>
          <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
            <User size={20} /> Account
          </button>
          
          <button className="w-full flex items-center gap-4 p-4 mt-20 rounded-2xl font-bold text-[11px] uppercase text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={20} /> Sign Out
          </button>
        </nav>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        {activeTab === "results" && (
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl font-black text-[#002147] tracking-tighter uppercase flex items-center gap-3">
                  <Edit3 className="text-red-600" size={32} /> Result Manager
                </h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Shigar da maki kuma ka tura wa Exam Officer</p>
              </div>

              <div className="flex gap-3">
                <button 
                  disabled={isLocked || isSubmitting}
                  onClick={handlePushToExamsOfficer}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.1em] shadow-xl transition-all active:scale-95 ${isLocked ? 'bg-green-100 text-green-600 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-[#002147]'}`}
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : isLocked ? <CheckCircle2 size={18}/> : <Send size={18}/>}
                  {isLocked ? "Sent to Exams Officer" : "Submit to Exams Officer"}
                </button>
              </div>
            </div>

            {/* Edit Mode Alert */}
            <div className={`p-4 rounded-xl flex items-center gap-4 border-l-4 ${isLocked ? 'bg-green-50 border-green-500' : 'bg-amber-50 border-amber-500'}`}>
              {isLocked ? <CheckCircle2 className="text-green-600" size={24}/> : <AlertCircle className="text-amber-600" size={24} />}
              <p className={`text-[11px] font-bold uppercase ${isLocked ? 'text-green-800' : 'text-amber-800'}`}>
                {isLocked ? "Sakamakon yana hannun Exams Officer. Ba za ka iya gyara ba." : "Kana cikin EDIT MODE. Tabbatar komai daidai ne kafin ka tura."}
              </p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="p-8">Dalibi</th>
                      <th className="p-8 text-center">CA (40)</th>
                      <th className="p-8 text-center">Exam (60)</th>
                      <th className="p-8 text-center">Total</th>
                      <th className="p-8 text-center">Grade</th>
                      <th className="p-8 text-center">Gyarawa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {studentResults.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-8">
                          <p className="font-black text-[#002147] text-sm uppercase">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">SKY/2026/00{s.id}</p>
                        </td>
                        <td className="p-8 text-center">
                          <input 
                            type="number" 
                            disabled={isLocked}
                            value={s.ca} 
                            onChange={(e) => updateScore(s.id, 'ca', e.target.value)} 
                            className={`w-20 p-3 rounded-xl text-sm font-black text-center outline-none transition-all ${isLocked ? 'bg-slate-100 text-slate-300' : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-red-600/20'}`} 
                          />
                        </td>
                        <td className="p-8 text-center">
                          <input 
                            type="number" 
                            disabled={isLocked}
                            value={s.exam} 
                            onChange={(e) => updateScore(s.id, 'exam', e.target.value)} 
                            className={`w-20 p-3 rounded-xl text-sm font-black text-center outline-none transition-all ${isLocked ? 'bg-slate-100 text-slate-300' : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-red-600/20'}`} 
                          />
                        </td>
                        <td className="p-8 text-center font-black text-[#002147] text-xl">{s.total}</td>
                        <td className="p-8 text-center">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black ${s.grade === 'A' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{s.grade}</span>
                        </td>
                        <td className="p-8 text-center">
                           {!isLocked ? <Edit3 size={18} className="text-slate-300 mx-auto" /> : <CheckCircle2 size={18} className="text-green-500 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab !== "results" && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
             <Clock size={48} className="text-slate-200 animate-pulse mb-4"/>
             <p className="text-slate-400 font-black uppercase text-xs tracking-widest text-center">Wannan sashen yana ƙasa da gyara...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;