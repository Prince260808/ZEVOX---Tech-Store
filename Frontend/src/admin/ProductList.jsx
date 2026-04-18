import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch,
  FiPackage, FiChevronDown, FiAlertCircle, FiX, FiCheck
} from "react-icons/fi";

function ConfirmModal({ product, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <FiAlertCircle className="text-red-600 text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Delete Product</h3>
            <p className="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 mb-5">
          Are you sure you want to delete <span className="font-semibold">"{product?.title}"</span>?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
              border border-gray-300 rounded-xl text-gray-700 text-sm font-medium
              hover:bg-gray-50 transition">
            <FiX /> Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
              bg-red-600 text-white rounded-xl text-sm font-medium
              hover:bg-red-700 transition shadow-lg shadow-red-200">
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type = "success" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3
      rounded-xl shadow-2xl text-white text-sm font-medium
      ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
      {type === "success" ? <FiCheck className="text-lg" /> : <FiAlertCircle className="text-lg" />}
      {message}
    </div>
  );
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [confirmItem, setConfirmItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [view, setView] = useState("table");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/products/delete/${confirmItem._id}`);
      showToast("Product deleted successfully");
      setConfirmItem(null);
      loadProducts();
    } catch {
      showToast("Failed to delete product", "error");
      setConfirmItem(null);
    }
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const filtered = products
    .filter(p =>
      (!search || p.title?.toLowerCase().includes(search.toLowerCase())) &&
      (!catFilter || p.category === catFilter)
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "stock") return b.stock - a.stock;
      return 0;
    });

  const totalValue = products.reduce((s, p) => s + (p.price || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} total products</p>
        </div>
        <Link to="/admin/products/add"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700
            text-white px-5 py-2.5 rounded-xl font-semibold text-sm
            shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5">
          <FiPlus className="text-lg" /> Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Products", value: products.length, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "In Stock", value: products.filter(p => p.stock > 0).length, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Out of Stock", value: products.filter(p => !p.stock).length, color: "text-red-600", bg: "bg-red-50" },
          { label: "Total Value", value: `₹${totalValue.toLocaleString()}`, color: "text-violet-600", bg: "bg-violet-50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl px-4 py-3`}>
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-xl font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          />
        </div>
        <div className="relative">
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="appearance-none w-full sm:w-40 pl-4 pr-8 py-2.5 rounded-xl border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-white text-gray-700">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
        </div>
        <div className="relative">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="appearance-none w-full sm:w-44 pl-4 pr-8 py-2.5 rounded-xl border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-white text-gray-700">
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock">Most Stock</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
        </div>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          <button onClick={() => setView("table")}
            className={`px-3 py-2 text-sm transition ${view === "table" ? "bg-indigo-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
            ☰
          </button>
          <button onClick={() => setView("grid")}
            className={`px-3 py-2 text-sm transition ${view === "grid" ? "bg-indigo-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
            ⊞
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded" />
              <div className="w-16 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <FiPackage className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No products found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div key={p._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100
                hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
              <div className="bg-gray-50 h-40 flex items-center justify-center p-4">
                <img src={p.image} alt={p.title}
                  className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={e => { e.target.src = ""; }}
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-indigo-600 font-medium capitalize mb-1">{p.category}</p>
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2">{p.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">₹{p.price?.toLocaleString()}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                    ${p.stock > 10 ? "bg-emerald-50 text-emerald-700"
                      : p.stock > 0 ? "bg-orange-50 text-orange-700"
                      : "bg-red-50 text-red-700"}`}>
                    {p.stock > 0 ? `${p.stock} left` : "Out"}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link to={`/admin/products/update/${p._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5
                      bg-indigo-50 hover:bg-indigo-100 text-indigo-700
                      rounded-xl py-2 text-xs font-medium transition">
                    <FiEdit2 className="text-xs" /> Edit
                  </Link>
                  <button onClick={() => setConfirmItem(p)}
                    className="flex-1 flex items-center justify-center gap-1.5
                      bg-red-50 hover:bg-red-100 text-red-700
                      rounded-xl py-2 text-xs font-medium transition">
                    <FiTrash2 className="text-xs" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:grid grid-cols-[3rem_1fr_auto_auto_auto_auto] gap-4 px-5 py-3
            border-b border-gray-100 bg-gray-50/70">
            <div />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</span>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <div key={p._id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4
                  px-5 py-4 hover:bg-gray-50/70 transition group">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={p.image} alt={p.title}
                    className="w-full h-full object-contain p-1"
                    onError={e => { e.target.style.display = "none"; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{p.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">{p.category}</p>
                </div>
                <span className="hidden md:inline text-xs text-gray-500 capitalize bg-gray-100
                  px-2.5 py-1 rounded-full flex-shrink-0">
                  {p.category || "—"}
                </span>
                <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                  ₹{p.price?.toLocaleString()}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0
                  ${p.stock > 10 ? "bg-emerald-50 text-emerald-700"
                    : p.stock > 0 ? "bg-orange-50 text-orange-700"
                    : "bg-red-50 text-red-700"}`}>
                  {p.stock > 0 ? `${p.stock}` : "Out"}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/admin/products/update/${p._id}`}
                    className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex items-center
                      justify-center text-indigo-600 transition" title="Edit">
                    <FiEdit2 className="text-sm" />
                  </Link>
                  <button onClick={() => setConfirmItem(p)}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center
                      justify-center text-red-600 transition" title="Delete">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-500">
            Showing {filtered.length} of {products.length} products
          </div>
        </div>
      )}

      {confirmItem && (
        <ConfirmModal product={confirmItem} onConfirm={handleDelete} onCancel={() => setConfirmItem(null)} />
      )}
      {toast && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
}
