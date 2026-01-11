import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, where, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { 
  CheckCircle, XCircle, Clock, Users, ShieldCheck, 
  Award, FileText, ChevronRight, Loader2, AlertCircle 
} from "lucide-react";

const Rector = () => {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [stats, setStats] = useState({ total: 0, approved: 0 });

  useEffect(() => {
    const q = query(
      collection(db, "applications"), 
      where("status", "==", "Awaiting Rector Approval")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPendingApplications(apps);
      setStats(prev => ({ ...prev, total: apps.length }));
    });

    return () => unsub();
  }, []);

  const handleApprove = async (id) => {
    setLoadingId(id);
    try {
      await updateDoc(doc(db, "applications", id), {
        status: "Rector Approved",
        rectorApprovalDate: serverTimestamp(),
        remarks: "Approved by Rector's Office"
      });
      alert("Application Approved Successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    if(!window.confirm("Are you sure you want to reject this application?")) return;
    setLoadingId(id);
    try {
      await updateDoc(doc(db, "applications", id), {
        status: "Rejected by Rector",
        rectorRemarks: "Does not meet final criteria",
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20 text-left font-sans">
      {/* Title Bar */}
      <div className="w-full bg-[#002147] py-12 px-6 md:px-20 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-red-500 font-black text-xs uppercase tracking-[0.4em] mb-2">Executive Administration</p>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Office of the Rector</h1>
        </div>
        <ShieldCheck className="absolute right-10 top-1/2 -translate-y-1/2 text-white/5" size={180} />
      </div>

      <div className="max-w-7xl mx-auto mt-10 px-6 flex flex-col lg:flex-row gap-12">
        {/* Profile & Quick Stats Section */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white p-2 shadow-2xl border border-slate-200 rounded-lg">
            <img 
              src="/rector.jpg" 
              alt="The Rector" 
              className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500 rounded" 
            />
            <div className="py-6 text-center">
              <h2 className="text-[#002147] font-black text-2xl uppercase italic">Dr. Mohammed Ayas</h2>
              <p className="text-red-600 font-bold text-sm uppercase tracking-widest mt-1">The Rector, Skyward College</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#002147] p-6 rounded-2xl text-white shadow-lg">
              <Users className="text-red-500 mb-2" size={24} />
              <h4 className="text-2xl font-black">{stats.total}</h4>
              <p className="text-[9px] uppercase font-bold text-slate-400">Pending Approval</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
              <Award className="text-emerald-500 mb-2" size={24} />
              <h4 className="text-2xl font-black text-[#002147]">Active</h4>
              <p className="text-[9px] uppercase font-bold text-slate-400">Session 2026</p>
            </div>
          </div>
        </div>

        {/* Content & Application Pipeline */}
        <div className="w-full lg:w-2/3 space-y-10">
          {/* Welcome Address Section */}
          <div className="bg-white p-8 md:p-12 shadow-sm border border-slate-200 rounded-3xl relative">
            <h3 className="text-2xl font-black text-[#002147] mb-6 border-b-4 border-red-600 inline-block pb-2 uppercase italic">
              Rector's Welcome Address
            </h3>
            <div className="text-slate-700 leading-loose space-y-4 text-lg italic font-medium">
              <p>
                "It is with great pleasure that I welcome you to Skyward College of Travels and Tourism. 
                Our institution is founded on the principles of integrity, practical knowledge, and excellence."
              </p>
              <p className="text-base not-italic text-slate-500">
                The college has been at the forefront of vocational training in the aviation and tourism sectors, 
                ensuring our students are globally competitive. As Rector, I personally oversee the final selection 
                process to maintain our standard of excellence.
              </p>
            </div>
          </div>

          {/* Real-Time Pipeline UI */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="text-red-600" />
              <h3 className="text-xl font-black text-[#002147] uppercase">Applications Awaiting Final Consent</h3>
            </div>

            {pendingApplications.length > 0 ? (
              <div className="grid gap-4">
                {pendingApplications.map((app) => (
                  <div key={app.id} className="bg-white p-6 rounded-2xl border-l-8 border-red-600 shadow-md flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-[#002147]">
                        {app.passport ? <img src={app.passport} alt="Passport" className="w-full h-full object-cover" /> : <Users className="text-slate-400" />}
                      </div>
                      <div>
                        <h4 className="font-black text-[#002147] uppercase">{app.fullName}</h4>
                        <p className="text-xs font-bold text-slate-400">{app.selectedCourse} • {app.gender}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        disabled={loadingId === app.id}
                        onClick={() => handleReject(app.id)}
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <XCircle size={24} />
                      </button>
                      <button 
                        disabled={loadingId === app.id}
                        onClick={() => handleApprove(app.id)}
                        className="bg-emerald-600 hover:bg-[#002147] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all"
                      >
                        {loadingId === app.id ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                        Grant Approval
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-100 border-2 border-dashed border-slate-200 p-12 rounded-3xl text-center">
                <AlertCircle className="mx-auto text-slate-300 mb-2" size={40} />
                <p className="text-slate-400 font-bold uppercase text-xs">No pending approvals from the Admission Office</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rector;