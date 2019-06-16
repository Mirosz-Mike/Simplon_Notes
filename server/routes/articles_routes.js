const route = require("express").Router();
const connection = require("../config");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    cb(null, "file-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single("myImage");

route.post("/", (req, res) => {
  const userToken = req.headers["x-auth-token"] || req.query.token;
  jwt.verify(userToken, process.env.SECRET_TOKEN_JWT, async (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Veuillez vous reconnecter" });
    } else {
      const { user_id, title, subtitle, body, image } = req.body;

      upload(req, res, err => {
        console.log("Request body ---", req.body);
        console.log("Request file ---", req.file); //Here you get file.
        /*Now do where ever you want to do*/
        if (!err) return res.send(200).end();
      });

      // await connection.query(`INSERT INTO simplon_notes.articles (user_id, title, subtitle, image, body) VALUES (
      //       ${user_id},
      //       "${title}",
      //       "${subtitle}",
      //       "${image}",
      //       "${body}"
      //       )`);

      // return res
      //   .status(200)
      //   .send({ message: "Article enregister avec succès" });
    }
  });
});

route.post("/upload", (req, res) => {
  upload(req, res, err => {
    console.log("Request body ---", req.body);
    console.log("Request file ---", req.file); //Here you get file.
    /*Now do where ever you want to do*/
    if (!err) return res.send(200).end();
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
