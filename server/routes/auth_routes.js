const route = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuidv1 = require("uuid/v1");

const querySQL  = require('./functions_route');
require("dotenv").config();


route.post("/register", async (req, res) => {
  const validEmail = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
  const { email, password, name } = req.body;

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  if (name && email && password) {
    const user = {
      name: name,
      email: email,
      password: hash
    };
    if (validEmail.test(email)) {

      const result = await querySQL.__query("SELECT email FROM simplon_notes.users WHERE email = ?",
      user.email)

        if (result.length) {
          return res.status(403).send({ message: "Votre email existe déjà" });
        } else {
          if (user.password) {
            await querySQL.__query("INSERT INTO simplon_notes.users SET id = ?, name = ?, email = ?, password = ?",
            [uuidv1(), user.name, user.email, user.password])
    
            return res.status(200).send({
              message: "Vous êtes enregistré avec succès",
              user: user
            });
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
      } else {
        return res.status(400).send({ message: "Email non valide" });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Veuillez remplir tout les champs" });
  }
});

route.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await querySQL.__query("SELECT * FROM simplon_notes.users WHERE email = ?",
  email)

  if (result.length) {
      bcrypt.compare(password, result[0].password, (err, response) => {
        if (!response) {
          return res
            .status(400)
            .send({ message: "Mot de passe incorrect" });
        } else {
          const token = jwt.sign({ email }, process.env.SECRET_TOKEN_JWT, {
            expiresIn: "1h"
          });
          return res.status(200).send({
            token: token,
            name: result[0].name,
            userId: result[0].id
          });
        }
      }) 
    } else {
      return res.status(400).send({ message: "Votre email n'existe pas" });
  }
});

module.exports = route;
