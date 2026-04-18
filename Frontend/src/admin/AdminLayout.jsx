import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiGrid, FiPackage, FiPlusCircle, FiShoppingCart,
  FiUsers, FiSettings, FiLogOut, FiMenu, FiX,
  FiTrendingUp, FiChevronRight, FiBell
} from "react-icons/fi";

const navItems = [
  { icon: FiGrid, label: "Dashboard", to: "/admin" },
  { icon: FiPackage, label: "Products", to: "/admin/products" },
  { icon: FiPlusCircle, label: "Add Product", to: "/admin/products/add" },
  { icon: FiShoppingCart, label: "Orders", to: "/admin/orders" },
  { icon: FiUsers, label: "Customers", to: "/admin/customers" },
  { icon: FiTrendingUp, label: "Analytics", to: "/admin/analytics" },
  { icon: FiSettings, label: "Settings", to: "/admin/settings" },
];

/* ─── ZEVOX Logo (sidebar variant — light text on dark bg) ──────────── */
function ZevoxSidebarLogo() {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Hexagonal Icon Mark */}
      <svg width="36" height="36" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sl-grad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="55%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="sl-bolt" x1="10" y1="8" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
        </defs>
        {/* Hexagon */}
        <path d="M19 2 L34 10.5 L34 27.5 L19 36 L4 27.5 L4 10.5 Z" fill="url(#sl-grad)" />
        {/* Inner ring */}
        <path d="M19 5.5 L31 12.5 L31 25.5 L19 32.5 L7 25.5 L7 12.5 Z"
          fill="none" stroke="white" strokeOpacity="0.18" strokeWidth="0.8" />
        {/* Z letterform */}
        <path d="M12 13 H26 L12.5 25 H26.5"
          stroke="url(#sl-bolt)" strokeWidth="3.2"
          strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Accent dot */}
        <circle cx="29.5" cy="8.5" r="2.8" fill="#a5b4fc" />
      </svg>

      {/* Wordmark — white on dark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span style={{
            fontFamily: "'DM Sans', 'Outfit', 'Sora', sans-serif",
            fontWeight: 900,
            fontSize: 20,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            lineHeight: 1,
          }}>
            ZEV
          </span>
          <span style={{
            fontFamily: "'DM Sans', 'Outfit', 'Sora', sans-serif",
            fontWeight: 900,
            fontSize: 20,
            letterSpacing: "-0.04em",
            color: "#818cf8",
            lineHeight: 1,
          }}>
            OX
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
          <div style={{ height: 1, width: 18, background: "linear-gradient(to right, #6366f1, transparent)", borderRadius: 1 }} />
          <span style={{
            fontSize: 7.5,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#6366f1",
          }}>
            Tech Store
          </span>
          <div style={{ height: 1, width: 18, background: "linear-gradient(to left, #6366f1, transparent)", borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path) && path !== "/admin";

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex font-sans">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f172a] z-40 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <Link to="/" className="flex items-center flex-shrink-0 hover:opacity-90 transition-opacity">
            <ZevoxSidebarLogo />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FiX />
          </button>
        </div>

        {/* Admin Badge */}
        <div className="px-4 py-3">
          <div className="bg-white/5 rounded-xl px-3 py-2.5 flex items-center gap-3 border border-white/10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow">
              A
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Admin Panel</p>
              <p className="text-gray-400 text-xs">Super Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-0.5 overflow-y-auto">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-3 py-2 mt-2">
            Main Menu
          </p>
          {navItems.map(({ icon: Icon, label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group relative
                ${isActive(to)
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <Icon className={`text-base flex-shrink-0 ${isActive(to) ? "text-white" : "text-gray-500 group-hover:text-indigo-400"}`} />
              <span>{label}</span>
              {isActive(to) && (
                <FiChevronRight className="ml-auto text-indigo-300 text-xs" />
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-5 border-t border-white/10 pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-gray-400 hover:bg-red-500/10 hover:text-red-400
              transition-all duration-200 text-sm font-medium"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-gray-400 hover:bg-white/5 hover:text-white
              transition-all duration-200 text-sm font-medium mt-1"
          >
            <FiShoppingCart />
            <span>View Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition"
            >
              <FiMenu className="text-xl" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span className="text-gray-400">Admin</span>
              <FiChevronRight className="text-xs" />
              <span className="text-gray-800 font-medium capitalize">
                {location.pathname.split("/").filter(Boolean).pop() || "Dashboard"}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition">
                <FiBell className="text-xl" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"></span>
              </button>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}