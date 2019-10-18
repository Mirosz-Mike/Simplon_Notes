const route = require("express").Router();
const multer = require("multer");
const path = require("path");
const uuidv1 = require("uuid/v1");

const checkAuth = require("../middleware/check_auth");
const checkFormat  = require('./functions_route');
const querySQL  = require('./functions_route');

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

route.use(checkAuth);

route.get("/images", async (req, res) => {
  const result = await querySQL.__query("SELECT * FROM simplon_notes.images_articles");
  return res.status(200).send(result);
});

route.get("/", async (req, res) => {
  const result = await querySQL.__query("SELECT * FROM simplon_notes.articles");
  return res.status(200).send(result);
});

route.post("/", (req, res) => {
  upload(req, res, err => {
    const article = JSON.parse(req.body.myArticle);
    const { user_id, author, title, subtitle, body } = article;
    
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
      querySQL.__query(`INSERT INTO simplon_notes.articles (id, user_id, author, title, subtitle, body, type_resource) VALUES (
        "${uuidv1()}",
        "${user_id}",
        "${author}",
        "${title}",
        "${subtitle}",
        "${body}",
        "article"
        )`)

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
        if (!checkFormat.checkGoodFormatImages(req)) {
          const id = uuidv1();

          querySQL.__query(`INSERT INTO simplon_notes.articles (id, user_id, author, title, subtitle, body, type_resource) VALUES (
            "${id}",
            "${user_id}",
            "${author}",
            "${title}",
            "${subtitle}",
            "${body}",
            "article"
            )`);


          for (let i = 0; i < req.files.length; i++) {
            querySQL.__query(`INSERT INTO simplon_notes.images_articles (id, article_id, image, image_name) VALUES (
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

    const getArticles = querySQL.__query(
      "SELECT * FROM simplon_notes.articles WHERE id = ?",
      articleId
    );

    const params = [title, subtitle, body, articleId];

    querySQL.__query(
      "UPDATE simplon_notes.articles SET title = ?, subtitle = ?, body = ? WHERE id = ?",
      params
    );
    
    getArticles.then(result => {
      if (result.length && req.files.length === 0) {
          return res
            .status(200)
            .send({ message: "Votre article a bien été modifié" });
      
      } else {
        const resultImagesArticle = querySQL.__query(
          "SELECT * FROM simplon_notes.images_articles WHERE article_id = ?",
          articleId
        );

        resultImagesArticle.then(result => {
          if (result.length + req.files.length > 3) {
            return res.status(500).send({
              message: "Vous avez depassé la limite d'images, 3 par article"
            });
          } else {
            // Je gere le total des images reçus avant l'envoie
            const sizeImages = req.files.map(imageSize => imageSize.size);
            const reducer = (accumulator, currentValue) =>
              accumulator + currentValue;
            const TotalSizeImages = sizeImages.reduce(reducer);

            // 5MB = 5242880
            if (TotalSizeImages < 5242880) {
              if (!checkFormat.checkGoodFormatImages(req)) {
                for (let i = 0; i < req.files.length; i++) {
                  querySQL.__query(`INSERT INTO simplon_notes.images_articles (id, article_id, image, image_name) VALUES (
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
                message: "Vos images sont trop grands 5MB au total maximum"
              });
            }
          }
        });
      }
    });
  });
});

route.delete("/deleteImagesArticle/:id", async (req, res) => {
  const imageId = req.params.id;
  const result = await querySQL.__query(
    "SELECT * FROM simplon_notes.images_articles WHERE id = ?",
    imageId
  );

  if (result.length) {
    await querySQL.__query(
      "DELETE FROM simplon_notes.images_articles WHERE id = ?",
      imageId
    );
    return res.status(200).send({ message: "Votre image a bien été supprimé" });
  }
});

route.delete("/:id", async (req, res) => {
  const articleId = req.params.id;
  const result = await querySQL.__query(
    "SELECT * FROM simplon_notes.articles WHERE id = ?",
    articleId
  );

  if (result.length) {
    await querySQL.__query("DELETE FROM simplon_notes.articles WHERE id = ?", articleId);
    return res
      .status(200)
      .send({ message: "Votre article a bien été supprimé" });
  }
});

module.exports = route;
