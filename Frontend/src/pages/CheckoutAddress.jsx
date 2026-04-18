import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiUser, FiPhone, FiHome, FiAlertCircle } from "react-icons/fi";

export default function CheckoutAddress() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", phone: "", addressLine1: "", addressLine2: "",
    city: "", state: "", pincode: "", type: "Home",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone number";
    if (!form.addressLine1.trim()) e.addressLine1 = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    // Save both original form fields and backend-mapped fields
    const mapped = {
      ...form,
      fullName: form.name,
      addressLine: [form.addressLine1, form.addressLine2].filter(Boolean).join(", "),
    };
    sessionStorage.setItem("shippingAddress", JSON.stringify(mapped));
    navigate("/checkout");
  };

  const fields = [
    { name: "name", label: "Full Name", placeholder: "John Doe", icon: FiUser, col: "col-span-2" },
    { name: "phone", label: "Phone Number", placeholder: "10-digit number", icon: FiPhone, col: "col-span-2" },
    { name: "addressLine1", label: "Address Line 1", placeholder: "House / Flat / Block no.", icon: FiMapPin, col: "col-span-2" },
    { name: "addressLine2", label: "Address Line 2 (optional)", placeholder: "Street, Colony", icon: FiHome, col: "col-span-2" },
    { name: "city", label: "City", placeholder: "Delhi", icon: null, col: "" },
    { name: "state", label: "State", placeholder: "Delhi", icon: null, col: "" },
    { name: "pincode", label: "Pincode", placeholder: "110001", icon: null, col: "" },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/cart"
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center
            justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm">
          <FiArrowLeft />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Delivery Address</h1>
          <p className="text-sm text-gray-500">Where should we deliver?</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {["Cart", "Address", "Payment"].map((step, i) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${i === 1 ? "bg-indigo-600 text-white" : i < 1 ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}>
              {i < 1 ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === 1 ? "text-indigo-600" : "text-gray-400"}`}>{step}</span>
            {i < 2 && <div className="flex-1 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        {/* Address Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address Type</label>
          <div className="flex gap-3">
            {["Home", "Work", "Other"].map(t => (
              <button key={t} type="button"
                onClick={() => setForm(f => ({ ...f, type: t }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition
                  ${form.type === t
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>
                {t === "Home" ? "🏠" : t === "Work" ? "🏢" : "📍"} {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {fields.map(({ name, label, placeholder, icon: Icon, col }) => (
            <div key={name} className={col || ""}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
              <div className={`relative flex items-center rounded-xl border transition
                ${errors[name] ? "border-red-300" : "border-gray-200"}
                focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100`}>
                {Icon && <Icon className="absolute left-3.5 text-gray-400 flex-shrink-0" />}
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 text-sm focus:outline-none bg-transparent`}
                />
              </div>
              {errors[name] && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <FiAlertCircle className="text-xs" /> {errors[name]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Link to="/cart"
            className="flex-1 py-3 text-center rounded-xl border border-gray-300
              text-gray-700 text-sm font-semibold hover:bg-gray-50 transition">
            Back
          </Link>
          <button type="submit"
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl
              font-semibold text-sm shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
