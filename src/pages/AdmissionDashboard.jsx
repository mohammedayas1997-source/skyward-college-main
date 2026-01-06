import React, { useState, useEffect } from "react";
import { db } from "../firebase"; 
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from "firebase/firestore";
// Shigar da QR Code Library: npm install qrcode.react
import { QRCodeSVG } from "qrcode.react"; 
import { 
  UserPlus, Users, CheckCircle, XCircle, Search, 
  Filter, FileText, GraduationCap, Clock, 
  MoreVertical, Menu, X, LogOut, LayoutDashboard,
  Printer, Download, ShieldCheck, BadgeCheck
} from "lucide-react";

const AdmissionDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null); // Domin nuna takardar admission
  
  // Sample data na dalibai masu neman shiga (Applicants)
  const [applicants, setApplicants] = useState([
    { id: "APP001", name: "Musa Yahaya", course: "Computer Science", status: "Pending", date: "2026-01-05", admissionNo: null },
    { id: "APP002", name: "Zainab Aliyu", course: "Business Admin", status: "Approved", date: "2026-01-04", admissionNo: "GTI/2026/1024" },
    { id: "APP003", name: "John Sunday", course: "Public Health", status: "Rejected", date: "2026-01-03", admissionNo: null },
  ]);

  // AIKIN APPROVAL DA SAMAR DA ID AUTOMATICALLY
  const handleApprove = (id) => {
    const year = new Date().getFullYear();
    const randomSerial = Math.floor(1000 + Math.random() * 9000); 
    const generatedID = `GTI/${year}/${randomSerial}`; // Tsarin ID: GTI/2026/5432

    setApplicants(applicants.map(app => 
      app.id === id ? { ...app, status: "Approved", admissionNo: generatedID } : app
    ));
    alert(`An amince da Admission! Sabon ID: ${generatedID}`);
  };

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "Approved") {
      handleApprove(id);
    } else {
      setApplicants(applicants.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
      alert(`Applicant ${id} has been ${newStatus}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row font-sans text-left">
      
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#1e293b] text-white p-8 transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <GraduationCap size={28} />
          </div>
          <div>
            <h2 className="font-black text-xl tracking-tighter uppercase leading-none">Admissions</h2>
            <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mt-1">Enrollment Unit</p>
          </div>
        </div>

        <nav className="space-y-4">
          <button className="w-full flex items-center gap-3 bg-blue-600 p-4 rounded-2xl font-black text-[10px] uppercase shadow-xl">
            <LayoutDashboard size={18}/> Overview
          </button>
          <button className="w-full flex items-center gap-3 hover:bg-white/5 p-4 rounded-2xl font-black text-[10px] uppercase text-slate-400">
            <Users size={18}/> All Applicants
          </button>
          <button className="w-full flex items-center gap-3 hover:bg-white/5 p-4 rounded-2xl font-black text-[10px] uppercase text-slate-400">
            <FileText size={18}/> Admission Letters
          </button>
        </nav>

        <button className="mt-auto flex items-center gap-3 p-4 text-red-400 font-black text-[10px] uppercase hover:bg-red-500/10 rounded-2xl w-full transition-all">
          <LogOut size={18}/> Exit Portal
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto pt-20 lg:pt-12">
        <header className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Applicant Manager</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase mt-2 tracking-widest">Tantance Sabbin Dalibai</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <input 
              type="text" 
              placeholder="Bincika sunan dalibi..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-blue-500 font-bold text-xs"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* APPLICANTS TABLE */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-xs uppercase tracking-widest text-slate-600">Recent Applications</h3>
            <Filter size={18} className="text-slate-400 cursor-pointer"/>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-50">
                  <th className="px-8 py-6">Applicant Name</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black text-xs">
                          {app.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-xs text-slate-800 uppercase">{app.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{app.course}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter 
                        ${app.status === 'Approved' ? 'bg-green-100 text-green-600' : 
                          app.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {app.status === 'Pending' ? (
                          <>
                            <button onClick={() => handleStatusChange(app.id, 'Approved')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle size={20}/></button>
                            <button onClick={() => handleStatusChange(app.id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><XCircle size={20}/></button>
                          </>
                        ) : app.status === 'Approved' ? (
                          <button onClick={() => setSelectedLetter(app)} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-2">
                            <Printer size={14}/> View Letter
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- ADMISSION LETTER MODAL --- */}
        {selectedLetter && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 relative shadow-2xl animate-in zoom-in duration-300 border border-white/20">
              
              {/* Header na Takarda */}
              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <GraduationCap size={40} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase leading-none tracking-tighter">Global Tech</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Institute of Technology</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase mb-2 border border-green-100">Official Release</div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{new Date().toDateString()}</p>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-8">
                <div className="border-l-4 border-blue-600 pl-6 py-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Letter of Admission</h4>
                  <p className="text-xl font-black text-slate-800 uppercase mt-1">{selectedLetter.name}</p>
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  Muna taya ka murna! An ba ka gurbin karatu a karkashin kwas din <b>{selectedLetter.course}</b> na tsawon shekarun da aka tsara. Ana sa ran za ka biya kudin rajista kafin fara karatu.
                </p>

                {/* QR DA ID SECTION */}
                <div className="bg-slate-50 rounded-[30px] p-6 flex flex-col md:flex-row items-center justify-between border border-slate-100 gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Your Admission Number</p>
                    <p className="text-2xl font-black text-blue-600 tracking-tighter">{selectedLetter.admissionNo}</p>
                    <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                      <BadgeCheck className="text-green-500" size={16}/>
                      <span className="text-[9px] font-black text-slate-500 uppercase">Verified Digital Document</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                    <QRCodeSVG 
                      value={`VERIFY:${selectedLetter.admissionNo}:${selectedLetter.name}`} 
                      size={90}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-10 flex gap-4">
                <button onClick={() => setSelectedLetter(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px]">Close</button>
                <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                  <Download size={16}/> Save as PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE TOGGLE (FLOATING) */}
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] bg-blue-600 text-white p-4 rounded-full shadow-2xl"
      >
        {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
      </button>

    </div>
  );
};

export default AdmissionDashboard;