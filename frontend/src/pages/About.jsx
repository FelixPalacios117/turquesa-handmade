import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>Sobre Nosotros</h1>
        <p>Conoce la historia detrás de cada pieza</p>
      </div>

      <div className="about-content">
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600"
            alt="Taller de joyería"
          />
        </div>
        <div className="about-text">
          <h2>Nuestra Historia</h2>
          <p>
            <strong>Turquesa Handmade</strong> nació en 2020 como un emprendimiento
            familiar dedicado a la creación de joyería y bisutería artesanal.
            Cada pieza que ofrecemos es cuidadosamente seleccionada o elaborada
            con los mejores materiales.
          </p>
          <p>
            Nos apasiona crear accesorios que cuenten historias y resalten la
            belleza única de cada persona. Desde anillos de compromiso hasta
            pulseras casuales, nuestro catálogo está diseñado para acompañarte
            en cada momento especial.
          </p>
        </div>
      </div>

      <div className="values-section">
        <h2>Nuestros Valores</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Calidad</h3>
            <p>
              Seleccionamos materiales de primera para garantizar durabilidad y
              brillo en cada pieza.
            </p>
          </div>
          <div className="value-card">
            <h3>Artesanía</h3>
            <p>
              Cada joya es elaborada con dedicación y atención al detalle por
              nuestros artesanos.
            </p>
          </div>
          <div className="value-card">
            <h3>Originalidad</h3>
            <p>
              Diseños exclusivos que no encontrarás en ningún otro lugar.
              Piezas tan únicas como tú.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
