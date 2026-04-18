import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiArrowRight } from "react-icons/fi";

/* ─── ZEVOX Logo (footer variant — light text on dark bg) ──────────── */
function ZevoxFooterLogo() {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg width="36" height="36" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fl-grad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="55%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="fl-bolt" x1="10" y1="8" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
        </defs>
        <path d="M19 2 L34 10.5 L34 27.5 L19 36 L4 27.5 L4 10.5 Z" fill="url(#fl-grad)" />
        <path d="M19 5.5 L31 12.5 L31 25.5 L19 32.5 L7 25.5 L7 12.5 Z"
          fill="none" stroke="white" strokeOpacity="0.18" strokeWidth="0.8" />
        <path d="M12 13 H26 L12.5 25 H26.5"
          stroke="url(#fl-bolt)" strokeWidth="3.2"
          strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="29.5" cy="8.5" r="2.8" fill="#a5b4fc" />
      </svg>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span style={{
            fontFamily: "'DM Sans', 'Outfit', 'Sora', sans-serif",
            fontWeight: 900, fontSize: 22,
            letterSpacing: "-0.04em", color: "#ffffff", lineHeight: 1,
          }}>ZEV</span>
          <span style={{
            fontFamily: "'DM Sans', 'Outfit', 'Sora', sans-serif",
            fontWeight: 900, fontSize: 22,
            letterSpacing: "-0.04em", color: "#818cf8", lineHeight: 1,
          }}>OX</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
          <div style={{ height: 1, width: 18, background: "linear-gradient(to right, #6366f1, transparent)", borderRadius: 1 }} />
          <span style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#6366f1" }}>
            Tech Store
          </span>
          <div style={{ height: 1, width: 18, background: "linear-gradient(to left, #6366f1, transparent)", borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-indigo-700 to-violet-700 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-white font-black text-xl mb-1">Stay in the Loop 🔔</h3>
            <p className="text-indigo-200 text-sm">Get exclusive deals delivered to your inbox.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input placeholder="Enter your email"
              className="flex-1 sm:w-64 px-4 py-3 rounded-xl bg-white/15 border border-white/20
                text-white placeholder-white/50 text-sm focus:outline-none focus:bg-white/25 transition backdrop-blur-sm" />
            <button className="px-5 py-3 bg-white text-indigo-700 rounded-xl font-bold text-sm
              hover:bg-indigo-50 transition flex items-center gap-2 btn-press flex-shrink-0">
              Subscribe <FiArrowRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex mb-5 hover:opacity-90 transition-opacity">
              <ZevoxFooterLogo />
            </Link>
            <p className="text-sm leading-relaxed mb-5">
              Your trusted destination for premium electronics, laptops, mobiles and accessories at unbeatable prices.
            </p>
            <div className="flex gap-2.5">
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-indigo-600
                    flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[{ label:"Home", to:"/" }, { label:"All Products", to:"/" }, { label:"Cart", to:"/cart" }, { label:"My Account", to:"/login" }].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-indigo-400 transition-all duration-200 hover:translate-x-1 inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-3 text-sm">
              {["Laptops","Mobiles","Tablets","Accessories"].map(cat => (
                <li key={cat}>
                  <Link to="/" className="hover:text-indigo-400 transition-all duration-200 hover:translate-x-1 inline-block">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:support@zevox.in" className="flex items-center gap-2.5 hover:text-indigo-400 transition group">
                  <FiMail className="flex-shrink-0 group-hover:text-indigo-400" /> support@zevox.in
                </a>
              </li>
              <li>
                <a href="tel:+911234567890" className="flex items-center gap-2.5 hover:text-indigo-400 transition group">
                  <FiPhone className="flex-shrink-0 group-hover:text-indigo-400" /> +91 12345 67890
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <FiMapPin className="flex-shrink-0 mt-0.5" />
                <span>123 Tech Street,<br />New Delhi, India 110001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 py-6 border-t border-b border-white/5">
          {[{icon:"🔒",label:"SSL Secure"},{icon:"💳",label:"Razorpay"},{icon:"🚚",label:"Free Shipping"},{icon:"↩️",label:"Easy Returns"},{icon:"⭐",label:"4.8 Rated"}].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <span>{icon}</span><span className="text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} ZEVOX Tech Store. All rights reserved.</p>
          <div className="flex gap-5">
            {["Privacy Policy","Terms of Service","Refund Policy"].map(link => (
              <a key={link} href="#" className="hover:text-gray-400 transition">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}