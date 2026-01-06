import React from "react";
import { PhoneCall, Mail, MapPin, MessageCircle, ShieldQuestion, ExternalLink } from "lucide-react";

const ContactHelpDesk = () => {
  const faqData = [
    { q: "What should I do if my payment fails?", a: "Ensure you have a stable internet connection. If debited without a receipt, please wait 24 hours or contact our accounts desk with your transaction ID." },
    { q: "Can I edit my form after submission?", a: "No. Once a form is submitted, it cannot be edited. Please review all details carefully before clicking the submit button." },
    { q: "I haven't received my SMS notification?", a: "Check if your phone number is on DND (Do Not Disturb) mode. You can always check your admission status by logging into your dashboard." }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#002147] py-20 px-6 text-center text-white">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Help Desk & Support</h1>
        <p className="text-slate-300 max-w-2xl mx-auto font-medium">Our admission officers are ready to assist you.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
          <PhoneCall className="mx-auto mb-4 text-red-600" />
          <h3 className="font-bold text-[#002147]">CALL US</h3>
          <p className="text-slate-500 text-sm">+234 800 SKYWARD</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
          <Mail className="mx-auto mb-4 text-red-600" />
          <h3 className="font-bold text-[#002147]">EMAIL US</h3>
          <p className="text-slate-500 text-sm">admissions@skyward.edu.ng</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
          <MapPin className="mx-auto mb-4 text-red-600" />
          <h3 className="font-bold text-[#002147]">OFFICE</h3>
          <p className="text-slate-500 text-sm">Main Campus, Admission Block</p>
        </div>
      </div>
    </div>
  );
};

export default ContactHelpDesk;