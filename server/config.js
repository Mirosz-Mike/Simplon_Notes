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
		id varchar(36) NOT NULL,
		name varchar(255) NOT NULL,
		email varchar(255) NOT NULL,
		password varchar(255) NOT NULL,
		create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (id)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

  connection.query(createTableUsers, err => {
    if (err) throw err;
    console.log("table users created");
  });

  const createTableArticles = `CREATE TABLE IF NOT EXISTS simplon_notes.articles (
		id varchar(36) NOT NULL,
		user_id varchar(36) NOT NULL,
    title varchar(255) NOT NULL,
    author varchar(255) NOT NULL,
    subtitle varchar(255) NOT NULL,
    image text NULL,
    body text NOT NULL,
    ressource varchar(255) NOT NULL,
		create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

  connection.query(createTableArticles, err => {
    if (err) throw err;
    console.log("tables articles created");
  });

  const createTableResources = `CREATE TABLE IF NOT EXISTS simplon_notes.resources (
		id varchar(36) NOT NULL,
    user_id varchar(36) NOT NULL,
    title varchar(255) NOT NULL,
    author varchar(255) NOT NULL,
    nameResource varchar(255) NOT NULL,
    type varchar(255) NOT NULL,
    size int NOT NULL,
    ressource varchar(255) NOT NULL,
		create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;

  connection.query(createTableResources, err => {
    if (err) throw err;
    console.log("tables resources created");
  });
});

module.exports = connection;
