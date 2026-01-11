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
  ArrowUpRight, ArrowDownRight, ShieldCheck, Download, Settings, Save, Loader2, UserPlus
} from "lucide-react";

const AccountantDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalIncome: 0, applicationFees: 0, registrationFees: 0 });
  const [request, setRequest] = useState({ title: "", amount: "", purpose: "", type: "Expense" });
  const [newStaff, setNewStaff] = useState({ fullName: "", role: "staff", email: "" });
  const [requestHistory, setRequestHistory] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [salaryRates, setSalaryRates] = useState({});

  const rolesList = [
    { id: "rector", name: "Rector" },
    { id: "proprietor", name: "Proprietor" },
    { id: "accountant", name: "Accountant" },
    { id: "admission", name: "Admission Officer" },
    { id: "exam", name: "Exam Officer" },
    { id: "staff", name: "Academic Staff" }
  ];

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
      const txs = snap.docs.map(d => d.data());
      setRecentPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      const analysis = txs.reduce((acc, curr) => {
        const amt = Number(curr.amount || 0);
        acc.totalIncome += amt;
        if (curr.type === "Application") acc.applicationFees += amt;
        if (curr.type === "Registration") acc.registrationFees += amt;
        return acc;
      }, { totalIncome: 0, applicationFees: 0, registrationFees: 0 });
      setStats(analysis);
    });

    return () => { unsubRates(); unsubReq(); unsubStaff(); unsubIncome(); };
  }, []);

  // --- 1. ADD NEW STAFF WITH AUTO SALARY ---
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

  // --- 2. AUTOMATIC RECEIPT GENERATOR ---
  const generateReceipt = (payment) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>SKYWARD - OFFICIAL RECEIPT</title></head>
        <body style="font-family: sans-serif; padding: 40px; border: 10px solid #002147;">
          <h1 style="color: #002147; text-align: center;">SKYWARD ACADEMY</h1>
          <p style="text-align: center; font-weight: bold;">OFFICIAL PAYMENT RECEIPT</p>
          <hr/>
          <div style="margin: 40px 0;">
            <p><strong>STUDENT NAME:</strong> ${payment.studentName.toUpperCase()}</p>
            <p><strong>PAYMENT TYPE:</strong> ${payment.type}</p>
            <p><strong>AMOUNT PAID:</strong> ₦${Number(payment.amount).toLocaleString()}</p>
            <p><strong>DATE:</strong> ${payment.date}</p>
            <p><strong>TRANSACTION ID:</strong> ${payment.id}</p>
          </div>
          <hr/>
          <p style="text-align: center; color: #666; font-size: 12px;">This is an electronically generated receipt.</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleFinancialSubmission = async (e, customData = null) => {
    if (e) e.preventDefault();
    const dataToSubmit = customData || { ...request, status: "pending_rector", requester: "Chief Accountant", createdAt: serverTimestamp(), date: new Date().toLocaleDateString() };
    setLoading(true);
    try {
      await addDoc(collection(db, "financialRequests"), dataToSubmit);
      alert("An tura bukatar!");
      setRequest({ title: "", amount: "", purpose: "", type: "Expense" });
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-left font-sans">
      <aside className="w-72 bg-[#002147] text-white p-8 flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="mb-12">
          <h2 className="text-2xl font-black tracking-tighter italic text-emerald-400">SKYWARD</h2>
          <p className="text-[9px] font-bold opacity-50 uppercase tracking-[0.3em]">Treasury & Analytics</p>
        </div>
        <nav className="flex-1 space-y-2">
          <NavBtn active={activeTab === 'overview'} icon={<Activity size={18}/>} label="Overview" onClick={() => setActiveTab('overview')} />
          <NavBtn active={activeTab === 'payroll'} icon={<Users size={18}/>} label="Staff & Payroll" onClick={() => setActiveTab('payroll')} />
          <NavBtn active={activeTab === 'settings'} icon={<Settings size={18}/>} label="Salary Config" onClick={() => setActiveTab('settings')} />
          <NavBtn active={activeTab === 'requests'} icon={<Send size={18}/>} label="Fund Requests" onClick={() => setActiveTab('requests')} />
        </nav>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Bursary Central</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Real-time Financial Control</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase">Total Revenue</p>
              <p className="text-lg font-black text-emerald-600">₦{stats.totalIncome.toLocaleString()}</p>
            </div>
            <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Wallet size={20}/></div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Balance" val={`₦${stats.totalIncome.toLocaleString()}`} icon={<DollarSign/>} color="emerald" />
              <StatCard title="App. Fees" val={`₦${stats.applicationFees.toLocaleString()}`} icon={<CreditCard/>} color="blue" />
              <StatCard title="Reg. Fees" val={`₦${stats.registrationFees.toLocaleString()}`} icon={<ShieldCheck/>} color="purple" />
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border">
              <h3 className="text-sm font-black text-[#002147] uppercase mb-6 flex justify-between items-center">
                Recent Student Payments
                <span className="text-[10px] text-slate-400">Click Print Icon for Receipt</span>
              </h3>
              <div className="space-y-4">
                {recentPayments.slice(0, 8).map(pay => (
                  <div key={pay.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><ArrowUpRight size={18}/></div>
                      <div>
                        <p className="text-[11px] font-black text-[#002147] uppercase">{pay.studentName}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{pay.type} • {pay.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="text-sm font-black text-emerald-600">₦{Number(pay.amount).toLocaleString()}</p>
                      <button onClick={() => generateReceipt(pay)} className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 shadow-sm transition-all"><Printer size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border shadow-sm h-fit">
              <h3 className="text-sm font-black text-[#002147] uppercase mb-6 flex items-center gap-2"><UserPlus size={18} className="text-emerald-500"/> Register New Staff</h3>
              <form onSubmit={handleAddStaff} className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" required value={newStaff.fullName} onChange={e => setNewStaff({...newStaff, fullName: e.target.value})} />
                <input type="email" placeholder="Email Address" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" required value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
                <select className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})}>
                  {rolesList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <button className="w-full py-5 bg-[#002147] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">Save Staff & Set Salary</button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border shadow-sm">
              <h3 className="text-sm font-black text-[#002147] uppercase mb-6">Staff List & Monthly Earnings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest">
                      <th className="pb-4">Name</th>
                      <th className="pb-4">Role</th>
                      <th className="pb-4">Salary</th>
                      <th className="pb-4">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map(staff => (
                      <tr key={staff.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                        <td className="py-4 text-xs font-black text-[#002147] uppercase">{staff.fullName}</td>
                        <td className="py-4 text-[9px] font-black"><span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md">{staff.role}</span></td>
                        <td className="py-4 text-xs font-black text-emerald-600">₦{Number(staff.salary || 0).toLocaleString()}</td>
                        <td className="py-4 text-[10px] text-slate-400 font-bold">{staff.idNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-[40px] border shadow-sm max-w-4xl">
            <h3 className="text-sm font-black text-[#002147] uppercase mb-8">System Salary Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rolesList.map(role => (
                <div key={role.id} className="p-6 bg-slate-50 rounded-3xl border flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{role.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-emerald-600">₦</span>
                      <input type="number" value={salaryRates[role.id] || ""} onChange={(e) => setSalaryRates({...salaryRates, [role.id]: e.target.value})} placeholder="0.00" className="bg-transparent border-b-2 border-slate-200 outline-none font-black text-[#002147] w-32 focus:border-emerald-500 transition-all" />
                    </div>
                  </div>
                  <DollarSign className="opacity-10" size={32}/>
                </div>
              ))}
            </div>
            <button onClick={handleSaveSalaryRates} className="w-full mt-10 py-5 bg-[#002147] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg flex items-center justify-center gap-3">
              <Save size={18}/> Update System Salaries
            </button>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border shadow-sm h-fit">
              <h3 className="text-sm font-black text-[#002147] uppercase mb-6 flex items-center gap-2"><Send size={18} className="text-blue-600"/> Request Funds</h3>
              <form onSubmit={handleFinancialSubmission} className="space-y-4">
                <input type="text" placeholder="Reason" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" value={request.title} onChange={(e) => setRequest({...request, title: e.target.value})} />
                <input type="number" placeholder="Amount (₦)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" value={request.amount} onChange={(e) => setRequest({...request, amount: e.target.value})} />
                <textarea placeholder="Details..." className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs h-32" value={request.purpose} onChange={(e) => setRequest({...request, purpose: e.target.value})} />
                <button className="w-full py-5 bg-[#002147] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Submit to Rector</button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border shadow-sm">
              <h3 className="text-sm font-black text-[#002147] uppercase mb-8">Request Tracker</h3>
              <div className="space-y-4">
                {requestHistory.map(item => (
                  <div key={item.id} className="p-6 bg-slate-50 rounded-[30px] flex justify-between items-center border">
                    <div className="flex items-center gap-5">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${item.status === 'approved_rector' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {item.status === 'approved_rector' ? <Check size={20}/> : <Clock size={20}/>}
                      </div>
                      <div><p className="text-[12px] font-black text-[#002147] uppercase">{item.title}</p><p className="text-[9px] font-bold text-slate-400 uppercase">{item.date}</p></div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#002147]">₦{Number(item.amount).toLocaleString()}</p>
                      <span className="text-[8px] font-black uppercase text-blue-600 tracking-tighter">{item.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-[10px] uppercase transition-all ${active ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
    {icon} {label}
  </button>
);

const StatCard = ({ title, val, icon, color }) => {
  const colors = { emerald: 'bg-emerald-50 text-emerald-600', blue: 'bg-blue-50 text-blue-600', purple: 'bg-purple-50 text-purple-600' };
  return (
    <div className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm">
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 ${colors[color]}`}>{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-xl font-black text-[#002147] mt-1">{val}</p>
    </div>
  );
};

export default AccountantDashboard;