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
    fieldSize: 5 * 1024 * 1024 // 5MB
  }
}).array("myImage", 3); // 3 images est la limite que je fixe

// function pour mes query pour la refacto

// function __query(queryName) {
//   return new Promise((resolve, reject) => {
//     connexion.query(queryName, function(err, result){
//       if (err) {
//         console.log('erreur query: ', err)
//         reject(err)
//       } else {
//         resolve(result)
//       }
//     })
//   });
// }

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

    const extensionFormat = [".js", ".php", ".rb", ".sql"];
    const fileNameExtension = req.files.map(image => image.originalname);

    const checkBadFormat = extensionFormat.map(extension => {
      return fileNameExtension
        .map(fileExtension => fileExtension.includes(extension))
        .includes(true);
    });

    if (err) {
      // Si plus de 3 images par article j'affiche une erreur
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(500).send({
          message: "Vous avez depassé la limite d'images, 3 par article"
        });
      }
      throw err;
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
      // Je gere le total des images reçus avant l'envoie
      const sizeImages = req.files.map(imageSize => imageSize.size);
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      const TotalSizeImages = sizeImages.reduce(reducer);

      // 5MB = 5242880
      if (TotalSizeImages < 5242880) {
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
      } else {
        return res.status(404).send({
          message: "Vos images sont trop grands 5MB au total maximum"
        });
      }
    }
  });
});

route.put("/:id", (req, res) => {
  upload(req, res, err => {
    const article = JSON.parse(req.body.myArticle);
    const { title, subtitle, body } = article;
    const articleId = req.params.id;

    if (err) {
      // Si plus de 3 images par article j'affiche une erreur
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(500).send({
          message: "Vous avez depassé la limite d'images, 3 par article"
        });
      }
      throw err;
    }

    // A refacto effet spaghetti et par forcement compréhensible

    connection.query(
      "SELECT * FROM simplon_notes.articles WHERE id = ?",
      articleId,
      function(err, result) {
        if (err) throw err;
        if (result.length > 0) {
          const params = [title, subtitle, body, articleId];
          connection.query(
            "UPDATE simplon_notes.articles SET title = ?, subtitle = ?, body = ? WHERE id = ?",
            params,
            function(err, result) {
              if (err) throw err;
              else {
                if (req.files.length === 0) {
                  return res.status(200).send({
                    message: "Votre article a bien été modifié"
                  });
                } else {
                  connection.query(
                    "SELECT * FROM simplon_notes.images_articles WHERE article_id = ?",
                    articleId,
                    function(err, result) {
                      if (err) throw err;
                      if (result.length + req.files.length > 3) {
                        return res.status(500).send({
                          message:
                            "Vous avez depassé la limite d'images, 3 par article"
                        });
                      } else {
                        console.log("envoi photo", req.files);
                        const extensionFormat = [".js", ".php", ".rb", ".sql"];
                        const fileNameExtension = req.files.map(
                          image => image.originalname
                        );

                        const checkBadFormat = extensionFormat.map(
                          extension => {
                            return fileNameExtension
                              .map(fileExtension =>
                                fileExtension.includes(extension)
                              )
                              .includes(true);
                          }
                        );

                        // Je gere le total des images reçus avant l'envoie
                        const sizeImages = req.files.map(
                          imageSize => imageSize.size
                        );
                        const reducer = (accumulator, currentValue) =>
                          accumulator + currentValue;
                        const TotalSizeImages = sizeImages.reduce(reducer);

                        // 5MB = 5242880
                        if (TotalSizeImages < 5242880) {
                          if (!checkBadFormat.includes(true)) {
                            for (let i = 0; i < req.files.length; i++) {
                              connection.query(`INSERT INTO simplon_notes.images_articles (id, article_id, image, image_name) VALUES (
                              "${uuidv1()}",
                              "${articleId}",
                              "uploads/${req.files[i].filename}",
                              "${req.files[i].originalname}"
                            )`);
                            }
                            return res.status(200).send({
                              message: "Votre article a bien été modifié"
                            });
                          } else {
                            return res.status(404).send({
                              message: "Image non valide à cause du format"
                            });
                          }
                        } else {
                          return res.status(404).send({
                            message:
                              "Vos images sont trop grands 5MB au total maximum"
                          });
                        }
                      }
                    }
                  );
                }
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
});

route.delete("/editArticle/:id", (req, res) => {
  const imageId = req.params.id;
  connection.query(
    "SELECT * FROM simplon_notes.images_articles WHERE id = ?",
    imageId,
    function(err, result) {
      if (result.length > 0) {
        connection.query(
          "DELETE FROM simplon_notes.images_articles WHERE id = ?",
          imageId,
          function(err, result) {
            if (err) throw err;
            return res.status(200).send({
              message: "Votre image a bien été supprimé"
            });
          }
        );
      } else {
        return res.status(400).send({
          message: "Votre image n'existe pas ou a été supprimé"
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
