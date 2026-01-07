import React, { useState } from "react";
import { db } from "../firebase";
import { 
  collection, addDoc, serverTimestamp, query, 
  where, getDocs, limit, orderBy 
} from "firebase/firestore";
import { getAuth, updatePassword } from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);

  // 1. REQUEST OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await addDoc(collection(db, "passwordResets"), {
        email: email.toLowerCase(),
        otp: generatedOTP,
        createdAt: serverTimestamp(),
        status: "pending"
      });
      alert("Verification code sent to your email.");
      setStep(2);
    } catch (error) {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  // 2. VERIFY OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const q = query(
        collection(db, "passwordResets"),
        where("email", "==", email.toLowerCase()),
        where("otp", "==", otp),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("OTP Verified! Now set your new password.");
        setStep(3);
      } else {
        alert("Invalid or expired OTP code.");
      }
    } catch (error) {
      alert("Verification failed: " + error.message);
    }
    setLoading(false);
  };

  // 3. RESET PASSWORD (Final Step)
  // Note: This requires the user to have a recent session or be handled via Admin SDK if using Firebase Auth
  const handleResetPassword = async (e) => {
    e.preventDefault();
    alert("System Security: Please contact Admin to finalize password update, or use Firebase Auth direct reset link.");
    // In a real-life production app, you would typically use Firebase Admin SDK via Cloud Functions 
    // to update passwords without the user being logged in.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc] p-6 text-left">
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 w-full max-w-md">
        <h2 className="font-black uppercase text-3xl mb-2 italic tracking-tighter text-[#0b121d]">Security Center</h2>
        
        {/* STEP 1: ENTER EMAIL */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Identity Verification</p>
            <input 
              type="email" placeholder="OFFICIAL EMAIL ADDRESS" 
              className="w-full p-5 bg-slate-50 rounded-2xl text-[11px] font-bold outline-none border border-transparent focus:border-red-500 transition-all"
              onChange={(e) => setEmail(e.target.value)} required
            />
            <button disabled={loading} className="w-full py-5 bg-red-600 text-white font-black uppercase text-[11px] rounded-2xl shadow-xl shadow-red-200 hover:bg-red-700 transition-all">
              {loading ? "Processing..." : "Request Reset Code"}
            </button>
          </form>
        )}

        {/* STEP 2: ENTER OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enter 6-Digit Code</p>
            <input 
              type="text" placeholder="000 000" 
              className="w-full p-6 text-center text-4xl font-black bg-slate-50 rounded-3xl tracking-[12px] outline-none border-2 border-dashed border-slate-200 focus:border-red-500"
              maxLength={6} onChange={(e) => setOtp(e.target.value)} required
            />
            <button disabled={loading} className="w-full py-5 bg-[#0b121d] text-white font-black uppercase text-[11px] rounded-2xl shadow-xl">
              {loading ? "Verifying..." : "Verify Security Code"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-[9px] font-black uppercase text-slate-400 text-center">Resend Code</button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Set New Password</p>
            <input 
              type="password" placeholder="NEW PASSWORD" 
              className="w-full p-5 bg-slate-50 rounded-2xl text-[11px] font-bold outline-none border border-transparent focus:border-emerald-500"
              onChange={(e) => setNewPassword(e.target.value)} required
            />
            <button className="w-full py-5 bg-emerald-600 text-white font-black uppercase text-[11px] rounded-2xl shadow-xl shadow-emerald-200">
              Update Credentials
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;