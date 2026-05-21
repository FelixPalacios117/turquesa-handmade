import { Link } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Turquesa
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/catalogo" onClick={() => setMenuOpen(false)}>
              Catálogo
            </Link>
          </li>
          <li>
            <Link to="/nosotros" onClick={() => setMenuOpen(false)}>
              Nosotros
            </Link>
          </li>
          <li>
            <Link to="/contacto" onClick={() => setMenuOpen(false)}>
              Contacto
            </Link>
          </li>
        </ul>

        <Link to="/carrito" className="cart-icon">
          <FiShoppingCart size={22} />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </Link>
      </div>
    </nav>
  );
}
