import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { api } from "../../api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", icon: "" });

  const load = () => api.getCategories().then(setCategories).catch(() => {});
  useEffect(load, []);

  const openCreate = () => {
    setForm({ name: "", slug: "", icon: "" });
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditing(cat.id);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.updateCategory(editing, form);
    } else {
      await api.createCategory(form);
    }
    setShowModal(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    await api.deleteCategory(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Categorías</h1>
        <button className="admin-btn" onClick={openCreate}>
          <FiPlus /> Nueva Categoría
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Icono</th>
            <th>Nombre</th>
            <th>Slug</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td style={{ fontSize: "1.5rem" }}>{c.icon}</td>
              <td>{c.name}</td>
              <td><code>{c.slug}</code></td>
              <td>{c.product_count}</td>
              <td>
                <div className="table-actions">
                  <button className="btn-edit" onClick={() => openEdit(c)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(c.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? "Editar Categoría" : "Nueva Categoría"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Slug (URL)</label>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="ej: anillos"
                />
              </div>
              <div className="form-group">
                <label>Icono (emoji)</label>
                <input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="ej: 💍"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="admin-btn secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn">
                  {editing ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
