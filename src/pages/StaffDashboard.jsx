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
  FileCheck2, ChevronRight, UserPlus, SendHorizonal, BookOpen, Trash2, Check
} from "lucide-react";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLocked] = useState(false);
  const [staffCourse, setStaffCourse] = useState(localStorage.getItem("selectedCourse") || "Computer Science");
  const [availableCourses] = useState([
    "Computer Science", "Public Administration", "Business Administration", "Accounting", "Mass Communication"
  ]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [incomingStudents, setIncomingStudents] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [editingId, setEditingId] = useState(null); // Domin sanin wanda ake edit
  
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

  useEffect(() => {
    const qStudents = query(collection(db, "admissions"), where("course", "==", staffCourse), where("status", "==", "New"));
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

  // --- NEW: EDIT & DELETE LOGIC ---
  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to PERMANENTLY delete this student?")) {
      try {
        await deleteDoc(doc(db, "studentResults", id));
      } catch (err) { alert("Error deleting: " + err.message); }
    }
  };

  const handleUpdateStudentInfo = async (id, newName, newReg) => {
    try {
      await updateDoc(doc(db, "studentResults", id), {
        name: newName,
        reg: newReg
      });
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
          batch.update(studentRef, { status: "Submitted", isLocked: true });
        });
        await batch.commit();
        alert("Submitted successfully!");
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
        name: student.name, reg: student.reg, course: staffCourse, ca: 0, exam: 0, total: 0, grade: "F", status: "Draft", admittedAt: serverTimestamp()
      });
      await updateDoc(doc(db, "admissions", student.id), { status: "Registered" });
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
    setLoading(true);
    try {
      await addDoc(collection(db, "lessonPlans"), { ...newPlan, staffName: "Dr. Adamu", course: staffCourse, createdAt: serverTimestamp() });
      setNewPlan({ subject: "", topic: "", objectives: "", content: "", evaluation: "" });
      setActiveTab("history_plans");
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const NavItem = ({ id, icon: Icon, label, count }) => (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === id ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
      <div className="flex items-center gap-4"><Icon size={18} /> {label}</div>
      {count > 0 && <span className="bg-white text-red-600 px-2 py-0.5 rounded-lg text-[9px]">{count}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-left">
      <aside className="w-full md:w-72 bg-[#002147] text-white p-8 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center font-black italic shadow-lg">S</div>
          <div><h2 className="font-black text-sm uppercase">Skyward</h2><p className="text-[9px] text-red-500 font-bold uppercase mt-1">Staff Portal</p></div>
        </div>

        <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
            <label className="text-[8px] font-black uppercase text-slate-400 mb-2 block">Active Course</label>
            <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-red-500"/>
                <select value={staffCourse} onChange={handleCourseChange} className="bg-transparent text-xs font-bold outline-none w-full cursor-pointer">
                    {availableCourses.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
                </select>
            </div>
        </div>

        <nav className="space-y-2 flex-grow overflow-y-auto">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="inbox" icon={Inbox} label="Student Intake" count={incomingStudents.length} />
          <NavItem id="add_manual" icon={UserPlus} label="Add Student" />
          <NavItem id="entry" icon={FileEdit} label="Score & Edit" />
          <NavItem id="lesson_plan" icon={BookText} label="Lesson Planner" />
          <NavItem id="history_plans" icon={FileSearch} label="My Plans" />
        </nav>
        
        <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-[11px] uppercase text-red-400 border border-red-500/20 mt-4"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === "dashboard" && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
            <header className="flex justify-between items-center bg-white p-8 rounded-[35px] shadow-sm border border-slate-100">
              <div><h1 className="text-4xl font-black text-[#002147] tracking-tighter uppercase">Hi, Dr. Adamu</h1><p className="text-slate-400 text-xs font-bold uppercase mt-2">Dept of {staffCourse}</p></div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={Users} label="Registered" value={studentResults.length} color="blue" />
              <StatCard icon={SendHorizonal} label="Sent to Exams" value={studentResults.filter(s => s.status === "Submitted").length} color="green" />
              <StatCard icon={Clock} label="Pending" value={studentResults.filter(s => s.status !== "Submitted").length} color="red" />
            </div>
          </div>
        )}

        {activeTab === "entry" && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Student Management</h1>
                <button onClick={submitToExamOfficer} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 shadow-lg">
                  <SendHorizonal size={16} /> {loading ? "..." : "Submit to Exams"}
                </button>
            </div>
            
            <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase">
                  <tr><th className="p-8">Student Info (Click to Edit)</th><th className="p-8 text-center">CA</th><th className="p-8 text-center">Exam</th><th className="p-8 text-center">Total</th><th className="p-8 text-center">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {studentResults.map((s) => (
                    <tr key={s.id} className={s.status === "Submitted" ? "bg-green-50/20" : "hover:bg-slate-50/50 transition-colors"}>
                      <td className="p-8">
                        {editingId === s.id ? (
                           <div className="space-y-2">
                             <input className="block w-full p-2 bg-white border rounded text-xs font-bold" value={s.name} onChange={(e) => handleUpdateStudentInfo(s.id, e.target.value, s.reg)} />
                             <input className="block w-full p-2 bg-white border rounded text-[10px]" value={s.reg} onChange={(e) => handleUpdateStudentInfo(s.id, s.name, e.target.value)} />
                             <button onClick={()=>setEditingId(null)} className="text-[9px] font-black text-green-600 uppercase">Done</button>
                           </div>
                        ) : (
                          <div className="cursor-pointer group" onClick={() => s.status !== "Submitted" && setEditingId(s.id)}>
                            <p className="font-black text-sm uppercase text-[#002147] group-hover:text-red-600">{s.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{s.reg}</p>
                          </div>
                        )}
                      </td>
                      <td className="p-8 text-center">
                        <input type="number" disabled={s.status === "Submitted"} value={s.ca} onChange={(e) => updateScore(s.id, 'ca', e.target.value)} className="w-16 p-2 bg-slate-100 rounded-lg text-center font-black outline-none" />
                      </td>
                      <td className="p-8 text-center">
                        <input type="number" disabled={s.status === "Submitted"} value={s.exam} onChange={(e) => updateScore(s.id, 'exam', e.target.value)} className="w-16 p-2 bg-slate-100 rounded-lg text-center font-black outline-none" />
                      </td>
                      <td className="p-8 text-center font-black text-lg text-[#002147]">{s.total}</td>
                      <td className="p-8 text-center">
                        <div className="flex justify-center gap-3">
                           {s.status !== "Submitted" && (
                             <button onClick={() => handleDeleteStudent(s.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                           )}
                           {s.status === "Submitted" ? <FileCheck2 className="text-green-500" size={20}/> : <Clock className="text-orange-400" size={20}/>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {studentResults.length === 0 && <div className="p-20 text-center text-slate-400 font-bold uppercase text-xs">No students registered yet</div>}
            </div>
          </div>
        )}

        {/* INTAKE TAB */}
        {activeTab === "inbox" && (
           <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-2xl font-black text-[#002147] uppercase tracking-tighter mb-6">New Applicants ({staffCourse})</h2>
              {incomingStudents.map(student => (
                  <div key={student.id} className="bg-white p-6 rounded-3xl shadow-sm flex items-center justify-between border border-slate-100 hover:scale-[1.01] transition-transform">
                      <div><p className="font-black text-[#002147] uppercase text-sm">{student.name}</p><p className="text-[10px] text-slate-400 font-bold">{student.reg}</p></div>
                      <button onClick={() => acceptStudent(student)} className="px-6 py-3 bg-red-600 text-white rounded-2xl font-black text-[9px] uppercase">Accept Student</button>
                  </div>
              ))}
              {incomingStudents.length === 0 && <p className="text-slate-400 text-xs font-bold uppercase text-center py-10">Queue is empty</p>}
           </div>
        )}

        {/* MANUAL ADD TAB */}
        {activeTab === "add_manual" && (
          <div className="max-w-xl mx-auto animate-in slide-in-from-bottom-4">
            <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
                <h2 className="text-2xl font-black text-[#002147] uppercase mb-8">Direct Enrollment</h2>
                <form onSubmit={handleManualAdd} className="space-y-6">
                  <input type="text" className="w-full p-5 bg-slate-50 rounded-3xl outline-none font-bold" placeholder="Full Name" value={manualStudent.name} onChange={(e)=>setManualStudent({...manualStudent, name: e.target.value})} />
                  <input type="text" className="w-full p-5 bg-slate-50 rounded-3xl outline-none font-bold" placeholder="Reg Number" value={manualStudent.reg} onChange={(e)=>setManualStudent({...manualStudent, reg: e.target.value})} />
                  <button type="submit" className="w-full bg-[#002147] text-white p-6 rounded-3xl font-black uppercase text-[11px]">Enroll Now</button>
                </form>
            </div>
          </div>
        )}

        {/* LESSON PLANNER TAB */}
        {activeTab === "lesson_plan" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex justify-between items-center">
              <h1 className="text-3xl font-black text-[#002147] uppercase">Lesson Plan</h1>
              <button onClick={saveLessonPlan} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3"><Save size={16} /> Save</button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <input type="text" placeholder="Subject" className="p-5 bg-white rounded-[25px] border border-slate-100 font-bold" value={newPlan.subject} onChange={(e) => setNewPlan({...newPlan, subject: e.target.value})} />
               <input type="text" placeholder="Topic" className="p-5 bg-white rounded-[25px] border border-slate-100 font-bold" value={newPlan.topic} onChange={(e) => setNewPlan({...newPlan, topic: e.target.value})} />
            </div>
            <PlanEditor icon={Target} label="Objectives" value={newPlan.objectives} onChange={(val) => setNewPlan({...newPlan, objectives: val})} />
            <PlanEditor icon={Presentation} label="Lesson Steps" value={newPlan.content} onChange={(val) => setNewPlan({...newPlan, content: val})} />
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
    <textarea rows="3" className="w-full bg-slate-50 rounded-3xl p-6 outline-none font-medium focus:bg-white border transition-all" value={value} onChange={(e) => onChange(e.target.value)}></textarea>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => {
  const themes = { blue: "bg-blue-50 text-blue-600", red: "bg-red-50 text-red-600", green: "bg-emerald-50 text-emerald-600" };
  return (
    <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-xl transition-all">
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${themes[color]}`}><Icon size={24} /></div>
      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p><h3 className="text-3xl font-black text-[#002147]">{value}</h3></div>
    </div>
  );
};

export default StaffDashboard;