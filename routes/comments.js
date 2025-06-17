import express from "express";
import pgclient from "../db.js";

const router = express.Router();

/*POST /api/posts/:postId/comments*/
router.post("/:postId/comments", async (req, res) => {
  const { author_id, body } = req.body;

  const result = await pgclient.query(
    "INSERT INTO comments (post_id, author_id, body) VALUES ($1, $2, $3) RETURNING *",
    [req.params.postId, author_id, body]
  );

  const commentWithAuthor = await pgclient.query(
    `SELECT comments.*, users.name as author_name 
     FROM comments 
     LEFT JOIN users ON users.id = comments.author_id 
     WHERE comments.id = $1`,
    [result.rows[0].id]
  );

  res.status(201).json(commentWithAuthor.rows[0]);
});

/*GET /api/posts/:postId/comments*/
router.get("/:postId/comments", async (req, res) => {
  const result = await pgclient.query(
    `SELECT comments.*, users.name as author_name 
     FROM comments 
     LEFT JOIN users ON users.id = comments.author_id 
     WHERE post_id = $1 
     ORDER BY comments.created_at ASC`,
    [req.params.postId]
  );
  res.json(result.rows);
});

/*DELETE /api/comments/:id*/
router.delete("/:id", async (req, res) => {
  const owner = await pgclient.query(
    "SELECT author_id FROM comments WHERE id = $1",
    [req.params.id]
  );
  if (owner.rows.length === 0) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (owner.rows[0].author_id !== Number(req.body.author_id)) {
    return res.status(403).json({ message: "Not your comment" });
  }

  const deleted = await pgclient.query(
    "DELETE FROM comments WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  res.json({ message: "Comment deleted", comment: deleted.rows[0] });
});

export default router;
