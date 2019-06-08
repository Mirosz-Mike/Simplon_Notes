const route = require("express").Router();
const connection = require("../config");
const jwt = require("jsonwebtoken");
require("dotenv").config();

route.post("/", (req, res) => {
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

route.put("/:id", (req, res) => {
  const userToken = req.headers["x-auth-token"] || req.query.token;
  jwt.verify(userToken, process.env.SECRET_TOKEN_JWT, async (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Veuillez vous reconnecter" });
    } else {
      const { title, subtitle, image, body } = req.body;
      const articleId = req.params.id;
      await connection.query(
        `SELECT * FROM simplon_notes.articles WHERE id = ${articleId}`,
        function(err, result) {
          if (err) throw err;
          if (result.length > 0) {
            connection.query(
              `UPDATE simplon_notes.articles SET title = "${title}", subtitle = "${subtitle}", image = "${image}", body = "${body}" WHERE id = ${articleId}`,
              function(err, result) {
                if (err) throw err;
                else {
                  return res.status(200).send({
                    message: "Votre article a bien été modifié",
                    data: result
                  });
                }
              }
            );
          } else {
            return res.status(400).send({
              message: "Votre article n'existe pas ou plus"
            });
          }
        }
      );
    }
  });
});

route.get("/", (req, res) => {
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

route.delete("/:id", (req, res) => {
  const userToken = req.headers["x-auth-token"] || req.query.token;
  jwt.verify(userToken, process.env.SECRET_TOKEN_JWT, async (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Veuillez vous reconnecter" });
    } else {
      const articleId = req.params.id;
      await connection.query(
        `SELECT * FROM simplon_notes.articles WHERE id = ${articleId}`,
        function(err, result) {
          if (result.length > 0) {
            connection.query(
              `DELETE FROM simplon_notes.articles WHERE id = ${articleId}`,
              function(err, result) {
                if (err) throw err;
                return res.status(200).send({
                  message: "Votre article a bien été supprimé",
                  data: result
                });
              }
            );
          } else {
            return res.status(404).send({
              message: "Votre article n'existe pas ou a été supprimé"
            });
          }
        }
      );
    }
  });
});

module.exports = route;
