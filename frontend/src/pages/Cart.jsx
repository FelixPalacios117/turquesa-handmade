import { useState } from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { api } from "../api";
import "./Cart.css";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [orderSent, setOrderSent] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      await api.createOrder({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        customer_address: form.address,
        payment_method: "contra_entrega",
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: Number(item.price),
        })),
      });
      clearCart();
      setOrderSent(true);
      setCheckout(false);
    } catch {
      alert("Error al procesar el pedido");
    }
  };

  if (orderSent) {
    return (
      <div className="cart-empty">
        <FiShoppingBag size={64} />
        <h2>Pedido realizado con éxito</h2>
        <p>Tu pedido ha sido registrado. El pago se realizará al momento de la entrega.</p>
        <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "0.5rem" }}>Te contactaremos por teléfono o email para coordinar la entrega.</p>
        <Link to="/catalogo" className="cta-btn">Seguir Comprando</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <FiShoppingBag size={64} />
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos desde nuestro catálogo</p>
        <Link to="/catalogo" className="cta-btn">Ir al Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Mi Carrito</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">${Number(item.price).toFixed(2)}</p>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <FiMinus />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <FiPlus />
                </button>
              </div>
              <p className="cart-item-subtotal">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </p>
              <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          {!checkout ? (
            <>
              <h2>Resumen</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="payment-info">
                <span>Pago contra entrega</span>
              </div>
              <button className="checkout-btn" onClick={() => setCheckout(true)}>
                Realizar Pedido
              </button>
              <button className="clear-btn" onClick={clearCart}>
                Vaciar Carrito
              </button>
            </>
          ) : (
            <form onSubmit={handleCheckout}>
              <h2>Datos del Pedido</h2>
              <div className="checkout-field">
                <input
                  required
                  placeholder="Nombre completo"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="checkout-field">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="checkout-field">
                <input
                  required
                  placeholder="Teléfono"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="checkout-field">
                <textarea
                  required
                  placeholder="Dirección de entrega"
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  style={{ resize: "vertical" }}
                />
              </div>
              <div className="payment-method-box">
                <div className="payment-method-selected">
                  <span>Método de pago:</span>
                  <strong>Pago contra entrega</strong>
                </div>
                <p className="payment-note">Pagas en efectivo al recibir tu pedido</p>
              </div>
              <div className="summary-row total">
                <span>Total a pagar</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button type="submit" className="checkout-btn">
                Confirmar Pedido
              </button>
              <button type="button" className="clear-btn" onClick={() => setCheckout(false)}>
                Volver
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
