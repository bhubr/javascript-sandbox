-- Up
CREATE TABLE users (
	id INTEGER PRIMARY KEY,
	username VARCHAR(64) UNIQUE,
  firstname VARCHAR(64),
  lastname VARCHAR(64),
	email VARCHAR(64) UNIQUE,
  password VARCHAR(255)
);

-- Down
DROP TABLE users;
