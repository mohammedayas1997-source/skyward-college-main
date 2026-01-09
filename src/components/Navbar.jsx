import React from "react";
import { Phone, Mail, Search } from "lucide-react";

export const Navbar = ({ activeTab, setActiveTab }) => (
  <nav className="w-full bg-[#002147] text-white sticky top-0 z-50 shadow-lg">
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
      {/* 1. Empty space for balance on large screens */}
      <div className="hidden lg:block flex-1"></div>

      {/* 2. Main Menu - Na kara GALLERY a nan */}
      <ul className="flex flex-[3] justify-center items-center gap-6 md:gap-8 text-[10px] font-bold uppercase tracking-[0.2em]">
        {["HOME", "ADMISSION", "COURSES", "GALLERY", "E-LIBRARY", "CONTACT"].map((tab) => (
          <li 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer transition-all hover:text-[#d4af37] relative pb-1 whitespace-nowrap ${
              activeTab === tab ? 'text-[#d4af37] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#d4af37]' : ''
            }`}
          >
            {tab}
          </li>
        ))}
      </ul>

      {/* 3. Quick Contact Icons */}
      <div className="flex flex-1 justify-end gap-6 text-slate-300">
        <Phone size={15} className="hover:text-[#d4af37] cursor-pointer transition-colors" />
        <Mail size={15} className="hover:text-[#d4af37] cursor-pointer transition-colors" />
      </div>
    </div>
  </nav>
);