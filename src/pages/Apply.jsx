import React, { useState, useRef, useEffect } from "react"; // Added useEffect
import { db } from "../firebase"; 
import { collection, addDoc, serverTimestamp, updateDoc, doc, onSnapshot } from "firebase/firestore"; // Added onSnapshot
import { 
  Upload, CreditCard, Printer, CheckCircle, PlusCircle, Trash2, 
  MapPin, Calendar, Home, Briefcase, Loader2, User, School, BookOpen, Download, Lock 
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
  
  // --- PORTAL CONTROL STATE ---
  const [portalSettings, setPortalSettings] = useState({ isOpen: true, message: "" });

  const [sittings, setSittings] = useState([{ id: Date.now(), examType: "", examNo: "", centerNo: "", results: {} }]);
  const [formData, setFormData] = useState({
    fullName: "", dob: "", email: "", phone: "", gender: "", 
    stateOrigin: "", lgaOrigin: "", address: "", selectedCourse: ""
  });

  // --- LISTEN FOR PORTAL STATUS ---
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
      reader.onloadend = () => setPassportPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addSitting = () => {
    if (sittings.length < 2) setSittings([...sittings, { id: Date.now(), results: {} }]);
  };

  const removeSitting = (id) => {
    setSittings(sittings.filter(s => s.id !== id));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!portalSettings.isOpen) return alert("Sorry, the portal is currently closed.");
    
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "applications"), {
        ...formData,
        sittings: sittings,
        passport: passportPreview,
        status: "Pending Payment",
        viewedByAdmission: false,
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
      const appRef = doc(db, "applications", applicationId);
      await updateDoc(appRef, {
        status: "Paid",
        paymentRef: "PAY-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        paymentDate: new Date().toLocaleString(),
      });
      setStep("success");
    } catch (error) {
      alert("Payment Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`SKYWARD-RECEIPT-${applicationId.substr(0, 5)}.pdf`);
  };

  if (step === "payment") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-[#002147] p-8 text-center text-white">
            <CreditCard size={48} className="mx-auto mb-4 text-emerald-400" />
            <h2 className="text-xl font-black uppercase tracking-tighter">Application Fee</h2>
            <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-widest">Secure Payment Gateway</p>
          </div>
          <div className="p-10 text-center">
            <div className="mb-8">
              <span className="text-5xl font-black text-[#002147]">₦5,000</span>
              <p className="text-slate-500 text-xs font-bold mt-2 uppercase">Official Form Fee</p>
            </div>
            <button 
              onClick={handlePaymentSuccess} 
              className="w-full bg-emerald-600 hover:bg-[#002147] text-white font-black py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Authorize Payment"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-6 font-sans">
        <div ref={receiptRef} className="w-[180mm] bg-white p-10 shadow-2xl border-[12px] border-[#002147] relative overflow-hidden mb-6">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#002147] rounded-full flex items-center justify-center text-white font-black text-2xl italic border-4 border-red-500">S</div>
              <div>
                <h1 className="text-2xl font-black text-[#002147] leading-none">SKYWARD COLLEGE</h1>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-[0.2em]">Travels & Tourism Academy</p>
                <p className="text-[9px] text-slate-500 font-bold">Approved by Federal Ministry of Education</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-[10px] font-black uppercase mb-2">Payment Verified</div>
              <p className="text-[9px] font-bold text-slate-400 italic">Receipt No: {applicationId?.toUpperCase()}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-8 border-y-2 border-slate-100 py-6">
            <div className="col-span-1">
              {passportPreview ? (
                <img src={passportPreview} className="w-32 h-40 object-cover rounded-lg border-2 border-slate-200" alt="Student" />
              ) : (
                <div className="w-32 h-40 bg-slate-100 rounded-lg border-2 border-dashed flex items-center justify-center">No Photo</div>
              )}
            </div>
            <div className="col-span-2 space-y-3">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase">Candidate Name</span>
                <span className="text-lg font-black text-[#002147] uppercase">{formData.fullName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase">Selected Course</span>
                <span className="text-sm font-bold text-slate-700">{formData.selectedCourse}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase">Application ID</span>
                  <p className="text-[10px] font-bold">{applicationId?.substr(0,10)}</p>
                </div>
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase">Payment Date</span>
                  <p className="text-[10px] font-bold">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
               <h3 className="text-[12px] font-black text-[#002147] mb-2 uppercase">Official Stamp Required</h3>
               <div className="w-32 h-32 border-2 border-dashed border-slate-200 flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase rotate-12">Registry Dept</div>
            </div>
            <div className="text-center">
              <QRCodeSVG value={`https://skyward.edu/verify/${applicationId}`} size={100} level="H" />
              <p className="text-[8px] font-bold mt-2 text-slate-400 uppercase">Scan to Verify</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16"></div>
        </div>

        <div className="flex gap-4">
          <button onClick={downloadReceipt} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
            <Download size={20}/> Download Receipt PDF
          </button>
          <button onClick={() => window.location.reload()} className="bg-[#002147] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-xl">
            Finish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] py-16 px-4 md:px-20 font-sans text-left">
      <div className="max-w-5xl mx-auto bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] rounded-[40px] overflow-hidden border border-slate-100">
        
        <div className="bg-[#002147] p-12 text-white relative">
          <div className="relative z-10">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Admission Form</h1>
            <p className="text-red-500 font-black mt-2 uppercase text-[10px] tracking-[0.4em]">Skyward College of Travels & Tourism</p>
          </div>
          <School className="absolute right-12 top-12 text-white/5" size={120} />
        </div>

        <form onSubmit={handleFormSubmit} className="p-10 md:p-16 space-y-16">
          {/* PORTAL STATUS BANNER IF CLOSED */}
          {!portalSettings.isOpen && (
            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-[2rem] flex items-center gap-4">
               <div className="p-3 bg-red-600 text-white rounded-xl shadow-lg shadow-red-200"><Lock size={20}/></div>
               <div>
                 <p className="text-[10px] font-black uppercase text-red-600 tracking-widest">Portal Closed</p>
                 <p className="text-xs font-bold text-slate-600">{portalSettings.message}</p>
               </div>
            </div>
          )}

          <section className={!portalSettings.isOpen ? "opacity-50 pointer-events-none" : ""}>
            <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><User size={24}/></div>
              <h2 className="text-[#002147] text-xl font-black uppercase">Candidate Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <div className="w-44 h-52 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center relative group hover:border-red-500 transition-all overflow-hidden">
                  {passportPreview ? (
                    <img src={passportPreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <>
                      <Upload className="text-slate-300 mb-2" />
                      <span className="text-[9px] uppercase font-black text-slate-400">Upload Passport</span>
                    </>
                  )}
                  <input required type="file" accept="image/*" onChange={handlePassportUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required name="fullName" onChange={handleChange} placeholder="Full Name (Surname First)" className="sky-input" />
                <input required name="email" type="email" onChange={handleChange} placeholder="Email Address" className="sky-input" />
                <input required name="phone" type="tel" onChange={handleChange} placeholder="Phone Number" className="sky-input" />
                <select required name="gender" onChange={handleChange} className="sky-input">
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                <input required name="stateOrigin" onChange={handleChange} placeholder="State of Origin" className="sky-input" />
                <input required name="lgaOrigin" onChange={handleChange} placeholder="LGA of Origin" className="sky-input" />
              </div>
            </div>
          </section>

          <section className={`bg-slate-50 p-10 rounded-[3rem] border border-slate-100 ${!portalSettings.isOpen ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[#002147] text-white rounded-2xl"><BookOpen size={24}/></div>
              <h2 className="text-[#002147] text-xl font-black uppercase">Academic Selection</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Preferred Program</label>
                 <select required name="selectedCourse" onChange={handleChange} className="sky-input bg-white !border-red-600 !text-[#002147] font-black">
                   <option value="">Choose Course...</option>
                   <option>Air Cabin Crew Management</option>
                   <option>Flight Dispatcher</option>
                   <option>Travel and Tourism Management</option>
                   <option>Visa Processing</option>
                 </select>
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">O-Level Sitting Count</label>
                 <div className="flex gap-4">
                    <button type="button" onClick={addSitting} className="flex-1 bg-white border-2 border-slate-200 py-3 rounded-xl font-black text-[10px] uppercase hover:border-red-500 transition-all flex items-center justify-center gap-2">
                       <PlusCircle size={16}/> Add Sitting
                    </button>
                 </div>
              </div>
            </div>
          </section>

          {portalSettings.isOpen ? (
            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-[#002147] hover:bg-red-600 text-white font-black py-6 rounded-2xl uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-4 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify & Process Application"}
            </button>
          ) : (
            <div className="w-full bg-slate-200 text-slate-500 font-black py-6 rounded-2xl uppercase text-center cursor-not-allowed">
              Applications are currently closed
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        .sky-input {
          width: 100%;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 1rem;
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