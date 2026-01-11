import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; 
import { signOut, onAuthStateChanged } from "firebase/auth";
import { 
  doc, serverTimestamp, collection, 
  onSnapshot, query, where, updateDoc, orderBy 
} from "firebase/firestore";
import { 
  ShieldAlert, Users, Activity, LogOut, Printer, 
  Search, Calendar, CreditCard, History, X, 
  CheckCircle2, UserX, UserCheck, Loader2, GraduationCap, ClipboardCheck, BookOpen, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RectorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  
  // --- STATES ---
  const [staffList, setStaffList] = useState([]);
  const [financialRequests, setFinancialRequests] = useState([]);
  const [pendingAdmissions, setPendingAdmissions] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]); 
  const [studentResults, setStudentResults] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/portal/login");
      else setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!auth.currentUser) return;

    // 1. Personnel & Performance - Realtime
    const unsubStaff = onSnapshot(query(collection(db, "users"), where("role", "in", ["staff", "accountant", "exam", "admission"])), (snap) => {
      setStaffList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 2. Financial Pipeline - Realtime
    const unsubFinance = onSnapshot(query(collection(db, "paymentRequests"), where("status", "==", "pending")), (snap) => {
      setFinancialRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 3. Admission Pipeline - Realtime
    const unsubAdmission = onSnapshot(query(collection(db, "applications"), where("status", "==", "Awaiting Rector Approval")), (snap) => {
      setPendingAdmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 4. Academic Results History
    const unsubResults = onSnapshot(query(collection(db, "results"), orderBy("createdAt", "desc")), (snap) => {
      setStudentResults(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 5. Audit History & Analytics
    const unsubHistory = onSnapshot(query(collection(db, "paymentRequests"), where("status", "in", ["approved", "rejected"])), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setApprovalHistory(data.sort((a, b) => (b.processedAt?.seconds || 0) - (a.processedAt?.seconds || 0)));
      
      const currentMonth = new Date().getMonth();
      const total = data.reduce((acc, curr) => {
        const reqDate = curr.processedAt?.toDate();
        return (curr.status === "approved" && reqDate?.getMonth() === currentMonth) ? acc + Number(curr.amount || 0) : acc;
      }, 0);
      setMonthlyTotal(total);
    });

    return () => { unsubStaff(); unsubFinance(); unsubAdmission(); unsubResults(); unsubHistory(); };
  }, []);

  // --- BUSINESS LOGIC (Rector's Power) ---
  const handleAdmission = async (id, dec) => {
    if(!window.confirm(`Are you sure you want to ${dec} this student?`)) return;
    try {
      await updateDoc(doc(db, "applications", id), {
        status: dec === "approve" ? "Rector Approved" : "Rejected by Rector",
        rectorActionDate: serverTimestamp()
      });
    } catch (e) { alert(e.message); }
  };

  const handleFinance = async (id, dec) => {
    if(!window.confirm(`Are you sure you want to ${dec} this payment?`)) return;
    try {
      await updateDoc(doc(db, "paymentRequests", id), { 
        status: dec === "approve" ? "approved" : "rejected", 
        processedAt: serverTimestamp(),
        approvedBy: "Rector"
      });
    } catch (e) { alert(e.message); }
  };

  const toggleStaff = async (id, stat) => {
    const action = stat === "Active" ? "Suspend" : "Activate";
    if(!window.confirm(`Do you want to ${action} this staff member?`)) return;
    await updateDoc(doc(db, "users", id), { status: stat === "Active" ? "Suspended" : "Active" });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-red-600" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row text-left font-sans">
      
      {/* SIDEBAR - DARK THEME */}
      <aside className="w-80 bg-[#0b121d] text-white p-8 hidden lg:flex flex-col h-screen sticky top-0">
        <div className="flex items-center gap-4 mb-14 border-b border-white/10 pb-8">
          <div className="p-3 bg-red-600 rounded-2xl shadow-lg"><ShieldAlert size={30} /></div>
          <h2 className="font-black text-2xl uppercase italic tracking-tighter">Skyward Admin</h2>
        </div>
        <nav className="space-y-2 flex-1">
          <SidebarLink icon={<Activity size={18}/>} label="Overview" active={activeTab === "Overview"} onClick={() => setActiveTab("Overview")} />
          <SidebarLink icon={<GraduationCap size={18}/>} label="Admissions" active={activeTab === "Admissions"} onClick={() => setActiveTab("Admissions")} />
          <SidebarLink icon={<Users size={18}/>} label="Personnel" active={activeTab === "Personnel"} onClick={() => setActiveTab("Personnel")} />
          <SidebarLink icon={<BookOpen size={18}/>} label="Academic Results" active={activeTab === "Results"} onClick={() => setActiveTab("Results")} />
        </nav>
        <button onClick={() => { signOut(auth); navigate("/portal/login"); }} className="mt-auto flex items-center justify-center gap-3 p-5 rounded-2xl font-black text-[11px] uppercase text-red-500 border border-red-500/10 hover:bg-red-600 hover:text-white transition-all">
          <LogOut size={18}/> End Session
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-6 lg:p-12">
        <header className="flex flex-col xl:flex-row justify-between items-start mb-12 gap-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-[#0b121d] uppercase italic leading-none">{activeTab}</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase mt-3 tracking-widest flex items-center gap-2">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span> Authorized Rector Access Only
            </p>
          </div>
          <div className="bg-[#0b121d] text-white p-6 rounded-[30px] flex items-center gap-4 min-w-[260px] shadow-xl shadow-slate-200">
            <CreditCard size={24} className="text-red-500"/>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Monthly Approved Expenditure</p>
              <p className="text-2xl font-black">₦{monthlyTotal.toLocaleString()}</p>
            </div>
          </div>
        </header>

        {/* TAB 1: OVERVIEW - FINANCIAL & AUDIT */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            <div className="xl:col-span-2 space-y-10">
              <SectionWrapper title="Pending Financial Vouchers" icon={<CreditCard size={18} className="text-red-600"/>}>
                {financialRequests.length === 0 ? (
                    <p className="text-xs font-bold text-slate-400 text-center py-10">No pending financial requests.</p>
                ) : (
                    financialRequests.map(req => (
                        <div key={req.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-4 hover:shadow-md transition-all">
                          <div>
                              <h4 className="font-black text-sm uppercase">{req.title}</h4>
                              <p className="text-[10px] font-bold text-slate-400">AMOUNT: ₦{Number(req.amount).toLocaleString()}</p>
                              <p className="text-[9px] text-blue-600 font-black uppercase mt-1">Requested by: {req.requestedBy || 'Accounts Office'}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleFinance(req.id, "reject")} className="p-3 bg-white border rounded-xl text-red-500 hover:bg-red-50"><X size={18}/></button>
                            <button onClick={() => handleFinance(req.id, "approve")} className="p-3 bg-[#0b121d] text-white rounded-xl hover:bg-emerald-600 shadow-lg"><CheckCircle2 size={18}/></button>
                          </div>
                        </div>
                      ))
                )}
              </SectionWrapper>
              
              <SectionWrapper title="Audit History (Recent Actions)" icon={<History size={18} className="text-blue-600"/>}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-[10px] font-black text-slate-400 uppercase border-b pb-4">
                      <tr><th className="pb-4">Description</th><th className="pb-4">Status</th><th className="pb-4 text-right">Amount</th></tr>
                    </thead>
                    <tbody>
                      {approvalHistory.slice(0, 5).map(h => (
                        <tr key={h.id} className="border-b border-slate-50 last:border-none">
                          <td className="py-4 font-bold text-[11px] uppercase">{h.title}</td>
                          <td className="py-4"><span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase ${h.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{h.status}</span></td>
                          <td className="py-4 text-right font-black">₦{Number(h.amount).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionWrapper>
            </div>
            
            <div className="space-y-10">
               <SectionWrapper title="Staff Status Overview" icon={<Users size={18}/>}>
                  {staffList.slice(0, 8).map(s => (
                    <div key={s.id} className="flex items-center justify-between mb-4 p-4 bg-slate-50 rounded-2xl">
                      <div><p className="font-black text-[10px] uppercase leading-none">{s.fullName}</p><p className="text-[8px] text-slate-400 uppercase font-bold mt-1">{s.role}</p></div>
                      <span className={`h-2.5 w-2.5 rounded-full ${s.status === 'Active' ? 'bg-emerald-500 shadow-lg shadow-emerald-200' : 'bg-red-500'}`}></span>
                    </div>
                  ))}
               </SectionWrapper>
            </div>
          </div>
        )}

        {/* TAB 2: ADMISSIONS - RECTOR APPROVAL */}
        {activeTab === "Admissions" && (
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
            <h3 className="font-black uppercase text-xs tracking-widest flex items-center gap-3 mb-8"><ClipboardCheck className="text-blue-600" size={20}/> New Students Approval Required</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pendingAdmissions.length === 0 ? (
                  <div className="col-span-full py-20 text-center font-black text-slate-300 uppercase">All admission requests cleared.</div>
              ) : (
                  pendingAdmissions.map(student => (
                    <div key={student.id} className="p-6 bg-slate-50 rounded-[30px] border border-slate-100">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-14 w-14 rounded-2xl bg-[#0b121d] text-white flex items-center justify-center font-black text-xl">{student.fullName?.charAt(0)}</div>
                        <div>
                            <h4 className="font-black text-sm uppercase">{student.fullName}</h4>
                            <p className="text-[9px] font-bold text-blue-600 uppercase mt-1">{student.selectedCourse}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAdmission(student.id, "reject")} className="flex-1 py-3 bg-white border border-red-200 text-red-500 rounded-xl font-black text-[10px] uppercase">Reject</button>
                        <button onClick={() => handleAdmission(student.id, "approve")} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-blue-200 hover:bg-[#0b121d]">Approve</button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PERSONNEL - STAFF CONTROL */}
        {activeTab === "Personnel" && (
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h3 className="font-black uppercase text-xs tracking-widest">Personnel & Access Management</h3>
              <div className="relative w-full md:w-80"><Search size={14} className="absolute left-3 top-3 text-slate-400"/><input type="text" placeholder="Filter by name..." className="w-full pl-10 p-3 bg-slate-50 rounded-2xl text-[10px] font-bold outline-none border border-slate-100" onChange={(e) => setSearchTerm(e.target.value)}/></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {staffList.filter(s => s.fullName?.toLowerCase().includes(searchTerm.toLowerCase())).map(staff => (
                <div key={staff.id} className={`p-6 rounded-[30px] border transition-all ${staff.status === 'Suspended' ? 'bg-red-50 border-red-100 opacity-75' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <h4 className="font-black text-sm uppercase mb-1">{staff.fullName}</h4>
                  <p className="text-[9px] font-bold text-blue-600 uppercase mb-4 tracking-tighter">{staff.role}</p>
                  <button onClick={() => toggleStaff(staff.id, staff.status)} className={`w-full py-3 rounded-xl font-black text-[9px] uppercase flex items-center justify-center gap-2 ${staff.status === 'Active' ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'}`}>
                    {staff.status === 'Active' ? <><UserX size={14}/> Suspend Access</> : <><UserCheck size={14}/> Activate Access</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESULTS - ACADEMIC LOGS */}
        {activeTab === "Results" && (
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
            <h3 className="font-black uppercase text-xs tracking-widest flex items-center gap-3 mb-8"><BookOpen className="text-emerald-600" size={20}/> Academic Performance Master-Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-[10px] font-black text-slate-400 uppercase border-b pb-4">
                  <tr><th className="pb-4">Student Name</th><th className="pb-4">Course</th><th className="pb-4">Score</th><th className="pb-4">Lecturer/Unit</th><th className="pb-4 text-right">Action</th></tr>
                </thead>
                <tbody>
                  {studentResults.map(res => (
                    <tr key={res.id} className="border-b border-slate-50 last:border-none">
                      <td className="py-5 font-black text-xs uppercase text-[#0b121d]">{res.studentName}</td>
                      <td className="py-5 text-xs font-bold text-slate-500">{res.courseTitle}</td>
                      <td className="py-5"><span className={`font-black text-xs ${res.score >= 40 ? 'text-emerald-600' : 'text-red-600'}`}>{res.score}%</span></td>
                      <td className="py-5 text-[10px] font-black uppercase text-blue-600">{res.staffName || 'Exam Office'}</td>
                      <td className="py-5 text-right"><button className="p-2 bg-slate-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Eye size={14}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- REUSABLE SUB-COMPONENTS ---
const SectionWrapper = ({ title, icon, children }) => (
  <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-100/50 border border-slate-100">
    <h3 className="font-black text-[#0b121d] uppercase text-xs tracking-widest flex items-center gap-3 mb-8 italic">
      {icon} {title}
    </h3>
    {children}
  </div>
);

const SidebarLink = ({ icon, label, active = false, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black text-[11px] uppercase transition-all ${active ? "bg-red-600 text-white shadow-xl shadow-red-900/30" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
    {icon} {label}
  </button>
);

export default RectorDashboard;