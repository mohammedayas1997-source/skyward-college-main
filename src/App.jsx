import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// NAMED IMPORTS
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";

// DEFAULT IMPORTS
import Admission from "./pages/Admission";
import ELibrary from "./pages/ELibrary"; 
import ContactHelpDesk from './pages/ContactHelpDesk'; 
import CheckResult from "./pages/CheckResult";
import AboutDetail from "./pages/AboutDetail";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Apply from "./pages/Apply";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ExamOfficerDashboard from "./pages/ExamOfficerDashboard";
import CourseRegistration from "./pages/CourseRegistration";
import Courses from "./pages/Courses"; 
import PaymentPortal from "./pages/PaymentPortal";
import AccountantDashboard from "./pages/AccountantDashboard";
import AdmissionDashboard from "./pages/AdmissionDashboard";
import ExamTimetable from "./pages/ExamTimetable";
import StaffDashboard from "./pages/StaffDashboard";
import RectorDashboard from "./pages/RectorDashboard";
import UnifiedLogin from "./components/UnifiedLogin";
import AuditTrail from "./components/AuditTrail";
import News from "./pages/News";
import ProprietorDashboard from "./pages/ProprietorDashboard";

// --- NOTIFICATION CONTEXT & FIREBASE ---
import { NotificationProvider } from "./components/NotificationContext";
import { auth, db } from "./firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// --- UPDATED SECURITY COMPONENT (FIXED REDIRECT BUG) ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const userRole = localStorage.getItem("userRole");
  const isAuth = localStorage.getItem("isAuth");

  useEffect(() => {
    // Brief delay to ensure localStorage is synced
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#002147] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/20 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userRole || isAuth !== "true") {
    return <Navigate to="/portal/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {

  // --- AUTOMATIC ADMIN SETUP ---
  useEffect(() => {
    const createFirstAdmin = async () => {
      const setupFlag = localStorage.getItem("skyward_admin_setup");
      if (setupFlag === "done") return;

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          "admin@skyward.edu.ng", 
          "Skyward@2026"
        );
        
        await setDoc(doc(db, "users", userCredential.user.uid), {
          fullName: "Main Admin",
          email: "admin@skyward.edu.ng",
          role: "admin",
          createdAt: new Date()
        });

        localStorage.setItem("skyward_admin_setup", "done");
        console.log("SUCCESS: Admin user created in Firebase!");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          localStorage.setItem("skyward_admin_setup", "done");
        }
        console.log("Admin check: Ready.");
      }
    };

    createFirstAdmin();
  }, []);

  return (
    <NotificationProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50">
          
          {/* HEADER LOGIC - Hidden in Portals */}
          <Routes>
            <Route path="/portal/*" element={null} />
            <Route path="/admin/*" element={null} />
            <Route path="/staff/*" element={null} />
            <Route path="*" element={<Header />} />
          </Routes>
          
          <main className="flex-grow">
            <Routes>
              {/* PUBLIC PAGES */}
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<News />} />
              <Route path="/about/:id" element={<AboutDetail />} />
              <Route path="/admission" element={<Admission />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/e-library" element={<ELibrary />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help-desk" element={<ContactHelpDesk />} />
              <Route path="/admission/apply" element={<Apply />} />
              
              {/* LOGIN PAGES */}
              <Route path="/portal/login" element={<UnifiedLogin />} />
              <Route path="/portal/student-login" element={<Login userType="student" />} />
              <Route path="/portal/staff-login" element={<Login userType="staff" />} />
              <Route path="/skyward-secure-access" element={<AdminLogin />} />
              <Route path="/portal/audit" element={<AuditTrail />} />
              
              {/* --- PROTECTED PORTAL ROUTES --- */}
              <Route path="/portal/proprietor" element={
                <ProtectedRoute allowedRoles={["proprietor"]}>
                  <ProprietorDashboard />
                </ProtectedRoute>
              } />

              <Route path="/portal/rector" element={
                <ProtectedRoute allowedRoles={["rector"]}>
                  <RectorDashboard />
                </ProtectedRoute>
              } />

              <Route path="/staff/dashboard" element={
                <ProtectedRoute allowedRoles={["staff"]}>
                  <StaffDashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin/exam-office" element={
                <ProtectedRoute allowedRoles={["exam-officer"]}>
                  <ExamOfficerDashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin/accountant" element={
                <ProtectedRoute allowedRoles={["accountant"]}>
                  <AccountantDashboard />
                </ProtectedRoute>
              } />

              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/portal/dashboard" element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />

              {/* SHARED STUDENT TOOLS */}
              <Route path="/portal/payments" element={<PaymentPortal />} /> 
              <Route path="/portal/registration" element={<CourseRegistration />} />
              <Route path="/portal/check-result" element={<CheckResult />} />
              <Route path="/portal/exam-timetable" element={<ExamTimetable />} />

              {/* CATCH-ALL REDIRECT */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* FOOTER LOGIC - Hidden in Portals */}
          <Routes>
            <Route path="/portal/*" element={null} />
            <Route path="/admin/*" element={null} />
            <Route path="/staff/*" element={null} />
            <Route path="*" element={<Footer />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;