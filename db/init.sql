CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(10) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(200) NOT NULL,
  customer_email VARCHAR(200),
  customer_phone VARCHAR(50),
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL
);

-- Seed categories
INSERT INTO categories (name, slug, icon) VALUES
  ('Anillos', 'anillos', '💍'),
  ('Collares', 'collares', '📿'),
  ('Pulseras', 'pulseras', '⌚'),
  ('Aretes', 'aretes', '✨');

-- Seed products
INSERT INTO products (name, price, description, image, category_id, featured) VALUES
  ('Anillo de Plata con Zirconia', 45.99, 'Elegante anillo de plata esterlina con piedra de zirconia cúbica.', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', 1, true),
  ('Anillo Dorado Minimalista', 32.50, 'Anillo dorado con diseño minimalista, perfecto para uso diario.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', 1, false),
  ('Anillo de Compromiso Clásico', 189.99, 'Hermoso anillo de compromiso con diseño clásico y elegante.', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400', 1, true),
  ('Collar de Perlas Naturales', 78.00, 'Collar con perlas naturales cultivadas, broche de plata.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', 2, true),
  ('Cadena de Oro Rosa', 55.00, 'Delicada cadena en tono oro rosa con dije de corazón.', 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400', 2, false),
  ('Gargantilla de Cristales', 42.00, 'Gargantilla con cristales brillantes, ideal para ocasiones especiales.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', 2, true),
  ('Pulsera de Charms', 65.00, 'Pulsera con dijes variados, personalizable y única.', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400', 3, true),
  ('Brazalete Tejido Artesanal', 28.00, 'Brazalete tejido a mano con hilos de colores y cuentas.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', 3, false),
  ('Pulsera de Plata con Dijes', 52.00, 'Pulsera de plata esterlina con dijes de estrellas y lunas.', 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400', 3, false),
  ('Aretes de Argolla Dorados', 25.00, 'Aretes de argolla en tono dorado, diseño clásico atemporal.', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400', 4, true),
  ('Pendientes de Cristal', 38.00, 'Pendientes largos con cristales que brillan con la luz.', 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400', 4, true),
  ('Aretes Flor de Perla', 34.00, 'Aretes en forma de flor con centro de perla cultivada.', 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400', 4, false);
