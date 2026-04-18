import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* =======================
   Lazy Loaded Pages
======================= */

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const CheckoutAddress = lazy(() => import("./pages/CheckoutAddress"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const AuthSuccess = lazy(() => import("./pages/AuthSuccess"));

/* Admin */
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const AddProduct = lazy(() => import("./admin/AddProduct"));
const EditProduct = lazy(() => import("./admin/EditProduct"));
const ProductList = lazy(() => import("./admin/ProductList"));
const Orders = lazy(() => import("./admin/Orders"));
const Customers = lazy(() => import("./admin/Customers"));
const Analytics = lazy(() => import("./admin/Analytics"));
const Settings = lazy(() => import("./admin/Settings"));

/* =======================
   Layout
======================= */

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

/* =======================
   Router
======================= */

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/auth-success", element: <AuthSuccess /> },
      { path: "/product/:id", element: <ProductDetails /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout-address", element: <CheckoutAddress /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/order-success/:id", element: <OrderSuccess /> },
      {
        path: "*",
        element: (
          <h1 className="text-center py-20 text-2xl font-bold text-gray-500">
            Page Not Found
          </h1>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <ProductList /> },
      { path: "products/add", element: <AddProduct /> },
      { path: "products/update/:id", element: <EditProduct /> },
      { path: "orders", element: <Orders /> },
      { path: "customers", element: <Customers /> },
      { path: "analytics", element: <Analytics /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

/* =======================
   App
======================= */

export default function App() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}