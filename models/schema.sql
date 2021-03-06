CREATE TABLE users
(
  uid SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  email_verification BOOLEAN,
  date_created DATE,
  last_login DATE
);

CREATE TABLE posts
(
  pid SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(uid),
  title VARCHAR(255),
  body VARCHAR,
  author VARCHAR REFERENCES users(username),
  date_created TIMESTAMP,
  likes INT DEFAULT 0,
  search_vector TSVECTOR
);

CREATE TABLE comments
(
  cid SERIAL PRIMARY KEY,
  comment VARCHAR(255),
  author VARCHAR REFERENCES users(username),
  user_id INT REFERENCES users(uid),
  post_id INT REFERENCES posts(pid),
  date_created TIMESTAMP
);