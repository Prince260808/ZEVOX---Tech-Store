import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheck, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const BACKEND = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace("/api", "");

export default function Signup() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ name:"", email:"", password:"", confirm:"" });
  const [showPw,  setShowPw]  = useState(false);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post("/auth/signup", { name: form.name, email: form.email, password: form.password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Registration failed. Try again." });
    } finally { setLoading(false); }
  };

  const FIELDS = [
    { name:"name",    label:"Full Name",        placeholder:"John Doe",         icon:FiUser, type:"text"     },
    { name:"email",   label:"Email",            placeholder:"you@example.com",  icon:FiMail, type:"email"    },
    { name:"password",label:"Password",         placeholder:"Min 6 characters", icon:FiLock, type:"password" },
    { name:"confirm", label:"Confirm Password", placeholder:"Repeat password",  icon:FiLock, type:"password" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-violet-50/40 to-indigo-50/30
      flex items-center justify-center px-4 py-10">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay:"2s" }} />
      </div>
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-2xl shadow-violet-100/50 border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 px-8 py-9 text-center relative overflow-hidden">
            {[70,120,170].map((s,i) => (
              <div key={i} className="absolute rounded-full border border-white/10"
                style={{ width:s, height:s, top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />
            ))}
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm
                flex items-center justify-center mx-auto mb-4 animate-float shadow-xl shadow-black/20">
                <FiShoppingCart className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-black text-white">Create Account</h1>
              <p className="text-indigo-200 text-sm mt-1.5">Join GuptaStore for exclusive deals</p>
            </div>
          </div>
          <div className="px-8 py-8 space-y-4">
            {success && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200
                text-emerald-700 rounded-xl px-4 py-3 text-sm animate-scale-in">
                <FiCheck className="flex-shrink-0 text-emerald-600" />
                Account created! Redirecting to login...
              </div>
            )}
            {errors.submit && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700
                rounded-xl px-4 py-3 text-sm animate-scale-in">
                <FiAlertCircle className="flex-shrink-0" /> {errors.submit}
              </div>
            )}
            <button type="button" onClick={() => window.location.href = `${BACKEND}/api/auth/google`}
              className="w-full flex items-center justify-center gap-3 py-3.5
                border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50
                hover:border-gray-300 transition-all duration-200 shadow-sm btn-press group">
              <FcGoogle className="text-xl" />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Sign up with Google</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-400 font-medium">OR WITH EMAIL</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {FIELDS.map(({ name, label, placeholder, icon: Icon, type }, i) => (
                <div key={name} className="animate-fade-in-up" style={{ animationDelay:`${i*60}ms` }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name={name}
                      type={(name==="password"||name==="confirm") ? (showPw?"text":"password") : type}
                      value={form[name]} onChange={handleChange} placeholder={placeholder}
                      autoComplete={type==="email"?"email":name==="name"?"name":"new-password"}
                      className={`w-full pl-10 pr-${name==="password"?"10":"4"} py-3 rounded-xl border text-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                        transition-all duration-200 bg-gray-50 focus:bg-white
                        ${errors[name]?"border-red-300 bg-red-50":"border-gray-200"}`} />
                    {name==="password" && (
                      <button type="button" onClick={() => setShowPw(p => !p)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                        {showPw ? <FiEyeOff /> : <FiEye />}
                      </button>
                    )}
                  </div>
                  {errors[name] && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <FiAlertCircle className="flex-shrink-0" /> {errors[name]}
                    </p>
                  )}
                </div>
              ))}
              {form.password && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(l => (
                      <div key={l} className={`h-1 flex-1 rounded-full transition-all duration-300
                        ${form.password.length >= l*2
                          ? l<=2?"bg-red-400":l===3?"bg-amber-400":"bg-emerald-500"
                          : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    {form.password.length<6?"Too short":form.password.length<8?"Fair":form.password.length<10?"Good":"Strong"}
                  </p>
                </div>
              )}
              <button type="submit" disabled={loading||success}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600
                  hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm
                  shadow-lg shadow-indigo-300/50 transition-all duration-200 flex items-center
                  justify-center gap-2 btn-press disabled:opacity-60 disabled:cursor-not-allowed">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</>
                  : <>Create Account <FiArrowRight /></>}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition">Sign in →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
