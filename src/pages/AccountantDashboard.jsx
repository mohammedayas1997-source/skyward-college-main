import React, { useState, useEffect } from "react";
import { db } from "../firebase"; 
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { 
  TrendingUp, TrendingDown, Users, Search, Download, 
  Wallet, Check, X, Eye, AlertCircle, CreditCard, 
  UserCheck, Package, ShoppingCart, Activity,
  PieChart, BarChart3, Plus, ArrowUpRight, ArrowDownRight, Bell, Printer, Send, History, Clock
} from "lucide-react";

const AccountantDashboard = () => {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState({ title: "", amount: "", purpose: "" });
  const [requestHistory, setRequestHistory] = useState([]); // Tarihin bukatun kudi

  // --- 1. FETCH HISTORY (Real-time daga Firebase) ---
  useEffect(() => {
    const q = query(collection(db, "paymentRequests"), orderBy("createdAt", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequestHistory(historyData);
    });
    return () => unsubscribe();
  }, []);

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // --- 2. TURA BUKATA ZUWA RECTOR ---
  const handleRequestFunds = async (e) => {
    e.preventDefault();
    if (!request.title || !request.amount) return alert("Don Allah cika duka wuraren!");
    
    setLoading(true);
    try {
      await addDoc(collection(db, "paymentRequests"), {
        title: request.title,
        amount: request.amount,
        purpose: request.purpose || "General Expenditure",
        status: "pending",
        requester: "Chief Accountant",
        date: new Date().toLocaleDateString(),
        createdAt: serverTimestamp()
      });
      showNotification("An tura bukatar kudi zuwa ga Rector!");
      setRequest({ title: "", amount: "", purpose: "" });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PLACEHOLDER DATA (Wanda kake da su a baya) ---
  const [pendingReceipts, setPendingReceipts] = useState([
    { id: 1, name: "ABUBAKAR IBRAHIM", amount: "₦125,000", type: "Tuition" },
    { id: 2, name: "FATIMA SANI", amount: "₦45,000", type: "Exam Fees" },
  ]);

  const [budgets] = useState([
    { id: 1, category: "Infrastructure", planned: 5000000, actual: 1200000, color: "bg-blue-600" },
    { id: 2, category: "Academic Materials", planned: 2500000, actual: 2100000, color: "bg-orange-500" },
  ]);

  return (
    <div className="min-h-screen bg-[#fcfdfe] p-4 md:p-10 font-sans pb-20 relative text-left">
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-10 right-4 md:right-10 z-[100] bg-white border-l-4 border-emerald-500 shadow-2xl p-6 rounded-2xl flex items-center gap-5 animate-in slide-in-from-right duration-500 min-w-[300px]">
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><Bell size={20} className="animate-bounce" /></div>
          <div><p className="text-sm font-bold text-[#002147]">{toast}</p></div>
        </div>
      )}

      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black text-[#002147] uppercase tracking-tighter italic">Bursary Central</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 mt-2">
            <Activity size={14} className="text-emerald-500 animate-pulse"/> Treasury Control • 2026
          </p>
        </div>
        <button onClick={() => window.print()} className="bg-white h-14 w-14 rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm"><Printer size={22}/></button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: REQUEST & HISTORY */}
        <div className="lg:col-span-2 space-y-10">
            
            {/* REQUEST FORM */}
            <div className="bg-white p-8 lg:p-10 rounded-[50px] shadow-sm border border-emerald-100 bg-gradient-to-tr from-white to-emerald-50/30">
                <h2 className="text-xs font-black text-[#002147] uppercase tracking-[0.2em] flex items-center gap-3 mb-8">
                    <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600"><Send size={20}/></div>
                    Request Fund Approval
                </h2>
                <form onSubmit={handleRequestFunds} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">Title</label>
                        <input type="text" placeholder="e.g. Lab Chemicals" className="p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:ring-2 ring-emerald-500 font-bold text-xs" value={request.title} onChange={(e) => setRequest({...request, title: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">Amount (₦)</label>
                        <input type="number" placeholder="500000" className="p-4 bg-white rounded-2xl border border-slate-100 outline-none focus:ring-2 ring-emerald-500 font-bold text-xs" value={request.amount} onChange={(e) => setRequest({...request, amount: e.target.value})} />
                    </div>
                    <button type="submit" disabled={loading} className="md:col-span-2 py-5 bg-emerald-600 text-white rounded-[24px] font-black uppercase text-xs tracking-[0.2em] hover:bg-[#002147] transition-all flex items-center justify-center gap-3">
                        {loading ? "Sending..." : <><Send size={18}/> Send to Rector</>}
                    </button>
                </form>
            </div>

            {/* REQUEST HISTORY SECTION */}
            <div className="bg-white p-8 lg:p-10 rounded-[50px] shadow-sm border border-slate-100">
                <h2 className="text-xs font-black text-[#002147] uppercase tracking-[0.2em] flex items-center gap-3 mb-8">
                    <div className="p-3 bg-slate-100 rounded-2xl text-slate-600"><History size={20}/></div>
                    Approval Audit Trail
                </h2>
                <div className="space-y-4">
                    {requestHistory.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-6 bg-[#fcfdfe] rounded-3xl border border-slate-50">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${item.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : item.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {item.status === 'approved' ? <Check size={20}/> : item.status === 'rejected' ? <X size={20}/> : <Clock size={20}/>}
                                </div>
                                <div>
                                    <h4 className="text-[12px] font-black text-[#002147] uppercase">{item.title}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase italic">{item.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-[#002147]">₦{Number(item.amount).toLocaleString()}</p>
                                <p className={`text-[8px] font-black uppercase tracking-widest ${item.status === 'approved' ? 'text-emerald-500' : item.status === 'rejected' ? 'text-red-500' : 'text-amber-500'}`}>
                                    {item.status}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: BUDGET & VERIFICATION */}
        <div className="space-y-10">
            <div className="bg-white p-8 lg:p-10 rounded-[50px] shadow-sm border border-slate-100">
                <h2 className="text-xs font-black text-[#002147] uppercase tracking-[0.2em] mb-10 flex items-center gap-3 border-b pb-6">
                    <PieChart size={20} className="text-emerald-600"/> Student Payments
                </h2>
                <div className="space-y-6">
                    {pendingReceipts.map(r => (
                        <div key={r.id} className="flex justify-between items-center p-5 bg-[#fcfdfe] rounded-[30px] border border-slate-50 hover:border-emerald-200 transition-all">
                            <div>
                                <p className="text-[11px] font-black text-[#002147] uppercase">{r.name}</p>
                                <p className="text-[10px] font-bold text-emerald-600">{r.amount}</p>
                            </div>
                            <button className="h-10 w-10 bg-white text-emerald-600 rounded-xl border border-emerald-100 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><Check size={18}/></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AccountantDashboard;