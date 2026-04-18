import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCheckCircle, FiHome, FiPackage, FiArrowRight } from "react-icons/fi";

export default function OrderSuccess() {
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 100);
    const t2 = setTimeout(() => setConfetti(false), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const PIECES = Array.from({ length: 18 }, (_, i) => ({
    color: ["bg-indigo-400","bg-violet-400","bg-pink-400","bg-emerald-400","bg-amber-400"][i % 5],
    left:  `${(i * 5.5) % 100}%`,
    delay: `${i * 0.12}s`,
    duration: `${1.2 + (i % 4) * 0.3}s`,
  }));

  const STEPS = [
    { icon:"📦", label:"Processing", desc:"Order confirmed"   },
    { icon:"🚚", label:"Shipping",   desc:"Within 24 hrs"     },
    { icon:"🏠", label:"Delivery",   desc:"3–5 business days" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-emerald-50 via-white to-indigo-50/30
      flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {confetti && PIECES.map((p, i) => (
        <div key={i} className={`absolute top-0 w-2 h-2 rounded-sm ${p.color} opacity-80`}
          style={{ left:p.left, animation:`confettiFall ${p.duration} ${p.delay} ease-in forwards` }} />
      ))}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay:"1.5s" }} />

      <div className={`w-full max-w-md text-center transition-all duration-700 ${show?"opacity-100 translate-y-0":"opacity-0 translate-y-10"}`}>
        {/* Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          {[1,2,3].map(r => (
            <div key={r} className="absolute rounded-full border-2 border-emerald-300/30 animate-ping"
              style={{ width:56+r*32, height:56+r*32, animationDelay:`${r*200}ms`, animationDuration:"2s" }} />
          ))}
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600
            flex items-center justify-center shadow-2xl shadow-emerald-300/50 animate-scale-in">
            <FiCheckCircle className="text-white text-6xl" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 animate-fade-in-up">Order Placed! 🎉</h1>
        <p className="text-gray-500 text-base mb-2 animate-fade-in-up delay-100">Your order has been confirmed successfully.</p>
        {id && id !== "success" && (
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 mb-6 animate-fade-in-up delay-150">
            <span className="text-xs text-gray-500">Order ID:</span>
            <span className="font-mono font-bold text-gray-800 text-sm">#{id.slice(-8).toUpperCase()}</span>
          </div>
        )}

        {/* Steps */}
        <div className="flex items-center justify-center gap-0 mb-8 animate-fade-in-up delay-200">
          {STEPS.map(({ icon, label, desc }, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-emerald-200 shadow-md
                  flex items-center justify-center text-2xl mb-2 hover:scale-110 transition-transform duration-200">
                  {icon}
                </div>
                <p className="text-xs font-bold text-gray-800">{label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
              </div>
              {i < STEPS.length - 1 && <div className="w-8 sm:w-12 h-0.5 bg-emerald-200 mx-1 sm:mx-2 flex-shrink-0 mb-7" />}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-300">
          <Link to="/"
            className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-gray-200
              rounded-2xl text-gray-700 text-sm font-bold hover:bg-gray-50 hover:border-gray-300
              transition-all duration-200 btn-press">
            <FiHome /> Back to Home
          </Link>
          <Link to="/"
            className="flex-1 flex items-center justify-center gap-2 py-4
              bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700
              text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-300/40
              transition-all duration-200 hover:-translate-y-0.5 btn-press">
            <FiPackage /> Shop More <FiArrowRight className="text-xs" />
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-6 animate-fade-in-up delay-400">
          Confirmation will be sent to your registered email.
        </p>
      </div>

      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
