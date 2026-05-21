import { NavLink } from "react-router-dom";
import { FiBox, FiGrid, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import "./Admin.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Panel Admin</h2>
        <nav className="admin-nav">
          <NavLink to="/admin" end>
            <FiGrid /> Dashboard
          </NavLink>
          <NavLink to="/admin/productos">
            <FiBox /> Productos
          </NavLink>
          <NavLink to="/admin/categorias">
            <FiGrid /> Categorías
          </NavLink>
          <NavLink to="/admin/pedidos">
            <FiShoppingBag /> Pedidos
          </NavLink>
        </nav>
        <NavLink to="/" className="admin-back">
          <FiArrowLeft /> Volver a la tienda
        </NavLink>
      </aside>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
