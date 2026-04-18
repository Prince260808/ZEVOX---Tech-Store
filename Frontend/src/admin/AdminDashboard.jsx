import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  FiPackage, FiTrendingUp, FiShoppingCart, FiDollarSign,
  FiArrowUp, FiArrowRight, FiChevronLeft, FiChevronRight,
  FiStar, FiEye, FiPlus
} from "react-icons/fi";

// Animated number counter
function CountUp({ end, prefix = "", suffix = "", duration = 1500 }) {
  const [count, setCount] = useState(0);
  useEffect(() => { 
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// Mini Sparkline SVG
function Sparkline({ data, color = "#6366f1" }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STAT_CARDS = [
  {
    label: "Total Products",
    icon: FiPackage,
    color: "from-indigo-500 to-violet-600",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    spark: [12, 18, 14, 22, 19, 28, 30],
    sparkColor: "#6366f1",
  },
  {
    label: "Total Revenue",
    icon: FiDollarSign,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    spark: [40, 55, 48, 70, 65, 80, 92],
    sparkColor: "#10b981",
  },
  {
    label: "Orders",
    icon: FiShoppingCart,
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
    spark: [8, 12, 10, 15, 13, 18, 20],
    sparkColor: "#f97316",
  },
  {
    label: "Growth",
    icon: FiTrendingUp,
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
    spark: [5, 8, 6, 11, 9, 14, 16],
    sparkColor: "#f43f5e",
  },
];

const CATEGORIES = ["Electronics", "Laptops", "Mobiles", "Tablets", "Accessories"];
const CAT_COLORS = ["bg-indigo-500", "bg-emerald-500", "bg-orange-500", "bg-rose-500", "bg-violet-500"];

// Hero Slider
const SLIDES = [
  {
    title: "Manage Your Store",
    subtitle: "Add, edit & track all your products in one place",
    gradient: "from-indigo-600 to-violet-700",
    icon: "🛍️",
    action: { label: "Add Product", to: "/admin/products/add" },
  },
  {
    title: "Track Orders & Revenue",
    subtitle: "Monitor sales performance and customer orders effortlessly",
    gradient: "from-emerald-600 to-teal-700",
    icon: "📊",
    action: { label: "View Products", to: "/admin/products" },
  },
  {
    title: "Grow Your Business",
    subtitle: "Insights and analytics to drive smarter decisions",
    gradient: "from-rose-500 to-orange-600",
    icon: "🚀",
    action: { label: "View Store", to: "/" },
  },
];

function HeroSlider() {
  const [active, setActive] = useState(0);
  const timer = useRef(null);

  const go = (idx) => {
    setActive((idx + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    timer.current = setInterval(() => go(active + 1), 4000);
    return () => clearInterval(timer.current);
  }, [active]);

  const slide = SLIDES[active];

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${slide.gradient}
      text-white shadow-xl mb-6 transition-all duration-500`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/20 blur-2xl" />
        {[...Array(8)].map((_, i) => (
          <div key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: 20 + i * 15,
              height: 20 + i * 15,
              top: `${10 + i * 8}%`,
              right: `${5 + i * 3}%`,
              opacity: 0.3 - i * 0.03,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 gap-4 min-h-[160px]">
        <div className="flex-1">
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">
            Admin Dashboard
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            {slide.title}
          </h2>
          <p className="text-white/80 mt-2 text-sm sm:text-base max-w-md">
            {slide.subtitle}
          </p>
          <Link
            to={slide.action.to}
            className="inline-flex items-center gap-2 mt-4 bg-white/20 hover:bg-white/30
              border border-white/30 text-white text-sm font-semibold
              px-5 py-2.5 rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            {slide.action.label} <FiArrowRight />
          </Link>
        </div>
        <div className="text-6xl sm:text-8xl select-none opacity-90 flex-shrink-0">
          {slide.icon}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className={`rounded-full transition-all duration-300
              ${i === active ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/60"}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button onClick={() => go(active - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
          bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center
          text-white transition border border-white/20">
        <FiChevronLeft />
      </button>
      <button onClick={() => go(active + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
          bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center
          text-white transition border border-white/20">
        <FiChevronRight />
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then(r => setProducts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = products.reduce((s, p) => s + (p.price || 0), 0);
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const avgPrice = products.length ? Math.round(totalRevenue / products.length) : 0;

  const stats = [
    { ...STAT_CARDS[0], value: products.length, suffix: " items" },
    { ...STAT_CARDS[1], value: totalRevenue, prefix: "₹" },
    { ...STAT_CARDS[2], value: totalStock, suffix: " units" },
    { ...STAT_CARDS[3], value: 24, suffix: "%" },
  ];

  // Category distribution
  const catMap = {};
  products.forEach(p => {
    const c = p.category || "Other";
    catMap[c] = (catMap[c] || 0) + 1;
  });
  const catEntries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

  const recent = [...products].slice(-6).reverse();

  return (
    <div className="space-y-6">
      {/* Slider */}
      <HeroSlider />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100
              hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center
                group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className={`text-xl ${s.iconColor}`} />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                <FiArrowUp className="text-xs" /> 12%
              </div>
            </div>
            <p className="text-gray-500 text-xs font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? (
                <span className="inline-block w-16 h-7 bg-gray-200 rounded animate-pulse" />
              ) : (
                <CountUp end={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} />
              )}
            </p>
            <div className="mt-3 opacity-70 group-hover:opacity-100 transition-opacity">
              <Sparkline data={s.spark} color={s.sparkColor} />
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category Distribution */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800">Categories</h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              {catEntries.length} types
            </span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : catEntries.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No categories yet</p>
          ) : (
            <div className="space-y-3">
              {catEntries.map(([cat, count], i) => {
                const pct = Math.round((count / products.length) * 100);
                const colors = ["bg-indigo-500", "bg-emerald-500", "bg-orange-500", "bg-rose-500", "bg-violet-500"];
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium capitalize">{cat}</span>
                      <span className="text-gray-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Add Product", icon: "📦", to: "/admin/products/add", color: "from-indigo-50 to-violet-50 border-indigo-100 hover:border-indigo-300" },
              { label: "View Products", icon: "🗂️", to: "/admin/products", color: "from-emerald-50 to-teal-50 border-emerald-100 hover:border-emerald-300" },
              { label: "View Store", icon: "🏪", to: "/", color: "from-orange-50 to-amber-50 border-orange-100 hover:border-orange-300" },
              { label: "Analytics", icon: "📈", to: "/admin/analytics", color: "from-rose-50 to-pink-50 border-rose-100 hover:border-rose-300" },
              { label: "Customers", icon: "👥", to: "/admin/customers", color: "from-sky-50 to-blue-50 border-sky-100 hover:border-sky-300" },
              { label: "Settings", icon: "⚙️", to: "/admin/settings", color: "from-gray-50 to-slate-50 border-gray-100 hover:border-gray-300" },
            ].map(({ label, icon, to, color }) => (
              <Link key={to} to={to}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border bg-gradient-to-br
                  ${color} transition-all duration-200 hover:shadow-sm group`}>
                <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
                <span className="text-xs font-semibold text-gray-700">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Recent Products</h3>
          <Link to="/admin/products"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
            View All <FiArrowRight className="text-xs" />
          </Link>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-5xl mb-3">📦</p>
            <p className="text-gray-500 mb-4">No products yet</p>
            <Link to="/admin/products/add"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white
                px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
              <FiPlus /> Add First Product
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map((p) => (
              <div key={p._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/70 transition">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={p.image} alt={p.title}
                    className="w-full h-full object-contain p-1"
                    onError={e => { e.target.style.display = "none"; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400 capitalize">{p.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">₹{p.price?.toLocaleString()}</p>
                  <p className={`text-xs font-medium ${p.stock > 10 ? "text-emerald-600" : p.stock > 0 ? "text-orange-500" : "text-red-500"}`}>
                    {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                  </p>
                </div>
                <Link to={`/admin/products/update/${p._id}`}
                  className="ml-2 w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100
                    flex items-center justify-center text-indigo-600 transition flex-shrink-0">
                  <FiEye className="text-sm" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
