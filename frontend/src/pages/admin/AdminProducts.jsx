import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { api } from "../../api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "", price: "", description: "", category_id: "", featured: false, image_url: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const load = () => {
    api.getProducts().then(setProducts).catch(() => {});
    api.getCategories().then(setCategories).catch(() => {});
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm({ name: "", price: "", description: "", category_id: "", featured: false, image_url: "" });
    setImageFile(null);
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
      category_id: product.category_id || "",
      featured: product.featured,
      image_url: product.image || "",
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("description", form.description);
    fd.append("category_id", form.category_id);
    fd.append("featured", form.featured.toString());
    if (imageFile) {
      fd.append("image", imageFile);
    } else if (form.image_url) {
      fd.append("image_url", form.image_url);
    }

    if (editing) {
      await api.updateProduct(editing, fd);
    } else {
      await api.createProduct(fd);
    }
    setShowModal(false);
    resetForm();
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    await api.deleteProduct(id);
    load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Productos</h1>
        <button className="admin-btn" onClick={openCreate}>
          <FiPlus /> Nuevo Producto
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Destacado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td><img src={p.image} alt={p.name} /></td>
              <td>{p.name}</td>
              <td>{p.category_name}</td>
              <td>${Number(p.price).toFixed(2)}</td>
              <td>{p.featured ? "Si" : "No"}</td>
              <td>
                <div className="table-actions">
                  <button className="btn-edit" onClick={() => openEdit(p)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(p.id)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? "Editar Producto" : "Nuevo Producto"}</h2>
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
                <label>Precio</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select
                  required
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Imagen (archivo)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
              <div className="form-group">
                <label>O URL de imagen</label>
                <input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  Producto destacado
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="admin-btn secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn">
                  {editing ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
