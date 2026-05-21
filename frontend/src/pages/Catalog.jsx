import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { api } from "../api";
import "./Catalog.css";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get("cat") || "todos");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const params = {};
    if (activeCategory !== "todos") params.category = activeCategory;
    if (search.trim()) params.search = search;
    if (sortBy !== "default") params.sort = sortBy;
    api.getProducts(params).then(setProducts).catch(() => {});
  }, [activeCategory, search, sortBy]);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === "todos") {
      searchParams.delete("cat");
    } else {
      searchParams.set("cat", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="catalog-page">
      <div className="catalog-header">
        <h1>Catálogo</h1>
        <p>Explora nuestra colección completa de joyería y bisutería</p>
      </div>

      <div className="catalog-controls">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="default">Ordenar por</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="name">Nombre A-Z</option>
        </select>
      </div>

      <div className="catalog-filters">
        <button
          className={`filter-btn ${activeCategory === "todos" ? "active" : ""}`}
          onClick={() => handleCategory("todos")}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-btn ${activeCategory === cat.slug ? "active" : ""}`}
            onClick={() => handleCategory(cat.slug)}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="no-results">No se encontraron productos.</p>
      ) : (
        <div className="catalog-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
