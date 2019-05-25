const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root"
});

connection.connect(err => {
  if (err) throw err;
  console.log("connected");

  const createDB = "CREATE DATABASE IF NOT EXISTS simplon_notes";
  connection.query(createDB, (err, results) => {
    if (err) throw err;
    console.log("database created");
  });

  const createTableUsers = `CREATE TABLE IF NOT EXISTS simplon_notes.users (
		id int NOT NULL AUTO_INCREMENT,
		name varchar(255) NOT NULL,
		email varchar(255) NOT NULL,
		password varchar(255) NOT NULL,
		create_at datetime NOT NULL,
		updated_at datetime NOT NULL,
		PRIMARY KEY (id)
	) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;`;

  connection.query(createTableUsers, (err, results) => {
    if (err) throw err;
    console.log("table users created");
  });
});

module.exports = connection;
