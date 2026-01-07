import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Tabbatar wannan path din daidai ne
import { 
  collection, addDoc, onSnapshot, query, where, 
  updateDoc, doc, serverTimestamp 
} from "firebase/firestore";
import { 
  LayoutDashboard, FileEdit, History, Search, User, LogOut, 
  Printer, Save, BookText, ClipboardList, Target, Presentation, 
  FileSearch, Users, Inbox, Clock, Database, UserCheck, 
  FileCheck2, ChevronRight 
} from "lucide-react";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLocked] = useState(false);
  const [staffCourse] = useState("Computer Science");
  const [loading, setLoading] = useState(false);

  // --- DATA STATES (Now connected to Firebase) ---
  const [incomingStudents, setIncomingStudents] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  
  const [newPlan, setNewPlan] = useState({
    subject: "", topic: "", objectives: "", content: "", evaluation: ""
  });

  // --- FETCH DATA FROM FIREBASE ---
  useEffect(() => {
    // 1. Listen for new students in this course
    const qStudents = query(collection(db, "admissions"), where("course", "==", staffCourse), where("status", "==", "New"));
    const unsubStudents = onSnapshot(qStudents, (snap) => {
      setIncomingStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 2. Listen for registered students and their scores
    const qResults = query(collection(db, "studentResults"), where("course", "==", staffCourse));
    const unsubResults = onSnapshot(qResults, (snap) => {
      setStudentResults(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 3. Listen for Lesson Plans
    const qPlans = query(collection(db, "lessonPlans"), orderBy("createdAt", "desc"));
    const unsubPlans = onSnapshot(qPlans, (snap) => {
      setLessonPlans(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubStudents(); unsubResults(); unsubPlans(); };
  }, [staffCourse]);

  // --- LOGIC: Accept Student ---
  const acceptStudent = async (student) => {
    try {
      // 1. Create result record
      await addDoc(collection(db, "studentResults"), {
        name: student.name,
        reg: student.reg,
        course: staffCourse,
        ca: 0,
        exam: 0,
        total: 0,
        grade: "F",
        admittedAt: serverTimestamp()
      });
      // 2. Update admission status
      const studentRef = doc(db, "admissions", student.id);
      await updateDoc(studentRef, { status: "Registered" });
    } catch (err) { alert("Error accepting student: " + err.message); }
  };

  // --- LOGIC: Update Scores ---
  const updateScore = async (id, field, value) => {
    if (isLocked) return;
    const newVal = parseInt(value) || 0;
    const studentRef = doc(db, "studentResults", id);

    // Calculate new total locally first for the update
    const student = studentResults.find(s => s.id === id);
    const newCa = field === 'ca' ? newVal : student.ca;
    const newExam = field === 'exam' ? newVal : student.exam;
    const newTotal = newCa + newExam;
    const newGrade = newTotal >= 70 ? "A" : newTotal >= 60 ? "B" : newTotal >= 50 ? "C" : "F";

    await updateDoc(studentRef, {
      [field]: newVal,
      total: newTotal,
      grade: newGrade
    });
  };

  // --- LOGIC: Save Lesson Plan ---
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

  // --- LOGIC: Print Plan (Same as yours) ---
  const printPlan = (plan) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Lesson Plan - ${plan.topic}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; line-height: 1.6; }
            h1 { color: #002147; border-bottom: 2px solid red; padding-bottom: 10px; }
            .section { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .label { font-weight: bold; text-transform: uppercase; font-size: 11px; color: #777; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <h1>Lesson Plan: ${plan.topic}</h1>
          <div class="section"><p class="label">Subject</p><p>${plan.subject}</p></div>
          <div class="section"><p class="label">Learning Objectives</p><p>${plan.objectives}</p></div>
          <div class="section"><p class="label">Presentation Steps</p><p>${plan.content}</p></div>
          <div class="section"><p class="label">Evaluation</p><p>${plan.evaluation}</p></div>
          <div style="margin-top: 50px; font-size: 10px; color: #999;">Generated by Skyward Staff Portal</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const NavItem = ({ id, icon: Icon, label, count }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all ${activeTab === id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:bg-white/5'}`}
    >
      <div className="flex items-center gap-4"><Icon size={18} /> {label}</div>
      {count > 0 && <span className="bg-white text-red-600 px-2 py-0.5 rounded-lg text-[9px]">{count}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-left">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#002147] text-white p-8 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-10 w-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg">S</div>
          <div>
            <h2 className="font-black text-sm uppercase tracking-tighter leading-none">Skyward</h2>
            <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-1">Staff Portal</p>
          </div>
        </div>

        <nav className="space-y-2 flex-grow overflow-y-auto">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="inbox" icon={Inbox} label="Student Intake" count={incomingStudents.length} />
          <NavItem id="lesson_plan" icon={BookText} label="Lesson Planner" />
          <NavItem id="history_plans" icon={FileSearch} label="My Plans" />
          <NavItem id="entry" icon={FileEdit} label="Score Entry" />
        </nav>

        <button className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-[11px] uppercase text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20 mt-4">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {activeTab === "dashboard" && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center bg-white p-8 rounded-[35px] shadow-sm border border-slate-100">
              <div>
                <h1 className="text-4xl font-black text-[#002147] tracking-tighter uppercase">Hi, Dr. Adamu</h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Department of {staffCourse}</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={Users} label="Total Students" value={studentResults.length} color="blue" />
              <StatCard icon={Inbox} label="New Admissions" value={incomingStudents.length} color="red" />
              <StatCard icon={BookText} label="Active Plans" value={lessonPlans.length} color="green" />
            </div>
          </div>
        )}

        {activeTab === "inbox" && (
          <div className="max-w-4xl mx-auto animate-in zoom-in duration-300">
             <div className="mb-10 text-center">
                <div className="h-20 w-20 bg-red-50 text-red-600 rounded-[30px] flex items-center justify-center mx-auto mb-6"><Inbox size={35}/></div>
                <h2 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Student Intake</h2>
             </div>
             <div className="space-y-4">
                {incomingStudents.length === 0 ? (
                  <p className="text-center text-slate-400 font-bold uppercase text-[10px]">No new students currently waiting</p>
                ) : (
                  incomingStudents.map(student => (
                    <div key={student.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group">
                       <div className="flex items-center gap-5">
                          <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#002147] font-black group-hover:bg-red-600 group-hover:text-white transition-colors">{student.name.charAt(0)}</div>
                          <div><p className="font-black text-[#002147] uppercase text-sm">{student.name}</p><p className="text-[10px] text-slate-400 font-bold">{student.reg}</p></div>
                       </div>
                       <button onClick={() => acceptStudent(student)} className="px-6 py-3 bg-red-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest"><UserCheck size={14} className="inline mr-2"/> Add to My List</button>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}

        {activeTab === "lesson_plan" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-500">
            <header className="flex justify-between items-center">
              <h1 className="text-3xl font-black text-[#002147] tracking-tighter uppercase">Lesson Planner</h1>
              <button onClick={saveLessonPlan} disabled={loading} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 active:scale-95 transition-all">
                <Save size={16} /> {loading ? "Saving..." : "Save Plan"}
              </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <input type="text" placeholder="Subject" className="p-5 bg-white rounded-[25px] border border-slate-100 font-bold outline-none focus:border-red-600" value={newPlan.subject} onChange={(e) => setNewPlan({...newPlan, subject: e.target.value})} />
               <input type="text" placeholder="Topic" className="p-5 bg-white rounded-[25px] border border-slate-100 font-bold outline-none focus:border-red-600" value={newPlan.topic} onChange={(e) => setNewPlan({...newPlan, topic: e.target.value})} />
            </div>
            <PlanEditor icon={Target} label="Learning Objectives" value={newPlan.objectives} onChange={(val) => setNewPlan({...newPlan, objectives: val})} />
            <PlanEditor icon={Presentation} label="Lesson Steps" value={newPlan.content} onChange={(val) => setNewPlan({...newPlan, content: val})} />
            <PlanEditor icon={ClipboardList} label="Evaluation" value={newPlan.evaluation} onChange={(val) => setNewPlan({...newPlan, evaluation: val})} />
          </div>
        )}

        {activeTab === "history_plans" && (
           <div className="max-w-5xl mx-auto space-y-6">
              <h2 className="text-2xl font-black text-[#002147] uppercase tracking-tighter">My Lesson Library</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {lessonPlans.map(plan => (
                    <div key={plan.id} className="bg-white p-6 rounded-[35px] border border-slate-100 hover:shadow-xl transition-all group">
                       <h3 className="font-black text-[#002147] uppercase text-sm">{plan.topic}</h3>
                       <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase">{plan.subject}</p>
                       <div className="flex gap-4">
                        <button onClick={() => printPlan(plan)} className="text-blue-600 font-black text-[9px] uppercase tracking-widest flex items-center gap-1 hover:underline"><Printer size={14}/> Print PDF</button>
                        <button className="text-red-600 font-black text-[9px] uppercase tracking-widest flex items-center gap-1">View Details <ChevronRight size={14}/></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === "entry" && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Score Entry</h1>
            <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr><th className="p-8">Student</th><th className="p-8 text-center">CA (40)</th><th className="p-8 text-center">Exam (60)</th><th className="p-8 text-center">Total</th><th className="p-8 text-center">Grade</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {studentResults.map((s) => (
                    <tr key={s.id}>
                      <td className="p-8 font-black text-sm uppercase text-[#002147]">{s.name}<br/><span className="text-[10px] text-slate-400">{s.reg}</span></td>
                      <td className="p-8 text-center"><input type="number" value={s.ca} onChange={(e) => updateScore(s.id, 'ca', e.target.value)} className="w-20 p-3 bg-slate-50 rounded-xl text-center font-black outline-none focus:bg-white focus:border-red-600 border" /></td>
                      <td className="p-8 text-center"><input type="number" value={s.exam} onChange={(e) => updateScore(s.id, 'exam', e.target.value)} className="w-20 p-3 bg-slate-50 rounded-xl text-center font-black outline-none focus:bg-white focus:border-red-600 border" /></td>
                      <td className="p-8 text-center font-black text-xl text-[#002147]">{s.total}</td>
                      <td className="p-8 text-center font-black text-red-600">{s.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    <textarea rows="3" className="w-full bg-slate-50 rounded-3xl p-6 outline-none font-medium focus:bg-white focus:border-slate-200 border border-transparent transition-all" value={value} onChange={(e) => onChange(e.target.value)}></textarea>
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