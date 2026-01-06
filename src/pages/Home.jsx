import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Gallery from "../components/Gallery";

export const Home = () => {
  const [current, setCurrent] = useState(0);
  const slides = [
    "/hero1.jpg", "/hero2.jpg", "/hero3.jpg", "/hero4.jpg", 
    "/hero5.jpg", "/hero6.jpg", "/hero7.jpg", "/hero8.jpg","/hero9.jpg", "/hero10.jpg"
    
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="w-full min-h-screen">
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden bg-slate-900">
        
        {/* LATEST NEWS AN CIRE SHI DAGA NAN YA KOMA SAMA A HEADER INDA ICONS SUKE */}

        {/* Background Slider */}
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
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-transparent to-[#002147]/70">
          <h2 className="text-white text-sm md:text-xl font-bold uppercase tracking-[0.4em] mb-4">
            Welcome to
          </h2>
          <h1 className="text-white text-4xl md:text-8xl font-black uppercase leading-[0.9] max-w-5xl mb-8">
            Skyward College <br />
            <span className="text-red-600">of Travels And Tourism</span>
          </h1>
          <p className="text-slate-200 text-lg md:text-2xl max-w-3xl font-medium leading-relaxed mb-10">
            Start a career that enables you to work at the Airport, Airline, Travel Agencies, Tourism Organisations and luxury Hotels.
          </p>
          <p className="text-slate-200 text-lg md:text-2xl max-w-3xl font-medium leading-relaxed mb-10">
            Empowering the next generation of travel professionals with global standards in Yola.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admission/apply">
              <button className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95">
                Start Application
              </button>
            </Link>

            <Link to="/courses">
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95">
                Our Courses
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. CORE PHILOSOPHY SECTION */}
      <div className="w-full bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-1.5 w-24 bg-red-600 mx-auto mb-8"></div>
          <h3 className="text-[#002147] text-3xl md:text-5xl font-black uppercase mb-8">
            A Premier Institute for Aviation & Tourism
          </h3>
          <p className="text-slate-600 text-lg md:text-xl leading-loose italic">
            "To provide through teaching, research and other means, the development of knowledge and its practical application to the needs of community and professional integrity."
          </p>
        </div>
      </div>

      {/* 3. GALLERY SECTION */}
      <div className="border-t border-slate-50">
         <Gallery />
      </div>

    </section>
  );
};