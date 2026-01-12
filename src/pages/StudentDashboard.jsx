import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, onSnapshot, collection, query, where } from "firebase/firestore";
import { updatePassword, onAuthStateChanged } from "firebase/auth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { 
  User, FileCheck, Download, LogOut, Bell, Clock, 
  BookOpen, CreditCard, Menu, X, Award, MapPin,
  GraduationCap, CheckCircle, Lock, ShieldAlert, Loader2,
  FileText, Activity, AlertCircle
} from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const letterRef = useRef();
  const [admissionStatus, setAdmissionStatus] = useState("Pending");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- STATES NA TSARO ---
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // --- SABON STATE NA RESULT ---
  const [publishedResults, setPublishedResults] = useState([]);

  // --- TSARO & REAL-TIME DATA FETCHING ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/portal/login");
        return;
      }

      // Fetch User Profile
      const unsubUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.role !== "student") {
            navigate("/portal/login");
            return;
          }
          setStudentData(data);
          setIsFirstLogin(data.isFirstLogin || false);
          if (data.status) setAdmissionStatus(data.status);
        }
        setLoading(false);
      });

      // Fetch Notifications
      const qNotify = query(collection(db, "notifications"), where("toUid", "==", user.uid));
      const unsubNotify = onSnapshot(qNotify, (snap) => {
        setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      // --- NEW: FETCH PUBLISHED RESULTS KAI TSAYE ---
      const qResults = query(
        collection(db, "results"), 
        where("studentEmail", "==", user.email),
        where("status", "==", "Published")
      );
      const unsubResults = onSnapshot(qResults, (snap) => {
        setPublishedResults(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      return () => {
        unsubUser();
        unsubNotify();
        unsubResults();
      };
    });

    return () => unsubscribe();
  }, [navigate]);

  // --- AIKIN CANZA PASSWORD ---
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return alert("Passwords do not match!");
    if (newPassword.length < 6) return alert("Password must be at least 6 characters");

    setUpdating(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        await updateDoc(doc(db, "users", user.uid), { isFirstLogin: false });
        setIsFirstLogin(false);
        alert("Success: Password dinka ya canza!");
      }
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        alert("Re-login required for security to change password.");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.clear(); 
    navigate("/portal/login");
  };

  // REAL-LIFE: Download Letter Function with jsPDF
  const downloadAdmissionLetter = async () => {
    const element = letterRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Skyward_Admission_${studentData?.fullName?.replace(" ", "_")}.pdf`);
  };

  if (loading) {
    return (
      <div className="h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#002147] mx-auto mb-4" size={40} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Securing Connection...</p>
        </div>
      </div>
    );
  }

  if (isFirstLogin) {
    return (
      <div className="min-h-screen bg-[#002147] flex items-center justify-center p-6 text-left">
        <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-500">
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 mb-8">
            <ShieldAlert className="text-red-600 mb-3" size={32} />
            <h3 className="font-black text-[#002147] uppercase text-sm italic">Privacy Protection</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 leading-relaxed tracking-tight">
              Sannu {studentData?.fullName}! Dole ne ka canza password dinka kafin ka ci gaba.
            </p>
          </div>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-2 tracking-widest">Create New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-300" size={18} />
                <input type="password" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-red-500 font-bold text-xs" onChange={(e) => setNewPassword(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-2 tracking-widest">Confirm New Password</label>
              <div className="relative">
                <CheckCircle className="absolute left-4 top-4 text-slate-300" size={18} />
                <input type="password" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-red-500 font-bold text-xs" onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            <button disabled={updating} className="w-full py-5 bg-red-600 text-white rounded-[20px] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-red-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all mt-4">
              {updating ? <Loader2 className="animate-spin" /> : "Verify & Enter Portal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex relative font-sans overflow-x-hidden text-left">
      
      {/* MOBILE MENU */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden fixed top-4 left-4 z-[60] bg-[#002147] text-white p-3 rounded-2xl shadow-2xl">
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`w-64 bg-[#002147] flex flex-col text-white p-6 sticky top-0 h-screen shadow-2xl z-50 transition-all duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} fixed md:relative`}>
        <div className="mb-10 text-center">
          <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-2 shadow-lg">
              <GraduationCap className="text-[#002147]" size={32} />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Skyward Academy</h2>
          <p className="text-[8px] font-black opacity-40 uppercase tracking-tighter mt-1">Reg: {studentData?.admissionNo || studentData?.idNumber || "Not Assigned"}</p>
        </div>
        
        <nav className="flex-1 space-y-3">
          <SidebarBtn active={location.pathname === '/portal/dashboard'} onClick={() => navigate("/portal/dashboard")} icon={<User size={18} />} label="My Profile" />
          <SidebarBtn active={location.pathname === '/portal/registration'} onClick={() => navigate("/portal/registration")} icon={<BookOpen size={18} />} label="Course Reg" />
          <SidebarBtn active={location.pathname === '/portal/results'} onClick={() => navigate("/portal/check-result")} icon={<Award size={18} />} label="Exam Results" />
          <SidebarBtn active={location.pathname === '/portal/idcard'} onClick={() => alert("ID Card module loading...")} icon={<FileText size={18} />} label="Digital ID" />

          <button onClick={() => navigate("/portal/payments")} className="w-full flex items-center gap-3 bg-blue-600/20 border-2 border-blue-500/50 hover:bg-blue-600 p-4 rounded-2xl font-black text-[10px] uppercase transition-all text-blue-400 hover:text-white mt-4 shadow-xl text-left">
            <CreditCard size={18} /> Payments Portal
          </button>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:bg-red-500/10 rounded-2xl font-black text-[10px] uppercase p-4 mt-auto border border-red-500/20 transition-all">
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto pt-20 md:pt-12 text-left">
        <header className="flex justify-between items-center mb-10 flex-wrap gap-6 text-left">
          <div>
            <h1 className="text-3xl font-black text-[#002147] uppercase leading-tight tracking-tighter">
              Barka da zuwa,<br/> <span className="text-red-600">{studentData?.fullName || "Student"}</span>
            </h1>
            <div className="flex items-center gap-2 mt-2 bg-white w-fit px-4 py-1 rounded-full shadow-sm border border-slate-100">
                <Activity size={10} className="text-green-500 animate-pulse"/>
                <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em]">Student Account Active</p>
            </div>
          </div>

          <div className="flex gap-4">
             <div onClick={() => alert(`You have ${notifications.length} new messages`)} className="bg-white p-4 rounded-2xl shadow-sm text-[#002147] relative border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all">
               <Bell size={20} />
               {notifications.length > 0 && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white animate-bounce"></span>}
             </div>
             <div className="h-14 w-14 bg-[#002147] rounded-2xl overflow-hidden border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-2xl uppercase italic">
               {studentData?.fullName?.charAt(0) || "S"}
             </div>
          </div>
        </header>

        {/* 1. Live Status Progress Bar */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm mb-10 border border-slate-200">
           <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">Application Live Tracking</h4>
           <div className="flex justify-between items-center relative">
              <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 -z-0"></div>
              <StatusIcon label="Payment" done />
              <StatusIcon label="Verification" done={["Awaiting Rector Approval", "Rector Approved", "Approved"].includes(admissionStatus)} />
              <StatusIcon label="Rector Consent" done={["Rector Approved", "Approved"].includes(admissionStatus)} />
              <StatusIcon label="Final Admission" done={admissionStatus === "Approved"} />
           </div>
        </div>

        {/* Real-time Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <DashboardCard title="Admission Status" val={admissionStatus === "Approved" ? "ADMITTED" : admissionStatus} color={admissionStatus === "Approved" ? "green" : "blue"} icon={<FileCheck size={24}/>} />
          
          {/* UPDATED: REAL RESULT CARD */}
          <DashboardCard 
            title="Results Out" 
            val={publishedResults.length > 0 ? `${publishedResults.length} COURSES` : "NONE YET"} 
            color={publishedResults.length > 0 ? "red" : "navy"} 
            icon={<Award size={24}/>} 
            isSmallText={publishedResults.length === 0}
          />
          
          <DashboardCard title="Wallet Balance" val={studentData?.balance || "₦ 0.00"} color="navy" icon={<CreditCard size={24}/>} isPaid={studentData?.isCleared} />
        </div>

        {/* Admission & Results Section */}
        <div className="bg-white rounded-[45px] shadow-2xl overflow-hidden border border-slate-200 mb-10">
          <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-2xl font-black text-[#002147] uppercase tracking-tighter">Academic Status</h2>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Your current progress and documents</p>
            </div>
            <div className="flex gap-3">
                {publishedResults.length > 0 && (
                    <button onClick={() => navigate("/portal/check-result")} className="bg-red-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 transition-all shadow-xl hover:bg-[#002147]">
                        <Award size={18} /> View Results
                    </button>
                )}
                {admissionStatus === "Approved" && (
                    <button onClick={downloadAdmissionLetter} className="bg-[#002147] hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 transition-all shadow-xl active:scale-95">
                        <Download size={18} /> Admission Letter
                    </button>
                )}
            </div>
          </div>

          <div className="p-8 md:p-12">
            {admissionStatus === "Approved" ? (
              <div className="bg-emerald-50/50 border-2 border-dashed border-emerald-200 p-10 rounded-[40px] flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 bg-emerald-600 rounded-[30px] flex items-center justify-center text-white shadow-2xl shadow-emerald-200 rotate-6 animate-pulse">
                  <Award size={48} />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-emerald-900 text-4xl font-black uppercase tracking-tighter italic leading-none">Congratulations!</h3>
                  <div className="h-1.5 w-24 bg-emerald-500 my-5 mx-auto md:mx-0 rounded-full"></div>
                  <p className="text-emerald-900 text-lg font-medium leading-relaxed max-w-2xl">
                    Sannu <span className="font-black underline decoration-red-500 decoration-4">{studentData?.fullName}</span>. An baka gurbin karatu a rukunin <span className="font-black text-red-600 uppercase italic">{studentData?.course}</span>. 
                    Za ka iya fara registration dinka yanzu.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-16 rounded-[40px] text-center">
                <Clock size={60} className="mx-auto text-slate-300 mb-6 animate-spin duration-[5000ms]" />
                <h3 className="text-[#002147] font-black uppercase text-xl tracking-tighter">Application Processing</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Check back after 24 hours for update</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HIDDEN PROFESSIONAL ADMISSION LETTER TEMPLATE */}
      <div className="absolute -left-[9999px] top-0">
        <div ref={letterRef} className="w-[210mm] min-h-[297mm] bg-white p-20 text-slate-900 relative border-[15px] border-double border-slate-100">
          <div className="text-center border-b-4 border-[#002147] pb-8 mb-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-[#002147]">Skyward College of Travels and Tourism</h1>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-red-600 mt-2">Aviation • Hospitality • Tourism Management</p>
            <p className="text-[10px] font-bold text-slate-400 mt-2 italic flex items-center justify-center gap-2">
              <MapPin size={10}/> Plot 45, Academic Area, Kano State, Nigeria.
            </p>
          </div>

          <div className="flex justify-between items-start mb-12 text-left">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400">Reference Number</p>
              <p className="font-bold text-sm">SCTT/ADM/2026/00{studentData?.uid?.slice(0,4)}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400">Date Issued</p>
              <p className="font-bold text-sm">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <h2 className="text-2xl font-black uppercase border-b-2 border-slate-900 inline-block mb-10 italic">Offer of Provisional Admission</h2>

          <div className="space-y-6 text-sm leading-relaxed text-justify font-medium">
            <p>Dear <strong>{studentData?.fullName?.toUpperCase()}</strong>,</p>
            <p>
              We are pleased to inform you that your application for admission into Skyward College of Travels and Tourism 
              has been considered and approved for the 2026 Academic Session.
            </p>
            <p>
              You have been offered provisional admission to study: <span className="font-black text-red-600 uppercase italic underline">{studentData?.course}</span>.
            </p>
            <p>
              This offer is subject to the verification of your original credentials and full payment of the required 
              registration fees. Please log in to your student portal to complete your course registration within two weeks 
              of receiving this letter.
            </p>
            <p className="pt-10">We look forward to welcoming you to our academic community.</p>
          </div>

          <div className="mt-20 flex justify-between items-end">
            <div className="text-center">
              <div className="w-32 h-1 bg-slate-900 mb-2"></div>
              <p className="text-[10px] font-black uppercase">Registrar</p>
            </div>
            <div className="w-32 h-32 border-4 border-red-600/20 rounded-full flex items-center justify-center rotate-12 relative">
               <span className="text-red-600/30 text-[10px] font-black uppercase text-center tracking-tighter">Skyward College<br/>Official Stamp<br/>2026</span>
               <CheckCircle className="absolute text-emerald-500/20" size={60}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const StatusIcon = ({ label, done }) => (
  <div className="flex flex-col items-center gap-2 z-10 text-left">
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-700 ${done ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-white text-slate-200 border border-slate-100"}`}>
       {done ? <CheckCircle size={20} /> : <Clock size={20} />}
    </div>
    <p className={`text-[8px] font-black uppercase tracking-widest ${done ? "text-emerald-600" : "text-slate-300"}`}>{label}</p>
  </div>
);

const SidebarBtn = ({ icon, label, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-[10px] uppercase transition-all shadow-lg text-left ${active ? 'bg-red-600 text-white translate-x-2' : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}
  >
    {icon} {label}
  </button>
);

const DashboardCard = ({ title, val, icon, color, isSmallText, isPaid }) => {
  const borderColors = { blue: 'border-blue-500', red: 'border-red-600', navy: 'border-[#002147]', green: 'border-emerald-500' };
  const textColors = { blue: 'text-blue-600', red: 'text-red-600', navy: 'text-[#002147]', green: 'text-emerald-600' };

  return (
    <div className={`bg-white p-8 rounded-[40px] shadow-sm border-b-8 ${borderColors[color]} hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left`}>
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{title}</h4>
        <div className={`p-3 rounded-xl bg-slate-50 ${textColors[color]}`}>{icon}</div>
      </div>
      <p className={`font-black uppercase tracking-tighter leading-none ${isSmallText ? 'text-sm text-[#002147]' : `text-3xl ${textColors[color]}`}`}>{val}</p>
      {isPaid && (
        <div className="mt-4 flex items-center gap-2 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
          <CheckCircle size={12} className="text-emerald-500"/>
          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">Clearance Active</span>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;