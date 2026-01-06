import React, { useState, useEffect } from "react";
import { X, CheckCircle, Briefcase, GraduationCap, ArrowRight, Wallet, Image as ImageIcon } from "lucide-react";
import { db } from "../firebase"; 
import { collection, onSnapshot } from "firebase/firestore";

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [firebaseImages, setFirebaseImages] = useState({});

  // Kwaso hotuna daga Firebase
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
      image: firebaseImages["Air Ticketing & Reservation"] || null, // An cire link din Pexels
      description: "Master Global Distribution Systems (GDS). Learn Amadeus and Sabre for professional flight bookings.",
      outcomes: ["Proficiency in Amadeus & Sabre GDS", "IATA Geography", "Advanced Fare Construction"],
      careers: ["Airline Ticketing Officer", "Travel Consultant"]
    },
    {
      id: 2,
      title: "Customer Service Management",
      fee: "₦80,000",
      image: firebaseImages["Customer Service Management"] || null, 
      description: "Develop high-level communication and problem-solving skills for the global travel industry.",
      outcomes: ["Effective Communication", "Crisis Management", "Professional Ethics"],
      careers: ["Guest Relations Executive", "Customer Experience Officer"]
    },
    {
      id: 3,
      title: "Travel & Tourism Operations",
      fee: "₦80,000",
      image: firebaseImages["Travel & Tourism Operations"] || null, 
      description: "Comprehensive training on managing international tour packages and destination marketing.",
      outcomes: ["Tour Packaging", "Destination Marketing", "Global Geography"],
      careers: ["Tour Operator", "Destination Manager"]
    },
    {
      id: 4,
      title: "Cabin Crew & In-Flight Services",
      fee: "₦400,000",
      image: firebaseImages["Cabin Crew & In-Flight Services"] || null, 
      description: "Professional training for aspiring flight attendants focusing on world-class service, aviation safety, and emergency procedures.",
      outcomes: ["Safety & Emergency Procedures (SEP)", "Aviation Medicine & First Aid", "In-flight Catering & Service"],
      careers: ["Commercial Flight Attendant", "VIP Corporate Cabin Crew"]
    },
    {
      id: 5,
      title: "Flight Dispatcher Course",
      fee: "₦300,000",
      image: firebaseImages["Flight Dispatcher Course"] || null, 
      description: "Advanced training on flight planning, meteorology, and navigation coordination.",
      outcomes: ["Advanced Flight Planning", "Meteorology", "Navigation"],
      careers: ["Flight Dispatcher", "Operations Control Officer"]
    },
    {
      id: 6,
      title: "Airport Ground Operations",
      fee: "₦80,000",
      image: firebaseImages["Airport Ground Operations"] || null, 
      description: "Essential training on airport operations, passenger handling, and ramp safety.",
      outcomes: ["Passenger Handling", "Ramp Safety", "Baggage Control"],
      careers: ["Ground Staff", "Passenger Service Agent"]
    },
    {
      id: 7,
      title: "Cargo & Freight Handling",
      fee: "₦80,000",
      image: firebaseImages["Cargo & Freight Handling"] || null, 
      description: "Understand the logistics of air transport, focusing on documentation and Dangerous Goods (DGR).",
      outcomes: ["Air Waybill Documentation", "Dangerous Goods (DGR)", "Logistics"],
      careers: ["Air Cargo Agent", "Logistics Coordinator"]
    },
    {
      id: 8,
      title: "Visa Processing Course",
      fee: "₦80,000",
      image: firebaseImages["Visa Processing Course"] || null, 
      description: "Expert knowledge on international travel documents and visa application procedures.",
      outcomes: ["Global Visa Categories", "Embassy Standards", "Document Verification"],
      careers: ["Visa Consultant", "Global Mobility Specialist"]
    },
    {
      id: 9,
      title: "Travel Agency Management",
      fee: "₦80,000",
      image: firebaseImages["Travel Agency Management"] || null, 
      description: "Business-focused training on how to start and scale a successful travel agency.",
      outcomes: ["Business Plan Development", "Agency Finance", "Digital Marketing"],
      careers: ["Travel Agency Owner", "Business Manager"]
    },
    {
      id: 10,
      title: "Hotel & Hospitality Management",
      fee: "₦80,000",
      image: firebaseImages["Hotel & Hospitality Management"] || null, 
      description: "Training in world-class hospitality, focusing on hotel operations and guest satisfaction.",
      outcomes: ["Front Office Operations", "Food & Beverage Management", "Event Planning"],
      careers: ["Hotel Manager", "Hospitality Coordinator"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#002147] uppercase italic tracking-tighter">Our Professional Courses</h2>
          <div className="w-24 h-2 bg-red-600 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-slate-500 font-bold text-xs uppercase tracking-widest">Industry Recognized Aviation & Tourism Training</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseData.map((course) => (
            <div key={course.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all group flex flex-col">
              
              <div className="h-56 w-full overflow-hidden relative bg-[#002147]/10 flex items-center justify-center">
                {course.image ? (
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <ImageIcon size={40} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Waiting for Image</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg">
                  {course.id < 10 ? `0${course.id}` : course.id}
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg">
                   <p className="text-[#002147] font-black text-xs">{course.fee}</p>
                </div>
              </div>

              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-lg font-black text-[#002147] uppercase mb-4 leading-tight">{course.title}</h3>
                <p className="text-slate-500 text-[11px] leading-relaxed mb-6 font-medium line-clamp-2 italic">
                  {course.description}
                </p>
                
                <div className="mt-auto">
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="flex items-center gap-2 text-red-600 font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all"
                  >
                    View Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL SECTION - Hoton nan ma zai fita idan babu shi a Firebase */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#002147]/95 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setSelectedCourse(null)} className="absolute top-6 right-6 z-20 p-2 bg-slate-100 rounded-full hover:bg-red-600 hover:text-white transition-all">
              <X size={24} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-full relative bg-slate-100 flex items-center justify-center">
                   {selectedCourse.image ? (
                     <img src={selectedCourse.image} alt={selectedCourse.title} className="w-full h-full object-cover" />
                   ) : (
                     <ImageIcon size={60} className="text-slate-200" />
                   )}
                </div>
                <div className="p-10">
                    <h2 className="text-3xl font-black text-[#002147] uppercase italic mb-2 leading-tight">{selectedCourse.title}</h2>
                    <div className="flex items-center gap-2 mb-6 bg-red-50 w-fit px-4 py-2 rounded-xl border border-red-100">
                        <Wallet size={16} className="text-red-600" />
                        <span className="text-sm font-black text-red-600">Registration: {selectedCourse.fee}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-8 font-medium text-sm">{selectedCourse.description}</p>
                    <button className="w-full bg-[#002147] text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest hover:bg-red-600 transition-all">
                      Apply for Admission
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