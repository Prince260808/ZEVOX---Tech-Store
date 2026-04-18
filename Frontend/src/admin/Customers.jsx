import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  FiSearch, FiUsers, FiUser, FiMail, FiCalendar,
  FiShoppingBag, FiChevronDown, FiX, FiEye
} from "react-icons/fi";

function CustomerModal({ customer, onClose }) {
  if (!customer) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Customer Details</h3>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <FiX className="text-gray-600" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600
              flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {(customer.name || customer.email || "U")[0].toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{customer.name || "No Name"}</p>
              <p className="text-sm text-gray-500">{customer.email}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold
                ${customer.role === "admin" ? "bg-violet-100 text-violet-700" : "bg-indigo-100 text-indigo-700"}`}>
                {customer.role || "user"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Member Since", value: new Date(customer.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
              { label: "Orders", value: customer.orderCount ?? "—" },
              { label: "Total Spent", value: customer.totalSpent ? `₹${customer.totalSpent.toLocaleString()}` : "—" },
              { label: "Status", value: "Active" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-bold text-gray-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    api.get("/users")
      .then(res => setCustomers(res.data || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers
    .filter(c =>
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const stats = [
    { label: "Total Customers", value: customers.length, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Admins", value: customers.filter(c => c.role === "admin").length, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Regular Users", value: customers.filter(c => c.role !== "admin").length, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "New This Month", value: customers.filter(c => {
      const d = new Date(c.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-0.5">{customers.length} registered users</p>
      </div>

      {/* Stats */}
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
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
          />
        </div>
        <div className="relative">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-white text-gray-700 w-full sm:w-44">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">By Name</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
              <div className="h-6 bg-gray-200 rounded-full w-16" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-14 text-center">
          <FiUsers className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No customers found</p>
          <p className="text-gray-400 text-sm mt-1">Customers will appear here once they register</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/70">
            {["", "Name", "Email", "Role", "Action"].map(h => (
              <span key={h} className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map(customer => (
              <div key={customer._id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-gray-50/70 transition">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600
                  flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow">
                  {(customer.name || customer.email || "U")[0].toUpperCase()}
                </div>
                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{customer.name || "No Name"}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <FiCalendar className="text-xs" />
                    Joined {new Date(customer.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                {/* Email */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 flex items-center gap-1.5 truncate">
                    <FiMail className="text-gray-400 flex-shrink-0 text-xs" />
                    {customer.email}
                  </p>
                </div>
                {/* Role */}
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0
                  ${customer.role === "admin"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-gray-100 text-gray-600"}`}>
                  {customer.role || "user"}
                </span>
                {/* Action */}
                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100
                    flex items-center justify-center text-indigo-600 transition flex-shrink-0">
                  <FiEye className="text-sm" />
                </button>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500">
            Showing {filtered.length} of {customers.length} customers
          </div>
        </div>
      )}

      {selectedCustomer && (
        <CustomerModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
    </div>
  );
}
