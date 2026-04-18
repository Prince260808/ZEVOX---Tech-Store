import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  FiTrendingUp, FiDollarSign, FiShoppingCart, FiPackage,
  FiArrowUp, FiArrowDown, FiUsers
} from "react-icons/fi";

// Simple bar chart using pure CSS/SVG
function BarChart({ data, color = "#6366f1" }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-lg transition-all duration-700"
            style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color, opacity: 0.7 + (i / data.length) * 0.3 }}
          />
          <span className="text-xs text-gray-400 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// Donut chart using SVG
function DonutChart({ segments, size = 120 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const r = 45;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circ;
        const gap = circ - dash;
        const el = (
          <circle
            key={i}
            cx="50" cy="50" r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="10"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        );
        offset += dash;
        return el;
      })}
      <text x="50" y="46" textAnchor="middle" className="text-xs" style={{ fontSize: 10, fontWeight: 700, fill: "#111827" }}>
        {total}
      </text>
      <text x="50" y="58" textAnchor="middle" style={{ fontSize: 7, fill: "#9ca3af" }}>total</text>
    </svg>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Analytics() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products").then(r => r.data || []).catch(() => []),
      api.get("/order").then(r => r.data || []).catch(() => []),
    ]).then(([p, o]) => {
      setProducts(p);
      setOrders(o);
    }).finally(() => setLoading(false));
  }, []);

  // Derived stats
  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const avgOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  // Orders by month (last 6)
  const now = new Date();
  const monthlyOrders = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const count = orders.filter(o => {
      const od = new Date(o.createdAt);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    }).length;
    return { label: MONTHS[d.getMonth()], value: count };
  });

  // Revenue by month
  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const rev = orders
      .filter(o => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      })
      .reduce((s, o) => s + (o.totalAmount || 0), 0);
    return { label: MONTHS[d.getMonth()], value: Math.round(rev / 1000) }; // in thousands
  });

  // Category distribution
  const catMap = {};
  products.forEach(p => { const c = p.category || "Other"; catMap[c] = (catMap[c] || 0) + 1; });
  const catColors = ["#6366f1", "#10b981", "#f97316", "#f43f5e", "#8b5cf6", "#06b6d4"];
  const catSegments = Object.entries(catMap).map(([name, value], i) => ({
    name, value, color: catColors[i % catColors.length]
  }));

  // Order status distribution
  const statusMap = {};
  orders.forEach(o => { const s = o.status || "pending"; statusMap[s] = (statusMap[s] || 0) + 1; });
  const statusColors = { Placed: "#f59e0b", Processing: "#3b82f6", Shipped: "#6366f1", Delivered: "#10b981", Cancelled: "#ef4444" };
  const statusSegments = Object.entries(statusMap).map(([name, value]) => ({
    name, value, color: statusColors[name] || "#9ca3af"
  }));

  // Top products by price (placeholder for "revenue")
  const topProducts = [...products].sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 5);

  const statCards = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", iconColor: "text-emerald-600", change: "+12%" },
    { label: "Total Orders", value: orders.length, icon: FiShoppingCart, color: "from-indigo-500 to-violet-600", bg: "bg-indigo-50", iconColor: "text-indigo-600", change: "+8%" },
    { label: "Total Products", value: products.length, icon: FiPackage, color: "from-orange-500 to-amber-500", bg: "bg-orange-50", iconColor: "text-orange-600", change: "+5%" },
    { label: "Avg. Order Value", value: `₹${avgOrderValue.toLocaleString()}`, icon: FiTrendingUp, color: "from-rose-500 to-pink-600", bg: "bg-rose-50", iconColor: "text-rose-600", change: "+3%" },
  ];

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-8 bg-gray-200 rounded w-40 animate-pulse" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-gray-100" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1,2].map(i => <div key={i} className="bg-white rounded-2xl h-56 animate-pulse border border-gray-100" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Store performance overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100
              hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center
                group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className={`text-xl ${s.iconColor}`} />
              </div>
              <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                <FiArrowUp className="text-xs" /> {s.change}
              </span>
            </div>
            <p className="text-gray-500 text-xs font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Orders */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-800">Orders Trend</h3>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">
              {orders.length} total
            </span>
          </div>
          <BarChart data={monthlyOrders} color="#6366f1" />
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-800">Revenue Trend</h3>
              <p className="text-xs text-gray-400 mt-0.5">In thousands (₹K) · Last 6 months</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-medium">
              ₹{Math.round(totalRevenue / 1000)}K
            </span>
          </div>
          <BarChart data={monthlyRevenue} color="#10b981" />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category Donut */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-5">Product Categories</h3>
          {catSegments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No data yet</p>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <DonutChart segments={catSegments} />
              <div className="w-full space-y-2">
                {catSegments.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-gray-700 capitalize">{name}</span>
                    </div>
                    <span className="text-gray-500 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-5">Order Status</h3>
          {statusSegments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No orders yet</p>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <DonutChart segments={statusSegments} />
              <div className="w-full space-y-2">
                {statusSegments.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-gray-700 capitalize">{name}</span>
                    </div>
                    <span className="text-gray-500 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-5">Top Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No products yet</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p._id} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-gray-50 text-gray-400"}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400 capitalize">{p.category}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                    ₹{p.price?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
