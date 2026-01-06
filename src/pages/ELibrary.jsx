import React from "react";
import { BookOpen, Download, ExternalLink, GraduationCap } from "lucide-react";

const libraries = [
  {
    name: "Z-Library (Aviation Collection)",
    desc: "A global digital repository where you can find thousands of books on Air Cabin Crew, Pilot training, and Aviation safety for free.",
    link: "https://z-lib.gs/",
    color: "border-blue-500"
  },
  {
    name: "PDF Drive",
    desc: "The world's largest search engine for PDF files, offering easy access to Travel & Tourism Management and Hotel Catering textbooks.",
    link: "https://www.pdfdrive.com/",
    color: "border-red-600"
  },
  {
    name: "Open Library",
    desc: "An open, editable library catalog, providing millions of books on global history, travel geography, and hospitality operations.",
    link: "https://openlibrary.org/",
    color: "border-[#002147]"
  },
  {
    name: "Directory of Open Access Books",
    desc: "A service that indexes and provides access to scholarly, peer-reviewed open access books for academic research and college studies.",
    link: "https://www.doabooks.org/",
    color: "border-green-600"
  }
];

const ELibrary = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="w-full bg-[#002147] py-20 px-6 text-center text-white border-b-8 border-red-600">
        <div className="flex justify-center mb-4">
           <BookOpen className="text-red-500" size={50} />
        </div>
        <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter">Digital E-Library</h1>
        <p className="text-slate-300 mt-4 max-w-2xl mx-auto text-sm md:text-base italic uppercase tracking-widest">
          Access thousands of academic resources and aviation manuals for free
        </p>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {libraries.map((lib, index) => (
            <div key={index} className={`bg-white p-8 rounded-2xl shadow-sm border-l-8 ${lib.color} hover:shadow-xl transition-all group`}>
              <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-100 p-3 rounded-lg group-hover:bg-[#002147] group-hover:text-white transition-colors">
                  <GraduationCap size={24} />
                </div>
                <a href={lib.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-600">
                  <ExternalLink size={20} />
                </a>
              </div>
              <h3 className="text-[#002147] text-xl font-black uppercase mb-4">{lib.name}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">{lib.desc}</p>
              <a 
                href={lib.link} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#002147] text-white px-6 py-3 rounded-lg font-bold text-xs uppercase hover:bg-red-600 transition-all shadow-lg"
              >
                Open Library <Download size={14} />
              </a>
            </div>
          ))}
        </div>

        {/* Notice Card */}
        <div className="mt-16 bg-blue-50 border-2 border-dashed border-blue-200 p-8 rounded-3xl text-center">
          <h4 className="text-[#002147] font-black uppercase text-lg mb-2">Notice to Students</h4>
          <p className="text-slate-700 text-sm italic">
            "You are encouraged to use these resources for academic purposes only. Please ensure you comply with the fair use policies of each respective platform."
          </p>
        </div>
      </div>
    </div>
  );
};

export default ELibrary;