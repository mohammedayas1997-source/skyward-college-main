import React, { useState } from "react";
import { Receipt, Download, QrCode, Printer, CheckCircle, ShieldCheck, X } from "lucide-react";

const PaymentPortal = () => {
  const [showReceipt, setShowReceipt] = useState(false);

  // Student data for receipt
  const student = {
    name: "ABUBAKAR IBRAHIM",
    id: "SKY/2026/00421",
    dept: "AIR CABIN CREW MANAGEMENT",
    session: "2026/2027",
    amount: "125,000.00",
    date: "JANUARY 04, 2026",
    ref: "SKY-PAY-99281-X"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      {/* 1. Dashboard View */}
      <div className="max-w-4xl mx-auto print:hidden">
        <div className="bg-[#002147] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden mb-8">
          <ShieldCheck className="absolute -right-12 -bottom-12 text-white/5" size={300} />
          <div className="relative z-10">
            <h2 className="text-4xl font-black italic text-green-400 mb-2 uppercase">Fully Paid</h2>
            <p className="text-sm opacity-80 mb-8 max-w-md font-medium font-sans">Your tuition fees for the 2026/2027 academic session have been verified. You can download your official receipt below.</p>
            <button 
              type="button"
              onClick={() => setShowReceipt(true)}
              className="bg-red-600 hover:bg-white hover:text-[#002147] px-8 py-4 rounded-2xl font-black text-xs uppercase transition-all shadow-xl flex items-center gap-2 active:scale-95"
            >
              <Receipt size={18} /> Generate Official Receipt
            </button>
          </div>
        </div>

        {!showReceipt && (
          <div className="bg-white p-10 rounded-[30px] border border-slate-200 text-center shadow-sm">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={50} />
            <h3 className="text-[#002147] font-black uppercase text-xl">No Pending Dues</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">All your payments are up to date and secured.</p>
          </div>
        )}
      </div>

      {/* 2. AUTO-GENERATED RECEIPT MODAL */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto print:bg-white print:p-0 print:block">
          <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative print:shadow-none print:rounded-none">
            
            {/* Action Buttons (Hidden on Print) */}
            <div className="absolute top-6 right-6 flex gap-2 print:hidden">
              <button onClick={handlePrint} className="p-3 bg-blue-100 text-[#002147] rounded-full hover:bg-blue-200 transition-colors">
                <Printer size={20} />
              </button>
              <button onClick={() => setShowReceipt(false)} className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 md:p-12 relative">
              {/* Receipt Header */}
              <div className="flex justify-between items-start border-b-4 border-[#002147] pb-8 mb-8">
                <div className="flex items-center gap-4">
                  <img src="/logo.png" alt="School Logo" className="w-20 h-20 object-contain" />
                  <div>
                    <h1 className="text-2xl font-black text-[#002147] uppercase leading-none">Skyward College</h1>
                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Travel & Tourism Management</p>
                    <div className="mt-2 bg-[#002147] text-white text-[8px] px-2 py-1 inline-block rounded font-black uppercase tracking-tighter">Official Payment Receipt</div>
                  </div>
                </div>
                <div className="text-right">
                  <QrCode size={60} className="text-[#002147] ml-auto mb-1" />
                  <p className="text-[8px] font-black text-slate-400">REF: {student.ref}</p>
                </div>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-2 gap-y-6 mb-10 border-b pb-8 border-dashed">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Name</p>
                  <p className="text-sm font-black text-[#002147] uppercase">{student.name}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Student ID</p>
                  <p className="text-sm font-black text-[#002147] uppercase">{student.id}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Department</p>
                  <p className="text-sm font-black text-[#002147] uppercase">{student.dept}</p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Purpose of Payment</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Amount Paid</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-[#002147] uppercase">Tuition & Registration Fees (2026/2027)</span>
                  <span className="text-xl font-black text-red-600 tracking-tighter">₦{student.amount}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end mt-12">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment Date</p>
                  <p className="text-xs font-bold text-[#002147] uppercase">{student.date}</p>
                </div>
                <div className="text-center relative">
                  <div className="w-24 h-[1px] bg-slate-400 mb-1 mx-auto"></div>
                  <p className="text-[8px] font-black text-[#002147] uppercase">Bursary Signature</p>
                  <div className="absolute -top-10 left-0 right-0 text-green-600 opacity-20 font-black text-4xl rotate-[-15deg] pointer-events-none">PAID</div>
                </div>
              </div>

              {/* Print Button at Bottom (Hidden on Print) */}
              <div className="mt-12 print:hidden">
                <button 
                  onClick={handlePrint}
                  className="w-full bg-[#002147] hover:bg-red-600 text-white py-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                >
                  <Download size={18} /> Download/Print PDF Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPortal;