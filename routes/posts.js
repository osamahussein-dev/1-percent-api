import express from "express";
import pgclient from "../db.js";

const router = express.Router();

/*POST /api/posts*/
router.post("/", async (req, res) => {
  const { author_id, title, body, topic } = req.body;
  const ok = await pgclient.query("SELECT 1 FROM topics WHERE name = $1", [
    topic,
  ]);
  if (ok.rows.length === 0) {
    return res.status(400).json({ message: "Topic not found" });
  }
  const result = await pgclient.query(
    "INSERT INTO posts (author_id, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *",
    [author_id, title, body, topic]
  );
  res.json(result.rows[0]);
});

/*GET /api/posts*/
router.get("/", async (_req, res) => {
  const result = await pgclient.query(
    "SELECT * FROM posts ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

router.delete("/:id", async (req, res) => {
  const owner = await pgclient.query(
    "SELECT author_id FROM posts WHERE id = $1",
    [req.params.id]
  );
  if (owner.rows.length === 0) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (owner.rows[0].author_id !== Number(req.body.author_id)) {
    return res.status(403).json({ message: "Not your post" });
  }
  const deleted = await pgclient.query(
    "DELETE FROM posts WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  res.json({ message: "Post deleted", post: deleted.rows[0] });
});

/* GET /api/posts/:id*/
router.get("/:id", async (req, res) => {
  const post = await pgclient.query("SELECT * FROM posts WHERE id = $1", [
    req.params.id,
  ]);
  if (post.rows.length === 0) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post.rows[0]);
});

/* PUT /api/posts/:id*/
router.put("/:id", async (req, res) => {
  const { author_id, title, body, topic } = req.body;
  const owner = await pgclient.query(
    "SELECT author_id FROM posts WHERE id = $1",
    [req.params.id]
  );
  if (owner.rows.length === 0) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (owner.rows[0].author_id !== Number(author_id)) {
    return res.status(403).json({ message: "Not your post" });
  }
  const updated = await pgclient.query(
    "UPDATE posts SET title = $1, body = $2, topic = $3 WHERE id = $4 RETURNING *",
    [title, body, topic, req.params.id]
  );
  res.json(updated.rows[0]);
});

export default router;
