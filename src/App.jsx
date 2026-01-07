import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

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
import ExamOfficerDashboard from "./pages/ExamOfficerDashboard";
import CourseRegistration from "./pages/CourseRegistration";
import Courses from "./pages/Courses"; 
import PaymentPortal from "./pages/PaymentPortal";
import AccountantDashboard from "./pages/AccountantDashboard";
import ExamTimetable from "./pages/ExamTimetable";
import StaffDashboard from "./pages/StaffDashboard";
import RectorDashboard from "./pages/RectorDashboard";
import UnifiedLogin from "./components/UnifiedLogin"; 
import AuditTrail from "./components/AuditTrail";
import News from "./pages/News";
import ProprietorDashboard from "./pages/ProprietorDashboard";
import AdmissionOfficerDashboard from "./pages/AdmissionOfficerDashboard"; // Na kara wannan

// --- NOTIFICATION CONTEXT & FIREBASE ---
import { NotificationProvider } from "./components/NotificationContext";
import { auth, db } from "./firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import ForgotPassword from "./pages/ForgotPassword";

// --- INGANTAACCEN SECURITY COMPONENT ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole");
  const isAuth = localStorage.getItem("isAuth");
  const location = useLocation();

  if (!isAuth || isAuth !== "true") {
    const isStudentRoute = location.pathname.startsWith("/portal/dashboard");
    return <Navigate to={isStudentRoute ? "/portal/student-login" : "/portal/login"} state={{ from: location }} replace />;
  }

  if (!userRole && isAuth === "true") {
    return <div className="min-h-screen flex items-center justify-center bg-[#001524] text-white font-bold italic tracking-widest">VERIFYING ACCESS...</div>;
  }

  const normalizedRole = userRole ? userRole.toLowerCase().trim() : "";

  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    console.error("Unauthorized Role:", normalizedRole);
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
    const createFirstAdmin = async () => {
      const setupFlag = localStorage.getItem("skyward_admin_setup");
      if (setupFlag === "done") return;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, "admin@skyward.edu.ng", "Skyward@2026");
        await setDoc(doc(db, "users", userCredential.user.uid), {
          fullName: "Main Admin",
          email: "admin@skyward.edu.ng",
          role: "admin",
          createdAt: new Date()
        });
        localStorage.setItem("skyward_admin_setup", "done");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") localStorage.setItem("skyward_admin_setup", "done");
      }
    };
    createFirstAdmin();
  }, []);

  return (
    <NotificationProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50">
          
          <Routes>
            <Route path="/portal/*" element={null} />
            <Route path="/admin/*" element={null} />
            <Route path="/staff/*" element={null} />
            <Route path="/skyward-secure-access" element={null} />
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
              
              {/* LOGIN ROUTES */}
              <Route path="/portal/student-login" element={<Login />} />
              <Route path="/portal/login" element={<UnifiedLogin />} />
              <Route path="/skyward-secure-access" element={<UnifiedLogin />} />
              <Route path="/portal/audit" element={<AuditTrail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* --- SECURE ROUTES --- */}
              
              {/* 1. PROPRIETOR */}
              <Route path="/portal/proprietor" element={
                <ProtectedRoute allowedRoles={["proprietor"]}>
                  <ProprietorDashboard />
                </ProtectedRoute>
              } />

              {/* 2. RECTOR */}
              <Route path="/portal/rector" element={
                <ProtectedRoute allowedRoles={["rector"]}>
                  <RectorDashboard />
                </ProtectedRoute>
              } />

              {/* 3. STAFF */}
              <Route path="/staff/dashboard" element={
                <ProtectedRoute allowedRoles={["staff"]}>
                  <StaffDashboard />
                </ProtectedRoute>
              } />

              {/* 4. EXAM OFFICER */}
              <Route path="/admin/exam-office" element={
                <ProtectedRoute allowedRoles={["exam-officer", "exam"]}>
                  <ExamOfficerDashboard />
                </ProtectedRoute>
              } />

              {/* 5. ACCOUNTANT */}
              <Route path="/admin/accountant" element={
                <ProtectedRoute allowedRoles={["accountant"]}>
                  <AccountantDashboard />
                </ProtectedRoute>
              } />

              {/* 6. ADMISSION OFFICER */}
              <Route path="/admin/admission-officer" element={
                <ProtectedRoute allowedRoles={["admission-officer", "admission"]}>
                  <AdmissionOfficerDashboard />
                </ProtectedRoute>
              } />

              {/* 7. ADMIN */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* 8. STUDENT & PORTAL SERVICES */}
              <Route path="/portal/dashboard" element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />

              <Route path="/portal/payments" element={
                <ProtectedRoute allowedRoles={["student", "proprietor", "accountant"]}>
                  <PaymentPortal />
                </ProtectedRoute>
              } /> 

              <Route path="/portal/registration" element={<ProtectedRoute allowedRoles={["student"]}><CourseRegistration /></ProtectedRoute>} />
              <Route path="/portal/check-result" element={<ProtectedRoute allowedRoles={["student"]}><CheckResult /></ProtectedRoute>} />
              <Route path="/portal/exam-timetable" element={<ProtectedRoute allowedRoles={["student"]}><ExamTimetable /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Routes>
            <Route path="/portal/*" element={null} />
            <Route path="/admin/*" element={null} />
            <Route path="/staff/*" element={null} />
            <Route path="/skyward-secure-access" element={null} />
            <Route path="*" element={<Footer />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;