import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import db from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });
const router = Router();

if (db.isPg) {
  // ==================== PostgreSQL ====================
  router.get("/", async (req, res) => {
    try {
      const { category, search, sort, featured } = req.query;
      let q = `SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
      const params = [];
      if (category) { params.push(category); q += ` AND c.slug = $${params.length}`; }
      if (search) { params.push(`%${search}%`); q += ` AND (p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`; }
      if (featured === "true") q += ` AND p.featured = true`;
      if (sort === "price-asc") q += ` ORDER BY p.price ASC`;
      else if (sort === "price-desc") q += ` ORDER BY p.price DESC`;
      else if (sort === "name") q += ` ORDER BY p.name ASC`;
      else q += ` ORDER BY p.id DESC`;
      const { rows } = await db.query(q, params);
      res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.get("/:id", async (req, res) => {
    try {
      const { rows } = await db.query(
        `SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1`,
        [req.params.id]
      );
      if (!rows.length) return res.status(404).json({ error: "No encontrado" });
      res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.post("/", upload.single("image"), async (req, res) => {
    try {
      const { name, price, description, category_id, featured } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || null;
      const { rows } = await db.query(
        `INSERT INTO products (name,price,description,category_id,image,featured) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [name, price, description, category_id, image, featured === "true"]
      );
      res.status(201).json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.put("/:id", upload.single("image"), async (req, res) => {
    try {
      const { name, price, description, category_id, featured } = req.body;
      let image = req.body.image_url;
      if (req.file) image = `/uploads/${req.file.filename}`;
      const q = image
        ? `UPDATE products SET name=$1,price=$2,description=$3,category_id=$4,featured=$5,image=$6,updated_at=NOW() WHERE id=$7 RETURNING *`
        : `UPDATE products SET name=$1,price=$2,description=$3,category_id=$4,featured=$5,updated_at=NOW() WHERE id=$6 RETURNING *`;
      const params = image
        ? [name, price, description, category_id, featured === "true", image, req.params.id]
        : [name, price, description, category_id, featured === "true", req.params.id];
      const { rows } = await db.query(q, params);
      if (!rows.length) return res.status(404).json({ error: "No encontrado" });
      res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const { rowCount } = await db.query("DELETE FROM products WHERE id=$1", [req.params.id]);
      if (!rowCount) return res.status(404).json({ error: "No encontrado" });
      res.json({ message: "Producto eliminado" });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

} else {
  // ==================== SQLite ====================
  router.get("/", (req, res) => {
    try {
      const { category, search, sort, featured } = req.query;
      let q = `SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
      const params = [];
      if (category) { params.push(category); q += ` AND c.slug = ?`; }
      if (search) { params.push(`%${search}%`, `%${search}%`); q += ` AND (p.name LIKE ? OR p.description LIKE ?)`; }
      if (featured === "true") q += ` AND p.featured = 1`;
      if (sort === "price-asc") q += ` ORDER BY p.price ASC`;
      else if (sort === "price-desc") q += ` ORDER BY p.price DESC`;
      else if (sort === "name") q += ` ORDER BY p.name ASC`;
      else q += ` ORDER BY p.id DESC`;
      const rows = db.prepare(q).all(...params);
      res.json(rows.map((r) => ({ ...r, featured: !!r.featured })));
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.get("/:id", (req, res) => {
    try {
      const row = db.prepare(
        `SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?`
      ).get(req.params.id);
      if (!row) return res.status(404).json({ error: "No encontrado" });
      res.json({ ...row, featured: !!row.featured });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.post("/", upload.single("image"), (req, res) => {
    try {
      const { name, price, description, category_id, featured } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || null;
      const result = db.prepare(
        `INSERT INTO products (name,price,description,category_id,image,featured) VALUES (?,?,?,?,?,?)`
      ).run(name, price, description, category_id, image, featured === "true" ? 1 : 0);
      const row = db.prepare("SELECT * FROM products WHERE id = ?").get(result.lastInsertRowid);
      res.status(201).json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.put("/:id", upload.single("image"), (req, res) => {
    try {
      const { name, price, description, category_id, featured } = req.body;
      let image = req.body.image_url;
      if (req.file) image = `/uploads/${req.file.filename}`;
      if (image) {
        db.prepare(`UPDATE products SET name=?,price=?,description=?,category_id=?,featured=?,image=?,updated_at=datetime('now') WHERE id=?`)
          .run(name, price, description, category_id, featured === "true" ? 1 : 0, image, req.params.id);
      } else {
        db.prepare(`UPDATE products SET name=?,price=?,description=?,category_id=?,featured=?,updated_at=datetime('now') WHERE id=?`)
          .run(name, price, description, category_id, featured === "true" ? 1 : 0, req.params.id);
      }
      const row = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
      if (!row) return res.status(404).json({ error: "No encontrado" });
      res.json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  router.delete("/:id", (req, res) => {
    try {
      const result = db.prepare("DELETE FROM products WHERE id=?").run(req.params.id);
      if (!result.changes) return res.status(404).json({ error: "No encontrado" });
      res.json({ message: "Producto eliminado" });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
}

export default router;
