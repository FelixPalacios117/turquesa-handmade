import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import React from "react";
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", color: "red" }}>
          <h2>Error en el componente</h2>
          <pre>{this.state.error?.message}</pre>
          <button onClick={() => window.location.reload()}>Recargar</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminPage({ children }) {
  return (
    <ErrorBoundary>
      <AdminLayout>{children}</AdminLayout>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/contacto" element={<Contact />} />
          </Route>
          <Route path="/admin" element={<AdminPage key="dash"><Dashboard /></AdminPage>} />
          <Route path="/admin/productos" element={<AdminPage key="prod"><AdminProducts /></AdminPage>} />
          <Route path="/admin/categorias" element={<AdminPage key="cat"><AdminCategories /></AdminPage>} />
          <Route path="/admin/pedidos" element={<AdminPage key="ord"><AdminOrders /></AdminPage>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
