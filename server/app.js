const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const routers = require("./routers");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/", routers);

app.listen("8181", () => {
  console.log("http://localhost:8181");
});
