import React, { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ImageIcon, PlusCircle, 
  Loader2, AlertCircle, CheckCircle2 
} from "lucide-react";

const NewsAdmin = () => {
  const [activeTab, setActiveTab] = useState("news"); 
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  
  const navigate = useNavigate();

  // 1. SECURITY CHECK (Real-life usage)
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      const role = localStorage.getItem("userRole");
      if (!user || (role !== "news_admin" && role !== "admin")) {
        navigate("/portal/login");
      }
    });
    return () => unsubAuth();
  }, [navigate]);

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // VALIDATION
    if (!file) return setStatusMsg({ type: "error", text: "Please select an image first!" });
    if (activeTab === "news" && (!title || !content)) {
      return setStatusMsg({ type: "error", text: "Title and Content are required for news!" });
    }

    setUploading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const storagePath = activeTab === "news" 
        ? `news/${Date.now()}_${file.name}` 
        : `gallery/${Date.now()}_${file.name}`;
      
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(p));
        },
        (error) => {
          console.error(error);
          setStatusMsg({ type: "error", text: "Upload failed: " + error.message });
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          const collectionRef = collection(db, activeTab === "news" ? "news" : "gallery");
          const data = activeTab === "news" 
            ? { 
                title, 
                content, 
                imageUrl: downloadURL, 
                createdAt: serverTimestamp(),
                author: auth.currentUser?.email || "Admin"
              } 
            : { 
                imageUrl: downloadURL, 
                createdAt: serverTimestamp(),
                uploadedBy: auth.currentUser?.email || "Admin"
              };

          await addDoc(collectionRef, data);
          
          setUploading(false);
          setFile(null);
          setTitle("");
          setContent("");
          setProgress(0);
          setStatusMsg({ 
            type: "success", 
            text: `${activeTab === 'news' ? 'News article' : 'Gallery photo'} published successfully!` 
          });

          // Clear success message after 3 seconds
          setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
        }
      );
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message });
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-10 font-sans text-[#002147]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Dashboard */}
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-3 rounded-2xl text-white">
              <LayoutDashboard size={30} />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black uppercase tracking-tighter">Content Manager</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Skyward College Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6 bg-slate-200 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => { setActiveTab("news"); setStatusMsg({type:"", text:""}); }}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === "news" ? "bg-white text-red-600 shadow-sm" : "text-slate-500 hover:bg-white/50"}`}
          >
            News & Updates
          </button>
          <button 
            onClick={() => { setActiveTab("gallery"); setStatusMsg({type:"", text:""}); }}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === "gallery" ? "bg-white text-red-600 shadow-sm" : "text-slate-500 hover:bg-white/50"}`}
          >
            Campus Gallery
          </button>
        </div>

        {/* Status Messages */}
        {statusMsg.text && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 font-bold text-xs uppercase animate-bounce ${statusMsg.type === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
            {statusMsg.type === "success" ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
            {statusMsg.text}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100 text-left">
          <form onSubmit={handleUpload} className="space-y-6">
            
            {activeTab === "news" && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">News Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter headline..." 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-red-600 focus:ring-1 ring-red-600 font-bold transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">News Body</label>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write details here..." 
                    rows="5"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-red-600 focus:ring-1 ring-red-600 font-bold transition-all"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Image Upload Area */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">
                {activeTab === "news" ? "Feature Image" : "Gallery Photo"}
              </label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-10 hover:border-red-400 transition-colors group bg-slate-50/50">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-red-600">
                  <ImageIcon size={40} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {file ? file.name : "Tap to select image (JPG, PNG)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-red-600">
                  <span>Uploading Data...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full transition-all duration-300 shadow-lg shadow-red-500/50" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            <button 
              disabled={uploading}
              className={`w-full py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 ${uploading ? "bg-slate-300 cursor-not-allowed text-slate-500" : "bg-[#002147] text-white hover:bg-red-600 active:scale-95"}`}
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={18}/> Processing...
                </>
              ) : (
                <>
                  <PlusCircle size={18}/> Publish to {activeTab}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsAdmin;