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
}).array("myResource", 4); // 4 est la limite que je fixe

route.use(checkAuth);

route.get("/", (req, res) => {
  connection.query("SELECT * FROM simplon_notes.resources", function(
    err,
    result
  ) {
    if (err) throw err;
    return res.status(200).send(result);
  });
});

route.post("/", (req, res) => {
  upload(req, res, err => {
    const resource = JSON.parse(req.body.myResource);

    const { user_id } = resource;
    if (err) {
      console.log(err);
    }

    for (let i = 0; i < req.files.length; i++) {
      connection.query(`INSERT INTO simplon_notes.resources (user_id, name, type, size) VALUES (
          "${user_id}",
          "uploads/${req.files[i].filename}",
          "${req.files[i].mimetype}",
          ${req.files[i].size}
      )`);
    }

    return res.status(200).send({ message: "Resource enregister avec succès" });
  });
});

module.exports = route;
