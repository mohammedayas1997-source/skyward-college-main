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

  // Jerin Courses guda 10 cif kamar yadda kace
  const featuredCourses = [
    { title: "Aviation Management", icon: <Plane size={24} />, desc: "Airport & Airline operations management." },
    { title: "Travel & Tourism", icon: <Globe size={24} />, desc: "Global tourism and travel agency professional." },
    { title: "Hotel Management", icon: <Hotel size={24} />, desc: "Luxury hospitality and catering services." },
    { title: "IATA Foundation", icon: <Award size={24} />, desc: "International air transport association standards." },
    { title: "Flight Dispatch", icon: <Briefcase size={24} />, desc: "Flight planning and operational control." },
    { title: "Aviation Security", icon: <Shield size={24} />, desc: "Security management in aviation industry." },
    { title: "Cabin Crew", icon: <Headphones size={24} />, desc: "In-flight safety and service professional training." },
    { title: "Cargo Handling", icon: <Ship size={24} />, desc: "Managing air and sea freight logistics." },
    { title: "Tour Guiding", icon: <Map size={24} />, desc: "Professional destination management and guiding." },
    { title: "Drone Piloting", icon: <Camera size={24} />, desc: "Unmanned aerial vehicle operations and safety." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="w-full min-h-screen bg-white text-left">
      
      {/* 1. HERO SECTION (Tsohon Tsarinka) */}
      <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden bg-slate-900">
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
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-transparent to-[#002147]/70">
          <h2 className="text-white text-sm md:text-xl font-bold uppercase tracking-[0.4em] mb-4">
            Welcome to
          </h2>
          <h1 className="text-white text-4xl md:text-8xl font-black uppercase leading-[0.9] max-w-5xl mb-8">
            Skyward College <br />
            <span className="text-red-600">of Travels And Tourism</span>
          </h1>
          <p className="text-slate-200 text-lg md:text-2xl max-w-3xl font-medium leading-relaxed mb-6">
            Start a career that enables you to work at the Airport, Airline, Travel Agencies and luxury Hotels.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admission/apply">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95">
                Start Application
              </button>
            </Link>
            <Link to="/portal/login">
              <button className="bg-[#002147] hover:bg-blue-900 text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 border border-white/10">
                Portal Access
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. COURSES SECTION (Wanda na gyara ya zama guda 10) */}
      <div className="w-full py-16 px-6 bg-[#f8fafc] -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-[#002147] text-xl font-black mb-10 uppercase border-l-4 border-red-600 pl-4">Our Professional Courses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {featuredCourses.map((course, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform h-full flex flex-col items-center text-center">
                <div className="text-red-600 mb-4 bg-red-50 w-fit p-3 rounded-2xl">
                  {course.icon}
                </div>
                <h4 className="text-[#002147] font-black uppercase text-[11px] mb-2 leading-tight">{course.title}</h4>
                <p className="text-slate-500 text-[10px] font-bold leading-relaxed">
                  {course.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CORE PHILOSOPHY SECTION (Tsohon Tsarinka) */}
      <div className="w-full bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-1.5 w-24 bg-red-600 mx-auto mb-8"></div>
          <h3 className="text-[#002147] text-3xl md:text-5xl font-black uppercase mb-8 leading-tight">
            A Premier Institute for <br /> Aviation & Tourism
          </h3>
          <p className="text-slate-600 text-lg md:text-xl leading-loose italic font-medium">
            "To provide through teaching, research and other means, the development of knowledge and its practical application to the needs of community and professional integrity."
          </p>
          <Link to="/courses" className="inline-block mt-10 text-red-600 font-black uppercase text-xs tracking-widest border-b-2 border-red-600 pb-1 hover:text-[#002147] hover:border-[#002147] transition-all">
            View Full Prospectus
          </Link>
        </div>
      </div>

      {/* 4. GALLERY SECTION */}
      <div className="border-t border-slate-50">
         <Gallery />
      </div>

    </section>
  );
};