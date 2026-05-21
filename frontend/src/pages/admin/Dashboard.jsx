import { useState, useEffect } from "react";
import { FiBox, FiGrid, FiShoppingBag, FiDollarSign } from "react-icons/fi";
import { api } from "../../api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.getProducts().then(setProducts).catch(() => {});
    api.getCategories().then(setCategories).catch(() => {});
    api.getOrders().then(setOrders).catch(() => {});
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div>
      <h1 style={{ fontFamily: "Georgia, serif", color: "#1B2D2A", marginBottom: "1.5rem" }}>
        Dashboard
      </h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon"><FiBox size={24} /></div>
          <h3>Productos</h3>
          <div className="stat-value">{products.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiGrid size={24} /></div>
          <h3>Categorías</h3>
          <div className="stat-value">{categories.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiShoppingBag size={24} /></div>
          <h3>Pedidos</h3>
          <div className="stat-value">{orders.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiDollarSign size={24} /></div>
          <h3>Ingresos</h3>
          <div className="stat-value">${totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      <h2 style={{ marginBottom: "1rem" }}>Pedidos Recientes</h2>
      {orders.length === 0 ? (
        <p style={{ color: "#999" }}>No hay pedidos aún.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer_name}</td>
                <td>${Number(order.total).toFixed(2)}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
