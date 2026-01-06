import React, { useState } from "react";
import { 
  TrendingUp, TrendingDown, Users, Search, Download, 
  Wallet, Check, X, Eye, AlertCircle, CreditCard, 
  UserCheck, Package, ShoppingCart, Activity,
  PieChart, BarChart3, Plus, ArrowUpRight, ArrowDownRight, Bell, Printer
} from "lucide-react";


// --- SABON TSARI: Notification Hook (Simulation) ---
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
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans pb-20 relative overflow-x-hidden">
      
      {/* --- LIVE NOTIFICATION TOAST --- */}
      {toast && (
        <div className="fixed top-10 right-4 md:right-10 z-[100] bg-white border-l-4 border-green-500 shadow-2xl p-5 rounded-2xl flex items-center gap-4 animate-in slide-in-from-right duration-500">
          <div className="bg-green-50 p-2 rounded-full text-green-600">
            <Bell size={20} className="animate-bounce" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Alert</p>
            <p className="text-sm font-bold text-[#002147]">{toast}</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="animate-in slide-in-from-left duration-700 text-left">
          <h1 className="text-4xl font-black text-[#002147] uppercase tracking-tighter leading-none">Bursary Central</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3 italic flex items-center gap-2">
            <Activity size={12} className="text-green-500 animate-pulse"/> Financial Intelligence Unit • 2026
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <button onClick={() => window.print()} className="flex-1 md:flex-none bg-white p-4 rounded-2xl border border-slate-200 text-[#002147] hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <Printer size={20}/>
           </button>
           <button className="flex-[3] md:flex-none bg-[#002147] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 active:scale-95">
              <Plus size={18}/> New Journal Entry
           </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-lg transition-all text-left">
          <div className="h-14 w-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
            <ArrowDownRight size={24}/>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
            <h3 className="text-2xl font-black text-[#002147]">₦14.2M</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 group hover:shadow-lg transition-all text-left">
          <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
            <ArrowUpRight size={24}/>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expenses</p>
            <h3 className="text-2xl font-black text-[#002147]">₦4.8M</h3>
          </div>
        </div>
        <div className="bg-[#002147] p-6 rounded-[32px] shadow-xl flex items-center gap-5 text-left border border-white/5">
          <div className="h-14 w-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
            <Wallet size={24}/>
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Net Balance</p>
            <h3 className="text-2xl font-black text-white">₦9.4M</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
            {/* PAYROLL CARD */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xs font-black text-[#002147] uppercase tracking-[0.2em] flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg"><UserCheck className="text-blue-600" size={16}/></div>
                        Staff Payroll Management
                    </h2>
                    <button className="text-[9px] font-black text-blue-600 uppercase border-b-2 border-blue-600 hover:text-blue-800 transition-colors">View Schedule</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[9px] font-black text-slate-400 uppercase border-b border-slate-100">
                                <th className="pb-4 font-black">Staff Name</th>
                                <th className="pb-4 font-black text-right">Amount</th>
                                <th className="pb-4 font-black text-center">Status</th>
                                <th className="pb-4 font-black text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-left">
                            {staffList.map(s => (
                                <tr key={s.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4">
                                        <p className="text-[11px] font-black text-[#002147] uppercase">{s.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{s.rank}</p>
                                    </td>
                                    <td className="py-4 text-right">
                                        <p className="text-[11px] font-black text-[#002147]">{s.salary}</p>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase ${s.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button 
                                          onClick={() => showNotification(`An tura albashin ${s.name} nasara.`)}
                                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${s.status === 'Paid' ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-90'}`}>
                                            {s.status === 'Paid' ? 'Processed' : 'Pay Now'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* BUDGETING SYSTEM */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xs font-black text-[#002147] uppercase tracking-[0.2em] flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg"><BarChart3 className="text-purple-600" size={16}/></div>
                        Expenditure Control
                    </h2>
                </div>
                
                <div className="space-y-10">
                    {budgets.map(budget => (
                        <div key={budget.id} className="group">
                            <div className="flex justify-between items-end mb-3 text-left">
                                <div className="text-left">
                                    <h4 className="text-[11px] font-black text-[#002147] uppercase mb-1 group-hover:text-blue-600 transition-colors">{budget.category}</h4>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-black text-slate-800 tracking-tighter">₦{budget.actual.toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">of ₦{budget.planned.toLocaleString()} Limit</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[12px] font-black ${calculateProgress(budget.actual, budget.planned) > 90 ? 'text-red-500' : 'text-[#002147]'}`}>
                                        {calculateProgress(budget.actual, budget.planned).toFixed(0)}%
                                    </span>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Utilization</p>
                                </div>
                            </div>
                            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                                <div 
                                    className={`h-full ${budget.color} transition-all duration-1000 rounded-full shadow-inner relative`}
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
        <div className="space-y-8">
            {/* INVENTORY CARD */}
            <div className="bg-gradient-to-br from-[#002147] to-[#001530] p-8 rounded-[40px] shadow-2xl text-white relative overflow-hidden text-left border border-white/5">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-3 text-blue-400">
                    <AlertCircle size={16}/> Low Stock Monitoring
                </h2>
                <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-tight text-slate-100">Whiteboard Markers</p>
                            <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase italic">Stock Critically Low</p>
                        </div>
                        <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[9px] font-black">45 Units</span>
                    </div>
                </div>
                <button className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                    Order Inventory
                </button>
            </div>

            {/* QUICK APPROVALS */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200">
                <h2 className="text-xs font-black text-[#002147] uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg"><PieChart className="text-orange-500" size={16}/></div>
                    Pending Fees
                </h2>
                <div className="space-y-6">
                    {pendingReceipts.length > 0 ? (
                        pendingReceipts.map(r => (
                            <div key={r.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-[24px] border border-slate-100 hover:border-green-300 transition-all">
                                <div className="text-left">
                                    <p className="text-[11px] font-black text-[#002147] uppercase leading-none">{r.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 mt-2 tracking-tighter">{r.type} • <span className="text-green-600 font-black">{r.amount}</span></p>
                                </div>
                                <button 
                                    onClick={() => handleApprove(r.id, r.name)} 
                                    className="bg-white text-green-600 p-3 rounded-xl hover:bg-green-600 hover:text-white transition-all border border-green-100 shadow-sm active:scale-90"
                                >
                                    <Check size={16}/>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 animate-in zoom-in duration-500">
                            <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="text-green-500" size={32}/>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Pending Approvals</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;