import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
    const Base_URL = "https://localhost:7213/api/ForgetPassword";

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const onBackToLogin = ()=>navigate('/');
  
  const handleSendOtp =async()=>{
    if(!email) return setError("Email is required.");
    setError("");
    setLoading(true);
    try{
        const res = await axios.get(`${Base_URL}/forgetPassword`,{
            params:{email}});
            setOtpToken(res.data.otpToken);
            setStep(2);
    }catch(err){
        setError(err.reponse?.data?.message || "No account found with this email");
    }finally{
        setLoading(false);
    }
  };
  const handleVerifyOtp = async()=>{
if(!otp) return setError("Please enter OTP");
setError("");
setLoading(true);
try{
    await axios.post(`${Base_URL}/verify-post`,{
        otpToken,
        otp
    });
    setStep(3);
}catch(err){
    setError(err.reponse?.data?.message || "Invalid or expired OTP.");
}finally{
    setLoading(false);
}
  };
  const handleResetPassword = async()=>{
    if(!newPassword)return setError("Please enter new password");
    if(newPassword !== confirmPassword) return setError("Passwords do not match");
    setError("");
    setLoading(true);
    try{
        await axios.put(`${Base_URL}/reset`,{
            otpToken,
            otp,
            newPassword
        });
        setSuccess("Password reset successfully!");
        setTimeout(()=>onBackToLogin(),2000);
    }catch(err){
        setError(err.reponse?.data?.message || "Something went wrong")
    }finally{
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-800">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBackToLogin}
            className="text-gray-500 hover:text-orange-400 text-sm transition-colors mb-4 flex items-center gap-1"
          >
            ← Back to Login
          </button>
          <h2 className="text-white text-2xl font-semibold">Forgot Password</h2>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1 && "Enter your email to receive an OTP"}
            {step === 2 && `OTP sent to ${email}`}
            {step === 3 && "Set your new password"}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                ${step === s ? "bg-orange-400 text-white" :
                  step > s ? "bg-orange-400/30 text-orange-400" :
                  "bg-gray-800 text-gray-500"}`}>
                {step > s ? "✓" : s}
              </div>
              {s < 3 && (
                <div className={`h-px w-12 transition-colors
                  ${step > s ? "bg-orange-400/50" : "bg-gray-800"}`}
                />
              )}
            </div>
          ))}
          <span className="text-gray-500 text-xs ml-2">
            {step === 1 && "Verify Email"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "New Password"}
          </span>
        </div>

        {/* Error / Success messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-3 mb-4">
            {success}
          </div>
        )}

        {/* STEP 1 - Email */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                placeholder="Enter your email"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm border border-gray-700 focus:border-orange-400 focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-orange-400/50 text-white rounded-lg py-3 text-sm font-medium transition-colors"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 - OTP */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm border border-gray-700 focus:border-orange-400 focus:outline-none transition-colors tracking-widest text-center text-lg"
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-orange-400/50 text-white rounded-lg py-3 text-sm font-medium transition-colors"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              onClick={() => { setStep(1); setError(""); setOtp(""); }}
              className="w-full text-gray-500 hover:text-orange-400 text-sm transition-colors"
            >
              Resend OTP
            </button>
          </div>
        )}

        {/* STEP 3 - New Password */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm border border-gray-700 focus:border-orange-400 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                placeholder="Confirm new password"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-sm border border-gray-700 focus:border-orange-400 focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-orange-400/50 text-white rounded-lg py-3 text-sm font-medium transition-colors"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgetPassword