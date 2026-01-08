import React, { useState } from "react";
import { Phone, Mail, Lock, Headphones, BookOpen, Menu, X, ChevronDown, Newspaper, ShieldAlert } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="w-full sticky top-0 z-[100] bg-white shadow-md">
      {/* Top Contact Bar */}
      <div className="w-full bg-[#002147] py-2 px-4 md:px-20 text-white text-[9px] md:text-[10px] flex justify-between uppercase font-bold">
        <div className="flex gap-3 md:gap-4">
          <span className="flex items-center gap-1"><Phone size={10} className="text-red-500"/> +234 707 191 3131</span>
          <span className="hidden sm:flex items-center gap-1"><Mail size={10} className="text-red-500"/> info@skyward.edu.ng</span>
        </div>
        <span className="hidden xs:block">Yola, Adamawa State</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full py-3 px-4 md:px-20 border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 md:gap-4">
            <div className="w-10 h-10 md:w-16 md:h-16 shrink-0">
              <img 
                  src="/logo.png" 
                  alt="Skyward Logo" 
                  className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#002147] text-sm md:text-3xl font-black uppercase leading-none">Skyward College</h1>
              <p className="text-[#002147] text-[7px] md:text-[10px] font-bold opacity-80 uppercase italic">of Travels & Tourism, Yola</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex gap-6 text-[10px] font-black text-[#002147] uppercase items-center">
              <li><Link to="/" className="hover:text-red-600">Home</Link></li>
              
              <li>
                <Link to="/news" className="hover:text-red-600 flex items-center gap-1">
                  <Newspaper size={15} /> Latest News
                </Link>
              </li>

              <li className="relative group hover:text-red-600 cursor-pointer py-2">
                <span className="flex items-center gap-1">About Us <ChevronDown size={15}/></span>
                <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-2xl border-t-4 border-red-600 w-72 z-[100] py-2">
                  {[{ name: "The Rector", path: "/about/rector" }, { name: "The Registrar", path: "/about/registrar" }, { name: "Academic Planning", path: "/about/dir-planning" }].map((item) => (
                    <li key={item.path} className="px-4 py-2 hover:bg-slate-100 border-b border-slate-50 text-slate-700 font-bold">
                      <Link to={item.path} className="block w-full">{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Portal Dropdown - AN GYARA NAN DON SUYI AIKI DA APP.JS */}
              <li className="relative group hover:text-red-600 cursor-pointer py-2">
                <span className="flex items-center gap-1">Portal <ChevronDown size={15}/></span>
                <ul className="absolute right-0 top-full hidden group-hover:block bg-white shadow-2xl border-t-4 border-red-600 w-64 z-[100] py-2 text-slate-700">
                  <li className="px-4 py-2 hover:bg-slate-100 border-b border-slate-50 flex items-center gap-2 font-bold uppercase text-[9px]">
                    <Lock size={15} className="text-blue-600" />
                    {/* Canzawa daga /portal/student-login zuwa /portal/login domin UnifiedLogin */}
                    <Link to="/portal/login" className="block w-full">Student Portal</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-slate-100 border-b border-slate-50 flex items-center gap-2 font-bold uppercase text-[9px]">
                    <Lock size={15} className="text-green-600" />
                    {/* Canzawa daga /portal/staff-login zuwa /portal/login */}
                    <Link to="/portal/login" className="block w-full">Staff/Lecturer Portal</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-red-50 flex items-center gap-2 font-bold uppercase text-[9px] text-red-600">
                    <ShieldAlert size={15} />
                    <Link to="/portal/login" className="block w-full">Admin Access (Proprietor/Rector)</Link>
                  </li>
                </ul>
              </li>

              <li><Link to="/e-library" className="hover:text-red-600 flex items-center gap-1"><BookOpen size={12} className="text-red-600" /> E-Library</Link></li>
              <li><Link to="/help-desk" className="hover:text-red-600 flex items-center gap-1"><Headphones size={12} className="text-red-600" /> Help Desk</Link></li>
              
              <li>
                <button 
                  onClick={() => navigate("/portal/login")}
                  className="bg-red-600 text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-[#002147] transition-all shadow-md active:scale-95"
                >
                  <Lock size={12}/> <span>Portal</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-[#002147] hover:bg-slate-100 rounded-lg transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <div className={`lg:hidden fixed inset-0 z-[110] bg-[#002147] transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 flex flex-col h-full text-white">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black uppercase tracking-tighter">Skyward Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-red-600 rounded-full"><X size={24}/></button>
          </div>

          <nav className="flex-grow">
            <ul className="space-y-6 text-sm font-black uppercase tracking-widest">
              <li><Link onClick={() => setIsMenuOpen(false)} to="/" className="block py-2 border-b border-white/10">Home</Link></li>
              <li><Link onClick={() => setIsMenuOpen(false)} to="/news" className="flex items-center gap-2 py-2 border-b border-white/10 text-red-400"><Newspaper size={18} /> Latest News</Link></li>
              <li><Link onClick={() => setIsMenuOpen(false)} to="/admission" className="block py-2 border-b border-white/10 text-slate-300">Admissions</Link></li>
              
              {/* MOBILE LOGIN OPTIONS - GYARARRE */}
              <li><Link onClick={() => setIsMenuOpen(false)} to="/portal/login" className="block py-2 border-b border-white/10 flex items-center gap-2"><Lock size={16}/> Student Portal</Link></li>
              <li><Link onClick={() => setIsMenuOpen(false)} to="/portal/login" className="block py-2 border-b border-white/10 flex items-center gap-2 text-green-400"><Lock size={16}/> Staff Portal</Link></li>
              <li><Link onClick={() => setIsMenuOpen(false)} to="/portal/login" className="block py-2 border-b border-white/10 flex items-center gap-2 text-red-400"><ShieldAlert size={16}/> Admin/Rector</Link></li>
              
              <li><Link onClick={() => setIsMenuOpen(false)} to="/e-library" className="block py-2 border-b border-white/10">E-Library</Link></li>
              <li><Link onClick={() => setIsMenuOpen(false)} to="/help-desk" className="block py-2 border-b border-white/10">Support Desk</Link></li>
              <li><Link onClick={() => setIsMenuOpen(false)} to="/contact" className="block py-2 border-b border-white/10">Contact Us</Link></li>
            </ul>
          </nav>
          
          <div className="mt-auto pt-6 border-t border-white/10 text-[10px] text-slate-400 text-center uppercase tracking-widest">
            Skyward College of Travels And Tourism © 2026
          </div>
        </div>
      </div>
    </header>
  );
};