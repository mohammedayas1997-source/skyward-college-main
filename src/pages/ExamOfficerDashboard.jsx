import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
// Firebase imports dinka suna nan daram
import { db, auth } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { 
  LayoutDashboard, UploadCloud, Users, FileCheck, 
  Settings, LogOut, Bell, Search, Clock, CheckCircle, FileText, X,
  Key, ShieldCheck, Loader2, Send, ChevronRight
} from "lucide-react";

const ExamOfficerDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // --- STATES NA CREDENTIALS ---
  const [loadingId, setLoadingId] = useState(null);
  const [approvedStudents, setApprovedStudents] = useState([
    { id: "STU001", name: "Musa Yahaya", email: "musa@example.com", admissionNo: "GTI/2026/4521", phone: "08012345678" },
    { id: "STU002", name: "Zainab Aliyu", email: "zainab@example.com", admissionNo: "GTI/2026/8832", phone: "09088776655" },
  ]);

  // --- AIKIN GENERATE USER & PASSWORD (AUTOMATIC) ---
  const generateStudentAccount = async (student) => {
    setLoadingId(student.id);
    const initialPassword = "Welcome@ChangeMe123"; 

    try {
      // 1. Kirkirar User a Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, student.email, initialPassword);
      const uid = userCredential.user.uid;

      // 2. Ajiye bayanan a Firestore
      await setDoc(doc(db, "users", uid), {
        uid: uid,
        fullName: student.name,
        email: student.email,
        admissionNo: student.admissionNo,
        phone: student.phone,
        role: "student",
        isFirstLogin: true, 
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
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] font-sans text-left overflow-x-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#001529] text-white flex flex-col md:sticky md:top-0 md:h-screen shadow-2xl z-50">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">Skyward</h2>
          </div>
          <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em] ml-1">Examination Office</p>
        </div>
        
        <nav className="flex-grow p-6 space-y-3 mt-4">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Overview" active />
          <NavItem icon={<UploadCloud size={18}/>} label="Result Upload" />
          <NavItem icon={<Users size={18}/>} label="Student Database" />
          <NavItem icon={<FileCheck size={18}/>} label="Transcripts" />
          <NavItem icon={<Settings size={18}/>} label="Control Panel" />
        </nav>

        <div className="p-6 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.2em]">
            <LogOut size={18} /> Exit Dashboard
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-6 md:p-12">
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search by Reg No or Name..." className="pl-14 pr-6 py-4 w-full bg-slate-50 rounded-2xl outline-none text-[12px] font-bold border border-transparent focus:bg-white focus:border-red-600/20 transition-all" />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 cursor-pointer transition-all">
                <Bell className="text-slate-600" size={20} />
                <span className="absolute top-3 right-3 bg-red-600 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse"></span>
            </div>
            <div className="h-12 w-[1px] bg-slate-100 hidden sm:block"></div>
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-[#002147] uppercase leading-none">Exam Officer</p>
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-1">Authenticated</p>
                </div>
                <div className="w-12 h-12 bg-[#001529] text-white rounded-2xl flex items-center justify-center font-black shadow-xl border-2 border-red-600/20">EO</div>
            </div>
          </div>
        </header>

        {uploadSuccess && (
          <div className="mb-8 p-6 bg-emerald-500 text-white rounded-[24px] flex items-center justify-between animate-in slide-in-from-top duration-500 shadow-xl shadow-emerald-500/20">
            <div className="flex items-center gap-4">
              <CheckCircle size={24} />
              <span className="text-xs font-black uppercase tracking-[0.15em]">Academic Results Published Successfully!</span>
            </div>
            <X size={20} className="cursor-pointer" onClick={() => setUploadSuccess(false)}/>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          <StatsCard title="Total Students" value="1,240" icon={<Users size={22}/>} color="blue" />
          <StatsCard title="Upload Progress" value="85%" icon={<FileCheck size={22}/>} color="emerald" />
          <StatsCard title="Verified Accounts" value="1,112" icon={<ShieldCheck size={22}/>} color="purple" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            
            {/* UPLOAD SECTION */}
            <section className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <UploadCloud size={150} />
                </div>
                <h3 className="text-[#002147] font-black uppercase text-xs tracking-[0.2em] mb-10 flex items-center gap-3">
                    <div className="p-3 bg-red-50 rounded-2xl text-red-600 shadow-sm"><UploadCloud size={20}/></div> 
                    Bulk Result Publication
                </h3>

                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Session</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase outline-none focus:ring-2 ring-red-600/10">
                            <option>2025/2026</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Semester</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase outline-none focus:ring-2 ring-red-600/10">
                            <option>1st Semester</option>
                            <option>2nd Semester</option>
                        </select>
                    </div>
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv, .xlsx, .xls"/>
                <div 
                  onClick={triggerFileInput} 
                  className={`border-3 border-dashed transition-all duration-500 cursor-pointer rounded-[35px] p-16 text-center 
                  ${selectedFile ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-red-600/30 hover:bg-white hover:shadow-xl'}`}
                >
                    {selectedFile ? (
                      <div className="flex flex-col items-center animate-in zoom-in">
                        <div className="h-20 w-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-4 text-emerald-600">
                          <FileText size={40} />
                        </div>
                        <p className="text-[#002147] font-black text-sm uppercase tracking-tight">{selectedFile.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Ready for processing</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="h-20 w-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-4 text-slate-300">
                          <UploadCloud size={40} />
                        </div>
                        <p className="text-slate-600 font-black text-xs uppercase tracking-[0.1em]">Drop files here or click to browse</p>
                        <p className="text-[9px] font-bold text-slate-300 mt-2 uppercase">CSV, Excel (Max 10MB)</p>
                      </div>
                    )}
                </div>

                <button 
                  onClick={handleFileProcess} 
                  disabled={isUploading || !selectedFile} 
                  className={`mt-10 w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-xl 
                  ${isUploading ? 'bg-slate-100 text-slate-400' : (!selectedFile ? 'bg-slate-50 text-slate-300' : 'bg-[#001529] text-white hover:bg-red-600 shadow-red-900/10')}`}
                >
                    {isUploading ? <Loader2 className="animate-spin" size={20}/> : <FileCheck size={20}/>}
                    {isUploading ? "Validating Records..." : "Process & Publish Results"}
                </button>
            </section>

            {/* STUDENT ACCESS CONTROL */}
            <section className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100">
                <h3 className="text-[#002147] font-black uppercase text-xs tracking-[0.2em] mb-10 flex items-center gap-3">
                    <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 shadow-sm"><Key size={20} /></div>
                    Student Access Provisioning
                </h3>
                <div className="space-y-5">
                    {approvedStudents.map((student) => (
                        <div key={student.id} className="group flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50 hover:bg-white rounded-[30px] border border-transparent hover:border-slate-100 hover:shadow-xl transition-all duration-300 gap-6">
                            <div className="flex items-center gap-5 w-full">
                                <div className="h-14 w-14 bg-white rounded-[20px] flex items-center justify-center text-[#001529] font-black text-lg border border-slate-100 shadow-sm group-hover:rotate-6 transition-transform">
                                  {student.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[13px] font-black text-[#002147] uppercase tracking-tight">{student.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.admissionNo}</p>
                                      <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                                      <p className="text-[10px] font-bold text-emerald-500 uppercase">Verified</p>
                                    </div>
                                </div>
                            </div>
                            <button 
                              onClick={() => generateStudentAccount(student)}
                              disabled={loadingId === student.id}
                              className="w-full sm:w-auto bg-white hover:bg-[#001529] hover:text-white text-[#001529] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border border-slate-200 shadow-sm group-hover:border-transparent whitespace-nowrap active:scale-95"
                            >
                               {loadingId === student.id ? <Loader2 size={16} className="animate-spin"/> : <Send size={16} />}
                               {loadingId === student.id ? "Syncing..." : "Activate Portal"}
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="mt-10 p-6 bg-purple-50 rounded-[30px] border border-purple-100 flex items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl text-purple-600"><ShieldCheck size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-[#002147] uppercase">Batch Provisioning</p>
                    <p className="text-[9px] font-bold text-purple-400 uppercase mt-1">Generate credentials for all verified students</p>
                  </div>
                  <ChevronRight className="ml-auto text-purple-300" size={20}/>
                </div>
            </section>
        </div>
      </main>
    </div>
  );
};

// Sub-Components
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 group ${active ? "bg-red-600 text-white shadow-xl shadow-red-900/20 translate-x-2" : "hover:bg-white/5 text-slate-500 hover:text-white"}`}>
    <span className={`${active ? "text-white" : "group-hover:text-red-500"} transition-colors`}>{icon}</span>
    <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
  </div>
);

const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[35px] shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-xl transition-all">
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <h4 className="text-3xl font-black text-[#002147] tracking-tighter">{value}</h4>
    </div>
    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all bg-${color}-50 text-${color}-600 group-hover:scale-110 group-hover:rotate-6`}>
        {icon}
    </div>
  </div>
);

export default ExamOfficerDashboard;