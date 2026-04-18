import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiEye, FiStar, FiZap, FiHeart, FiTrendingUp } from "react-icons/fi";

const HERO_SLIDES = [
  { title:"Next-Gen Tech\nat Your Fingertips", subtitle:"Shop the latest laptops, mobiles & tablets with unbeatable deals", gradient:"from-indigo-700 via-indigo-600 to-violet-700", emoji:"💻", badge:"New Arrivals", cta:"Shop Now" },
  { title:"Premium Mobiles\nBig Savings",       subtitle:"Explore flagship smartphones from top brands at the best prices", gradient:"from-rose-600 via-pink-600 to-fuchsia-700",   emoji:"📱", badge:"Hot Deals",    cta:"Explore Phones" },
  { title:"Free Delivery\nOn All Orders",        subtitle:"Enjoy fast, free shipping on every order — no minimum required", gradient:"from-emerald-600 via-teal-600 to-cyan-700",    emoji:"🚀", badge:"Limited Time", cta:"Start Shopping" },
];
const CATEGORIES = ["","Laptop","Mobile","Tablet","Accessories"];
const CAT_ICONS  = { "":"🛍️", Laptop:"💻", Mobile:"📱", Tablet:"📟", Accessories:"🎧" };

function HeroSlider() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timer = useRef(null);

  const go = idx => {
    if (animating) return;
    setAnimating(true);
    setActive((idx + HERO_SLIDES.length) % HERO_SLIDES.length);
    setTimeout(() => setAnimating(false), 600);
  };

  useEffect(() => {
    timer.current = setInterval(() => go(active + 1), 5500);
    return () => clearInterval(timer.current);
  }, [active]);

  const s = HERO_SLIDES[active];
  return (
    <div className={`relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br ${s.gradient}
      text-white mb-6 sm:mb-8 shadow-2xl min-h-[200px] xs:min-h-[240px] sm:min-h-[300px] md:min-h-[340px]`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-float" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay:"1s" }} />
        {[0,1,2,3,4].map(i => (
          <div key={i} className="absolute rounded-full border border-white/10 animate-spin-slow"
            style={{ width:50+i*50, height:50+i*50, top:`${10+i*5}%`, right:`${5+i*3}%`, animationDuration:`${15+i*5}s`, animationDirection:i%2?"reverse":"normal" }} />
        ))}
      </div>

      {/* Slide content */}
      <div className={`relative flex items-center justify-between h-full
        px-5 xs:px-6 sm:px-10 md:px-12
        py-8 xs:py-10 sm:py-12 md:py-14
        transition-all duration-500 ${animating?"opacity-70 scale-[0.99]":"opacity-100 scale-100"}`}>
        <div className="max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg">
          <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 text-white
            text-[10px] xs:text-xs font-bold uppercase tracking-widest px-2.5 xs:px-3 py-1 xs:py-1.5
            rounded-full mb-3 xs:mb-5 backdrop-blur-sm shadow-lg animate-fade-in-down">
            <FiZap className="text-yellow-300" /> {s.badge}
          </span>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black leading-tight whitespace-pre-line mb-3 xs:mb-4 animate-fade-in-up">
            {s.title}
          </h1>
          <p className="text-white/80 text-xs xs:text-sm sm:text-base mb-5 xs:mb-7 max-w-xs sm:max-w-sm animate-fade-in-up delay-100 line-clamp-2 sm:line-clamp-none">
            {s.subtitle}
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-black
            px-4 xs:px-6 py-2.5 xs:py-3.5 rounded-xl xs:rounded-2xl shadow-2xl hover:shadow-white/20 hover:-translate-y-1
            transition-all duration-200 text-xs xs:text-sm animate-fade-in-up delay-200 btn-press">
            {s.cta} <FiChevronRight />
          </Link>
        </div>
        {/* Emoji — hidden on very small, shown from sm+ */}
        <div className="hidden sm:flex text-7xl sm:text-8xl md:text-9xl items-center justify-center
          flex-shrink-0 select-none drop-shadow-2xl animate-float">
          {s.emoji}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 xs:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 xs:gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className={`rounded-full transition-all duration-300 ${i===active?"w-6 xs:w-7 h-2 xs:h-2.5 bg-white":"w-2 xs:w-2.5 h-2 xs:h-2.5 bg-white/40 hover:bg-white/60"}`} />
        ))}
      </div>

      {/* Prev / Next arrows */}
      {[{ dir:-1, icon:FiChevronLeft, cls:"left-2 xs:left-3" }, { dir:1, icon:FiChevronRight, cls:"right-2 xs:right-3" }].map(({ dir, icon:Icon, cls }) => (
        <button key={dir} onClick={() => go(active+dir)}
          className={`absolute ${cls} top-1/2 -translate-y-1/2 w-8 xs:w-10 h-8 xs:h-10 rounded-full
            bg-white/20 hover:bg-white/35 backdrop-blur-sm flex items-center justify-center
            text-white transition border border-white/20 shadow-lg btn-press`}>
          <Icon />
        </button>
      ))}
    </div>
  );
}

function ProductCard({ item, onAddToCart, index }) {
  const [added, setAdded] = useState(false);
  const [wishlisted, setWish] = useState(false);
  const [imgError, setImgErr] = useState(false);

  const handleAdd = async () => {
    await onAddToCart(item._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm card-hover group animate-fade-in-up"
      style={{ animationDelay:`${(index % 8) * 60}ms` }}>
      {/* Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
        {!imgError && item.image ? (
          <img src={item.image} alt={item.title}
            className="w-full h-full object-contain p-3 xs:p-4 group-hover:scale-110 transition-transform duration-500"
            onError={() => setImgErr(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl xs:text-5xl">{CAT_ICONS[item.category] || "📦"}</div>
        )}
        <div className="absolute top-2 xs:top-3 left-2 xs:left-3 flex flex-col gap-1 xs:gap-1.5">
          {item.badge && <span className="bg-red-500 text-white text-[9px] xs:text-[10px] font-bold px-1.5 xs:px-2 py-0.5 rounded-full">{item.badge}</span>}
          <span className="bg-emerald-500 text-white text-[9px] xs:text-[10px] font-bold px-1.5 xs:px-2 py-0.5 rounded-full">Free Delivery</span>
        </div>
        <button onClick={() => setWish(w => !w)}
          className="absolute top-2 xs:top-3 right-2 xs:right-3 w-7 xs:w-8 h-7 xs:h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md
            flex items-center justify-center transition-all duration-200 hover:scale-110 btn-press
            opacity-0 group-hover:opacity-100">
          <FiHeart className={wishlisted ? "text-red-500 fill-red-500" : "text-gray-400"} size={14} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 xs:p-4">
        <p className="text-[10px] xs:text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-0.5 xs:mb-1">{item.category || "Electronics"}</p>
        <h3 className="text-xs xs:text-sm font-bold text-gray-900 line-clamp-2 mb-1 xs:mb-1.5 leading-snug">{item.title}</h3>
        <div className="flex items-center gap-0.5 xs:gap-1 mb-2 xs:mb-3">
          {[1,2,3,4,5].map(s => <FiStar key={s} className={`text-[10px] xs:text-xs ${s<=4?"text-amber-400 fill-amber-400":"text-gray-200"}`} />)}
          <span className="text-[10px] xs:text-[11px] text-gray-400 ml-0.5 xs:ml-1">(4.0)</span>
        </div>
        <div className="flex items-center gap-1.5 xs:gap-2 mb-3 xs:mb-4">
          <span className="text-base xs:text-xl font-black text-gray-900">₹{item.price?.toLocaleString()}</span>
          {item.originalPrice && <span className="text-[10px] xs:text-xs text-gray-400 line-through">₹{item.originalPrice?.toLocaleString()}</span>}
        </div>
        <div className="grid grid-cols-2 gap-1.5 xs:gap-2">
          <Link to={`/product/${item._id}`}
            className="flex items-center justify-center gap-1 xs:gap-1.5 py-2 xs:py-2.5 border-2 border-gray-200
              rounded-xl text-[10px] xs:text-xs font-bold text-gray-700 hover:border-indigo-300 hover:text-indigo-600
              hover:bg-indigo-50 transition-all duration-200 btn-press">
            <FiEye className="text-xs xs:text-sm" />
            <span className="hidden xs:inline">Details</span>
            <span className="xs:hidden">View</span>
          </Link>
          <button onClick={handleAdd}
            className={`flex items-center justify-center gap-1 xs:gap-1.5 py-2 xs:py-2.5 rounded-xl text-[10px] xs:text-xs font-bold
              transition-all duration-200 btn-press
              ${added ? "bg-emerald-500 text-white border-2 border-emerald-500"
                : "bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-indigo-600 shadow-md shadow-indigo-200"}`}>
            {added ? <><span>✓</span><span className="hidden xs:inline">Added!</span><span className="xs:hidden">✓</span></>
                   : <><FiShoppingCart className="text-xs xs:text-sm" /><span className="hidden xs:inline">Add</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allProducts,      setAllProducts]      = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search,           setSearch]           = useState("");
  const [activeCategory,   setActiveCategory]   = useState("");
  const [loading,          setLoading]          = useState(true);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q");
    if (q) setSearch(q);
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    api.get("/products")
      .then(res => { setAllProducts(res.data); setFilteredProducts(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let data = [...allProducts];
    if (activeCategory) data = data.filter(p => p.category?.toLowerCase()===activeCategory.toLowerCase() || p.title?.toLowerCase().includes(activeCategory.toLowerCase()));
    if (search.trim()) { const q=search.toLowerCase(); data=data.filter(p=>p.title?.toLowerCase().includes(q)||p.category?.toLowerCase().includes(q)); }
    setFilteredProducts(data);
  }, [search, activeCategory, allProducts]);

  const addToCart = async productId => {
    const uid = localStorage.getItem("userId");
    if (!uid) { navigate("/login"); return; }
    try {
      await api.post("/cart/add", { userId:uid, productId, quantity:1 });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {}
  };

  const FEATURES = [
    { icon:"🚚", label:"Free Delivery",  sub:"On all orders"   },
    { icon:"🔒", label:"Secure Payment", sub:"100% protected"   },
    { icon:"↩️", label:"Easy Returns",   sub:"7-day policy"     },
    { icon:"🎧", label:"24/7 Support",   sub:"Always here"      },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-4 xs:py-6 sm:py-8">
      <HeroSlider />

      {/* Features strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3 mb-6 xs:mb-8">
        {FEATURES.map(({ icon, label, sub }, i) => (
          <div key={label} className="bg-white rounded-xl sm:rounded-2xl px-2.5 xs:px-3 py-3 xs:py-3.5 flex items-center gap-2 xs:gap-3
            shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200
            card-hover animate-fade-in-up" style={{ animationDelay:`${i*80}ms` }}>
            <span className="text-xl xs:text-2xl flex-shrink-0">{icon}</span>
            <div className="min-w-0">
              <p className="text-[11px] xs:text-xs sm:text-sm font-bold text-gray-800 truncate">{label}</p>
              <p className="text-[10px] xs:text-xs text-gray-400 hidden sm:block">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 xs:p-4 mb-5 xs:mb-6 animate-fade-in-up">
        <div className="flex flex-col gap-3">
          {/* Search input */}
          <div className="relative">
            <span className="absolute left-3 xs:left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base xs:text-lg">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search laptops, mobiles, tablets..."
              className="w-full pl-9 xs:pl-10 pr-4 py-2.5 xs:py-3 rounded-xl border border-gray-200
                focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none
                text-xs xs:text-sm transition-all duration-200 bg-gray-50 focus:bg-white" />
          </div>

          {/* Category filters — horizontally scrollable on mobile */}
          <div className="flex gap-1.5 xs:gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory -mx-1 px-1">
            {CATEGORIES.map(cat => (
              <button key={cat||"all"} onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1 xs:gap-1.5 px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 rounded-xl text-xs xs:text-sm font-bold
                  whitespace-nowrap transition-all duration-200 btn-press flex-shrink-0 snap-start
                  ${activeCategory===cat ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                <span>{CAT_ICONS[cat]}</span>
                <span>{cat===""?"All":cat}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between mb-4 xs:mb-5">
        <div className="animate-fade-in-left">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <FiTrendingUp className="text-indigo-600" />
            {activeCategory ? `${activeCategory}s` : "All Products"}
          </h2>
          <p className="text-xs xs:text-sm text-gray-500 mt-0.5">{filteredProducts.length} products found</p>
        </div>
        {(search||activeCategory) && (
          <button onClick={() => { setSearch(""); setActiveCategory(""); }}
            className="text-xs xs:text-sm text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition animate-fade-in-right whitespace-nowrap ml-3">
            Clear ✕
          </button>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="aspect-square skeleton" />
              <div className="p-3 xs:p-4 space-y-2.5 xs:space-y-3">
                <div className="h-2 xs:h-2.5 skeleton rounded-full w-1/3" />
                <div className="h-3 xs:h-3.5 skeleton rounded-full w-full" />
                <div className="h-3 xs:h-3.5 skeleton rounded-full w-2/3" />
                <div className="h-5 xs:h-6 skeleton rounded-full w-1/2" />
                <div className="grid grid-cols-2 gap-1.5 xs:gap-2">
                  <div className="h-8 xs:h-10 skeleton rounded-xl" />
                  <div className="h-8 xs:h-10 skeleton rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 xs:py-24 animate-scale-in">
          <div className="text-5xl xs:text-7xl mb-4 xs:mb-5">🔍</div>
          <p className="text-gray-700 font-bold text-lg xs:text-xl mb-2">No products found</p>
          <p className="text-gray-400 text-xs xs:text-sm">Try a different search or category</p>
          <button onClick={() => { setSearch(""); setActiveCategory(""); }}
            className="mt-5 xs:mt-6 px-5 xs:px-6 py-2.5 xs:py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs xs:text-sm
              hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 btn-press">
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-5">
          {filteredProducts.map((item, i) => (
            <ProductCard key={item._id} item={item} onAddToCart={addToCart} index={i} />
          ))}
        </div>
      )}

      {/* Promo banner */}
      {!loading && filteredProducts.length > 0 && (
        <div className="mt-8 xs:mt-12 bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl xs:rounded-3xl
          p-6 xs:p-8 text-white text-center shadow-2xl shadow-indigo-300/30 animate-fade-in-up relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-12 -right-12 w-48 xs:w-64 h-48 xs:h-64 rounded-full bg-white/5 blur-2xl animate-float" />
            <div className="absolute -bottom-8 -left-8 w-36 xs:w-48 h-36 xs:h-48 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay:"1s" }} />
          </div>
          <div className="relative z-10">
            <span className="inline-block bg-white/20 text-white text-[10px] xs:text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3 xs:mb-4">🎁 Special Offer</span>
            <h3 className="text-xl xs:text-2xl sm:text-3xl font-black mb-2">Get 10% Off Your First Order</h3>
            <p className="text-indigo-200 text-xs xs:text-sm mb-5 xs:mb-6 max-w-xs xs:max-w-md mx-auto">
              Sign up today and save on your first purchase. Use code FIRST10 at checkout.
            </p>
            <Link to="/signup"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-black
                px-6 xs:px-8 py-3 xs:py-3.5 rounded-xl xs:rounded-2xl shadow-xl hover:-translate-y-1 transition-all duration-200 btn-press text-sm xs:text-base">
              Claim Offer <FiChevronRight />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}