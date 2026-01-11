import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; 
import { signOut, onAuthStateChanged } from "firebase/auth";
import { 
  doc, serverTimestamp, collection, 
  onSnapshot, query, where, updateDoc, orderBy, writeBatch 
} from "firebase/firestore";
import { 
  ShieldAlert, Users, Activity, LogOut, Printer, 
  Search, Calendar, CreditCard, History, X, 
  CheckCircle2, UserX, UserCheck, Loader2, GraduationCap, ClipboardCheck, BookOpen, Eye, ListFilter
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RectorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedItems, setSelectedItems] = useState([]); // For Bulk Actions
  
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

    const unsubStaff = onSnapshot(query(collection(db, "users"), where("role", "!=", "student")), (snap) => {
      setStaffList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubFinance = onSnapshot(query(collection(db, "paymentRequests"), where("status", "==", "pending")), (snap) => {
      setFinancialRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubAdmission = onSnapshot(query(collection(db, "applications"), where("status", "==", "Awaiting Rector Approval")), (snap) => {
      setPendingAdmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubResults = onSnapshot(query(collection(db, "results"), orderBy("createdAt", "desc")), (snap) => {
      setStudentResults(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

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

  // --- BATCH (SELECT ALL) LOGIC ---
  const handleSelectAll = (list) => {
    if (selectedItems.length === list.length) setSelectedItems([]);
    else setSelectedItems(list.map(item => item.id));
  };

  const handleBulkAction = async (collectionName, decision) => {
    if (selectedItems.length === 0) return;
    const confirmMsg = `Are you sure you want to ${decision} ${selectedItems.length} selected items?`;
    if (!window.confirm(confirmMsg)) return;

    const batch = writeBatch(db);
    selectedItems.forEach((id) => {
      const docRef = doc(db, collectionName, id);
      const updateData = collectionName === "applications" 
        ? { status: decision === "approve" ? "Rector Approved" : "Rejected by Rector", rectorActionDate: serverTimestamp() }
        : { status: decision === "approve" ? "approved" : "rejected", processedAt: serverTimestamp(), approvedBy: "Rector" };
      batch.update(docRef, updateData);
    });

    try {
      await batch.commit();
      setSelectedItems([]);
      alert("Bulk operation completed successfully.");
    } catch (e) { alert("Error: " + e.message); }
  };

  // --- SINGLE ACTIONS ---
  const handleAdmission = async (id, dec) => {
    if(!window.confirm(`Action: ${dec} this student?`)) return;
    try {
      await updateDoc(doc(db, "applications", id), {
        status: dec === "approve" ? "Rector Approved" : "Rejected by Rector",
        rectorActionDate: serverTimestamp()
      });
    } catch (e) { alert(e.message); }
  };

  const toggleStaff = async (id, stat) => {
    const action = stat === "Active" ? "Suspend" : "Activate";
    if(!window.confirm(`Warning: You are about to ${action} this staff's access!`)) return;
    await updateDoc(doc(db, "users", id), { status: stat === "Active" ? "Suspended" : "Active" });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white"><Loader2 className="animate-spin text-red-600" size={50} /><p className="ml-4 font-black uppercase italic tracking-widest">Securing System...</p></div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col lg:flex-row text-left font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-80 bg-[#020617] text-white p-8 hidden lg:flex flex-col h-screen sticky top-0 border-r border-white/5">
        <div className="flex items-center gap-4 mb-14 bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-[30px] border border-white/10 shadow-2xl">
          <div className="p-3 bg-red-600 rounded-2xl shadow-lg rotate-3"><ShieldAlert size={30} /></div>
          <h2 className="font-black text-xl uppercase italic tracking-tighter leading-none">Rector<br/><span className="text-[10px] text-red-500 not-italic tracking-widest">Executive</span></h2>
        </div>
        <nav className="space-y-3 flex-1">
          <SidebarLink icon={<Activity size={20}/>} label="Executive Overview" active={activeTab === "Overview"} onClick={() => {setActiveTab("Overview"); setSelectedItems([]);}} />
          <SidebarLink icon={<GraduationCap size={20}/>} label="Admissions Pool" active={activeTab === "Admissions"} onClick={() => {setActiveTab("Admissions"); setSelectedItems([]);}} />
          <SidebarLink icon={<Users size={20}/>} label="University Personnel" active={activeTab === "Personnel"} onClick={() => {setActiveTab("Personnel"); setSelectedItems([]);}} />
          <SidebarLink icon={<BookOpen size={20}/>} label="Academic Intelligence" active={activeTab === "Results"} onClick={() => {setActiveTab("Results"); setSelectedItems([]);}} />
        </nav>
        <button onClick={() => { signOut(auth); navigate("/portal/login"); }} className="mt-auto flex items-center justify-center gap-3 p-5 rounded-[24px] font-black text-[11px] uppercase text-red-500 bg-red-500/5 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all duration-500 group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform"/> Final Terminate Session
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start mb-16 gap-8">
          <div>
            <h1 className="text-5xl lg:text-7xl font-black text-[#020617] uppercase italic leading-[0.8] tracking-tighter">{activeTab}</h1>
            <div className="flex items-center gap-3 mt-6">
                <span className="px-3 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase rounded-full animate-pulse">Live Encryption</span>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Skyward Multi-Campus Node-01</p>
            </div>
          </div>
          <div className="bg-[#020617] text-white p-8 rounded-[40px] flex items-center gap-6 min-w-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-t border-white/10">
            <div className="p-4 bg-emerald-500/10 rounded-3xl"><CreditCard size={30} className="text-emerald-500"/></div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Approved Liquidity (MTD)</p>
              <p className="text-3xl font-black tabular-nums">₦{monthlyTotal.toLocaleString()}</p>
            </div>
          </div>
        </header>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            <div className="xl:col-span-2 space-y-12">
              <SectionWrapper title="Financial Voucher Approval" icon={<CreditCard size={20}/>}>
                <div className="mb-6 flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                    <button onClick={() => handleSelectAll(financialRequests)} className="text-[10px] font-black uppercase text-blue-600 hover:underline">
                        {selectedItems.length === financialRequests.length ? "Deselect All" : "Select All Pending"}
                    </button>
                    {selectedItems.length > 0 && (
                        <div className="flex gap-2">
                            <button onClick={() => handleBulkAction("paymentRequests", "reject")} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-black text-[9px] uppercase">Bulk Reject</button>
                            <button onClick={() => handleBulkAction("paymentRequests", "approve")} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase shadow-lg">Bulk Approve ({selectedItems.length})</button>
                        </div>
                    )}
                </div>
                {financialRequests.map(req => (
                  <div key={req.id} className={`flex items-center justify-between p-7 rounded-[35px] border transition-all mb-4 ${selectedItems.includes(req.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-center gap-5">
                        <input type="checkbox" checked={selectedItems.includes(req.id)} onChange={() => {
                            setSelectedItems(prev => prev.includes(req.id) ? prev.filter(i => i !== req.id) : [...prev, req.id])
                        }} className="w-5 h-5 rounded-lg border-slate-300"/>
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-tight">{req.title}</h4>
                            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase">Allocated: <span className="text-slate-900">₦{Number(req.amount).toLocaleString()}</span></p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleBulkAction("paymentRequests", "reject")} className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors"><X size={20}/></button>
                      <button onClick={() => handleBulkAction("paymentRequests", "approve")} className="p-4 bg-[#020617] text-white rounded-2xl hover:bg-emerald-600 shadow-xl transition-all"><CheckCircle2 size={20}/></button>
                    </div>
                  </div>
                ))}
              </SectionWrapper>
            </div>
            <div className="space-y-12">
                <SectionWrapper title="Staff Activity Log" icon={<Activity size={20}/>}>
                    {staffList.slice(0, 10).map(s => (
                        <div key={s.id} className="flex items-center gap-4 mb-6 p-2">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">{s.fullName?.charAt(0)}</div>
                            <div className="flex-1">
                                <p className="font-black text-[10px] uppercase leading-none">{s.fullName}</p>
                                <p className="text-[8px] text-blue-600 font-bold uppercase mt-1 tracking-tighter">{s.role}</p>
                            </div>
                            <span className={`h-2 w-2 rounded-full ${s.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                        </div>
                    ))}
                </SectionWrapper>
            </div>
          </div>
        )}

        {/* TAB 2: ADMISSIONS */}
        {activeTab === "Admissions" && (
          <div className="bg-white rounded-[50px] p-10 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-10">
                <h3 className="font-black uppercase text-sm tracking-[0.3em] italic flex items-center gap-4 text-blue-600"><ClipboardCheck size={24}/> Batch Admission Processing</h3>
                <div className="flex gap-4">
                    <button onClick={() => handleSelectAll(pendingAdmissions)} className="px-6 py-3 border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-50">Toggle Selection</button>
                    {selectedItems.length > 0 && (
                        <button onClick={() => handleBulkAction("applications", "approve")} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-2xl shadow-blue-300">Authorize All ({selectedItems.length})</button>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {pendingAdmissions.map(student => (
                <div key={student.id} className={`p-8 rounded-[40px] border transition-all relative overflow-hidden ${selectedItems.includes(student.id) ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 bg-slate-50/50'}`}>
                  <input type="checkbox" checked={selectedItems.includes(student.id)} onChange={() => {
                      setSelectedItems(prev => prev.includes(student.id) ? prev.filter(i => i !== student.id) : [...prev, student.id])
                  }} className="absolute top-6 right-6 w-6 h-6 rounded-full border-slate-300"/>
                  <div className="flex flex-col items-center text-center">
                    <div className="h-20 w-20 rounded-[30px] bg-[#020617] text-white flex items-center justify-center font-black text-3xl mb-6 shadow-2xl">{student.fullName?.charAt(0)}</div>
                    <h4 className="font-black text-lg uppercase leading-tight mb-2">{student.fullName}</h4>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-8 px-4 py-1 bg-blue-100 rounded-full">{student.selectedCourse}</p>
                    <div className="w-full flex gap-3">
                        <button onClick={() => handleAdmission(student.id, "reject")} className="flex-1 py-4 bg-white border border-red-100 text-red-500 rounded-2xl font-black text-[10px] uppercase hover:bg-red-50">Reject</button>
                        <button onClick={() => handleAdmission(student.id, "approve")} className="flex-1 py-4 bg-[#020617] text-white rounded-2xl font-black text-[10px] uppercase shadow-lg hover:scale-105 transition-transform">Authorize</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PERSONNEL - FULL LIST */}
        {activeTab === "Personnel" && (
          <div className="bg-white rounded-[50px] p-10 shadow-2xl border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <h3 className="font-black uppercase text-sm tracking-[0.3em] flex items-center gap-4 italic"><Users size={24} className="text-red-600"/> Master Personnel Index</h3>
              <div className="relative w-full md:w-96">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"/>
                <input type="text" placeholder="Search by name, role or ID..." className="w-full pl-14 p-5 bg-slate-50 rounded-[25px] text-[12px] font-bold outline-none border border-slate-100 focus:border-red-500 transition-all" onChange={(e) => setSearchTerm(e.target.value)}/>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {staffList.filter(s => s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || s.role?.toLowerCase().includes(searchTerm.toLowerCase())).map(staff => (
                <div key={staff.id} className={`p-8 rounded-[40px] border flex flex-col items-center text-center transition-all duration-500 ${staff.status === 'Suspended' ? 'bg-red-50 border-red-200 grayscale' : 'bg-white border-slate-100 hover:shadow-2xl hover:-translate-y-2'}`}>
                  <div className={`h-16 w-16 rounded-[24px] flex items-center justify-center font-black text-xl mb-4 ${staff.status === 'Suspended' ? 'bg-red-200 text-red-600' : 'bg-slate-100 text-slate-800'}`}>{staff.fullName?.charAt(0)}</div>
                  <h4 className="font-black text-[13px] uppercase mb-1 truncate w-full">{staff.fullName}</h4>
                  <span className="text-[9px] font-black text-blue-600 uppercase mb-6 tracking-widest">{staff.role}</span>
                  <div className="w-full pt-6 border-t border-slate-50 mt-auto">
                    <button onClick={() => toggleStaff(staff.id, staff.status)} className={`w-full py-4 rounded-2xl font-black text-[9px] uppercase flex items-center justify-center gap-3 transition-all ${staff.status === 'Active' ? 'bg-red-500 text-white shadow-lg shadow-red-200 hover:bg-red-600' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                        {staff.status === 'Active' ? <><UserX size={16}/> Revoke Access</> : <><UserCheck size={16}/> Restore Access</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESULTS */}
        {activeTab === "Results" && (
          <div className="bg-white rounded-[50px] p-10 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-10">
                <h3 className="font-black uppercase text-sm tracking-[0.3em] flex items-center gap-4 italic"><BookOpen size={24} className="text-emerald-600"/> Real-time Grade Analytics</h3>
                <button className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors"><Printer size={20}/></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-[10px] font-black text-slate-400 uppercase border-b-2 border-slate-50">
                  <tr><th className="pb-6 text-left">Student Information</th><th className="pb-6 text-left">Course Module</th><th className="pb-6 text-center">Score Grade</th><th className="pb-6 text-left">Internal Assessor</th><th className="pb-6 text-right">Verification</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {studentResults.map(res => (
                    <tr key={res.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-6"><p className="font-black text-xs uppercase text-[#020617]">{res.studentName}</p><p className="text-[9px] text-slate-400 font-bold uppercase mt-1">ID: {res.id.slice(0,8)}</p></td>
                      <td className="py-6 font-bold text-xs text-slate-500 uppercase">{res.courseTitle}</td>
                      <td className="py-6 text-center"><span className={`inline-block px-4 py-2 rounded-xl font-black text-xs ${res.score >= 40 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{res.score}%</span></td>
                      <td className="py-6"><p className="text-[10px] font-black uppercase text-blue-600">{res.staffName || 'Academic Unit'}</p></td>
                      <td className="py-6 text-right"><button className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all"><Eye size={16}/></button></td>
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

const SectionWrapper = ({ title, icon, children }) => (
  <div className="bg-white rounded-[50px] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
    <h3 className="font-black text-[#020617] uppercase text-[11px] tracking-[0.4em] flex items-center gap-5 mb-10 italic">
      <span className="p-3 bg-slate-900 text-white rounded-2xl scale-75">{icon}</span> {title}
    </h3>
    {children}
  </div>
);

const SidebarLink = ({ icon, label, active = false, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-5 p-6 rounded-[30px] font-black text-[12px] uppercase transition-all duration-500 ${active ? "bg-red-600 text-white shadow-[0_20px_40px_-10px_rgba(220,38,38,0.5)] scale-105" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
    {icon} {label}
  </button>
);

export default RectorDashboard;