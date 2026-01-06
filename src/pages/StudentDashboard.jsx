import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword, onAuthStateChanged } from "firebase/auth";
import { 
  User, FileCheck, Download, LogOut, Bell, Clock, 
  BookOpen, CreditCard, Menu, X, Award, MapPin,
  GraduationCap, CheckCircle, Lock, ShieldAlert, Loader2 
} from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admissionStatus, setAdmissionStatus] = useState("Admitted");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- STATES NA TSARO ---
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [studentData, setStudentData] = useState(null);

  // --- TSARO: Duba Auth Status ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/portal/student-login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setStudentData(data);
          setIsFirstLogin(data.isFirstLogin);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
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
        
        // Update Firestore
        await updateDoc(doc(db, "users", user.uid), {
          isFirstLogin: false
        });

        setIsFirstLogin(false);
        alert("Success: An canza Password! Barka da shigowa Portal.");
      }
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        alert("Zaman login dinka ya dade. Dan Allah sake fita ka dawo (Re-login) don canza password.");
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
    navigate("/portal/student-login");
  };

  const handleNavigation = (path) => {
    setIsSidebarOpen(false);
    if (location.pathname === path) return;
    navigate(path);
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#002147] mx-auto mb-4" size={40} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tabbatar da Shiga...</p>
        </div>
      </div>
    );
  }

  // 2. PASSWORD CHANGE UI
  if (isFirstLogin) {
    return (
      <div className="min-h-screen bg-[#002147] flex items-center justify-center p-6 text-left">
        <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-500">
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 mb-8">
            <ShieldAlert className="text-red-600 mb-3" size={32} />
            <h3 className="font-black text-[#002147] uppercase text-sm">Security Update</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 leading-relaxed tracking-tight">
              Sannu {studentData?.fullName || "Dalibi"}! Domin tsaro, dole ne ka canza password dinka kafin ka ga sakamakonka ko admission letter dinka.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-2 tracking-widest">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-300" size={18} />
                <input 
                  type="password" required placeholder="********"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-red-500 font-bold text-xs"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-2 tracking-widest">Confirm Password</label>
              <div className="relative">
                <CheckCircle className="absolute left-4 top-4 text-slate-300" size={18} />
                <input 
                  type="password" required placeholder="********"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-red-500 font-bold text-xs"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button disabled={updating} className="w-full py-5 bg-red-600 text-white rounded-[20px] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-red-600/20 flex items-center justify-center gap-3 active:scale-95 transition-all mt-4">
              {updating ? <Loader2 className="animate-spin" /> : "Save & Access Portal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-100 flex relative font-sans overflow-x-hidden">
      
      {/* MOBILE MENU BUTTON */}
      <button 
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] bg-[#002147] text-white p-3 rounded-2xl shadow-2xl active:scale-90 transition-transform"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        w-64 bg-[#002147] flex flex-col text-white p-6 sticky top-0 h-screen shadow-2xl z-50
        transition-all duration-300 ease-in-out md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:block"}
        fixed md:relative
      `}>
        <div className="mb-10 text-center">
          <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center mb-2 shadow-lg">
             <GraduationCap className="text-[#002147]" size={32} />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Skyward Academy</h2>
        </div>
        
        <nav className="flex-1 space-y-3 text-left">
          <SidebarBtn active={location.pathname === '/portal/dashboard'} onClick={() => handleNavigation("/portal/dashboard")} icon={<User size={18} />} label="Dashboard" />
          <SidebarBtn onClick={() => {}} icon={<FileCheck size={18} />} label="Admission Status" />
          <SidebarBtn onClick={() => handleNavigation("/portal/registration")} icon={<BookOpen size={18} />} label="Registration" />
          <SidebarBtn onClick={() => handleNavigation("/portal/check-result")} icon={<Award size={18} />} label="Results" />

          <button 
            onClick={() => navigate("/portal/payments")}
            className="w-full flex items-center gap-3 bg-blue-600/20 border-2 border-blue-500/50 hover:bg-blue-600 p-4 rounded-2xl font-black text-[10px] uppercase transition-all text-blue-400 hover:text-white text-left shadow-xl"
          >
            <CreditCard size={18} /> Payment Portal
          </button>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 hover:bg-red-500/10 rounded-2xl font-black text-[10px] uppercase p-4 mt-auto transition-all border border-red-500/20 text-left">
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto pt-20 md:pt-12 text-left">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#002147] uppercase leading-tight">
              Welcome Back,<br/> <span className="text-red-600">{studentData?.fullName || "Student"}</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
                <MapPin size={12} className="text-slate-400"/>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Skyward Main Campus</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-white p-3 rounded-xl shadow-sm text-[#002147] relative border border-slate-200 cursor-pointer hover:bg-slate-50">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
             </div>
             <div className="w-12 h-12 bg-[#002147] rounded-xl overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-white font-black text-xl uppercase">
               {studentData?.fullName?.charAt(0) || "S"}
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <DashboardCard title="Admission" val={admissionStatus} color="blue" icon={<Clock className="text-blue-500" size={24}/>} />
          <DashboardCard title="Major" val={studentData?.course || "Tourism Management"} color="red" icon={<BookOpen size={24}/>} isSmallText />
          <DashboardCard title="Fee Status" val="₦ 0.00" color="navy" icon={<CreditCard size={24}/>} isPaid />
        </div>

        {/* Admission Section */}
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 mb-10">
          <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-2xl font-black text-[#002147] uppercase tracking-tighter">Admission Offer</h2>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Session 2026/2027 Academic Year</p>
            </div>
            {admissionStatus === "Admitted" && (
              <button className="bg-[#002147] hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 transition-all shadow-xl active:scale-95">
                <Download size={18} /> Print Letter
              </button>
            )}
          </div>

          <div className="p-8 md:p-10">
            {admissionStatus === "Admitted" ? (
              <div className="bg-green-50/50 border-2 border-dashed border-green-200 p-8 md:p-12 rounded-[32px] flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 bg-green-600 rounded-3xl flex items-center justify-center text-white shadow-lg rotate-3 animate-bounce">
                  <Award size={48} />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-green-800 text-3xl font-black uppercase tracking-tighter">Congratulations!</h3>
                  <div className="h-1 w-20 bg-green-500 my-4 mx-auto md:mx-0"></div>
                  <p className="text-green-900 text-base font-medium leading-relaxed max-w-2xl">
                    You have been offered provisional admission into <span className="font-black">Skyward College</span>. 
                    Your primary course of study is <span className="text-red-600 font-black italic">{studentData?.course || "Air Cabin Crew Management"}</span>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-[32px] text-center">
                <Clock size={48} className="mx-auto text-slate-400 mb-4 animate-pulse" />
                <p className="text-slate-600 font-black uppercase text-sm tracking-widest">Reviewing Your Application...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Kananan Components don sauki ---
const SidebarBtn = ({ icon, label, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-[10px] uppercase transition-all shadow-lg text-left ${active ? 'bg-red-600' : 'hover:bg-white/10'}`}
  >
    {icon} {label}
  </button>
);

const DashboardCard = ({ title, val, icon, color, isSmallText, isPaid }) => {
  const borderColors = { blue: 'border-blue-500', red: 'border-red-600', navy: 'border-[#002147]' };
  return (
    <div className={`bg-white p-8 rounded-[32px] shadow-sm border-b-4 ${borderColors[color]} hover:shadow-xl transition-all`}>
      <div className="flex justify-between items-center mb-4 text-left">
        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{title}</h4>
        {icon}
      </div>
      <p className={`font-black uppercase tracking-tight ${isSmallText ? 'text-xs text-[#002147] leading-tight' : 'text-2xl text-green-600'}`}>{val}</p>
      {isPaid && (
        <div className="mt-2 flex items-center gap-1">
          <CheckCircle size={10} className="text-green-500"/>
          <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Clear</span>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;