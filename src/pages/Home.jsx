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
    { 
      id: 1, 
      title: "Air Ticketing & Reservation", 
      fee: "₦80,000", 
      icon: <Plane size={24} />, 
      desc: "The heartbeat of the aviation industry. Become the architect of global travel by mastering international booking systems.", 
      fullDesc: "Step into the command center of global travel. This course isn't just about booking flights; it's about mastering the sophisticated GDS tools (Amadeus & Sabre) that run the world's airlines. You will gain the elite technical skills required to navigate complex itineraries, handle international fare constructions, and provide expert advisory services. In a world that never stops moving, your skills will be the bridge that connects continents. Join us and turn your passion for travel into a high-demand professional craft.",
      img: "/1767965179277.jpg", 
      outcomes: ["Expert Proficiency in Amadeus & Sabre GDS", "IATA Standard Geography & Routing", "Advanced International Fare Construction"], 
      careers: ["Airline Ticketing Officer", "International Travel Consultant"] 
    },
    { 
      id: 2, 
      title: "Customer Service Management", 
      fee: "₦80,000", 
      icon: <Users size={24} />, 
      desc: "Master the art of elite communication and emotional intelligence in the luxury service world.", 
      fullDesc: "In the world of luxury travel and tourism, excellence is defined by the experience. This program transforms you into a master of human psychology and professional ethics. You will learn the secrets of high-level communication, crisis de-escalation, and the art of making every guest feel like royalty. Whether at a 5-star airport lounge or a corporate headquarters, your ability to manage relationships will make you the most valuable asset in any organization. Elevate your persona and become a leader in service excellence.",
      img: "/1767965255899.jpg", 
      outcomes: ["Advanced Emotional Intelligence", "Global Professional Etiquette", "Conflict Resolution & Crisis Management"], 
      careers: ["Guest Relations Executive", "VIP Customer Experience Officer"] 
    },
    { 
      id: 3, 
      title: "Travel & Tourism Operations", 
      fee: "₦80,000", 
      icon: <Globe size={24} />, 
      desc: "Design the world's most exotic experiences. Learn to manage global tourism like a pro.", 
      fullDesc: "Tourism is the world's largest industry, and it needs visionary managers. This course dives deep into the logistics of international tour packaging, destination marketing, and sustainable tourism operations. You will learn how to curate unforgettable experiences from the Maldives to the Alps. We provide you with the strategic mindset to build and manage tourism brands that stand out on the global stage. Don't just visit the world—learn how to run it.",
      img: "/1767965449892.jpg", 
      outcomes: ["International Tour Packaging", "Digital Destination Marketing", "Sustainable Tourism Logistics"], 
      careers: ["International Tour Operator", "Destination Brand Manager"] 
    },
    { 
      id: 4, 
      title: "Cabin Crew & In-Flight Services", 
      fee: "₦400,000", 
      icon: <Headphones size={24} />, 
      desc: "The ultimate lifestyle career. Train for safety, elegance, and service at 35,000 feet.", 
      fullDesc: "Imagine having the world as your office. Our Cabin Crew program is a rigorous, world-class journey that prepares you for the prestigious role of a flight attendant. From aviation medicine and emergency safety procedures to fine dining service and grooming, we cover it all. You will develop the confidence and grace needed to represent top-tier global airlines. This is more than a job—it's an identity. If you are ready for a life of adventure, prestige, and professional excellence, your wings are waiting here.",
      img: "/1767965537113.jpg", 
      outcomes: ["Aviation Safety & Emergency Procedures (SEP)", "Aviation Medicine & First Aid", "Luxury In-flight Service Protocols"], 
      careers: ["Commercial Flight Attendant", "Private Jet Corporate Hostess"] 
    },
    { 
      id: 5, 
      title: "Flight Dispatcher Course", 
      fee: "₦300,000", 
      icon: <Briefcase size={24} />, 
      desc: "The brain behind every flight. Master meteorology, navigation, and flight safety.", 
      fullDesc: "Flight Dispatchers are the 'captains on the ground.' This high-stakes, high-reward course teaches you the science of flight planning, weather analysis, and aircraft performance. You will be responsible for the safety of hundreds of lives by calculating fuel, monitoring routes, and making critical decisions alongside pilots. If you have a sharp mind and a passion for the technical side of aviation, this is your path to a powerful and respected career in the flight operations center.",
      img: "/1767965629751.jpg", 
      outcomes: ["Advanced Flight Planning & Performance", "Aviation Meteorology & Analysis", "Radio Communication & Navigation"], 
      careers: ["Licensed Flight Dispatcher", "Airline Operations Controller"] 
    },
    { 
      id: 6, 
      title: "Airport Ground Operations", 
      fee: "₦80,000", 
      icon: <Layout size={24} />, 
      desc: "Control the pulse of the airport. Master passenger handling and ramp safety.", 
      fullDesc: "An airport is a complex city that never sleeps. This course prepares you to manage the crucial ground operations that keep the aviation world moving. You will master passenger check-in procedures, baggage handling systems, and ramp safety protocols. Learn how to manage the flow of thousands of people and aircraft with precision and efficiency. Your career at the heart of the world's most modern airports starts here.",
      img: "/1767965722394.jpg", 
      outcomes: ["Standard Passenger Handling Procedures", "IATA Ramp & Airside Safety", "Baggage Control & Logistics"], 
      careers: ["Ground Handling Officer", "Passenger Service Supervisor"] 
    },
    { 
      id: 7, 
      title: "Cargo & Freight Handling", 
      fee: "₦80,000", 
      icon: <Ship size={24} />, 
      desc: "Master the logistics of global trade. Learn to handle air cargo and dangerous goods.", 
      fullDesc: "Air cargo is the lifeline of the global economy. This program specializes in the high-demand field of air freight logistics. You will learn the intricate details of Air Waybill documentation, the handling of Dangerous Goods (DGR), and supply chain management. As global e-commerce continues to explode, experts who can move goods safely across borders are in higher demand than ever. Secure your future in the booming world of aviation logistics.",
      img: "/1767965799313.jpg", 
      outcomes: ["Air Waybill & Cargo Documentation", "Dangerous Goods Regulations (DGR)", "Supply Chain & Logistics Management"], 
      careers: ["Air Cargo Specialist", "Logistics Operations Manager"] 
    },
    { 
      id: 8, 
      title: "Visa Processing Course", 
      fee: "₦80,000", 
      icon: <FileText size={24} />, 
      desc: "Become a global mobility expert. Master the complex world of international visas.", 
      fullDesc: "Navigate the complex corridors of international travel laws. This unique course turns you into a professional Visa Consultant. You will gain deep knowledge of global visa categories, embassy requirements, and document verification processes for major countries like the US, UK, Canada, and the Schengen area. In an era of increased migration and travel, your expertise will be the key that opens doors for students, tourists, and professionals worldwide.",
      img: "/1767965884821.jpg", 
      outcomes: ["Global Visa Policy Knowledge", "Embassy Documentation Standards", "Travel Law & Document Verification"], 
      careers: ["Visa & Immigration Consultant", "Mobility Specialist"] 
    },
    { 
      id: 9, 
      title: "Travel Agency Management", 
      fee: "₦80,000", 
      icon: <Building2 size={24} />, 
      desc: "Be your own boss. Learn how to launch and scale a profitable travel business.", 
      fullDesc: "Why work for the industry when you can own a piece of it? This entrepreneurship-focused course gives you the blueprint to start and manage your own travel agency. We cover everything from business registration and financial management to digital marketing and building supplier relationships. We don't just give you a certificate; we give you the tools to build a business empire in the most exciting industry on earth.",
      img: "/1767965961676.jpg", 
      outcomes: ["Business Plan & Growth Strategy", "Travel Agency Finance & Accounting", "Digital Marketing for Travel Brands"], 
      careers: ["Travel Agency CEO", "Independent Travel Entrepreneur"] 
    },
    { 
      id: 10, 
      title: "Hotel & Hospitality Management", 
      fee: "₦80,000", 
      icon: <Hotel size={24} />, 
      desc: "Master world-class hospitality. Train for leadership in luxury hotels and resorts.", 
      fullDesc: "Hospitality is the art of making people feel at home, even when they are miles away. This course prepares you for leadership roles in the world's most prestigious hotels and resorts. You will master front office operations, food and beverage management, and event planning. We focus on the high-end standards that luxury guests expect. Transform your passion for hospitality into a professional career that can take you to any 5-star destination in the world.",
      img: "/1767966074821.jpg", 
      outcomes: ["Front Office & Rooms Division Management", "Global Food & Beverage Standards", "Corporate Event & Wedding Planning"], 
      careers: ["Hotel Operations Manager", "Hospitality Service Lead"] 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="w-full min-h-screen bg-white relative text-[#002147]">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 w-full z-[100] bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 cursor-pointer relative z-[110]">
              <img src="/logo.png" alt="Skyward Logo" className="h-12 w-12 md:h-14 md:w-14 object-contain" />
              <div className="flex flex-col">
                 <span className="text-[#002147] font-black text-xl md:text-2xl leading-none tracking-tighter">SKYWARD</span>
                 <span className="text-red-600 font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase text-nowrap">College of Travels and Tourism</span>
              </div>
          </Link>
          
          <div className="hidden lg:flex gap-8 text-[#002147] font-black text-[10px] uppercase tracking-widest items-center relative z-[110]">
              <Link to="/" className="text-red-600 cursor-pointer hover:opacity-80 transition-all flex items-center gap-1">
                <HomeIcon size={14} /> Home
              </Link>
              
              <Link to="/courses" className="hover:text-red-600 transition-colors cursor-pointer text-nowrap flex items-center gap-1">
                <Plane size={14} /> Courses
              </Link>
              
              <button 
                onClick={() => setIsLibraryOpen(true)}
                className="hover:text-red-600 transition-colors cursor-pointer uppercase flex items-center gap-1"
              >
                <BookOpen size={14} /> E-Library
              </button>

              <Link to="/gallery" className="hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1">
                <GalleryIcon size={14} /> Gallery
              </Link>

              <Link to="/contact" className="hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1">
                <Headphones size={14} /> Contact
              </Link>
              
              <div className="flex flex-col border-l border-slate-200 pl-8 gap-1">
                <span className="flex items-center gap-2 text-[9px] lowercase"><Mail size={12} className="text-red-600"/> info@skywardcollege.com</span>
                <span className="flex items-center gap-2 text-[9px]"><Phone size={12} className="text-red-600"/> +234 7071913131</span>
              </div>

              <Link to="/admission/apply" className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-[#002147] transition-all cursor-pointer">Apply Now</Link>
              
              <Link to="/portal/login" className="hover:text-red-600 transition-colors cursor-pointer">Portal</Link>
          </div>

          <div className="lg:hidden flex items-center gap-4 relative z-[110]">
            <Link to="/portal/login" className="text-[#002147] cursor-pointer">
              <Users size={20} />
            </Link>
            <button className="text-[#002147] cursor-pointer" onClick={() => setIsLibraryOpen(true)}>
              <BookOpen size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* E-Library Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#002147]/95 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] p-8 md:p-12 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsLibraryOpen(false)} className="absolute top-8 right-8 p-3 bg-slate-100 rounded-full hover:bg-red-600 hover:text-white transition-all">
              <X size={24} />
            </button>
            <div className="mb-10 text-left">
              <h2 className="text-[#002147] text-3xl font-black uppercase tracking-tighter mb-2">Skyward Digital E-Library</h2>
              <p className="text-red-600 font-bold text-sm uppercase tracking-widest">Access Nigeria & International Academic Resources</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {eLibraryLinks.map((lib, i) => (
                <a key={i} href={lib.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-6 bg-slate-50 rounded-2xl hover:bg-red-50 transition-all border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-red-600 uppercase mb-1 tracking-widest">{lib.category}</span>
                    <span className="text-[#002147] font-black text-lg leading-tight">{lib.name}</span>
                  </div>
                  <ExternalLink size={20} className="text-slate-300 group-hover:text-red-600 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#002147]/90 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative max-h-[95vh] overflow-y-auto">
            <button onClick={() => setSelectedCourse(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-600 hover:text-white transition-all z-[210]">
              <X size={20} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-auto w-full relative">
                <img src={selectedCourse.img} alt={selectedCourse.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-8 md:p-12 text-[#002147] text-left">
                <h3 className="text-3xl font-black uppercase leading-tight mb-4 border-b pb-4 border-slate-100">{selectedCourse.title}</h3>
                <p className="text-slate-600 font-medium text-sm leading-relaxed mb-6 italic">"{selectedCourse.fullDesc}"</p>
                <div className="mb-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-red-600 mb-3">Key Learning Outcomes:</h4>
                  <ul className="space-y-2">
                    {selectedCourse.outcomes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
                        <CheckCircle size={14} className="text-green-500 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-4 border-t pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-400">Tuition Fee</span>
                    <span className="text-3xl font-black text-red-600">{selectedCourse.fee}</span>
                  </div>
                  <Link to="/admission/apply" className="w-full bg-[#002147] text-white py-4 rounded-2xl font-black text-center uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg block relative z-[220]">Start Your Journey Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden bg-slate-900 z-0">
        {slides.map((img, index) => (
          <img key={index} src={img} alt="Hero" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === current ? "opacity-60" : "opacity-0"}`} />
        ))}
        
        {/* Wannan shine babban gyaran: pointer-events-none a div na gaba, sannan pointer-events-auto a buttons */}
        <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-6 md:px-20 bg-gradient-to-r from-[#002147]/80 to-transparent z-40 pointer-events-none">
          <div className="max-w-2xl pointer-events-auto"> 
            <h2 className="text-white text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-4">Welcome to</h2>
            <h1 className="text-white text-2xl md:text-5xl font-black uppercase leading-[1.1] mb-6 tracking-tighter">Skyward College of Travels <br /><span className="text-red-600">and Tourism</span></h1>
            <p className="text-slate-200 text-sm md:text-lg font-medium mb-8">Start a career that enables you to work at the Airport, Airline, Travel Agencies and luxury Hotels.</p>
            <div className="flex gap-4">
              <Link 
                to="/admission/apply" 
                className="bg-red-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-black uppercase text-[10px] md:text-xs tracking-widest shadow-2xl hover:bg-red-700 transition-all relative z-[50] cursor-pointer"
              >
                Start Application
              </Link>
              <Link to="/portal/login" className="bg-white/10 backdrop-blur-md text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-black uppercase text-[10px] md:text-xs border border-white/20 hover:bg-white/20 transition-all relative z-[50] cursor-pointer">Portal Access</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="w-full py-20 px-6 bg-[#f8fafc] -mt-12 relative z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-8 w-2 bg-red-600 rounded-full"></div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Our Professional Courses</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center">
            {featuredCourses.map((course, idx) => (
              <div key={idx} className="bg-white overflow-hidden rounded-[2rem] shadow-xl hover:-translate-y-2 transition-all border border-slate-100 flex flex-col h-full group">
                <div className="relative h-40 w-full overflow-hidden bg-slate-200 cursor-pointer" onClick={() => setSelectedCourse(course)}>
                   <img src={course.img} alt={course.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-[#002147]/10"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow items-center">
                  <div onClick={() => setSelectedCourse(course)} className="text-red-600 mb-4 bg-red-50 p-3 rounded-xl cursor-pointer hover:bg-red-600 hover:text-white transition-all">{course.icon}</div>
                  <h4 className="font-black uppercase text-[11px] mb-2 leading-tight h-8">{course.title}</h4>
                  <p className="text-slate-500 text-[10px] font-bold mb-4 flex-grow">{course.desc}</p>
                  <button onClick={() => setSelectedCourse(course)} className="w-full mb-4 py-2 border-2 border-slate-100 rounded-xl text-[9px] font-black uppercase hover:bg-[#002147] hover:text-white transition-all">Explore Career</button>
                  <div className="text-red-600 font-black text-sm">{course.fee}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Gallery />

      <footer className="w-full bg-[#002147] text-white py-20 px-6 relative z-30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
           <div className="space-y-6">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-16 w-16 bg-white p-2 rounded-xl" />
                <h4 className="font-black text-2xl tracking-tighter">SKYWARD</h4>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed italic">Are you ready to explore the world while building a successful career? At Skyward College of Travels and Tourism, we don't just teach; we prepare you for the global stage.</p>
           </div>
           <div>
              <h5 className="font-black uppercase text-sm mb-6 border-b border-white/10 pb-2 text-red-600">Quick Links</h5>
              <ul className="space-y-4 text-slate-400 text-sm font-bold uppercase tracking-widest">
                <li><Link to="/courses" className="hover:text-red-600">All Courses</Link></li>
                <li><Link to="/admission/apply" className="hover:text-red-600">Application Form</Link></li>
                <li onClick={() => setIsLibraryOpen(true)} className="cursor-pointer hover:text-red-600">E-Library</li>
              </ul>
           </div>
           <div>
              <h5 className="font-black uppercase text-sm mb-6 border-b border-white/10 pb-2 text-red-600">Contact Us</h5>
              <ul className="space-y-4 text-slate-400 text-sm font-medium">
                <li className="flex items-start gap-3"><MapPin size={18} className="text-red-600 shrink-0" /> Along Dougiri Primary School Road, Jimeta, Yola, Nigeria.</li>
                <li className="flex items-center gap-3"><Phone size={18} className="text-red-600" /> +234 7071913131</li>
                <li className="flex items-center gap-3"><Mail size={18} className="text-red-600" /> info@skywardcollege.com</li>
              </ul>
           </div>
           <div>
              <h5 className="font-black uppercase text-sm mb-6 border-b border-white/10 pb-2 text-red-600">Connect</h5>
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