import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { db, auth } from "../firebase";
import { 
  doc, setDoc, serverTimestamp, collection, onSnapshot, 
  query, where, updateDoc, deleteDoc, getDocs 
} from "firebase/firestore";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { 
  LayoutDashboard, UploadCloud, Users, FileCheck, 
  LogOut, Search, Clock, CheckCircle, X,
  Key, ShieldCheck, Loader2, BookOpen, UserCheck, Trash2, Edit3, Plus,
  Printer, Lock, Globe, AlertCircle, ChevronRight
} from "lucide-react";

const ExamOfficerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview"); 

  // --- STATES ---
  const [incomingResults, setIncomingResults] = useState([]);
  const [approvedAdmissions, setApprovedAdmissions] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [allStudents, setAllStudents] = useState([]); 
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [showAddStudent, setShowAddStudent] = useState(false);

  // --- SECURITY & DATA FETCHING ---
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/portal/login");
    });

    // Fetch Staff
    const qStaff = query(collection(db, "users"), where("role", "==", "staff"));
    const unsubStaff = onSnapshot(qStaff, (s) => setStaffList(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    
    // Fetch Approved Admissions waiting for accounts
    const qAdmissions = query(collection(db, "admissions"), where("status", "==", "Approved"));
    const unsubAdmissions = onSnapshot(qAdmissions, (s) => setApprovedAdmissions(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    // Fetch Existing Students
    const qStudents = query(collection(db, "users"), where("role", "==", "student"));
    const unsubStudents = onSnapshot(qStudents, (s) => setAllStudents(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    // Fetch Results (from Teachers)
    const unsubResults = onSnapshot(collection(db, "results"), (s) => {
      setIncomingResults(s.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { 
      unsubAuth(); unsubStaff(); unsubAdmissions(); unsubStudents(); unsubResults(); 
    };
  }, [navigate]);

  // --- REAL-LIFE HANDLERS ---

  // 1. Send to Rector for signature/approval
  const requestRectorApproval = async (id) => {
    setLoadingId(id);
    try {
      await updateDoc(doc(db, "results", id), { 
        rectorStatus: "Pending Approval",
        officerVerified: true,
        lastUpdated: serverTimestamp() 
      });
      alert("Sent to Rector's Office for final approval.");
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  // 2. Publish to Student Dashboard (Only after Rector approves)
  const handlePublishResult = async (id) => {
    setLoadingId(id);
    try {
      await updateDoc(doc(db, "results", id), { 
        status: "Published", 
        publishedAt: serverTimestamp(),
        visibility: "public"
      });
      alert("Result is now LIVE on the student portal.");
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  // 3. Create Student Portal Account
  const generateStudentAccount = async (student) => {
    setLoadingId(student.id || "new");
    try {
      const userCred = await createUserWithEmailAndPassword(auth, student.email, "Student@GTI2026");
      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid, 
        fullName: student.name || student.fullName, 
        email: student.email,
        admissionNo: student.admissionNo || `GTI/STD/${Math.floor(1000 + Math.random() * 9000)}`, 
        role: "student", 
        createdAt: serverTimestamp()
      });
      
      if(student.id) {
        await updateDoc(doc(db, "admissions", student.id), { accountCreated: true });
      }
      alert("Student Portal Account Activated!");
    } catch (error) { alert(error.message); } 
    finally { setLoadingId(null); setShowAddStudent(false); }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/portal/login");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] font-sans text-left text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#001529] text-white flex flex-col md:sticky md:top-0 md:h-screen shadow-2xl z-50">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
              <ShieldCheck size={24} color="white" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">Skyward</h2>
          </div>
          <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em] ml-1">Examination Office</p>
        </div>
        
        <nav className="flex-grow p-6 space-y-3 mt-4">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Overview" active={activeTab === "Overview"} onClick={() => setActiveTab("Overview")} />
          <NavItem icon={<BookOpen size={18}/>} label="Staff & Courses" active={activeTab === "Staff & Courses"} onClick={() => setActiveTab("Staff & Courses")} />
          <NavItem icon={<Users size={18}/>} label="Student Sync" active={activeTab === "Student Sync"} onClick={() => setActiveTab("Student Sync")} />
          <NavItem icon={<FileCheck size={18}/>} label="Records" active={activeTab === "Records"} onClick={() => setActiveTab("Records")} />
        </nav>

        <div className="p-6">
          <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em]">
            <LogOut size={18} /> Sign Out Office
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-6 md:p-12">
        <header className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Results or Students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 pr-6 py-4 w-full bg-slate-50 rounded-2xl outline-none text-[12px] font-bold border border-transparent focus:bg-white focus:border-red-600/20 transition-all" 
            />
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setShowAddStudent(true)} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg">
               <Plus size={18}/> New Enrollment
             </button>
             <div className="w-12 h-12 bg-[#001529] text-red-500 rounded-2xl flex items-center justify-center font-black shadow-lg border border-white/10">EX</div>
          </div>
        </header>

        {activeTab === "Overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12 text-left">
              <StatsCard title="Faculty Staff" value={staffList.length} icon={<Users size={20}/>} color="blue" />
              <StatsCard title="Total Students" value={allStudents.length} icon={<Users size={20}/>} color="amber" />
              <StatsCard title="Awaiting Rector" value={incomingResults.filter(r => r.rectorStatus === "Pending Approval").length} icon={<Lock size={20}/>} color="red" />
              <StatsCard title="Published" value={incomingResults.filter(r => r.status === "Published").length} icon={<Globe size={20}/>} color="emerald" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Result Pipeline - Where results from teachers appear */}
                <section className="xl:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-left">
                    <h3 className="text-[#002147] font-black uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-3">
                      <div className="p-2 bg-red-50 rounded-lg text-red-600"><UploadCloud size={20}/></div> Result Verification Pipeline
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {incomingResults.length === 0 ? (
                          <p className="text-[10px] uppercase font-bold text-slate-400 col-span-2">No results submitted by staff yet.</p>
                        ) : incomingResults.map((result) => (
                          <div key={result.id} className="p-6 bg-slate-50 rounded-[35px] border border-transparent hover:bg-white hover:shadow-xl transition-all group relative overflow-hidden">
                              <div className="flex justify-between items-start mb-4 relative z-10">
                                  <span className="text-[9px] font-black text-white bg-[#001529] px-3 py-1 rounded-full uppercase italic tracking-tighter">{result.courseCode || "General"}</span>
                                  <div className="flex gap-2">
                                    <button onClick={() => window.print()} className="text-slate-400 hover:text-blue-600"><Printer size={16}/></button>
                                  </div>
                              </div>
                              
                              <div className="relative z-10">
                                <h4 className="text-sm font-black text-[#002147] uppercase mb-1">{result.studentName || "Term Result"}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest">
                                  Score: <span className="text-red-600 font-black">{result.score}</span> | Grade: <span className="text-emerald-600">{result.grade}</span>
                                </p>
                              </div>

                              {/* Pipeline Logic Buttons */}
                              <div className="relative z-10">
                                {!result.rectorStatus ? (
                                    <button 
                                      onClick={() => requestRectorApproval(result.id)} 
                                      disabled={loadingId === result.id}
                                      className="w-full py-4 bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                                    >
                                      {loadingId === result.id ? <Loader2 size={16} className="animate-spin"/> : <ShieldCheck size={16}/>} 
                                      Send to Rector for Approval
                                    </button>
                                ) : result.rectorStatus === "Pending Approval" ? (
                                    <div className="w-full py-4 bg-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 italic">
                                        <Clock size={16} className="animate-pulse"/> Waiting for Rector...
                                    </div>
                                ) : result.rectorStatus === "Approved" && result.status !== "Published" ? (
                                    <button 
                                      onClick={() => handlePublishResult(result.id)} 
                                      disabled={loadingId === result.id}
                                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-emerald-700 animate-pulse transition-all shadow-lg shadow-emerald-600/20"
                                    >
                                      {loadingId === result.id ? <Loader2 size={16} className="animate-spin"/> : <Globe size={16}/>}
                                      Publish to Student Portal
                                    </button>
                                ) : (
                                    <div className="w-full py-4 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                                        <CheckCircle size={16}/> Successfully Published
                                    </div>
                                )}
                              </div>
                          </div>
                        ))}
                    </div>
                </section>

                {/* Admission Account Sync */}
                <section className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-left">
                    <h3 className="text-[#002147] font-black uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Key size={18} /></div> Admission Sync
                    </h3>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {approvedAdmissions.filter(s => !s.accountCreated).length === 0 ? (
                          <p className="text-[10px] font-bold text-slate-400 uppercase">No pending portal activations.</p>
                        ) : approvedAdmissions.filter(s => !s.accountCreated).map((student) => (
                            <div key={student.id} className="p-5 bg-slate-50 rounded-[25px] flex items-center justify-between border border-transparent hover:border-amber-200 transition-all">
                                <div>
                                  <p className="text-[11px] font-black text-[#002147] uppercase leading-none mb-1">{student.name}</p>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">{student.email}</p>
                                </div>
                                <button onClick={() => generateStudentAccount(student)} className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all active:scale-90">
                                  {loadingId === student.id ? <Loader2 size={16} className="animate-spin"/> : <UserCheck size={18} />}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
          </>
        )}

        {activeTab === "Student Sync" && (
            <section className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100 animate-in fade-in duration-500">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
                            <th className="pb-6">Student Information</th>
                            <th className="pb-6">Admission No</th>
                            <th className="pb-6">Contact</th>
                            <th className="pb-6 text-right">Database Control</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {allStudents.filter(s => s.fullName?.toLowerCase().includes(searchTerm.toLowerCase())).map((std) => (
                            <tr key={std.id} className="group hover:bg-slate-50/50 transition-all">
                                <td className="py-6">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-[#002147] italic uppercase">{std.fullName?.charAt(0)}</div>
                                    <span className="text-[12px] font-black text-[#002147] uppercase">{std.fullName}</span>
                                  </div>
                                </td>
                                <td className="py-6 text-[10px] font-bold text-blue-600 uppercase tracking-widest">{std.admissionNo}</td>
                                <td className="py-6 text-[10px] font-bold text-slate-400">{std.email}</td>
                                <td className="py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                      <button className="text-slate-400 hover:text-blue-600 p-2"><Edit3 size={16}/></button>
                                      <button onClick={() => { if(window.confirm("Delete record permanently?")) deleteDoc(doc(db, "users", std.id)) }} className="text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        )}

        {/* ADD STUDENT MODAL */}
        {showAddStudent && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl relative animate-in zoom-in duration-300">
                    <button onClick={() => setShowAddStudent(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"><X size={24}/></button>
                    <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                      <Plus size={30} />
                    </div>
                    <h2 className="text-xl font-black text-[#002147] uppercase mb-2">New Enrollment</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Manually provision student credentials</p>
                    
                    <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        const data = new FormData(e.target);
                        generateStudentAccount(Object.fromEntries(data));
                    }}>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Full Legal Name</label>
                          <input name="name" placeholder="John Doe" className="w-full p-5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-red-600/20 font-bold text-sm" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Email Address</label>
                          <input name="email" type="email" placeholder="student@college.com" className="w-full p-5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-red-600/20 font-bold text-sm" required />
                        </div>
                        <button type="submit" disabled={loadingId === "new"} className="w-full py-5 bg-[#001529] text-white rounded-[25px] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-xl shadow-red-600/10">
                            {loadingId === "new" ? <Loader2 className="animate-spin" size={18}/> : "Activate Student Access"}
                        </button>
                    </form>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

// COMPONENT: NAV ITEM
const NavItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 group ${active ? "bg-red-600 text-white shadow-xl translate-x-2" : "hover:bg-white/5 text-slate-500 hover:text-white"}`}>
    <span className={`${active ? "text-white" : "group-hover:text-red-500"}`}>{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

// COMPONENT: STATS CARD
const StatsCard = ({ title, value, icon, color }) => {
    const colors = { 
      blue: "bg-blue-50 text-blue-600", 
      amber: "bg-amber-50 text-amber-600", 
      red: "bg-red-50 text-red-600", 
      emerald: "bg-emerald-50 text-emerald-600" 
    };
    return (
        <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-xl transition-all">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
              <h4 className="text-3xl font-black text-[#002147] tracking-tighter leading-none">{value}</h4>
            </div>
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${colors[color]}`}>{icon}</div>
        </div>
    );
};

export default ExamOfficerDashboard;