const route = require("express").Router();
const connection = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

route.post("/register", async (req, res) => {
  const validEmail = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
  const { email, password, name } = req.body;

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  if (name && email && password) {
    let users = {
      name: name,
      email: email,
      password: hash
    };
    if (validEmail.test(email)) {
      connection.query(
        "SELECT email FROM simplon_notes.users WHERE email = ?",
        users.email,
        function(error, results, fields) {
          if (error) {
            return res.status(500).send(error.message);
          }
          if (results.length > 0) {
            return res.status(403).send({ message: "Votre email existe deja" });
          } else {
            if (users.password) {
              connection.query(
                "INSERT INTO simplon_notes.users SET ?",
                users,
                function(error, results, fields) {
                  if (error) {
                    return res
                      .status(500)
                      .send("probleme avec la query " + error.message);
                  } else {
                    return res.status(200).send({
                      message: "user enregister avec succès ",
                      user: users
                    });
                  }
                }
              );
            } else {
              return res.status(400).send({
                password: `Votre mot de passe doit contenir au moins
                  - 1 caractère alphabétique minuscule.
                  - 1 caractère alphabétique majuscule.
                  - 1 caractère numérique.
                  - 1 caractère spécial.
                  - Votre mot de passe doit comporter au minimum 8 caractères`
              });
            }
          }
        }
      );
    } else {
      return res.status(400).send({ message: "Email non valide" });
    }
  } else {
    return res
      .status(400)
      .send({ message: "Veuillez remplir tout les champs" });
  }
});

route.post("/login", (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM simplon_notes.users WHERE email = ?",
    email,
    function(error, results) {
      if (error) {
        return res.status(500).send("probleme avec la requete");
      } else {
        if (results.length > 0) {
          bcrypt.compare(password, results[0].password, function(
            err,
            response
          ) {
            if (!response) {
              return res
                .status(400)
                .send({ message: "Mot de passe incorrect" });
            } else {
              const token = jwt.sign({ email }, process.env.SECRET_TOKEN_JWT, {
                expiresIn: "1h"
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
          return res.status(400).send({ message: "Votre email n'existe pas" });
        }
      }
    }
  );
});

module.exports = route;
