const app = require("express")();
const connection = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.post("/register", async (req, res) => {
  const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const today = new Date();
  let users = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    create_at: today,
    updated_at: today
  };

  // hasher les mots de passe
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(users.password, salt);

  if (users.name && users.email && users.password) {
    if (validEmail.test(users.email)) {
      connection.query(
        "SELECT email FROM simplon_notes.users WHERE email = ?",
        users.email,
        function(error, results, fields) {
          if (error) {
            res.status(500).send(error.message);
          }
          if (results.length > 0) {
            res.status(403).send({ message: "Votre email existe deja" });
          } else {
            if (users.password) {
              users = { ...users, password: hash };
              connection.query(
                "INSERT INTO simplon_notes.users SET ?",
                users,
                function(error, results, fields) {
                  if (error) {
                    res
                      .status(500)
                      .send("probleme avec la query " + error.message);
                  } else {
                    res.status(200).send({
                      message: "user enregister avec succès ",
                      user: users
                    });
                  }
                }
              );
            } else {
              res.status(400).send({
                password: `Votre mot de passe doit contenir au moins
													- 1 caractère alphabétique minuscule.
													- 1 caractère alphabétique majuscule.
													- 1 caractère numérique.
													- 1 caractère spécial.
													- Votre mot de passe doit comporter 8 au minimum caractères`
              });
            }
          }
        }
      );
    } else {
      res.status(400).send({ message: "Mail non valide" });
    }
  } else {
    res.status(400).send({ message: "Veuillez remplir tout les champs" });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM simplon_notes.users WHERE email = ?",
    email,
    function(error, results) {
      if (error) {
        res.status(500).send("probleme avec la query");
      } else {
        if (results.length > 0) {
          bcrypt.compare(password, results[0].password, function(
            err,
            response
          ) {
            if (!response) {
              res.status(400).send({ message: "Password incorrect" });
            } else {
              const token = jwt.sign({ email }, process.env.SECRET_TOKEN_JWT, {
                expiresIn: "2m"
              });
              return res
                .status(200)
                .send({
                  token: token,
                  name: results[0].name,
                  userId: results[0].id
                })
                .json();
            }
          });
        } else {
          res.status(400).send({ message: "Votre email n'existe pas" });
        }
      }
    }
  );
});

app.post("/articles", (req, res) => {
  const userToken = req.headers["x-auth-token"] || req.query.token;
  jwt.verify(userToken, process.env.SECRET_TOKEN_JWT, async (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Veuillez vous reconnecter" });
    } else {
      const { user_id, title, subtitle, image, body } = req.body;
      await connection.query(`INSERT INTO simplon_notes.articles (user_id, title, subtitle, image, body) VALUES (
        ${user_id}, 
        "${title}",
        "${subtitle}",
        "${image}",
        "${body}"
        )`);

      return res
        .status(200)
        .send({ message: "Article enregister avec succès" });
    }
  });
});

app.get("/articles", (req, res) => {
  const userToken = req.headers["x-auth-token"] || req.query.token;
  jwt.verify(userToken, process.env.SECRET_TOKEN_JWT, async (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Veuillez vous reconnecter" });
    } else {
      await connection.query("SELECT * FROM simplon_notes.articles", function(
        err,
        result
      ) {
        if (err) throw err;
        return res.status(200).send(result);
      });
    }
  });
});

module.exports = app;
