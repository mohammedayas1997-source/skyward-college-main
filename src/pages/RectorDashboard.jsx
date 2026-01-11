import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; 
import { signOut, onAuthStateChanged } from "firebase/auth";
import { 
  doc, serverTimestamp, collection, 
  onSnapshot, query, where, updateDoc
} from "firebase/firestore";
import { 
  ShieldAlert, Users, Activity, LogOut, Printer, 
  Search, Calendar, CreditCard, History, X, 
  CheckCircle2, UserX, UserCheck, Loader2, GraduationCap, ClipboardCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RectorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [financialRequests, setFinancialRequests] = useState([]);
  const [pendingAdmissions, setPendingAdmissions] = useState([]); // Sabo
  const [approvalHistory, setApprovalHistory] = useState([]); 
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // SECURITY CHECK: Gyara don tabbatar da shiga
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/portal/login");
      } else {
        // Zaka iya cire check din localStorage idan yana baka wahala a gwaji
        setLoading(false); 
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!auth.currentUser) return;

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

    // 3. NEW: Pending Admission Approvals (Wanda Admission Officer ya turo)
    const admissionQuery = query(
      collection(db, "applications"), 
      where("status", "==", "Awaiting Rector Approval")
    );
    const unsubAdmission = onSnapshot(admissionQuery, (snapshot) => {
      setPendingAdmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 4. Audit History
    const historyQuery = query(
        collection(db, "paymentRequests"), 
        where("status", "in", ["approved", "rejected"])
    );
    const unsubHistory = onSnapshot(historyQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedData = data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setApprovalHistory(sortedData);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const total = sortedData.reduce((acc, curr) => {
        const reqDate = curr.createdAt?.toDate();
        if (curr.status === "approved" && reqDate?.getMonth() === currentMonth && reqDate?.getFullYear() === currentYear) {
          return acc + (Number(curr.amount) || 0);
        }
        return acc;
      }, 0);
      setMonthlyTotal(total);
    });

    return () => { unsubStaff(); unsubFinance(); unsubHistory(); unsubAdmission(); };
  }, []);

  // --- ACTIONS ---
  const handleAdmissionApproval = async (id, decision) => {
    try {
      const status = decision === "approve" ? "Rector Approved" : "Rejected by Rector";
      await updateDoc(doc(db, "applications", id), {
        status: status,
        rectorActionDate: serverTimestamp()
      });
      alert(`Student ${decision === "approve" ? "Approved" : "Rejected"}!`);
    } catch (e) { alert(e.message); }
  };

  const handleFinancialApproval = async (id, decision) => {
    try {
      const status = decision === "approve" ? "approved" : "rejected";
      await updateDoc(doc(db, "paymentRequests", id), { 
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-red-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row text-left font-sans">
      {/* SIDEBAR */}
      <aside className="w-80 bg-[#0b121d] text-white p-8 hidden lg:flex flex-col h-screen sticky top-0">
        <div className="flex items-center gap-4 mb-14 border-b border-white/10 pb-8">
          <div className="p-3 bg-red-600 rounded-2xl shadow-lg"><ShieldAlert size={30} /></div>
          <h2 className="font-black text-2xl uppercase italic">Rector</h2>
        </div>
        <nav className="space-y-4 flex-1">
          <SidebarLink icon={<Activity size={18}/>} label="Overview" active />
          <SidebarLink icon={<GraduationCap size={18}/>} label="Admissions" />
          <SidebarLink icon={<Users size={18}/>} label="Staff Management" />
        </nav>
        <button onClick={() => { signOut(auth); navigate("/portal/login"); }} className="mt-auto flex items-center justify-center gap-3 p-5 rounded-2xl font-black text-[11px] uppercase text-red-500 border border-red-500/10 hover:bg-red-600 hover:text-white transition-all">
          <LogOut size={18}/> End Session
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 lg:p-12">
        <header className="flex flex-col xl:flex-row justify-between items-start mb-12 gap-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-[#0b121d] uppercase italic leading-none">Executive Hub</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase mt-3 tracking-widest flex items-center gap-2">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span> Systems Active
            </p>
          </div>
          <div className="bg-[#0b121d] text-white p-6 rounded-[30px] flex items-center gap-4 min-w-[240px]">
            <Calendar size={24} className="text-red-500"/>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Monthly Expenses</p>
              <p className="text-xl font-black">₦{monthlyTotal.toLocaleString()}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-10">
            
            {/* NEW: ADMISSION APPROVALS SECTION */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
              <h3 className="font-black text-[#0b121d] uppercase text-xs tracking-widest flex items-center gap-3 mb-8 italic">
                <ClipboardCheck className="text-blue-600" size={20}/> Student Admission Requests
              </h3>
              <div className="space-y-4">
                {pendingAdmissions.length === 0 ? (
                  <p className="text-[10px] text-slate-400 uppercase font-bold py-4">No pending admissions.</p>
                ) : pendingAdmissions.map((student) => (
                  <div key={student.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-blue-50/50 rounded-3xl border border-blue-100 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black">{student.fullName?.charAt(0)}</div>
                        <div>
                            <h4 className="font-black text-[#0b121d] text-sm uppercase">{student.fullName}</h4>
                            <p className="text-[9px] font-bold text-blue-600 uppercase italic">Awaiting Your Approval</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => handleAdmissionApproval(student.id, "reject")} className="px-6 py-3 bg-white border border-red-200 text-red-500 rounded-xl font-black text-[10px] uppercase hover:bg-red-50 transition-all">Deny</button>
                        <button onClick={() => handleAdmissionApproval(student.id, "approve")} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">Approve Admission</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FINANCIAL VOUCHERS */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
              <h3 className="font-black text-[#0b121d] uppercase text-xs tracking-widest flex items-center gap-3 mb-8 italic">
                <CreditCard className="text-red-600" size={20}/> Financial Authorization
              </h3>
              <div className="space-y-4">
                {financialRequests.length === 0 ? <p className="text-[10px] text-slate-400 uppercase font-bold">No financial requests.</p> : financialRequests.map((req) => (
                  <div key={req.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-[#f8fafc] rounded-3xl border border-slate-100 gap-6">
                    <div>
                      <h4 className="font-black text-[#0b121d] text-sm uppercase">{req.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Amount: ₦{Number(req.amount || 0).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => handleFinancialApproval(req.id, "reject")} className="h-12 w-12 bg-white border border-slate-200 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><X size={20}/></button>
                        <button onClick={() => handleFinancialApproval(req.id, "approve")} className="h-12 w-12 bg-[#0b121d] text-white rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center shadow-lg"><CheckCircle2 size={20}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* STAFF CONTROL */}
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 h-fit">
            <h3 className="font-black text-[#0b121d] uppercase text-[10px] mb-8 border-b pb-4 italic">System Personnel</h3>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
              <input 
                type="text" placeholder="FILTER STAFF..." 
                className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-[10px] font-bold outline-none border border-slate-100"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              {staffList.filter(s => s.fullName?.toLowerCase().includes(searchTerm.toLowerCase())).map((staff) => (
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