import express from "express";
import pgclient from "../db.js";

const router = express.Router();

/*POST /api/posts/:postId/likes*/
router.post("/:postId/likes", async (req, res) => {
  const { user_id } = req.body;

  const result = await pgclient.query(
    "INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *",
    [req.params.postId, user_id]
  );
  res.status(201).json({ message: "Like added" });
});

/*DELETE /api/posts/:postId/likes*/
router.delete("/:postId/likes", async (req, res) => {
  const { user_id } = req.body;
  const result = await pgclient.query(
    "DELETE FROM likes WHERE post_id = $1 AND user_id = $2 RETURNING *",
    [req.params.postId, user_id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Like not found" });
  }
  res.json({ message: "Like Removed" });
});

/*DELETE /api/posts/:postId/likes*/
router.get("/:postId/likes", async (req, res) => {
  const result = await pgclient.query(
    "SELECT COUNT(*) AS count FROM likes WHERE post_id = $1",
    [req.params.postId]
  );
  res.json({ likes: Number(result.rows[0].count) });
});

export default router;
