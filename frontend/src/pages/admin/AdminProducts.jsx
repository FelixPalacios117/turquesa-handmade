import { useState, useEffect } from "react";
import { FiPlus, FiCamera } from "react-icons/fi";
import { api } from "../../api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "", price: "", description: "", category_id: "", featured: false, image_url: "", stock: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const load = () => {
    api.getProducts().then(setProducts).catch(() => {});
    api.getCategories().then(setCategories).catch(() => {});
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm({ name: "", price: "", description: "", category_id: "", featured: false, image_url: "", stock: 0 });
    setImageFile(null);
    setImagePreview(null);
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
      stock: product.stock || 0,
    });
    setImageFile(null);
    setImagePreview(product.image || null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("description", form.description);
    fd.append("category_id", form.category_id);
    fd.append("featured", form.featured.toString());
    fd.append("stock", form.stock.toString());
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
    if (!confirm("Seguro que deseas eliminar este producto?")) return;
    await api.deleteProduct(id);
    load();
  };

  const stockColor = (stock) => {
    if (stock <= 0) return "#e74c3c";
    if (stock <= 5) return "#f39c12";
    return "#27ae60";
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
            <th>Categoria</th>
            <th>Precio</th>
            <th>Stock</th>
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
              <td>
                <span style={{
                  fontWeight: 600,
                  color: stockColor(p.stock || 0),
                }}>
                  {p.stock || 0}
                </span>
              </td>
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
              {/* Image preview + change */}
              <div className="form-group" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <label>Imagen del producto</label>
                <div
                  style={{
                    width: 160, height: 160, margin: "0.5rem auto", borderRadius: 12,
                    border: "2px dashed #ccc", overflow: "hidden", position: "relative",
                    background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => document.getElementById("product-image-input").click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ color: "#aaa", textAlign: "center" }}>
                      <FiCamera size={32} />
                      <p style={{ fontSize: "0.8rem", margin: "0.3rem 0 0" }}>Click para subir</p>
                    </div>
                  )}
                  {imagePreview && (
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "rgba(0,0,0,0.6)", color: "white",
                      fontSize: "0.75rem", padding: "4px", textAlign: "center",
                    }}>
                      <FiCamera style={{ verticalAlign: "middle" }} /> Cambiar foto
                    </div>
                  )}
                </div>
                <input
                  id="product-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <div style={{ marginTop: "0.5rem" }}>
                  <input
                    value={imageFile ? "" : form.image_url}
                    onChange={(e) => { setForm({ ...form, image_url: e.target.value }); setImagePreview(e.target.value); setImageFile(null); }}
                    placeholder="O pega una URL de imagen..."
                    style={{ width: "100%", padding: "8px 12px", border: "2px solid #e0e0e0", borderRadius: 8, fontSize: "0.85rem", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nombre</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Stock (unidades)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Categoria</label>
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
                <label>Descripcion</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
