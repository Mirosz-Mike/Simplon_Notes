const route = require("express").Router();

const multer = require("multer");
const path = require("path");
const uuidv1 = require("uuid/v1");

const checkAuth = require("../middleware/check_auth");
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
}).single("myResource");

route.use(checkAuth);

route.get("/", async (req, res) => {
  const result = await querySQL.__query("SELECT * FROM simplon_notes.resources")
  return res.status(200).send(result);
});

route.post("/", (req, res) => {
  upload(req, res, err => {
    const resource = JSON.parse(req.body.myResource);

    const { user_id, author, title } = resource;
    if (err) {
      console.log(err);
    }

    // check la faille upload
    const extensionFormat = [".js", ".php", ".rb", ".sql", ".odt"];
    const fileNameExtension = req.file.originalname;

    const checkBadFormat = extensionFormat
      .map(extension => {
        return fileNameExtension.includes(extension);
      })

    if (!checkBadFormat.find(check => check === true)) {
      querySQL.__query(`INSERT INTO simplon_notes.resources (id, user_id, title, author, name_resource, type, size, type_resource) VALUES (
          "${uuidv1()}",
          "${user_id}",
          "${title}",
          "${author}",
          "uploads/${req.file.filename}",
          "${req.file.mimetype}",
          ${req.file.size},
          "ressource"
      )`);
      return res
        .status(200)
        .send({ message: "Ressource enregister avec succès" });
    }
    return res
      .status(404)
      .send({ message: "Ressource non valide à cause du format" });
  });
});

route.delete("/:id", async (req, res) => {
  const resourceId = req.params.id;

  const result = await querySQL.__query("SELECT * FROM simplon_notes.resources WHERE id = ?",
  resourceId)

  if (result.length > 0) {
    await querySQL.__query("DELETE FROM simplon_notes.resources WHERE id = ?",
    resourceId)

    return res.status(200).send({
      message: "Votre resource a bien été supprimé"
    });
  } else {
    return res.status(400).send({
      message: "Votre resource n'existe pas ou a été supprimé"
    });
  }
});

module.exports = route;
