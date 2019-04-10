const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'login_and_register_test'
})

connection.connect((err) => {
    if (err) throw err;
    console.log("connecté");

    // const createTable = `CREATE TABLE IF NOT EXISTS users (
    //         id int(11) NOT NULL AUTO_INCREMENT,
    //         name varchar(255) NOT NULL,
    //         email varchar(255) NOT NULL,
    //         password varchar(255) NOT NULL,
    //         create_at datetime NOT NULL,
    //         updated_at datetime NOT NULL,
    //         PRIMARY KEY (id)
    //     ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;`

    // connection.query(createTable, (err, result) => {
    //     if (err) throw err;
    //     console.log("Table crée");
    // })

    // const insert = "DELETE FROM users;"

    // connection.query(insert, function (err, result) {
    //     if (err) throw err;
    //     console.log("all rows delete");
    // })

    const selectTable = "SELECT * FROM users"

    connection.query(selectTable, (err, results, fields) => {
        if (err) throw err
        console.log(results); 
    })
})

module.exports = connection;