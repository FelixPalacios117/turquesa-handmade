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
      const { status } = req.body;
      const orderId = req.params.id;
      // Get current status before updating
      const { rows: current } = await db.query("SELECT status FROM orders WHERE id=$1", [orderId]);
      if (!current.length) return res.status(404).json({ error: "No encontrado" });

      const { rows } = await db.query("UPDATE orders SET status=$1 WHERE id=$2 RETURNING *", [status, orderId]);

      // Subtract stock when order is marked as "entregado"
      if (status === "entregado" && current[0].status !== "entregado") {
        const { rows: items } = await db.query("SELECT product_id, quantity FROM order_items WHERE order_id=$1", [orderId]);
        for (const item of items) {
          if (item.product_id) {
            await db.query("UPDATE products SET stock = GREATEST(stock - $1, 0) WHERE id=$2", [item.quantity, item.product_id]);
          }
        }
      }

      // Restore stock when a delivered order is cancelled
      if (status === "cancelado" && current[0].status === "entregado") {
        const { rows: items } = await db.query("SELECT product_id, quantity FROM order_items WHERE order_id=$1", [orderId]);
        for (const item of items) {
          if (item.product_id) {
            await db.query("UPDATE products SET stock = stock + $1 WHERE id=$2", [item.quantity, item.product_id]);
          }
        }
      }

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
      const { status } = req.body;
      const orderId = req.params.id;
      const current = db.prepare("SELECT status FROM orders WHERE id=?").get(orderId);
      if (!current) return res.status(404).json({ error: "No encontrado" });

      db.prepare("UPDATE orders SET status=? WHERE id=?").run(status, orderId);

      // Subtract stock when order is marked as "entregado"
      if (status === "entregado" && current.status !== "entregado") {
        const items = db.prepare("SELECT product_id, quantity FROM order_items WHERE order_id=?").all(orderId);
        const updateStock = db.prepare("UPDATE products SET stock = MAX(stock - ?, 0) WHERE id=?");
        for (const item of items) {
          if (item.product_id) updateStock.run(item.quantity, item.product_id);
        }
      }

      // Restore stock when a delivered order is cancelled
      if (status === "cancelado" && current.status === "entregado") {
        const items = db.prepare("SELECT product_id, quantity FROM order_items WHERE order_id=?").all(orderId);
        const restoreStock = db.prepare("UPDATE products SET stock = stock + ? WHERE id=?");
        for (const item of items) {
          if (item.product_id) restoreStock.run(item.quantity, item.product_id);
        }
      }

      res.json(db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId));
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
}

export default router;
