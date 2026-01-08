import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import { db, auth } from "../firebase";
import { doc, setDoc, serverTimestamp, collection, onSnapshot, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { 
  LayoutDashboard, UploadCloud, Users, FileCheck, 
  Settings, LogOut, Bell, Search, Clock, CheckCircle, FileText, X,
  Key, ShieldCheck, Loader2, Send, ChevronRight, BookOpen, AlertCircle, UserCheck, Trash2, Edit3, Plus
} from "lucide-react";

const ExamOfficerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview"); 

  // --- ALL STATES PRESERVED ---
  const [incomingResults, setIncomingResults] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [allStudents, setAllStudents] = useState([]); 
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modals/Forms State
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingResult, setEditingResult] = useState(null);

  // --- 1. FETCH STAFF & THEIR COURSES (PRESERVED) ---
  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "staff"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const staff = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStaffList(staff);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. FETCH PENDING ADMISSIONS (PRESERVED) ---
  useEffect(() => {
    const q = query(collection(db, "admissions"), where("status", "==", "Approved"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApprovedStudents(apps);
    });
    return () => unsubscribe();
  }, []);

  // --- 3. FETCH ALL REGISTERED STUDENTS (PRESERVED) ---
  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllStudents(students);
    });
    return () => unsubscribe();
  }, []);

  // --- 4. FETCH RESULTS (PRESERVED & REAL-TIME) ---
  useEffect(() => {
    const q = collection(db, "results");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const res = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIncomingResults(res);
    });
    return () => unsubscribe();
  }, []);

  // --- HANDLERS (MAINTAINING ALL LOGIC) ---
  const handleApproveResult = async (id) => {
    try {
      await updateDoc(doc(db, "results", id), { 
        status: "Published",
        publishedAt: serverTimestamp() 
      });
      alert("Result Published to Student Dashboard!");
    } catch (e) { alert(e.message); }
  };

  const handleDeleteStudent = async (id) => {
    if(window.confirm("Are you sure? This will remove the student permanently.")){
      try {
        await deleteDoc(doc(db, "users", id));
        alert("Student Deleted.");
      } catch (e) { alert(e.message); }
    }
  };

  const generateStudentAccount = async (student) => {
    setLoadingId(student.id || "new");
    const initialPassword = "Welcome@GTI2026"; 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, student.email, initialPassword);
      const uid = userCredential.user.uid;
      
      await setDoc(doc(db, "users", uid), {
        uid: uid,
        fullName: student.name || student.fullName,
        email: student.email,
        admissionNo: student.admissionNo,
        course: student.course,
        role: "student",
        isFirstLogin: true, 
        status: "Active",
        createdAt: serverTimestamp()
      });

      if(student.id) await updateDoc(doc(db, "admissions", student.id), { accountCreated: true });
      alert(`Portal Account Created. Password: ${initialPassword}`);
    } catch (error) { alert("Error: " + error.message); } 
    finally { setLoadingId(null); setShowAddStudent(false); }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] font-sans text-left text-slate-900">
      
      {/* SIDEBAR (PRESERVED) */}
      <aside className="w-full md:w-72 bg-[#001529] text-white flex flex-col md:sticky md:top-0 md:h-screen shadow-2xl z-50">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg"><ShieldCheck size={20} /></div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">Skyward</h2>
          </div>
          <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em] ml-1">Examination Office</p>
        </div>
        
        <nav className="flex-grow p-6 space-y-3 mt-4">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Overview" active={activeTab === "Overview"} onClick={() => setActiveTab("Overview")} />
          <NavItem icon={<BookOpen size={18}/>} label="Staff & Courses" active={activeTab === "Staff & Courses"} onClick={() => setActiveTab("Staff & Courses")} />
          <NavItem icon={<Users size={18}/>} label="Student Sync" active={activeTab === "Student Sync"} onClick={() => setActiveTab("Student Sync")} />
          <NavItem icon={<FileCheck size={18}/>} label="Transcripts" active={activeTab === "Transcripts"} onClick={() => setActiveTab("Transcripts")} />
        </nav>

        <div className="p-6">
          <button onClick={() => navigate("/portal/login")} className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em]">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-6 md:p-12">
        <header className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search Database..." className="pl-14 pr-6 py-4 w-full bg-slate-50 rounded-2xl outline-none text-[12px] font-bold border border-transparent focus:bg-white focus:border-red-600/20 transition-all" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setShowAddStudent(true)} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg">
               <Plus size={18}/> Add Student
             </button>
             <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg">EX</div>
          </div>
        </header>

        {activeTab === "Overview" && (
          <>
            {/* STATS CARDS (PRESERVED) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
              <StatsCard title="Total Staff" value={staffList.length} icon={<Users size={20}/>} color="blue" />
              <StatsCard title="Total Students" value={allStudents.length} icon={<Users size={20}/>} color="amber" />
              <StatsCard title="Pending Sync" value={approvedStudents.filter(s => !s.accountCreated).length} icon={<Clock size={20}/>} color="red" />
              <StatsCard title="Results Feed" value={incomingResults.length} icon={<FileText size={20}/>} color="emerald" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* 1. STAFF DIRECTORY (MAINTAINED FROM ORIGINAL) */}
                <section className="xl:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                    <h3 className="text-[#002147] font-black uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-3">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Users size={18}/></div> Staff Course Assignment
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {staffList.map((staff) => (
                            <div key={staff.id} className="p-5 bg-slate-50 rounded-[25px] border border-transparent hover:border-blue-100 transition-all flex items-center gap-4">
                                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 font-black italic">
                                    {staff.fullName?.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-[12px] font-black text-[#002147] uppercase">{staff.fullName}</h4>
                                    <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">{staff.course || "General Studies"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. ADMISSION SYNC (MAINTAINED FROM ORIGINAL) */}
                <section className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                    <h3 className="text-[#002147] font-black uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-3">
                        <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><Key size={18} /></div> Admission Sync
                    </h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {approvedStudents.filter(s => !s.accountCreated).map((student) => (
                            <div key={student.id} className="p-5 bg-slate-50 rounded-[25px] flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] font-black text-[#002147] uppercase">{student.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">{student.course}</p>
                                </div>
                                <button onClick={() => generateStudentAccount(student)} className="h-10 w-10 flex items-center justify-center bg-white text-[#002147] rounded-xl border border-slate-200 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                                    {loadingId === student.id ? <Loader2 size={16} className="animate-spin"/> : <UserCheck size={18} />}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* 3. RESULTS PIPELINE (PRESERVED) */}
            <section className="mt-10 bg-white p-10 rounded-[45px] shadow-sm border border-slate-100">
                <h3 className="text-[#002147] font-black uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><FileText size={20}/></div> Verification Pipeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {incomingResults.map((result) => (
                        <div key={result.id} className="p-6 bg-slate-50 rounded-[35px] border border-transparent hover:bg-white hover:border-slate-100 shadow-sm transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase italic">{result.courseCode}</span>
                                <button onClick={() => setEditingResult(result)} className="text-blue-500"><Edit3 size={14}/></button>
                            </div>
                            <h4 className="text-sm font-black text-[#002147] uppercase mb-1">{result.courseName || "Semester Results"}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest">Score: {result.score} | Grade: {result.grade}</p>
                            
                            {result.status === "Published" ? (
                                <div className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                                    <CheckCircle size={16}/> Published
                                </div>
                            ) : (
                                <button onClick={() => handleApproveResult(result.id)} className="w-full py-4 bg-[#001529] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                                    <Send size={16}/> Push to Portal
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>
          </>
        )}

        {/* --- STUDENT DIRECTORY TAB (ADDED) --- */}
        {activeTab === "Student Sync" && (
            <section className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
                                <th className="pb-6">Student Name</th>
                                <th className="pb-6">ID Number</th>
                                <th className="pb-6">Course</th>
                                <th className="pb-6 text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {allStudents.map((std) => (
                                <tr key={std.id} className="group hover:bg-slate-50 transition-all">
                                    <td className="py-6 text-[12px] font-black text-[#002147] uppercase">{std.fullName}</td>
                                    <td className="py-6 text-[11px] font-bold text-slate-500">{std.admissionNo}</td>
                                    <td className="py-6 text-[10px] font-bold text-slate-400 uppercase">{std.course}</td>
                                    <td className="py-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => handleDeleteStudent(std.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        )}

        {/* PLACEHOLDERS */}
        {activeTab === "Staff & Courses" && <div className="p-20 text-center font-black text-slate-300 uppercase italic">Loading Course Map...</div>}
        {activeTab === "Transcripts" && <div className="p-20 text-center font-black text-slate-300 uppercase italic">Transcript Module Ready.</div>}

        {/* MODAL FOR ADDING STUDENT (PRESERVED) */}
        {showAddStudent && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black text-[#002147] uppercase italic">Add Student</h2>
                        <button onClick={() => setShowAddStudent(false)} className="text-slate-400"><X size={24}/></button>
                    </div>
                    <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        const data = new FormData(e.target);
                        generateStudentAccount(Object.fromEntries(data));
                    }}>
                        <input name="name" placeholder="Full Name" className="w-full p-5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-red-600/20" required />
                        <input name="email" type="email" placeholder="Email" className="w-full p-5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-red-600/20" required />
                        <input name="admissionNo" placeholder="Admission No" className="w-full p-5 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-red-600/20" required />
                        <button type="submit" disabled={loadingId === "new"} className="w-full py-5 bg-[#002147] text-white rounded-[25px] font-black uppercase text-[11px] flex items-center justify-center gap-2">
                            {loadingId === "new" ? <Loader2 className="animate-spin" size={18}/> : "Register & Create Account"}
                        </button>
                    </form>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

// Reusable Components (PRESERVED)
const NavItem = ({ icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 group ${active ? "bg-red-600 text-white shadow-xl translate-x-2" : "hover:bg-white/5 text-slate-500 hover:text-white"}`}>
    <span className={`${active ? "text-white" : "group-hover:text-red-500"}`}>{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

const StatsCard = ({ title, value, icon, color }) => {
    const colors = { blue: "bg-blue-50 text-blue-600", amber: "bg-amber-50 text-amber-600", red: "bg-red-50 text-red-600", emerald: "bg-emerald-50 text-emerald-600" };
    return (
        <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-xl transition-all">
            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p><h4 className="text-3xl font-black text-[#002147] tracking-tighter">{value}</h4></div>
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${colors[color]}`}>{icon}</div>
        </div>
    );
};

export default ExamOfficerDashboard;