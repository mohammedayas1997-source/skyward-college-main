import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; 
import { signOut, onAuthStateChanged } from "firebase/auth";
import { 
  doc, setDoc, serverTimestamp, collection, 
  onSnapshot, query, where, updateDoc, orderBy 
} from "firebase/firestore";
import { 
  ShieldAlert, Users, Activity, LogOut, Printer, 
  Search, Calendar, CreditCard, History, X, 
  CheckCircle2, UserX, UserCheck, Loader2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RectorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [financialRequests, setFinancialRequests] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]); 
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // SECURITY CHECK: Tabbatar Rector ne
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      const role = localStorage.getItem("userRole");
      if (!user || role !== "rector") {
        navigate("/portal/login");
      }
    });
    return () => unsubAuth();
  }, [navigate]);

  useEffect(() => {
    // 1. Personnel List
    const staffQuery = query(
        collection(db, "users"), 
        where("role", "in", ["staff", "accountant", "exam", "admission"])
    );
    const unsubStaff = onSnapshot(staffQuery, (snapshot) => {
      setStaffList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 2. Pending Financial Requests
    const financeQuery = query(collection(db, "paymentRequests"), where("status", "==", "pending"));
    const unsubFinance = onSnapshot(financeQuery, (snapshot) => {
      setFinancialRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 3. Audit History (Cire OrderBy idan baka yi Indexing ba tukunna)
    const historyQuery = query(
        collection(db, "paymentRequests"), 
        where("status", "in", ["approved", "rejected"])
    );
    
    const unsubHistory = onSnapshot(historyQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Yi sorting da kanka a nan don gujewa index error
      const sortedData = data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setApprovalHistory(sortedData);

      // Monthly Total Calculation
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const total = sortedData.reduce((acc, curr) => {
        const reqDate = curr.createdAt?.toDate();
        if (curr.status === "approved" && reqDate && reqDate.getMonth() === currentMonth && reqDate.getFullYear() === currentYear) {
          return acc + (Number(curr.amount) || 0);
        }
        return acc;
      }, 0);
      setMonthlyTotal(total);
      setLoading(false);
    }, (error) => {
        console.error("Firestore Error:", error);
        setLoading(false);
    });

    return () => { unsubStaff(); unsubFinance(); unsubHistory(); };
  }, []);

  const handleApproval = async (id, decision) => {
    const docRef = doc(db, "paymentRequests", id);
    try {
      const status = decision === "approve" ? "approved" : "rejected";
      await updateDoc(docRef, { 
        status: status, 
        processedAt: serverTimestamp(),
        approvedBy: "Rector"
      });
    } catch (error) { alert("Error: " + error.message); }
  };

  const toggleStaffStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    await updateDoc(doc(db, "users", id), { status: newStatus });
  };

  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
    
    let reportRows = approvalHistory
      .filter(h => h.status === 'approved')
      .map(h => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${h.title}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${h.createdAt?.toDate().toLocaleDateString()}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₦${Number(h.amount || 0).toLocaleString()}</td>
        </tr>
      `).join('');

    printWindow.document.write(`
      <html>
        <head><title>Monthly Report</title></head>
        <body style="font-family: Arial; padding: 40px;">
          <h1 style="text-align: center;">Monthly Expenditure Report</h1>
          <p style="text-align: center;">Month: ${currentMonthName}</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead><tr style="background: #f4f4f4;"><th>Description</th><th>Date</th><th style="text-align: right;">Amount</th></tr></thead>
            <tbody>${reportRows}</tbody>
          </table>
          <h2 style="text-align: right;">Total: ₦${monthlyTotal.toLocaleString()}</h2>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-red-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row text-left">
      {/* SIDEBAR */}
      <aside className="w-80 bg-[#0b121d] text-white p-8 hidden lg:flex flex-col h-screen sticky top-0">
        <div className="flex items-center gap-4 mb-14 border-b border-white/10 pb-8">
          <div className="p-3 bg-red-600 rounded-2xl shadow-lg"><ShieldAlert size={30} /></div>
          <h2 className="font-black text-2xl uppercase italic">Rector</h2>
        </div>
        <nav className="space-y-4 flex-1">
          <SidebarLink icon={<Activity size={18}/>} label="Overview" active />
          <SidebarLink icon={<Users size={18}/>} label="Staff" />
          <SidebarLink icon={<History size={18}/>} label="Audit" />
        </nav>
        <button onClick={() => { signOut(auth); localStorage.clear(); navigate("/portal/login"); }} className="mt-auto flex items-center justify-center gap-3 p-5 rounded-2xl font-black text-[11px] uppercase text-red-500 border border-red-500/10 hover:bg-red-600 hover:text-white transition-all">
          <LogOut size={18}/> End Session
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 lg:p-12">
        <header className="flex flex-col xl:flex-row justify-between items-start mb-12 gap-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-[#0b121d] uppercase italic">Executive Hub</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase mt-3 tracking-widest flex items-center gap-2">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span> Systems Active
            </p>
          </div>
          <div className="flex gap-4">
            <button onClick={handlePrintReport} className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-4 rounded-2xl font-black text-[11px] uppercase hover:bg-slate-50 transition-all shadow-sm">
               <Printer size={18} className="text-blue-600"/> Report
            </button>
            <div className="bg-[#0b121d] text-white p-6 rounded-[30px] flex items-center gap-4 min-w-[240px]">
              <Calendar size={24} className="text-red-500"/>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase">Month Total</p>
                <p className="text-xl font-black">₦{monthlyTotal.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-10">
            {/* PENDING VOUCHERS */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
              <h3 className="font-black text-[#0b121d] uppercase text-xs tracking-widest flex items-center gap-3 mb-8 italic">
                <CreditCard className="text-red-600" size={20}/> Authorization Required
              </h3>
              <div className="space-y-4">
                {financialRequests.length === 0 ? <p className="text-[10px] text-slate-400 uppercase font-bold">No pending requests.</p> : financialRequests.map((req) => (
                  <div key={req.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-[#f8fafc] rounded-3xl border border-slate-100 gap-6">
                    <div>
                      <h4 className="font-black text-[#0b121d] text-sm uppercase">{req.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Value: ₦{Number(req.amount || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => handleApproval(req.id, "reject")} className="h-12 w-12 bg-white border border-slate-200 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><X size={20}/></button>
                        <button onClick={() => handleApproval(req.id, "approve")} className="h-12 w-12 bg-[#0b121d] text-white rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center shadow-lg"><CheckCircle2 size={20}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AUDIT LOGS */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
              <h3 className="font-black text-[#0b121d] uppercase text-xs tracking-widest flex items-center gap-3 mb-8 italic">
                <History className="text-blue-600" size={20}/> Audit Log
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-[10px] font-black text-slate-400 uppercase border-b">
                    <tr><th className="pb-4 text-left">Transaction</th><th className="pb-4 text-center">Status</th><th className="pb-4 text-right">Amount</th></tr>
                  </thead>
                  <tbody>
                    {approvalHistory.slice(0, 10).map((h) => (
                      <tr key={h.id} className="border-b border-slate-50 last:border-none">
                        <td className="py-4 font-bold text-[11px] text-[#0b121d] uppercase">{h.title}</td>
                        <td className="py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${h.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{h.status}</span>
                        </td>
                        <td className="py-4 text-right font-black text-xs">₦{Number(h.amount || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* STAFF CONTROL */}
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
            <h3 className="font-black text-[#0b121d] uppercase text-[10px] mb-8 border-b pb-4 italic">Staff Control</h3>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
              <input 
                type="text" placeholder="FILTER NAME..." 
                className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-[10px] font-bold outline-none border border-slate-100"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              {staffList.filter(s => s.fullName.toLowerCase().includes(searchTerm.toLowerCase())).map((staff) => (
                <div key={staff.id} className={`flex items-center justify-between p-4 rounded-2xl border ${staff.status === 'Suspended' ? 'bg-red-50 border-red-100' : 'bg-[#f8fafc] border-transparent'}`}>
                  <div>
                    <p className="font-black text-[11px] uppercase text-[#0b121d] leading-none">{staff.fullName}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{staff.role}</p>
                  </div>
                  <button onClick={() => toggleStaffStatus(staff.id, staff.status)} className={`p-2.5 rounded-xl transition-all ${staff.status === 'Active' ? 'text-red-500 hover:bg-red-600 hover:text-white' : 'text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}>
                    {staff.status === 'Active' ? <UserX size={18}/> : <UserCheck size={18}/>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-[11px] uppercase transition-all ${active ? "bg-red-600 text-white shadow-lg shadow-red-900/20" : "text-slate-500 hover:text-white"}`}>
    {icon} {label}
  </button>
);

export default RectorDashboard;