const route = require("express").Router();
const connection = require("../config");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function(req, file, cb) {
    cb(null, "file-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
}).array("myImage", 4);

route.post("/", (req, res) => {
  const userToken = req.headers["x-auth-token"] || req.query.token;
  jwt.verify(userToken, process.env.SECRET_TOKEN_JWT, async (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Veuillez vous reconnecter" });
    } else {
      upload(req, res, err => {
        const article = JSON.parse(req.body.myArticle);
        const { user_id, author, title, subtitle, body } = article;
        const imageName = req.files
          ? req.files.filename
          : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
        console.log("Request body ---", req.body.myArticle);
        console.log("Request file ---", req.files);

        if (err) {
          console.log(err);
        }
        if (req.files) {
          const arrImage = [];
          for (let i = 0; i < req.files.length; i++) {
            arrImage.push(
              `http://localhost:8012/uploads/${req.files[i].filename}`
            );
          }
          connection.query(`INSERT INTO simplon_notes.articles (user_id, author, title, subtitle, image, body) VALUES (
            ${user_id},
            "${author}",
            "${title}",
            "${subtitle}",
            "${arrImage}",
            "${body}"
            )`);
        } else {
          connection.query(`INSERT INTO simplon_notes.articles (user_id, author, title, subtitle, body) VALUES (
            ${user_id},
            "${author}",
            "${title}",
            "${subtitle}",
            "${body}"
            )`);
        }
        return res
          .status(200)
          .send({ message: "Article enregister avec succès" });
      });
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
