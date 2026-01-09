import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Gallery from "../components/Gallery";
import { Plane, Globe, Hotel, Award, Briefcase, Shield, Headphones, Ship, Map, Camera } from "lucide-react";

export const Home = () => {
  const [current, setCurrent] = useState(0);
  const slides = [
    "/hero1.jpg", "/hero2.jpg", "/hero3.jpg", "/hero4.jpg", 
    "/hero5.jpg", "/hero6.jpg", "/hero7.jpg", "/hero8.jpg","/hero9.jpg", "/hero10.jpg"
  ];

  // Jerin Courses dinka na asali guda 10 cif
  const featuredCourses = [
    { title: "Aviation Management", icon: <Plane size={24} />, desc: "Airport & Airline operations management." },
    { title: "Travel & Tourism Management", icon: <Globe size={24} />, desc: "Global tourism and travel agency professional." },
    { title: "Hotel & Hospitality Management", icon: <Hotel size={24} />, desc: "Luxury hospitality and catering services." },
    { title: "IATA Foundation Course", icon: <Award size={24} />, desc: "International air transport association standards." },
    { title: "Flight Operation (Dispatch)", icon: <Briefcase size={24} />, desc: "Flight planning and operational control." },
    { title: "Aviation Security Management", icon: <Shield size={24} />, desc: "Security management in aviation industry." },
    { title: "Cabin Crew & In-flight Service", icon: <Headphones size={24} />, desc: "In-flight safety and service professional training." },
    { title: "Air Cargo Handling", icon: <Ship size={24} />, desc: "Managing air and sea freight logistics." },
    { title: "Tour Guiding & Operations", icon: <Map size={24} />, desc: "Professional destination management and guiding." },
    { title: "Unmanned Aerial Vehicle (Drone)", icon: <Camera size={24} />, desc: "Unmanned aerial vehicle operations and safety." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="w-full min-h-screen bg-white text-left">
      
      {/* 1. HERO SECTION (Tsohon Tsarinka mai Kyau) */}
      <div className="relative w-full h-[500px] md:h-[750px] overflow-hidden bg-slate-900">
        {slides.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Skyward College Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-60" : "opacity-0"
            }`}
          />
        ))}
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-transparent to-[#002147]/80">
          {/* Logo Section */}
          <div className="mb-8 animate-fade-in">
             <h2 className="text-white text-3xl md:text-5xl font-black italic tracking-tighter uppercase">
               Skyward <span className="text-red-600">College</span>
             </h2>
             <div className="h-1 w-20 bg-red-600 mx-auto mt-2"></div>
          </div>

          <h2 className="text-white text-sm md:text-xl font-bold uppercase tracking-[0.4em] mb-4">
            Welcome to the future of
          </h2>
          <h1 className="text-white text-4xl md:text-8xl font-black uppercase leading-[0.9] max-w-5xl mb-8">
            Aviation <br />
            <span className="text-red-600">& Tourism</span>
          </h1>
          <p className="text-slate-200 text-lg md:text-2xl max-w-3xl font-medium leading-relaxed mb-10">
            Start a career that enables you to work at the Airport, Airline, Travel Agencies and luxury Hotels.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admission/apply">
              <button className="bg-red-600 hover:bg-red-700 text-white px-10 md:px-14 py-4 md:py-6 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95">
                Apply Now
              </button>
            </Link>
            <Link to="/portal/login">
              <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 md:px-14 py-4 md:py-6 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all border border-white/30 active:scale-95">
                Student Portal
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. COURSES GRID (Biyar-Biyar a Layi Daya) */}
      <div className="w-full py-20 px-6 bg-[#f8fafc] -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-8 w-2 bg-red-600 rounded-full"></div>
            <h3 className="text-[#002147] text-2xl font-black uppercase tracking-tight">Professional Courses</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {featuredCourses.map((course, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 hover:-translate-y-3 transition-all duration-300 h-full flex flex-col items-center text-center group">
                <div className="text-red-600 mb-6 bg-red-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-colors shadow-inner">
                  {course.icon}
                </div>
                <h4 className="text-[#002147] font-black uppercase text-[12px] mb-3 leading-tight tracking-wide">{course.title}</h4>
                <p className="text-slate-500 text-[11px] font-bold leading-relaxed">
                  {course.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. PHILOSOPHY SECTION */}
      <div className="w-full bg-white py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-red-600 font-black text-xs uppercase tracking-[0.5em] block mb-6">Our Mission</span>
          <h3 className="text-[#002147] text-3xl md:text-6xl font-black uppercase mb-10 leading-none tracking-tighter">
            Excellence in <br /> <span className="text-slate-300">Aviation Training</span>
          </h3>
          <p className="text-slate-600 text-lg md:text-2xl leading-relaxed italic font-medium max-w-3xl mx-auto">
            "To provide through teaching, research and other means, the development of knowledge and its practical application to the needs of community and professional integrity."
          </p>
          <div className="mt-12">
            <Link to="/about" className="text-[#002147] font-black uppercase text-xs tracking-widest border-b-4 border-red-600 pb-2 hover:text-red-600 transition-all">
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>

      {/* 4. GALLERY */}
      <div className="border-t border-slate-100 bg-slate-50/50">
         <Gallery />
      </div>

    </section>
  );
};