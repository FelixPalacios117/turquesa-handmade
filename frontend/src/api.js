import staticProducts, { categories as staticCategories } from "./data/products";

const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Error en la peticion");
  }
  return res.json();
}

// Fallback: filters static products to mimic API behavior
function filterStaticProducts(params = {}) {
  let result = [...staticProducts];
  if (params.category) {
    result = result.filter((p) => p.category === params.category);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  if (params.featured === "true") {
    result = result.filter((p) => p.featured);
  }
  if (params.sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (params.sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (params.sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

export const api = {
  // Products
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ""}`).catch(() => filterStaticProducts(params));
  },
  getProduct: (id) =>
    request(`/products/${id}`).catch(() => {
      const p = staticProducts.find((p) => p.id === Number(id));
      if (!p) throw new Error("No encontrado");
      return p;
    }),
  createProduct: (formData) =>
    fetch(`${BASE}/products`, { method: "POST", body: formData }).then((r) => r.json()),
  updateProduct: (id, formData) =>
    fetch(`${BASE}/products/${id}`, { method: "PUT", body: formData }).then((r) => r.json()),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  // Categories
  getCategories: () => request("/categories").catch(() => staticCategories),
  createCategory: (data) =>
    request("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id, data) =>
    request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: () => request("/orders").catch(() => []),
  createOrder: (data) =>
    request("/orders", { method: "POST", body: JSON.stringify(data) }),
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }),
};
