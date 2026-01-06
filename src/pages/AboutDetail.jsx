import React from "react";
import { useParams } from "react-router-dom";
import { aboutData } from "../data/aboutData";

const AboutDetail = () => {
  const { id } = useParams(); // Wannan zai gane wane ofishi aka danna
  const data = aboutData[id];

  if (!data) return <div className="p-20 text-center">Page Not Found</div>;

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Blue Header */}
      <div className="w-full bg-[#002147] py-16 px-6 md:px-20 text-white">
        <h1 className="text-3xl md:text-5xl font-black uppercase">{data.title}</h1>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Hoton Ofishin */}
        <div className="md:col-span-1">
          <div className="border-4 border-red-600 p-1 shadow-2xl">
            <img src={data.image} alt={data.title} className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* Bayanan Ofishin */}
        <div className="md:col-span-2">
          <h2 className="text-[#002147] text-2xl font-bold border-b-2 border-red-600 inline-block mb-6">Overview</h2>
          <p className="text-slate-700 text-lg leading-loose text-justify">
            {data.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutDetail;