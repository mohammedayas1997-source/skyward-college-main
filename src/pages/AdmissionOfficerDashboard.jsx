import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { 
  collection, onSnapshot, query, where, doc, 
  updateDoc, serverTimestamp, addDoc, getDocs, limit, orderBy
} from "firebase/firestore";
import { 
  LayoutDashboard, UserPlus, ClipboardList, CheckCircle, 
  Send, ShieldCheck, Users, Search, X, Loader2, 
  GraduationCap, BookOpen, Bell, Filter, MoreVertical, Eye,
  UserCheck, Hash
} from "lucide-react";

const AdmissionOfficerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Applications");
  
  // --- STATES ---
  const [candidates, setCandidates] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  // --- OFFICIAL COURSES ---
  const courses = [
    "Air Cabin Crew Management", "Flight Dispatcher", 
    "Travel and Tourism Management", "Hotel and Hospitality Management",
    "Cargo & Freight Handling", "Catering and Craft Practice",
    "Airport Operations and Safety", "Visa Processing",
    "Travel Agency Management", "Customer Service Management"
  ];

  // --- DATA FETCHING ---
  useEffect(() => {
    const qAdmission = query(collection(db, "applications"), where("status", "in", ["Paid", "Awaiting Rector Approval", "Rector Approved", "Approved"]));
    
    const unsubAdmission = onSnapshot(qAdmission, (snapshot) => {
      setCandidates(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const qStaff = query(collection(db, "users"), where("role", "==", "staff"));
    const unsubStaff = onSnapshot(qStaff, (snapshot) => {
      setStaffList(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubAdmission(); unsubStaff(); };
  }, []);

  // --- 1. AUTOMATIC ID GENERATOR ---
  const generateAdmissionID = async () => {
    const year = new Date().getFullYear();
    const q = query(collection(db, "applications"), where("status", "==", "Approved"), orderBy("idNumber", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    
    let lastNumber = 0;
    if (!querySnapshot.empty) {
      const lastId = querySnapshot.docs[0].data().idNumber;
      if (lastId) {
         const parts = lastId.split("/");
         lastNumber = parseInt(parts[2]) || 0;
      }
    }
    
    const nextNumber = (lastNumber + 1).toString().padStart(4, "0");
    return `SKY/${year}/${nextNumber}`;
  };

  // --- 2. SEND TO RECTOR FOR APPROVAL ---
  const sendToRector = async (id) => {
    setLoadingId(id);
    try {
      await updateDoc(doc(db, "applications", id), {
        status: "Awaiting Rector Approval",
        officerVerified: true,
        officerName: auth.currentUser?.displayName || "Admission Officer",
        sentToRectorAt: serverTimestamp()
      });
      alert("Application sent to Rector for approval!");
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  // --- 3. FINALIZE (AUTO-ID & STAFF ASSIGNMENT) ---
  const finalizeAdmission = async (candidate) => {
    if (!selectedCourse || !selectedStaff) {
      return alert("Please select a Course and assign a Staff/Lecturer first!");
    }
    
    setLoadingId(candidate.id);
    try {
      const newID = await generateAdmissionID();
      
      // Update Application
      await updateDoc(doc(db, "applications", candidate.id), {
        status: "Approved",
        course: selectedCourse,
        assignedStaffId: selectedStaff,
        idNumber: newID,
        admissionDate: serverTimestamp()
      });

      // Update User Profile (Connect Student to Staff)
      if (candidate.uid) {
        await updateDoc(doc(db, "users", candidate.uid), {
          idNumber: newID,
          role: "student",
          assignedCourse: selectedCourse,
          advisorId: selectedStaff // Staff will now see this student in their list
        });
      }

      // Notify Student
      await addDoc(collection(db, "notifications"), {
        toUid: candidate.uid || candidate.email,
        title: "Admission Confirmed!",
        message: `Congratulations! Your Admission ID is ${newID}. You are in ${selectedCourse}.`,
        type: "admission",
        createdAt: serverTimestamp()
      });

      alert(`Success! ID ${newID} generated and assigned to Staff.`);
      setSelectedCourse("");
      setSelectedStaff("");
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f1f5f9] font-sans text-left">
      
      <aside className="w-full md:w-72 bg-[#001529] text-white flex flex-col md:sticky md:top-0 md:h-screen shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap size={24} />
            </div>
            <h2 className="text-xl font-black uppercase italic">Skyward</h2>
          </div>
          <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.3em] mt-2">Management Suite</p>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Admissions" active={activeTab === "Applications"} onClick={() => setActiveTab("Applications")} />
          <NavItem icon={<Users size={18}/>} label="Staff Directory" active={activeTab === "Staff"} onClick={() => setActiveTab("Staff")} />
        </nav>

        <div className="p-6">
          <button onClick={() => navigate("/portal/login")} className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-400 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">
             Log Out
          </button>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-12">
        <header className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Admission Pipeline</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Verified Students Only</p>
          </div>
          
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Candidate..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 pr-6 py-4 w-full bg-white rounded-2xl shadow-sm outline-none font-bold text-xs border border-transparent focus:border-blue-500 transition-all" 
            />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {candidates.filter(c => c.fullName?.toLowerCase().includes(searchTerm.toLowerCase())).map((candidate) => (
            <div key={candidate.id} className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center gap-8 hover:shadow-md transition-all relative">
              
              <div className="w-24 h-24 rounded-3xl bg-slate-100 overflow-hidden border-4 border-white shadow-inner shrink-0">
                {candidate.passport ? (
                  <img src={candidate.passport} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><Users size={32}/></div>
                )}
              </div>

              <div className="flex-grow space-y-1 text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                    candidate.status === "Approved" ? "bg-emerald-100 text-emerald-600" : 
                    candidate.status === "Awaiting Rector Approval" ? "bg-blue-100 text-blue-600 shadow-sm" :
                    candidate.status === "Rector Approved" ? "bg-purple-100 text-purple-600 font-black animate-pulse" :
                    "bg-amber-100 text-amber-600"
                  }`}>
                    {candidate.status}
                  </span>
                  {candidate.idNumber && <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 rounded-md border border-blue-100">{candidate.idNumber}</span>}
                </div>
                <h3 className="text-xl font-black text-[#002147] uppercase leading-tight">{candidate.fullName}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{candidate.email}</p>
              </div>

              {/* ACTION CENTER */}
              <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-center lg:justify-end">
                
                {/* 1. RECTOR APPROVAL REQUEST BUTTON */}
                {candidate.status === "Paid" && (
                  <button 
                    onClick={() => sendToRector(candidate.id)}
                    className="flex items-center gap-2 bg-[#002147] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/10"
                  >
                    {loadingId === candidate.id ? <Loader2 className="animate-spin" size={16}/> : <ShieldCheck size={16}/>}
                    Request Rector Approval
                  </button>
                )}

                {/* 2. AUTOMATIC ID & STAFF ASSIGNMENT (Appears after Rector Approval) */}
                {candidate.status === "Rector Approved" && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <select 
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="p-4 bg-white rounded-xl text-[10px] font-black uppercase outline-none border-2 border-slate-100 focus:border-blue-500"
                    >
                      <option value="">Set Dept</option>
                      {courses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select 
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      className="p-4 bg-white rounded-xl text-[10px] font-black uppercase outline-none border-2 border-slate-100 focus:border-blue-500"
                    >
                      <option value="">Assign Staff</option>
                      {staffList.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                    </select>

                    <button 
                      onClick={() => finalizeAdmission(candidate)}
                      className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                    >
                      {loadingId === candidate.id ? <Loader2 size={16} className="animate-spin"/> : <UserCheck size={16}/>}
                      Issue ID & Finalize
                    </button>
                  </div>
                )}

                {/* 3. ALREADY ADMITTED */}
                {candidate.status === "Approved" && (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100">
                      <CheckCircle size={18}/> Fully Admitted
                    </div>
                    <span className="text-[9px] font-black text-slate-300 mt-1 uppercase tracking-widest">Linked to: {candidate.assignedStaffId || 'Teacher'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
  >
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default AdmissionOfficerDashboard;