import React, { useState } from "react";
import { 
  ClipboardCheck, 
  ListOrdered, 
  ShieldAlert, 
  CalendarDays, 
  UserPlus, 
  ChevronRight, 
  Info
} from "lucide-react";

const AdmissionInfo = () => {
  const [activeTab, setActiveTab] = useState("apply");

  const admissionData = {
    apply: {
      title: "How to Apply",
      icon: <ListOrdered className="text-red-600" />,
      content: [
        { head: "Create Profile", text: "Visit the application portal and fill in your basic personal information to get started." },
        { head: "Pay Application Fee", text: "Make a non-refundable payment of ₦3,000 through our secured online payment gateway." },
        { head: "Complete Form", text: "Upload your passport photograph, O-Level results (max 2 sittings), and previous school details." },
        { head: "Submit & Print", text: "Review your data, submit the form, and print your payment receipt for the screening exercise." }
      ]
    },
    requirements: {
      title: "General Requirements",
      icon: <ShieldAlert className="text-red-600" />,
      content: [
        { head: "Academic Qualification", text: "Minimum of five (5) O-Level credits including English and Mathematics (WAEC/NECO/NABTEB)." },
        { head: "Age Limit", text: "Applicants must be at least 16 years of age at the time of admission." },
        { head: "Health Status", text: "Candidates must be physically and mentally fit for professional aviation and tourism training." },
        { head: "Identification", text: "A valid ID (National ID, Birth Certificate, or International Passport) is required." }
      ]
    },
    forms: {
      title: "Application Forms",
      icon: <ClipboardCheck className="text-red-600" />,
      content: [
        { head: "Online Availability", text: "Forms are strictly available online via the Skyward College official portal." },
        { head: "Registration Period", text: "Ensure all registrations are completed before the 2026/2027 session deadline." },
        { head: "No Hard Copies", text: "Manual/Paper forms are not sold. All processes are fully digitized for transparency." }
      ]
    },
    screening: {
      title: "Screening Dates",
      icon: <CalendarDays className="text-red-600" />,
      content: [
        { head: "Batch A Screening", text: "Monday, March 2nd — Friday, March 6th, 2026." },
        { head: "Batch B Screening", text: "Monday, April 13th — Friday, April 17th, 2026." },
        { head: "Screening Venue", text: "Skyward College Main Campus, Admission Block, 9:00 AM Daily." },
        { head: "Required Items", text: "Original O-Level results, application receipt, and 4 recent passport photographs." }
      ]
    },
    list: {
      title: "Admission List",
      icon: <UserPlus className="text-red-600" />,
      content: [
        { head: "Merit-Based Selection", text: "Selection is strictly based on screening performance and academic credentials." },
        { head: "Batch Releases", text: "The official admission list will be released in batches on the student portal." },
        { head: "Instant Notification", text: "Successful candidates will receive SMS and Email alerts once admission is granted." }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              2026/2027 Admissions
            </span>
          </div>
          <h1 className="text-4xl font-black text-[#002147] uppercase italic leading-tight">
            Admission Guidelines & <br /> Process
          </h1>
          <p className="text-slate-500 mt-4 font-medium">Follow these instructions carefully to secure your admission.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation Tabs (Left Side) */}
          <div className="w-full md:w-1/3 space-y-3">
            {Object.keys(admissionData).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
                  activeTab === key 
                  ? "bg-[#002147] text-white shadow-xl translate-x-2" 
                  : "bg-white text-slate-400 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  {key === activeTab ? <Info size={18} className="text-red-500" /> : admissionData[key].icon}
                  {admissionData[key].title}
                </div>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>

          {/* Content Area (Right Side) */}
          <div className="flex-1 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-slate-100 animate-in fade-in slide-in-from-right-5 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-50 rounded-xl">
                {admissionData[activeTab].icon}
              </div>
              <h2 className="text-2xl font-black text-[#002147] uppercase italic">
                {admissionData[activeTab].title}
              </h2>
            </div>

            <div className="space-y-8">
              {admissionData[activeTab].content.map((item, index) => (
                <div key={index} className="relative pl-8 border-l-2 border-slate-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow-sm"></div>
                  <h4 className="text-sm font-black text-[#002147] uppercase mb-1 tracking-tight">
                    {item.head}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Call to action footer in content area */}
            <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-[10px] font-bold text-slate-400 uppercase text-center">
                Need help with your application? Contact the Admission Help Desk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionInfo;