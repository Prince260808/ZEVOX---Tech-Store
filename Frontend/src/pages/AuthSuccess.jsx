import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("Signing you in with Google...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token  = params.get("token");
    const userId = params.get("userId");
    const role   = params.get("role") || "user";
    const name   = params.get("name");
    const error  = params.get("error");

    if (error || !token || token === "undefined" || !userId) {
      setStatus("Authentication failed. Redirecting...");
      setTimeout(() => navigate("/login?error=auth_failed"), 1500);
      return;
    }

    localStorage.setItem("token",  token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role",   role);
    if (name) localStorage.setItem("name", decodeURIComponent(name));

    setStatus("Login successful! Redirecting...");
    setTimeout(() => navigate(role === "admin" ? "/admin" : "/"), 800);
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600
          flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-300 animate-float">
          <FiShoppingCart className="text-white text-3xl" />
        </div>
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">GuptaStore</h2>
        <p className="text-gray-500 text-sm">{status}</p>
        <div className="flex justify-center gap-1.5 mt-5">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
