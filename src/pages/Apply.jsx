import React, { useState, useRef, useEffect } from "react";
import { db } from "../firebase"; 
import { collection, addDoc, serverTimestamp, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { 
  Upload, CreditCard, Loader2, User, School, BookOpen, Download, MapPin, GraduationCap, Lock 
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { QRCodeSVG } from "qrcode.react";

export const Apply = () => {
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [passportPreview, setPassportPreview] = useState(null);
  const receiptRef = useRef(null);
  
  const [portalSettings, setPortalSettings] = useState({ isOpen: true });

  const schoolLogo = "/logo.png"; 

  const secondarySubjects = [
    "English Language", "Mathematics", "Physics", "Chemistry", "Biology", 
    "Economics", "Geography", "Agricultural Science", "Civic Education",
    "Further Mathematics", "Literature in English", "Government", "History",
    "CRS", "IRS", "Hausa", "Igbo", "Yoruba", "French", "Commerce", 
    "Financial Accounting", "Technical Drawing", "Data Processing", 
    "Computer Studies", "Food & Nutrition", "Home Management", 
    "Animal Husbandry", "Marketing", "Insurance", "Office Practice"
  ];

  const [oLevelResults, setOLevelResults] = useState(
    Array(9).fill(null).map((_, i) => ({ id: i, subject: "", grade: "" }))
  );

  const [formData, setFormData] = useState({
    fullName: "", dob: "", email: "", phone: "", gender: "", 
    stateOrigin: "", lgaOrigin: "", 
    stateResidence: "", lgaResidence: "", residentialAddress: "",
    selectedCourse: "",
    highestQualification: "", 
    institutionName: "",
    courseStudied: "", 
    studentIdNo: "", 
    yearOfGraduation: "",
    examNumber: "", // New
    centerNumber: "" // New
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "systemSettings", "admissionControl"), (snapshot) => {
      if (snapshot.exists()) {
        setPortalSettings(snapshot.data());
      }
    });
    return () => unsub();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePassportUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPassportPreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubjectChange = (id, field, value) => {
    setOLevelResults(prev => prev.map(res => res.id === id ? { ...res, [field]: value } : res));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!portalSettings.isOpen) return alert("MAI GIRMA ADMISSION OFFICER YA RUFE PORTAL!");
    if (!passportPreview) return alert("Don Allah saka Hoton Passport!");
    
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "applications"), {
        ...formData,
        oLevelResults,
        passport: passportPreview,
        status: "Pending Payment",
        appliedAt: serverTimestamp(),
      });
      setApplicationId(docRef.id);
      setStep("payment");
    } catch (error) {
      alert("Kuskure: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "applications", applicationId), {
        status: "Paid",
        paymentRef: "PAY-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        paymentDate: new Date().toLocaleString(),
      });
      setStep("success");
    } catch (error) {
      alert("Payment Error");
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`SKYWARD-RECEIPT-${applicationId.substr(0, 5)}.pdf`);
  };

  if (!portalSettings.isOpen) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-left">
        <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl">
          <Lock size={80} className="mx-auto text-red-600 mb-6" />
          <h1 className="text-3xl font-black text-[#002147] uppercase text-center">Portal is Closed</h1>
          <p className="text-slate-500 mt-4 font-bold text-center">Admission applications are currently disabled.</p>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-left">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-[#002147] p-10 text-center text-white">
            <CreditCard size={60} className="mx-auto mb-4 text-emerald-400" />
            <h2 className="text-2xl font-black uppercase tracking-tighter">Application Fee</h2>
          </div>
          <div className="p-10 text-center">
            <span className="text-6xl font-black text-[#002147]">₦5,000</span>
            <button onClick={handlePaymentSuccess} className="w-full mt-8 bg-emerald-600 text-white font-black py-5 rounded-2xl uppercase shadow-xl hover:bg-[#002147] transition-all">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Pay Now"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-6 text-left">
        <div ref={receiptRef} className="w-[180mm] bg-white p-10 shadow-2xl border-[12px] border-[#002147] mb-6 relative">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
               <div className="w-20 h-20 bg-white flex items-center justify-center border-2 border-slate-100 p-1">
                 <img src={schoolLogo} alt="School Logo" className="w-full h-full object-contain" />
               </div>
               <div className="text-left">
                 <h1 className="text-xl font-black text-[#002147]">SKYWARD COLLEGE</h1>
                 <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Travels & Tourism Academy</p>
               </div>
            </div>
            <QRCodeSVG value={applicationId} size={80} />
          </div>
          <div className="flex gap-8 border-y-2 py-6 text-left">
             <img src={passportPreview} className="w-32 h-40 object-cover rounded-lg border-2 border-slate-200" alt="Passport" />
             <div className="space-y-2 w-full">
                <p className="text-xs font-black uppercase text-slate-400">Student Full Name</p>
                <p className="text-xl font-black text-[#002147] uppercase">{formData.fullName}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                   <div><p className="text-[8px] font-black uppercase text-slate-400">Program Applied</p><p className="text-xs font-bold text-slate-700">{formData.selectedCourse}</p></div>
                   <div><p className="text-[8px] font-black uppercase text-slate-400">Amount Paid</p><p className="text-xs font-black text-emerald-600">₦5,000.00</p></div>
                   <div><p className="text-[8px] font-black uppercase text-slate-400">Application ID</p><p className="text-[10px] font-bold">{applicationId.substr(0,10)}</p></div>
                   <div><p className="text-[8px] font-black uppercase text-slate-400">Payment Status</p><p className="text-[10px] font-bold text-emerald-600 uppercase">Successful</p></div>
                </div>
             </div>
          </div>
          <div className="mt-4 flex justify-between items-end">
             <p className="text-[10px] text-slate-400 font-bold uppercase">Official Digital Receipt - {new Date().toLocaleString()}</p>
             <div className="text-right">
                <p className="text-[8px] font-black uppercase text-slate-400 underline">Authorized Signature</p>
                <p className="text-[10px] font-serif italic text-[#002147]">Skyward Registrar</p>
             </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button onClick={downloadReceipt} className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
            <Download size={20}/> DOWNLOAD RECEIPT
          </button>
          <button onClick={() => window.location.reload()} className="bg-[#002147] text-white px-10 py-4 rounded-xl font-black shadow-lg hover:bg-red-600 transition-colors">FINISH</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] py-16 px-4 md:px-20 font-sans text-left">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-[40px] overflow-hidden border border-slate-100">
        
        <div className="bg-[#002147] p-12 text-white flex justify-between items-center relative">
          <div className="z-10 flex items-center gap-6">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 flex items-center justify-center">
              <img src={schoolLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">Admission Form</h1>
              <p className="text-red-500 font-black mt-2 uppercase text-[10px] tracking-[0.3em]">Skyward College of Travels & Tourism</p>
            </div>
          </div>
          <School size={100} className="opacity-10 absolute right-10" />
        </div>

        <form onSubmit={handleFormSubmit} className="p-10 md:p-16 space-y-12">
          
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b pb-4">
              <User className="text-red-600" />
              <h2 className="text-[#002147] text-xl font-black uppercase">Candidate Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center">
                <div className="w-44 h-52 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem] relative flex items-center justify-center overflow-hidden hover:border-blue-500 transition-all">
                  {passportPreview ? (
                    <img src={passportPreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto text-slate-300 mb-2" />
                      <span className="text-[10px] font-black text-slate-400 uppercase">Upload Passport</span>
                    </div>
                  )}
                  <input required type="file" accept="image/*" onChange={handlePassportUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required name="fullName" onChange={handleChange} placeholder="Full Name (Surname First)" className="sky-input" />
                <input required name="email" type="email" onChange={handleChange} placeholder="Email Address" className="sky-input" />
                <input required name="phone" type="tel" onChange={handleChange} placeholder="Phone Number" className="sky-input" />
                <select required name="gender" onChange={handleChange} className="sky-input">
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                <input required name="stateOrigin" onChange={handleChange} placeholder="State of Origin" className="sky-input" />
                <input required name="lgaOrigin" onChange={handleChange} placeholder="LGA of Origin" className="sky-input" />
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b pb-4">
              <MapPin className="text-blue-600" />
              <h2 className="text-[#002147] text-xl font-black uppercase">Residential Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required name="stateResidence" onChange={handleChange} placeholder="State of Residence" className="sky-input" />
                <input required name="lgaResidence" onChange={handleChange} placeholder="LGA of Residence" className="sky-input" />
                <textarea required name="residentialAddress" onChange={handleChange} placeholder="Full Residential Address" className="sky-input md:col-span-2" rows="2" />
            </div>
          </section>

          <section className="space-y-8 bg-slate-50 p-8 rounded-[2rem]">
            <div className="flex items-center gap-4 border-b pb-4">
              <GraduationCap className="text-emerald-600" />
              <h2 className="text-[#002147] text-xl font-black uppercase">Higher Education History</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <select required name="highestQualification" onChange={handleChange} className="sky-input">
                    <option value="">Qualification (e.g Degree, HND)</option>
                    <option>Degree</option>
                    <option>HND</option>
                    <option>ND</option>
                    <option>NCE</option>
                    <option>SSCE ONLY</option>
                </select>
                <input required name="institutionName" onChange={handleChange} placeholder="Name of Institution" className="sky-input" />
                <input required name="courseStudied" onChange={handleChange} placeholder="Course Studied (e.g Bio-Chemistry)" className="sky-input" />
                <input required name="studentIdNo" onChange={handleChange} placeholder="Student ID / Matric Number" className="sky-input" />
                <input required name="yearOfGraduation" onChange={handleChange} placeholder="Year of Graduation" className="sky-input" />
            </div>
          </section>

          {/* O-LEVEL RESULTS - ADDED EXAM & CENTER NO */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b pb-4">
              <BookOpen className="text-red-600" />
              <h2 className="text-[#002147] text-xl font-black uppercase">O-Level Results</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
               <input required name="examNumber" onChange={handleChange} placeholder="WAEC/NECO Exam Number" className="sky-input shadow-sm" />
               <input required name="centerNumber" onChange={handleChange} placeholder="Center Number" className="sky-input shadow-sm" />
            </div>

            <label className="text-xs font-black text-slate-500 uppercase block mb-2">Select 9 Subjects & Grades</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {oLevelResults.map((res) => (
                <div key={res.id} className="bg-white p-5 rounded-[1.5rem] border-2 border-slate-100 shadow-sm flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Subject {res.id + 1}</label>
                  <select required className="sky-input !p-3 !text-xs" onChange={(e) => handleSubjectChange(res.id, "subject", e.target.value)}>
                    <option value="">Select Subject</option>
                    {secondarySubjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select required className="sky-input !p-3 !text-xs" onChange={(e) => handleSubjectChange(res.id, "grade", e.target.value)}>
                    <option value="">Select Grade</option>
                    {["A1","B2","B3","C4","C5","C6","D7","E8","F9"].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#002147] p-8 rounded-[2rem] text-white">
              <label className="text-xs font-black uppercase mb-4 block">Finalize Your Program Selection</label>
              <select required name="selectedCourse" onChange={handleChange} className="w-full p-5 rounded-2xl bg-white text-[#002147] font-black outline-none">
                <option value="">Choose Program...</option>
                <option>Air Cabin Crew Management</option>
                <option>Flight Dispatcher</option>
                <option>Travel and Tourism Management</option>
                <option>Hotel and Hospitality Management</option>
                <option>Cargo & Freight Handling</option>
                <option>Catering and Craft Practice</option>
                <option>Airport Operations and Safety</option>
                <option>Visa Processing</option>
                <option>Travel Agency Management</option>
                <option>Customer Service Management</option>
              </select>
          </section>

          <button disabled={loading} type="submit" className="w-full bg-red-600 text-white font-black py-8 rounded-[2.5rem] uppercase tracking-[0.2em] shadow-2xl hover:bg-[#002147] transition-all flex items-center justify-center gap-4">
            {loading ? <Loader2 className="animate-spin" /> : "Verify & Process Application"}
          </button>

        </form>
      </div>

      <style jsx>{`
        .sky-input {
          width: 100%;
          padding: 1.2rem 1.5rem;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 1.2rem;
          font-weight: 700;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.3s ease;
        }
        .sky-input:focus {
          border-color: #002147;
          background: white;
          box-shadow: 0 10px 15px -3px rgba(0, 33, 71, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Apply;