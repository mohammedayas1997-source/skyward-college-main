import React, { useState } from "react";
import { db } from "./firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { X, Send, User, Mail, Phone } from "lucide-react";

const AdmissionForm = ({ selectedCourse, onClose }) => {
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "applications"), {
        ...formData,
        course: selectedCourse.title,
        status: "pending",
        appliedAt: serverTimestamp(),
      });
      alert("Application successfully submitted!");
      onClose();
    } catch (error) {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-red-600">
          <X size={24} />
        </button>
        <h3 className="text-2xl font-black text-[#002147] uppercase italic mb-6">Student Admission</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-400" size={18} />
            <input required type="text" placeholder="Full Name" className="w-full bg-slate-50 border-none p-4 pl-12 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-600"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
            <input required type="email" placeholder="Email" className="w-full bg-slate-50 border-none p-4 pl-12 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-600"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="relative">
            <Phone className="absolute left-4 top-4 text-slate-400" size={18} />
            <input required type="tel" placeholder="Phone Number" className="w-full bg-slate-50 border-none p-4 pl-12 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-600"
              onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          
          <button disabled={isSubmitting} className="w-full bg-red-600 text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest hover:bg-[#002147] transition-all flex items-center justify-center gap-2">
            {isSubmitting ? "Sending..." : <><Send size={16} /> Submit Now</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;