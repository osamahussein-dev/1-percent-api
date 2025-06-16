import express from "express";
import pgclient from "../db.js";

const router = express.Router();

/*POST /api/auth/signup*/
router.post("/signup", async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const dup = await pgclient.query("SELECT 1 FROM users WHERE email = $1", [
    email,
  ]);
  if (dup.rows.length > 0) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const newUser = await pgclient.query(
    "INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, email, password, phone, role || "user"]
  );
  await pgclient.query("INSERT INTO user_details (user_id) VALUES ($1)", [
    newUser.rows[0].id,
  ]);
  res.status(201).json(newUser.rows[0]);
});

/*POST /api/auth/login*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pgclient.query(
    "SELECT id, email, role FROM users WHERE email = $1 AND password = $2",
    [email, password]
  );
  if (result.rows.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json(result.rows[0]);
});

export default router;
