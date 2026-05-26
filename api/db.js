const USE_PG = !!process.env.DATABASE_URL;

let db;

if (USE_PG) {
  // ---- PostgreSQL (Render / Docker) ----
  const pg = await import("pg");
  const pool = new pg.default.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false },
  });

  // Init tables
  await pool.query(`
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
      image TEXT,
      category_id INT REFERENCES categories(id) ON DELETE SET NULL,
      featured BOOLEAN DEFAULT false,
      stock INT DEFAULT 0,
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
  `);

  // Migration: add stock column if missing
  const { rows: cols } = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='products' AND column_name='stock'`);
  if (cols.length === 0) await pool.query(`ALTER TABLE products ADD COLUMN stock INT DEFAULT 0`);

  // Migration: change image column to TEXT for base64 storage
  await pool.query(`ALTER TABLE products ALTER COLUMN image TYPE TEXT`);

  // Migration: clear broken /uploads/ paths (files don't persist on Render)
  await pool.query(`UPDATE products SET image = NULL WHERE image LIKE '/uploads/%'`);

  // Seed if empty
  const { rows } = await pool.query("SELECT COUNT(*) as c FROM categories");
  if (Number(rows[0].c) === 0) {
    await pool.query(`
      INSERT INTO categories (name, slug, icon) VALUES
        ('Anillos', 'anillos', '💍'), ('Collares', 'collares', '📿'),
        ('Pulseras', 'pulseras', '⌚'), ('Aretes', 'aretes', '✨');
      INSERT INTO products (name, price, description, image, category_id, featured) VALUES
        ('Anillo de Plata con Zirconia', 45.99, 'Elegante anillo de plata esterlina.', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', 1, true),
        ('Anillo Dorado Minimalista', 32.50, 'Anillo dorado minimalista.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', 1, false),
        ('Anillo de Compromiso', 189.99, 'Anillo de compromiso clasico.', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400', 1, true),
        ('Collar de Perlas', 78.00, 'Collar con perlas naturales.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', 2, true),
        ('Cadena de Oro Rosa', 55.00, 'Cadena en tono oro rosa.', 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400', 2, false),
        ('Gargantilla de Cristales', 42.00, 'Gargantilla con cristales.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', 2, true),
        ('Pulsera de Charms', 65.00, 'Pulsera con dijes variados.', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400', 3, true),
        ('Brazalete Tejido', 28.00, 'Brazalete tejido a mano.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', 3, false),
        ('Pulsera de Plata', 52.00, 'Pulsera de plata con dijes.', 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400', 3, false),
        ('Aretes de Argolla', 25.00, 'Aretes de argolla dorados.', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400', 4, true),
        ('Pendientes de Cristal', 38.00, 'Pendientes largos de cristal.', 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400', 4, true),
        ('Aretes Flor de Perla', 34.00, 'Aretes en forma de flor.', 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400', 4, false);
    `);
    console.log("PostgreSQL: datos de ejemplo insertados");
  }

  // Wrapper to match SQLite-like interface used by routes
  db = {
    _pg: pool,
    prepare(sql) {
      return {
        all(...params) { throw new Error("Use db.query() for PG"); },
        get(...params) { throw new Error("Use db.query() for PG"); },
        run(...params) { throw new Error("Use db.query() for PG"); },
      };
    },
    // Direct query for PG
    async query(sql, params) { return pool.query(sql, params); },
    async transaction(fn) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await fn(client);
        await client.query("COMMIT");
        return result;
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    },
    isPg: true,
  };

  console.log("Conectado a PostgreSQL");
} else {
  // ---- SQLite (local dev) ----
  const { default: Database } = await import("better-sqlite3");
  const path = await import("path");
  const { fileURLToPath } = await import("url");

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const dbPath = path.join(__dirname, "brillante.db");
  const sqlite = new Database(dbPath);

  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, icon TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, price REAL NOT NULL, description TEXT, image TEXT,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      featured INTEGER DEFAULT 0, stock INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL, customer_email TEXT, customer_phone TEXT,
      total REAL NOT NULL, status TEXT DEFAULT 'pendiente',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      quantity INTEGER NOT NULL DEFAULT 1, price REAL NOT NULL
    );
  `);

  // Migration: add stock column if missing
  const hasStock = sqlite.prepare(`SELECT COUNT(*) as c FROM pragma_table_info('products') WHERE name='stock'`).get().c;
  if (!hasStock) sqlite.exec(`ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0`);

  const catCount = sqlite.prepare("SELECT COUNT(*) as c FROM categories").get().c;
  if (catCount === 0) {
    const ic = sqlite.prepare("INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)");
    ic.run("Anillos","anillos","💍"); ic.run("Collares","collares","📿");
    ic.run("Pulseras","pulseras","⌚"); ic.run("Aretes","aretes","✨");
    const ip = sqlite.prepare("INSERT INTO products (name,price,description,image,category_id,featured) VALUES (?,?,?,?,?,?)");
    ip.run("Anillo de Plata con Zirconia",45.99,"Elegante anillo de plata esterlina.","https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",1,1);
    ip.run("Anillo Dorado Minimalista",32.50,"Anillo dorado minimalista.","https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",1,0);
    ip.run("Anillo de Compromiso",189.99,"Anillo de compromiso clasico.","https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400",1,1);
    ip.run("Collar de Perlas",78.00,"Collar con perlas naturales.","https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",2,1);
    ip.run("Cadena de Oro Rosa",55.00,"Cadena en tono oro rosa.","https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400",2,0);
    ip.run("Gargantilla de Cristales",42.00,"Gargantilla con cristales.","https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",2,1);
    ip.run("Pulsera de Charms",65.00,"Pulsera con dijes variados.","https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",3,1);
    ip.run("Brazalete Tejido",28.00,"Brazalete tejido a mano.","https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",3,0);
    ip.run("Pulsera de Plata",52.00,"Pulsera de plata con dijes.","https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400",3,0);
    ip.run("Aretes de Argolla",25.00,"Aretes de argolla dorados.","https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400",4,1);
    ip.run("Pendientes de Cristal",38.00,"Pendientes largos de cristal.","https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400",4,1);
    ip.run("Aretes Flor de Perla",34.00,"Aretes en forma de flor.","https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400",4,0);
    console.log("SQLite: datos de ejemplo insertados");
  }

  db = sqlite;
  db.isPg = false;
  console.log("Conectado a SQLite (local)");
}

export default db;
