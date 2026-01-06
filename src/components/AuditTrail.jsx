import React, { useState } from "react";
import { Clock, User, ShieldAlert, Search, Filter, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuditTrail = () => {
  const navigate = useNavigate();
  const [logs] = useState([
    { id: 1, user: "Bursar (Musa)", action: "Approved Receipt #882", time: "10 mins ago", level: "Low" },
    { id: 2, user: "Exam Officer", action: "Updated 1st Sem Results", time: "45 mins ago", level: "Medium" },
    { id: 3, user: "Admin", action: "Changed Staff Rank (Aliyu)", time: "2 hours ago", level: "High" },
    { id: 4, user: "System", action: "Login Attempt Blocked", time: "5 hours ago", level: "High" },
  ]);

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-red-600 transition-all"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h1 className="text-2xl font-black text-[#002147] uppercase tracking-tighter">System Audit Trail</h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time security logs</p>
          </div>
          <div className="flex gap-4">
             <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input type="text" placeholder="Filter logs..." className="pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-100 text-[10px] font-bold outline-none" />
             </div>
             <button className="bg-[#002147] text-white p-2.5 rounded-xl"><Filter size={18}/></button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
              <div className="flex items-center gap-5">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                  log.level === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black text-[#002147] uppercase">{log.user}</p>
                    <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                    <p className="text-xs font-bold text-slate-500 uppercase">{log.action}</p>
                  </div>
                  <p className="text-[9px] font-black text-slate-300 mt-1 flex items-center gap-1">
                    <Clock size={10} /> {log.time}
                  </p>
                </div>
              </div>
              <span className={`text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                log.level === 'High' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {log.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;