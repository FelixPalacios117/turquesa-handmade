import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "./HeroSlider.css";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1515562141589-67f0d569b3b4?w=1400",
    tag: "Coleccion 2026",
    title: "Turquesa Handmade",
    subtitle: "Accesorios artesanales que realzan tu belleza natural",
    align: "center",
  },
  {
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=1400",
    tag: "Lo mas nuevo",
    title: "Nueva Temporada",
    subtitle: "Descubre las ultimas tendencias en joyeria y bisuteria artesanal",
    align: "left",
  },
  {
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1400",
    tag: "100% artesanal",
    title: "Hecho con Amor",
    subtitle: "Cada pieza cuenta una historia unica, elaborada con los mejores materiales",
    align: "right",
  },
];

export default function HeroSlider() {
  return (
    <section className="hero-slider">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1200}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="hero-swiper"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className={`hero-slide hero-align-${slide.align}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-gradient" />
              <div className="hero-content">
                <span className="hero-tag">{slide.tag}</span>
                <div className="hero-line" />
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <Link to="/catalogo" className="hero-btn">
                  Explorar Coleccion
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
