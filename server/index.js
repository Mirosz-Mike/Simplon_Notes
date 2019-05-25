const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const Route = require("./routes/routes");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", Route);

app.listen(8012, (req, res) => {
  console.log("le port est " + 8012);
});
