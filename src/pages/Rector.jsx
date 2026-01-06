import React from "react";

const Rector = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Title Bar */}
      <div className="w-full bg-[#002147] py-12 px-6 md:px-20 text-white">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Office of the Rector</h1>
      </div>

      <div className="max-w-7xl mx-auto mt-10 px-6 flex flex-col md:flex-row gap-12">
        {/* Hoton Rector */}
        <div className="w-full md:w-1/3">
          <div className="bg-white p-2 shadow-xl border border-slate-200">
            <img src="/rector.jpg" alt="The Rector" className="w-full h-auto grayscale hover:grayscale-0 transition-all" />
            <div className="py-4 text-center">
              <h2 className="text-[#002147] font-black text-xl">Dr. Mohammed Ayas</h2>
              <p className="text-red-600 font-bold text-sm">The Rector, Skyward College</p>
            </div>
          </div>
        </div>

        {/* Bayanan Rector */}
        <div className="w-full md:w-2/3 bg-white p-8 md:p-12 shadow-sm border border-slate-200">
          <h3 className="text-2xl font-black text-[#002147] mb-6 border-b-2 border-red-600 inline-block pb-2">Rector's Welcome Address</h3>
          <div className="text-slate-700 leading-loose space-y-4 text-lg">
            <p>
              "It is with great pleasure that I welcome you to Skyward College of Travels and Tourism. 
              Our institution is founded on the principles of integrity, practical knowledge, and excellence."
            </p>
            <p>
              The college has been at the forefront of vocational training in the aviation and tourism sectors, 
              ensuring our students are globally competitive...
            </p>
            {/* Zaka iya kara bayanan duka anan */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rector;