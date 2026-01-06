import React, { useState } from "react";
import { Search, FileText, ClipboardList, Download, Printer } from "lucide-react";

const CheckResult = () => {
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckResult = (e) => {
    e.preventDefault();
    setLoading(true);
    // Yi kamar ana binciko result na 1.5 seconds
    setTimeout(() => {
      setLoading(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Search Card */}
        <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden mb-10">
          <div className="bg-[#002147] py-4 px-8 border-b-4 border-red-600 flex justify-between items-center">
            <h2 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <ClipboardList size={16} className="text-red-600" /> Result Checker Portal
            </h2>
            <span className="text-white/40 text-[9px] font-bold uppercase tracking-tighter italic font-serif">Skyward Aviation Management System</span>
          </div>
          
          <form className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end" onSubmit={handleCheckResult}>
            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-[#002147] uppercase mb-2">Matriculation Number</label>
              <input 
                type="text" 
                placeholder="SKY/AV/24/001"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002147] focus:outline-none text-sm font-bold uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-[#002147] uppercase mb-2">Session</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#002147] focus:outline-none text-sm font-bold">
                <option>2025/2026</option>
                <option>2024/2025</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#002147] hover:bg-red-600 text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-400"
              disabled={loading}
            >
              {loading ? "Searching..." : <><Search size={18} /> Get Result</>}
            </button>
          </form>
        </div>

        {/* DISPLAY RESULT SECTION */}
        {showResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-200">
                <div className="p-8 bg-slate-50 flex justify-between items-center border-b">
                   <div>
                      <h3 className="text-2xl font-black text-[#002147] uppercase tracking-tighter">Semester Performance Report</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Student: Abubakar Ibrahim • SKY/AV/2026/0421</p>
                   </div>
                   <div className="flex gap-2">
                      <button className="p-3 bg-white border rounded-xl hover:bg-slate-100 text-slate-600 transition-all shadow-sm"><Printer size={18}/></button>
                      <button className="p-3 bg-[#002147] text-white rounded-xl hover:bg-red-600 transition-all shadow-lg"><Download size={18}/></button>
                   </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-slate-100">
                            <tr className="text-[10px] font-black text-[#002147] uppercase">
                                <th className="p-6 text-left">Course Code</th>
                                <th className="p-6 text-left">Course Title</th>
                                <th className="p-6 text-center">Unit</th>
                                <th className="p-6 text-center">Grade</th>
                                <th className="p-6 text-center">Point</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <tr className="hover:bg-slate-50/50">
                                <td className="p-6 font-bold text-xs uppercase">AMT 101</td>
                                <td className="p-6 font-black text-xs uppercase text-[#002147]">Intro to Aviation Management</td>
                                <td className="p-6 text-center font-bold">3</td>
                                <td className="p-6 text-center text-green-600 font-black">A</td>
                                <td className="p-6 text-center font-bold">15.0</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50">
                                <td className="p-6 font-bold text-xs uppercase">TTM 103</td>
                                <td className="p-6 font-black text-xs uppercase text-[#002147]">International Travel Geography</td>
                                <td className="p-6 text-center font-bold">2</td>
                                <td className="p-6 text-center text-blue-600 font-black">B</td>
                                <td className="p-6 text-center font-bold">8.0</td>
                            </tr>
                        </tbody>
                        <tfoot className="bg-[#002147] text-white">
                            <tr>
                                <td colSpan="2" className="p-6 font-black uppercase text-xs">Semester Summary</td>
                                <td className="p-6 text-center font-black">5</td>
                                <td className="p-6 text-center font-black uppercase">GPA:</td>
                                <td className="p-6 text-center text-xl font-black text-red-500">4.60</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckResult;