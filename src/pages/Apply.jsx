import React, { useState } from "react";
import { Upload, Save, School, BookOpen, User, GraduationCap, CreditCard, Printer, CheckCircle, PlusCircle, Trash2, MapPin, Calendar, Home } from "lucide-react";

export const Apply = () => {
  // Matakan shafuka
  const [step, setStep] = useState("form");
  
  // Tsarin sittings na O-Level (Muna fara da sitting guda 1)
  const [sittings, setSittings] = useState([{ id: Date.now() }]);

  const addSitting = () => {
    if (sittings.length < 2) {
      setSittings([...sittings, { id: Date.now() }]);
    }
  };

  const removeSitting = (id) => {
    setSittings(sittings.filter(s => s.id !== id));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSuccess = () => {
    setStep("success");
  };

  // --- SHAFIN BIYAN KUDI ---
  if (step === "payment") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-[#002147] p-8 text-center text-white">
            <CreditCard size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-black uppercase">Application Fee</h2>
            <p className="text-slate-300 text-[10px] mt-2 uppercase tracking-widest">Skyward College Admission 2026</p>
          </div>
          <div className="p-8 text-center">
            <div className="mb-8">
              <span className="text-5xl font-black text-[#002147]">₦5,000</span>
              <p className="text-slate-500 text-sm font-bold mt-2 uppercase">Application Form Fee</p>
            </div>
            <button onClick={handlePaymentSuccess} className="w-full bg-red-600 text-white font-black py-4 rounded-xl uppercase tracking-widest hover:bg-[#002147] transition-all shadow-lg">
              Pay Now (N5,000)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- SHAFIN RECEIPT ---
  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-2xl w-full bg-white p-12 rounded-3xl shadow-2xl border-t-8 border-green-500">
          <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-[#002147] uppercase">Success!</h1>
          <p className="text-slate-500 mb-8 font-bold uppercase">Official Payment Receipt Generated</p>
          <div className="bg-slate-50 p-6 rounded-2xl border mb-8 text-left space-y-2">
             <p className="text-xs"><strong>Ref:</strong> SKY-ADM-2026-99012</p>
             <p className="text-xs"><strong>Amount:</strong> ₦5,000.00</p>
             <p className="text-xs text-green-600 font-bold">STATUS: PAID</p>
          </div>
          <button onClick={() => window.print()} className="bg-[#002147] text-white px-8 py-4 rounded-xl font-black uppercase text-xs flex items-center gap-2 mx-auto">
            <Printer size={18}/> Print Receipt
          </button>
        </div>
      </div>
    );
  }

  // --- SHAFIN FORM ---
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-20">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
        
        <div className="bg-[#002147] p-10 text-white">
          <h1 className="text-3xl font-black uppercase">Admission Application Form</h1>
          <p className="text-red-500 font-bold mt-2 uppercase text-xs tracking-widest">Skyward College of Travels & Tourism</p>
        </div>

        <form onSubmit={handleFormSubmit} className="p-8 md:p-12 space-y-12">
          
          {/* 1. PERSONAL INFO (Updated with DOB, State, LGA, Residence) */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b pb-2">
              <User className="text-red-600" />
              <h2 className="text-[#002147] font-black uppercase">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="w-40 h-48 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center relative group">
                  <Upload className="text-slate-400" />
                  <span className="text-[10px] uppercase font-bold text-slate-400 mt-2">Passport</span>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Full Name (Surname First)" className="form-input-sky" />
                <div className="relative">
                  <Calendar className="absolute right-3 top-3.5 text-slate-400" size={16} />
                  <input required type="text" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} placeholder="Date of Birth" className="form-input-sky w-full" />
                </div>
                <input required type="email" placeholder="Email Address" className="form-input-sky" />
                <input required type="tel" placeholder="Phone Number" className="form-input-sky" />
                <select required className="form-input-sky text-slate-500">
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                
                {/* State & LGA of Origin */}
                <input required type="text" placeholder="State of Origin" className="form-input-sky" />
                <input required type="text" placeholder="LGA of Origin" className="form-input-sky" />

                {/* Current Residence Details */}
                <input required type="text" placeholder="Current State of Residence" className="form-input-sky" />
                <input required type="text" placeholder="Current LGA of Residence" className="form-input-sky" />
                
                <div className="md:col-span-2 relative">
                  <Home className="absolute right-3 top-4 text-slate-400" size={16} />
                  <textarea required placeholder="Full Residential Address" className="form-input-sky h-20 pt-3 resize-none w-full"></textarea>
                </div>
              </div>
            </div>
          </section>

          {/* 2. EDUCATION HISTORY */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b pb-2">
              <School className="text-red-600" />
              <h2 className="text-[#002147] font-black uppercase">Previous Education</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase">Primary School</h4>
                <input required type="text" placeholder="School Name" className="form-input-sky" />
                <input required type="text" placeholder="Year" className="form-input-sky" />
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase">Secondary School</h4>
                <input required type="text" placeholder="School Name" className="form-input-sky" />
                <input required type="text" placeholder="Year" className="form-input-sky" />
              </div>
            </div>
          </section>

          {/* 3. O-LEVEL RESULTS (SITTINGS) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-3">
                <BookOpen className="text-red-600" />
                <h2 className="text-[#002147] font-black uppercase">O-Level Results</h2>
              </div>
              {sittings.length < 2 && (
                <button type="button" onClick={addSitting} className="flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase shadow-md">
                  <PlusCircle size={14} /> Add Sitting
                </button>
              )}
            </div>

            {sittings.map((sitting, index) => (
              <div key={sitting.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative animate-in slide-in-from-top duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-black text-red-600 uppercase italic">Sitting #{index + 1}</h4>
                  {index > 0 && <button onClick={() => removeSitting(sitting.id)} className="text-slate-400 hover:text-red-600 transition-all"><Trash2 size={16} /></button>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <select required className="form-input-sky bg-white"><option value="">Exam Type</option><option>WAEC</option><option>NECO</option><option>NABTEB</option></select>
                  <input required type="text" placeholder="Exam Number" className="form-input-sky bg-white" />
                  <input required type="text" placeholder="Center Number" className="form-input-sky bg-white" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="flex gap-1">
                      <input type="text" placeholder={`Subject ${i+1}`} className="w-2/3 form-input-sky bg-white text-[10px]" />
                      <input type="text" placeholder="G" className="w-1/3 form-input-sky bg-white text-[10px] text-center" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* 4. JAMB & COURSE */}
          <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[10px] font-black text-[#002147] uppercase mb-4">JAMB (Optional)</h4>
                <input type="text" placeholder="JAMB Reg No" className="form-input-sky bg-white mb-4" />
                <input type="text" placeholder="JAMB Score" className="form-input-sky bg-white" />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-red-600 uppercase mb-4">Course Selection</h4>
                <select required className="form-input-sky bg-white border-2 border-red-600 font-bold">
                  <option value="">Choose a Course...</option>
                  <option>Air Cabin Crew Management</option>
                  <option>Flight Dispatcher </option>
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
          </section>

          <button type="submit" className="w-full bg-[#002147] hover:bg-red-600 text-white font-black py-5 rounded-xl uppercase tracking-[0.2em] transition-all shadow-xl">
            Proceed to Payment (₦5,000)
          </button>
        </form>
      </div>
    </div>
  );
};

export default Apply;