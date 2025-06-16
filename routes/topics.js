import express from "express";
import pgclient from "../db.js";

const router = express.Router();

/*POST /api/topics*/
router.post("/", async (req, res) => {
  const { name } = req.body;

  const dup = await pgclient.query("SELECT 1 FROM topics WHERE name = $1", [
    name,
  ]);
  if (dup.rows.length > 0) {
    return res.status(400).json({ message: "Topic already exists" });
  }

  const result = await pgclient.query(
    "INSERT INTO topics (name) VALUES ($1) RETURNING *",
    [name]
  );
  res.status(201).json(result.rows[0]);
});

/*GET /api/topics*/
router.get("/", async (_req, res) => {
  const result = await pgclient.query(
    "SELECT id, name FROM topics ORDER BY name"
  );
  res.json(result.rows);
});

export default router;
