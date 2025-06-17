CREATE TABLE users
  (
     id       SERIAL PRIMARY KEY,
     NAME     VARCHAR(255) NOT NULL,
     email    VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     phone    VARCHAR(255) NOT NULL,
     role     VARCHAR(20) DEFAULT 'user'
  );

CREATE TABLE topics
  (
     id   SERIAL PRIMARY KEY,
     NAME VARCHAR(80) UNIQUE NOT NULL
  );

CREATE TABLE posts
  (
     id         SERIAL PRIMARY KEY,
     author_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     title      VARCHAR(150) NOT NULL,
     body       TEXT NOT NULL,
     likes_count  INTEGER DEFAULT 0,
     topic_id   INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
     created_at TIMESTAMPTZ DEFAULT Now()
  );

CREATE TABLE comments
  (
     id         SERIAL PRIMARY KEY,
     post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
     author_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     body       TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT Now()
  );

CREATE TABLE likes
  (
     post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     PRIMARY KEY (post_id, user_id)
  );

CREATE TABLE user_details
  (
     id              SERIAL PRIMARY KEY,
     user_id         INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
     cards_count     INTEGER DEFAULT 0,
     followers_count INTEGER DEFAULT 0,
     following_count INTEGER DEFAULT 0
  );

CREATE TABLE follows
  (
     follower_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     following_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     created_at   TIMESTAMPTZ DEFAULT Now(),
     PRIMARY KEY (follower_id, following_id),
     CONSTRAINT no_self_follow CHECK (follower_id <> following_id)
  );