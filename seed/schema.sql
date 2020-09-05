-- schema.sql
-- Since we might run the import many times we'll drop if exists
DROP DATABASE IF EXISTS socio;

CREATE DATABASE socio;

-- Make sure we're using our `blog` database
\c socio;

-- We can create our user table
CREATE TABLE users
 (
 id serial PRIMARY KEY,
 first VARCHAR(100),
 last VARCHAR(100),
 friends integer[],
 friend_requested integer[],
 friend_request integer[],
 avatar VARCHAR(100),
 added TIMESTAMP NOT NULL
);
