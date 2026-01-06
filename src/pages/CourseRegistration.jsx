import React, { useState } from "react";
import { BookOpen, CheckCircle, AlertCircle, Save, Info, Trash2 } from "lucide-react";

const CourseRegistration = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Jerin darussan da ake bayarwa (Updated with Aviation Courses)
  const availableCourses = [
    { id: "MTH101", title: "General Mathematics", unit: 3, type: "Core" },
    { id: "ENG101", title: "Use of English", unit: 2, type: "Core" },
    // GYARA 1: Mun maida ACC101 ya zama Introduction to Cabin Crew
    { id: "ACC101", title: "Introduction to Cabin Crew", unit: 3, type: "Core" },
    // GYARA 2: Mun maida GEO101 ya zama Aviation Geography
    { id: "GEO101", title: "Aviation Geography", unit: 2, type: "Elective" },
    { id: "LIT101", title: "Literature in English", unit: 2, type: "Elective" },
    { id: "FRE101", title: "Basic French for Travel", unit: 2, type: "Elective" },
    // SABON COURSE: Flight Dispatcher Operations
    { id: "FDP101", title: "Flight Dispatcher Operations", unit: 3, type: "Core" },
  ];

  const toggleCourse = (course) => {
    if (selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const totalUnits = selectedCourses.reduce((sum, c) => sum + c.unit, 0);
  const maxUnits = 18; // Na kara unit din daga 12 zuwa 18 tunda mun kara courses

  const handleSubmit = () => {
    if (totalUnits === 0) return alert("Don Allah zabi akalla darasi guda!");
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tighter">Course Registration</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase mt-1 tracking-widest">First Semester • 2026/2027 Session</p>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm">
             <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Credit Units</p>
             <p className={`text-xl font-black ${totalUnits > maxUnits ? 'text-red-600' : 'text-blue-600'}`}>
                {totalUnits} / {maxUnits}
             </p>
          </div>
        </div>

        {isSubmitted ? (
          /* SUCCESS MESSAGE */
          <div className="bg-white p-12 rounded-[40px] text-center shadow-2xl border border-green-100 animate-in zoom-in-95 duration-500">
            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40}/>
            </div>
            <h2 className="text-2xl font-black text-[#002147] uppercase mb-2">Registration Successful!</h2>
            <p className="text-slate-500 text-sm mb-8">Your courses have been submitted for departmental approval.</p>
            <button className="bg-[#002147] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl">Print Slip</button>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* List of Available Courses */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-blue-600 p-6 rounded-[32px] text-white mb-6 flex items-center gap-4 shadow-xl">
                 <Info size={24}/>
                 <p className="text-[10px] font-bold uppercase leading-relaxed tracking-wider">
                    Dole ne ka zabi dukkan "Core Courses". Sannan zaka iya zaba daga cikin "Elective Courses" har zuwa credit units {maxUnits}.
                 </p>
              </div>

              {availableCourses.map((course) => (
                <div 
                  key={course.id} 
                  onClick={() => toggleCourse(course)}
                  className={`p-6 rounded-[30px] border-2 transition-all cursor-pointer flex justify-between items-center group
                    ${selectedCourses.find(c => c.id === course.id) 
                      ? 'bg-white border-blue-600 shadow-md' 
                      : 'bg-white border-transparent hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xs
                      ${course.type === 'Core' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                      {course.id.substring(0, 3)}
                    </div>
                    <div>
                      <h4 className="font-black text-[#002147] text-xs uppercase">{course.title}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{course.id} • {course.unit} Units • {course.type}</p>
                    </div>
                  </div>
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all
                    ${selectedCourses.find(c => c.id === course.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'}`}>
                    {selectedCourses.find(c => c.id === course.id) && <CheckCircle size={14}/>}
                  </div>
                </div>
              ))}
            </div>

            {/* Registration Summary Sidebar */}
            <div className="space-y-6">
              <div className="bg-[#002147] p-8 rounded-[40px] text-white shadow-2xl">
                <h3 className="font-black text-xs uppercase tracking-widest mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                   <BookOpen size={16}/> Selection Summary
                </h3>
                <div className="space-y-4 mb-8">
                  {selectedCourses.length > 0 ? (
                    selectedCourses.map(c => (
                      <div key={c.id} className="flex justify-between items-center group">
                        <span className="text-[10px] font-bold uppercase tracking-tighter truncate max-w-[150px]">{c.title}</span>
                        <span className="text-[10px] font-black opacity-60">{c.unit} Units</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">No courses selected yet.</p>
                  )}
                </div>
                
                <div className="border-t border-white/10 pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase text-blue-300">Total Units Selected</p>
                    <p className="text-xl font-black">{totalUnits}</p>
                  </div>
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={totalUnits > maxUnits}
                  className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all flex items-center justify-center gap-2
                    ${totalUnits > maxUnits ? 'bg-slate-700 cursor-not-allowed text-slate-500' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                >
                  <Save size={16}/> Finalize Registration
                </button>
                {totalUnits > maxUnits && (
                  <p className="text-[8px] text-red-400 font-black uppercase mt-3 text-center">
                    Error: You have exceeded the credit limit!
                  </p>
                )}
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm text-center">
                 <AlertCircle className="mx-auto text-orange-500 mb-2" size={24}/>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                    Registration deadline: <br/> <span className="text-[#002147]">Jan 20, 2026</span>
                 </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseRegistration;