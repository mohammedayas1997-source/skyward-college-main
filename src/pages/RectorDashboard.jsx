import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; 
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { 
  doc, setDoc, serverTimestamp, collection, 
  onSnapshot, query, where, updateDoc, orderBy, limit 
} from "firebase/firestore";
import { 
  ShieldAlert, Users, Landmark, Activity, Bell, 
  X, CheckCircle2, UserX, UserCheck, CreditCard, 
  History, Menu, LogOut, UserPlus, ShieldCheck,
  BarChart3, Calendar, Search, Printer, FileText
} from "lucide-react";

const RectorDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [financialRequests, setFinancialRequests] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]); 
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const staffQuery = query(collection(db, "users"), where("role", "in", ["staff", "accountant", "exam-officer"]));
    const unsubStaff = onSnapshot(staffQuery, (snapshot) => {
      setStaffList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const financeQuery = query(collection(db, "paymentRequests"), where("status", "==", "pending"));
    const unsubFinance = onSnapshot(financeQuery, (snapshot) => {
      setFinancialRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const historyQuery = query(
        collection(db, "paymentRequests"), 
        where("status", "in", ["approved", "rejected"]),
        orderBy("createdAt", "desc")
    );
    const unsubHistory = onSnapshot(historyQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApprovalHistory(data);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const total = data.reduce((acc, curr) => {
        const reqDate = curr.createdAt?.toDate();
        if (curr.status === "approved" && reqDate && reqDate.getMonth() === currentMonth && reqDate.getFullYear() === currentYear) {
          return acc + Number(curr.amount);
        }
        return acc;
      }, 0);
      setMonthlyTotal(total);
    });

    return () => { unsubStaff(); unsubFinance(); unsubHistory(); };
  }, []);

  // PRINTING LOGIC
  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
    
    let reportRows = approvalHistory
      .filter(h => h.status === 'approved')
      .map(h => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${h.title}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${h.createdAt?.toDate().toLocaleDateString()}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₦${Number(h.amount).toLocaleString()}</td>
        </tr>
      `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Monthly Expenditure Report - ${currentMonthName}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 4px double #000; padding-bottom: 20px; margin-bottom: 30px; }
            .title { text-transform: uppercase; font-weight: bold; font-size: 22px; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f4f4f4; text-align: left; padding: 12px; }
            .total-section { margin-top: 30px; text-align: right; font-size: 20px; font-weight: bold; }
            .footer { margin-top: 100px; display: flex; justify-content: space-between; }
            .sig { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 10px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Office of the Rector</div>
            <div style="font-size: 14px;">Monthly Expenditure Audit Report</div>
            <div style="font-size: 12px; color: #666;">Generated on: ${new Date().toLocaleString()}</div>
          </div>
          <h3>Month: ${currentMonthName} ${new Date().getFullYear()}</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Date Approved</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>${reportRows}</tbody>
          </table>
          <div class="total-section">Cumulative Total: ₦${monthlyTotal.toLocaleString()}</div>
          <div class="footer">
            <div class="sig">Internal Auditor Signature</div>
            <div class="sig">Rector's Executive Stamp</div>
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleApproval = async (id, decision) => {
    const docRef = doc(db, "paymentRequests", id);
    try {
      const status = decision === "approve" ? "approved" : "rejected";
      await updateDoc(docRef, { status: status, processedAt: serverTimestamp() });
    } catch (error) { alert("Error: " + error.message); }
  };

  const toggleStaffStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    await updateDoc(doc(db, "users", id), { status: newStatus });
  };

  const filteredStaff = staffList.filter(s => s.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row font-sans text-left">
      
      {/* SIDEBAR */}
      <aside className="w-80 bg-[#0b121d] text-white p-8 hidden lg:flex flex-col h-screen sticky top-0">
        <div className="flex items-center gap-4 mb-14 border-b border-white/10 pb-8">
          <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-900/40"><ShieldAlert size={30} /></div>
          <h2 className="font-black text-2xl tracking-tight uppercase leading-none italic">Rector</h2>
        </div>
        <nav className="space-y-4 flex-1">
          <SidebarLink icon={<Activity size={18}/>} label="Command Overview" active />
          <SidebarLink icon={<Users size={18}/>} label="Personnel List" />
          <SidebarLink icon={<History size={18}/>} label="Audit Logs" />
        </nav>
        <button onClick={() => signOut(auth)} className="mt-auto flex items-center justify-center gap-3 p-5 rounded-2xl font-black text-[11px] uppercase text-red-500 border border-red-500/10 hover:bg-red-600 hover:text-white transition-all">
          <LogOut size={18}/> End Session
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 lg:p-12">
        <header className="flex flex-col xl:flex-row justify-between items-start mb-12 gap-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-[#0b121d] uppercase tracking-tighter italic italic">Executive Hub</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-3 flex items-center gap-2">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span> Authorized Access Only
            </p>
          </div>
          
          <div className="flex gap-4">
            <button onClick={handlePrintReport} className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-4 rounded-2xl font-black text-[11px] uppercase shadow-sm hover:bg-slate-50 transition-all">
               <Printer size={18} className="text-blue-600"/> Generate Official Report
            </button>
            <div className="bg-[#0b121d] text-white p-6 rounded-[30px] shadow-xl flex items-center gap-4 min-w-[240px]">
              <Calendar size={24} className="text-red-500"/>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase">Monthly Approval</p>
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
                {financialRequests.map((req) => (
                  <div key={req.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-[#f8fafc] rounded-3xl border border-slate-100 gap-6">
                    <div>
                      <h4 className="font-black text-[#0b121d] text-sm uppercase">{req.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Value: ₦${Number(req.amount).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => handleApproval(req.id, "reject")} className="h-12 w-12 bg-white border border-slate-200 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><X size={20}/></button>
                        <button onClick={() => handleApproval(req.id, "approve")} className="h-12 w-12 bg-[#0b121d] text-white rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center shadow-lg"><CheckCircle2 size={20}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AUDIT TRAIL */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
              <h3 className="font-black text-[#0b121d] uppercase text-xs tracking-widest flex items-center gap-3 mb-8 italic">
                <History className="text-blue-600" size={20}/> Decision Logs (Recent)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
                    <tr><th className="pb-4">Transaction</th><th className="pb-4 text-center">Status</th><th className="pb-4 text-right">Amount</th></tr>
                  </thead>
                  <tbody>
                    {approvalHistory.slice(0, 8).map((h) => (
                      <tr key={h.id} className="border-b border-slate-50 last:border-none">
                        <td className="py-4 font-bold text-[12px] text-[#0b121d] uppercase">{h.title}</td>
                        <td className="py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${h.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{h.status}</span>
                        </td>
                        <td className="py-4 text-right font-black text-xs">₦${Number(h.amount).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* STAFF MANAGEMENT */}
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
            <h3 className="font-black text-[#0b121d] uppercase text-[10px] mb-8 border-b pb-4 tracking-widest italic">Personnel Control</h3>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
              <input 
                type="text" placeholder="FILTER BY NAME..." 
                className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-[10px] font-bold outline-none border border-slate-100"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              {filteredStaff.map((staff) => (
                <div key={staff.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${staff.status === 'Suspended' ? 'bg-red-50 border-red-100 opacity-60' : 'bg-[#f8fafc] border-transparent'}`}>
                  <div>
                    <p className="font-black text-[11px] uppercase text-[#0b121d] leading-none">{staff.fullName}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{staff.role}</p>
                  </div>
                  <button onClick={() => toggleStaffStatus(staff.id, staff.status)} className={`p-2.5 rounded-xl transition-all ${staff.status === 'Active' ? 'text-red-500 hover:bg-red-500 hover:text-white' : 'text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}>
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