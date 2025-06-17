import express from "express";
import pgclient from "../db.js";

const router = express.Router();

/*POST /api/posts*/
router.post("/", async (req, res) => {
  const { author_id, title, body, topic_id } = req.body;
  const ok = await pgclient.query("SELECT 1 FROM topics WHERE id = $1", [
    topic_id,
  ]);

  if (ok.rows.length === 0) {
    return res.status(400).json({ message: "Topic not found" });
  }

  const result = await pgclient.query(
    "INSERT INTO posts (id, author_id, title, body, topic_id, created_at) VALUES (DEFAULT, $1, $2, $3, $4, NOW()) RETURNING *",
    [author_id, title, body, topic_id]
  );

  const hasUserDetails = await pgclient.query(
    "SELECT 1 FROM user_details WHERE user_id = $1",
    [author_id]
  );

  if (hasUserDetails.rows.length) {
    await pgclient.query(
      "UPDATE user_details SET cards_count = cards_count + 1 WHERE user_id = $1",
      [author_id]
    );
  } else {
    await pgclient.query(
      "INSERT INTO user_details (user_id, cards_count, followers_count, following_count) VALUES ($1, 1, 0, 0)",
      [author_id]
    );
  }

  res.json(result.rows[0]);
});

/*GET /api/posts*/
router.get("/", async (req, res) => {
  const { author_id, topic_id } = req.query;
  const result = await pgclient.query(
    `SELECT 
      posts.*,
      users.name AS author_name,
      users.email AS author_email,
      topics.name AS topic_name
     FROM posts
     LEFT JOIN users on users.id = posts.author_id
     LEFT JOIN topics ON topics.id = posts.topic_id
     WHERE
       ($1::int IS NULL OR posts.author_id = $1) AND             
       ($2::int IS NULL OR posts.topic_id = $2) AND
        1=1
     ORDER BY posts.created_at DESC
     `,
    [author_id ? Number(author_id) : null, topic_id ? Number(topic_id) : null]
  );
  res.json(result.rows);
});

router.delete("/:id", async (req, res) => {
  const currentUserId = req.headers["user-id"];
  const currentUser = await pgclient.query(
    "SELECT role FROM users WHERE id = $1",
    [currentUserId]
  );

  if (currentUser.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  const owner = await pgclient.query(
    "SELECT author_id FROM posts WHERE id = $1",
    [req.params.id]
  );
  if (owner.rows.length === 0) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (
    owner.rows[0].author_id !== Number(currentUserId) &&
    currentUser.rows[0].role !== "admin"
  ) {
    return res.status(403).json({ message: "Not your post" });
  }
  const deleted = await pgclient.query(
    "DELETE FROM posts WHERE id = $1 RETURNING *",
    [req.params.id]
  );

  await pgclient.query(
    "UPDATE user_details SET cards_count = cards_count - 1 WHERE user_id = $1",
    [owner.rows[0].author_id]
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
  const { author_id, title, body, topic_id } = req.body;
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
    "UPDATE posts SET title = $1, body = $2, topic_id = $3 WHERE id = $4 RETURNING *",
    [title, body, topic, req.params.id]
  );
  res.json(updated.rows[0]);
});

export default router;
