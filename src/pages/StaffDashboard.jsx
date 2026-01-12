import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; 
import { signOut } from "firebase/auth"; 
import { useNavigate } from "react-router-dom"; 
import { 
  collection, addDoc, onSnapshot, query, where, 
  updateDoc, doc, serverTimestamp, orderBy, writeBatch, deleteDoc 
} from "firebase/firestore";
import { 
  LayoutDashboard, FileEdit, History, Search, User, LogOut, 
  Printer, Save, BookText, ClipboardList, Target, Presentation, 
  FileSearch, Users, Inbox, Clock, Database, UserCheck, 
  FileCheck2, ChevronRight, UserPlus, SendHorizonal, BookOpen, Trash2, Check, Plus, Loader2
} from "lucide-react";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLocked] = useState(false);
  
  // --- AN GYARA NAN: Sabbin Courses dinka sun dawo ---
  const [staffCourse, setStaffCourse] = useState(localStorage.getItem("selectedCourse") || "Air Cabin Crew Management");
  
  const [availableCourses, setAvailableCourses] = useState([
    "Air Cabin Crew Management",
    "Flight Dispatcher",
    "Travel and Tourism Management",
    "Hotel and Hospitality Management",
    "Cargo & Freight Handling",
    "Catering and Craft Practice",
    "Airport Operations and Safety",
    "Visa Processing",
    "Travel Agency Management",
    "Customer Service Management"
  ]);
  // --- END GYARA ---

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [incomingStudents, setIncomingStudents] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  
  const [manualStudent, setManualStudent] = useState({ name: "", reg: "" });
  const [newPlan, setNewPlan] = useState({
    subject: "", topic: "", objectives: "", content: "", evaluation: ""
  });

  const handleLogout = async () => {
    try { await signOut(auth); navigate("/"); } catch (err) { alert("Error: " + err.message); }
  };

  const handleCourseChange = (e) => {
    const newCourse = e.target.value;
    setStaffCourse(newCourse);
    localStorage.setItem("selectedCourse", newCourse);
  };

  const addNewCourse = () => {
    if (!newCourseName) return;
    setAvailableCourses([...availableCourses, newCourseName]);
    setNewCourseName("");
    setShowAddCourse(false);
  };

  useEffect(() => {
    const qStudents = query(
      collection(db, "admissions"), 
      where("course", "==", staffCourse), 
      where("status", "==", "Approved") 
    );
    const unsubStudents = onSnapshot(qStudents, (snap) => {
      setIncomingStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qResults = query(collection(db, "studentResults"), where("course", "==", staffCourse));
    const unsubResults = onSnapshot(qResults, (snap) => {
      setStudentResults(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qPlans = query(collection(db, "lessonPlans"), where("course", "==", staffCourse), orderBy("createdAt", "desc"));
    const unsubPlans = onSnapshot(qPlans, (snap) => {
      setLessonPlans(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => {
        const qFallback = query(collection(db, "lessonPlans"), where("course", "==", staffCourse));
        onSnapshot(qFallback, (s) => setLessonPlans(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    });

    return () => { unsubStudents(); unsubResults(); unsubPlans(); };
  }, [staffCourse]);

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to PERMANENTLY delete this student?")) {
      try { await deleteDoc(doc(db, "studentResults", id)); } catch (err) { alert("Error deleting: " + err.message); }
    }
  };

  const handleUpdateStudentInfo = async (id, newName, newReg) => {
    try {
      await updateDoc(doc(db, "studentResults", id), { name: newName, reg: newReg });
      setEditingId(null);
    } catch (err) { alert("Error updating: " + err.message); }
  };

  const submitToExamOfficer = async () => {
    if (studentResults.length === 0) return alert("No results to submit!");
    if (window.confirm("Submit results to Exam Officer?")) {
      setLoading(true);
      try {
        const batch = writeBatch(db);
        studentResults.forEach((student) => {
          const studentRef = doc(db, "studentResults", student.id);
          batch.update(studentRef, { 
            status: "Submitted", 
            isLocked: true,
            submittedAt: serverTimestamp() 
          });
        });
        await batch.commit();
        alert("Results successfully submitted to Exams Office!");
      } catch (err) { alert(err.message); }
      setLoading(false);
    }
  };

  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!manualStudent.name || !manualStudent.reg) return alert("Fill all fields");
    setLoading(true);
    try {
      await addDoc(collection(db, "studentResults"), {
        ...manualStudent, course: staffCourse, ca: 0, exam: 0, total: 0, grade: "F", status: "Draft", admittedAt: serverTimestamp()
      });
      setManualStudent({ name: "", reg: "" });
      setActiveTab("entry");
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const acceptStudent = async (student) => {
    try {
      await addDoc(collection(db, "studentResults"), {
        name: student.name, 
        reg: student.reg || student.admissionNo || "Pending", 
        course: staffCourse, 
        ca: 0, exam: 0, total: 0, grade: "F", 
        status: "Draft", 
        admittedAt: serverTimestamp()
      });
      await updateDoc(doc(db, "admissions", student.id), { status: "Enrolled" });
      alert(student.name + " accepted into your class!");
    } catch (err) { alert(err.message); }
  };

  const updateScore = async (id, field, value) => {
    const student = studentResults.find(s => s.id === id);
    if (student.status === "Submitted") return;
    const newVal = parseInt(value) || 0;
    const newCa = field === 'ca' ? newVal : student.ca;
    const newExam = field === 'exam' ? newVal : student.exam;
    const newTotal = newCa + newExam;
    const newGrade = newTotal >= 70 ? "A" : newTotal >= 60 ? "B" : newTotal >= 50 ? "C" : "F";
    await updateDoc(doc(db, "studentResults", id), { [field]: newVal, total: newTotal, grade: newGrade });
  };

  const saveLessonPlan = async () => {
    if(!newPlan.subject || !newPlan.topic) return alert("Subject and Topic required!");
    setLoading(true);
    try {
      await addDoc(collection(db, "lessonPlans"), { 
        ...newPlan, 
        staffName: "Dr. Adamu", 
        course: staffCourse, 
        createdAt: serverTimestamp() 
      });
      setNewPlan({ subject: "", topic: "", objectives: "", content: "", evaluation: "" });
      alert("Lesson Plan Saved!");
      setActiveTab("history_plans");
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const NavItem = ({ id, icon: Icon, label, count }) => (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === id ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
      <div className="flex items-center gap-4"><Icon size={18} /> {label}</div>
      {count > 0 && <span className="bg-white text-red-600 px-2 py-0.5 rounded-lg text-[9px] font-black">{count}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-left">
      <aside className="w-full md:w-72 bg-[#002147] text-white p-8 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center font-black italic shadow-lg">S</div>
          <div><h2 className="font-black text-sm uppercase leading-tight">Skyward</h2><p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter">Staff Portal</p></div>
        </div>

        <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
            <label className="text-[8px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Departmental Course</label>
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-red-500"/>
                    <select value={staffCourse} onChange={handleCourseChange} className="bg-transparent text-[11px] font-black outline-none w-full cursor-pointer uppercase">
                        {availableCourses.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
                    </select>
                </div>
                {showAddCourse ? (
                  <div className="flex gap-2 animate-in zoom-in-95">
                    <input autoFocus className="flex-1 bg-white/10 rounded-lg p-2 text-[10px] outline-none" placeholder="New Course..." value={newCourseName} onChange={(e)=>setNewCourseName(e.target.value)} />
                    <button onClick={addNewCourse} className="bg-red-600 p-2 rounded-lg"><Check size={12}/></button>
                  </div>
                ) : (
                  <button onClick={()=>setShowAddCourse(true)} className="text-[8px] font-black uppercase text-red-400 flex items-center gap-1 hover:text-white transition-colors"><Plus size={10}/> Add New Department</button>
                )}
            </div>
        </div>

        <nav className="space-y-2 flex-grow overflow-y-auto custom-scrollbar">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="inbox" icon={Inbox} label="Admission Intake" count={incomingStudents.length} />
          <NavItem id="add_manual" icon={UserPlus} label="Enrollment" />
          <NavItem id="entry" icon={FileEdit} label="Score Records" />
          <NavItem id="lesson_plan" icon={BookText} label="Lesson Planner" />
          <NavItem id="history_plans" icon={FileSearch} label="Plan Archive" />
        </nav>
        
        <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-[11px] uppercase text-red-400 border border-red-500/20 mt-4 active:scale-95 transition-all"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === "dashboard" && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
              <div><h1 className="text-4xl font-black text-[#002147] tracking-tighter uppercase leading-none">Hi, Dr. Adamu</h1><p className="text-slate-400 text-[10px] font-black uppercase mt-3 tracking-[0.3em]">Lecturer: {staffCourse}</p></div>
              <div className="h-16 w-16 bg-slate-50 rounded-3xl flex items-center justify-center text-red-600 border border-slate-100 shadow-inner"><User size={28}/></div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <StatCard icon={Users} label="Total Students" value={studentResults.length} color="blue" />
              <StatCard icon={SendHorizonal} label="Sent to Exams" value={studentResults.filter(s => s.status === "Submitted").length} color="green" />
              <StatCard icon={Clock} label="Pending Grading" value={studentResults.filter(s => s.status !== "Submitted").length} color="red" />
            </div>
          </div>
        )}

        {activeTab === "entry" && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Student Scoring</h1>
                <button onClick={submitToExamOfficer} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 shadow-lg shadow-blue-200 active:scale-95 transition-all">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <SendHorizonal size={16} />} Submit Final Sheet
                </button>
            </div>
            
            <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr><th className="p-8">Student Identity</th><th className="p-8 text-center">CA (40)</th><th className="p-8 text-center">Exam (60)</th><th className="p-8 text-center">Total</th><th className="p-8 text-center">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {studentResults.map((s) => (
                    <tr key={s.id} className={s.status === "Submitted" ? "bg-green-50/20" : "hover:bg-slate-50/50 transition-colors"}>
                      <td className="p-8">
                        {editingId === s.id ? (
                           <div className="space-y-2">
                             <input className="block w-full p-2 bg-white border rounded text-xs font-bold uppercase" value={s.name} onChange={(e) => handleUpdateStudentInfo(s.id, e.target.value, s.reg)} />
                             <input className="block w-full p-2 bg-white border rounded text-[10px]" value={s.reg} onChange={(e) => handleUpdateStudentInfo(s.id, s.name, e.target.value)} />
                             <button onClick={()=>setEditingId(null)} className="text-[9px] font-black text-green-600 uppercase flex items-center gap-1"><Check size={12}/> Confirm Changes</button>
                           </div>
                        ) : (
                          <div className="cursor-pointer group flex items-center gap-4" onClick={() => s.status !== "Submitted" && setEditingId(s.id)}>
                            <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#002147] font-black italic">{s.name.charAt(0)}</div>
                            <div>
                                <p className="font-black text-sm uppercase text-[#002147] group-hover:text-red-600">{s.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold tracking-widest">{s.reg}</p>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-8 text-center">
                        <input type="number" disabled={s.status === "Submitted"} value={s.ca} onChange={(e) => updateScore(s.id, 'ca', e.target.value)} className="w-16 p-3 bg-slate-50 rounded-xl text-center font-black outline-none border border-transparent focus:border-red-600/20" />
                      </td>
                      <td className="p-8 text-center">
                        <input type="number" disabled={s.status === "Submitted"} value={s.exam} onChange={(e) => updateScore(s.id, 'exam', e.target.value)} className="w-16 p-3 bg-slate-50 rounded-xl text-center font-black outline-none border border-transparent focus:border-red-600/20" />
                      </td>
                      <td className="p-8 text-center">
                          <span className={`text-lg font-black ${s.total >= 50 ? 'text-emerald-600' : 'text-red-600'}`}>{s.total}</span>
                          <p className="text-[8px] font-black uppercase text-slate-400">Grade: {s.grade}</p>
                      </td>
                      <td className="p-8 text-center">
                        <div className="flex justify-center gap-3">
                           {s.status !== "Submitted" && (
                             <button onClick={() => handleDeleteStudent(s.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                           )}
                           {s.status === "Submitted" ? <div className="flex items-center gap-1 text-green-600 text-[9px] font-black uppercase"><FileCheck2 size={18}/> Sent</div> : <div className="flex items-center gap-1 text-orange-400 text-[9px] font-black uppercase"><Clock size={18}/> Draft</div>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {studentResults.length === 0 && <div className="p-32 text-center"><Inbox size={48} className="mx-auto text-slate-200 mb-4" /><p className="text-slate-400 font-black uppercase text-xs tracking-widest">No students found in your department</p></div>}
            </div>
          </div>
        )}

        {/* ... Admission Intake, Manual Add, Lesson Plan remains ... */}
        {activeTab === "inbox" && (
           <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in slide-in-from-top-4">
              <div className="bg-red-600 p-10 rounded-[45px] text-white shadow-xl shadow-red-200 mb-10">
                <h2 className="text-4xl font-black uppercase tracking-tighter">Student Intake</h2>
                <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-2">New Approved Students for {staffCourse}</p>
              </div>
              <div className="space-y-4">
                {incomingStudents.map(student => (
                    <div key={student.id} className="bg-white p-8 rounded-[35px] shadow-sm flex items-center justify-between border border-slate-100 hover:scale-[1.01] transition-transform">
                        <div className="flex items-center gap-6">
                            <div className="h-14 w-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black italic">ID</div>
                            <div>
                                <p className="font-black text-[#002147] uppercase text-base leading-none mb-1">{student.name}</p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">{student.email || "Official Applicant"}</p>
                            </div>
                        </div>
                        <button onClick={() => acceptStudent(student)} className="px-8 py-4 bg-[#002147] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 transition-all shadow-lg active:scale-95">
                            <UserCheck size={18}/> Enroll Student
                        </button>
                    </div>
                ))}
              </div>
              {incomingStudents.length === 0 && <div className="p-32 text-center bg-white rounded-[45px] border border-dashed border-slate-200"><Clock size={40} className="mx-auto text-slate-300 mb-4" /><p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Waiting for Admission Officer approval...</p></div>}
           </div>
        )}

        {activeTab === "add_manual" && (
          <div className="max-w-xl mx-auto animate-in zoom-in-95 duration-300">
            <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5"><UserPlus size={150}/></div>
                <h2 className="text-3xl font-black text-[#002147] uppercase mb-2 tracking-tighter">Enroll Student</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Manual database entry for lecturers</p>
                <form onSubmit={handleManualAdd} className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-5">Full Name</label>
                    <input type="text" className="w-full p-6 bg-slate-50 rounded-[25px] outline-none font-bold border border-transparent focus:border-red-600/20 focus:bg-white transition-all" placeholder="Enter Full Name" value={manualStudent.name} onChange={(e)=>setManualStudent({...manualStudent, name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-5">Registration Number</label>
                    <input type="text" className="w-full p-6 bg-slate-50 rounded-[25px] outline-none font-bold border border-transparent focus:border-red-600/20 focus:bg-white transition-all" placeholder="GTI/CS/2026/..." value={manualStudent.reg} onChange={(e)=>setManualStudent({...manualStudent, reg: e.target.value})} required />
                  </div>
                  <button type="submit" className="w-full bg-red-600 text-white p-6 rounded-[25px] font-black uppercase text-[11px] tracking-[0.3em] shadow-xl shadow-red-200 active:scale-95 transition-all">Create Record</button>
                </form>
            </div>
          </div>
        )}

        {activeTab === "lesson_plan" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            <header className="flex justify-between items-center bg-white p-8 rounded-[35px] border border-slate-100">
              <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Lesson Planner</h1>
              <button onClick={saveLessonPlan} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all"><Save size={18} /> Publish Plan</button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Current Subject</label>
                    <input type="text" placeholder="e.g Data Structures" className="w-full p-5 bg-white rounded-[25px] border border-slate-100 font-bold outline-none focus:border-blue-600/20" value={newPlan.subject} onChange={(e) => setNewPlan({...newPlan, subject: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Lesson Topic</label>
                    <input type="text" placeholder="e.g Binary Search Trees" className="w-full p-5 bg-white rounded-[25px] border border-slate-100 font-bold outline-none focus:border-blue-600/20" value={newPlan.topic} onChange={(e) => setNewPlan({...newPlan, topic: e.target.value})} />
                </div>
            </div>
            <PlanEditor icon={Target} label="Learning Objectives" value={newPlan.objectives} onChange={(val) => setNewPlan({...newPlan, objectives: val})} />
            <PlanEditor icon={Presentation} label="Lecture Delivery Plan" value={newPlan.content} onChange={(val) => setNewPlan({...newPlan, content: val})} />
          </div>
        )}

        {activeTab === "history_plans" && (
            <div className="max-w-4xl mx-auto space-y-6">
                <h2 className="text-3xl font-black text-[#002147] uppercase tracking-tighter mb-8">Lesson Archive</h2>
                {lessonPlans.map(plan => (
                    <div key={plan.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 flex items-start justify-between group hover:shadow-xl transition-all">
                        <div className="flex gap-6">
                            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center"><BookText size={24}/></div>
                            <div>
                                <h4 className="font-black text-[#002147] uppercase text-lg leading-tight">{plan.subject}</h4>
                                <p className="text-sm font-bold text-slate-500 mb-4">{plan.topic}</p>
                                <div className="flex gap-4">
                                    <span className="text-[9px] font-black bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest text-slate-500">{plan.staffName}</span>
                                    <span className="text-[9px] font-black bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest text-blue-500">{staffCourse}</span>
                                </div>
                            </div>
                        </div>
                        <button className="text-slate-300 group-hover:text-red-600 transition-colors"><ChevronRight size={24}/></button>
                    </div>
                ))}
                {lessonPlans.length === 0 && <div className="p-32 text-center text-slate-400 font-black uppercase tracking-widest text-xs border-2 border-dashed border-slate-200 rounded-[45px]">No archived plans found</div>}
            </div>
        )}
      </main>
    </div>
  );
};

const PlanEditor = ({ icon: Icon, label, value, onChange }) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Icon size={18}/></div>
      <h3 className="font-black text-[#002147] uppercase text-[11px] tracking-widest">{label}</h3>
    </div>
    <textarea rows="4" className="w-full bg-slate-50 rounded-3xl p-6 outline-none font-medium focus:bg-white border focus:border-red-600/20 transition-all text-sm leading-relaxed" placeholder="Type lesson details here..." value={value} onChange={(e) => onChange(e.target.value)}></textarea>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => {
  const themes = { blue: "bg-blue-50 text-blue-600 shadow-blue-100", red: "bg-red-50 text-red-600 shadow-red-100", green: "bg-emerald-50 text-emerald-600 shadow-emerald-100" };
  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-2xl transition-all duration-500">
      <div className={`h-20 w-20 rounded-[30px] flex items-center justify-center shadow-lg ${themes[color]}`}><Icon size={32} /></div>
      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">{label}</p><h3 className="text-4xl font-black text-[#002147] tracking-tighter">{value}</h3></div>
    </div>
  );
};

export default StaffDashboard;