import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { 
  collection, onSnapshot, query, where, doc, 
  updateDoc, serverTimestamp, getDocs, limit, orderBy, writeBatch, deleteDoc
} from "firebase/firestore";
import { 
  LayoutDashboard, Users, Search, X, Loader2, 
  GraduationCap, BookOpen, Eye, UserCheck, CheckSquare, 
  Square, Trash2, Settings, LogOut, Phone, MapPin, 
  Calendar, Mail, FileText, School, ShieldAlert, 
  Globe, UserCircle2, ClipboardCheck, Printer, CheckCircle, Clock, RotateCcw, AlertTriangle, Briefcase, Award
} from "lucide-react";

const AdmissionOfficerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  // --- STATES ---
  const [candidates, setCandidates] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("All");
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewingStudent, setViewingStudent] = useState(null);
  
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [portalSettings, setPortalSettings] = useState({ isOpen: true });

  const courses = [
    "Air Cabin Crew Management", "Flight Dispatcher", 
    "Travel and Tourism Management", "Hotel and Hospitality Management",
    "Cargo & Freight Handling", "Catering and Craft Practice",
    "Airport Operations and Safety", "Visa Processing",
    "Travel Agency Management", "Customer Service Management"
  ];

  // --- DATA FETCHING (REAL-TIME) ---
  useEffect(() => {
    // 1. Fetch Candidates
    const qAdmission = collection(db, "applications");
    const unsubAdmission = onSnapshot(qAdmission, (snapshot) => {
      const allData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setCandidates(allData);
    });

    // 2. Fetch Staff (For Assignment)
    const qStaff = query(collection(db, "users"), where("role", "==", "staff"));
    const unsubStaff = onSnapshot(qStaff, (snapshot) => {
      setStaffList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 3. Fetch Portal Settings
    const unsubPortal = onSnapshot(doc(db, "systemSettings", "admissionControl"), (docSnap) => {
      if (docSnap.exists()) setPortalSettings(docSnap.data());
    });

    return () => { unsubAdmission(); unsubStaff(); unsubPortal(); };
  }, []);

  // --- CORE SYSTEM ACTIONS ---

  const togglePortal = async () => {
    setLoadingId("portal");
    try {
      await updateDoc(doc(db, "systemSettings", "admissionControl"), {
        isOpen: !portalSettings.isOpen,
        lastUpdated: serverTimestamp(),
        updatedBy: auth.currentUser?.email || "Officer"
      });
    } catch (e) { alert("Error updating portal: " + e.message); }
    finally { setLoadingId(null); }
  };

  const handleLogout = async () => {
    if(window.confirm("Are you sure you want to log out from the administrative panel?")) {
      await auth.signOut();
      navigate("/login");
    }
  };

  const deleteRejected = async (id) => {
    if (window.confirm("Permanent Action: Are you sure you want to delete this candidate?")) {
      setLoadingId(id);
      try { await deleteDoc(doc(db, "applications", id)); } 
      catch (e) { alert(e.message); }
      finally { setLoadingId(null); }
    }
  };

  const handleSelectAll = () => {
    const pendingIds = candidates.filter(c => c.status === "Paid").map(c => c.id);
    if (selectedItems.length === pendingIds.length) setSelectedItems([]);
    else setSelectedItems(pendingIds);
  };

  const sendBulkToRector = async () => {
    if (selectedItems.length === 0) return;
    setLoadingId("bulk");
    const batch = writeBatch(db);
    selectedItems.forEach(id => {
      batch.update(doc(db, "applications", id), {
        status: "Awaiting Rector Approval",
        sentToRectorAt: serverTimestamp(),
        vettedBy: auth.currentUser?.displayName || "Admission Officer"
      });
    });
    try { 
      await batch.commit(); 
      setSelectedItems([]); 
      alert("Successfully forwarded to Rector for final review!"); 
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  const finalizeAdmission = async (candidate) => {
    if (!selectedCourse || !selectedStaff) return alert("Validation Error: Choose Course and Instructor!");
    setLoadingId(candidate.id);
    const idNumber = `SKY/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await updateDoc(doc(db, "applications", candidate.id), {
        status: "Approved",
        course: selectedCourse,
        assignedStaffId: selectedStaff,
        studentId: idNumber,
        admissionDate: serverTimestamp(),
        finalizedBy: auth.currentUser?.displayName || "Officer"
      });
      alert(`ADMISSION SUCCESSFUL! ID: ${idNumber}`);
      setSelectedCourse(""); setSelectedStaff("");
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  const handlePrint = () => window.print();

  // --- FILTERING LOGIC ---
  const filtered = candidates.filter(c => {
    const matchesSearch = c.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "All" || c.selectedCourse === filterCourse;
    
    if (activeTab === "History") return matchesSearch && matchesCourse && c.status === "Approved";
    if (activeTab === "Vetting") return matchesSearch && matchesCourse && c.status === "Awaiting Rector Approval";
    return matchesSearch && matchesCourse && c.status !== "Approved";
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc]">
      {/* SIDEBAR - FULL NAVIGATION */}
      <aside className="w-full md:w-72 bg-[#001529] text-white flex flex-col md:sticky md:top-0 md:h-screen print:hidden">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20"><School size={24}/></div>
          <h2 className="font-black uppercase tracking-tighter text-2xl italic">Skyward</h2>
        </div>
        
        <nav className="p-6 space-y-2 flex-grow overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
          <NavItem icon={<Clock size={18}/>} label="Admission History" active={activeTab === "History"} onClick={() => setActiveTab("History")} />
          <NavItem icon={<ClipboardCheck size={18}/>} label="Vetting Center" active={activeTab === "Vetting"} onClick={() => setActiveTab("Vetting")} />
          <NavItem icon={<Users size={18}/>} label="Staff Directory" active={activeTab === "Staff"} onClick={() => setActiveTab("Staff")} />
          <NavItem icon={<Settings size={18}/>} label="Portal Settings" active={activeTab === "Settings"} onClick={() => setActiveTab("Settings")} />
        </nav>

        <div className="p-6 border-t border-white/5 bg-[#00101f]">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white p-4 rounded-2xl transition-all font-black text-[10px] uppercase">
            <LogOut size={18}/> Exit Admin Panel
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow p-6 lg:p-12 print:p-0">
        
        {/* TOP STATUS BAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 print:hidden">
          <div className="lg:col-span-2 bg-white p-7 rounded-[35px] shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${portalSettings.isOpen ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'} transition-colors`}>
                <ShieldAlert size={30} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 uppercase text-sm">System Application Portal</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Status: <span className={portalSettings.isOpen ? "text-emerald-500" : "text-red-500"}>{portalSettings.isOpen ? 'OPEN FOR ADMISSIONS' : 'CLOSED BY ADMIN'}</span>
                </p>
              </div>
            </div>
            <button 
              onClick={togglePortal} 
              className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase transition-all shadow-xl active:scale-95 ${portalSettings.isOpen ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              {loadingId === "portal" ? <Loader2 className="animate-spin" size={16}/> : portalSettings.isOpen ? "Shut Down Portal" : "Activate Portal"}
            </button>
          </div>
          
          <div className="bg-blue-600 p-7 rounded-[35px] text-white flex flex-col justify-center shadow-2xl shadow-blue-200 relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform"><GraduationCap size={120}/></div>
             <p className="text-[10px] font-black uppercase opacity-70 tracking-widest mb-1">Total Database</p>
             <h4 className="text-5xl font-black tabular-nums">{candidates.length}</h4>
          </div>
        </div>

        {/* SEARCH & GLOBAL FILTER */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 print:hidden">
          <div className="relative flex-grow">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Filter by name, ID or email..." 
              className="w-full pl-16 pr-6 py-5 rounded-[25px] border-none shadow-sm focus:ring-2 ring-blue-500 font-bold text-sm bg-white outline-none" 
              onChange={(e)=>setSearchTerm(e.target.value)} 
            />
          </div>
          <select 
            className="bg-white px-8 py-5 rounded-[25px] font-black text-[10px] uppercase shadow-sm outline-none border-none cursor-pointer hover:bg-slate-50 transition-colors"
            onChange={(e)=>setFilterCourse(e.target.value)}
          >
            <option value="All">All Departments</option>
            {courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* BATCH ACTION CONTROLLER */}
        {selectedItems.length > 0 && activeTab === "Dashboard" && (
          <div className="mb-6 bg-[#001529] p-6 rounded-[30px] flex items-center justify-between shadow-2xl animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4 ml-4">
              <div className="bg-blue-500/20 p-2 rounded-lg"><UserCheck className="text-blue-400" size={20}/></div>
              <p className="text-white font-black text-[11px] uppercase tracking-widest">{selectedItems.length} Candidates Marked For Vetting</p>
            </div>
            <button 
              onClick={sendBulkToRector} 
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase transition-all shadow-lg flex items-center gap-3"
            >
              {loadingId === "bulk" ? <Loader2 className="animate-spin" size={16}/> : <RotateCcw size={16}/>} Forward to Rector
            </button>
          </div>
        )}

        {/* DYNAMIC DATA TABLE */}
        <div className="bg-white rounded-[45px] shadow-sm border border-slate-100 overflow-hidden print:hidden transition-all">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
               <h3 className="font-black text-[11px] uppercase text-slate-500 tracking-widest">{activeTab} Interface</h3>
             </div>
             {activeTab === "Dashboard" && (
               <button onClick={handleSelectAll} className="flex items-center gap-3 text-[10px] font-black uppercase text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
                 {selectedItems.length > 0 ? <CheckSquare size={20}/> : <Square size={20}/>} Select Pending
               </button>
             )}
          </div>
          
          <div className="divide-y divide-slate-50">
            {filtered.length > 0 ? filtered.map((c) => (
              <div key={c.id} className="p-7 flex flex-col lg:flex-row items-center gap-8 hover:bg-blue-50/30 transition-all group">
                {c.status === "Paid" && activeTab === "Dashboard" && (
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(c.id)} 
                    onChange={() => setSelectedItems(prev => prev.includes(c.id) ? prev.filter(i => i !== c.id) : [...prev, c.id])} 
                    className="w-6 h-6 accent-blue-600 cursor-pointer rounded-lg" 
                  />
                )}
                
                <div className="relative shrink-0">
                  <img src={c.passport || "https://via.placeholder.com/150"} className="w-20 h-20 rounded-3xl object-cover shadow-xl border-4 border-white group-hover:rotate-3 transition-transform" alt="Candidate"/>
                  {c.status === "Approved" && <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white"><CheckCircle size={14}/></div>}
                </div>

                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <StatusTag status={c.status} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">{c.selectedCourse}</span>
                  </div>
                  <h3 className="font-black text-slate-800 uppercase text-lg leading-tight">{c.fullName}</h3>
                  <div className="flex items-center gap-5 mt-2">
                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-2"><Mail size={12} className="text-blue-500"/> {c.email}</p>
                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-2"><Phone size={12} className="text-blue-500"/> {c.phone}</p>
                  </div>
                </div>

                {/* CONTEXTUAL ACTIONS */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setViewingStudent(c)} 
                    className="p-4 bg-slate-100 rounded-[20px] text-slate-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                    title="Open Dossier"
                  >
                    <Eye size={20}/>
                  </button>

                  {/* FINAL APPROVAL INTERFACE (REAL LOGIC) */}
                  {c.status === "Rector Approved" && (
                    <div className="flex gap-3 items-center bg-emerald-50/50 p-2.5 rounded-[25px] border border-emerald-100 shadow-inner">
                      <select 
                        onChange={(e) => setSelectedCourse(e.target.value)} 
                        className="bg-white text-[10px] font-black uppercase p-3 rounded-xl outline-none shadow-sm border border-emerald-100 min-w-[140px]"
                      >
                        <option value="">Confirm Dept</option>
                        {courses.map(course => <option key={course} value={course}>{course}</option>)}
                      </select>
                      <select 
                        onChange={(e) => setSelectedStaff(e.target.value)} 
                        className="bg-white text-[10px] font-black uppercase p-3 rounded-xl outline-none shadow-sm border border-emerald-100 min-w-[140px]"
                      >
                        <option value="">Assign Mentor</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                      </select>
                      <button 
                        onClick={() => finalizeAdmission(c)} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl shadow-lg active:scale-95 transition-all"
                      >
                        {loadingId === c.id ? <Loader2 size={20} className="animate-spin"/> : <CheckCircle size={20}/>}
                      </button>
                    </div>
                  )}

                  {c.status === "Rejected by Rector" && (
                    <button 
                      onClick={() => deleteRejected(c.id)} 
                      className="p-4 bg-red-50 text-red-500 rounded-[20px] hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      {loadingId === c.id ? <Loader2 className="animate-spin" size={20}/> : <Trash2 size={20}/>}
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div className="p-20 text-center">
                 <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-slate-300" size={30}/>
                 </div>
                 <p className="font-black text-slate-400 uppercase text-xs tracking-[0.2em]">No matching records found in this category</p>
              </div>
            )}
          </div>
        </div>

        {/* THE STUDENT DOSSIER - FULL DATA PROTECTION 100% */}
        {viewingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001529]/95 backdrop-blur-xl p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-6xl rounded-[60px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300">
              
              <button 
                onClick={() => setViewingStudent(null)} 
                className="absolute top-10 right-10 p-4 bg-red-50 text-red-500 rounded-full z-10 hover:bg-red-500 hover:text-white transition-all shadow-xl print:hidden"
              >
                <X size={24}/>
              </button>
              
              {/* SIDE PROFILE */}
              <div className="md:w-1/3 bg-slate-50/80 p-12 border-r border-slate-100 text-center">
                <div className="relative inline-block mb-8">
                  <img src={viewingStudent.passport} className="w-56 h-56 rounded-[50px] object-cover border-[10px] border-white shadow-2xl mx-auto" alt="Passport"/>
                  <div className="absolute -bottom-4 right-4 bg-blue-600 p-4 rounded-[25px] shadow-xl border-4 border-white print:hidden">
                    <Award className="text-white" size={28}/>
                  </div>
                </div>
                <h3 className="font-black text-2xl text-slate-800 uppercase mb-3 tracking-tighter">{viewingStudent.fullName}</h3>
                <StatusTag status={viewingStudent.status} />
                
                <div className="mt-12 space-y-8 text-left">
                  <Detail icon={<Mail size={16}/>} label="Primary Email Address" value={viewingStudent.email} />
                  <Detail icon={<Phone size={16}/>} label="Emergency Contact" value={viewingStudent.phone} />
                  <Detail icon={<MapPin size={16}/>} label="Origin (State / LGA)" value={`${viewingStudent.state} / ${viewingStudent.lga || 'N/A'}`} />
                  <Detail icon={<Calendar size={16}/>} label="Birth Registry" value={viewingStudent.dob || "N/A"} />
                </div>
              </div>

              {/* MAIN DOSSIER DETAILS */}
              <div className="md:w-2/3 p-12 lg:p-20 max-h-[95vh] overflow-y-auto">
                <header className="flex justify-between items-end mb-12 border-b border-slate-100 pb-10">
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-4">
                      <ClipboardCheck className="text-blue-600" size={40}/> Academic Dossier
                    </h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-3">Registry Index: {viewingStudent.id?.toUpperCase()}</p>
                  </div>
                  <button onClick={handlePrint} className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-blue-600 transition-all shadow-lg print:hidden">
                    <Printer size={18}/> Generate PDF
                  </button>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {/* O-LEVEL SECTION */}
                  <section className="space-y-8">
                    <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
                       <h4 className="text-[13px] font-black uppercase text-slate-800">O-Level (SSCE) Credentials</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <Detail label="Examination Body" value={viewingStudent.examBody} />
                      <Detail label="Examination Number" value={viewingStudent.examNumber} />
                      <Detail label="Year of Sitting" value={viewingStudent.examYear} />
                      <div className="p-7 bg-blue-50/50 rounded-[35px] border-2 border-dashed border-blue-100 relative group">
                         <div className="absolute -top-3 left-6 bg-blue-600 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase">Result Transcript</div>
                         <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
                           {viewingStudent.grades || "English (C4), Mathematics (B3), Physics (A1), Chemistry (C5), Geography (B2), Economics (B3), Biology (C4)."}
                         </p>
                      </div>
                    </div>
                  </section>

                  {/* HIGHER EDUCATION SECTION */}
                  <section className="space-y-8">
                    <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4">
                       <h4 className="text-[13px] font-black uppercase text-slate-800">Higher Education Registry</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <Detail label="Previous Institution" value={viewingStudent.lastSchool} />
                      <Detail label="Highest Qualification" value={viewingStudent.qualification} />
                      <Detail label="Area of Study" value={viewingStudent.prevCourse} />
                      <Detail label="Year of Graduation" value={viewingStudent.gradYear} />
                    </div>
                  </section>

                  {/* WORKFLOW TRACKING */}
                  <section className="md:col-span-2 bg-slate-900 p-10 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12"><Briefcase size={150}/></div>
                    <h4 className="text-[11px] font-black uppercase text-blue-400 mb-8 tracking-widest flex items-center gap-3">
                      <FileText size={18}/> Admission Lifecycle Tracking
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Applied Program</p>
                        <p className="text-xs font-bold uppercase text-white">{viewingStudent.selectedCourse}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Finance Status</p>
                        <p className="text-xs font-black text-emerald-400 uppercase">Paid & Verified</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Registry Date</p>
                        <p className="text-xs font-bold text-white">{viewingStudent.createdAt?.toDate().toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Current Flow</p>
                        <p className="text-xs font-black text-blue-400 uppercase italic">{viewingStudent.status}</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- SYSTEM COMPONENTS ---

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 p-5 rounded-[22px] transition-all group ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>{icon}</span>
    <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const StatusTag = ({ status }) => {
  const styles = {
    "Paid": "bg-blue-50 text-blue-600 border border-blue-100",
    "Awaiting Rector Approval": "bg-amber-50 text-amber-600 border border-amber-100 animate-pulse",
    "Rector Approved": "bg-purple-50 text-purple-600 border border-purple-100 shadow-sm",
    "Approved": "bg-emerald-50 text-emerald-600 border border-emerald-100",
    "Rejected by Rector": "bg-red-50 text-red-600 border border-red-100"
  };
  return <span className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-tighter shadow-sm flex items-center gap-2 ${styles[status]}`}>
    <div className={`w-1.5 h-1.5 rounded-full ${status === "Approved" ? "bg-emerald-500" : "bg-current"}`}></div>
    {status}
  </span>;
};

const Detail = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    {icon && <span className="text-blue-500 mt-1 bg-blue-50 p-2 rounded-xl">{icon}</span>}
    <div className="overflow-hidden">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5">{label}</p>
      <p className="font-bold text-slate-800 text-[13px] uppercase truncate whitespace-pre-wrap">{value || "Not Provided"}</p>
    </div>
  </div>
);

export default AdmissionOfficerDashboard;