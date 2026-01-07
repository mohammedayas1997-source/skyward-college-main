import React, { useState, useEffect } from "react";
import { X, CheckCircle, Briefcase, GraduationCap, ArrowRight, Wallet, Image as ImageIcon, MapPin, Clock } from "lucide-react";
import { db } from "../firebase"; 
import { collection, onSnapshot } from "firebase/firestore";

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [firebaseImages, setFirebaseImages] = useState({});

  // Kwaso hotuna daga Firebase (Real-time)
  useEffect(() => {
    const q = collection(db, "courseImages"); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const images = {};
      snapshot.forEach((doc) => {
        images[doc.data().courseTitle] = doc.data().imageUrl;
      });
      setFirebaseImages(images);
    });
    return () => unsubscribe();
  }, []);

  const courseData = [
    {
      id: 1,
      title: "Air Ticketing & Reservation",
      fee: "₦80,000",
      image: firebaseImages["Air Ticketing & Reservation"] || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000&auto=format&fit=crop", 
      description: "Master Global Distribution Systems (GDS). Learn Amadeus and Sabre for professional flight bookings.",
      outcomes: ["Proficiency in Amadeus & Sabre GDS", "IATA Geography", "Fare Construction"],
      careers: ["Airline Ticketing Officer", "Travel Consultant"]
    },
    {
      id: 2,
      title: "Customer Service Management",
      fee: "₦80,000",
      image: firebaseImages["Customer Service Management"] || "https://images.unsplash.com/photo-1521791136364-798a7bc0d262?q=80&w=2000&auto=format&fit=crop", 
      description: "Develop high-level communication and problem-solving skills for the global travel industry.",
      outcomes: ["Effective Communication", "Crisis Management", "Professional Ethics"],
      careers: ["Guest Relations Executive", "Customer Experience Officer"]
    },
    {
      id: 3,
      title: "Travel & Tourism Operations",
      fee: "₦80,000",
      image: firebaseImages["Travel & Tourism Operations"] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000&auto=format&fit=crop", 
      description: "Comprehensive training on managing international tour packages and destination marketing.",
      outcomes: ["Tour Packaging", "Destination Marketing", "Global Geography"],
      careers: ["Tour Operator", "Destination Manager"]
    },
    {
      id: 4,
      title: "Cabin Crew & In-Flight Services",
      fee: "₦400,000",
      image: firebaseImages["Cabin Crew & In-Flight Services"] || "https://images.unsplash.com/photo-1506012733851-bb60a3322b7d?q=80&w=2000&auto=format&fit=crop", 
      description: "Professional training for aspiring flight attendants focusing on world-class service and safety.",
      outcomes: ["Safety Procedures (SEP)", "Aviation Medicine", "In-flight Catering"],
      careers: ["Commercial Flight Attendant", "VIP Cabin Crew"]
    },
    {
      id: 5,
      title: "Flight Dispatcher Course",
      fee: "₦300,000",
      image: firebaseImages["Flight Dispatcher Course"] || "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=2000&auto=format&fit=crop", 
      description: "Advanced training on flight planning, meteorology, and navigation coordination.",
      outcomes: ["Advanced Flight Planning", "Meteorology", "Navigation Systems"],
      careers: ["Flight Dispatcher", "Operations Control Officer"]
    },
    {
      id: 6,
      title: "Airport Ground Operations",
      fee: "₦80,000",
      image: firebaseImages["Airport Ground Operations"] || "https://images.unsplash.com/photo-1473862170180-84427c485aca?q=80&w=2000&auto=format&fit=crop", 
      description: "Essential training on airport operations, passenger handling, and ramp safety.",
      outcomes: ["Passenger Handling", "Ramp Safety", "Baggage Control"],
      careers: ["Ground Staff", "Passenger Service Agent"]
    },
    {
      id: 7,
      title: "Cargo & Freight Handling",
      fee: "₦80,000",
      image: firebaseImages["Cargo & Freight Handling"] || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop", 
      description: "Understand the logistics of air transport, focusing on documentation and DGR.",
      outcomes: ["Air Waybill Documentation", "Dangerous Goods (DGR)", "Logistics"],
      careers: ["Air Cargo Agent", "Logistics Coordinator"]
    },
    {
      id: 8,
      title: "Visa Processing Course",
      fee: "₦80,000",
      image: firebaseImages["Visa Processing Course"] || "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2000&auto=format&fit=crop", 
      description: "Expert knowledge on international travel documents and visa application procedures.",
      outcomes: ["Global Visa Categories", "Embassy Standards", "Verification"],
      careers: ["Visa Consultant", "Mobility Specialist"]
    },
    {
      id: 9,
      title: "Travel Agency Management",
      fee: "₦80,000",
      image: firebaseImages["Travel Agency Management"] || "https://images.unsplash.com/photo-1435224668334-0f82ec57b40a?q=80&w=2000&auto=format&fit=crop", 
      description: "Business-focused training on how to start and scale a successful travel agency.",
      outcomes: ["Business Development", "Agency Finance", "Digital Marketing"],
      careers: ["Travel Agency Owner", "Business Manager"]
    },
    {
      id: 10,
      title: "Hotel & Hospitality Management",
      fee: "₦80,000",
      image: firebaseImages["Hotel & Hospitality Management"] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop", 
      description: "Training in world-class hospitality, focusing on hotel operations and guest satisfaction.",
      outcomes: ["Front Office Operations", "F&B Management", "Event Planning"],
      careers: ["Hotel Manager", "Hospitality Coordinator"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4 md:px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[#002147] uppercase italic tracking-tighter">
            Our Professional <span className="text-red-600">Courses</span>
          </h2>
          <div className="w-24 h-2 bg-red-600 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em]">
            Industry Recognized Aviation & Tourism Training
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseData.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="h-64 w-full overflow-hidden relative bg-slate-200">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=2000&auto=format&fit=crop"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                
                {/* ID Badge */}
                <div className="absolute top-5 left-5 bg-red-600 text-white w-10 h-10 flex items-center justify-center rounded-2xl text-xs font-black shadow-lg rotate-3">
                  {course.id < 10 ? `0${course.id}` : course.id}
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-xl">
                   <p className="text-[#002147] font-black text-sm">{course.fee}</p>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-xl font-black text-[#002147] uppercase mb-4 leading-tight group-hover:text-red-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-8 font-medium italic line-clamp-3">
                  {course.description}
                </p>
                
                <div className="mt-auto pt-6 border-t border-slate-50">
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="w-full flex items-center justify-between group/btn text-[#002147] hover:text-red-600 font-black text-[11px] uppercase tracking-widest transition-all"
                  >
                    Explore Curriculum 
                    <div className="bg-slate-100 group-hover/btn:bg-red-600 group-hover/btn:text-white p-2 rounded-xl transition-all">
                      <ArrowRight size={16} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DETAILED MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-[#001524]/95 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedCourse(null)} 
              className="absolute top-6 right-6 z-50 p-3 bg-white/90 backdrop-blur rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl"
            >
              <X size={20} />
            </button>

            {/* Modal Sidebar (Image) */}
            <div className="w-full md:w-2/5 h-64 md:h-auto relative">
              <img src={selectedCourse.image} alt={selectedCourse.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 md:to-transparent"></div>
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Aviation Excellence</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-black text-[#002147] uppercase italic mb-6 leading-tight">
                {selectedCourse.title}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tuition Fee</p>
                  <p className="text-lg font-black text-red-600">{selectedCourse.fee}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Duration</p>
                  <p className="text-lg font-black text-[#002147]">Self-Paced</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Outcomes */}
                <div>
                  <h4 className="text-xs font-black text-[#002147] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" /> What you will learn
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCourse.outcomes?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50/50 p-3 rounded-xl">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div> {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Careers */}
                <div>
                  <h4 className="text-xs font-black text-[#002147] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Briefcase size={16} className="text-blue-500" /> Career Opportunities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.careers?.map((career, i) => (
                      <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <button className="w-full bg-[#002147] hover:bg-red-700 text-white font-black py-5 rounded-[2rem] uppercase text-xs tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3">
                  Apply for Admission <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;