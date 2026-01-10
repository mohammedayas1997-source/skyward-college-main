import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Gallery from "../components/Gallery";
import { Plane, Users, Globe, Headphones, Briefcase, Layout, Ship, FileText, Building2, Hotel, X, CheckCircle, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Menu, BookOpen, ExternalLink, Home as HomeIcon, Image as GalleryIcon } from "lucide-react";

export const Home = () => {
  const [current, setCurrent] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false); 
  const navigate = useNavigate();

  const slides = [
    "/hero1.jpg", "/hero2.jpg", "/hero3.jpg", "/hero4.jpg", 
    "/hero5.jpg", "/hero6.jpg", "/hero7.jpg", "/hero8.jpg","/hero9.jpg", "/hero10.jpg"
  ];

  const eLibraryLinks = [
    { name: "National Library of Nigeria", url: "https://web.nln.gov.ng/", category: "Nigeria" },
    { name: "TETFund E-Library", url: "https://ntel.tetfund.gov.ng/", category: "Nigeria" },
    { name: "Nigeria Civil Aviation Authority", url: "https://ncaa.gov.ng/", category: "Nigeria" },
    { name: "IATA Publications", url: "https://www.iata.org/en/publications/", category: "Aviation" },
    { name: "UN Tourism Library", url: "https://www.e-unwto.org/", category: "Tourism" },
    { name: "ICAO E-Library", url: "https://elibrary.icao.int/", category: "Aviation" },
    { name: "Hospitality Net", url: "https://www.hospitalitynet.org/", category: "Hospitality" },
    { name: "Aviation PDF Books", url: "https://www.pdfdrive.com/aviation-books.html", category: "General" },
    { name: "World Travel & Tourism Council", url: "https://wttc.org/research/economic-impact", category: "Tourism" },
    { name: "Open Textbook Library", url: "https://open.umn.edu/opentextbooks/", category: "General" }
  ];

  const featuredCourses = [
    { id: 1, title: "Air Ticketing & Reservation", fee: "₦80,000", icon: <Plane size={24} />, desc: "The heartbeat of the aviation industry.", img: "/1767965179277.jpg", outcomes: ["Amadeus & Sabre", "Fare Construction"], fullDesc: "Mastering international booking systems.", careers: ["Ticketing Officer"] },
    { id: 2, title: "Customer Service Management", fee: "₦80,000", icon: <Users size={24} />, desc: "Master the art of elite communication.", img: "/1767965255899.jpg", outcomes: ["Emotional Intelligence", "Professional Etiquette"], fullDesc: "Excellence in luxury service.", careers: ["Guest Relations"] },
    { id: 4, title: "Cabin Crew & In-Flight Services", fee: "₦400,000", icon: <Headphones size={24} />, desc: "Train for safety and elegance at 35,000 feet.", img: "/1767965537113.jpg", outcomes: ["Safety Procedures", "Aviation Medicine"], fullDesc: "Prepare for the prestigious role of a flight attendant.", careers: ["Flight Attendant"] },
    { id: 5, title: "Flight Dispatcher Course", fee: "₦300,000", icon: <Briefcase size={24} />, desc: "The brain behind every flight.", img: "/1767965629751.jpg", outcomes: ["Flight Planning", "Meteorology"], fullDesc: "Captains on the ground.", careers: ["Flight Dispatcher"] },
    { id: 10, title: "Hotel & Hospitality Management", fee: "₦80,000", icon: <Hotel size={24} />, desc: "Master world-class hospitality.", img: "/1767966074821.jpg", outcomes: ["Front Office", "Event Planning"], fullDesc: "Leadership in luxury hotels.", careers: ["Hotel Manager"] }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="w-full min-h-screen bg-white text-[#002147]">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 w-full z-[100] bg-white border-b border-slate-100 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-3 relative z-[110]">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
              <div className="flex flex-col">
                 <span className="text-[#002147] font-black text-lg md:text-xl leading-none">SKYWARD</span>
                 <span className="text-red-600 font-bold text-[8px] md:text-[10px] uppercase tracking-wider text-nowrap">College of Travels & Tourism</span>
              </div>
          </Link>
          
          {/* Desktop Nav - I have ensured these are real clickable Links/Buttons */}
          <nav className="hidden lg:flex gap-6 text-[#002147] font-black text-[10px] uppercase tracking-widest items-center">
              <Link to="/" className="flex items-center gap-1 hover:text-red-600 transition-all"><HomeIcon size={14}/> Home</Link>
              <Link to="/courses" className="flex items-center gap-1 hover:text-red-600 transition-all"><Plane size={14}/> Courses</Link>
              
              <button 
                onClick={(e) => { e.preventDefault(); setIsLibraryOpen(true); }}
                className="flex items-center gap-1 hover:text-red-600 transition-all uppercase cursor-pointer"
              >
                <BookOpen size={14} /> E-Library
              </button>

              <Link to="/gallery" className="flex items-center gap-1 hover:text-red-600 transition-all"><GalleryIcon size={14}/> Gallery</Link>
              <Link to="/contact" className="flex items-center gap-1 hover:text-red-600 transition-all"><Headphones size={14}/> Contact</Link>
              
              <div className="flex flex-col border-l border-slate-200 pl-4 gap-1">
                <a href="mailto:info@skywardcollege.com" className="flex items-center gap-2 text-[9px] lowercase hover:text-red-600"><Mail size={12} className="text-red-600"/> info@skywardcollege.com</a>
                <a href="tel:+2347071913131" className="flex items-center gap-2 text-[9px] hover:text-red-600"><Phone size={12} className="text-red-600"/> +234 7071913131</a>
              </div>

              <Link to="/admission/apply" className="bg-red-600 text-white px-5 py-2.5 rounded-full hover:bg-[#002147] transition-all shadow-md">Apply Now</Link>
              <Link to="/portal/login" className="hover:text-red-600 transition-colors">Portal</Link>
          </nav>

          {/* Mobile Buttons */}
          <div className="lg:hidden flex items-center gap-4 relative z-[110]">
            <Link to="/portal/login" className="p-2 text-[#002147]"><Users size={22} /></Link>
            <button onClick={() => setIsLibraryOpen(true)} className="p-2 text-[#002147]"><BookOpen size={22} /></button>
          </div>
        </div>
      </header>

      {/* --- E-LIBRARY MODAL --- */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#002147]/95 backdrop-blur-md" onClick={() => setIsLibraryOpen(false)}></div>
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] p-8 md:p-12 relative shadow-2xl overflow-y-auto max-h-[90vh] z-[2001]">
            <button onClick={() => setIsLibraryOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-600 hover:text-white transition-all">
              <X size={24} />
            </button>
            <div className="mb-8 text-left">
              <h2 className="text-[#002147] text-2xl font-black uppercase tracking-tighter">Skyward Digital Library</h2>
              <p className="text-red-600 font-bold text-[10px] uppercase tracking-widest">Select a portal to access resources</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eLibraryLinks.map((lib, i) => (
                <a key={i} href={lib.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-red-50 border border-slate-100 transition-all group">
                  <div className="text-left">
                    <p className="text-[9px] font-black text-red-600 uppercase mb-1">{lib.category}</p>
                    <p className="text-[#002147] font-bold text-base">{lib.name}</p>
                  </div>
                  <ExternalLink size={18} className="text-slate-300 group-hover:text-red-600" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-slate-900">
        {slides.map((img, index) => (
          <img key={index} src={img} alt="Hero" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === current ? "opacity-60" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-6 md:px-20 bg-gradient-to-r from-[#002147]/80 to-transparent">
          <div className="max-w-2xl relative z-10"> 
            <h2 className="text-white text-xs font-bold uppercase tracking-[0.4em] mb-4">Welcome to</h2>
            <h1 className="text-white text-3xl md:text-5xl font-black uppercase leading-tight mb-6">Skyward College of Travels <br /><span className="text-red-600">& Tourism</span></h1>
            <p className="text-slate-200 text-sm md:text-lg font-medium mb-8">Launch your global career at the airport, airline, or luxury hotels.</p>
            <div className="flex gap-4">
              <Link to="/admission/apply" className="bg-red-600 text-white px-8 py-3.5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-red-700 transition-all">Apply Now</Link>
              <Link to="/portal/login" className="bg-white/10 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-black uppercase text-xs border border-white/20 hover:bg-white/20 transition-all">Portal</Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- COURSES SECTION --- */}
      <div className="w-full py-16 px-6 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-6 w-1.5 bg-red-600 rounded-full"></div>
            <h3 className="text-xl font-black uppercase">Professional Courses</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {featuredCourses.map((course, idx) => (
              <div key={idx} onClick={() => setSelectedCourse(course)} className="bg-white rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden cursor-pointer hover:-translate-y-2 transition-all group">
                <div className="h-32 bg-slate-200 relative overflow-hidden">
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5 flex flex-col items-center text-center">
                  <div className="text-red-600 mb-3 bg-red-50 p-2.5 rounded-xl">{course.icon}</div>
                  <h4 className="font-black uppercase text-[10px] mb-2 leading-tight">{course.title}</h4>
                  <p className="text-slate-500 text-[9px] font-bold mb-4 line-clamp-2">{course.desc}</p>
                  <div className="text-red-600 font-black text-xs">{course.fee}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-[#002147] text-white py-16 px-6 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
           <div className="space-y-4">
              <img src="/logo.png" alt="Logo" className="h-12 bg-white p-1 rounded-lg" />
              <p className="text-slate-400 text-xs leading-relaxed italic">Training global leaders for the travel and tourism industry.</p>
           </div>
           <div>
              <h5 className="font-black uppercase text-xs mb-6 text-red-600">Quick Links</h5>
              <ul className="space-y-3 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <li><Link to="/courses" className="hover:text-red-600">All Courses</Link></li>
                <li><Link to="/admission/apply" className="hover:text-red-600">Apply</Link></li>
                <li><button onClick={() => setIsLibraryOpen(true)} className="hover:text-red-600 uppercase">E-Library</button></li>
              </ul>
           </div>
           <div>
              <h5 className="font-black uppercase text-xs mb-6 text-red-600">Connect With Us</h5>
              <div className="flex gap-4">
                 <Facebook size={18} className="text-slate-400 hover:text-red-600 cursor-pointer" />
                 <Instagram size={18} className="text-slate-400 hover:text-red-600 cursor-pointer" />
                 <Twitter size={18} className="text-slate-400 hover:text-red-600 cursor-pointer" />
              </div>
           </div>
        </div>
      </footer>

    </section>
  );
};