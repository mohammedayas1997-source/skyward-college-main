import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { 
  collection, onSnapshot, query, where, doc, 
  updateDoc, serverTimestamp, addDoc 
} from "firebase/firestore";
import { 
  LayoutDashboard, UserPlus, ClipboardList, CheckCircle, 
  Send, ShieldCheck, Users, Search, X, Loader2, 
  GraduationCap, BookOpen, Bell, Filter, MoreVertical, Eye
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

  // --- OFFICIAL COURSES (Updated to match Apply.js) ---
  const courses = [
    "Air Cabin Crew Management", "Flight Dispatcher", 
    "Travel and Tourism Management", "Hotel and Hospitality Management",
    "Cargo & Freight Handling", "Catering and Craft Practice",
    "Airport Operations and Safety", "Visa Processing",
    "Travel Agency Management", "Customer Service Management"
  ];

  // --- DATA FETCHING ---
  useEffect(() => {
    // MUHIMMI: Muna dauko wadanda suka biya kudi (Paid) kawai
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

  // --- REAL-LIFE HANDLERS ---

  const sendToRector = async (id) => {
    setLoadingId(id);
    try {
      await updateDoc(doc(db, "applications", id), {
        status: "Awaiting Rector Approval",
        officerVerified: true,
        officerName: auth.currentUser?.displayName || "Admission Officer 1",
        verifiedAt: serverTimestamp()
      });
      alert("Application sent to Rector for final approval!");
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  const finalizeAdmission = async (candidate) => {
    if (!selectedCourse || !selectedStaff) {
      return alert("Please select a Course and a Teacher first!");
    }
    
    setLoadingId(candidate.id);
    try {
      await updateDoc(doc(db, "applications", candidate.id), {
        status: "Approved",
        course: selectedCourse,
        assignedStaffId: selectedStaff,
        admissionDate: serverTimestamp()
      });

      await addDoc(collection(db, "notifications"), {
        toUid: candidate.uid || candidate.email,
        title: "Admission Confirmed!",
        message: `Congratulations! You have been admitted into ${selectedCourse}. Please proceed to registration.`,
        type: "admission",
        createdAt: serverTimestamp()
      });

      alert(`Success! Student assigned to ${selectedCourse}.`);
      setSelectedCourse("");
      setSelectedStaff("");
    } catch (e) { alert(e.message); }
    finally { setLoadingId(null); }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f1f5f9] font-sans text-left">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-[#001529] text-white flex flex-col md:sticky md:top-0 md:h-screen shadow-2xl">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap size={24} />
            </div>
            <h2 className="text-xl font-black uppercase italic">Skyward</h2>
          </div>
          <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.3em] mt-2">Admission Office</p>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active={activeTab === "Applications"} onClick={() => setActiveTab("Applications")} />
          <NavItem icon={<Users size={18}/>} label="Staff Directory" active={activeTab === "Staff"} onClick={() => setActiveTab("Staff")} />
        </nav>

        <div className="p-6">
          <button onClick={() => navigate("/portal/login")} className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-400 p-4 rounded-2xl font-black text-[10px] uppercase">
             Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-6 md:p-12">
        <header className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Admission Pipeline</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Reviewing Paid Applications</p>
          </div>
          
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Name or Email..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 pr-6 py-4 w-full bg-white rounded-2xl shadow-sm outline-none font-bold text-xs border border-transparent focus:border-blue-500 transition-all" 
            />
          </div>
        </header>

        {/* APPLICATION GRID */}
        <div className="grid grid-cols-1 gap-6">
          {candidates.filter(c => c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || c.email?.toLowerCase().includes(searchTerm.toLowerCase())).map((candidate) => (
            <div key={candidate.id} className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center gap-8 hover:shadow-md transition-all relative overflow-hidden">
              
              {/* Passport Image Display */}
              <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-50 shrink-0">
                {candidate.passport ? (
                  <img src={candidate.passport} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><Users size={32}/></div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-grow space-y-1 text-center lg:text-left">
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                    candidate.status === "Approved" ? "bg-emerald-100 text-emerald-600" : 
                    candidate.status === "Awaiting Rector Approval" ? "bg-blue-100 text-blue-600" :
                    "bg-amber-100 text-amber-600"
                  }`}>
                    {candidate.status}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300">#{candidate.id.substr(0,8)}</span>
                </div>
                <h3 className="text-lg font-black text-[#002147] uppercase leading-tight">{candidate.fullName}</h3>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                  <span className="text-red-500">Choice:</span> {candidate.selectedCourse}
                </p>
                <div className="flex items-center gap-3 justify-center lg:justify-start pt-1 text-[10px] font-bold text-slate-400">
                   <span className="bg-slate-50 px-2 py-1 rounded-md">{candidate.phone}</span>
                   <span className="bg-slate-50 px-2 py-1 rounded-md">{candidate.gender}</span>
                </div>
              </div>

              {/* Action Pipeline */}
              <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-center">
                
                {/* Step 1: Request Rector Approval */}
                {candidate.status === "Paid" && (
                  <button 
                    onClick={() => sendToRector(candidate.id)}
                    className="flex items-center gap-2 bg-[#002147] text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg"
                  >
                    {loadingId === candidate.id ? <Loader2 className="animate-spin" size={16}/> : <ShieldCheck size={16}/>}
                    Verify & Send to Rector
                  </button>
                )}

                {/* Step 2: Rector Approved, Now Assign Teacher & Course */}
                {candidate.status === "Rector Approved" && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <select 
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="p-4 bg-slate-100 rounded-xl text-[10px] font-bold uppercase outline-none border-2 border-transparent focus:border-blue-500"
                    >
                      <option value="">Set Official Course</option>
                      {courses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select 
                      onChange={(e) => setSelectedStaff(e.target.value)}
                      className="p-4 bg-slate-100 rounded-xl text-[10px] font-bold uppercase outline-none border-2 border-transparent focus:border-blue-500"
                    >
                      <option value="">Assign Academic Advisor</option>
                      {staffList.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                    </select>

                    <button 
                      onClick={() => finalizeAdmission(candidate)}
                      className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                    >
                      {loadingId === candidate.id ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
                      Publish Admission
                    </button>
                  </div>
                )}

                {/* Step 3: Already Published */}
                {candidate.status === "Approved" && (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100">
                      <CheckCircle size={18}/> Admission Released
                    </div>
                    <span className="text-[9px] font-black text-slate-300 mr-2 mt-1">COURSE: {candidate.course}</span>
                  </div>
                )}
              </div>

              {/* View Details Button (Decorative for now) */}
              <button className="absolute top-4 right-4 p-2 text-slate-200 hover:text-slate-400 transition-all">
                <MoreVertical size={20}/>
              </button>
            </div>
          ))}

          {candidates.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
              <ClipboardList size={48} className="mx-auto text-slate-200 mb-4"/>
              <p className="text-slate-400 font-black uppercase text-xs">No Paid Applications Found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
  >
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default AdmissionOfficerDashboard;