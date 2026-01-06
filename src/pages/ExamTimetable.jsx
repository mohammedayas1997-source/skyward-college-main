import React from "react";
import { Calendar, Clock, MapPin, Download, AlertTriangle, CheckCircle2 } from "lucide-react";

const ExamTimetable = () => {
  // Misalan bayanan jarabawa
  const exams = [
    {
      date: "Monday, Jan 12",
      course: "General Mathematics (MTH101)",
      time: "09:00 AM - 12:00 PM",
      venue: "Main Hall A",
      seat: "SKY-001-42",
      status: "Upcoming"
    },
    {
      date: "Wednesday, Jan 14",
      course: "Introduction to Cabin Crew (ACC101)",
      time: "01:30 PM - 03:30 PM",
      venue: "Tourism Lab 1",
      seat: "SKY-001-42",
      status: "Upcoming"
    },
    {
      date: "Friday, Jan 16",
      course: "Use of English (ENG101)",
      time: "09:00 AM - 11:00 AM",
      venue: "General Lecture Theater",
      seat: "SKY-001-42",
      status: "Upcoming"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter italic">Exam Timetable</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase mt-1 tracking-widest">First Semester Examinations • 2026</p>
          </div>
          <button className="bg-[#002147] hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 transition-all shadow-xl active:scale-95">
            <Download size={18} /> Download Timetable (PDF)
          </button>
        </div>

        {/* Warning/Instructions */}
        <div className="bg-red-50 border-l-8 border-red-600 p-6 rounded-[24px] mb-10 flex items-start gap-4">
          <AlertTriangle className="text-red-600 shrink-0" size={24}/>
          <div>
            <h4 className="text-red-900 font-black text-xs uppercase tracking-widest mb-1">Important Notice</h4>
            <p className="text-red-800/70 text-[10px] font-bold uppercase leading-relaxed">
              Dole ne dalibi ya zo da "Exam Card" dinsa. Za a rufe kofa minti 15 kafin fara jarabawa. Duk dalibin da aka kama da wayar hannu za a kore shi.
            </p>
          </div>
        </div>

        {/* Timetable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, index) => (
            <div key={index} className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="bg-[#002147] p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase text-red-400 mb-1">{exam.date}</p>
                  <h3 className="text-sm font-black uppercase leading-tight">{exam.course}</h3>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 text-white group-hover:scale-125 transition-transform">
                  <Calendar size={100}/>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Clock size={20}/>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Time Slot</p>
                    <p className="text-xs font-black text-[#002147]">{exam.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                    <MapPin size={20}/>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Venue / Hall</p>
                    <p className="text-xs font-black text-[#002147] uppercase">{exam.venue}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Seat No.</p>
                      <p className="text-sm font-black text-red-600">{exam.seat}</p>
                   </div>
                   <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                      <CheckCircle2 size={12} className="text-green-600"/>
                      <span className="text-[9px] font-black text-green-600 uppercase">Confirmed</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Help */}
        <div className="mt-12 text-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conflict in your timetable? <span className="text-blue-600 cursor-pointer hover:underline">Contact Exams & Records Office</span></p>
        </div>
      </div>
    </div>
  );
};

export default ExamTimetable;