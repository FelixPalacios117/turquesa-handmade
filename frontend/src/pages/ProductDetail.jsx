import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { api } from "../api";
import ProductCard from "../components/ProductCard";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getProduct(id).then((p) => {
      setProduct(p);
      if (p.category_slug) {
        api.getProducts({ category: p.category_slug }).then((all) => {
          setRelated(all.filter((r) => r.id !== p.id).slice(0, 3));
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="not-found"><p>Cargando...</p></div>;

  if (!product) {
    return (
      <div className="not-found">
        <h2>Producto no encontrado</h2>
        <Link to="/catalogo">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Link to="/catalogo" className="back-link">
        <FiArrowLeft /> Volver al catálogo
      </Link>

      <div className="product-detail">
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-info">
          <span className="detail-category">{product.category_name}</span>
          <h1>{product.name}</h1>
          <p className="detail-price">${Number(product.price).toFixed(2)}</p>
          <p className="detail-description">{product.description}</p>
          <button className="detail-add-btn" onClick={() => addToCart(product)}>
            <FiShoppingCart /> Agregar al Carrito
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related-section">
          <h2>Productos Relacionados</h2>
          <div className="related-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
