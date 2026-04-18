import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiTrash2, FiArrowRight, FiShoppingBag, FiMinus, FiPlus, FiArrowLeft, FiTag } from "react-icons/fi";

export default function Cart() {
  const navigate = useNavigate();
  const userId   = localStorage.getItem("userId");
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [removing, setRemoving] = useState(null);

  const fetchCart = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const res = await api.get(`/cart/${userId}`);
      setItems(res.data?.items || []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (productId, qty) => {
    if (qty < 1) return removeItem(productId);
    try {
      await api.put("/cart/update", { userId, productId, quantity: qty });
      setItems(items.map(i => (i.productId?._id || i.productId) === productId ? { ...i, quantity: qty } : i));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch { fetchCart(); }
  };

  const removeItem = async (productId) => {
    setRemoving(productId);
    try {
      await api.put("/cart/remove", { data: { userId, productId } });
      setItems(items.filter(i => (i.productId?._id || i.productId) !== productId));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch { fetchCart(); }
    finally { setRemoving(null); }
  };

  const subtotal = items.reduce((s, i) => s + (i.productId?.price || 0) * i.quantity, 0);

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="h-8 skeleton rounded-xl w-36 mb-8" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-28 border border-gray-100 skeleton" />)}
        </div>
        <div className="bg-white rounded-2xl h-64 border border-gray-100 skeleton" />
      </div>
    </div>
  );

  if (!userId) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-fade-in-up">
      <div className="text-7xl mb-6 animate-float">🛒</div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Sign in to view your cart</h2>
      <p className="text-gray-500 mb-8 text-sm">Your cart items will be saved after you log in.</p>
      <Link to="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600
        text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-300/40
        transition-all duration-200 hover:-translate-y-0.5 btn-press">
        Sign In <FiArrowRight />
      </Link>
    </div>
  );

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-fade-in-up">
      <div className="text-7xl mb-6 animate-float">🛍️</div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-8 text-sm">Looks like you haven't added anything yet.</p>
      <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600
        text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-300/40
        transition-all duration-200 hover:-translate-y-0.5 btn-press">
        <FiShoppingBag /> Start Shopping <FiArrowRight />
      </Link>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-indigo-50/20 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8 animate-fade-in-down">
          <Link to="/" className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm
            flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition btn-press">
            <FiArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => {
              const product   = item.productId;
              const productId = product?._id || item.productId;
              const isRemoving = removing === productId;
              return (
                <div key={item._id}
                  className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4
                    transition-all duration-300 animate-fade-in-up ${isRemoving ? "opacity-50 scale-95" : ""}`}
                  style={{ animationDelay:`${idx * 60}ms` }}>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100
                      flex-shrink-0 border border-gray-200 overflow-hidden">
                      {product?.image
                        ? <img src={product.image} alt={product.title} className="w-full h-full object-contain p-2" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-0.5">
                        {product?.category || "Product"}
                      </p>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">{product?.title || "Product"}</h3>
                      <p className="text-lg font-black text-gray-900">
                        ₹{((product?.price || 0) * item.quantity).toLocaleString()}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400">₹{product?.price?.toLocaleString()} × {item.quantity}</p>
                      )}
                    </div>
                    <button onClick={() => removeItem(productId)} disabled={isRemoving}
                      className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 text-red-400
                        hover:bg-red-500 hover:text-white hover:border-red-500
                        flex items-center justify-center flex-shrink-0 transition-all duration-200 btn-press self-start">
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-xs text-gray-500 font-semibold">Quantity:</span>
                    <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => updateQty(productId, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-600
                          hover:bg-red-50 hover:text-red-500 transition-all duration-200">
                        <FiMinus className="text-sm" />
                      </button>
                      <span className="w-10 text-center text-sm font-black text-gray-900 border-x-2 border-gray-200 py-2">
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQty(productId, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-gray-600
                          hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200">
                        <FiPlus className="text-sm" />
                      </button>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-lg">Free Delivery</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24 animate-fade-in-right">
              <h3 className="font-black text-gray-900 mb-5 text-lg">Order Summary</h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between font-black text-gray-900 text-xl">
                  <span>Total</span>
                  <span className="gradient-text">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2 mb-5">
                <div className="flex-1 relative">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input placeholder="Promo code"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200
                      text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50 focus:bg-white transition" />
                </div>
                <button className="px-3 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold
                  hover:bg-gray-800 transition btn-press flex-shrink-0">Apply</button>
              </div>
              <button onClick={() => navigate("/checkout-address")}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600
                  hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl font-black text-sm
                  shadow-xl shadow-indigo-300/40 transition-all duration-200 flex items-center
                  justify-center gap-2 hover:-translate-y-0.5 btn-press">
                Proceed to Checkout <FiArrowRight />
              </button>
              <div className="flex items-center justify-center gap-4 mt-4">
                {["🔒 Secure","⚡ Fast","✅ Trusted"].map(b => (
                  <span key={b} className="text-[11px] text-gray-400 font-medium">{b}</span>
                ))}
              </div>
              <Link to="/" className="flex items-center justify-center gap-2 mt-3
                text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition">
                <FiArrowLeft className="text-xs" /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
