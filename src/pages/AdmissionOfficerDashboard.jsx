import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react"; 
import { db } from "../firebase"; 
import { collection, onSnapshot, query, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { 
  UserPlus, Users, CheckCircle, XCircle, Search, 
  Filter, FileText, GraduationCap, Clock, 
  MoreVertical, Menu, X, LogOut, LayoutDashboard,
  Printer, Download, ShieldCheck, BadgeCheck, ChevronRight, BookOpen, Trash2, Edit
} from "lucide-react";

const lecturerDatabase = {
  "Computer Science": { staffName: "Dr. Adamu", staffId: "STF001" },
  "Business Admin": { staffName: "Prof. Zainab", staffId: "STF002" },
  "Public Health": { staffName: "Mr. John", staffId: "STF003" },
  "Hotel Management": { staffName: "Mrs. Alice", staffId: "STF004" }
};

const AdmissionOfficerDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for Editing
  const [editingStudent, setEditingStudent] = useState(null);
  const [newName, setNewName] = useState("");
  const [newCourse, setNewCourse] = useState("");

  useEffect(() => {
    const q = query(collection(db, "admissions"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplicants(apps);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const courseCounts = applicants.reduce((acc, app) => {
    acc[app.course] = (acc[app.course] || 0) + 1;
    return acc;
  }, {});

  const handleApprove = async (app) => {
    const year = new Date().getFullYear();
    const randomSerial = Math.floor(1000 + Math.random() * 9000); 
    const generatedID = `GTI/${year}/${randomSerial}`; 
    const assignment = lecturerDatabase[app.course] || { staffId: "UNASSIGNED", staffName: "TBD" };

    try {
      const appRef = doc(db, "admissions", app.id);
      await updateDoc(appRef, {
        status: "Approved",
        admissionNo: generatedID,
        assignedStaffId: assignment.staffId,
        approvedAt: serverTimestamp()
      });
      alert(`Admission Approved! Sent to ${assignment.staffName}`);
    } catch (err) {
      alert("Error approving: " + err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const appRef = doc(db, "admissions", id);
      await updateDoc(appRef, { status: "Rejected" });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // --- NEW: DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if(window.confirm("Shin kana da tabbacin kana son goge wannan dalibi?")) {
        try {
            await deleteDoc(doc(db, "admissions", id));
            alert("An goge dalibi nasara!");
        } catch (err) {
            alert("Error deleting: " + err.message);
        }
    }
  };

  // --- NEW: EDIT LOGIC ---
  const openEditModal = (student) => {
    setEditingStudent(student);
    setNewName(student.name);
    setNewCourse(student.course);
  };

  const handleUpdate = async () => {
    try {
        const appRef = doc(db, "admissions", editingStudent.id);
        await updateDoc(appRef, {
            name: newName,
            course: newCourse
        });
        setEditingStudent(null);
        alert("An gyara bayanan dalibi!");
    } catch (err) {
        alert("Error updating: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col lg:flex-row font-sans text-left overflow-x-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] text-white p-8 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
            <GraduationCap size={24} />
          </div>
          <div>
            <h2 className="font-black text-lg tracking-tighter uppercase leading-none">Global Admission</h2>
            <p className="text-[8px] font-bold text-blue-400 uppercase tracking-[0.3em] mt-1.5">Admin Control</p>
          </div>
        </div>
        <nav className="space-y-3">
          <SidebarLink icon={<LayoutDashboard size={18}/>} label="Dashboard" active />
          <SidebarLink icon={<Users size={18}/>} label="Applicant List" />
          <SidebarLink icon={<FileText size={18}/>} label="Letters & Forms" />
          <SidebarLink icon={<ShieldCheck size={18}/>} label="Verifications" />
        </nav>
        <div className="absolute bottom-8 left-8 right-8">
            <button className="flex items-center gap-3 p-4 text-red-400 font-black text-[10px] uppercase hover:bg-red-500/10 rounded-2xl w-full transition-all">
                <LogOut size={18}/> Logout Session
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Admissions Desk</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-widest">Managing Academic Enrollment</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <input type="text" placeholder="Search by name or course..." className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-blue-500/10 border border-transparent font-bold text-xs transition-all" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </header>

        {/* COURSE DISTRIBUTION */}
        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
            <BookOpen size={14}/> Course Enrollment Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {Object.entries(courseCounts).map(([course, count]) => (
                <div key={course} className="bg-white p-5 rounded-[25px] border border-slate-100 shadow-sm">
                    <p className="text-[9px] font-black text-blue-600 uppercase mb-1 truncate">{course}</p>
                    <h4 className="text-xl font-black text-slate-800">{count} <span className="text-[10px] text-slate-400">Apps</span></h4>
                </div>
            ))}
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <StatsCard label="Total Applicants" value={applicants.length} color="blue" icon={<Users size={20}/>}/>
            <StatsCard label="Admitted" value={applicants.filter(a => a.status === "Approved").length} color="green" icon={<CheckCircle size={20}/>}/>
            <StatsCard label="Pending Review" value={applicants.filter(a => a.status === "Pending").length} color="orange" icon={<Clock size={20}/>}/>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-50">
                  <th className="px-10 py-6">Applicant Profile</th>
                  <th className="px-10 py-6 text-center">Status</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applicants.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-sm border border-slate-200 uppercase">{app.name.charAt(0)}</div>
                        <div>
                          <p className="font-black text-[13px] text-slate-800 uppercase tracking-tight">{app.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{app.course}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${app.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' : app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>{app.status}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex justify-end gap-2">
                        {/* Edit Button */}
                        <button onClick={() => openEditModal(app)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Edit size={16}/></button>
                        
                        {/* Approve/Reject or View */}
                        {app.status === 'Pending' ? (
                          <>
                            <button onClick={() => handleApprove(app)} className="p-2.5 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20"><CheckCircle size={16}/></button>
                            <button onClick={() => handleReject(app.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl"><XCircle size={16}/></button>
                          </>
                        ) : (
                          <button onClick={() => setSelectedLetter(app)} className="p-2.5 bg-blue-600 text-white rounded-xl"><Printer size={16}/></button>
                        )}

                        {/* Delete Button */}
                        <button onClick={() => handleDelete(app.id)} className="p-2.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EDIT MODAL */}
        {editingStudent && (
          <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[35px] p-10 shadow-2xl">
                <h3 className="text-xl font-black text-slate-800 uppercase mb-6">Gyara Bayanai</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Cikakken Suna</label>
                        <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm mt-1 focus:ring-2 ring-blue-500" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Course</label>
                        <select value={newCourse} onChange={(e) => setNewCourse(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-sm mt-1 focus:ring-2 ring-blue-500">
                            {Object.keys(lecturerDatabase).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex gap-3 mt-8">
                    <button onClick={() => setEditingStudent(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px]">Cancel</button>
                    <button onClick={handleUpdate} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-blue-500/30">Save Changes</button>
                </div>
            </div>
          </div>
        )}

        {/* ADMISSION LETTER MODAL (Original Code Kept) */}
        {selectedLetter && (
            <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
               <div className="bg-white w-full max-w-2xl rounded-[50px] p-12 relative shadow-2xl">
                 {/* ... (Original letter content code remains exactly here) ... */}
                 <div className="flex justify-between items-start mb-10">
                    <h2 className="text-2xl font-black uppercase">{selectedLetter.name}</h2>
                    <button onClick={() => setSelectedLetter(null)}><X/></button>
                 </div>
                 <div className="p-8 bg-slate-50 rounded-3xl mb-8">
                    <p className="text-sm font-medium italic">Congratulations! You have been admitted to {selectedLetter.course}.</p>
                 </div>
                 <QRCodeSVG value={selectedLetter.admissionNo || "PENDING"} size={100}/>
                 <button onClick={() => setSelectedLetter(null)} className="w-full py-4 bg-blue-600 text-white rounded-2xl mt-8 font-black uppercase">Close Letter</button>
               </div>
            </div>
        )}
      </main>

      {/* MOBILE TOGGLE */}
      <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden fixed bottom-8 right-8 z-[60] bg-blue-600 text-white p-5 rounded-3xl shadow-2xl">
        {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
      </button>
    </div>
  );
};

const SidebarLink = ({ icon, label, active = false }) => (
    <button className={`w-full flex items-center gap-4 p-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
        {icon} {label}
    </button>
)

const StatsCard = ({ label, value, color, icon }) => {
    const colors = { blue: "text-blue-600 bg-blue-50 border-blue-100", green: "text-emerald-600 bg-emerald-50 border-emerald-100", orange: "text-orange-600 bg-orange-50 border-orange-100" }
    return (
        <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-500">
            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p><h4 className="text-3xl font-black text-slate-800">{value}</h4></div>
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 ${colors[color]}`}>{icon}</div>
        </div>
    )
}

export default AdmissionOfficerDashboard;