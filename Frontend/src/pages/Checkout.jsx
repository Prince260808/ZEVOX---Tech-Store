import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { FiArrowLeft, FiCreditCard, FiDollarSign, FiMapPin, FiLock, FiCheck, FiShoppingBag, FiAlertCircle, FiChevronRight } from "react-icons/fi";

const PAYMENT_METHODS = [
  { id:"razorpay", label:"UPI / Card / Netbanking", icon:FiCreditCard, desc:"Powered by Razorpay", badge:"Recommended" },
  { id:"cod",      label:"Cash on Delivery",         icon:FiDollarSign, desc:"Pay when your order arrives" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const userId   = localStorage.getItem("userId");
  const [items,     setItems]     = useState([]);
  const [address,   setAddress]   = useState(null);
  const [payMethod, setPayMethod] = useState("razorpay");
  const [loading,   setLoading]   = useState(false);
  const [initLoad,  setInitLoad]  = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    const addr = sessionStorage.getItem("shippingAddress");
    if (!addr)  { navigate("/checkout-address"); return; }
    setAddress(JSON.parse(addr));
    api.get(`/cart/${userId}`)
      .then(res => setItems(res.data?.items || []))
      .catch(() => navigate("/cart"))
      .finally(() => setInitLoad(false));
  }, []);

  const subtotal = items.reduce((s, i) => s + (i.productId?.price || 0) * i.quantity, 0);

  const placeOrder = async (paymentInfo = {}) => {
    setLoading(true); setError("");
    try {
      const res = await api.post("/order/place-order", {
        userId,
        address: {
          fullName:    address.fullName || address.name,
          phone:       address.phone,
          addressLine: address.addressLine || "",
          city:        address.city,
          state:       address.state,
          pincode:     address.pincode,
        },
        paymentMethod: payMethod,
        ...paymentInfo,
      });
      sessionStorage.removeItem("shippingAddress");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate(`/order-success/${res.data?.orderId || "success"}`);
    } catch (err) {
      setError(err.response?.data?.message || "Order failed. Please try again.");
    } finally { setLoading(false); }
  };

  const openRazorpay = async () => {
    if (!window.Razorpay) { setError("Payment gateway not loaded. Please refresh the page."); return; }
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/payment/create-order", { amount: subtotal });
      if (!data.success) throw new Error("Order creation failed");

      const options = {
        key:      data.key,
        amount:   data.amount,
        currency: data.currency,
        name:     "GuptaStore",
        description: "Purchase from GuptaStore",
        order_id: data.order_id,
        prefill:  { name: address?.fullName || "", contact: address?.phone || "" },
        theme:    { color: "#4f46e5" },
        modal:    { ondismiss: () => setLoading(false) },
        handler: async response => {
          try {
            const verify = await api.post("/payment/verify", {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            if (verify.data.success) {
              await placeOrder({
                razorpayOrderId:   response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
              });
            } else {
              setError("Payment verification failed. Contact support."); setLoading(false);
            }
          } catch { setError("Payment verification failed."); setLoading(false); }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", resp => {
        setError("Payment failed: " + (resp.error?.description || "Unknown error"));
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Could not start payment. Try again.");
      setLoading(false);
    }
  };

  const handlePayment = () => payMethod === "cod" ? placeOrder() : openRazorpay();

  if (initLoad) return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="h-8 bg-gray-200 rounded-xl w-48 mb-8 skeleton" />
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-4">
          {[1,2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl skeleton" />)}
        </div>
        <div className="md:col-span-2 h-64 bg-gray-100 rounded-2xl skeleton" />
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-indigo-50/20 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8 animate-fade-in-down">
          <Link to="/checkout-address" className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm
            flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition btn-press">
            <FiArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-500">Complete your purchase</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700
            rounded-xl px-4 py-3 text-sm mb-5 animate-scale-in">
            <FiAlertCircle className="flex-shrink-0" /> {error}
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-5">
            {/* Address */}
            {address && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FiMapPin className="text-indigo-600" /> Delivery Address
                  </h3>
                  <Link to="/checkout-address" className="text-xs text-indigo-600 font-semibold hover:underline">Change</Link>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4 text-sm text-gray-700 space-y-1">
                  <p className="font-bold text-gray-900">{address.fullName || address.name}</p>
                  <p>{address.phone}</p>
                  {address.addressLine && <p>{address.addressLine}</p>}
                  <p>{address.city}, {address.state} – {address.pincode}</p>
                </div>
              </div>
            )}

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fade-in-up delay-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <FiLock className="text-indigo-600" /> Payment Method
              </h3>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc, badge }) => (
                  <button key={id} onClick={() => setPayMethod(id)}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-2xl
                      transition-all duration-200 text-left btn-press
                      ${payMethod === id ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      ${payMethod === id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                      <Icon className="text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-gray-900">{label}</p>
                        {badge && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                            {badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${payMethod === id ? "border-indigo-600 bg-indigo-600" : "border-gray-300"}`}>
                      {payMethod === id && <FiCheck className="text-white text-xs" />}
                    </div>
                  </button>
                ))}
              </div>
              {payMethod === "razorpay" && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
                  <FiLock className="text-emerald-500 flex-shrink-0" />
                  Secured by Razorpay · 256-bit encryption · PCI DSS compliant
                </div>
              )}
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-fade-in-up delay-200">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <FiShoppingBag className="text-indigo-600" /> Items ({items.length})
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                      {item.productId?.image
                        ? <img src={item.productId.image} alt={item.productId.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-lg">📦</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.productId?.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                      ₹{((item.productId?.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24 animate-fade-in-right">
              <h3 className="font-bold text-gray-900 mb-5">Order Summary</h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>
                <div className="h-px bg-gray-100 my-3" />
                <div className="flex justify-between font-black text-gray-900 text-lg">
                  <span>Total</span>
                  <span className="gradient-text">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={handlePayment} disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600
                  hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl font-bold text-sm
                  shadow-xl shadow-indigo-300/50 transition-all duration-200 flex items-center
                  justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed btn-press">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                  : payMethod==="cod"
                    ? <><FiShoppingBag />Place Order<FiChevronRight /></>
                    : <><FiLock />Pay ₹{subtotal.toLocaleString()}<FiChevronRight /></>}
              </button>
              <div className="flex items-center justify-center gap-4 mt-4">
                {["🔒 Safe","⚡ Instant","✅ Verified"].map(b => (
                  <span key={b} className="text-[11px] text-gray-400 font-medium">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
