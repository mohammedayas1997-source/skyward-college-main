import React from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="w-full bg-[#002147] py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-black uppercase">Contact Us</h1>
        <p className="text-red-500 font-bold mt-4 uppercase tracking-widest text-sm">Get in touch with Skyward College</p>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Hagu: Bayanan Sadarwa */}
        <div className="space-y-12">
          <div>
            <h2 className="text-[#002147] text-3xl font-black uppercase mb-6">Reach Out to Us</h2>
            <p className="text-slate-600 leading-loose text-lg">
              Have questions about our aviation and tourism programs? Our team is here to help you navigate your career path.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-5">
              <div className="bg-red-600 p-3 rounded-lg text-white shadow-lg"><MapPin size={24} /></div>
              <div>
                <h4 className="font-black text-[#002147] uppercase">Campus Address</h4>
                <p className="text-slate-600">Yola-Jimeta, Adamawa State, Nigeria.</p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <div className="bg-red-600 p-3 rounded-lg text-white shadow-lg"><Phone size={24} /></div>
              <div>
                <h4 className="font-black text-[#002147] uppercase">Phone Number</h4>
                <p className="text-slate-600">+234 707 191 3131</p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <div className="bg-red-600 p-3 rounded-lg text-white shadow-lg"><Mail size={24} /></div>
              <div>
                <h4 className="font-black text-[#002147] uppercase">Email Address</h4>
                <p className="text-slate-600">info@skyward.edu.ng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dama: Contact Form */}
        <div className="bg-slate-50 p-8 md:p-12 rounded-2xl shadow-inner border border-slate-100">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Your Name" className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none" />
              <input type="email" placeholder="Your Email" className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none" />
            </div>
            <input type="text" placeholder="Subject" className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none" />
            <textarea placeholder="Your Message" rows="5" className="w-full p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-red-600 outline-none"></textarea>
            <button className="w-full bg-[#002147] text-white font-black py-4 rounded-lg uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-3">
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;