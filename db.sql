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

INSERT INTO users (name, email, password, phone, role) VALUES
('Osama Hussein', 'osama@gmail.com', '123456', '1234567890', 'admin'),
('Jane Smith', 'jane@gmail.com', '123456', '0987654321', 'user');

INSERT INTO topics (name) VALUES
('Technology'),
('Programming'),
('Web Development'),
('Mobile Development');

INSERT INTO user_details (user_id, cards_count, followers_count, following_count) VALUES
(1, 5, 100, 50),
(2, 3, 75, 30);

INSERT INTO posts (author_id, title, body, topic_id, likes_count) VALUES
(1, 'Getting Started with React', 'React is a powerful library for building user interfaces. Here are some tips to get started...', 1, 25),
(2, 'Mobile App Development Tips', 'Here are some essential tips for developing mobile applications...', 4, 15),
(1, 'Web Development Best Practices', 'Learn the best practices for modern web development...', 3, 30);

INSERT INTO comments (post_id, author_id, body) VALUES
(1, 2, 'Great introduction to React! Very helpful for beginners.'),
(1, 1, 'Thanks! Glad you found it helpful.'),
(2, 1, 'These mobile development tips are really useful!');

INSERT INTO likes (post_id, user_id) VALUES
(1, 2),
(2, 1),
(3, 2);

INSERT INTO follows (follower_id, following_id) VALUES
(2, 1),
(1, 2);