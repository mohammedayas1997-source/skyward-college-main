import React, { useState, useRef, useEffect } from "react";
import { db } from "../firebase"; 
import { collection, addDoc, serverTimestamp, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { 
  Upload, CreditCard, Trash2, Loader2, User, School, BookOpen, Download, MapPin, GraduationCap, Lock 
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

  // List of 9 standard subjects for O-Level
  const defaultSubjects = [
    "English Language", "Mathematics", "Physics", "Chemistry", "Biology", 
    "Economics", "Geography", "Agricultural Science", "Civic Education"
  ];

  const [sittings, setSittings] = useState([
    { id: Date.now(), examType: "", examNo: "", centerNo: "", results: defaultSubjects.reduce((acc, sub) => ({...acc, [sub]: ""}), {}) }
  ]);

  const [formData, setFormData] = useState({
    fullName: "", dob: "", email: "", phone: "", gender: "", 
    stateOrigin: "", lgaOrigin: "", 
    stateResidence: "", lgaResidence: "", residentialAddress: "",
    selectedCourse: "",
    highestQualification: "", 
    institutionName: "",
    yearOfGraduation: ""
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
      reader.onload = (event) => {
        setPassportPreview(event.target.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResultChange = (sittingId, subject, grade) => {
    setSittings(sittings.map(s => 
      s.id === sittingId ? { ...s, results: { ...s.results, [subject]: grade } } : s
    ));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!portalSettings.isOpen) return alert("MAI GIRMA ADMISSION OFFICER YA RUFE PORTAL A YANZU.");
    if (!passportPreview) return alert("Dole ne ka saka Hoton Passport!");
    
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "applications"), {
        ...formData,
        sittings: sittings,
        passport: passportPreview,
        status: "Pending Payment",
        appliedAt: serverTimestamp(),
      });
      setApplicationId(docRef.id);
      setStep("payment");
    } catch (error) {
      alert("Error: " + error.message);
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
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`SKYWARD-RECEIPT-${applicationId.substr(0, 5)}.pdf`);
  };

  // PORTAL CLOSED VIEW
  if (!portalSettings.isOpen) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl text-center">
          <Lock size={80} className="mx-auto text-red-600 mb-6" />
          <h1 className="text-3xl font-black text-[#002147] uppercase">Portal is Closed</h1>
          <p className="text-slate-500 mt-4 font-bold">Admission applications are currently suspended by the admin officer.</p>
        </div>
      </div>
    );
  }

  // PAYMENT SCREEN
  if (step === "payment") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-[#002147] p-10 text-center text-white">
            <CreditCard size={60} className="mx-auto mb-4 text-emerald-400" />
            <h2 className="text-2xl font-black uppercase tracking-tighter">Application Fee</h2>
          </div>
          <div className="p-10 text-center">
            <span className="text-6xl font-black text-[#002147]">₦5,000</span>
            <p className="text-slate-500 text-xs font-bold mt-2 uppercase">Official Processing Fee</p>
            <button onClick={handlePaymentSuccess} className="w-full mt-8 bg-emerald-600 text-white font-black py-5 rounded-2xl uppercase shadow-xl hover:bg-[#002147] transition-all">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Pay Now"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS & RECEIPT
  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-6">
        <div ref={receiptRef} className="w-[180mm] bg-white p-10 shadow-2xl border-[12px] border-[#002147] mb-6 relative">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-[#002147] rounded-full flex items-center justify-center text-white font-black text-2xl border-2 border-red-500">S</div>
               <div className="text-left">
                 <h1 className="text-xl font-black text-[#002147]">SKYWARD COLLEGE</h1>
                 <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Travels & Tourism Academy</p>
               </div>
            </div>
            <QRCodeSVG value={applicationId} size={80} />
          </div>
          <div className="flex gap-8 border-y-2 py-6 text-left">
             <img src={passportPreview} className="w-32 h-40 object-cover rounded-lg border-2 border-slate-200" alt="Passport" />
             <div className="space-y-2">
                <p className="text-xs font-black uppercase text-slate-400">Student Full Name</p>
                <p className="text-xl font-black text-[#002147] uppercase">{formData.fullName}</p>
                <p className="text-xs font-black uppercase text-slate-400 mt-4">Program of Choice</p>
                <p className="text-sm font-bold text-slate-700">{formData.selectedCourse}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                   <div><p className="text-[8px] font-black uppercase text-slate-400">ID</p><p className="text-[10px] font-bold">{applicationId.substr(0,8)}</p></div>
                   <div><p className="text-[8px] font-black uppercase text-slate-400">Date</p><p className="text-[10px] font-bold">{new Date().toLocaleDateString()}</p></div>
                </div>
             </div>
          </div>
          <p className="text-[10px] text-center mt-6 text-slate-400 font-bold">SCAN QR CODE TO VERIFY ADMISSION STATUS</p>
        </div>
        <div className="flex gap-4">
          <button onClick={downloadReceipt} className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-black flex items-center gap-2 shadow-lg">
            <Download size={20}/> DOWNLOAD RECEIPT
          </button>
          <button onClick={() => window.location.reload()} className="bg-[#002147] text-white px-10 py-4 rounded-xl font-black shadow-lg">FINISH</button>
        </div>
      </div>
    );
  }

  // MAIN FORM
  return (
    <div className="min-h-screen bg-[#F0F4F8] py-16 px-4 md:px-20 font-sans">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-[40px] overflow-hidden border border-slate-100 text-left">
        
        <div className="bg-[#002147] p-12 text-white flex justify-between items-center relative">
          <div className="z-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Admission Form</h1>
            <p className="text-red-500 font-black mt-2 uppercase text-[10px] tracking-[0.3em]">Skyward College of Travels & Tourism</p>
          </div>
          <School size={100} className="opacity-10 absolute right-10" />
        </div>

        <form onSubmit={handleFormSubmit} className="p-10 md:p-16 space-y-12">
          
          {/* PROFILE & PASSPORT */}
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
              </div>
            </div>
          </section>

          {/* ORIGIN & RESIDENCE */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b pb-4">
              <MapPin className="text-blue-600" />
              <h2 className="text-[#002147] text-xl font-black uppercase">Origin & Residence</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required name="stateOrigin" onChange={handleChange} placeholder="State of Origin" className="sky-input" />
                <input required name="lgaOrigin" onChange={handleChange} placeholder="LGA of Origin" className="sky-input" />
                <input required name="stateResidence" onChange={handleChange} placeholder="State of Residence" className="sky-input" />
                <input required name="lgaResidence" onChange={handleChange} placeholder="LGA of Residence" className="sky-input" />
                <textarea required name="residentialAddress" onChange={handleChange} placeholder="Full Residential Address" className="sky-input md:col-span-2" rows="2" />
            </div>
          </section>

          {/* HIGHER EDUCATION */}
          <section className="space-y-8 bg-slate-50 p-8 rounded-[2rem]">
            <div className="flex items-center gap-4 border-b pb-4">
              <GraduationCap className="text-emerald-600" />
              <h2 className="text-[#002147] text-xl font-black uppercase">Higher Education</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <select name="highestQualification" onChange={handleChange} className="sky-input">
                    <option value="">Qualification (e.g Degree, HND)</option>
                    <option>Degree</option>
                    <option>HND</option>
                    <option>ND</option>
                    <option>NCE</option>
                    <option>SSCE ONLY</option>
                </select>
                <input name="institutionName" onChange={handleChange} placeholder="Name of Institution" className="sky-input" />
                <input name="yearOfGraduation" onChange={handleChange} placeholder="Year of Graduation" className="sky-input" />
            </div>
          </section>

          {/* O-LEVEL RESULTS (9 SUBJECTS) */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b pb-4">
              <BookOpen className="text-red-600" />
              <h2 className="text-[#002147] text-xl font-black uppercase">O-Level Results (9 Subjects)</h2>
            </div>
            {sittings.map((sitting, index) => (
              <div key={sitting.id} className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <input required placeholder="Exam Type (WAEC/NECO)" className="sky-input" onChange={(e) => sitting.examType = e.target.value} />
                  <input required placeholder="Exam Number" className="sky-input" onChange={(e) => sitting.examNo = e.target.value} />
                  <input required placeholder="Center Number" className="sky-input" onChange={(e) => sitting.centerNo = e.target.value} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {defaultSubjects.map(sub => (
                    <div key={sub} className="text-left">
                      <label className="text-[9px] font-black block mb-1 uppercase text-slate-400">{sub}</label>
                      <select required onChange={(e) => handleResultChange(sitting.id, sub, e.target.value)} className="w-full p-3 border-2 border-slate-100 rounded-xl text-xs font-bold bg-slate-50">
                        <option value="">Grade</option>
                        {["A1","B2","B3","C4","C5","C6","D7","E8","F9"].map(g => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* PROGRAM SELECTION */}
          <section className="bg-[#002147] p-8 rounded-[2rem] text-white">
              <label className="text-xs font-black uppercase mb-4 block">Select Academic Program</label>
              <select required name="selectedCourse" onChange={handleChange} className="w-full p-5 rounded-2xl bg-white text-[#002147] font-black outline-none">
                <option value="">Select Course...</option>
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
            {loading ? <Loader2 className="animate-spin" /> : "Verify & Finalize Application"}
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