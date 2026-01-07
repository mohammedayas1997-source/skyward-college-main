import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import { db, auth } from "../firebase";
import { doc, setDoc, serverTimestamp, collection, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { 
  LayoutDashboard, UploadCloud, Users, FileCheck, 
  Settings, LogOut, Bell, Search, Clock, CheckCircle, FileText, X,
  Key, ShieldCheck, Loader2, Send, ChevronRight, BookOpen, AlertCircle
} from "lucide-react";

const ExamOfficerDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // --- NEW: STATE NA KARBAR RESULTS DAGA STAFF ---
  const [incomingResults, setIncomingResults] = useState([
    { id: 1, courseCode: "GST 101", courseName: "Use of English", staff: "Dr. Ibrahim", students: 120, status: "Pending Approval", date: "2 mins ago" },
    { id: 2, courseCode: "MTH 102", courseName: "Calculus II", staff: "Prof. Aliyu", students: 85, status: "Pending Approval", date: "1 hour ago" },
    { id: 3, courseCode: "PHY 101", courseName: "General Physics", staff: "Mr. Yusuf", students: 92, status: "Published", date: "Yesterday" },
  ]);

  const [approvedStudents, setApprovedStudents] = useState([
    { id: "STU001", name: "Musa Yahaya", email: "musa@example.com", admissionNo: "GTI/2026/4521", phone: "08012345678" },
    { id: "STU002", name: "Zainab Aliyu", email: "zainab@example.com", admissionNo: "GTI/2026/8832", phone: "09088776655" },
  ]);

  const [loadingId, setLoadingId] = useState(null);

  // --- AUTOMATIC COURSE SORTING LOGIC (SIMULATION) ---
  const handleApproveResult = (id) => {
    setIncomingResults(incomingResults.map(res => 
      res.id === id ? { ...res, status: "Published" } : res
    ));
    // Anan ne za a saka logic din da zai rarraba result din zuwa kowane Student Portal
    alert("Result has been verified and published to individual student portals.");
  };

  const generateStudentAccount = async (student) => {
    setLoadingId(student.id);
    const initialPassword = "Welcome@ChangeMe123"; 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, student.email, initialPassword);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), {
        uid: uid,
        fullName: student.name,
        email: student.email,
        admissionNo: student.admissionNo,
        role: "student",
        isFirstLogin: true, 
        status: "Active",
        createdAt: serverTimestamp()
      });
      alert(`Account Created for ${student.name}`);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/portal/login");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] font-sans text-left">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#001529] text-white flex flex-col md:sticky md:top-0 md:h-screen shadow-2xl z-50">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">Skyward</h2>
          </div>
          <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em] ml-1">Examination Office</p>
        </div>
        
        <nav className="flex-grow p-6 space-y-3 mt-4">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Overview" active />
          <NavItem icon={<BookOpen size={18}/>} label="Incoming Results" />
          <NavItem icon={<Users size={18}/>} label="Student Manager" />
          <NavItem icon={<FileCheck size={18}/>} label="Transcripts" />
        </nav>

        <div className="p-6">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em]">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-6 md:p-12">
        <header className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search Results or Students..." className="pl-14 pr-6 py-4 w-full bg-slate-50 rounded-2xl outline-none text-[12px] font-bold border border-transparent focus:bg-white focus:border-red-600/20 transition-all" />
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-black text-[#002147] uppercase leading-none italic">Chief Exams Officer</p>
                <p className="text-[9px] text-emerald-500 font-black uppercase mt-1">Portal Secure</p>
             </div>
             <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg">EX</div>
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          <StatsCard title="Pending Courses" value="12" icon={<Clock size={22}/>} color="amber" />
          <StatsCard title="Total Published" value="48" icon={<CheckCircle size={22}/>} color="emerald" />
          <StatsCard title="Verification Requests" value="05" icon={<AlertCircle size={22}/>} color="red" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            
            {/* NEW: INCOMING RESULTS FROM STAFF */}
            <section className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-[#002147] font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shadow-sm"><FileText size={20}/></div> 
                        Submissions by Staff
                    </h3>
                    <span className="text-[10px] font-black text-red-600 animate-pulse">LIVE FEED</span>
                </div>

                <div className="space-y-4">
                    {incomingResults.map((result) => (
                        <div key={result.id} className="p-6 bg-slate-50 rounded-[30px] border border-transparent hover:border-slate-200 hover:bg-white transition-all group">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded">{result.courseCode}</span>
                                        <h4 className="text-sm font-black text-[#002147] uppercase">{result.courseName}</h4>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lecturer: {result.staff} • {result.students} Students</p>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    {result.status === "Pending Approval" ? (
                                        <button 
                                            onClick={() => handleApproveResult(result.id)}
                                            className="w-full sm:w-auto bg-[#001529] text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg"
                                        >
                                            <FileCheck size={14}/> Approve & Publish
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-widest bg-emerald-50 px-4 py-3 rounded-xl">
                                            <CheckCircle size={14}/> Published
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* STUDENT PROVISIONING SECTION */}
            <section className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100">
                <h3 className="text-[#002147] font-black uppercase text-xs tracking-[0.2em] mb-10 flex items-center gap-3">
                    <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 shadow-sm"><Key size={20} /></div>
                    Student Account Sync
                </h3>
                <div className="space-y-4">
                    {approvedStudents.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[25px] hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center font-black text-[#002147] border border-slate-100">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-[#002147] uppercase">{student.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">{student.admissionNo}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => generateStudentAccount(student)}
                                disabled={loadingId === student.id}
                                className="bg-white text-[#002147] p-3 rounded-xl border border-slate-200 hover:bg-[#002147] hover:text-white transition-all"
                            >
                                {loadingId === student.id ? <Loader2 size={16} className="animate-spin"/> : <Send size={16} />}
                            </button>
                        </div>
                    ))}
                </div>
                
                {/* Visual Indicator of Data Flow */}
                <div className="mt-8 p-6 bg-slate-50 rounded-[30px] border border-dashed border-slate-200">
                   <div className="flex items-center justify-center gap-8 text-slate-300">
                      <div className="text-center">
                         <div className="p-3 bg-white rounded-full mb-2 shadow-sm"><Users size={20}/></div>
                         <p className="text-[8px] font-black uppercase">Staff Data</p>
                      </div>
                      <ChevronRight size={20} className="animate-pulse" />
                      <div className="text-center">
                         <div className="p-3 bg-white rounded-full mb-2 shadow-sm italic font-black text-red-600 text-xs">EO</div>
                         <p className="text-[8px] font-black uppercase">Verification</p>
                      </div>
                      <ChevronRight size={20} className="animate-pulse" />
                      <div className="text-center">
                         <div className="p-3 bg-white rounded-full mb-2 shadow-sm text-emerald-500"><CheckCircle size={20}/></div>
                         <p className="text-[8px] font-black uppercase">Student Portal</p>
                      </div>
                   </div>
                </div>
            </section>
        </div>
      </main>
    </div>
  );
};

// Reusable Components
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 group ${active ? "bg-red-600 text-white shadow-xl translate-x-2" : "hover:bg-white/5 text-slate-500 hover:text-white"}`}>
    <span className={`${active ? "text-white" : "group-hover:text-red-500"}`}>{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-xl transition-all">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <h4 className="text-3xl font-black text-[#002147] tracking-tighter">{value}</h4>
    </div>
    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all 
      ${color === 'amber' ? 'bg-amber-50 text-amber-600' : color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {icon}
    </div>
  </div>
);

export default ExamOfficerDashboard;