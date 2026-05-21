import { useLocation } from "react-router-dom";
import { FiBox, FiGrid, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import "./Admin.css";

const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: FiGrid, exact: true },
  { path: "/admin/productos", label: "Productos", icon: FiBox },
  { path: "/admin/categorias", label: "Categorías", icon: FiGrid },
  { path: "/admin/pedidos", label: "Pedidos", icon: FiShoppingBag },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();

  const isActive = (item) =>
    item.exact ? pathname === item.path : pathname.startsWith(item.path);

  return (
    <div className="admin-wrapper">
      <header className="admin-topbar">
        <a href="/admin" className="admin-logo">Panel Admin</a>
        <nav className="admin-topnav">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`admin-topnav-link${isActive(item) ? " active" : ""}`}
            >
              <item.icon size={16} />
              {item.label}
            </a>
          ))}
        </nav>
        <a href="/" className="admin-topnav-link admin-back-link">
          <FiArrowLeft size={16} />
          Tienda
        </a>
      </header>
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
