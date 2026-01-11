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
  Globe, UserCircle2, ClipboardCheck
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

  // --- LOGIC FUNCTIONS ---
  const togglePortal = async () => {
    setLoadingId("portal");
    try {
      await updateDoc(doc(db, "systemSettings", "admissionControl"), {
        isOpen: !portalSettings.isOpen,
        lastUpdated: serverTimestamp()
      });
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  const deleteRejected = async (id) => {
    if (window.confirm("Delete this rejected application permanently?")) {
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
        sentToRectorAt: serverTimestamp()
      });
    });
    try { await batch.commit(); setSelectedItems([]); alert("Forwarded to Rector!"); } 
    catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  const finalizeAdmission = async (candidate) => {
    if (!selectedCourse || !selectedStaff) return alert("Select Dept and Staff!");
    setLoadingId(candidate.id);
    const idNumber = `SKY/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await updateDoc(doc(db, "applications", candidate.id), {
        status: "Approved", course: selectedCourse, assignedStaffId: selectedStaff, idNumber, finalizedAt: serverTimestamp()
      });
      alert(`Admission Finalized: ${idNumber}`);
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  const filtered = candidates.filter(c => 
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (filterCourse === "All" || c.selectedCourse === filterCourse)
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc]">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#001529] text-white flex flex-col md:sticky md:top-0 md:h-screen">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg"><School size={24}/></div>
          <h2 className="font-black uppercase tracking-tight text-xl italic">Skyward</h2>
        </div>
        <nav className="p-6 space-y-2 flex-grow">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Admissions" active />
          <NavItem icon={<Users size={18}/>} label="Instructors" />
          <NavItem icon={<Settings size={18}/>} label="Settings" />
        </nav>
        <div className="p-6 border-t border-white/5">
          <button className="flex items-center gap-3 text-red-400 font-bold text-xs uppercase"><LogOut size={18}/> Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-6 lg:p-12">
        {/* TOP ROW: Portal Control & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${portalSettings.isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                <ShieldAlert size={28} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 uppercase text-sm">Application Portal</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Currently: {portalSettings.isOpen ? 'Accepting Forms' : 'Portal Locked'}</p>
              </div>
            </div>
            <button onClick={togglePortal} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase transition-all shadow-lg ${portalSettings.isOpen ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
              {loadingId === "portal" ? <Loader2 className="animate-spin"/> : portalSettings.isOpen ? "Close Application" : "Open Application"}
            </button>
          </div>
          <div className="bg-blue-600 p-6 rounded-[30px] text-white flex flex-col justify-center">
             <p className="text-[10px] font-black uppercase opacity-70">Total Applications</p>
             <h4 className="text-3xl font-black">{candidates.length}</h4>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input type="text" placeholder="Search by name..." className="w-full pl-14 pr-6 py-4 rounded-2xl border-none shadow-sm focus:ring-2 ring-blue-500 font-bold text-xs outline-none" onChange={(e)=>setSearchTerm(e.target.value)} />
          </div>
          <select className="bg-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase shadow-sm outline-none border-none cursor-pointer" onChange={(e)=>setFilterCourse(e.target.value)}>
            <option value="All">All Departments</option>
            {courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* BATCH ACTION */}
        {selectedItems.length > 0 && (
          <div className="mb-6 bg-[#001529] p-4 rounded-2xl flex items-center justify-between animate-bounce">
            <p className="text-white font-black text-[10px] uppercase ml-4">{selectedItems.length} Students Selected for Review</p>
            <button onClick={sendBulkToRector} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase">Commit Batch to Rector</button>
          </div>
        )}

        {/* TABLE LIST */}
        <div className="bg-white rounded-[35px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50">
             <button onClick={handleSelectAll} className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600">
               {selectedItems.length > 0 ? <CheckSquare size={18}/> : <Square size={18}/>} Select All Pending
             </button>
          </div>
          <div className="divide-y divide-slate-50">
            {filtered.map((c) => (
              <div key={c.id} className="p-6 flex flex-col lg:flex-row items-center gap-6 hover:bg-slate-50/50 transition-all">
                {c.status === "Paid" && (
                  <input type="checkbox" checked={selectedItems.includes(c.id)} onChange={() => setSelectedItems(prev => prev.includes(c.id) ? prev.filter(i => i !== c.id) : [...prev, c.id])} className="w-5 h-5 accent-blue-600" />
                )}
                <img src={c.passport || "https://via.placeholder.com/150"} className="w-16 h-16 rounded-2xl object-cover shadow-sm border-2 border-white" alt="Avatar"/>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusTag status={c.status} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.selectedCourse}</span>
                  </div>
                  <h3 className="font-black text-slate-800 uppercase text-sm">{c.fullName}</h3>
                  <p className="text-[10px] font-bold text-slate-400 italic">{c.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setViewingStudent(c)} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-blue-600 hover:text-white transition-all"><Eye size={18}/></button>
                  {c.status === "Rejected by Rector" && (
                    <button onClick={() => deleteRejected(c.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                      {loadingId === c.id ? <Loader2 className="animate-spin" size={18}/> : <Trash2 size={18}/>}
                    </button>
                  )}
                  {c.status === "Rector Approved" && (
                    <div className="flex gap-2 items-center bg-blue-50 p-2 rounded-2xl border border-blue-100">
                      <select onChange={(e) => setSelectedCourse(e.target.value)} className="bg-white text-[9px] font-black uppercase p-2 rounded-lg outline-none shadow-sm">
                        <option value="">Set Dept</option>
                        {courses.map(course => <option key={course} value={course}>{course}</option>)}
                      </select>
                      <select onChange={(e) => setSelectedStaff(e.target.value)} className="bg-white text-[9px] font-black uppercase p-2 rounded-lg outline-none shadow-sm">
                        <option value="">Teacher</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                      </select>
                      <button onClick={() => finalizeAdmission(c)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-black text-[9px] uppercase">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001529]/90 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
              <button onClick={() => setViewingStudent(null)} className="absolute top-6 right-6 p-3 bg-red-50 text-red-500 rounded-full z-10 hover:bg-red-100"><X/></button>
              
              {/* LEFT: Profile Summary */}
              <div className="md:w-1/3 bg-slate-50 p-10 border-r border-slate-100 text-center">
                <img src={viewingStudent.passport} className="w-48 h-48 rounded-[35px] object-cover border-8 border-white shadow-2xl mb-6 mx-auto" alt="Passport"/>
                <StatusTag status={viewingStudent.status} />
                <div className="mt-8 space-y-4 text-left">
                  <Detail icon={<UserCircle2 size={14}/>} label="Full Name" value={viewingStudent.fullName} />
                  <Detail icon={<Mail size={14}/>} label="Email Address" value={viewingStudent.email} />
                  <Detail icon={<Phone size={14}/>} label="Phone Number" value={viewingStudent.phone} />
                  <Detail icon={<MapPin size={14}/>} label="State of Origin" value={viewingStudent.state} />
                </div>
              </div>

              {/* RIGHT: Academic Vetting Details */}
              <div className="md:w-2/3 p-10 max-h-[85vh] overflow-y-auto">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                  <ClipboardCheck className="text-blue-600"/> Academic Vetting Dossier
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* O-Level Details */}
                  <section className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em] border-b pb-2">O-Level Information</h4>
                    <Detail label="Exam Body" value={viewingStudent.examBody || "WAEC / NECO"} />
                    <Detail label="Exam Number" value={viewingStudent.examNumber || "N/A"} />
                    <Detail label="Exam Year" value={viewingStudent.examYear || "N/A"} />
                    <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                       <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Subject Grades</p>
                       <p className="text-xs font-bold text-slate-600 leading-relaxed">{viewingStudent.grades || "English: B3, Maths: C4, Physics: B2, Geography: A1..."}</p>
                    </div>
                  </section>

                  {/* Higher Education */}
                  <section className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em] border-b pb-2">Previous Education</h4>
                    <Detail label="Institution" value={viewingStudent.lastSchool || "N/A"} />
                    <Detail label="Qualification" value={viewingStudent.qualification || "SSCE / ND / HND"} />
                    <Detail label="Course of Study" value={viewingStudent.prevCourse || "N/A"} />
                    <Detail label="Graduation Year" value={viewingStudent.gradYear || "N/A"} />
                  </section>

                  {/* Program Choice */}
                  <section className="space-y-4 md:col-span-2 bg-blue-50/50 p-6 rounded-[25px]">
                    <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em]">Application Interest</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Detail label="Primary Course Choice" value={viewingStudent.selectedCourse} />
                      <Detail label="Mode of Study" value={viewingStudent.studyMode || "Full-Time"} />
                      <Detail label="Application Date" value={viewingStudent.createdAt?.toDate().toLocaleString()} />
                      <Detail label="Payment Reference" value={viewingStudent.paymentRef || "Online-Transfer"} />
                    </div>
                  </section>
                </div>
                
                <div className="mt-10 flex gap-4">
                  <button className="flex-grow bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-200">Print Dossier</button>
                  <button className="flex-grow bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase">Mark as Verified</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- COMPONENTS ---
const NavItem = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
    {icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const StatusTag = ({ status }) => {
  const styles = {
    "Paid": "bg-blue-100 text-blue-600",
    "Awaiting Rector Approval": "bg-amber-100 text-amber-600 animate-pulse",
    "Rector Approved": "bg-purple-100 text-purple-600",
    "Approved": "bg-emerald-100 text-emerald-600",
    "Rejected by Rector": "bg-red-100 text-red-600"
  };
  return <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${styles[status]}`}>{status}</span>;
};

const Detail = ({ icon, label, value }) => (
  <div className="flex items-start gap-2">
    {icon && <span className="text-blue-500 mt-0.5">{icon}</span>}
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="font-bold text-slate-700 text-xs uppercase">{value || "---"}</p>
    </div>
  </div>
);

export default AdmissionOfficerDashboard;