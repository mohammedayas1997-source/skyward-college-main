import React, { useState, useRef, useEffect } from "react";
import { db } from "../firebase"; 
import { collection, addDoc, serverTimestamp, updateDoc, doc, onSnapshot } from "firebase/firestore";
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
  
  const [portalSettings, setPortalSettings] = useState({ isOpen: true, message: "" });

  const [sittings, setSittings] = useState([{ id: Date.now(), examType: "", examNo: "", centerNo: "", results: {} }]);
  const [formData, setFormData] = useState({
    fullName: "", dob: "", email: "", phone: "", gender: "", 
    stateOrigin: "", lgaOrigin: "", address: "", selectedCourse: ""
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
      reader.onloadend = () => setPassportPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addSitting = () => {
    if (sittings.length < 2) setSittings([...sittings, { id: Date.now(), examType: "", examNo: "", centerNo: "", results: {} }]);
  };

  const removeSitting = (id) => {
    setSittings(sittings.filter(s => s.id !== id));
  };

  const handleResultChange = (sittingId, subject, grade) => {
    setSittings(sittings.map(s => 
      s.id === sittingId ? { ...s, results: { ...s.results, [subject]: grade } } : s
    ));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!portalSettings.isOpen) return alert("Portal is closed");
    if (!passportPreview) return alert("Upload Passport!");
    
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
    pdf.save("Receipt.pdf");
  };

  if (step === "payment") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-slate-200">
          <div className="bg-[#002147] p-10 text-center text-white">
            <CreditCard size={60} className="mx-auto mb-4 text-emerald-400" />
            <h2 className="text-2xl font-black uppercase">Secure Payment</h2>
          </div>
          <div className="p-10 text-center">
            <span className="text-6xl font-black text-[#002147]">₦5,000</span>
            <button onClick={handlePaymentSuccess} className="w-full mt-8 bg-emerald-600 text-white font-black py-5 rounded-2xl uppercase shadow-xl">
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center p-6 italic">
        <div ref={receiptRef} className="w-[180mm] bg-white p-10 shadow-2xl border-[12px] border-[#002147] mb-6">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-[#002147] rounded-full flex items-center justify-center text-white font-black text-2xl">S</div>
               <div>
                 <h1 className="text-xl font-black text-[#002147]">SKYWARD COLLEGE</h1>
                 <p className="text-[10px] text-red-600 font-bold uppercase">Travels & Tourism Academy</p>
               </div>
            </div>
            <QRCodeSVG value={applicationId} size={80} />
          </div>
          <div className="flex gap-8 border-y-2 py-6">
             <img src={passportPreview} className="w-32 h-40 object-cover rounded-lg border" />
             <div className="space-y-2">
                <p className="text-xs font-black uppercase text-slate-400">Student Name</p>
                <p className="text-xl font-black text-[#002147]">{formData.fullName}</p>
                <p className="text-xs font-black uppercase text-slate-400 mt-4">Selected Course</p>
                <p className="text-sm font-bold">{formData.selectedCourse}</p>
             </div>
          </div>
          <p className="text-[10px] text-center mt-6 text-slate-400">Payment ID: {applicationId}</p>
        </div>
        <button onClick={downloadReceipt} className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2">
          <Download size={20}/> DOWNLOAD RECEIPT
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] py-16 px-4 md:px-20 font-sans">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-[40px] overflow-hidden border border-slate-100 text-left">
        
        <div className="bg-[#002147] p-12 text-white flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Admission Form</h1>
            <p className="text-red-500 font-black mt-2 uppercase text-[10px]">Skyward College of Travels & Tourism</p>
          </div>
          <School size={80} className="opacity-20" />
        </div>

        <form onSubmit={handleFormSubmit} className="p-10 md:p-16 space-y-12">
          
          {/* PROFILE SECTION */}
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b pb-4">
              <User className="text-red-600" />
              <h2 className="text-[#002147] text-xl font-black uppercase">Candidate Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center">
                <div className="w-44 h-52 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem] relative flex items-center justify-center overflow-hidden">
                  {passportPreview ? (
                    <img src={passportPreview} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto text-slate-300" />
                      <span className="text-[10px] font-black text-slate-400 uppercase">Passport</span>
                    </div>
                  )}
                  <input required type="file" accept="image/*" onChange={handlePassportUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required name="fullName" onChange={handleChange} placeholder="Full Name" className="sky-input" />
                <input required name="email" type="email" onChange={handleChange} placeholder="Email" className="sky-input" />
                <input required name="phone" type="tel" onChange={handleChange} placeholder="Phone" className="sky-input" />
                <select required name="gender" onChange={handleChange} className="sky-input">
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                <input required name="stateOrigin" onChange={handleChange} placeholder="State" className="sky-input" />
                <input required name="lgaOrigin" onChange={handleChange} placeholder="LGA" className="sky-input" />
              </div>
            </div>
          </section>

          {/* ACADEMIC SECTION */}
          <section className="space-y-8 bg-slate-50 p-8 rounded-[2rem]">
            <div className="flex items-center gap-4 border-b pb-4">
              <BookOpen className="text-blue-600" />
              <h2 className="text-[#002147] text-xl font-black uppercase">Academic Selection</h2>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <select required name="selectedCourse" onChange={handleChange} className="sky-input bg-white">
                <option value="">Choose Course...</option>
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
            </div>

            {/* O-LEVEL RESULTS SECTION (WANDA AKA GOGE) */}
            <div className="space-y-6 mt-8">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-[#002147] text-sm uppercase">O-Level Results</h3>
                <button type="button" onClick={addSitting} className="text-xs bg-[#002147] text-white px-4 py-2 rounded-lg font-black uppercase">+ Add Sitting</button>
              </div>
              
              {sittings.map((sitting, index) => (
                <div key={sitting.id} className="bg-white p-6 rounded-2xl border border-slate-200 relative shadow-sm">
                  {index > 0 && <button onClick={() => removeSitting(sitting.id)} className="absolute top-4 right-4 text-red-500"><Trash2 size={16}/></button>}
                  <p className="text-[10px] font-black text-blue-600 mb-4 uppercase">Sitting #{index + 1}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input placeholder="Exam Type (WAEC/NECO)" onChange={(e) => sitting.examType = e.target.value} className="sky-input text-xs" />
                    <input placeholder="Exam Number" onChange={(e) => sitting.examNo = e.target.value} className="sky-input text-xs" />
                    <input placeholder="Center Number" onChange={(e) => sitting.centerNo = e.target.value} className="sky-input text-xs" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {["English", "Maths", "Physics", "Chemistry", "Biology"].map(sub => (
                      <div key={sub}>
                        <label className="text-[9px] font-black block mb-1 uppercase">{sub}</label>
                        <select onChange={(e) => handleResultChange(sitting.id, sub, e.target.value)} className="w-full p-2 border rounded-lg text-xs font-bold">
                          <option value="">-</option>
                          <option>A1</option><option>B2</option><option>B3</option><option>C4</option><option>C5</option><option>C6</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button disabled={loading} type="submit" className="w-full bg-[#002147] text-white font-black py-6 rounded-3xl uppercase tracking-widest shadow-2xl hover:bg-red-600 transition-all">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Process Application"}
          </button>

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
          outline: none;
        }
        .sky-input:focus { border-color: #002147; background: white; }
      `}</style>
    </div>
  );
};

export default Apply;