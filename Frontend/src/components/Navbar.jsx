import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiHome, FiPackage, FiSearch, FiChevronDown } from "react-icons/fi";

/* ─── ZEVOX Premium Logo ─────────────────────────────────────────────── */
function ZevoxLogo() {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Hexagonal Icon Mark */}
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="z-grad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
          <linearGradient id="z-bolt" x1="10" y1="6" x2="28" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
          <linearGradient id="z-glow" x1="0" y1="0" x2="38" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <filter id="z-shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#4f46e5" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Hexagon base */}
        <path
          d="M19 2 L34 10.5 L34 27.5 L19 36 L4 27.5 L4 10.5 Z"
          fill="url(#z-grad)"
          filter="url(#z-shadow)"
        />
        {/* Inner ring */}
        <path
          d="M19 5.5 L31 12.5 L31 25.5 L19 32.5 L7 25.5 L7 12.5 Z"
          fill="none"
          stroke="white"
          strokeOpacity="0.15"
          strokeWidth="0.8"
        />
        {/* Z letterform */}
        <path
          d="M12 13 H26 L12.5 25 H26.5"
          stroke="url(#z-bolt)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Accent dot top-right */}
        <circle cx="29.5" cy="8.5" r="2.8" fill="#818cf8" opacity="0.95" />
        {/* Bottom glow strip */}
        <rect x="6" y="33.5" width="26" height="1.2" rx="0.6" fill="url(#z-glow)" />
      </svg>

      {/* Wordmark */}
      <div className="hidden sm:flex flex-col leading-none">
        <div className="flex items-baseline">
          <span
            className="text-[21px] font-black text-gray-900"
            style={{ letterSpacing: "-0.04em", fontFamily: "'DM Sans', 'Outfit', 'Sora', sans-serif" }}
          >
            ZEV
          </span>
          <span
            className="text-[21px] font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-violet-500 to-indigo-700"
            style={{ letterSpacing: "-0.04em", fontFamily: "'DM Sans', 'Outfit', 'Sora', sans-serif" }}
          >
            OX
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-[3px]">
          <div className="h-px w-5 bg-gradient-to-r from-indigo-400 to-transparent rounded-full" />
          <span className="text-[8px] font-bold tracking-[0.25em] uppercase text-indigo-400">
            Tech Store
          </span>
          <div className="h-px w-5 bg-gradient-to-l from-indigo-400 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [cartCount,  setCartCount]  = useState(0);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query,      setQuery]      = useState("");
  const searchRef = useRef(null);
  const userRef   = useRef(null);

  const userId     = localStorage.getItem("userId");
  const isLoggedIn = !!userId;
  const isAdmin    = localStorage.getItem("role") === "admin";
  const userName   = localStorage.getItem("name") || "Account";

  const fetchCart = async () => {
    const uid = localStorage.getItem("userId");
    if (!uid) { setCartCount(0); return; }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${(import.meta.env.VITE_API_URL || "http://localhost:5001/api")}/cart/${uid}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      const data = await res.json();
      setCartCount(data?.items?.reduce((s, i) => s + i.quantity, 0) || 0);
    } catch { setCartCount(0); }
  };

  useEffect(() => {
    fetchCart();
    window.addEventListener("cartUpdated", fetchCart);
    return () => window.removeEventListener("cartUpdated", fetchCart);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserOpen(false); setSearchOpen(false); }, [location]);

  useEffect(() => {
    const handler = e => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => { localStorage.clear(); setCartCount(0); navigate("/login"); };

  const handleSearch = e => {
    e.preventDefault();
    if (query.trim()) { navigate(`/?q=${encodeURIComponent(query.trim())}`); setSearchOpen(false); setQuery(""); }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300
      ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-200/60" : "bg-white border-b border-gray-100"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0 group transition-transform duration-200 hover:scale-[1.02]">
          <ZevoxLogo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[{ to:"/", label:"Home" }, { to:"/cart", label:"Cart" }].map(({ to, label }) => (
            <Link key={to} to={to}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${location.pathname === to ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                ${location.pathname.startsWith("/admin") ? "bg-violet-50 text-violet-600" : "text-gray-600 hover:bg-gray-100"}`}>
              Admin
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">

          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button onClick={() => setSearchOpen(o => !o)}
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center
                text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200">
              <FiSearch className="text-base" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white rounded-2xl
                shadow-2xl border border-gray-100 p-3 animate-scale-in z-50">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200
                      focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm" />
                  <button type="submit"
                    className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition font-semibold">
                    Go
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart"
            className="relative w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center
              text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-200 btn-press">
            <FiShoppingCart className="text-base" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px]
                font-bold flex items-center justify-center animate-scale-in shadow-md shadow-indigo-300">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* User dropdown */}
          {isLoggedIn ? (
            <div className="relative" ref={userRef}>
              <button onClick={() => setUserOpen(o => !o)}
                className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl border border-gray-200
                  bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 text-sm font-semibold">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500
                  flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:block max-w-[90px] truncate">{userName}</span>
                <FiChevronDown className={`text-xs transition-transform duration-200 ${userOpen ? "rotate-180" : ""}`} />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl
                  border border-gray-100 overflow-hidden animate-scale-in z-50">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                    <p className="text-sm text-gray-800 font-bold truncate">{userName}</p>
                  </div>
                  <div className="p-2">
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                        text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">
                        <FiPackage className="text-sm" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                      text-sm text-red-500 hover:bg-red-50 transition">
                      <FiLogOut className="text-sm" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="h-9 px-4 rounded-xl border border-gray-200 text-sm font-semibold
                text-gray-700 hover:bg-gray-50 transition flex items-center">Sign In</Link>
              <Link to="/signup" className="h-9 px-4 rounded-xl bg-indigo-600 text-white text-sm font-semibold
                hover:bg-indigo-700 transition shadow-md shadow-indigo-200 flex items-center btn-press">Sign Up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(o => !o)}
            className="md:hidden w-9 h-9 rounded-xl border border-gray-200 bg-white
              flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all duration-200">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in-down">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {[{ to:"/", label:"Home", icon:FiHome }, { to:"/cart", label:"Cart", icon:FiShoppingCart }].map(({ to, label, icon:Icon }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition
                  ${location.pathname===to ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-50"}`}>
                <Icon className="text-base" /> {label}
                {to==="/cart" && cartCount > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                <FiPackage /> Admin Panel
              </Link>
            )}
            <div className="border-t border-gray-100 pt-2 mt-2">
              {isLoggedIn ? (
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  text-sm font-semibold text-red-500 hover:bg-red-50 transition">
                  <FiLogOut /> Sign Out
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1 text-center py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Sign In</Link>
                  <Link to="/signup" className="flex-1 text-center py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">Sign Up</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}