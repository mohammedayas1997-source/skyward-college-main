import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Gallery from "../components/Gallery";
import { Plane, Users, Globe, Headphones, Briefcase, Layout, Ship, FileText, Building2, Hotel, X, CheckCircle, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Menu, BookOpen, ExternalLink, Home as HomeIcon, Image as GalleryIcon, ShieldCheck } from "lucide-react";

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
      fullDesc: "Step into the command center of global travel. This course isn't just about booking flights; it's about mastering the sophisticated Global Distribution Systems (GDS) like Amadeus and Sabre that run the world's airlines. You will learn the complex language of air travel, from fare construction to international routing.",
      img: "/1767965179277.jpg", 
      outcomes: ["Expert Proficiency in Amadeus & Sabre GDS", "IATA Standard Geography & Routing", "Advanced International Fare Construction", "E-Ticketing & Reissue Procedures"], 
      careers: ["Airline Ticketing Officer", "International Travel Consultant", "GDS Specialist", "Airport Passenger Service Agent"] 
    },
    { 
      id: 2, 
      title: "Customer Service Management", 
      fee: "₦80,000", 
      icon: <Users size={24} />, 
      desc: "Master the art of elite communication and emotional intelligence in the luxury service world.", 
      fullDesc: "In the world of luxury travel and tourism, excellence is defined by the experience. This program transforms you into a master of human psychology, professional ethics, and high-stakes communication. You will learn to anticipate needs before they are voiced and manage complex guest relations with absolute grace.",
      img: "/1767965255899.jpg", 
      outcomes: ["Advanced Emotional Intelligence (EQ)", "Global Professional Etiquette & Grooming", "Conflict Resolution & Crisis Management", "Luxury Service Delivery Standards"], 
      careers: ["Guest Relations Executive", "VIP Customer Experience Officer", "Corporate Services Manager", "Front Office Coordinator"] 
    },
    { 
        id: 3, 
        title: "Travel & Tourism Operations", 
        fee: "₦80,000", 
        icon: <Globe size={24} />, 
        desc: "Design the world's most exotic experiences. Learn to manage global tourism like a pro.", 
        fullDesc: "Tourism is the world's largest industry, and it needs visionary managers. This course dives deep into the logistics of international tour packaging, destination marketing, and sustainable travel operations. You'll learn how to build a tourism empire from the ground up.",
        img: "/1767965449892.jpg", 
        outcomes: ["International Tour Packaging & Costing", "Digital Destination Marketing", "Sustainable Tourism Logistics", "Visa & Passport Regulatory Framework"], 
        careers: ["International Tour Operator", "Destination Brand Manager", "Travel Agency Manager", "Tourism Development Officer"] 
    },
    { 
        id: 4, 
        title: "Cabin Crew & In-Flight Services", 
        fee: "₦400,000", 
        icon: <Headphones size={24} />, 
        desc: "The ultimate lifestyle career. Train for safety, elegance, and service at 35,000 feet.", 
        fullDesc: "Imagine having the world as your office. Our Cabin Crew program is a rigorous, world-class journey that prepares you for the prestigious role of a flight attendant. From aviation safety and emergency procedures to elite in-flight service and aviation medicine, we train you to the highest international standards.",
        img: "/1767965537113.jpg", 
        outcomes: ["Aviation Safety & SEP (Emergency Procedures)", "Aviation Medicine & First Aid", "Luxury In-flight Service Protocols", "Crew Resource Management (CRM)"], 
        careers: ["Commercial Flight Attendant", "Private Jet Hostess", "In-flight Service Manager", "Safety Instructor"] 
    },
    { 
        id: 5, 
        title: "Flight Dispatcher Course", 
        fee: "₦300,000", 
        icon: <Briefcase size={24} />, 
        desc: "The brain behind every flight. Master meteorology, navigation, and flight safety.", 
        fullDesc: "Flight Dispatchers are the 'captains on the ground.' This high-stakes course teaches you the science of flight planning, aviation meteorology, and air law. You will be responsible for the safety of every soul on board by calculating fuel, weather risks, and optimal flight paths.",
        img: "/1767965629751.jpg", 
        outcomes: ["Advanced Flight Planning & Fuel Calculation", "Aviation Meteorology Analysis", "Air Navigation & Radio Aids", "NCAA Regulatory Compliance"], 
        careers: ["Licensed Flight Dispatcher", "Airline Operations Controller", "Flight Safety Officer", "Load Master"] 
    },
    {
        id: 6,
        title: "Hotel & Hospitality Management",
        fee: "₦80,000",
        icon: <Hotel size={24} />,
        desc: "Learn to manage luxury hotels, resorts, and world-class hospitality establishments.",
        fullDesc: "Master the intricacies of luxury hotel operations. This program covers front office management, housekeeping standards, food and beverage operations, and strategic hospitality marketing.",
        img: "/1767965709569.jpg",
        outcomes: ["World-class Front Office Operations", "Luxury Housekeeping Standards", "Food & Beverage Management", "Hospitality Revenue Management"],
        careers: ["Hotel Manager", "Front Office Manager", "F&B Director", "Resort Operations Lead"]
    },
    {
        id: 7,
        title: "Airport Operations & Management",
        fee: "₦80,000",
        icon: <Layout size={24} />,
        desc: "The nerve center of aviation. Master ground handling, security, and airport logistics.",
        fullDesc: "Airports are complex cities that never sleep. This course prepares you to manage the ground side and air side operations, ensuring safety, efficiency, and superior passenger flow.",
        img: "/1767965764024.jpg",
        outcomes: ["Ground Handling Procedures", "Airport Security Protocols", "Airside Safety Management", "Passenger Flow Optimization"],
        careers: ["Airport Operations Officer", "Ground Handling Manager", "Aviation Security Supervisor", "Terminal Manager"]
    },
    {
        id: 8,
        title: "Cargo & Freight Logistics",
        fee: "₦80,000",
        icon: <Ship size={24} />,
        desc: "The backbone of global trade. Master air cargo handling and dangerous goods regulations.",
        fullDesc: "Understand the logistics of moving goods across the globe. This course covers everything from air waybill documentation to IATA regulations for shipping dangerous goods.",
        img: "/1767965825313.jpg",
        outcomes: ["Cargo Documentation & Air Waybills", "IATA Dangerous Goods Regulations", "Cold Chain Logistics Management", "Global Supply Chain Strategy"],
        careers: ["Cargo Operations Manager", "Freight Forwarder", "Logistics Coordinator", "Dangerous Goods Specialist"]
    },
    {
        id: 9,
        title: "Tourism Marketing & Digital Strategy",
        fee: "₦80,000",
        icon: <Building2 size={24} />,
        desc: "Promote world-class destinations using cutting-edge digital marketing tools.",
        fullDesc: "In the digital age, tourism thrives online. Learn to build destination brands, manage social media for travel, and use data analytics to drive tourism growth.",
        img: "/1767965879321.jpg",
        outcomes: ["Digital Destination Branding", "Tourism SEO & Content Strategy", "Travel Analytics & Data Insight", "Social Media for Hospitality"],
        careers: ["Destination Marketer", "Tourism Digital Strategist", "Travel Content Creator", "Tourism PR Specialist"]
    },
    {
        id: 10,
        title: "IATA Foundation Course",
        fee: "₦150,000",
        icon: <FileText size={24} />,
        desc: "Get globally certified. The gold standard for entry into the international aviation world.",
        fullDesc: "This is the global passport to an aviation career. Following the IATA international curriculum, this course provides a rock-solid foundation in all aspects of the travel industry.",
        img: "/1767965935901.jpg",
        outcomes: ["IATA International Certification Prep", "Global Travel Industry Standards", "World Geography & Currency Exchange", "Standardized Airline Procedures"],
        careers: ["Certified Travel Consultant", "International Airline Agent", "Global Distribution Analyst", "Aviation Consultant"]
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
          
          <div className="hidden lg:flex gap-6 text-[#002147] font-black text-[10px] uppercase tracking-widest items-center relative z-[110]">
              <Link to="/" className="text-red-600 cursor-pointer hover:opacity-80 transition-all flex items-center gap-1">
                <HomeIcon size={14} /> Home
              </Link>
              
              <Link to="/courses" className="hover:text-red-600 transition-colors cursor-pointer text-nowrap flex items-center gap-1">
                <Plane size={14} /> Courses
              </Link>
              
              <button onClick={() => setIsLibraryOpen(true)} className="hover:text-red-600 transition-colors cursor-pointer uppercase flex items-center gap-1">
                <BookOpen size={14} /> E-Library
              </button>

              <Link to="/gallery" className="hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1">
                <GalleryIcon size={14} /> Gallery
              </Link>

              <div className="flex flex-col border-l border-slate-200 pl-6 gap-1">
                <span className="flex items-center gap-2 text-[9px] lowercase font-bold"><Mail size={12} className="text-red-600"/> info@skywardcollege.com</span>
                <span className="flex items-center gap-2 text-[9px] font-bold"><Phone size={12} className="text-red-600"/> +234 7071913131</span>
              </div>

              <Link to="/admission/apply" className="bg-red-600 text-white px-5 py-3 rounded-full hover:bg-[#002147] transition-all cursor-pointer">Apply Now</Link>
              
              <div className="flex items-center gap-2 ml-2">
                <Link to="/portal/login" className="bg-slate-100 text-[#002147] px-4 py-3 rounded-full hover:bg-slate-200 transition-all cursor-pointer flex items-center gap-2">
                   <Users size={14} /> Portal
                </Link>
                <Link to="/portal/login" className="bg-[#002147] text-white px-4 py-3 rounded-full hover:bg-red-600 transition-all cursor-pointer flex items-center gap-2 border border-[#002147]">
                   <ShieldCheck size={14} /> Admin
                </Link>
              </div>
          </div>

          <div className="lg:hidden flex items-center gap-4 relative z-[110]">
             <Link to="/portal/login" className="text-[#002147] cursor-pointer">
              <ShieldCheck size={24} />
            </Link>
            <button className="text-[#002147] cursor-pointer" onClick={() => setIsLibraryOpen(true)}>
              <BookOpen size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#002147]/98 backdrop-blur-xl">
           <div className="bg-white w-full max-w-6xl h-full md:h-[90vh] rounded-[3rem] overflow-hidden relative flex flex-col md:flex-row shadow-2xl">
              <button onClick={() => setSelectedCourse(null)} className="absolute top-6 right-6 z-50 p-4 bg-white/20 hover:bg-red-600 text-white rounded-full transition-all backdrop-blur-md">
                <X size={24} />
              </button>
              <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden">
                 <img src={selectedCourse.img} alt={selectedCourse.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#002147] via-transparent to-transparent opacity-60"></div>
                 <div className="absolute bottom-12 left-12">
                    <div className="bg-red-600 p-4 rounded-2xl inline-block text-white mb-6">{selectedCourse.icon}</div>
                    <h2 className="text-white text-4xl font-black uppercase tracking-tighter leading-none">{selectedCourse.title}</h2>
                 </div>
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto bg-white text-left text-[#002147]">
                 <div className="mb-10">
                    <h5 className="text-red-600 font-black uppercase text-xs tracking-[0.3em] mb-4">Program Overview</h5>
                    <p className="text-lg font-medium leading-relaxed">{selectedCourse.fullDesc}</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                       <h5 className="text-red-600 font-black uppercase text-xs tracking-[0.3em] mb-6">Learning Outcomes</h5>
                       <ul className="space-y-4">
                          {selectedCourse.outcomes.map((outcome, i) => (
                             <li key={i} className="flex gap-3 text-sm font-bold text-slate-600">
                                <CheckCircle size={18} className="text-red-600 shrink-0" /> {outcome}
                             </li>
                          ))}
                       </ul>
                    </div>
                    <div>
                       <h5 className="text-red-600 font-black uppercase text-xs tracking-[0.3em] mb-6">Career Paths</h5>
                       <ul className="space-y-4">
                          {selectedCourse.careers.map((career, i) => (
                             <li key={i} className="flex gap-3 text-sm font-bold text-slate-600 italic leading-none">
                                <div className="h-1.5 w-1.5 bg-red-600 rounded-full mt-1.5"></div> {career}
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>
                 <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center gap-8">
                    <div>
                       <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Tuition Fee</span>
                       <span className="text-[#002147] text-3xl font-black">{selectedCourse.fee}</span>
                    </div>
                    <Link to="/admission/apply" className="flex-grow bg-red-600 text-white text-center py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#002147] transition-all">Enroll Now</Link>
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
        <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-6 md:px-20 bg-gradient-to-r from-[#002147]/80 to-transparent z-40 pointer-events-none">
          <div className="max-w-2xl pointer-events-auto"> 
            <h2 className="text-white text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-4">Welcome to</h2>
            <h1 className="text-white text-2xl md:text-5xl font-black uppercase leading-[1.1] mb-6 tracking-tighter">Skyward College of Travels <br /><span className="text-red-600">and Tourism</span></h1>
            <p className="text-slate-200 text-sm md:text-lg font-medium mb-8">Start a career that enables you to work at the Airport, Airline, Travel Agencies and luxury Hotels.</p>
            <div className="flex gap-4">
              <Link to="/admission/apply" className="bg-red-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-black uppercase text-[10px] md:text-xs tracking-widest shadow-2xl hover:bg-red-700 transition-all relative z-[50] cursor-pointer">Start Application</Link>
              <Link to="/portal/login" className="bg-white/10 backdrop-blur-md text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-black uppercase text-[10px] md:text-xs border border-white/20 hover:bg-white/20 transition-all relative z-[50] cursor-pointer">Portal Access</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Course Cards Section */}
      <div className="w-full py-20 px-6 bg-[#f8fafc] -mt-12 relative z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-8 w-2 bg-red-600 rounded-full"></div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-[#002147]">Our Professional Courses</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center">
            {featuredCourses.map((course, idx) => (
              <div key={idx} className="bg-white overflow-hidden rounded-[2rem] shadow-xl hover:-translate-y-2 transition-all border border-slate-100 flex flex-col h-full group">
                <div className="relative h-40 w-full overflow-hidden bg-slate-200 cursor-pointer" onClick={() => setSelectedCourse(course)}>
                   <img src={course.img} alt={course.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-[#002147]/10"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow items-center text-[#002147]">
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
              <p className="text-slate-400 text-sm font-medium leading-relaxed italic">At Skyward College, we prepare you for the global stage.</p>
           </div>
           <div>
             <h5 className="font-black uppercase text-sm mb-6 border-b border-white/10 pb-2 text-red-600">Quick Links</h5>
             <ul className="space-y-4 text-slate-400 text-sm font-bold uppercase tracking-widest">
               <li><Link to="/courses" className="hover:text-red-600">All Courses</Link></li>
               <li><Link to="/portal/login" className="hover:text-red-600">Staff Portal</Link></li>
             </ul>
           </div>
           <div>
             <h5 className="font-black uppercase text-sm mb-6 border-b border-white/10 pb-2 text-red-600">Contact</h5>
             <p className="text-slate-400 text-sm font-medium leading-loose">info@skywardcollege.com<br />+234 7071913131</p>
           </div>
           <div className="flex gap-4">
              <Facebook size={20} className="text-slate-400 hover:text-red-600 cursor-pointer" />
              <Instagram size={20} className="text-slate-400 hover:text-red-600 cursor-pointer" />
           </div>
        </div>
      </footer>
    </section>
  );
};