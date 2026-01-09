import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  const [current, setCurrent] = useState(0);
  const slides = [
    "/hero1.jpg", "/hero2.jpg", "/hero3.jpg", "/hero4.jpg", 
    "/hero5.jpg", "/hero6.jpg", "/hero7.jpg", "/hero8.jpg","/hero9.jpg", "/hero10.jpg"
  ];

  // Jerin dukkan Courses guda 10 kamar yadda ka nema
  const allCourses = [
    { title: "AIR TICKETING/RESERVATION (ATR)", image: "/atr.jpg" },
    { title: "FLIGHT ATTENDANT/CABIN CREW", image: "/cabin.jpg" },
    { title: "BASIC FLIGHT DISPATCHER", image: "/dispatch.jpg" },
    { title: "HELICOPTER PILOT", image: "/heli.jpg" },
    { title: "AVIATION SECURITY", image: "/security.jpg" },
    { title: "CUSTOMER SERVICE", image: "/customer.jpg" },
    { title: "TRAVEL & TOURISM MANAGEMENT", image: "/travel.jpg" },
    { title: "HOTEL MANAGEMENT", image: "/hotel.jpg" },
    { title: "CARGO HANDLING", image: "/cargo.jpg" },
    { title: "DRONE PILOTING", image: "/drone.jpg" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="w-full bg-white">
      
      {/* 1. HERO SECTION (B.SC. DEGREE STYLE) */}
      <div className="relative w-full h-[450px] md:h-[600px] overflow-hidden">
        {slides.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Skyward Slide"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Content Overlay */}
        <div className="absolute inset-0 bg-white/10 flex items-center px-6 md:px-24">
          <div className="max-w-2xl text-left">
            <h1 className="text-[#002147] text-4xl md:text-7xl font-black mb-4 tracking-tighter">B.SC. DEGREE</h1>
            <p className="text-slate-800 text-lg md:text-xl mb-8 font-semibold max-w-lg">
              Admission is now open for Science, Commercial and Art Students. Youth Service Guaranteed.
            </p>
            <Link to="/admission/apply">
              <button className="bg-[#1a1a54] hover:bg-red-600 text-white px-10 py-4 font-black rounded-sm transition-all uppercase text-sm shadow-xl">
                Apply Now
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. ABOUT SECTION (EMPOWERING PROFESSIONALS) */}
      <div className="max-w-7xl mx-auto py-20 px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative group">
          <img src="/staff_group.jpg" alt="Aviation Staff" className="rounded-sm shadow-2xl w-full h-[400px] object-cover" />
          <div className="absolute -bottom-4 -right-4 bg-red-600 w-24 h-24 -z-10"></div>
        </div>
        <div>
          <h2 className="text-[#002147] text-3xl md:text-4xl font-black mb-6 leading-tight">
            Empowering Aviation Professionals Across Africa
          </h2>
          <p className="text-slate-600 leading-loose mb-8 text-sm md:text-base font-medium">
            Skyward College of Travels and Tourism is developed to meet the needs of the aviation industry by way of producing well-trained staff for both domestic and international aviation-related organisations. Since its inception, the institute has recorded tremendous achievements in manpower development.
          </p>
          <button className="bg-[#1a1a54] text-white px-8 py-4 font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* 3. OUR COURSES (10 COURSES GRID - KAMAR HOTON DA KA TURA) */}
      <div className="bg-[#fcfcfc] py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-[#002147] text-2xl font-black mb-12 uppercase tracking-tight border-b-4 border-red-600 w-fit pb-2">
            Our Courses
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {allCourses.map((course, idx) => (
              <div key={idx} className="bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col group">
                {/* Course Image Area */}
                <div className="h-[280px] overflow-hidden relative">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* Course Title Area */}
                <div className="p-6 text-center bg-white border-t border-slate-50 flex-grow flex items-center justify-center">
                  <h4 className="text-[#002147] font-black text-[13px] md:text-sm uppercase tracking-tight leading-tight">
                    {course.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. FOOTER SPACE/PHILOSOPHY */}
      <div className="w-full py-20 bg-[#002147] text-white text-center px-6">
        <p className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 text-center">Professional integrity</p>
        <h3 className="text-2xl md:text-4xl font-black uppercase max-w-3xl mx-auto leading-snug">
          Providing the development of knowledge and its practical application.
        </h3>
      </div>

    </section>
  );
};