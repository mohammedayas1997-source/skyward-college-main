import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { 
  collection, onSnapshot, query, where, doc, 
  updateDoc, serverTimestamp, addDoc, getDocs, limit, orderBy, writeBatch
} from "firebase/firestore";
import { 
  LayoutDashboard, UserPlus, ClipboardList, CheckCircle, 
  Send, ShieldCheck, Users, Search, X, Loader2, 
  GraduationCap, BookOpen, Bell, Filter, MoreVertical, Eye,
  UserCheck, Hash, UserPlus2, ShieldAlert, CheckSquare, Square, Trash2
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
  const [viewingStudent, setViewingStudent] = useState(null); // State for Modal
  
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  const [portalSettings, setPortalSettings] = useState({ isOpen: true, message: "" });
  const [isUpdatingPortal, setIsUpdatingPortal] = useState(false);

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
      // Fetching all statuses to show Rector's decision (Approved/Rejected)
      setCandidates(allData.filter(c => ["Paid", "Awaiting Rector Approval", "Rector Approved", "Approved", "Rejected by Rector"].includes(c.status)));
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

  // --- SELECT ALL LOGIC ---
  const handleSelectAll = () => {
    const displayedIds = candidates
      .filter(c => c.status === "Paid") // Only select those ready to be sent
      .map(c => c.id);
    
    if (selectedItems.length === displayedIds.length) setSelectedItems([]);
    else setSelectedItems(displayedIds);
  };

  const sendBulkToRector = async () => {
    if (selectedItems.length === 0) return;
    setLoadingId("bulk");
    const batch = writeBatch(db);
    
    selectedItems.forEach(id => {
      batch.update(doc(db, "applications", id), {
        status: "Awaiting Rector Approval",
        sentToRectorAt: serverTimestamp(),
        officerName: auth.currentUser?.displayName || "Admission Officer"
      });
    });

    try {
      await batch.commit();
      setSelectedItems([]);
      alert("Selected applications sent to Rector!");
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  // --- ACTION FUNCTIONS ---
  const generateAdmissionID = async () => {
    const year = new Date().getFullYear();
    const q = query(collection(db, "applications"), where("status", "==", "Approved"), orderBy("idNumber", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    let lastNumber = 0;
    if (!querySnapshot.empty) {
      const lastId = querySnapshot.docs[0].data().idNumber;
      if (lastId?.includes("/")) lastNumber = parseInt(lastId.split("/")[2]) || 0;
    }
    return `SKY/${year}/${(lastNumber + 1).toString().padStart(4, "0")}`;
  };

  const finalizeAdmission = async (candidate) => {
    if (!selectedCourse || !selectedStaff) return alert("Select Dept and Staff first!");
    setLoadingId(candidate.id);
    try {
      const newID = await generateAdmissionID();
      const studentRef = doc(db, "applications", candidate.id);
      
      await updateDoc(studentRef, {
        status: "Approved",
        course: selectedCourse,
        assignedStaffId: selectedStaff,
        idNumber: newID,
        admissionDate: serverTimestamp()
      });

      if (candidate.uid) {
        await updateDoc(doc(db, "users", candidate.uid), {
          idNumber: newID,
          role: "student",
          assignedCourse: selectedCourse,
          advisorId: selectedStaff
        });
      }
      alert(`Admission Successful! ID: ${newID}`);
      setSelectedCourse(""); setSelectedStaff("");
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  // --- FILTERED DATA ---
  const filteredCandidates = candidates
    .filter(c => c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(c => filterCourse === "All" || c.selectedCourse === filterCourse);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f1f5f9] font-sans text-left">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#001529] text-white flex flex-col md:sticky md:top-0 md:h-screen shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><GraduationCap size={24} /></div>
            <h2 className="text-xl font-black uppercase italic">Skyward</h2>
          </div>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Pipeline" active={activeTab === "Applications"} onClick={() => setActiveTab("Applications")} />
          <NavItem icon={<Users size={18}/>} label="Staff List" active={activeTab === "Staff"} onClick={() => setActiveTab("Staff")} />
        </nav>
      </aside>

      <main className="flex-grow p-6 md:p-12">
        {/* HEADER & SEARCH */}
        <header className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Admission Pipeline</h1>
            <p className="text-xs font-bold text-slate-400 uppercase italic">Manage & Categorize Students</p>
          </div>
          
          <div className="flex gap-4 w-full lg:w-auto">
            <div className="relative flex-grow lg:w-80">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search name..." 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 pr-6 py-4 w-full bg-white rounded-2xl shadow-sm outline-none font-bold text-xs" 
              />
            </div>
            <select 
              onChange={(e) => setFilterCourse(e.target.value)}
              className="bg-white px-4 py-4 rounded-2xl font-black text-[10px] uppercase shadow-sm outline-none border-none"
            >
              <option value="All">All Courses</option>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </header>

        {/* BULK ACTION BAR */}
        {selectedItems.length > 0 && (
          <div className="mb-6 bg-blue-600 text-white p-4 rounded-2xl flex items-center justify-between animate-pulse">
            <p className="font-black text-[10px] uppercase ml-4">{selectedItems.length} Students Selected</p>
            <button onClick={sendBulkToRector} className="bg-white text-blue-600 px-6 py-2 rounded-xl font-black text-[10px] uppercase">
              {loadingId === "bulk" ? <Loader2 className="animate-spin"/> : "Send All to Rector"}
            </button>
          </div>
        )}

        {/* MAIN LIST */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-6 mb-2">
            <button onClick={handleSelectAll} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
              {selectedItems.length > 0 ? <CheckSquare size={16} className="text-blue-600"/> : <Square size={16}/>} Select All Pending
            </button>
          </div>

          {filteredCandidates.map((candidate) => (
            <div key={candidate.id} className="bg-white p-5 rounded-[30px] shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center gap-6 hover:shadow-md transition-all relative">
              
              {/* Checkbox for selection */}
              {candidate.status === "Paid" && (
                <input 
                  type="checkbox" 
                  checked={selectedItems.includes(candidate.id)}
                  onChange={() => setSelectedItems(prev => prev.includes(candidate.id) ? prev.filter(i => i !== candidate.id) : [...prev, candidate.id])}
                  className="w-5 h-5 accent-blue-600"
                />
              )}

              {/* Passport Photo */}
              <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm shrink-0">
                {candidate.passport ? (
                  <img src={candidate.passport} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><Users size={24}/></div>
                )}
              </div>

              {/* Info */}
              <div className="flex-grow text-center lg:text-left">
                <div className="flex flex-wrap gap-2 mb-1 justify-center lg:justify-start">
                  <StatusBadge status={candidate.status} />
                  <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-md uppercase">{candidate.selectedCourse}</span>
                </div>
                <h3 className="text-lg font-black text-[#002147] uppercase leading-tight">{candidate.fullName}</h3>
                <p className="text-[10px] font-bold text-slate-400">{candidate.email}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 items-center">
                <button onClick={() => setViewingStudent(candidate)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100"><Eye size={18}/></button>

                {candidate.status === "Rector Approved" && (
                  <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-dashed border-slate-300">
                    <select onChange={(e) => setSelectedCourse(e.target.value)} className="text-[9px] font-black uppercase p-2 rounded-lg outline-none">
                      <option value="">Course</option>
                      {courses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select onChange={(e) => setSelectedStaff(e.target.value)} className="text-[9px] font-black uppercase p-2 rounded-lg outline-none">
                      <option value="">Malami</option>
                      {staffList.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                    </select>
                    <button onClick={() => finalizeAdmission(candidate)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase">Finalize</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* STUDENT INFO MODAL (DOSSIER) */}
        {viewingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="font-black uppercase text-[#002147]">Student Information</h2>
                <button onClick={() => setViewingStudent(null)} className="p-2 hover:bg-red-50 text-red-500 rounded-full"><X/></button>
              </div>
              <div className="p-8 flex flex-col md:flex-row gap-8 overflow-y-auto max-h-[70vh]">
                <img src={viewingStudent.passport} className="w-40 h-40 rounded-3xl object-cover border-4 border-slate-100 shadow-lg" alt="Student" />
                <div className="space-y-4 flex-grow">
                  <InfoItem label="Full Name" value={viewingStudent.fullName} />
                  <InfoItem label="Desired Course" value={viewingStudent.selectedCourse} />
                  <InfoItem label="Phone Number" value={viewingStudent.phone || "Not Provided"} />
                  <InfoItem label="Address" value={viewingStudent.address || "Not Provided"} />
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Other Form Details</p>
                    <p className="text-xs font-bold text-slate-600 mt-1">Status: {viewingStudent.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const StatusBadge = ({ status }) => {
  const styles = {
    "Paid": "bg-amber-100 text-amber-600",
    "Awaiting Rector Approval": "bg-blue-100 text-blue-600 animate-pulse",
    "Rector Approved": "bg-purple-100 text-purple-600",
    "Approved": "bg-emerald-100 text-emerald-600",
    "Rejected by Rector": "bg-red-100 text-red-600"
  };
  return <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${styles[status]}`}>{status}</span>;
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
    {icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-black text-slate-400 uppercase">{label}</p>
    <p className="text-sm font-bold text-[#002147] uppercase">{value}</p>
  </div>
);

export default AdmissionOfficerDashboard;