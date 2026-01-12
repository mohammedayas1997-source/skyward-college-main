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
  Printer, Lock, Globe, AlertCircle, ChevronRight, SendHorizontal, Save
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
  
  // States na Editing
  const [editingResult, setEditingResult] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  // --- SECURITY & DATA FETCHING ---
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/portal/login");
    });

    const qStaff = query(collection(db, "users"), where("role", "==", "staff"));
    const unsubStaff = onSnapshot(qStaff, (s) => setStaffList(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    
    const qAdmissions = query(collection(db, "admissions"), where("status", "==", "Approved"));
    const unsubAdmissions = onSnapshot(qAdmissions, (s) => setApprovedAdmissions(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qStudents = query(collection(db, "users"), where("role", "==", "student"));
    const unsubStudents = onSnapshot(qStudents, (s) => setAllStudents(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const unsubResults = onSnapshot(collection(db, "results"), (s) => {
      setIncomingResults(s.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { 
      unsubAuth(); unsubStaff(); unsubAdmissions(); unsubStudents(); unsubResults(); 
    };
  }, [navigate]);

  // --- HANDLERS ---

  // 1. Update Result Logic
  const handleUpdateResult = async (e) => {
    e.preventDefault();
    setLoadingId(editingResult.id);
    try {
      await updateDoc(doc(db, "results", editingResult.id), {
        score: editingResult.score,
        grade: editingResult.grade,
        lastUpdated: serverTimestamp()
      });
      alert("Result Updated Successfully!");
      setEditingResult(null);
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  // 2. Update Student Logic
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setLoadingId(editingStudent.id);
    try {
      await updateDoc(doc(db, "users", editingStudent.id), {
        fullName: editingStudent.fullName,
        admissionNo: editingStudent.admissionNo,
        course: editingStudent.course
      });
      alert("Student Profile Updated!");
      setEditingStudent(null);
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  // 3. New Enrollment (Modified: ID Number & Course)
  const generateStudentAccount = async (studentData) => {
    setLoadingId("new");
    try {
      // Note: Firebase Auth still requires email. We use ID@skyward.com as a placeholder if email isn't provided
      const studentEmail = studentData.email || `${studentData.idNumber}@skyward.com`;
      const userCred = await createUserWithEmailAndPassword(auth, studentEmail, "Student@2026");
      
      await setDoc(doc(db, "users", userCred.user.uid), {
        uid: userCred.user.uid, 
        fullName: studentData.name, 
        email: studentEmail,
        admissionNo: studentData.idNumber,
        course: studentData.course,
        role: "student", 
        isFirstLogin: true,
        createdAt: serverTimestamp()
      });
      
      alert("New Student Enrolled Successfully!");
      setShowAddStudent(false);
    } catch (error) { alert(error.message); } 
    finally { setLoadingId(null); }
  };

  // --- ORIGINAL HANDLERS (PRESERVED) ---
  const requestRectorApproval = async (id) => {
    setLoadingId(id);
    try {
      await updateDoc(doc(db, "results", id), { 
        rectorStatus: "Pending Approval",
        officerVerified: true,
        lastUpdated: serverTimestamp() 
      });
      alert("Sent to Rector's Office.");
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  const handlePublishResult = async (id) => {
    setLoadingId(id);
    try {
      await updateDoc(doc(db, "results", id), { 
        status: "Published", 
        publishedAt: serverTimestamp(),
        visibility: "public"
      });
      alert("Result is now LIVE.");
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  const handleDirectRelease = async (result) => {
    const confirmRelease = window.confirm(`Release ${result.studentName}'s result directly?`);
    if(!confirmRelease) return;
    setLoadingId(result.id);
    try {
      await updateDoc(doc(db, "results", result.id), { 
        status: "Published",
        rectorStatus: "Bypassed/Direct",
        publishedAt: serverTimestamp(),
        visibility: "public",
        officerVerified: true
      });
      alert(`SUCCESS: Result released.`);
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
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
              placeholder="Search Records..." 
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
                {/* Result Pipeline */}
                <section className="xl:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-left">
                    <h3 className="text-[#002147] font-black uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-3">
                      <div className="p-2 bg-red-50 rounded-lg text-red-600"><UploadCloud size={20}/></div> Result Verification Pipeline
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {incomingResults.length === 0 ? (
                          <p className="text-[10px] uppercase font-bold text-slate-400 col-span-2">No results submitted yet.</p>
                        ) : incomingResults.map((result) => (
                          <div key={result.id} className="p-6 bg-slate-50 rounded-[35px] border border-transparent hover:bg-white hover:shadow-xl transition-all group relative overflow-hidden">
                              <div className="flex justify-between items-start mb-4 relative z-10">
                                  <span className="text-[9px] font-black text-white bg-[#001529] px-3 py-1 rounded-full uppercase italic tracking-tighter">{result.courseCode || "General"}</span>
                                  <div className="flex gap-2">
                                    <button onClick={() => setEditingResult(result)} className="text-slate-400 hover:text-blue-600"><Edit3 size={16}/></button>
                                    <button onClick={() => window.print()} className="text-slate-400 hover:text-slate-600"><Printer size={16}/></button>
                                  </div>
                              </div>
                              
                              <div className="relative z-10">
                                <h4 className="text-sm font-black text-[#002147] uppercase mb-1">{result.studentName}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest">
                                  Score: <span className="text-red-600 font-black">{result.score}</span> | Grade: <span className="text-emerald-600">{result.grade}</span>
                                </p>
                              </div>

                              <div className="relative z-10 flex flex-col gap-2">
                                {!result.rectorStatus ? (
                                    <>
                                      <button onClick={() => requestRectorApproval(result.id)} className="w-full py-4 bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 shadow-lg hover:bg-orange-600">
                                        <ShieldCheck size={16}/> Rector's Approval
                                      </button>
                                      <button onClick={() => handleDirectRelease(result)} className="w-full py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:border-emerald-500 hover:text-emerald-600 transition-all">
                                        <SendHorizontal size={14}/> Quick Release
                                      </button>
                                    </>
                                ) : result.rectorStatus === "Pending Approval" ? (
                                    <div className="w-full py-4 bg-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 italic">
                                        <Clock size={16} className="animate-pulse"/> Waiting for Rector...
                                    </div>
                                ) : result.rectorStatus === "Approved" && result.status !== "Published" ? (
                                    <button onClick={() => handlePublishResult(result.id)} className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-emerald-700 animate-pulse transition-all shadow-lg">
                                      <Globe size={16}/> Publish to Student Portal
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

                {/* Admission Account Sync (PRESERVED) */}
                <section className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-left">
                    <h3 className="text-[#002147] font-black uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Key size={18} /></div> Admission Sync
                    </h3>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {approvedAdmissions.filter(s => !s.accountCreated).map((student) => (
                            <div key={student.id} className="p-5 bg-slate-50 rounded-[25px] flex items-center justify-between border border-transparent hover:border-amber-200 transition-all">
                                <div>
                                  <p className="text-[11px] font-black text-[#002147] uppercase leading-none mb-1">{student.name}</p>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">{student.email}</p>
                                </div>
                                <button onClick={() => generateStudentAccount({name: student.name, email: student.email, idNumber: student.admissionNo, course: student.course})} className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                                  <UserCheck size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
          </>
        )}

        {activeTab === "Student Sync" && (
            <section className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100 animate-in fade-in duration-500 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
                            <th className="pb-6">Student Information</th>
                            <th className="pb-6">ID Number</th>
                            <th className="pb-6">Course</th>
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
                                <td className="py-6 text-[10px] font-bold text-slate-500 uppercase">{std.course || "N/A"}</td>
                                <td className="py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                      <button onClick={() => setEditingStudent(std)} className="text-slate-400 hover:text-blue-600 p-2"><Edit3 size={16}/></button>
                                      <button onClick={async () => { if(window.confirm("Delete record permanently?")) await deleteDoc(doc(db, "users", std.id)) }} className="text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </section>
        )}

        {/* MODAL: NEW ENROLLMENT (Modified with ID & Course) */}
        {showAddStudent && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl relative animate-in zoom-in duration-300">
                    <button onClick={() => setShowAddStudent(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500"><X size={24}/></button>
                    <h2 className="text-xl font-black text-[#002147] uppercase mb-8">New Student Enrollment</h2>
                    <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        const data = new FormData(e.target);
                        generateStudentAccount(Object.fromEntries(data));
                    }}>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                          <input name="name" placeholder="Ahmad Musa" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none text-sm font-bold" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-1">ID Number (Admission No)</label>
                          <input name="idNumber" placeholder="GTI/2026/123" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none text-sm font-bold" required />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Assigned Course</label>
                          <select name="course" className="w-full p-4 bg-slate-50 rounded-2xl border outline-none text-sm font-bold" required>
                             <option value="">Select Course</option>
                             <option value="Aviation Management">Aviation Management</option>
                             <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                             <option value="Travel Agency Operations">Travel Agency Operations</option>
                          </select>
                        </div>
                        <button type="submit" disabled={loadingId === "new"} className="w-full py-5 bg-[#001529] text-white rounded-[25px] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all">
                            {loadingId === "new" ? <Loader2 className="animate-spin" size={18}/> : "Provision Student Portal"}
                        </button>
                    </form>
                </div>
            </div>
        )}

        {/* MODAL: EDIT RESULT */}
        {editingResult && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl relative">
                    <button onClick={() => setEditingResult(null)} className="absolute top-6 right-6 text-slate-400"><X size={20}/></button>
                    <h3 className="text-lg font-black text-[#002147] uppercase mb-6">Modify Result</h3>
                    <form onSubmit={handleUpdateResult} className="space-y-4">
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400">Student: {editingResult.studentName}</label>
                            <input type="number" value={editingResult.score} onChange={(e) => setEditingResult({...editingResult, score: e.target.value})} className="w-full p-4 mt-2 bg-slate-50 rounded-2xl border font-bold" placeholder="New Score" />
                        </div>
                        <div>
                            <input type="text" value={editingResult.grade} onChange={(e) => setEditingResult({...editingResult, grade: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" placeholder="New Grade (e.g A, B)" />
                        </div>
                        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2">
                            <Save size={18}/> Save Changes
                        </button>
                    </form>
                </div>
            </div>
        )}

        {/* MODAL: EDIT STUDENT */}
        {editingStudent && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl relative">
                    <button onClick={() => setEditingStudent(null)} className="absolute top-6 right-6 text-slate-400"><X size={20}/></button>
                    <h3 className="text-lg font-black text-[#002147] uppercase mb-6">Update Student Profile</h3>
                    <form onSubmit={handleUpdateStudent} className="space-y-4">
                        <input value={editingStudent.fullName} onChange={(e) => setEditingStudent({...editingStudent, fullName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" placeholder="Full Name" />
                        <input value={editingStudent.admissionNo} onChange={(e) => setEditingStudent({...editingStudent, admissionNo: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" placeholder="Admission No" />
                        <input value={editingStudent.course} onChange={(e) => setEditingStudent({...editingStudent, course: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" placeholder="Course" />
                        <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2">
                            <Save size={18}/> Update Database
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