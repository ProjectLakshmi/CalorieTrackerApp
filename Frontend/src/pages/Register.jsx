import { useState } from "react";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    try {
      await axios.post("https://localhost:7213/api/register", {
        email, password, weight, height, age,
      });
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const filledSections = [
    !!email,
    !!password,
    !!(height || weight || age),
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(99,255,180,0.12)_0%,transparent_70%)] -top-24 -left-24 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(99,160,255,0.10)_0%,transparent_70%)] -bottom-20 -right-20 pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-[420px] bg-white/[0.04] border border-white/[0.08] rounded-[28px] px-10 py-11 backdrop-blur-xl shadow-[0_40px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]">

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[rgba(99,255,180,0.1)] border border-[rgba(99,255,180,0.2)] text-[#63ffb4] text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#63ffb4] animate-pulse" />
          Calorie Tracker
        </div>

        {/* Heading */}
        <h1 className="text-white text-3xl font-bold leading-tight mb-1">
          Start your{" "}
          <span className="bg-gradient-to-r from-[#63ffb4] to-[#63a0ff] bg-clip-text text-transparent">
            journey
          </span>
        </h1>
        <p className="text-white/40 text-sm mb-7">Track calories, reach your goals.</p>

        {/* Progress bars */}
        <div className="flex gap-1 mb-7">
          {filledSections.map((filled, i) => (
            <div
              key={i}
              className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${filled
                  ? "bg-gradient-to-r from-[#63ffb4] to-[#63a0ff]"
                  : "bg-white/[0.08]"
                }`}
            />
          ))}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5 mb-3">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/35">
            ✉️ Email
          </label>
          <input
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm font-medium px-3.5 py-3 outline-none placeholder:text-white/20 focus:border-[rgba(99,255,180,0.4)] focus:bg-[rgba(99,255,180,0.04)] focus:ring-2 focus:ring-[rgba(99,255,180,0.08)] transition-all"
            type="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-white/35">
            🔒 Password
          </label>
          <div className="relative">
            <input
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm font-medium px-3.5 py-3 pr-11 outline-none placeholder:text-white/20 focus:border-[rgba(99,255,180,0.4)] focus:bg-[rgba(99,255,180,0.04)] focus:ring-2 focus:ring-[rgba(99,255,180,0.08)] transition-all"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[10px] text-white/20 tracking-widest uppercase">Body stats</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Body stats — 3 col grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            { label: "📏 Height", placeholder: "175", unit: "cm", setter: setHeight },
            { label: "⚖️ Weight", placeholder: "70", unit: "kg", setter: setWeight },
            { label: "🎂 Age", placeholder: "25", unit: "yr", setter: setAge },
          ].map(({ label, placeholder, unit, setter }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold tracking-widest uppercase text-white/35">
                {label}
              </label>
              <div className="relative">
                <input
                  className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm font-medium px-3 py-3 pr-8 outline-none placeholder:text-white/20 focus:border-[rgba(99,255,180,0.4)] focus:bg-[rgba(99,255,180,0.04)] focus:ring-2 focus:ring-[rgba(99,255,180,0.08)] transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  placeholder={placeholder}
                  onChange={(e) => setter(e.target.value)}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-white/25 pointer-events-none">
                  {unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3.5 rounded-[14px] bg-gradient-to-r from-[#63ffb4] to-[#63d4ff] text-[#0a0a0f] text-[15px] font-bold tracking-wide shadow-[0_8px_24px_rgba(99,255,180,0.25)] hover:shadow-[0_12px_32px_rgba(99,255,180,0.35)] hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-[rgba(10,10,15,0.3)] border-t-[#0a0a0f] rounded-full animate-spin" />
              Creating account…
            </>
          ) : (
            "Create Account →"
          )}
        </button>

        {/* Footer */}
        <p className="text-center mt-5 text-[13px] text-white/30">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-[#63ffb4] font-semibold cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;

