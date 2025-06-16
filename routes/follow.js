import express from "express";
import pgclient from "../db.js";

const router = express.Router();

/* POST /api/follows/follow */
router.post("/follow", async (req, res) => {
  const { follower_id, following_id } = req.body;

  const alreadyFollowing = await pgclient.query(
    "SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2",
    [follower_id, following_id]
  );
  if (alreadyFollowing.rows.length > 0) {
    return res
      .status(400)
      .json({ message: "You are already following this user" });
  }

  await pgclient.query(
    "INSERT INTO followers (follower_id, following_id) VALUES ($1, $2)",
    [follower_id, following_id]
  );

  await pgclient.query(
    "UPDATE userDetails SET following_count = following_count + 1 WHERE user_id = $1",
    [follower_id]
  );

  await pgclient.query(
    "UPDATE userDetails SET followers_count = followers_count + 1 WHERE user_id = $1",
    [following_id]
  );

  res.status(201).json({ message: "You are now following the user" });
});

/* POST /api/follows/unfollow*/
router.post("/unfollow", async (req, res) => {
  const { follower_id, following_id } = req.body;

  const isFollowing = await pgclient.query(
    "SELECT * FROM followers WHERE follower_id = $1 AND following_id = $2",
    [follower_id, following_id]
  );
  if (isFollowing.rows.length === 0) {
    return res.status(400).json({ message: "You are not following this user" });
  }

  await pgclient.query(
    "DELETE FROM followers WHERE follower_id = $1 AND following_id = $2",
    [follower_id, following_id]
  );

  await pgclient.query(
    "UPDATE userDetails SET following_count = following_count - 1 WHERE user_id = $1",
    [follower_id]
  );

  await pgclient.query(
    "UPDATE userDetails SET followers_count = followers_count - 1 WHERE user_id = $1",
    [following_id]
  );

  res.status(200).json({ message: "You have unfollowed the user" });
});

export default router;
