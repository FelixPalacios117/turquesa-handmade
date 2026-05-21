import React, { useState, useEffect } from "react";
import { api } from "../../api";

const STATUSES = ["pendiente", "procesando", "enviado", "entregado", "cancelado"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const load = () => {
    setLoading(true);
    api.getOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const changeStatus = async (id, status) => {
    await api.updateOrderStatus(id, status);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Pedidos</h1>
      </div>

      {loading ? (
        <p style={{ color: "#999", textAlign: "center", padding: "3rem" }}>
          Cargando pedidos...
        </p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
          <h3 style={{ color: "#666", marginBottom: "0.5rem" }}>No hay pedidos aún</h3>
          <p style={{ color: "#999" }}>Los pedidos realizados desde la tienda aparecerán aquí.</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
                  <td>#{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_email}</td>
                  <td>${Number(order.total).toFixed(2)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => changeStatus(order.id, e.target.value)}
                      className={`status-badge status-${order.status}`}
                      style={{ border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: "12px" }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    >
                      {expandedId === order.id ? "Ocultar" : "Ver Items"}
                    </button>
                  </td>
                </tr>
                {expandedId === order.id && (
                  <tr>
                    <td colSpan={7} style={{ background: "#f9f9f9", padding: "1rem" }}>
                      <strong>Items del pedido:</strong>
                      <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                        {order.items?.filter(i => i.product_id).map((item, idx) => (
                          <li key={idx}>
                            {item.product_name} x{item.quantity} — ${Number(item.price).toFixed(2)} c/u
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
