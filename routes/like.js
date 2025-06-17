import express from "express";
import pgclient from "../db.js";

const router = express.Router();

/*POST /api/posts/:postId/likes*/
router.post("/:postId/likes", async (req, res) => {
  const { user_id } = req.body;

  const existingLike = await pgclient.query(
    "SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2",
    [req.params.postId, user_id]
  );

  if (existingLike.rows.length > 0) {
    return res.status(400).json({ message: "Already liked" });
  }

  await pgclient.query(
    "INSERT INTO likes (post_id, user_id) VALUES ($1, $2)",
    [req.params.postId, user_id]
  );

  await pgclient.query(
    "UPDATE posts SET likes_count = (SELECT COUNT(*) FROM likes WHERE post_id = $1) WHERE id = $1",
    [req.params.postId]
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

  await pgclient.query(
    "UPDATE posts SET likes_count = (SELECT COUNT(*) FROM likes WHERE post_id = $1) WHERE id = $1",
    [req.params.postId]
  );

  res.json({ message: "Like removed" });
});

/*GET /api/posts/:postId/likes*/
router.get("/:postId/likes", async (req, res) => {
  const userId = req.headers['user-id'];
  let hasLiked = false;

  const countResult = await pgclient.query(
    "SELECT likes_count FROM posts WHERE id = $1",
    [req.params.postId]
  );

  if (userId) {
    const likeResult = await pgclient.query(
      "SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2",
      [req.params.postId, userId]
    );
    hasLiked = likeResult.rows.length > 0;
  }

  res.json({ 
    likes: Number(countResult.rows[0]?.likes_count || 0),
    hasLiked 
  });
});

export default router;
