const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoute = require("./routes/auth_routes");
const app = express()
const articlesRoutes = require("./routes/articles_routes");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/auth", authRoute);
app.use("/articles", articlesRoutes);

app.use(express.static('public'));

app.listen(8012, (req, res) => {
  console.log("le port est " + 8012);
});
