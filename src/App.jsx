import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// ... (Duka imports dinka na sauran pages suna nan kamar yadda ka turo su)
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
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
import { NotificationProvider } from "./components/NotificationContext";
import { auth, db } from "./firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// --- PROFESSIONAL SECURITY COMPONENT (FIXED) ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole");
  const isAuth = localStorage.getItem("isAuth");
  const location = useLocation();

  // Tabbatar an yi login (String check "true")
  if (!isAuth || isAuth !== "true") {
    const isStudentRoute = location.pathname.startsWith("/portal/dashboard") || 
                           location.pathname.startsWith("/portal/payments") ||
                           location.pathname.startsWith("/portal/registration");
    
    return <Navigate to={isStudentRoute ? "/portal/student-login" : "/portal/login"} state={{ from: location }} replace />;
  }

  // Idan role din baya cikin jerin allowedRoles, tura shi Home
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.warn(`Unauthorized access attempt to ${location.pathname} by role: ${userRole}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  // Admin Setup logic dinka yana nan daram
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
              
              {/* --- SECURE ROUTES --- */}
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

              {/* SHARED SECURE ROUTES */}
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