const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth_routes");
const articlesRoutes = require("./routes/articles_routes");
const resourcesRoutes = require("./routes/resources_auth");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/auth", authRoute);
app.use("/articles", articlesRoutes);
app.use("/resources", resourcesRoutes);

app.use(express.static("public"));

app.listen(8012, (req, res) => {
  console.log("le port de SimplonNotes est " + 8012);
});
