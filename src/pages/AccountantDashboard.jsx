import React, { useState } from "react";
import { 
  TrendingUp, TrendingDown, Users, Search, Download, 
  Wallet, Check, X, Eye, AlertCircle, CreditCard, 
  UserCheck, Package, ShoppingCart, Activity,
  PieChart, BarChart3, Plus, ArrowUpRight, ArrowDownRight, Bell, Printer
} from "lucide-react";

const AccountantDashboard = () => {
  // --- STATE NA NOTIFICATIONS ---
  const [toast, setToast] = useState(null);

  // --- SASHE NA APPROVAL ---
  const [pendingReceipts, setPendingReceipts] = useState([
    { id: 1, name: "ABUBAKAR IBRAHIM", amount: "₦125,000", type: "Tuition", date: "Jan 04, 2026" },
    { id: 2, name: "FATIMA SANI", amount: "₦45,000", type: "Exam Fees", date: "Jan 04, 2026" },
  ]);

  // --- SASHE NA PAYROLL ---
  const [staffList, setStaffList] = useState([
    { id: 101, name: "Dr. Aliyu Musa", rank: "Senior Lecturer", salary: "₦250,000", status: "Unpaid" },
    { id: 102, name: "Zainab Bello", rank: "Admin Officer", salary: "₦85,000", status: "Paid" },
  ]);

  // --- SASHE NA BUDGETING ---
  const [budgets, setBudgets] = useState([
    { id: 1, category: "Infrastructure Maintenance", planned: 5000000, actual: 1200000, color: "bg-blue-600" },
    { id: 2, category: "Academic Materials", planned: 2500000, actual: 2100000, color: "bg-orange-500" },
    { id: 3, category: "Staff Training", planned: 1500000, actual: 1450000, color: "bg-purple-600" },
  ]);

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = (id, name) => {
    setPendingReceipts(pendingReceipts.filter(item => item.id !== id));
    showNotification(`Nasara! An amince da biyan kudin ${name}.`);
    console.log(`Audit: Accountant approved payment for ${name}`);
  };

  const calculateProgress = (actual, planned) => {
    return Math.min((actual / planned) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] p-4 md:p-10 font-sans pb-20 relative overflow-x-hidden text-left">
      
      {/* --- LIVE NOTIFICATION TOAST --- */}
      {toast && (
        <div className="fixed top-10 right-4 md:right-10 z-[100] bg-white border-l-4 border-emerald-500 shadow-2xl p-6 rounded-2xl flex items-center gap-5 animate-in slide-in-from-right duration-500 min-w-[300px]">
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
            <Bell size={20} className="animate-bounce" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System Notification</p>
            <p className="text-sm font-bold text-[#002147] mt-1">{toast}</p>
          </div>
          <button onClick={() => setToast(null)} className="ml-auto text-slate-300 hover:text-slate-500"><X size={16}/></button>
        </div>
      )}

      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
        <div className="animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-3 mb-3">
             <div className="h-8 w-1 bg-emerald-500 rounded-full"></div>
             <h1 className="text-4xl font-black text-[#002147] uppercase tracking-tighter leading-none italic">Bursary Central</h1>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] ml-4 flex items-center gap-2 opacity-70">
            <Activity size={14} className="text-emerald-500 animate-pulse"/> Treasury & Finance Department • 2026
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button onClick={() => window.print()} className="bg-white h-14 w-14 rounded-2xl border border-slate-200 text-[#002147] hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center active:scale-90">
              <Printer size={22}/>
           </button>
           <button className="flex-1 md:flex-none bg-[#002147] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#003366] transition-all shadow-xl shadow-blue-900/10 active:scale-95">
              <Plus size={20}/> New Journal Entry
           </button>
        </div>
      </header>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <SummaryCard label="Total Revenue" value="₦14.2M" icon={<ArrowDownRight size={24}/>} color="emerald" />
        <SummaryCard label="Expenses" value="₦4.8M" icon={<ArrowUpRight size={24}/>} color="red" />
        <div className="bg-[#002147] p-8 rounded-[40px] shadow-2xl flex items-center justify-between text-left border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-125 transition-transform duration-700"><Wallet size={120}/></div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">Net Treasury Balance</p>
            <h3 className="text-3xl font-black text-white tracking-tighter italic">₦9.4M</h3>
          </div>
          <div className="h-14 w-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 relative z-10 shadow-inner">
            <Wallet size={24}/>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-10">
            {/* PAYROLL CARD */}
            <div className="bg-white p-8 lg:p-10 rounded-[50px] shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <h2 className="text-xs font-black text-[#002147] uppercase tracking-[0.2em] flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shadow-sm"><UserCheck size={20}/></div>
                        Staff Payroll Management
                    </h2>
                    <button className="text-[10px] font-black text-blue-600 uppercase border-b-2 border-blue-600 hover:text-blue-800 transition-colors tracking-tighter">Download Schedule</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
                                <th className="pb-5 font-black">Staff Member</th>
                                <th className="pb-5 font-black text-right">Base Salary</th>
                                <th className="pb-5 font-black text-center">Status</th>
                                <th className="pb-5 font-black text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {staffList.map(s => (
                                <tr key={s.id} className="group hover:bg-[#fcfdfe] transition-colors">
                                    <td className="py-6">
                                        <p className="text-[12px] font-black text-[#002147] uppercase tracking-tight">{s.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 italic opacity-70">{s.rank}</p>
                                    </td>
                                    <td className="py-6 text-right font-black text-[#002147] text-sm tracking-tighter">
                                        {s.salary}
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter ${s.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="py-6 text-right">
                                        <button 
                                          onClick={() => showNotification(`An tura albashin ${s.name} nasara.`)}
                                          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${s.status === 'Paid' ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-[#002147] text-white hover:bg-emerald-600 hover:shadow-lg shadow-blue-900/10 active:scale-95'}`}>
                                            {s.status === 'Paid' ? 'Processed' : 'Disburse'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* BUDGETING SYSTEM */}
            <div className="bg-white p-8 lg:p-10 rounded-[50px] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-xs font-black text-[#002147] uppercase tracking-[0.2em] flex items-center gap-3">
                        <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 shadow-sm"><BarChart3 size={20}/></div>
                        Expenditure & Budget Control
                    </h2>
                </div>
                
                <div className="space-y-12">
                    {budgets.map(budget => (
                        <div key={budget.id} className="group">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h4 className="text-[12px] font-black text-[#002147] uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{budget.category}</h4>
                                    <div className="flex items-center gap-3">
                                        <p className="text-lg font-black text-slate-800 tracking-tighter">₦{budget.actual.toLocaleString()}</p>
                                        <div className="h-4 w-[1px] bg-slate-200"></div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Limit: ₦{budget.planned.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xl font-black italic tracking-tighter ${calculateProgress(budget.actual, budget.planned) > 90 ? 'text-red-500' : 'text-[#002147]'}`}>
                                        {calculateProgress(budget.actual, budget.planned).toFixed(0)}%
                                    </span>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Utilization</p>
                                </div>
                            </div>
                            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-100 shadow-inner">
                                <div 
                                    className={`h-full ${budget.color} transition-all duration-1000 rounded-full shadow-lg relative`}
                                    style={{ width: `${calculateProgress(budget.actual, budget.planned)}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="space-y-10">
            {/* INVENTORY CARD */}
            <div className="bg-gradient-to-br from-[#002147] to-[#011225] p-10 rounded-[50px] shadow-2xl text-white relative overflow-hidden border border-white/5">
                <div className="absolute -top-10 -right-10 opacity-10 rotate-12"><Package size={200}/></div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-3 text-blue-400 relative z-10">
                    <AlertCircle size={18}/> Stock Monitoring
                </h2>
                <div className="space-y-6 relative z-10">
                    <div className="p-5 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all cursor-default backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-[11px] font-black uppercase tracking-tight text-white">Whiteboard Markers</p>
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[9px] font-black shadow-lg shadow-red-500/40">45 Units</span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase italic opacity-60">Status: Critical Reorder Level</p>
                    </div>
                </div>
                <button className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-700 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 relative z-10">
                    Order Inventory
                </button>
            </div>

            {/* QUICK APPROVALS */}
            <div className="bg-white p-8 lg:p-10 rounded-[50px] shadow-sm border border-slate-100">
                <h2 className="text-xs font-black text-[#002147] uppercase tracking-[0.2em] mb-10 flex items-center gap-3 border-b pb-6">
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shadow-sm"><PieChart size={20}/></div>
                    Payment Verification
                </h2>
                <div className="space-y-6">
                    {pendingReceipts.length > 0 ? (
                        pendingReceipts.map(r => (
                            <div key={r.id} className="flex justify-between items-center p-5 bg-[#fcfdfe] rounded-[30px] border border-slate-50 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group">
                                <div>
                                    <p className="text-[12px] font-black text-[#002147] uppercase tracking-tighter mb-1">{r.name}</p>
                                    <div className="flex items-center gap-2">
                                       <p className="text-[10px] font-black text-emerald-600 tracking-tight">{r.amount}</p>
                                       <span className="text-slate-300">•</span>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{r.type}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleApprove(r.id, r.name)} 
                                    className="bg-white text-emerald-600 h-12 w-12 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 shadow-sm flex items-center justify-center active:scale-90"
                                >
                                    <Check size={20}/>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 animate-in zoom-in duration-500">
                            <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <CheckCircle className="text-emerald-500" size={40}/>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Ledger Fully Balanced</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- INTERNAL HELPERS ---
const SummaryCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-default">
    <div className={`h-16 w-16 bg-${color}-50 rounded-3xl flex items-center justify-center text-${color}-600 group-hover:scale-110 transition-transform shadow-inner`}>
      {icon}
    </div>
    <div className="text-right">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className={`text-3xl font-black text-[#002147] tracking-tighter italic`}>{value}</h3>
    </div>
  </div>
);

const CheckCircle = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default AccountantDashboard;