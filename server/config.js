const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB
});

connection.connect(err => {
  if (err) throw err;
  console.log("connected");

  const createDB = "CREATE DATABASE IF NOT EXISTS simplon_notes";
  connection.query(createDB, err => {
    if (err) throw err;
    console.log("database created");
  });

  const createTableUsers = `CREATE TABLE IF NOT EXISTS simplon_notes.users (
		id int NOT NULL AUTO_INCREMENT,
		name varchar(255) NOT NULL,
		email varchar(255) NOT NULL,
		password varchar(255) NOT NULL,
		create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (id)
	) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;`;

  connection.query(createTableUsers, err => {
    if (err) throw err;
    console.log("table users created");
  });

  const createTableArticles = `CREATE TABLE IF NOT EXISTS simplon_notes.articles (
		id int NOT NULL AUTO_INCREMENT,
		user_id int NOT NULL,
    title varchar(255) NOT NULL,
    author varchar(255) NOT NULL,
    subtitle varchar(255) NOT NULL,
    image text NULL,
    body text NOT NULL,
		create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;`;

  connection.query(createTableArticles, err => {
    if (err) throw err;
    console.log("tables articles created");
  });
});

module.exports = connection;
