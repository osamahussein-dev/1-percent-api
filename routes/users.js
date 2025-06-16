import express from "express";
import pgclient from "../db.js";

const router = express.Router();

/*GET /api/users*/
router.get("/", async (_req, res) => {
  const result = await pgclient.query(
    "SELECT id, name, email, phone, role FROM users ORDER BY id"
  );
  res.json(result.rows);
});

/*GET /api/users/:id*/
router.get("/:id", async (req, res) => {
  const result = await pgclient.query(
    "SELECT id, name, email, phone, role FROM users WHERE id = $1",
    [req.params.id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }
  const acc = await pgclient.query(
    "SELECT cards_count, followers_count, following_count FROM user_details WHERE user_id = $1",
    [req.params.id]
  );
  +res.json({ ...result.rows[0], ...acc.rows[0] });
});

export default router;
