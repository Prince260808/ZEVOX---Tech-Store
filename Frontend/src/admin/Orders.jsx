import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  FiShoppingBag, FiSearch, FiChevronDown, FiEye,
  FiPackage, FiTruck, FiCheck, FiX, FiClock, FiFilter
} from "react-icons/fi";

const STATUS_CONFIG = {
  Placed:     { label: "Placed",     color: "bg-amber-50 text-amber-700 border-amber-200",    dot: "bg-amber-500",    icon: FiClock },
  Processing: { label: "Processing", color: "bg-blue-50 text-blue-700 border-blue-200",       dot: "bg-blue-500",     icon: FiPackage },
  Shipped:    { label: "Shipped",    color: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-500",   icon: FiTruck },
  Delivered:  { label: "Delivered",  color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", icon: FiCheck },
  Cancelled:  { label: "Cancelled",  color: "bg-red-50 text-red-700 border-red-200",          dot: "bg-red-500",      icon: FiX },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Placed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function OrderDetailModal({ order, onClose, onStatusUpdate }) {
  const [updating, setUpdating] = useState(false);
  if (!order) return null;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/order/${order._id}/status`, { status: newStatus });
      onStatusUpdate(order._id, newStatus);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">Order Details</h3>
            <p className="text-xs text-gray-400 mt-0.5">#{order._id?.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <FiX className="text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Status</span>
            <div className="flex items-center gap-2">
              <StatusBadge status={order.status || "Placed"} />
              <select
                defaultValue={order.status || "Placed"}
                onChange={e => handleStatusChange(e.target.value)}
                disabled={updating}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
              >
                {Object.keys(STATUS_CONFIG).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          {order.address && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shipping To</p>
              <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 space-y-0.5">
                <p className="font-semibold">{order.address.fullName || order.address.name} · {order.address.phone}</p>
                <p>{order.address.addressLine || order.address.addressLine1}</p>
                <p>{order.address.city}, {order.address.state} – {order.address.pincode}</p>
              </div>
            </div>
          )}

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Items</p>
            <div className="space-y-2">
              {(order.items || []).map((item, i) => {
                const product = item.productId || {};
                return (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                      <img src={product.image} alt={product.title}
                        className="w-full h-full object-contain p-0.5"
                        onError={e => { e.target.style.display = "none"; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{product.title || "Product"}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                      ₹{((item.price || product.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-4">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="text-xl font-black text-indigo-600">₹{(order.totalAmount || 0).toLocaleString()}</span>
          </div>

          {/* Payment */}
          <div className="flex justify-between text-sm text-gray-600">
            <span>Payment Method</span>
            <span className="font-medium capitalize">{order.paymentMethod || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    setSelectedOrder(prev => prev?._id === orderId ? { ...prev, status: newStatus } : prev);
  };

  useEffect(() => {
    api.get("/order")
      .then(res => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o => {
    const matchStatus = !statusFilter || (o.status || "Placed") === statusFilter;
    const matchSearch = !search ||
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      (o.address?.fullName || o.address?.name || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const statusCounts = orders.reduce((acc, o) => {
    const s = o.status || "Placed";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: "Total Orders", value: orders.length, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Placed", value: statusCounts.Placed || 0, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Delivered", value: statusCounts.Delivered || 0, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} total orders</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl px-4 py-3`}>
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-xl font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or customer name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-white text-gray-700 w-full sm:w-44">
            <option value="">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-32 flex-1" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-6 bg-gray-200 rounded-full w-20" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-14 text-center">
          <FiShoppingBag className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No orders found</p>
          <p className="text-gray-400 text-sm mt-1">Orders will appear here once customers start purchasing</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/70">
            {["Order ID", "Customer", "Amount", "Status", "Action"].map(h => (
              <span key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map(order => (
              <div key={order._id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-gray-50/70 transition">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono font-semibold text-gray-800">
                    #{order._id?.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {order.address?.fullName || order.address?.name || "Customer"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{order.address?.city || "—"}</p>
                </div>
                <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                  ₹{(order.totalAmount || 0).toLocaleString()}
                </p>
                <div className="flex-shrink-0">
                  <StatusBadge status={order.status || "Placed"} />
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100
                    flex items-center justify-center text-indigo-600 transition flex-shrink-0">
                  <FiEye className="text-sm" />
                </button>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500">
            Showing {filtered.length} of {orders.length} orders
          </div>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusUpdate={handleStatusUpdate} />
      )}
    </div>
  );
}
