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
  res.json({
    ...result.rows[0],
    stats: {
      cards_count: acc.rows[0]?.cards_count || 0,
      followers_count: acc.rows[0]?.followers_count || 0,
      following_count: acc.rows[0]?.following_count || 0,
    },
  });
});

/* PUT /api/users/:id*/
router.put("/:id", async (req, res) => {
  const { name, email, phone } = req.body;
  const userId = req.params.id;

  const userResult = await pgclient.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  if (userResult.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  const user = userResult.rows[0];

  await pgclient.query(
    "UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4",
    [
      name || user.name,
      email || user.email,
      phone || user.phone,
      userId,
    ]
  );

  res.json({ message: "Profile Updated Successfully" });
});

/* POST /api/users/:id/change-password*/
router.post("/:id/change-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  const userResult = await pgclient.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  if (userResult.rows.length === 0) {
    return res.status(404).json({ message: "User Not Found" });
  }

  const user = userResult.rows[0];

  if (user.password !== currentPassword) {
    return res.status(400).json({ message: "Incorrect Current Password" });
  }

  await pgclient.query("UPDATE users SET password = $1 WHERE id = $2", [
    newPassword,
    userId,
  ]);

  res.json({ message: "Password Updated Successfully" });
});

export default router;
