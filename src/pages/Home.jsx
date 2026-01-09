import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Gallery from "../components/Gallery";
import { Plane, Users, Globe, Headphones, Briefcase, Layout, Ship, FileText, Building2, Hotel, X, CheckCircle, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Menu, BookOpen } from "lucide-react";

export const Home = () => {
  const [current, setCurrent] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const slides = [
    "/hero1.jpg", "/hero2.jpg", "/hero3.jpg", "/hero4.jpg", 
    "/hero5.jpg", "/hero6.jpg", "/hero7.jpg", "/hero8.jpg","/hero9.jpg", "/hero10.jpg"
  ];

  // Links na E-Library don dalibai
  const eLibraryLinks = [
    { name: "IATA Publications", url: "https://www.iata.org/en/publications/" },
    { name: "UN Tourism Library", url: "https://www.e-unwto.org/" },
    { name: "Aviation PDF Books", url: "https://www.pdfdrive.com/aviation-books.html" },
    { name: "Hospitality Management", url: "https://www.openwafe.org/" }
  ];

  const featuredCourses = [
    { 
      id: 1,
      title: "Air Ticketing & Reservation", 
      fee: "₦80,000", 
      icon: <Plane size={24} />, 
      desc: "Master Global Distribution Systems (GDS). Learn Amadeus and Sabre.",
      img: "/1767965179277.jpg", 
      outcomes: ["Proficiency in Amadeus & Sabre GDS", "IATA Geography", "Advanced Fare Construction"],
      careers: ["Airline Ticketing Officer", "Travel Consultant"]
    },
    { 
      id: 2,
      title: "Customer Service Management", 
      fee: "₦80,000", 
      icon: <Users size={24} />, 
      desc: "Develop high-level communication and problem-solving skills.",
      img: "/1767965255899.jpg", 
      outcomes: ["Effective Communication", "Crisis Management", "Professional Ethics"],
      careers: ["Guest Relations Executive", "Customer Experience Officer"]
    },
    { 
      id: 3,
      title: "Travel & Tourism Operations", 
      fee: "₦80,000", 
      icon: <Globe size={24} />, 
      desc: "Comprehensive training on managing international tour packages.",
      img: "/1767965449892.jpg", 
      outcomes: ["Tour Packaging", "Destination Marketing", "Global Geography"],
      careers: ["Tour Operator", "Destination Manager"]
    },
    { 
      id: 4,
      title: "Cabin Crew & In-Flight Services", 
      fee: "₦400,000", 
      icon: <Headphones size={24} />, 
      desc: "Professional training for aspiring flight attendants and safety.",
      img: "/1767965537113.jpg", 
      outcomes: ["Safety & Emergency Procedures (SEP)", "Aviation Medicine & First Aid", "In-flight Catering & Service"],
      careers: ["Commercial Flight Attendant", "VIP Corporate Cabin Crew"]
    },
    { 
      id: 5,
      title: "Flight Dispatcher Course", 
      fee: "₦300,000", 
      icon: <Briefcase size={24} />, 
      desc: "Advanced training on flight planning, meteorology and navigation.",
      img: "/1767965629751.jpg", 
      outcomes: ["Advanced Flight Planning", "Meteorology", "Navigation"],
      careers: ["Flight Dispatcher", "Operations Control Officer"]
    },
    { 
      id: 6,
      title: "Airport Ground Operations", 
      fee: "₦80,000", 
      icon: <Layout size={24} />, 
      desc: "Essential training on airport operations and passenger handling.",
      img: "/1767965722394.jpg", 
      outcomes: ["Passenger Handling", "Ramp Safety", "Baggage Control"],
      careers: ["Ground Staff", "Passenger Service Agent"]
    },
    { 
      id: 7,
      title: "Cargo & Freight Handling", 
      fee: "₦80,000", 
      icon: <Ship size={24} />, 
      desc: "Understand the logistics of air transport and Dangerous Goods (DGR).",
      img: "/1767965799313.jpg", 
      outcomes: ["Air Waybill Documentation", "Dangerous Goods (DGR)", "Logistics"],
      careers: ["Air Cargo Agent", "Logistics Coordinator"]
    },
    { 
      id: 8,
      title: "Visa Processing Course", 
      fee: "₦80,000", 
      icon: <FileText size={24} />, 
      desc: "Expert knowledge on international travel documents and visas.",
      img: "/1767965884821.jpg", 
      outcomes: ["Global Visa Categories", "Embassy Standards", "Document Verification"],
      careers: ["Visa Consultant", "Global Mobility Specialist"]
    },
    { 
      id: 9,
      title: "Travel Agency Management", 
      fee: "₦80,000", 
      icon: <Building2 size={24} />, 
      desc: "Business-focused training on how to start a travel agency.",
      img: "/1767965961676.jpg", 
      outcomes: ["Business Plan Development", "Agency Finance", "Digital Marketing"],
      careers: ["Travel Agency Owner", "Business Manager"]
    },
    { 
      id: 10,
      title: "Hotel & Hospitality Management", 
      fee: "₦80,000", 
      icon: <Hotel size={24} />, 
      desc: "Training in world-class hospitality and guest satisfaction.",
      img: "/1767966074821.jpg", 
      outcomes: ["Front Office Operations", "Food & Beverage Management", "Event Planning"],
      careers: ["Hotel Manager", "Hospitality Coordinator"]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="w-full min-h-screen bg-white relative">
      
      {/* 1. HEADER SECTION */}
      <header className="sticky top-0 w-full z-[100] bg-white border-b border-slate-100 shadow-sm pointer-events-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 cursor-pointer relative z-[110]">
             <img src="/logo.png" alt="Skyward Logo" className="h-12 w-12 md:h-14 md:w-14 object-contain" />
             <div className="flex flex-col">
                <span className="text-[#002147] font-black text-xl md:text-2xl leading-none tracking-tighter">SKYWARD</span>
                <span className="text-red-600 font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase text-nowrap">College of Travels and Tourism</span>
             </div>
          </Link>
          
          <div className="hidden md:flex gap-8 text-[#002147] font-black text-[11px] uppercase tracking-widest items-center relative z-[110]">
             <Link to="/" className="text-red-600 cursor-pointer hover:opacity-80 transition-all">Home</Link>
             <Link to="/courses" className="hover:text-red-600 transition-colors cursor-pointer text-nowrap">Courses</Link>
             
             {/* E-LIBRARY DROPDOWN */}
             <div className="group relative">
               <button className="flex items-center gap-1 hover:text-red-600 transition-colors cursor-pointer uppercase">
                 <BookOpen size={14} /> E-Library
               </button>
               <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-[150]">
                 {eLibraryLinks.map((link, i) => (
                   <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-[9px] hover:bg-red-50 hover:text-red-600 rounded-lg">
                     {link.name}
                   </a>
                 ))}
               </div>
             </div>

             <Link to="/gallery" className="hover:text-red-600 transition-colors cursor-pointer">Gallery</Link>
             <Link to="/admission/apply" className="bg-[#002147] text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all cursor-pointer">Apply Now</Link>
             <Link to="/portal/login" className="flex items-center gap-1 hover:text-red-600 transition-colors cursor-pointer">
                <Users size={14} /> Portal
             </Link>
          </div>

          <div className="md:hidden flex items-center gap-4 relative z-[110]">
            <Link to="/portal/login" className="text-[#002147] cursor-pointer">
              <Users size={20} />
            </Link>
            <button className="text-[#002147] cursor-pointer">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* --- MODAL DA BAYANAI --- */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#002147]/90 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative pointer-events-auto">
            <button onClick={() => setSelectedCourse(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-600 hover:text-white transition-all z-[210] cursor-pointer">
              <X size={20} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img src={selectedCourse.img} alt={selectedCourse.title} className="h-48 md:h-full w-full object-cover" />
              <div className="p-8 md:p-10">
                <h3 className="text-[#002147] text-2xl font-black uppercase leading-tight mb-4">{selectedCourse.title}</h3>
                <div className="space-y-4 mb-6">
                  <ul className="space-y-1">
                    {selectedCourse.outcomes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-600"><CheckCircle size={12} className="text-green-500" /> {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between border-t pt-6">
                  <span className="text-2xl font-black text-red-600">{selectedCourse.fee}</span>
                  <Link to="/admission/apply" className="bg-[#002147] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase cursor-pointer">Enroll Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION - LEFT SIDE ALIGNED */}
      <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden bg-slate-900 z-10">
        {slides.map((img, index) => (
          <img key={index} src={img} alt="Hero" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === current ? "opacity-60" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-6 md:px-20 bg-gradient-to-r from-[#002147]/70 to-transparent pointer-events-none">
          <div className="pointer-events-auto relative z-20 max-w-2xl"> 
            <h2 className="text-white text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-4">Welcome to</h2>
            <h1 className="text-white text-2xl md:text-5xl font-black uppercase leading-[1.1] mb-6 tracking-tighter">
              Skyward College of Travels <br />
              <span className="text-red-600">and Tourism</span>
            </h1>
            <p className="text-slate-200 text-sm md:text-lg font-medium mb-8">Start a career that enables you to work at the Airport, Airline, Travel Agencies and luxury Hotels.</p>
            <div className="flex gap-4 justify-start">
              <Link to="/admission/apply" className="bg-red-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-black uppercase text-[10px] md:text-xs tracking-widest shadow-2xl cursor-pointer hover:bg-red-700 transition-all">Start Application</Link>
              <Link to="/portal/login" className="bg-white/10 backdrop-blur-md text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-black uppercase text-[10px] md:text-xs border border-white/20 cursor-pointer hover:bg-white/20 transition-all">Portal Access</Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COURSES SECTION */}
      <div className="w-full py-20 px-6 bg-[#f8fafc] -mt-12 relative z-30 pointer-events-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-8 w-2 bg-red-600 rounded-full"></div>
            <h3 className="text-[#002147] text-2xl font-black uppercase tracking-tight">Our Professional Courses</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {featuredCourses.map((course, idx) => (
              <div key={idx} className="bg-white overflow-hidden rounded-[2rem] shadow-xl hover:-translate-y-2 transition-all border border-slate-100 flex flex-col h-full group pointer-events-auto">
                <div className="relative h-40 w-full overflow-hidden bg-slate-200">
                   <img src={course.img} alt={course.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-[#002147]/10"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow text-center items-center pointer-events-auto">
                  <div className="text-red-600 mb-4 bg-red-50 p-3 rounded-xl">{course.icon}</div>
                  <h4 className="text-[#002147] font-black uppercase text-[11px] mb-2 leading-tight h-8">{course.title}</h4>
                  <p className="text-slate-500 text-[10px] font-bold mb-4 flex-grow">{course.desc}</p>
                  <button 
                    onClick={() => setSelectedCourse(course)} 
                    className="w-full mb-4 py-2 border-2 border-slate-100 rounded-xl text-[9px] font-black uppercase hover:bg-[#002147] hover:text-white transition-all cursor-pointer relative z-40"
                  >
                    View Details
                  </button>
                  <div className="text-red-600 font-black text-sm">{course.fee}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Gallery />

      {/* 5. FOOTER */}
      <footer className="w-full bg-[#002147] text-white py-20 px-6 relative z-30 pointer-events-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
           <div className="space-y-6">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-16 w-16 bg-white p-2 rounded-xl" />
                <h4 className="font-black text-2xl tracking-tighter">SKYWARD</h4>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">Leading Aviation and Tourism College providing world-class professional training since 2010.</p>
           </div>
           <div>
              <h5 className="font-black uppercase text-sm mb-6 border-b border-white/10 pb-2">Quick Links</h5>
              <ul className="space-y-4 text-slate-400 text-sm font-bold uppercase tracking-widest">
                <li><Link to="/courses" className="hover:text-red-600 cursor-pointer">All Courses</Link></li>
                <li><Link to="/admission/apply" className="hover:text-red-600 cursor-pointer">Application Form</Link></li>
                <li><Link to="/portal/login" className="hover:text-red-600 cursor-pointer">Student Portal</Link></li>
              </ul>
           </div>
           <div>
              <h5 className="font-black uppercase text-sm mb-6 border-b border-white/10 pb-2">Contact Us</h5>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-red-600 shrink-0" /> 
                  <span>Along Dougiri Primary School Road, Jimeta, Yola, Adamawa State, Nigeria.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-red-600 shrink-0" /> 
                  <span>+234 7071913131</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-red-600 shrink-0" /> 
                  <span>info@skywardcollege.com</span>
                </li>
              </ul>
           </div>
           <div>
              <h5 className="font-black uppercase text-sm mb-6 border-b border-white/10 pb-2">Connect</h5>
              <div className="flex gap-4">
                 <Facebook size={20} className="text-slate-400 hover:text-red-600 cursor-pointer transition-colors" />
                 <Twitter size={20} className="text-slate-400 hover:text-red-600 cursor-pointer transition-colors" />
                 <Instagram size={20} className="text-slate-400 hover:text-red-600 cursor-pointer transition-colors" />
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
           &copy; 2026 Skyward College of Travels and Tourism. All Rights Reserved.
        </div>
      </footer>
    </section>
  );
};