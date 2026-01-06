import React from "react";

const Admission = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Title Bar */}
      <div className="w-full bg-[#002147] py-16 px-6 md:px-20 text-white">
        <h1 className="text-3xl md:text-6xl font-black uppercase">Admission Info</h1>
        <p className="text-red-500 font-bold mt-2 tracking-widest uppercase text-sm">Join Skyward College for the 2026/2027 Academic Session</p>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left: Requirements */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-[#002147] text-2xl font-black uppercase border-b-4 border-red-600 inline-block mb-6">General Requirements</h2>
            <ul className="list-disc ml-6 space-y-4 text-slate-700 text-lg">
              <li>Minimum of 5 credits in O'Level (WAEC/NECO/NABTEB) including English and Mathematics.</li>
              <li>Recent passport photographs (White background).</li>
              <li>Birth Certificate or Declaration of Age.</li>
              <li>Indigene Letter from Local Government Area.</li>
            </ul>
          </section>

          <section className="bg-slate-50 p-8 border-l-8 border-[#002147]">
            <h2 className="text-[#002147] text-2xl font-black uppercase mb-4">How to Apply</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Application forms can be obtained directly from the College Campus in Yola, or you can start your application online by clicking the button below.
            </p>
            <button className="bg-red-600 text-white px-8 py-4 rounded-md font-bold uppercase hover:bg-[#002147] transition-all shadow-lg active:scale-95">
              Download Application Form
            </button>
          </section>
        </div>

        {/* Right: Quick Info & Dates */}
        <div className="lg:col-span-1">
          <div className="bg-[#002147] text-white p-8 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-2 text-red-500">Important Dates</h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm opacity-70 uppercase">Form Sales Start:</p>
                <p className="text-lg font-bold italic">January 15th, 2026</p>
              </div>
              <div>
                <p className="text-sm opacity-70 uppercase">Entrance Examination:</p>
                <p className="text-lg font-bold italic">March 10th, 2026</p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="bg-white/10 p-4 rounded text-xs leading-relaxed italic">
                  Note: All candidates are expected to come with their original credentials for screening.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admission;