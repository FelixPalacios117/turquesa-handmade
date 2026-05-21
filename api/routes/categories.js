import { Router } from "express";
import db from "../db.js";

const router = Router();

if (db.isPg) {
  router.get("/", async (_req, res) => {
    try {
      const { rows } = await db.query(`SELECT c.*, COUNT(p.id)::int as product_count FROM categories c LEFT JOIN products p ON p.category_id = c.id GROUP BY c.id ORDER BY c.name`);
      res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.get("/:id", async (req, res) => {
    try {
      const { rows } = await db.query("SELECT * FROM categories WHERE id = $1", [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: "No encontrada" });
      res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.post("/", async (req, res) => {
    try {
      const { name, slug, icon } = req.body;
      const { rows } = await db.query("INSERT INTO categories (name,slug,icon) VALUES ($1,$2,$3) RETURNING *", [name, slug, icon]);
      res.status(201).json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.put("/:id", async (req, res) => {
    try {
      const { name, slug, icon } = req.body;
      const { rows } = await db.query("UPDATE categories SET name=$1,slug=$2,icon=$3 WHERE id=$4 RETURNING *", [name, slug, icon, req.params.id]);
      if (!rows.length) return res.status(404).json({ error: "No encontrada" });
      res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.delete("/:id", async (req, res) => {
    try {
      const { rowCount } = await db.query("DELETE FROM categories WHERE id=$1", [req.params.id]);
      if (!rowCount) return res.status(404).json({ error: "No encontrada" });
      res.json({ message: "Categoria eliminada" });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
} else {
  router.get("/", (_req, res) => {
    try {
      const rows = db.prepare(`SELECT c.*, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON p.category_id = c.id GROUP BY c.id ORDER BY c.name`).all();
      res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.get("/:id", (req, res) => {
    try {
      const row = db.prepare("SELECT * FROM categories WHERE id = ?").get(req.params.id);
      if (!row) return res.status(404).json({ error: "No encontrada" });
      res.json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.post("/", (req, res) => {
    try {
      const { name, slug, icon } = req.body;
      const result = db.prepare("INSERT INTO categories (name,slug,icon) VALUES (?,?,?)").run(name, slug, icon);
      const row = db.prepare("SELECT * FROM categories WHERE id = ?").get(result.lastInsertRowid);
      res.status(201).json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.put("/:id", (req, res) => {
    try {
      const { name, slug, icon } = req.body;
      const result = db.prepare("UPDATE categories SET name=?,slug=?,icon=? WHERE id=?").run(name, slug, icon, req.params.id);
      if (!result.changes) return res.status(404).json({ error: "No encontrada" });
      const row = db.prepare("SELECT * FROM categories WHERE id = ?").get(req.params.id);
      res.json(row);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.delete("/:id", (req, res) => {
    try {
      const result = db.prepare("DELETE FROM categories WHERE id=?").run(req.params.id);
      if (!result.changes) return res.status(404).json({ error: "No encontrada" });
      res.json({ message: "Categoria eliminada" });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
}

export default router;
