import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const BACKEND = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const authError = new URLSearchParams(location.search).get("error");

  const [form,    setForm]    = useState({ email: "", password: "" });
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState(authError === "auth_failed" ? "Google sign-in failed. Try again." : "");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res   = await api.post("/auth/login", form);
      const token = res.data.token;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId  = payload.id || payload._id || payload.userId || payload.sub;
      const role    = res.data.role || res.data.user?.role || payload.role || "user";
      localStorage.setItem("token",  token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role",   role);
      if (res.data.user?.name) localStorage.setItem("name", res.data.user.name);
      navigate(role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30
      flex items-center justify-center px-4 py-10">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      </div>
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 px-8 py-9 text-center relative overflow-hidden">
            {[80,120,160].map((s,i) => (
              <div key={i} className="absolute rounded-full border border-white/10"
                style={{ width:s, height:s, top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />
            ))}
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm
                flex items-center justify-center mx-auto mb-4 animate-float shadow-xl shadow-black/20">
                <FiShoppingCart className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-black text-white">Welcome Back</h1>
              <p className="text-indigo-200 text-sm mt-1.5">Sign in to your GuptaStore account</p>
            </div>
          </div>
          {/* Form */}
          <div className="px-8 py-8 space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700
                rounded-xl px-4 py-3 text-sm animate-scale-in">
                <FiAlertCircle className="flex-shrink-0" /> {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="animate-fade-in-up delay-100">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com" autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200
                      focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                      text-sm transition-all duration-200 bg-gray-50 focus:bg-white" />
                </div>
              </div>
              <div className="animate-fade-in-up delay-150">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="password" type={showPw ? "text" : "password"} value={form.password}
                    onChange={handleChange} placeholder="••••••••" autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200
                      focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                      text-sm transition-all duration-200 bg-gray-50 focus:bg-white" />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showPw ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600
                  hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-bold text-sm
                  shadow-lg shadow-indigo-300/50 transition-all duration-200 flex items-center
                  justify-center gap-2 btn-press disabled:opacity-60 disabled:cursor-not-allowed
                  animate-fade-in-up delay-200">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
                ) : (
                  <>Sign In <FiArrowRight /></>
                )}
              </button>
            </form>
            <div className="flex items-center gap-3">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-400 font-medium">OR CONTINUE WITH</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>
            <button type="button" onClick={() => window.location.href = `${BACKEND}/api/auth/google`}
              className="w-full flex items-center justify-center gap-3 py-3.5
                border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50
                hover:border-gray-300 transition-all duration-200 shadow-sm btn-press group">
              <FcGoogle className="text-xl" />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition">
                Continue with Google
              </span>
            </button>
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 transition">
                Create one free →
              </Link>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 animate-fade-in-up delay-300">
          {["🔒 Secure", "⚡ Instant", "🛡️ Protected"].map(b => (
            <span key={b} className="text-xs text-gray-400 font-medium">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
