import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Na kara auth a nan
import { signOut } from "firebase/auth"; // Na kara signOut
import { useNavigate } from "react-router-dom"; // Na kara useNavigate
import { 
  collection, addDoc, onSnapshot, query, where, 
  updateDoc, doc, serverTimestamp, orderBy, writeBatch 
} from "firebase/firestore";
import { 
  LayoutDashboard, FileEdit, History, Search, User, LogOut, 
  Printer, Save, BookText, ClipboardList, Target, Presentation, 
  FileSearch, Users, Inbox, Clock, Database, UserCheck, 
  FileCheck2, ChevronRight, UserPlus, SendHorizonal
} from "lucide-react";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLocked] = useState(false);
  const [staffCourse] = useState("Computer Science");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Wannan zai taimaka wurin komawa Login page

  // --- DATA STATES ---
  const [incomingStudents, setIncomingStudents] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  
  const [manualStudent, setManualStudent] = useState({ name: "", reg: "" });
  const [newPlan, setNewPlan] = useState({
    subject: "", topic: "", objectives: "", content: "", evaluation: ""
  });

  // --- LOGIC: Logout ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Bayan ya fita, zai tura ka shafin login kai tsaye
    } catch (err) {
      alert("Error logging out: " + err.message);
    }
  };

  // --- FETCH DATA FROM FIREBASE ---
  useEffect(() => {
    const qStudents = query(
        collection(db, "admissions"), 
        where("course", "==", staffCourse), 
        where("status", "==", "New")
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
    }, (error) => {
        const qFallback = query(collection(db, "lessonPlans"), where("course", "==", staffCourse));
        onSnapshot(qFallback, (s) => setLessonPlans(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    });

    return () => { unsubStudents(); unsubResults(); unsubPlans(); };
  }, [staffCourse]);

  // --- LOGIC: Submit All Results to Exam Officer ---
  const submitToExamOfficer = async () => {
    if (studentResults.length === 0) return alert("No results to submit!");
    const confirmSubmit = window.confirm("Are you sure you want to submit all results to the Exam Officer? You won't be able to edit them afterwards.");
    
    if (confirmSubmit) {
      setLoading(true);
      try {
        const batch = writeBatch(db);
        studentResults.forEach((student) => {
          const studentRef = doc(db, "studentResults", student.id);
          batch.update(studentRef, { 
            status: "Submitted", 
            submittedAt: serverTimestamp(),
            isLocked: true 
          });

          const finalRef = doc(collection(db, "finalResults"));
          batch.set(finalRef, {
            ...student,
            submittedBy: "Dr. Adamu",
            submissionDate: serverTimestamp()
          });
        });

        await batch.commit();
        alert("Success! All results have been sent to the Exam Officer.");
      } catch (err) {
        alert("Submission Error: " + err.message);
      }
      setLoading(false);
    }
  };

  // --- LOGIC: Manual Student Entry ---
  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!manualStudent.name || !manualStudent.reg) return alert("Please fill all fields");
    setLoading(true);
    try {
      await addDoc(collection(db, "studentResults"), {
        ...manualStudent,
        course: staffCourse,
        ca: 0, exam: 0, total: 0, grade: "F",
        status: "Draft",
        admittedAt: serverTimestamp()
      });
      alert("Student Added!");
      setManualStudent({ name: "", reg: "" });
      setActiveTab("entry");
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const acceptStudent = async (student) => {
    try {
      await addDoc(collection(db, "studentResults"), {
        name: student.name,
        reg: student.reg,
        course: staffCourse,
        ca: 0, exam: 0, total: 0, grade: "F",
        status: "Draft",
        admittedAt: serverTimestamp()
      });
      const studentRef = doc(db, "admissions", student.id);
      await updateDoc(studentRef, { status: "Registered" });
    } catch (err) { alert("Error: " + err.message); }
  };

  const updateScore = async (id, field, value) => {
    const student = studentResults.find(s => s.id === id);
    if (student.isLocked) return alert("This result is already submitted and locked!");
    
    const newVal = parseInt(value) || 0;
    const studentRef = doc(db, "studentResults", id);
    const newCa = field === 'ca' ? newVal : student.ca;
    const newExam = field === 'exam' ? newVal : student.exam;
    const newTotal = newCa + newExam;
    const newGrade = newTotal >= 70 ? "A" : newTotal >= 60 ? "B" : newTotal >= 50 ? "C" : "F";

    await updateDoc(studentRef, { [field]: newVal, total: newTotal, grade: newGrade });
  };

  const saveLessonPlan = async () => {
    if(!newPlan.subject || !newPlan.topic) return alert("Fill subject and topic!");
    setLoading(true);
    try {
      await addDoc(collection(db, "lessonPlans"), {
        ...newPlan,
        staffName: "Dr. Adamu",
        course: staffCourse,
        status: "Draft",
        createdAt: serverTimestamp()
      });
      setNewPlan({ subject: "", topic: "", objectives: "", content: "", evaluation: "" });
      setActiveTab("history_plans");
    } catch (err) { alert("Error: " + err.message); }
    setLoading(false);
  };

  const printPlan = (plan) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><body style="font-family:sans-serif;padding:40px;"><h1>${plan.topic}</h1><p><b>Subject:</b> ${plan.subject}</p><hr/><p><b>Objectives:</b><br/>${plan.objectives}</p></body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const NavItem = ({ id, icon: Icon, label, count }) => (
    <button onClick={() => setActiveTab(id)} className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:bg-white/5'}`}>
      <div className="flex items-center gap-4"><Icon size={18} /> {label}</div>
      {count > 0 && <span className="bg-white text-red-600 px-2 py-0.5 rounded-lg text-[9px]">{count}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-left text-slate-900">
      <aside className="w-full md:w-72 bg-[#002147] text-white p-8 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg">S</div>
          <div><h2 className="font-black text-sm uppercase tracking-tighter">Skyward</h2><p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-1">Staff Portal</p></div>
        </div>
        <nav className="space-y-2 flex-grow overflow-y-auto">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="inbox" icon={Inbox} label="Student Intake" count={incomingStudents.length} />
          <NavItem id="add_manual" icon={UserPlus} label="Add Student" />
          <NavItem id="lesson_plan" icon={BookText} label="Lesson Planner" />
          <NavItem id="history_plans" icon={FileSearch} label="My Plans" />
          <NavItem id="entry" icon={FileEdit} label="Score Entry" />
        </nav>
        {/* GYARARREN LOGOUT BUTTON */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-[11px] uppercase text-red-400 hover:bg-red-500/10 border border-red-500/20 mt-4"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === "dashboard" && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
            <header className="flex justify-between items-center bg-white p-8 rounded-[35px] shadow-sm border border-slate-100">
              <div><h1 className="text-4xl font-black text-[#002147] tracking-tighter uppercase">Hi, Dr. Adamu</h1><p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Dept of {staffCourse}</p></div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={Users} label="Registered" value={studentResults.length} color="blue" />
              <StatCard icon={SendHorizonal} label="Sent to Exams" value={studentResults.filter(s => s.status === "Submitted").length} color="green" />
              <StatCard icon={Clock} label="Pending" value={studentResults.filter(s => s.status !== "Submitted").length} color="red" />
            </div>
          </div>
        )}

        {/* --- ALL OTHER TABS REMAIN THE SAME --- */}
        {activeTab === "add_manual" && (
          <div className="max-w-xl mx-auto animate-in slide-in-from-bottom-4">
            <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
               <h2 className="text-2xl font-black text-[#002147] uppercase tracking-tighter mb-8">Manual Enrollment</h2>
               <form onSubmit={handleManualAdd} className="space-y-6">
                  <input type="text" className="w-full p-5 bg-slate-50 rounded-3xl outline-none focus:ring-2 ring-red-500 font-bold" placeholder="Full Name" value={manualStudent.name} onChange={(e)=>setManualStudent({...manualStudent, name: e.target.value})} />
                  <input type="text" className="w-full p-5 bg-slate-50 rounded-3xl outline-none focus:ring-2 ring-red-500 font-bold" placeholder="Reg Number" value={manualStudent.reg} onChange={(e)=>setManualStudent({...manualStudent, reg: e.target.value})} />
                  <button type="submit" disabled={loading} className="w-full bg-[#002147] text-white p-6 rounded-3xl font-black uppercase text-[11px] tracking-widest">{loading ? "..." : "Enroll Student"}</button>
               </form>
            </div>
          </div>
        )}

        {activeTab === "entry" && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-right-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Score Entry</h1>
                <button 
                  onClick={submitToExamOfficer} 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-lg transition-all"
                >
                  <SendHorizonal size={16} /> {loading ? "Sending..." : "Submit to Exams Officer"}
                </button>
            </div>
            
            <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr><th className="p-8">Student</th><th className="p-8 text-center">CA (40)</th><th className="p-8 text-center">Exam (60)</th><th className="p-8 text-center">Total</th><th className="p-8 text-center">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {studentResults.map((s) => (
                    <tr key={s.id} className={s.status === "Submitted" ? "bg-green-50/30" : ""}>
                      <td className="p-8 font-black text-sm uppercase text-[#002147]">{s.name}<br/><span className="text-[10px] text-slate-400">{s.reg}</span></td>
                      <td className="p-8 text-center">
                        <input type="number" disabled={s.status === "Submitted"} value={s.ca} onChange={(e) => updateScore(s.id, 'ca', e.target.value)} className="w-20 p-3 bg-slate-50 rounded-xl text-center font-black outline-none border disabled:opacity-50" />
                      </td>
                      <td className="p-8 text-center">
                        <input type="number" disabled={s.status === "Submitted"} value={s.exam} onChange={(e) => updateScore(s.id, 'exam', e.target.value)} className="w-20 p-3 bg-slate-50 rounded-xl text-center font-black outline-none border disabled:opacity-50" />
                      </td>
                      <td className="p-8 text-center font-black text-xl text-[#002147]">{s.total}</td>
                      <td className="p-8 text-center font-black">
                        {s.status === "Submitted" ? 
                          <span className="text-green-600 text-[9px] bg-green-100 px-3 py-1 rounded-full uppercase">Sent</span> : 
                          <span className="text-orange-600 text-[9px] bg-orange-100 px-3 py-1 rounded-full uppercase">Pending</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "inbox" && (
           <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-2xl font-black text-[#002147] uppercase tracking-tighter mb-6">Student Intake Queue</h2>
              {incomingStudents.map(student => (
                  <div key={student.id} className="bg-white p-6 rounded-3xl shadow-sm flex items-center justify-between border border-slate-100">
                      <div><p className="font-black text-[#002147] uppercase text-sm">{student.name}</p><p className="text-[10px] text-slate-400 font-bold">{student.reg}</p></div>
                      <button onClick={() => acceptStudent(student)} className="px-6 py-3 bg-red-600 text-white rounded-2xl font-black text-[9px] uppercase"><UserCheck size={14} className="inline mr-2"/> Approve</button>
                  </div>
              ))}
           </div>
        )}

        {activeTab === "lesson_plan" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-6">
            <header className="flex justify-between items-center">
              <h1 className="text-3xl font-black text-[#002147] tracking-tighter uppercase">New Lesson Plan</h1>
              <button onClick={saveLessonPlan} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
                <Save size={16} /> Save Plan
              </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <input type="text" placeholder="Subject" className="p-5 bg-white rounded-[25px] border border-slate-100 font-bold outline-none focus:border-red-600" value={newPlan.subject} onChange={(e) => setNewPlan({...newPlan, subject: e.target.value})} />
               <input type="text" placeholder="Topic" className="p-5 bg-white rounded-[25px] border border-slate-100 font-bold outline-none focus:border-red-600" value={newPlan.topic} onChange={(e) => setNewPlan({...newPlan, topic: e.target.value})} />
            </div>
            <PlanEditor icon={Target} label="Objectives" value={newPlan.objectives} onChange={(val) => setNewPlan({...newPlan, objectives: val})} />
            <PlanEditor icon={Presentation} label="Lesson Steps" value={newPlan.content} onChange={(val) => setNewPlan({...newPlan, content: val})} />
            <PlanEditor icon={ClipboardList} label="Evaluation" value={newPlan.evaluation} onChange={(val) => setNewPlan({...newPlan, evaluation: val})} />
          </div>
        )}

        {activeTab === "history_plans" && (
           <div className="max-w-5xl mx-auto space-y-6">
              <h2 className="text-2xl font-black text-[#002147] uppercase tracking-tighter">My Lesson Library</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {lessonPlans.map(plan => (
                    <div key={plan.id} className="bg-white p-6 rounded-[35px] border border-slate-100 hover:shadow-xl transition-all">
                       <h3 className="font-black text-[#002147] uppercase text-sm">{plan.topic}</h3>
                       <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase">{plan.subject}</p>
                       <button onClick={() => printPlan(plan)} className="text-blue-600 font-black text-[9px] uppercase tracking-widest flex items-center gap-1"><Printer size={14}/> Print PDF</button>
                    </div>
                 ))}
              </div>
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
    <textarea rows="3" className="w-full bg-slate-50 rounded-3xl p-6 outline-none font-medium focus:bg-white border border-transparent transition-all" value={value} onChange={(e) => onChange(e.target.value)}></textarea>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => {
  const themes = { blue: "bg-blue-50 text-blue-600", red: "bg-red-50 text-red-600", green: "bg-emerald-50 text-emerald-600" };
  return (
    <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${themes[color]}`}><Icon size={24} /></div>
      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p><h3 className="text-3xl font-black text-[#002147]">{value}</h3></div>
    </div>
  );
};

export default StaffDashboard;