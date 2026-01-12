import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; 
import { 
  collection, addDoc, serverTimestamp, onSnapshot, 
  query, orderBy, where, doc, updateDoc, getDoc, setDoc, getDocs 
} from "firebase/firestore";
import { 
  TrendingUp, Users, Wallet, Check, X, CreditCard, 
  Activity, PieChart, BarChart3, Send, History, Clock, 
  Bell, Printer, DollarSign, Briefcase, ChevronRight,
  ArrowUpRight, ArrowDownRight, ShieldCheck, Download, Settings, Save, Loader2, UserPlus, Layers, FileText, Menu, Search, Filter
} from "lucide-react";

const AccountantDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // States daga code dinka na asali
  const [stats, setStats] = useState({ totalIncome: 0, applicationFees: 0, registrationFees: 0, totalExpenses: 0 });
  const [request, setRequest] = useState({ title: "", amount: "", purpose: "", type: "Expense", category: "General" });
  const [newStaff, setNewStaff] = useState({ fullName: "", role: "staff", email: "" });
  const [requestHistory, setRequestHistory] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [salaryRates, setSalaryRates] = useState({});
  
  // Sabbin states
  const [searchQuery, setSearchQuery] = useState("");

  const rolesList = [
    { id: "rector", name: "Rector" },
    { id: "proprietor", name: "Proprietor" },
    { id: "accountant", name: "Accountant" },
    { id: "admission", name: "Admission Officer" },
    { id: "exam", name: "Exam Officer" },
    { id: "staff", name: "Academic Staff" }
  ];

  const categories = ["Maintenance", "Salaries", "Utility", "Fuel", "Academics", "General"];

  useEffect(() => {
    const unsubRates = onSnapshot(doc(db, "settings", "salary_rates"), (d) => {
      if (d.exists()) setSalaryRates(d.data());
    });

    const qReq = query(collection(db, "financialRequests"), orderBy("createdAt", "desc"));
    const unsubReq = onSnapshot(qReq, (snap) => {
      setRequestHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qStaff = query(collection(db, "users"), where("role", "!=", "student"));
    const unsubStaff = onSnapshot(qStaff, (snap) => {
      setStaffList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qIncome = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
    const unsubIncome = onSnapshot(qIncome, (snap) => {
      const txs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRecentPayments(txs);
      
      const analysis = txs.reduce((acc, curr) => {
        const amt = Number(curr.amount || 0);
        if (amt > 0) {
            acc.totalIncome += amt;
            if (curr.type === "Application") acc.applicationFees += amt;
            if (curr.type === "Registration") acc.registrationFees += amt;
        } else {
            acc.totalExpenses += Math.abs(amt);
        }
        return acc;
      }, { totalIncome: 0, applicationFees: 0, registrationFees: 0, totalExpenses: 0 });
      setStats(analysis);
    });

    return () => { unsubRates(); unsubReq(); unsubStaff(); unsubIncome(); };
  }, []);

  const handlePaySalary = async (staff) => {
    if (!window.confirm(`Shin kana son tura albashin ₦${Number(staff.salary).toLocaleString()} zuwa ga ${staff.fullName}?`)) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "transactions"), {
        studentName: staff.fullName,
        amount: -staff.salary,
        type: "Salary Disbursement",
        category: "Salaries",
        date: new Date().toLocaleDateString(),
        createdAt: serverTimestamp()
      });
      alert(`Nasara! An biya ${staff.fullName}. ✅`);
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const staffSalary = salaryRates[newStaff.role] || 0;
      const staffID = "STF-" + Math.floor(1000 + Math.random() * 9000);
      await addDoc(collection(db, "users"), {
        ...newStaff,
        idNumber: staffID,
        salary: staffSalary,
        status: "active",
        createdAt: serverTimestamp()
      });
      alert(`An yi nasarar sa ${newStaff.fullName} a matsayin ${newStaff.role}`);
      setNewStaff({ fullName: "", role: "staff", email: "" });
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleSaveSalaryRates = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "salary_rates"), salaryRates);
      for (const roleId of Object.keys(salaryRates)) {
        const q = query(collection(db, "users"), where("role", "==", roleId));
        const snap = await getDocs(q);
        snap.forEach(async (d) => {
          await updateDoc(doc(db, "users", d.id), { salary: salaryRates[roleId] });
        });
      }
      alert("Albashin kowa ya canza!");
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const generateReceipt = (payment) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>SKYWARD - RECEIPT</title></head>
        <body style="font-family: sans-serif; padding: 40px; border: 10px solid #002147;">
          <h1 style="color: #002147; text-align: center;">SKYWARD ACADEMY</h1>
          <p style="text-align: center; font-weight: bold;">OFFICIAL PAYMENT RECEIPT</p>
          <hr/>
          <div style="margin: 40px 0;">
            <p><strong>NAME:</strong> ${payment.studentName.toUpperCase()}</p>
            <p><strong>TYPE:</strong> ${payment.type}</p>
            <p><strong>AMOUNT:</strong> ₦${Math.abs(Number(payment.amount)).toLocaleString()}</p>
            <p><strong>DATE:</strong> ${payment.date}</p>
          </div>
          <hr/>
          <p style="text-align: center; color: #666; font-size: 12px;">Electronic Receipt - Skyward Finance</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleFinancialSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "financialRequests"), { 
        ...request, 
        status: "pending_rector", 
        requester: "Chief Accountant", 
        createdAt: serverTimestamp(), 
        date: new Date().toLocaleDateString() 
      });
      alert("An tura bukatar!");
      setRequest({ title: "", amount: "", purpose: "", type: "Expense", category: "General" });
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans overflow-x-hidden">
      
      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl flex flex-col items-center shadow-2xl">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#002147]">Processing...</p>
          </div>
        </div>
      )}

      {/* MOBILE HEADER */}
      <div className="md:hidden bg-[#002147] p-4 flex justify-between items-center text-white sticky top-0 z-[60] w-full">
        <h2 className="text-xl font-black italic text-emerald-400">SKYWARD</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/10 rounded-lg">
          {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:sticky top-0 left-0 w-72 bg-[#002147] text-white p-8 flex flex-col h-screen shadow-2xl z-50 transition-transform duration-300
      `}>
        <div className="mb-12 hidden md:block">
          <h2 className="text-2xl font-black italic text-emerald-400 uppercase tracking-tighter">Skyward</h2>
          <p className="text-[9px] font-bold opacity-50 uppercase tracking-[0.3em]">Bursary Central Pro</p>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto">
          <NavBtn active={activeTab === 'overview'} icon={<Activity size={18}/>} label="Overview" onClick={() => {setActiveTab('overview'); setIsSidebarOpen(false)}} />
          <NavBtn active={activeTab === 'analytics'} icon={<BarChart3 size={18}/>} label="Analytics" onClick={() => {setActiveTab('analytics'); setIsSidebarOpen(false)}} />
          <NavBtn active={activeTab === 'payroll'} icon={<Users size={18}/>} label="Staff & Payroll" onClick={() => {setActiveTab('payroll'); setIsSidebarOpen(false)}} />
          <NavBtn active={activeTab === 'requests'} icon={<Send size={18}/>} label="Fund Requests" onClick={() => {setActiveTab('requests'); setIsSidebarOpen(false)}} />
          <NavBtn active={activeTab === 'history'} icon={<History size={18}/>} label="History & Logs" onClick={() => {setActiveTab('history'); setIsSidebarOpen(false)}} />
          <NavBtn active={activeTab === 'settings'} icon={<Settings size={18}/>} label="Salary Config" onClick={() => {setActiveTab('settings'); setIsSidebarOpen(false)}} />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 w-full overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#002147] uppercase tracking-tighter">
              {activeTab.replace('_', ' ')}
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Institutional Financial Control</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
             <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                <input 
                    type="text" 
                    placeholder="Search records..." 
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-100 outline-none font-bold text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <div className="w-full sm:w-auto bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-4">
                <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase">Net Balance</p>
                <p className="text-lg font-black text-emerald-600">₦{(stats.totalIncome - stats.totalExpenses).toLocaleString()}</p>
                </div>
                <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Wallet size={20}/></div>
             </div>
          </div>
        </header>

        {/* --- TABS CONTENT (OVERVIEW, ANALYTICS, etc.) --- */}
        {activeTab === 'overview' && (
          <div className="space-y-6 md:space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <StatCard title="Total Revenue" val={`₦${stats.totalIncome.toLocaleString()}`} icon={<ArrowUpRight/>} color="emerald" />
              <StatCard title="Total Expenses" val={`₦${stats.totalExpenses.toLocaleString()}`} icon={<ArrowDownRight/>} color="red" />
              <StatCard title="App. Fees" val={`₦${stats.applicationFees.toLocaleString()}`} icon={<CreditCard/>} color="blue" />
              <StatCard title="Reg. Fees" val={`₦${stats.registrationFees.toLocaleString()}`} icon={<ShieldCheck/>} color="purple" />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] shadow-sm border">
              <h3 className="text-sm font-black text-[#002147] uppercase mb-6 flex items-center gap-2">
                <Clock size={18} className="text-blue-500"/> Live Ledger
              </h3>
              <div className="space-y-4">
                {recentPayments
                  .filter(p => p.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 8).map(pay => (
                  <div key={pay.id} className="flex flex-wrap justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-200 transition-all gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 bg-white shadow-sm rounded-xl flex items-center justify-center ${pay.amount < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                        {pay.amount < 0 ? <ArrowDownRight size={18}/> : <ArrowUpRight size={18}/>}
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-[#002147] uppercase">{pay.studentName}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{pay.type} • {pay.category || 'General'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                      <p className={`text-sm font-black ${pay.amount < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                        {pay.amount < 0 ? '-' : '+'}₦{Math.abs(Number(pay.amount)).toLocaleString()}
                      </p>
                      <button onClick={() => generateReceipt(pay)} className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 shadow-sm transition-colors border hover:border-blue-200"><Printer size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- PAYROLL TAB --- */}
        {activeTab === 'payroll' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
            <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-[30px] border shadow-sm h-fit">
              <h3 className="text-sm font-black text-[#002147] uppercase mb-6 flex items-center gap-2"><UserPlus size={18} className="text-emerald-500"/> Register New Staff</h3>
              <form onSubmit={handleAddStaff} className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" required value={newStaff.fullName} onChange={e => setNewStaff({...newStaff, fullName: e.target.value})} />
                <input type="email" placeholder="Email Address" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" required value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
                <select className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})}>
                  {rolesList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <button className="w-full py-5 bg-[#002147] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-emerald-500 transition-colors">Save Staff</button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[30px] border shadow-sm">
              <h3 className="text-sm font-black text-[#002147] uppercase mb-6">Payroll Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest">
                      <th className="pb-4">Name</th>
                      <th className="pb-4">Salary</th>
                      <th className="pb-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.filter(s => s.fullName.toLowerCase().includes(searchQuery.toLowerCase())).map(staff => (
                      <tr key={staff.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-4">
                          <p className="text-xs font-black text-[#002147] uppercase">{staff.fullName}</p>
                          <p className="text-[9px] text-slate-400 font-bold">{staff.role}</p>
                        </td>
                        <td className="py-4 text-xs font-black text-emerald-600">₦{Number(staff.salary || 0).toLocaleString()}</td>
                        <td className="py-4 text-center">
                          <button onClick={() => handlePaySalary(staff)} className="px-4 py-2 bg-[#002147] text-white text-[9px] font-black uppercase rounded-xl hover:bg-emerald-500 shadow-md transition-all">Execute Payment</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- ANALYTICS, REQUESTS, SETTINGS DA HISTORY suma suna nan yadda ka sa su --- */}
        {activeTab === 'requests' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
              <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-[30px] border shadow-sm">
                <h3 className="text-sm font-black text-[#002147] uppercase mb-6">Request Funds</h3>
                <form onSubmit={handleFinancialSubmission} className="space-y-4">
                   <input type="text" placeholder="Reason" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" value={request.title} onChange={(e) => setRequest({...request, title: e.target.value})} />
                   <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Amount (₦)" className="p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" value={request.amount} onChange={(e) => setRequest({...request, amount: e.target.value})} />
                        <select className="p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" value={request.category} onChange={(e) => setRequest({...request, category: e.target.value})}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                   </div>
                   <textarea placeholder="Details..." className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs h-32" value={request.purpose} onChange={(e) => setRequest({...request, purpose: e.target.value})} />
                   <button className="w-full py-5 bg-[#002147] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-colors">Submit to Rector</button>
                </form>
              </div>
              <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[30px] border shadow-sm">
                 <h3 className="text-sm font-black text-[#002147] uppercase mb-8">Request Tracker</h3>
                 <div className="space-y-4">
                    {requestHistory.map(item => (
                      <div key={item.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border gap-4 group hover:bg-white hover:border-blue-200 transition-all">
                         <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${item.status?.includes('approved') ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                              {item.status?.includes('approved') ? <Check size={18}/> : <Clock size={18}/>}
                            </div>
                            <div>
                               <p className="text-[11px] font-black text-[#002147] uppercase">{item.title}</p>
                               <p className="text-[8px] font-bold text-slate-400">{item.date} • {item.category}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-black">₦{Number(item.amount).toLocaleString()}</p>
                            <span className="text-[7px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{item.status?.replace('_', ' ')}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
        )}

        {activeTab === 'analytics' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[30px] border shadow-sm">
                        <h3 className="text-sm font-black text-[#002147] uppercase mb-6">Revenue Breakdown</h3>
                        <div className="space-y-6">
                            <ProgressItem label="Application Fees" amount={stats.applicationFees} total={stats.totalIncome} color="bg-blue-500" />
                            <ProgressItem label="Registration Fees" amount={stats.registrationFees} total={stats.totalIncome} color="bg-emerald-500" />
                            <ProgressItem label="Total Expenses" amount={stats.totalExpenses} total={stats.totalIncome} color="bg-red-500" />
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[30px] border shadow-sm flex flex-col justify-center items-center">
                        <PieChart size={48} className="text-slate-200 mb-4" />
                        <p className="text-[10px] font-black text-slate-400 uppercase">System Intelligence</p>
                        <h2 className="text-2xl font-black text-[#002147] mt-2">₦{stats.totalIncome.toLocaleString()}</h2>
                        <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1">Total Verified Revenue</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'settings' && (
            <div className="bg-white p-6 md:p-8 rounded-[30px] border shadow-sm max-w-4xl">
              <h3 className="text-sm font-black text-[#002147] uppercase mb-8 flex items-center gap-2"><Settings size={18}/> Salary Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                 {rolesList.map(role => (
                   <div key={role.id} className="p-4 md:p-6 bg-slate-50 rounded-2xl border flex items-center justify-between group hover:border-blue-200 transition-all">
                     <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{role.name}</p>
                       <div className="flex items-center gap-1">
                         <span className="font-black text-emerald-600 text-xs">₦</span>
                         <input type="number" value={salaryRates[role.id] || ""} onChange={(e) => setSalaryRates({...salaryRates, [role.id]: e.target.value})} className="bg-transparent border-b border-slate-200 outline-none font-black text-[#002147] w-24 text-sm focus:border-blue-400" />
                       </div>
                     </div>
                     <DollarSign className="opacity-10 group-hover:opacity-100 transition-opacity" size={24}/>
                   </div>
                 ))}
              </div>
              <button onClick={handleSaveSalaryRates} className="w-full mt-8 py-5 bg-[#002147] text-white rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all shadow-xl shadow-slate-200">
                 <Save size={18}/> Update System Salaries
              </button>
            </div>
        )}

        {activeTab === 'history' && (
            <div className="bg-white p-6 md:p-8 rounded-[30px] border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-black text-[#002147] uppercase">Financial History Logs</h3>
                    <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100"><Download size={14}/> Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="text-[10px] text-slate-400 uppercase tracking-widest border-b">
                                <th className="pb-4">Reference</th>
                                <th className="pb-4">Type</th>
                                <th className="pb-4">Category</th>
                                <th className="pb-4">Date</th>
                                <th className="pb-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentPayments.filter(p => p.studentName.toLowerCase().includes(searchQuery.toLowerCase())).map(log => (
                                <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="py-4 text-xs font-black text-[#002147]">{log.studentName}</td>
                                    <td className="py-4 text-[10px] font-bold text-slate-400">{log.type}</td>
                                    <td className="py-4">
                                        <span className="text-[9px] font-black uppercase bg-slate-100 px-2 py-1 rounded-md text-slate-500">{log.category || 'N/A'}</span>
                                    </td>
                                    <td className="py-4 text-[10px] font-bold text-slate-400">{log.date}</td>
                                    <td className={`py-4 text-right text-xs font-black ${log.amount < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                        {log.amount < 0 ? '-' : '+'}₦{Math.abs(log.amount).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

// Sub-components
const NavBtn = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-[10px] uppercase transition-all ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 translate-x-1' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
    {icon} {label}
  </button>
);

const StatCard = ({ title, val, icon, color }) => {
  const colors = { 
      emerald: 'bg-emerald-50 text-emerald-600', 
      blue: 'bg-blue-50 text-blue-600', 
      purple: 'bg-purple-50 text-purple-600',
      red: 'bg-red-50 text-red-600'
  };
  return (
    <div className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]} relative z-10 group-hover:scale-110 transition-all`}>{icon}</div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest relative z-10">{title}</p>
      <p className="text-lg font-black text-[#002147] mt-1 relative z-10">{val}</p>
    </div>
  );
};

const ProgressItem = ({ label, amount, total, color }) => {
    const percentage = total > 0 ? (amount / total) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase">
                <span className="text-slate-400">{label}</span>
                <span className="text-[#002147]">{percentage.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div style={{width: `${percentage}%`}} className={`h-full ${color} transition-all duration-1000`}></div>
            </div>
            <p className="text-[9px] font-bold text-slate-400">₦{amount.toLocaleString()}</p>
        </div>
    );
};

export default AccountantDashboard;