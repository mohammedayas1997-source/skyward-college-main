import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";

const News = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Zai kwaso bayanan da aka sanya wa category "News" kawai
    const q = query(
      collection(db, "newsfeed"), 
      where("category", "==", "News"), 
      orderBy("date", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 bg-red-600 rounded-2xl text-white shadow-lg">
            <Newspaper size={32} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[#002147] uppercase italic leading-none">Newsroom</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-2">Latest Updates from Skyward College</p>
          </div>
        </div>
        
        <div className="grid gap-8">
          {articles.length > 0 ? articles.map((item) => (
            <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col md:flex-row border border-slate-100 hover:shadow-xl transition-all duration-500 group">
              <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
              </div>
              <div className="p-8 md:p-12 md:w-2/3 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-red-600 font-black text-[10px] mb-4 uppercase tracking-widest bg-red-50 w-fit px-3 py-1 rounded-full">
                  <Calendar size={12} /> {item.date?.toDate().toDateString()}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-[#002147] uppercase mb-4 leading-tight group-hover:text-red-600 transition-colors">{item.title}</h2>
                <p className="text-slate-500 leading-relaxed mb-8 font-medium line-clamp-3">{item.content}</p>
                <button className="text-[#002147] font-black text-xs uppercase flex items-center gap-2 hover:gap-4 transition-all w-fit">
                  Read Full Story <ArrowRight size={18} className="text-red-600" />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase tracking-widest">No news updates available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;