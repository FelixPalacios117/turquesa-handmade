import { FiInstagram, FiFacebook, FiMail, FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3 className="footer-logo">Turquesa</h3>
          <p>Tu tienda de confianza en bisutería y joyería artesanal. Piezas únicas para cada ocasión.</p>
        </div>
        <div className="footer-col">
          <h4>Enlaces</h4>
          <Link to="/">Inicio</Link>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
        </div>
        <div className="footer-col">
          <h4>Categorías</h4>
          <Link to="/catalogo?cat=anillos">Anillos</Link>
          <Link to="/catalogo?cat=collares">Collares</Link>
          <Link to="/catalogo?cat=pulseras">Pulseras</Link>
          <Link to="/catalogo?cat=aretes">Aretes</Link>
        </div>
        <div className="footer-col">
          <h4>Contacto</h4>
          <p><FiPhone /> +503 7845-2391</p>
          <p><FiMail /> info@turquesa.com</p>
          <div className="social-links">
            <a href="https://www.instagram.com/turquesa__handmade/" target="_blank" rel="noopener noreferrer"><FiInstagram size={20} /></a>
            <a href="https://www.instagram.com/turquesa__handmade/" target="_blank" rel="noopener noreferrer"><FiFacebook size={20} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Turquesa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
