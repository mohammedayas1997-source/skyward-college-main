import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import { db, auth } from "../firebase";
import { doc, setDoc, serverTimestamp, collection, onSnapshot, query, where, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { 
  LayoutDashboard, UploadCloud, Users, FileCheck, 
  Settings, LogOut, Bell, Search, Clock, CheckCircle, FileText, X,
  Key, ShieldCheck, Loader2, Send, ChevronRight, BookOpen, AlertCircle, UserCheck, Trash2, Edit3, Plus, Printer, Lock, Globe
} from "lucide-react";

const ExamOfficerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview"); 

  // --- ALL STATES PRESERVED & ENHANCED ---
  const [incomingResults, setIncomingResults] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [allStudents, setAllStudents] = useState([]); 
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  // --- 1. FETCH STAFF & THEIR COURSES ---
  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "staff"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const staff = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStaffList(staff);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. FETCH PENDING ADMISSIONS ---
  useEffect(() => {
    const q = query(collection(db, "admissions"), where("status", "==", "Approved"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApprovedStudents(apps);
    });
    return () => unsubscribe();
  }, []);

  // --- 3. FETCH ALL REGISTERED STUDENTS ---
  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllStudents(students);
    });
    return () => unsubscribe();
  }, []);

  // --- 4. REAL-TIME RESULTS FROM LECTURERS ---
  useEffect(() => {
    const q = collection(db, "results");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const res = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIncomingResults(res);
    });
    return () => unsubscribe();
  }, []);

  // --- NEW FUNCTIONS ---

  // Aika bukata zuwa Rector
  const requestRectorApproval = async (id) => {
    try {
      await updateDoc(doc(db, "results", id), { rectorStatus: "Pending Approval" });
      alert("Approval request sent to Rector!");
    } catch (e) { alert(e.message); }
  };

  // Tura result ga dalibi (Bayan Rector ya amince)
  const publishToStudentPortal = async (id) => {
    try {
      await updateDoc(doc(db, "results", id), { 
        status: "Published", 
        publishedDate: serverTimestamp() 
      });
      alert("Result is now live on Student Dashboard!");
    } catch (e) { alert(e.message); }
  };

  // Printing logic
  const handlePrintResult = (result) => {
    const printContent = `Result: ${result.courseName} - ${result.score}% (${result.grade})`;
    window.print();
  };

  const generateStudentAccount = async (student) => {
    setLoadingId(student.id || "new");
    const initialPassword = "Welcome@GTI2026"; 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, student.email, initialPassword);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), {
        uid: uid, fullName: student.name || student.fullName, email: student.email,
        admissionNo: student.admissionNo, course: student.course, role: "student",
        isFirstLogin: true, status: "Active", createdAt: serverTimestamp()
      });
      if(student.id) await updateDoc(doc(db, "admissions", student.id), { accountCreated: true });
      alert("Account Created!");
    } catch (error) { alert(error.message); } 
    finally { setLoadingId(null); setShowAddStudent(false); }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] font-sans text-left text-slate-900">
      
      {/* SIDEBAR */}
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
          <NavItem icon={<FileCheck size={18}/>} label="Results Lab" active={activeTab === "Results"} onClick={() => setActiveTab("Results")} />
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
            <input type="text" placeholder="Search Master Database..." className="pl-14 pr-6 py-4 w-full bg-slate-50 rounded-2xl outline-none text-[12px] font-bold border border-transparent focus:bg-white focus:border-red-600/20 transition-all" />
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setShowAddStudent(true)} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg">
               <Plus size={18}/> New Student
             </button>
             <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg">EX</div>
          </div>
        </header>

        {activeTab === "Overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
              <StatsCard title="Total Staff" value={staffList.length} icon={<Users size={20}/>} color="blue" />
              <StatsCard title="Students" value={allStudents.length} icon={<Users size={20}/>} color="amber" />
              <StatsCard title="Pending Rector" value={incomingResults.filter(r => r.rectorStatus === "Pending Approval").length} icon={<Lock size={20}/>} color="red" />
              <StatsCard title="Live Results" value={incomingResults.filter(r => r.status === "Published").length} icon={<Globe size={20}/>} color="emerald" />
            </div>

            <section className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100">
                <h3 className="text-[#002147] font-black uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><UploadCloud size={20}/></div> Lecturer Submission Pipeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {incomingResults.map((result) => (
                        <div key={result.id} className="p-8 bg-slate-50 rounded-[40px] border-2 border-transparent hover:border-emerald-100 hover:bg-white transition-all shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase">{result.courseCode}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handlePrintResult(result)} className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-500"><Printer size={16}/></button>
                                    <button onClick={() => setEditingResult(result)} className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-500"><Edit3 size={16}/></button>
                                </div>
                            </div>
                            
                            <h4 className="text-md font-black text-[#002147] uppercase leading-tight mb-2">{result.studentName}</h4>
                            <div className="flex justify-between items-center mb-8">
                                <p className="text-2xl font-black text-emerald-600">{result.score}%</p>
                                <p className="text-xs font-black text-slate-400 italic">Grade: {result.grade}</p>
                            </div>

                            {/* LOGIC FOR APPROVAL FLOW */}
                            {!result.rectorStatus ? (
                                <button onClick={() => requestRectorApproval(result.id)} className="w-full py-4 bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-orange-600 transition-all">
                                    <ShieldCheck size={16}/> Request Rector Approval
                                </button>
                            ) : result.rectorStatus === "Pending Approval" ? (
                                <div className="w-full py-4 bg-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 italic">
                                    <Clock size={16}/> Waiting for Rector...
                                </div>
                            ) : result.rectorStatus === "Approved" && result.status !== "Published" ? (
                                <button onClick={() => publishToStudentPortal(result.id)} className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg animate-pulse">
                                    <Globe size={16}/> Publish to Student
                                </button>
                            ) : (
                                <div className="w-full py-4 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                                    <CheckCircle size={16}/> Published Successfully
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
          </>
        )}

        {/* --- STUDENT DIRECTORY TAB --- */}
        {activeTab === "Student Sync" && (
            <div className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="font-black uppercase text-xs tracking-widest text-[#002147]">Master Student List</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allStudents.map(s => (
                        <div key={s.id} className="p-6 bg-slate-50 rounded-3xl flex justify-between items-center group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-white text-[#002147] rounded-2xl flex items-center justify-center font-black italic shadow-sm">{s.fullName.charAt(0)}</div>
                                <div>
                                    <p className="text-xs font-black text-[#002147] uppercase">{s.fullName}</p>
                                    <p className="text-[10px] font-bold text-slate-400">{s.admissionNo}</p>
                                </div>
                            </div>
                            <button onClick={() => deleteDoc(doc(db, "users", s.id))} className="p-3 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </main>

      {/* MODAL FOR ADDING STUDENT */}
      {showAddStudent && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
              <div className="bg-white w-full max-w-md rounded-[45px] p-10 shadow-2xl relative">
                  <button onClick={() => setShowAddStudent(false)} className="absolute right-8 top-8 text-slate-400"><X size={24}/></button>
                  <h2 className="text-xl font-black text-[#002147] uppercase italic mb-8">Manual Registration</h2>
                  <form className="space-y-4" onSubmit={(e) => {
                      e.preventDefault();
                      const data = new FormData(e.target);
                      generateStudentAccount(Object.fromEntries(data));
                  }}>
                      <input name="name" placeholder="Full Student Name" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-red-500/20" required />
                      <input name="email" type="email" placeholder="Student Email Address" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-red-500/20" required />
                      <input name="admissionNo" placeholder="Admission Number" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-red-500/20" required />
                      <input name="course" placeholder="Assigned Course" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-red-500/20" required />
                      <button type="submit" className="w-full py-5 bg-[#002147] text-white rounded-[25px] font-black uppercase text-[11px] tracking-[0.2em] shadow-lg">Activate Portal Access</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

// NavItem & StatsCard stay the same
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