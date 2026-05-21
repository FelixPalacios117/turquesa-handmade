import { Router } from "express";
import db from "../db.js";

const router = Router();

if (db.isPg) {
  router.get("/", async (_req, res) => {
    try {
      const { rows } = await db.query(`
        SELECT o.*, json_agg(json_build_object('product_id',oi.product_id,'product_name',p.name,'quantity',oi.quantity,'price',oi.price)) as items
        FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id LEFT JOIN products p ON p.id = oi.product_id
        GROUP BY o.id ORDER BY o.created_at DESC
      `);
      res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.post("/", async (req, res) => {
    try {
      const { customer_name, customer_email, customer_phone, items } = req.body;
      const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const order = await db.transaction(async (client) => {
        const { rows: [o] } = await client.query(
          `INSERT INTO orders (customer_name,customer_email,customer_phone,total) VALUES ($1,$2,$3,$4) RETURNING *`,
          [customer_name, customer_email, customer_phone, total]
        );
        for (const item of items) {
          await client.query(`INSERT INTO order_items (order_id,product_id,quantity,price) VALUES ($1,$2,$3,$4)`, [o.id, item.product_id, item.quantity, item.price]);
        }
        return o;
      });
      res.status(201).json(order);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.put("/:id/status", async (req, res) => {
    try {
      const { rows } = await db.query("UPDATE orders SET status=$1 WHERE id=$2 RETURNING *", [req.body.status, req.params.id]);
      if (!rows.length) return res.status(404).json({ error: "No encontrado" });
      res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
} else {
  router.get("/", (_req, res) => {
    try {
      const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
      const getItems = db.prepare(`SELECT oi.*, p.name as product_name FROM order_items oi LEFT JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?`);
      res.json(orders.map((o) => ({ ...o, items: getItems.all(o.id) })));
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.post("/", (req, res) => {
    try {
      const { customer_name, customer_email, customer_phone, items } = req.body;
      const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const insertOrder = db.prepare(`INSERT INTO orders (customer_name,customer_email,customer_phone,total) VALUES (?,?,?,?)`);
      const insertItem = db.prepare(`INSERT INTO order_items (order_id,product_id,quantity,price) VALUES (?,?,?,?)`);
      const tx = db.transaction(() => {
        const r = insertOrder.run(customer_name, customer_email, customer_phone, total);
        for (const item of items) insertItem.run(r.lastInsertRowid, item.product_id, item.quantity, item.price);
        return db.prepare("SELECT * FROM orders WHERE id = ?").get(r.lastInsertRowid);
      });
      res.status(201).json(tx());
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
  router.put("/:id/status", (req, res) => {
    try {
      const result = db.prepare("UPDATE orders SET status=? WHERE id=?").run(req.body.status, req.params.id);
      if (!result.changes) return res.status(404).json({ error: "No encontrado" });
      res.json(db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id));
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
}

export default router;
