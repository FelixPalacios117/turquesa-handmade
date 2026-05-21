import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";

function StoreLayout() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "60vh" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <StoreLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/catalogo", element: <Catalog /> },
      { path: "/producto/:id", element: <ProductDetail /> },
      { path: "/carrito", element: <Cart /> },
      { path: "/nosotros", element: <About /> },
      { path: "/contacto", element: <Contact /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "productos", element: <AdminProducts /> },
      { path: "categorias", element: <AdminCategories /> },
      { path: "pedidos", element: <AdminOrders /> },
    ],
  },
]);

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
