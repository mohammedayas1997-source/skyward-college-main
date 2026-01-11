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
  Globe, UserCircle2, ClipboardCheck, Printer, CheckCircle
} from "lucide-react";

const AdmissionOfficerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Applications");
  
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

  // --- DATA FETCHING ---
  useEffect(() => {
    const qAdmission = collection(db, "applications");
    const unsubAdmission = onSnapshot(qAdmission, (snapshot) => {
      const allData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setCandidates(allData);
    });

    const qStaff = query(collection(db, "users"), where("role", "==", "staff"));
    const unsubStaff = onSnapshot(qStaff, (snapshot) => {
      setStaffList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubPortal = onSnapshot(doc(db, "systemSettings", "admissionControl"), (docSnap) => {
      if (docSnap.exists()) setPortalSettings(docSnap.data());
    });

    return () => { unsubAdmission(); unsubStaff(); unsubPortal(); };
  }, []);

  // --- REAL-LIFE LOGIC FUNCTIONS ---

  // 1. Portal Toggle (Open/Close Admission)
  const togglePortal = async () => {
    setLoadingId("portal");
    try {
      await updateDoc(doc(db, "systemSettings", "admissionControl"), {
        isOpen: !portalSettings.isOpen,
        lastUpdated: serverTimestamp(),
        updatedBy: auth.currentUser?.email || "Admin"
      });
    } catch (e) { alert("Kuskure: " + e.message); }
    finally { setLoadingId(null); }
  };

  // 2. Logout Button
  const handleLogout = async () => {
    if(window.confirm("Are you sure you want to log out?")) {
      await auth.signOut();
      navigate("/login");
    }
  };

  // 3. Delete Rejected Applications
  const deleteRejected = async (id) => {
    if (window.confirm("Shin kana da tabbacin kana son goge wannan dalibin gaba daya?")) {
      setLoadingId(id);
      try { await deleteDoc(doc(db, "applications", id)); } 
      catch (e) { alert(e.message); }
      finally { setLoadingId(null); }
    }
  };

  // 4. Batch Selection
  const handleSelectAll = () => {
    const pendingIds = candidates.filter(c => c.status === "Paid").map(c => c.id);
    if (selectedItems.length === pendingIds.length) setSelectedItems([]);
    else setSelectedItems(pendingIds);
  };

  // 5. Send to Rector (Bulk)
  const sendBulkToRector = async () => {
    if (selectedItems.length === 0) return;
    setLoadingId("bulk");
    const batch = writeBatch(db);
    selectedItems.forEach(id => {
      batch.update(doc(db, "applications", id), {
        status: "Awaiting Rector Approval",
        sentToRectorAt: serverTimestamp(),
        officerInCharge: auth.currentUser?.displayName || "Admission Officer"
      });
    });
    try { 
      await batch.commit(); 
      setSelectedItems([]); 
      alert("An yi nasarar tura dukkan daliban zuwa ga Rector!"); 
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  // 6. Finalize Admission (Generating ID & Assigning Staff)
  const finalizeAdmission = async (candidate) => {
    if (!selectedCourse || !selectedStaff) return alert("Haba! Ka zabi Course da Malami mana.");
    setLoadingId(candidate.id);
    const idNumber = `SKY/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await updateDoc(doc(db, "applications", candidate.id), {
        status: "Approved",
        course: selectedCourse,
        assignedStaffId: selectedStaff,
        idNumber: idNumber,
        admissionDate: serverTimestamp()
      });
      alert(`Admission Successful! ID Number: ${idNumber}`);
      setSelectedCourse(""); setSelectedStaff("");
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  // 7. Print Dossier (Browser Print)
  const handlePrint = () => {
    window.print();
  };

  const filtered = candidates.filter(c => 
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (filterCourse === "All" || c.selectedCourse === filterCourse)
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc]">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#001529] text-white flex flex-col md:sticky md:top-0 md:h-screen print:hidden">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg"><School size={24}/></div>
          <h2 className="font-black uppercase tracking-tight text-xl italic">Skyward</h2>
        </div>
        <nav className="p-6 space-y-2 flex-grow">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active onClick={() => setActiveTab("Dashboard")} />
          <NavItem icon={<Users size={18}/>} label="Staff Directory" onClick={() => setActiveTab("Staff")} />
          <NavItem icon={<ClipboardCheck size={18}/>} label="Vetting Center" onClick={() => setActiveTab("Vetting")} />
          <NavItem icon={<Settings size={18}/>} label="Portal Settings" onClick={() => setActiveTab("Settings")} />
        </nav>
        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 hover:text-red-300 font-black text-[10px] uppercase transition-all">
            <LogOut size={18}/> Sign Out System
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-6 lg:p-12 print:p-0">
        {/* TOP ROW: Portal Control & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 print:hidden">
          <div className="lg:col-span-2 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${portalSettings.isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                <ShieldAlert size={28} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 uppercase text-sm">Application Portal</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Status: {portalSettings.isOpen ? 'LIVE & ACCEPTING' : 'PORTAL LOCKED'}
                </p>
              </div>
            </div>
            <button 
              onClick={togglePortal} 
              disabled={loadingId === "portal"}
              className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase transition-all shadow-lg active:scale-95 ${portalSettings.isOpen ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              {loadingId === "portal" ? <Loader2 className="animate-spin"/> : portalSettings.isOpen ? "Shut Down Portal" : "Activate Portal"}
            </button>
          </div>
          <div className="bg-blue-600 p-6 rounded-[30px] text-white flex flex-col justify-center shadow-xl shadow-blue-200">
             <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">Total Database</p>
             <h4 className="text-4xl font-black tabular-nums">{candidates.length}</h4>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 print:hidden">
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search student by name..." 
              className="w-full pl-14 pr-6 py-4 rounded-2xl border-none shadow-sm focus:ring-2 ring-blue-500 font-bold text-xs outline-none bg-white" 
              onChange={(e)=>setSearchTerm(e.target.value)} 
            />
          </div>
          <select 
            className="bg-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase shadow-sm outline-none border-none cursor-pointer hover:bg-slate-50"
            onChange={(e)=>setFilterCourse(e.target.value)}
          >
            <option value="All">All Departments</option>
            {courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* BATCH ACTION BAR */}
        {selectedItems.length > 0 && (
          <div className="mb-6 bg-[#001529] p-5 rounded-3xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl">
            <div className="flex items-center gap-4 ml-4">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-ping"></div>
              <p className="text-white font-black text-[10px] uppercase tracking-widest">{selectedItems.length} Students marked for review</p>
            </div>
            <button 
              onClick={sendBulkToRector} 
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2"
            >
              {loadingId === "bulk" ? <Loader2 className="animate-spin" size={14}/> : "Tura su duka zuwa ga Rector"}
            </button>
          </div>
        )}

        {/* TABLE LIST */}
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden print:hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
             <button onClick={handleSelectAll} className="flex items-center gap-3 text-[10px] font-black uppercase text-blue-600 hover:text-blue-800 transition-colors">
               {selectedItems.length > 0 ? <CheckSquare size={20}/> : <Square size={20}/>} Select All Pending Payments
             </button>
          </div>
          <div className="divide-y divide-slate-50">
            {filtered.map((c) => (
              <div key={c.id} className="p-6 flex flex-col lg:flex-row items-center gap-6 hover:bg-blue-50/30 transition-all group">
                {c.status === "Paid" && (
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(c.id)} 
                    onChange={() => setSelectedItems(prev => prev.includes(c.id) ? prev.filter(i => i !== c.id) : [...prev, c.id])} 
                    className="w-5 h-5 accent-blue-600 cursor-pointer" 
                  />
                )}
                
                <div className="relative">
                  <img src={c.passport || "https://via.placeholder.com/150"} className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white group-hover:scale-105 transition-transform" alt="Passport"/>
                  {c.status === "Approved" && <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white"><CheckCircle size={12}/></div>}
                </div>

                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <StatusTag status={c.status} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">{c.selectedCourse}</span>
                  </div>
                  <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight">{c.fullName}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Mail size={10}/> {c.email}</p>
                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Phone size={10}/> {c.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Details Button */}
                  <button 
                    onClick={() => setViewingStudent(c)} 
                    className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                    title="View Full Details"
                  >
                    <Eye size={18}/>
                  </button>

                  {/* Delete Button (Only for rejected) */}
                  {c.status === "Rejected by Rector" && (
                    <button 
                      onClick={() => deleteRejected(c.id)} 
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      title="Delete Application"
                    >
                      {loadingId === c.id ? <Loader2 className="animate-spin" size={18}/> : <Trash2 size={18}/>}
                    </button>
                  )}

                  {/* Finalization Section (Only for Rector Approved) */}
                  {c.status === "Rector Approved" && (
                    <div className="flex gap-2 items-center bg-emerald-50 p-2 rounded-2xl border border-emerald-100 shadow-inner">
                      <select 
                        onChange={(e) => setSelectedCourse(e.target.value)} 
                        className="bg-white text-[9px] font-black uppercase p-2 rounded-lg outline-none shadow-sm border border-emerald-100"
                      >
                        <option value="">Confirm Dept</option>
                        {courses.map(course => <option key={course} value={course}>{course}</option>)}
                      </select>
                      <select 
                        onChange={(e) => setSelectedStaff(e.target.value)} 
                        className="bg-white text-[9px] font-black uppercase p-2 rounded-lg outline-none shadow-sm border border-emerald-100"
                      >
                        <option value="">Assign Instructor</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                      </select>
                      <button 
                        onClick={() => finalizeAdmission(c)} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-black text-[9px] uppercase shadow-md active:scale-95"
                      >
                        {loadingId === c.id ? <Loader2 size={14} className="animate-spin"/> : <UserCheck size={14}/>}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL: FULL STUDENT DOSSIER (VETTING SYSTEM) */}
        {viewingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001529]/95 backdrop-blur-xl p-4 overflow-y-auto print:bg-white print:p-0">
            <div className="bg-white w-full max-w-5xl rounded-[50px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative print:shadow-none print:rounded-none">
              
              {/* Close Button */}
              <button 
                onClick={() => setViewingStudent(null)} 
                className="absolute top-8 right-8 p-3 bg-red-50 text-red-500 rounded-full z-10 hover:bg-red-500 hover:text-white transition-all print:hidden"
              >
                <X size={20}/>
              </button>
              
              {/* LEFT PROFILE PANEL */}
              <div className="md:w-1/3 bg-slate-50/50 p-10 border-r border-slate-100 text-center">
                <div className="relative inline-block">
                  <img src={viewingStudent.passport} className="w-48 h-48 rounded-[40px] object-cover border-8 border-white shadow-2xl mb-6 mx-auto" alt="Passport"/>
                  <div className="absolute -bottom-2 right-4 bg-white p-2 rounded-2xl shadow-lg border border-slate-100 print:hidden">
                    <UserCircle2 className="text-blue-600" size={24}/>
                  </div>
                </div>
                <h3 className="font-black text-xl text-slate-800 uppercase mb-2">{viewingStudent.fullName}</h3>
                <StatusTag status={viewingStudent.status} />
                
                <div className="mt-10 space-y-6 text-left">
                  <Detail icon={<Mail size={14}/>} label="Personal Email" value={viewingStudent.email} />
                  <Detail icon={<Phone size={14}/>} label="Contact Line" value={viewingStudent.phone} />
                  <Detail icon={<MapPin size={14}/>} label="State / LGA" value={`${viewingStudent.state} / ${viewingStudent.lga || 'N/A'}`} />
                  <Detail icon={<Calendar size={14}/>} label="Date of Birth" value={viewingStudent.dob || "N/A"} />
                </div>
              </div>

              {/* RIGHT ACADEMIC DOSSIER */}
              <div className="md:w-2/3 p-10 lg:p-14 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <header className="flex justify-between items-center mb-10 border-b pb-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
                      <ClipboardCheck className="text-blue-600" size={28}/> Academic Dossier
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Verification Reference: {viewingStudent.id?.slice(0, 8)}</p>
                  </div>
                  <button onClick={handlePrint} className="flex items-center gap-2 bg-slate-100 hover:bg-blue-600 hover:text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase transition-all print:hidden">
                    <Printer size={16}/> Print File
                  </button>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* O-Level Section */}
                  <section className="space-y-6">
                    <h4 className="text-[11px] font-black uppercase text-blue-600 border-l-4 border-blue-600 pl-3">O-Level (SSCE) Details</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <Detail label="Exam Body" value={viewingStudent.examBody} />
                      <Detail label="Examination Number" value={viewingStudent.examNumber} />
                      <Detail label="Year of Sitting" value={viewingStudent.examYear} />
                      <div className="p-5 bg-blue-50/50 rounded-3xl border-2 border-dashed border-blue-100">
                         <p className="text-[9px] font-black text-blue-400 uppercase mb-3">Verified Grades</p>
                         <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
                           {viewingStudent.grades || "English (C4), Mathematics (B3), Physics (A1), Chemistry (C5), Geography (B2), Economics (B3)."}
                         </p>
                      </div>
                    </div>
                  </section>

                  {/* Previous Schooling */}
                  <section className="space-y-6">
                    <h4 className="text-[11px] font-black uppercase text-blue-600 border-l-4 border-blue-600 pl-3">Higher Education Info</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <Detail label="Last Institution" value={viewingStudent.lastSchool} />
                      <Detail label="Qualification Obtained" value={viewingStudent.qualification} />
                      <Detail label="Major/Course" value={viewingStudent.prevCourse} />
                      <Detail label="Graduation Status" value={viewingStudent.gradYear} />
                    </div>
                  </section>

                  {/* Application Audit */}
                  <section className="md:col-span-2 bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                      <ShieldAlert size={120}/>
                    </div>
                    <h4 className="text-[10px] font-black uppercase text-blue-400 mb-6 tracking-widest flex items-center gap-2">
                      <FileText size={14}/> Admission Workflow Data
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Applied Program</p>
                        <p className="text-xs font-bold uppercase">{viewingStudent.selectedCourse}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Study Mode</p>
                        <p className="text-xs font-bold uppercase">{viewingStudent.studyMode || "Campus-Based"}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Submission Date</p>
                        <p className="text-xs font-bold">{viewingStudent.createdAt?.toDate().toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Payment Status</p>
                        <p className="text-xs font-black text-emerald-400 uppercase">Successful / Paid</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Ref ID</p>
                        <p className="text-[10px] font-mono text-slate-300">{viewingStudent.paymentRef || "TRX-99201-SKY"}</p>
                      </div>
                    </div>
                  </section>
                </div>
                
                <div className="mt-12 flex flex-col sm:flex-row gap-4 print:hidden">
                  <button className="flex-grow flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[20px] font-black text-xs uppercase shadow-xl shadow-blue-200 transition-all active:scale-95">
                    <CheckCircle size={18}/> Verify & Authorize
                  </button>
                  <button className="sm:w-1/3 bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-600 py-5 rounded-[20px] font-black text-xs uppercase transition-all">
                    Flag Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- REUSABLE UI COMPONENTS ---
const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const StatusTag = ({ status }) => {
  const styles = {
    "Paid": "bg-blue-50 text-blue-600 border border-blue-100",
    "Awaiting Rector Approval": "bg-amber-50 text-amber-600 border border-amber-100 animate-pulse",
    "Rector Approved": "bg-purple-50 text-purple-600 border border-purple-100",
    "Approved": "bg-emerald-50 text-emerald-600 border border-emerald-100",
    "Rejected by Rector": "bg-red-50 text-red-600 border border-red-100"
  };
  return <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-tighter shadow-sm ${styles[status]}`}>{status}</span>;
};

const Detail = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    {icon && <span className="text-blue-500 mt-0.5 bg-blue-50 p-1.5 rounded-lg">{icon}</span>}
    <div className="overflow-hidden">
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="font-bold text-slate-800 text-xs uppercase truncate whitespace-pre-wrap">{value || "---"}</p>
    </div>
  </div>
);

export default AdmissionOfficerDashboard;