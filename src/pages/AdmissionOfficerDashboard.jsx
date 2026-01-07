import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react"; 
import { 
  UserPlus, Users, CheckCircle, XCircle, Search, 
  Filter, FileText, GraduationCap, Clock, 
  MoreVertical, Menu, X, LogOut, LayoutDashboard,
  Printer, Download, ShieldCheck, BadgeCheck, ChevronRight
} from "lucide-react";

// --- Staff Assignment Mapping ---
const lecturerDatabase = {
  "Computer Science": { staffName: "Dr. Adamu", staffId: "STF001" },
  "Business Admin": { staffName: "Prof. Zainab", staffId: "STF002" },
  "Public Health": { staffName: "Mr. John", staffId: "STF003" }
};

const AdmissionOfficerDashboard = () => { // Changed name to match App.jsx import
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);
  
  const [applicants, setApplicants] = useState([
    { id: "APP001", name: "Musa Yahaya", course: "Computer Science", status: "Pending", date: "2026-01-05", admissionNo: null },
    { id: "APP002", name: "Zainab Aliyu", course: "Business Admin", status: "Approved", date: "2026-01-04", admissionNo: "GTI/2026/1024", assignedStaffId: "STF002" },
    { id: "APP003", name: "John Sunday", course: "Public Health", status: "Rejected", date: "2026-01-03", admissionNo: null },
  ]);

  const handleApprove = (id) => {
    const year = new Date().getFullYear();
    const randomSerial = Math.floor(1000 + Math.random() * 9000); 
    const generatedID = `GTI/${year}/${randomSerial}`; 

    setApplicants(applicants.map(app => {
      if (app.id === id) {
        const assignment = lecturerDatabase[app.course] || { staffId: "UNASSIGNED" };
        return { 
          ...app, 
          status: "Approved", 
          admissionNo: generatedID,
          assignedStaffId: assignment.staffId 
        };
      }
      return app;
    }));
  };

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "Approved") {
      handleApprove(id);
    } else {
      setApplicants(applicants.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col lg:flex-row font-sans text-left overflow-x-hidden">
      
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] text-white p-8 transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
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
            <input 
              type="text" 
              placeholder="Search by name or course..."
              className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-blue-500/10 border border-transparent font-bold text-xs transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <StatsCard label="Total Applicants" value="152" color="blue" icon={<Users size={20}/>}/>
            <StatsCard label="Admitted" value="84" color="green" icon={<CheckCircle size={20}/>}/>
            <StatsCard label="Pending Review" value="68" color="orange" icon={<Clock size={20}/>}/>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Application Pipeline</h3>
            <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                <Filter size={18}/>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-50">
                  <th className="px-10 py-6">Applicant Profile</th>
                  <th className="px-10 py-6 text-center">Current Status</th>
                  <th className="px-10 py-6 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-sm border border-slate-200 shadow-sm">
                          {app.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-[13px] text-slate-800 uppercase tracking-tight">{app.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{app.course}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border 
                        ${app.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' : 
                          app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        {app.status === 'Pending' ? (
                          <>
                            <button onClick={() => handleStatusChange(app.id, 'Approved')} className="p-3 bg-green-500 text-white hover:bg-green-600 rounded-xl shadow-lg shadow-green-500/20 transition-all"><CheckCircle size={18}/></button>
                            <button onClick={() => handleStatusChange(app.id, 'Rejected')} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><XCircle size={18}/></button>
                          </>
                        ) : app.status === 'Approved' ? (
                          <button onClick={() => setSelectedLetter(app)} className="bg-[#0f172a] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                            <Printer size={16}/> View Document
                          </button>
                        ) : (
                            <p className="text-[9px] font-black text-slate-300 uppercase">No Action Available</p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LETTER MODAL */}
        {selectedLetter && (
          <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-[50px] p-12 relative shadow-2xl animate-in zoom-in duration-300">
              <div className="flex justify-between items-start mb-14">
                <div className="flex items-center gap-5">
                  <div className="h-20 w-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-white shadow-2xl shadow-blue-600/30">
                    <GraduationCap size={45} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase leading-none tracking-tighter">Global Tech</h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2 italic">Institute of Excellence</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-block px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase mb-3 border border-emerald-100">Verified Document</div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date().toDateString()}</p>
                </div>
              </div>

              <div className="space-y-10 border-t border-slate-100 pt-10">
                <div>
                  <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Admission Notice</h4>
                  <p className="text-3xl font-black text-slate-900 uppercase tracking-tight">{selectedLetter.name}</p>
                </div>
                <div className="bg-slate-50/50 p-8 rounded-[35px] border border-slate-100 text-xs leading-relaxed text-slate-600 font-medium">
                    Congratulations! You have been admitted to <b>{selectedLetter.course}</b>. Your enrollment data has been forwarded to your department lecturer.
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="text-center md:text-left flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Registration ID</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{selectedLetter.admissionNo}</p>
                  </div>
                  <div className="bg-white p-5 rounded-[30px] shadow-2xl border border-slate-50">
                    <QRCodeSVG value={`GTI-VERIFY-${selectedLetter.admissionNo}`} size={120} level="H" />
                  </div>
                </div>
              </div>

              <div className="mt-14 flex gap-5">
                <button onClick={() => setSelectedLetter(null)} className="flex-1 py-5 bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-3xl font-black uppercase text-[11px] tracking-widest transition-all">Close</button>
                <button className="flex-1 py-5 bg-blue-600 text-white rounded-3xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-3">
                  <Download size={20}/> Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE TOGGLE */}
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-8 right-8 z-[60] bg-blue-600 text-white p-5 rounded-3xl shadow-2xl active:scale-90 transition-transform"
      >
        {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
      </button>

    </div>
  );
};

// Helper Components
const SidebarLink = ({ icon, label, active = false }) => (
    <button className={`w-full flex items-center gap-4 p-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
        {icon} {label}
    </button>
)

const StatsCard = ({ label, value, color, icon }) => {
    const colors = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        green: "text-emerald-600 bg-emerald-50 border-emerald-100",
        orange: "text-orange-600 bg-orange-50 border-orange-100"
    }
    return (
        <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-500">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                <h4 className="text-3xl font-black text-slate-800">{value}</h4>
            </div>
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 ${colors[color]}`}>
                {icon}
            </div>
        </div>
    )
}

export default AdmissionOfficerDashboard;