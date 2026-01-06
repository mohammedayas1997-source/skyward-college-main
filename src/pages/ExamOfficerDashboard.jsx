import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
// Na kara duba wadannan don Firebase da SMS
import { db, auth } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { 
  LayoutDashboard, UploadCloud, Users, FileCheck, 
  Settings, LogOut, Bell, Search, Clock, CheckCircle, FileText, X,
  Key, ShieldCheck, Loader2, Send
} from "lucide-react";

const ExamOfficerDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // --- SABBIN STATES NA CREDENTIALS ---
  const [loadingId, setLoadingId] = useState(null);
  const [approvedStudents, setApprovedStudents] = useState([
    { id: "STU001", name: "Musa Yahaya", email: "musa@example.com", admissionNo: "GTI/2026/4521", phone: "08012345678" },
    { id: "STU002", name: "Zainab Aliyu", email: "zainab@example.com", admissionNo: "GTI/2026/8832", phone: "09088776655" },
  ]);

  // --- AIKIN GENERATE USER & PASSWORD (AUTOMATIC) ---
  const generateStudentAccount = async (student) => {
    setLoadingId(student.id);
    const initialPassword = "Welcome@ChangeMe123"; // Password na farko

    try {
      // 1. Kirkirar User a Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, student.email, initialPassword);
      const uid = userCredential.user.uid;

      // 2. Ajiye bayanan a Firestore tare da isFirstLogin flag
      await setDoc(doc(db, "users", uid), {
        uid: uid,
        fullName: student.name,
        email: student.email,
        admissionNo: student.admissionNo,
        phone: student.phone,
        role: "student",
        isFirstLogin: true, // Zai tilasta masa canza password a login na farko
        status: "Active",
        createdAt: serverTimestamp()
      });

      // 3. Tura sakon SMS (Simulation)
      alert(`NASARA: An tura SMS zuwa ${student.phone}.\nEmail: ${student.email}\nPassword: ${initialPassword}`);
      
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoadingId(null);
    }
  };

  // --- TSARO (SECURITY) ---
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "exam-officer") {
      // navigate("/portal/student-login"); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/portal/student-login");
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) { setSelectedFile(file); }
  };

  const handleFileProcess = () => {
    if (!selectedFile) return alert("Don Allah zabi fayil (CSV/Excel) tukunna!");
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setSelectedFile(null);
      setTimeout(() => setUploadSuccess(false), 5000);
    }, 3000);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#002147] text-white flex flex-col md:sticky md:top-0 md:h-screen shadow-xl z-20">
        <div className="p-6 border-b border-white/10 text-center">
          <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Skyward Admin</h2>
          <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em]">Exam Office</p>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 mt-4 overflow-y-auto text-left">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<UploadCloud size={20}/>} label="Upload Results" />
          <NavItem icon={<Users size={20}/>} label="Manage Students" />
          <NavItem icon={<FileCheck size={20}/>} label="Result Reports" />
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 hover:bg-red-500/10 p-4 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest">
            <LogOut size={20} /> Logout System
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-4 md:p-10 lg:p-12 overflow-x-hidden text-left">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 bg-white p-5 rounded-[20px] shadow-sm border border-slate-200 gap-4">
          <div className="relative w-full sm:w-80 text-left">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
            <input type="text" placeholder="Search students or IDs..." className="pl-12 pr-4 py-3 w-full bg-slate-50 rounded-xl outline-none text-[11px] font-bold border border-transparent focus:border-red-600/20 transition-all shadow-inner"/>
          </div>
          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-all">
                <Bell className="text-slate-400" size={20} />
                <span className="absolute top-2 right-2 bg-red-600 w-2 h-2 rounded-full border-2 border-white animate-pulse"></span>
            </div>
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200 text-left">
                <div className="text-right hidden lg:block">
                    <p className="text-[10px] font-black text-[#002147] uppercase leading-none">Exam Officer</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Admin Level 1</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-red-600/20">EO</div>
            </div>
          </div>
        </header>

        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-500 text-white rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-500">
            <CheckCircle size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Result Published Successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 text-left">
          <StatsCard title="Total Students" value="1,240" icon={<Users size={20} className="text-blue-600"/>} />
          <StatsCard title="Results Uploaded" value="85%" icon={<FileCheck size={20} className="text-green-600"/>} />
          <StatsCard title="Credentialed" value="1,112" icon={<ShieldCheck size={20} className="text-purple-600"/>} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* UPLOAD SECTION (Daga kaine) */}
            <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200">
                <h3 className="text-[#002147] font-black uppercase text-xs tracking-widest mb-8 flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg"><UploadCloud className="text-red-600" size={18}/></div> 
                    Upload Results
                </h3>
                {/* Inputs sessions/semesters dinka */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
                    <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Academic Session</label>
                        <select className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase outline-none focus:border-red-600 transition-all">
                            <option>2025/2026 Session</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Semester</label>
                        <select className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase outline-none focus:border-red-600 transition-all">
                            <option>First Semester</option>
                        </select>
                    </div>
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv, .xlsx, .xls"/>
                <div onClick={triggerFileInput} className={`border-2 border-dashed ${selectedFile ? 'border-green-400 bg-green-50/10' : 'border-slate-200 bg-slate-50/50'} rounded-[24px] p-12 text-center hover:border-red-600/50 transition-all cursor-pointer group`}>
                    {selectedFile ? (
                      <div className="flex flex-col items-center">
                        <FileText className="text-green-600 mb-4" size={56} />
                        <p className="text-[#002147] font-black text-xs uppercase tracking-tight">{selectedFile.name}</p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="mx-auto text-slate-300 mb-4 group-hover:text-red-600 transition-all" size={56} />
                        <p className="text-slate-600 font-black text-xs uppercase tracking-tight">Click to browse CSV/Excel file</p>
                      </>
                    )}
                </div>

                <button onClick={handleFileProcess} disabled={isUploading || !selectedFile} className={`mt-8 w-full ${isUploading ? 'bg-slate-400' : (!selectedFile ? 'bg-slate-200' : 'bg-[#002147] hover:bg-red-600 text-white')} px-10 py-5 rounded-[20px] font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center justify-center gap-3`}>
                    {isUploading ? "Processing..." : "Process & Publish Results"}
                </button>
            </section>

            {/* --- SABON SECTION: STUDENT ACCESS (WANDA KA TAMBAYA) --- */}
            <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 text-left">
                <h3 className="text-[#002147] font-black uppercase text-xs tracking-widest mb-8 flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg"><Key className="text-purple-600" size={18} /></div>
                    Student Access Control
                </h3>
                <div className="space-y-4">
                    {approvedStudents.map((student) => (
                        <div key={student.id} className="flex flex-col sm:flex-row items-center justify-between p-5 bg-slate-50 rounded-[20px] border border-slate-100 gap-4">
                            <div className="flex items-center gap-4 w-full">
                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[#002147] font-black text-xs border border-slate-200 shadow-sm">
                                  {student.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-[#002147] uppercase leading-tight">{student.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{student.admissionNo}</p>
                                </div>
                            </div>
                            <button 
                              onClick={() => generateStudentAccount(student)}
                              disabled={loadingId === student.id}
                              className="w-full sm:w-auto bg-[#002147] hover:bg-purple-600 text-white px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                               {loadingId === student.id ? <Loader2 size={14} className="animate-spin"/> : <Send size={14} />}
                               {loadingId === student.id ? "Processing..." : "Generate & Send SMS"}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
      </main>
    </div>
  );
};

// Sub-Components
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${active ? "bg-red-600 text-white shadow-lg translate-x-2" : "hover:bg-white/5 text-slate-400 hover:text-white"}`}>
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

const StatsCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-[28px] shadow-sm border border-slate-100 flex justify-between items-center group">
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
      <h4 className="text-3xl font-black text-[#002147] mt-2">{value}</h4>
    </div>
    <div className="bg-slate-50 p-4 rounded-[20px] group-hover:bg-[#002147] group-hover:text-white transition-all">
        {icon}
    </div>
  </div>
);

export default ExamOfficerDashboard;