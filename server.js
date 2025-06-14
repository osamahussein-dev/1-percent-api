import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import pgclient from "./db.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import topicRoutes from "./routes/topics.js";
import likeRoutes from "./routes/like.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/*Global middleware*/
app.use(cors());
app.use(express.json());

/*Route mounts*/
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts", commentRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/posts", likeRoutes);

app.get("/", (_req, res) => {
  res.send("Welcome to your first API server");
});

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

pgclient.connect().then(() => {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});
