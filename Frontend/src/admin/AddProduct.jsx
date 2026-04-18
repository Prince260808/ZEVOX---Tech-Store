import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft, FiPackage, FiDollarSign, FiTag,
  FiAlignLeft, FiHash, FiCheck, FiAlertCircle
} from "react-icons/fi";
import CloudinaryUpload from "../components/CloudinaryUpload";

const CATEGORIES = ["Electronics", "Laptop", "Mobile", "Tablet", "Accessories", "Other"];

function FormField({ label, icon: Icon, error, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className={`relative flex items-center rounded-xl border
        ${error ? "border-red-300 ring-1 ring-red-200" : "border-gray-200"}
        focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100
        transition-all duration-200 bg-white overflow-hidden`}>
        {Icon && <div className="pl-3.5 flex-shrink-0"><Icon className="text-gray-400 text-base" /></div>}
        {children}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <FiAlertCircle className="text-xs flex-shrink-0" /> {error}
        </p>
      )}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", price: "", category: "", image: "", stock: "",
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Valid price is required";
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = "Valid stock is required";
    if (!form.category) e.category = "Category is required";
    return e;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post("/products/add", {
        ...form, price: Number(form.price), stock: Number(form.stock),
      });
      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Failed to add product" });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 px-0 sm:px-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/products"
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center
            justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm flex-shrink-0">
          <FiArrowLeft />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Add New Product</h1>
          <p className="text-sm text-gray-500 hidden sm:block">Fill in the details to add a new product</p>
        </div>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 animate-scale-in">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <FiCheck className="text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-emerald-800 text-sm">Product added successfully!</p>
            <p className="text-emerald-600 text-xs">Redirecting to product list...</p>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-scale-in">
          <FiAlertCircle className="text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">

          {/* Title */}
          <FormField label="Product Title" icon={FiPackage} error={errors.title}>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. MacBook Pro 14-inch M3"
              className="w-full pl-3 pr-4 py-3 text-sm focus:outline-none bg-transparent" />
          </FormField>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <div className="relative rounded-xl border border-gray-200
              focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <FiAlignLeft className="absolute top-3.5 left-3.5 text-gray-400 text-base" />
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe the product features, specs, and highlights..."
                rows={3}
                className="w-full pl-10 pr-4 py-3 text-sm focus:outline-none bg-transparent resize-none" />
            </div>
          </div>

          {/* Price & Stock — responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Price (₹)" icon={FiDollarSign} error={errors.price}>
              <input name="price" type="number" value={form.price} onChange={handleChange}
                placeholder="0.00" min="0"
                className="w-full pl-3 pr-4 py-3 text-sm focus:outline-none bg-transparent" />
            </FormField>
            <FormField label="Stock Quantity" icon={FiHash} error={errors.stock}>
              <input name="stock" type="number" value={form.stock} onChange={handleChange}
                placeholder="0" min="0"
                className="w-full pl-3 pr-4 py-3 text-sm focus:outline-none bg-transparent" />
            </FormField>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <div className={`rounded-xl border ${errors.category ? "border-red-300" : "border-gray-200"}
              focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100
              transition-all flex items-center bg-white overflow-hidden`}>
              <FiTag className="ml-3.5 text-gray-400 flex-shrink-0" />
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 text-sm focus:outline-none bg-transparent text-gray-700 appearance-none">
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORIES.map(c => (
                <button key={c} type="button"
                  onClick={() => handleChange({ target: { name: "category", value: c } })}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition
                    ${form.category === c ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* ── Cloudinary Image Upload ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Product Image
              <span className="ml-2 text-xs font-normal text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                ☁️ Cloudinary
              </span>
            </label>
            <CloudinaryUpload
              value={form.image}
              onChange={url => setForm(f => ({ ...f, image: url }))}
              disabled={loading}
            />
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/admin/products"
              className="flex-1 py-3 text-center rounded-xl border border-gray-300
                text-gray-700 text-sm font-semibold hover:bg-gray-50 transition order-2 sm:order-1">
              Cancel
            </Link>
            <button type="submit" disabled={loading || success}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70
                text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200
                transition-all duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 btn-press">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding...</>
              ) : success ? (
                <><FiCheck /> Added!</>
              ) : (
                <><FiPackage /> Add Product</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}