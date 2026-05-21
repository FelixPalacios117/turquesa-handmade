import { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contáctanos</h1>
        <p>Estamos aquí para ayudarte</p>
      </div>

      <div className="contact-layout">
        <div className="contact-info">
          <div className="info-item">
            <FiPhone size={24} />
            <div>
              <h3>Teléfono</h3>
              <p>+503 7845-2391</p>
            </div>
          </div>
          <div className="info-item">
            <FiMail size={24} />
            <div>
              <h3>Email</h3>
              <p>info@brillante.com</p>
            </div>
          </div>
          <div className="info-item">
            <FiMapPin size={24} />
            <div>
              <h3>Ubicación</h3>
              <p>Centro Comercial Plaza, Local 42</p>
            </div>
          </div>
          <div className="info-item">
            <FiClock size={24} />
            <div>
              <h3>Horario</h3>
              <p>Lun - Sáb: 9:00 AM - 7:00 PM</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {sent && (
            <div className="success-msg">
              Mensaje enviado correctamente. Te responderemos pronto.
            </div>
          )}
          <input
            type="text"
            placeholder="Tu nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Tu email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <textarea
            placeholder="Tu mensaje"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
          <button type="submit">Enviar Mensaje</button>
        </form>
      </div>
    </div>
  );
}
