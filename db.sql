CREATE TABLE users (
  id       SERIAL PRIMARY KEY,
  name    VARCHAR(255) NOT NULL,
  email    VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255)        NOT NULL,
  phone   VARCHAR(255) NOT NULL,
  role     VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE posts (
  id         SERIAL PRIMARY KEY,
  author_id  INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(150) NOT NULL,
  body       TEXT         NOT NULL,
  topic      VARCHAR(80)  NOT NULL,
  created_at TIMESTAMPTZ  DEFAULT now()
);

CREATE TABLE comments (
  id         SERIAL Primary KEY,
  post_id    INTEGER NOT NULL REFERENCES posts(id)  ON DELETE CASCADE,
  author_id  INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  body       TEXT    NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE topics (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(80) UNIQUE NOT NULL
);

CREATE TABLE likes (
  post_id   INTEGER NOT NULL REFERENCES posts(id)  ON DELETE CASCADE,
  user_id   INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);
