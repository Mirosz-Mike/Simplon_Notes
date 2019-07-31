const route = require("express").Router();
const connection = require("../config");
const multer = require("multer");
const path = require("path");
const uuidv1 = require("uuid/v1");

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
}).array("myImage", 4); // 4 est la limite que je fixe

route.use(checkAuth);

route.get("/images", (req, res) => {
  connection.query("SELECT * FROM simplon_notes.images_articles", function(
    err,
    result
  ) {
    if (err) throw err;
    return res.status(200).send(result);
  });
});

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

    console.log(article);

    const extensionFormat = [".js", ".php", ".rb"];
    const fileNameExtension = req.files.map(image => image.originalname);

    const checkBadFormat = extensionFormat.map(extension => {
      return fileNameExtension
        .map(fileExtension => fileExtension.includes(extension))
        .includes(true);
    });

    if (err) {
      console.log(err);
    }

    if (req.files.length === 0) {
      connection.query(`INSERT INTO simplon_notes.articles (id, user_id, author, title, subtitle, body, type_resource) VALUES (
            "${uuidv1()}",
            "${user_id}",
            "${author}",
            "${title}",
            "${subtitle}",
            "${body}",
            "article"
            )`);
      return res
        .status(200)
        .send({ message: "Article enregister avec succès" });
    } else {
      if (!checkBadFormat.includes(true)) {
        const id = uuidv1();
        connection.query(`INSERT INTO simplon_notes.articles (id, user_id, author, title, subtitle, body, type_resource) VALUES (
          "${id}",
          "${user_id}",
          "${author}",
          "${title}",
          "${subtitle}",
          "${body}",
          "article"
          )`);

        for (let i = 0; i < req.files.length; i++) {
          connection.query(`INSERT INTO simplon_notes.images_articles (id, article_id, image, image_name) VALUES (
            "${uuidv1()}",
            "${id}",
            "uploads/${req.files[i].filename}",
            "${req.files[i].originalname}"
          )`);
        }

        return res
          .status(200)
          .send({ message: "Article enregister avec succès" });
      } else {
        return res
          .status(404)
          .send({ message: "Image non valide à cause du format" });
      }
    }
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
