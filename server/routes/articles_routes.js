const route = require("express").Router();
const connection = require("../config");
const multer = require("multer");
const path = require("path");

const checkAuth = require("../middleware/check_auth");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function(req, file, cb) {
    cb(null, "file-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 8 * 1024 * 1024 // 8MB
  }
}).array("myImage", 4);

route.use(checkAuth);

route.get("/", (req, res) => {
  connection.query("SELECT * FROM simplon_notes.articles", function(
    err,
    result
  ) {
    if (err) throw err;
    return res.status(200).send(result);
  });
});

route.post("/", (req, res) => {
  upload(req, res, err => {
    const article = JSON.parse(req.body.myArticle);
    const { user_id, author, title, subtitle, body } = article;
    const arrImage = [];

    if (err) {
      console.log(err);
    }

    for (let i = 0; i < req.files.length; i++) {
      arrImage.push(`uploads/${req.files[i].filename}`);
    }
    connection.query(`INSERT INTO simplon_notes.articles (user_id, author, title, subtitle, image, body) VALUES (
      ${user_id},
      "${author}",
      "${title}",
      "${subtitle}",
      "${arrImage}",
      "${body}"
      )`);

    return res.status(200).send({ message: "Article enregister avec succès" });
  });
});

route.put("/:id", (req, res) => {
  const { title, subtitle, image, body } = req.body;
  const articleId = req.params.id;
  connection.query(
    "SELECT * FROM simplon_notes.articles WHERE id = ?",
    articleId,
    function(err, result) {
      if (err) throw err;
      if (result.length > 0) {
        const params = [title, subtitle, image, body, articleId];
        connection.query(
          "UPDATE simplon_notes.articles SET title = ?, subtitle = ?, image = ?, body = ? WHERE id = ?",
          params,
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
});

route.delete("/:id", (req, res) => {
  const articleId = req.params.id;
  connection.query(
    "SELECT * FROM simplon_notes.articles WHERE id = ?",
    articleId,
    function(err, result) {
      if (result.length > 0) {
        connection.query(
          "DELETE FROM simplon_notes.articles WHERE id = ?",
          articleId,
          function(err, result) {
            if (err) throw err;
            return res.status(200).send({
              message: "Votre article a bien été supprimé",
              data: result
            });
          }
        );
      } else {
        return res.status(400).send({
          message: "Votre article n'existe pas ou a été supprimé"
        });
      }
    }
  );
});

module.exports = route;
