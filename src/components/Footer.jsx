import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="bg-[#002147] text-white pt-20 pb-10 px-6 md:px-20 border-t-8 border-red-600">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      {/* Brand Section */}
      <div className="md:col-span-1">
        <img src="/logo.png" alt="Logo" className="w-20 mb-6 bg-white p-2 rounded-full" />
        <h3 className="text-xl font-black uppercase mb-4">Skyward College</h3>
        <p className="text-slate-400 text-sm leading-loose">
          Providing world-class vocational training in Aviation, Travels, and Tourism to empower future professionals.
        </p>
      </div>

      {/* Navigation */}
      <div>
        <h4 className="text-red-500 font-black uppercase mb-6 text-sm">Quick Links</h4>
        <ul className="space-y-4 text-slate-300 text-sm">
          <li><Link to="/" className="hover:text-white transition-all">Home</Link></li>
          <li><Link to="/about/rector" className="hover:text-white transition-all">About the Rector</Link></li>
          <li><Link to="/admission" className="hover:text-white transition-all">How to Apply</Link></li>
          <li><Link to="/portal/student-login" className="hover:text-white transition-all">Student Portal</Link></li>
        </ul>
      </div>

      {/* Contact Details */}
      <div>
        <h4 className="text-red-500 font-black uppercase mb-6 text-sm">Contact Info</h4>
        <div className="space-y-4 text-slate-300 text-sm">
          <p>Jimeta, Yola Road, Adamawa State.</p>
          <p>Phone: +234 707 191 3131</p>
          <p>Email: info@skyward.edu.ng</p>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div>
        <h4 className="text-red-500 font-black uppercase mb-6 text-sm">Newsletter</h4>
        <p className="text-slate-400 text-xs mb-4">Subscribe to get latest updates.</p>
        <div className="flex">
          <input 
            type="email" 
            placeholder="Email" 
            className="bg-white/10 p-3 rounded-l-md outline-none w-full border border-white/10 text-sm" 
          />
          <button className="bg-red-600 px-4 rounded-r-md font-bold text-xs uppercase">Join</button>
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div className="mt-20 pt-8 border-t border-white/10 text-center text-slate-500 text-xs uppercase tracking-[0.2em]">
      &copy; {new Date().getFullYear()} Skyward College of Travels & Tourism. All Rights Reserved.
    </div>
  </footer>
);