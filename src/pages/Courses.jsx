import React, { useState } from "react";
import { X, CheckCircle, Briefcase, ArrowRight, Wallet, Image as ImageIcon, Clock } from "lucide-react"; // Na kara Clock icon

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  // An gyara duration zuwa "4 Months" ga dukkan kwasa-kwasai
  const courseData = [
    {
      id: 1,
      title: "Air Ticketing & Reservation",
      fee: "₦80,000",
      duration: "4 Months",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop", 
      description: "Master Global Distribution Systems (GDS). Learn Amadeus and Sabre for professional flight bookings.",
      outcomes: ["Proficiency in Amadeus & Sabre GDS", "IATA Geography", "Advanced Fare Construction"],
      careers: ["Airline Ticketing Officer", "Travel Consultant"]
    },
    {
      id: 2,
      title: "Customer Service Management",
      fee: "₦80,000",
      duration: "4 Months",
      image: "https://images.unsplash.com/photo-1521791136364-798a7bc0d262?q=80&w=2071&auto=format&fit=crop", 
      description: "Develop high-level communication and problem-solving skills for the global travel industry.",
      outcomes: ["Effective Communication", "Crisis Management", "Professional Ethics"],
      careers: ["Guest Relations Executive", "Customer Experience Officer"]
    },
    {
      id: 3,
      title: "Travel & Tourism Operations",
      fee: "₦80,000",
      duration: "4 Months",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop", 
      description: "Comprehensive training on managing international tour packages and destination marketing.",
      outcomes: ["Tour Packaging", "Destination Marketing", "Global Geography"],
      careers: ["Tour Operator", "Destination Manager"]
    },
    {
      id: 4,
      title: "Cabin Crew & In-Flight Services",
      fee: "₦400,000",
      duration: "4 Months",
      image: "https://images.unsplash.com/photo-1506012733851-bb60a3322b7d?q=80&w=2070&auto=format&fit=crop", 
      description: "Professional training for aspiring flight attendants focusing on world-class service, aviation safety, and emergency procedures.",
      outcomes: ["Safety & Emergency Procedures (SEP)", "Aviation Medicine & First Aid", "In-flight Catering & Service"],
      careers: ["Commercial Flight Attendant", "VIP Corporate Cabin Crew"]
    },
    {
      id: 5,
      title: "Flight Dispatcher Course",
      fee: "₦300,000",
      duration: "4 Months",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=2070&auto=format&fit=crop", 
      description: "Advanced training on flight planning, meteorology, and navigation coordination.",
      outcomes: ["Advanced Flight Planning", "Meteorology", "Navigation"],
      careers: ["Flight Dispatcher", "Operations Control Officer"]
    },
    {
      id: 6,
      title: "Airport Ground Operations",
      fee: "₦80,000",
      duration: "4 Months",
      image: "https://images.unsplash.com/photo-1473862170180-84427c485aca?q=80&w=2070&auto=format&fit=crop", 
      description: "Essential training on airport operations, passenger handling, and ramp safety.",
      outcomes: ["Passenger Handling", "Ramp Safety", "Baggage Control"],
      careers: ["Ground Staff", "Passenger Service Agent"]
    },
    {
      id: 7,
      title: "Cargo & Freight Handling",
      fee: "₦80,000",
      duration: "4 Months",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop", 
      description: "Understand the logistics of air transport, focusing on documentation and Dangerous Goods (DGR).",
      outcomes: ["Air Waybill Documentation", "Dangerous Goods (DGR)", "Logistics"],
      careers: ["Air Cargo Agent", "Logistics Coordinator"]
    },
    {
      id: 8,
      title: "Visa Processing Course",
      fee: "₦80,000",
      duration: "4 Months",
      image: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2070&auto=format&fit=crop", 
      description: "Expert knowledge on international travel documents and visa application procedures.",
      outcomes: ["Global Visa Categories", "Embassy Standards", "Document Verification"],
      careers: ["Visa Consultant", "Global Mobility Specialist"]
    },
    {
      id: 9,
      title: "Travel Agency Management",
      fee: "₦80,000",
      duration: "4 Months",
      image: "https://images.unsplash.com/photo-1435224668334-0f82ec57b40a?q=80&w=2070&auto=format&fit=crop", 
      description: "Business-focused training on how to start and scale a successful travel agency.",
      outcomes: ["Business Plan Development", "Agency Finance", "Digital Marketing"],
      careers: ["Travel Agency Owner", "Business Manager"]
    },
    {
      id: 10,
      title: "Hotel & Hospitality Management",
      fee: "₦80,000",
      duration: "4 Months",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop", 
      description: "Training in world-class hospitality, focusing on hotel operations and guest satisfaction.",
      outcomes: ["Front Office Operations", "Food & Beverage Management", "Event Planning"],
      careers: ["Hotel Manager", "Hospitality Coordinator"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#002147] uppercase italic tracking-tighter">Our Professional <span className="text-red-600">Courses</span></h2>
          <div className="w-24 h-2 bg-red-600 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Industry Recognized Training</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courseData.map((course) => (
            <div key={course.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all group flex flex-col h-full hover:-translate-y-2 duration-500">
              <div className="h-64 w-full overflow-hidden relative">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute top-5 left-5 bg-red-600 text-white w-10 h-10 flex items-center justify-center rounded-2xl text-xs font-black shadow-lg">0{course.id}</div>
                <div className="absolute bottom-5 right-5 bg-white/95 px-4 py-2 rounded-2xl shadow-xl flex flex-col items-end">
                    <p className="text-[#002147] font-black text-sm">{course.fee}</p>
                    <p className="text-[9px] font-black text-red-600 uppercase tracking-widest">{course.duration}</p>
                </div>
              </div>

              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-xl font-black text-[#002147] uppercase mb-4 leading-tight group-hover:text-red-600 transition-colors">{course.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-8 italic line-clamp-3">{course.description}</p>
                <div className="mt-auto flex justify-between items-center">
                  <button onClick={() => setSelectedCourse(course)} className="flex items-center gap-2 text-[#002147] font-black text-[11px] uppercase tracking-widest hover:gap-4 transition-all border-b-2 border-red-600 pb-1">
                    View Details <ArrowRight size={14} className="text-red-600" />
                  </button>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock size={12} />
                    <span className="text-[10px] font-black uppercase">{course.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#001524]/95 backdrop-blur-md">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row text-left">
            <button onClick={() => setSelectedCourse(null)} className="absolute top-6 right-6 z-50 p-3 bg-slate-100 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg"><X size={20} /></button>
            <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden relative">
              <img src={selectedCourse.image} alt={selectedCourse.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-6 left-6 bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl">
                Duration: {selectedCourse.duration}
              </div>
            </div>
            <div className="w-full md:w-1/2 p-10 md:p-14 overflow-y-auto">
              <h2 className="text-3xl md:text-4xl font-black text-[#002147] uppercase italic mb-4">{selectedCourse.title}</h2>
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="bg-red-50 px-5 py-3 rounded-2xl border border-red-100">
                  <p className="text-red-600 font-black text-sm leading-none">Fee: {selectedCourse.fee}</p>
                </div>
                <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                  <p className="text-slate-600 font-black text-sm leading-none flex items-center gap-2">
                    <Clock size={14} /> {selectedCourse.duration} Intensive
                  </p>
                </div>
              </div>
              <p className="text-slate-600 mb-10 text-sm leading-relaxed font-medium">{selectedCourse.description}</p>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-[11px] font-black text-[#002147] uppercase tracking-widest mb-4 flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Key Learning Outcomes</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedCourse.outcomes.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-xl">{item}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-[#002147] uppercase tracking-widest mb-4 flex items-center gap-2"><Briefcase size={16} className="text-blue-500" /> Career Opportunities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.careers.map((career, i) => (
                      <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase">{career}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                   setSelectedCourse(null);
                   window.location.href = "/apply"; // Real-life redirect
                }}
                className="w-full mt-12 bg-[#002147] text-white font-black py-5 rounded-[2rem] uppercase text-[11px] tracking-widest hover:bg-red-600 transition-all shadow-xl active:scale-95"
              >
                Apply for {selectedCourse.duration} Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;