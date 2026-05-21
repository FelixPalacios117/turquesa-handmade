import { useState, useEffect } from "react";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { api } from "../api";
import "./Home.css";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getProducts({ featured: "true" }).then(setFeatured).catch(() => {});
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <div className="home">
      <HeroSlider />

      <section className="section categories-section">
        <h2 className="section-title">Nuestras Categorías</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              to={`/catalogo?cat=${cat.slug}`}
              key={cat.id}
              className="category-card"
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Productos Destacados</h2>
        <div className="products-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="section-cta">
          <Link to="/catalogo" className="cta-btn">
            Ver Todo el Catálogo
          </Link>
        </div>
      </section>

      <section className="section testimonials-section">
        <h2 className="section-title">Lo que dicen nuestras clientas</h2>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3500 }}
          loop
          spaceBetween={30}
          className="testimonials-swiper"
        >
          {[
            { name: "María G.", text: "Las joyas son hermosas y de excelente calidad. Mi collar de perlas es mi favorito." },
            { name: "Ana R.", text: "Compré un anillo de compromiso y quedó perfecto. El servicio fue increíble." },
            { name: "Laura P.", text: "Los aretes que compré brillan hermoso. Siempre recibo cumplidos cuando los uso." },
          ].map((t, i) => (
            <SwiperSlide key={i}>
              <div className="testimonial-card">
                <p>"{t.text}"</p>
                <strong>- {t.name}</strong>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
}
