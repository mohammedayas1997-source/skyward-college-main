import React, { useState } from "react";
import { Phone, Mail, Lock, Headphones, BookOpen, Menu, X, ChevronDown, Newspaper, ShieldAlert, ExternalLink, Globe } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false); // Sabon state na E-Library
  const navigate = useNavigate();

  // Links na E-Library guda 10
  const libraryLinks = [
    { name: "National Library of Nigeria", url: "https://web.nln.gov.ng/", cat: "Nigeria" },
    { name: "IATA Publications", url: "https://www.iata.org/en/publications/", cat: "Aviation" },
    { name: "UN Tourism Library", url: "https://www.e-unwto.org/", cat: "Tourism" },
    { name: "ICAO E-Library", url: "https://elibrary.icao.int/", cat: "Aviation" },
    { name: "Nigeria Civil Aviation Authority", url: "https://ncaa.gov.ng/", cat: "Nigeria" },
    { name: "TETFund E-Library", url: "https://ntel.tetfund.gov.ng/", cat: "Nigeria" },
    { name: "Hospitality Net", url: "https://www.hospitalitynet.org/", cat: "Hospitality" },
    { name: "Aviation PDF Books", url: "https://www.pdfdrive.com/aviation-books.html", cat: "General" },
    { name: "World Travel & Tourism Council", url: "https://wttc.org/research/economic-impact", cat: "Tourism" },
    { name: "Open Textbook Library", url: "https://open.umn.edu/opentextbooks/", cat: "General" }
  ];

  return (
    <header className="w-full sticky top-0 z-[100] bg-white shadow-md">
      {/* Top Contact Bar - Icons are now active */}
      <div className="w-full bg-[#002147] py-2 px-4 md:px-20 text-white text-[9px] md:text-[10px] flex justify-between uppercase font-bold">
        <div className="flex gap-3 md:gap-4">
          <a href="tel:+2347071913131" className="flex items-center gap-1 hover:text-red-400 transition-colors">
            <Phone size={10} className="text-red-500"/> +234 707 191 3131
          </a>
          <a href="mailto:info@skyward.edu.ng" className="hidden sm:flex items-center gap-1 hover:text-red-400 transition-colors">
            <Mail size={10} className="text-red-500"/> info@skyward.edu.ng
          </a>
        </div>
        <span className="hidden xs:block flex items-center gap-1"><Globe size={10} className="text-red-500"/> Yola, Adamawa State</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full py-3 px-4 md:px-20 border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-2 md:gap-4">
            <div className="w-10 h-10 md:w-16 md:h-16 shrink-0">
              <img src="/logo.png" alt="Skyward Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#002147] text-sm md:text-3xl font-black uppercase leading-none">Skyward College</h1>
              <p className="text-[#002147] text-[7px] md:text-[10px] font-bold opacity-80 uppercase italic">of Travels & Tourism, Yola</p>
            </div>
          </Link>
          
          <nav className="hidden lg:block">
            <ul className="flex gap-6 text-[10px] font-black text-[#002147] uppercase items-center">
              <li><Link to="/" className="hover:text-red-600">Home</Link></li>
              <li><Link to="/news" className="hover:text-red-600 flex items-center gap-1"><Newspaper size={15} /> Latest News</Link></li>

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

              {/* Portal Dropdown */}
              <li className="relative group hover:text-red-600 cursor-pointer py-2">
                <span className="flex items-center gap-1">Portal <ChevronDown size={15}/></span>
                <ul className="absolute right-0 top-full hidden group-hover:block bg-white shadow-2xl border-t-4 border-red-600 w-64 z-[100] py-2 text-slate-700 font-bold uppercase text-[9px]">
                  <li className="px-4 py-2 hover:bg-slate-100 border-b border-slate-50 flex items-center gap-2">
                    <Lock size={15} className="text-blue-600" /> <Link to="/portal/login" className="block w-full">Student Portal</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-slate-100 border-b border-slate-50 flex items-center gap-2">
                    <Lock size={15} className="text-green-600" /> <Link to="/portal/login" className="block w-full">Staff/Lecturer Portal</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600">
                    <ShieldAlert size={15} /> <Link to="/portal/login" className="block w-full">Admin Access</Link>
                  </li>
                </ul>
              </li>

              {/* E-Library Button - Now opens a modal */}
              <li>
                <button 
                  onClick={() => setIsLibraryModalOpen(true)} 
                  className="hover:text-red-600 flex items-center gap-1 uppercase"
                >
                  <BookOpen size={12} className="text-red-600" /> E-Library
                </button>
              </li>
              
              <li><Link to="/help-desk" className="hover:text-red-600 flex items-center gap-1"><Headphones size={12} className="text-red-600" /> Help Desk</Link></li>
              
              <li>
                <button onClick={() => navigate("/portal/login")} className="bg-red-600 text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-[#002147] transition-all shadow-md active:scale-95">
                  <Lock size={12}/> <span>Portal</span>
                </button>
              </li>
            </ul>
          </nav>

          <button className="lg:hidden p-2 text-[#002147]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* E-Library Modal Section */}
      {isLibraryModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#002147]/95 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-3xl p-6 md:p-10 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsLibraryModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-600 hover:text-white transition-all">
              <X size={24} />
            </button>
            <div className="mb-8">
              <h2 className="text-[#002147] text-2xl font-black uppercase tracking-tighter">Skyward Digital Library</h2>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Access global research and academic materials</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {libraryLinks.map((lib, i) => (
                <a key={i} href={lib.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-red-50 border border-slate-100 group transition-all">
                  <div>
                    <p className="text-[8px] font-black text-red-600 uppercase mb-1">{lib.cat}</p>
                    <p className="text-[#002147] font-bold text-sm">{lib.name}</p>
                  </div>
                  <ExternalLink size={18} className="text-slate-300 group-hover:text-red-600" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-[110] bg-[#002147] transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 flex flex-col h-full text-white">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-black uppercase tracking-tighter">Skyward Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-red-600 rounded-full"><X size={24}/></button>
          </div>
          <nav className="flex-grow space-y-6 text-sm font-black uppercase tracking-widest">
            <Link onClick={() => setIsMenuOpen(false)} to="/" className="block py-2 border-b border-white/10">Home</Link>
            <Link onClick={() => {setIsMenuOpen(false); setIsLibraryModalOpen(true);}} className="block py-2 border-b border-white/10 flex items-center gap-2 text-red-400"><BookOpen size={18} /> E-Library</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/portal/login" className="block py-2 border-b border-white/10 flex items-center gap-2"><Lock size={16}/> Student Portal</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/help-desk" className="block py-2 border-b border-white/10">Support Desk</Link>
            <Link onClick={() => setIsMenuOpen(false)} to="/contact" className="block py-2 border-b border-white/10">Contact Us</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};