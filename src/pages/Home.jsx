import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Gallery from "../components/Gallery";
import { Plane, Users, Globe, Headphones, Briefcase, Layout, Ship, FileText, Building2, Hotel, X, CheckCircle } from "lucide-react";

export const Home = () => {
  const [current, setCurrent] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null); // Domin Modal

  const slides = [
    "/hero1.jpg", "/hero2.jpg", "/hero3.jpg", "/hero4.jpg", 
    "/hero5.jpg", "/hero6.jpg", "/hero7.jpg", "/hero8.jpg","/hero9.jpg", "/hero10.jpg"
  ];

  const featuredCourses = [
    { 
      id: 1,
      title: "Air Ticketing & Reservation", 
      fee: "₦80,000", 
      icon: <Plane size={24} />, 
      desc: "Master Global Distribution Systems (GDS). Learn Amadeus and Sabre.",
      img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
      outcomes: ["Proficiency in Amadeus & Sabre GDS", "IATA Geography", "Advanced Fare Construction"],
      careers: ["Airline Ticketing Officer", "Travel Consultant"]
    },
    { 
      id: 2,
      title: "Customer Service Management", 
      fee: "₦80,000", 
      icon: <Users size={24} />, 
      desc: "Develop high-level communication and problem-solving skills.",
      img: "https://images.unsplash.com/photo-1521791136364-798a7bc0d262?q=80&w=2071&auto=format&fit=crop",
      outcomes: ["Effective Communication", "Crisis Management", "Professional Ethics"],
      careers: ["Guest Relations Executive", "Customer Experience Officer"]
    },
    { 
      id: 3,
      title: "Travel & Tourism Operations", 
      fee: "₦80,000", 
      icon: <Globe size={24} />, 
      desc: "Comprehensive training on managing international tour packages.",
      img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop",
      outcomes: ["Tour Packaging", "Destination Marketing", "Global Geography"],
      careers: ["Tour Operator", "Destination Manager"]
    },
    { 
      id: 4,
      title: "Cabin Crew & In-Flight Services", 
      fee: "₦400,000", 
      icon: <Headphones size={24} />, 
      desc: "Professional training for aspiring flight attendants and safety.",
      img: "https://images.unsplash.com/photo-1506012733851-bb60a3322b7d?q=80&w=2070&auto=format&fit=crop",
      outcomes: ["Safety & Emergency Procedures (SEP)", "Aviation Medicine & First Aid", "In-flight Catering & Service"],
      careers: ["Commercial Flight Attendant", "VIP Corporate Cabin Crew"]
    },
    { 
      id: 5,
      title: "Flight Dispatcher Course", 
      fee: "₦300,000", 
      icon: <Briefcase size={24} />, 
      desc: "Advanced training on flight planning, meteorology and navigation.",
      img: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=2070&auto=format&fit=crop",
      outcomes: ["Advanced Flight Planning", "Meteorology", "Navigation"],
      careers: ["Flight Dispatcher", "Operations Control Officer"]
    },
    { 
      id: 6,
      title: "Airport Ground Operations", 
      fee: "₦80,000", 
      icon: <Layout size={24} />, 
      desc: "Essential training on airport operations and passenger handling.",
      img: "https://images.unsplash.com/photo-1473862170180-84427c485aca?q=80&w=2070&auto=format&fit=crop",
      outcomes: ["Passenger Handling", "Ramp Safety", "Baggage Control"],
      careers: ["Ground Staff", "Passenger Service Agent"]
    },
    { 
      id: 7,
      title: "Cargo & Freight Handling", 
      fee: "₦80,000", 
      icon: <Ship size={24} />, 
      desc: "Understand the logistics of air transport and Dangerous Goods (DGR).",
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
      outcomes: ["Air Waybill Documentation", "Dangerous Goods (DGR)", "Logistics"],
      careers: ["Air Cargo Agent", "Logistics Coordinator"]
    },
    { 
      id: 8,
      title: "Visa Processing Course", 
      fee: "₦80,000", 
      icon: <FileText size={24} />, 
      desc: "Expert knowledge on international travel documents and visas.",
      img: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2070&auto=format&fit=crop",
      outcomes: ["Global Visa Categories", "Embassy Standards", "Document Verification"],
      careers: ["Visa Consultant", "Global Mobility Specialist"]
    },
    { 
      id: 9,
      title: "Travel Agency Management", 
      fee: "₦80,000", 
      icon: <Building2 size={24} />, 
      desc: "Business-focused training on how to start a travel agency.",
      img: "https://images.unsplash.com/photo-1435224668334-0f82ec57b40a?q=80&w=2070&auto=format&fit=crop",
      outcomes: ["Business Plan Development", "Agency Finance", "Digital Marketing"],
      careers: ["Travel Agency Owner", "Business Manager"]
    },
    { 
      id: 10,
      title: "Hotel & Hospitality Management", 
      fee: "₦80,000", 
      icon: <Hotel size={24} />, 
      desc: "Training in world-class hospitality and guest satisfaction.",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
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
    <section className="w-full min-h-screen bg-white text-left relative">
      
      {/* --- COURSE DETAILS MODAL (Wannan ne zai rika budewa) --- */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#002147]/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedCourse(null)}
              className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-600 hover:text-white transition-all z-10"
            >
              <X size={20} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img src={selectedCourse.img} alt={selectedCourse.title} className="h-48 md:h-full w-full object-cover" />
              <div className="p-8 md:p-10">
                <div className="text-red-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Professional Training</div>
                <h3 className="text-[#002147] text-2xl font-black uppercase leading-tight mb-4">{selectedCourse.title}</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">What you'll learn:</h4>
                    <ul className="space-y-1">
                      {selectedCourse.outcomes.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                          <CheckCircle size={12} className="text-green-500" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Career Opportunities:</h4>
                    <p className="text-[11px] font-bold text-[#002147]">{selectedCourse.careers.join(" • ")}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-6">
                  <span className="text-2xl font-black text-red-600">{selectedCourse.fee}</span>
                  <Link to="/admission/apply" onClick={() => setSelectedCourse(null)}>
                    <button className="bg-[#002147] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all">Enroll Now</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[500px] md:h-[750px] overflow-hidden bg-slate-900">
        {slides.map((img, index) => (
          <img key={index} src={img} alt="Hero" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === current ? "opacity-60" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-transparent to-[#002147]/80">
          <h2 className="text-white text-3xl md:text-5xl font-black italic tracking-tighter uppercase mb-2">SKYWARD <span className="text-red-600">COLLEGE</span></h2>
          <div className="h-1 w-20 bg-red-600 mb-8"></div>
          <h1 className="text-white text-4xl md:text-7xl font-black uppercase leading-none mb-6">Aviation & <span className="text-red-600">Tourism</span></h1>
          <p className="text-slate-200 text-lg md:text-2xl max-w-3xl font-medium mb-10">Start a career that enables you to work at the Airport, Airline, Travel Agencies and luxury Hotels.</p>
          <div className="flex gap-4">
            <Link to="/admission/apply" className="bg-red-600 text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl">Apply Now</Link>
            <Link to="/portal/login" className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest border border-white/20">Student Portal</Link>
          </div>
        </div>
      </div>

      {/* 2. COURSES SECTION */}
      <div className="w-full py-20 px-6 bg-[#f8fafc] -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-8 w-2 bg-red-600 rounded-full"></div>
            <h3 className="text-[#002147] text-2xl font-black uppercase">Our Professional Courses</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {featuredCourses.map((course, idx) => (
              <div key={idx} className="bg-white overflow-hidden rounded-[2rem] shadow-xl hover:-translate-y-2 transition-all border border-slate-100 flex flex-col h-full group">
                <div className="relative h-32 w-full overflow-hidden">
                   <img src={course.img} alt={course.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-[#002147]/20 group-hover:bg-transparent transition-colors"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow text-center items-center">
                  <div className="text-red-600 mb-4 bg-red-50 p-3 rounded-xl">{course.icon}</div>
                  <h4 className="text-[#002147] font-black uppercase text-[11px] mb-2 leading-tight h-8">{course.title}</h4>
                  <p className="text-slate-500 text-[10px] font-bold mb-4 flex-grow">{course.desc}</p>
                  
                  {/* BUTTON DA KA BUQATA */}
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="w-full mb-4 py-2 border-2 border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#002147] hover:text-white hover:border-[#002147] transition-all"
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

      {/* 3. MISSION SECTION */}
      <div className="w-full bg-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-[#002147] text-3xl md:text-5xl font-black uppercase mb-8">Excellence in Training</h3>
          <p className="text-slate-600 text-lg italic font-medium">"To provide through teaching, research and other means, the development of knowledge and its practical application to the needs of community."</p>
        </div>
      </div>

      <Gallery />
    </section>
  );
};