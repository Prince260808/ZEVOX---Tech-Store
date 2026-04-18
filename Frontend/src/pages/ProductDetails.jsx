import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import {
  FiShoppingCart, FiArrowLeft, FiStar, FiCheck,
  FiTruck, FiShield, FiRefreshCw, FiZap
} from "react-icons/fi";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/login"); return; }
    setCartLoading(true);
    try {
      await api.post("/cart/add", { userId, productId: id, quantity: qty });
      window.dispatchEvent(new Event("cartUpdated"));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Unknown error";
      alert(`Add to cart failed (HTTP ${err.response?.status ?? "?"}): ${msg}`);
      console.error("Cart error:", err.response?.data ?? err);
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="bg-gray-200 rounded-3xl h-96" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-gray-600 font-semibold text-lg mb-2">Product not found</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm">← Back to Store</Link>
      </div>
    );
  }

  const stockColor = product.stock > 10 ? "text-emerald-600" : product.stock > 0 ? "text-orange-500" : "text-red-500";
  const stockLabel = product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left!` : "Out of Stock";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-indigo-600 transition flex items-center gap-1">
          <FiArrowLeft className="text-xs" /> Home
        </Link>
        <span>/</span>
        <span className="capitalize text-gray-400">{product.category}</span>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-3xl p-8 flex items-center justify-center border border-gray-100 shadow-sm min-h-[300px]">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-72 object-contain drop-shadow-xl"
            onError={e => { e.target.src = ""; }}
          />
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full capitalize mb-3">
              {product.category}
            </span>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <FiStar key={s} className="text-amber-400 text-sm fill-amber-400" />
              ))}
            </div>
            <span className="text-sm text-gray-500">(4.5) · 128 reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-gray-900">
              ₹{product.price?.toLocaleString()}
            </span>
          </div>

          {/* Stock */}
          <p className={`text-sm font-semibold ${stockColor}`}>● {stockLabel}</p>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
              {product.description}
            </p>
          )}

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Qty:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600
                    hover:bg-gray-100 transition font-bold"
                >−</button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600
                    hover:bg-gray-100 transition font-bold"
                >+</button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={addToCart}
              disabled={product.stock === 0 || cartLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl
                font-semibold text-sm transition-all duration-200
                ${product.stock === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : added
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
                }`}
            >
              {cartLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : added ? (
                <><FiCheck /> Added to Cart!</>
              ) : (
                <><FiShoppingCart /> Add to Cart</>
              )}
            </button>
          </div>

          {/* Features strip */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            {[
              { icon: FiTruck, label: "Free Delivery" },
              { icon: FiShield, label: "1 Year Warranty" },
              { icon: FiRefreshCw, label: "7-Day Returns" },
              { icon: FiZap, label: "Fast Shipping" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-500">
                <Icon className="text-indigo-500 flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
