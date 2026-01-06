import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Image as ImageIcon } from "lucide-react";

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Tambayar Firebase: Kawo hotuna kawai wadanda category dinsu "Gallery" ne
    const q = query(collection(db, "newsfeed"), where("category", "==", "Gallery"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#002147] uppercase italic tracking-tighter">Campus Life Gallery</h2>
          <div className="w-20 h-1.5 bg-red-600 mx-auto mt-4"></div>
        </div>

        {images.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((img) => (
              <div key={img.id} className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg">
                <img src={img.imageUrl} alt={img.title} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                   <p className="text-white font-bold text-xs uppercase">{img.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem]">
            <ImageIcon className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for Admin to upload photos...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;