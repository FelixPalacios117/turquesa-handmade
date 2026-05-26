import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { resolveImage } from "../api";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/producto/${product.id}`} className="product-card">
      <div className="product-image">
        <img src={resolveImage(product.image)} alt={product.name} />
        <button className="add-cart-btn" onClick={handleAdd}>
          <FiShoppingCart /> Agregar
        </button>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category_name || product.category}</span>
        <h3>{product.name}</h3>
        <p className="product-price">${Number(product.price).toFixed(2)}</p>
      </div>
    </Link>
  );
}
