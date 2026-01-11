const express = require("express");
const { create } = require("express-handlebars");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static("static"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

const hbs = create({
  defaultLayout: "main.hbs",
  extname: ".hbs",
  partialsDir: "views/partials",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/", function (req, res) {
  fs.readdir(__dirname + "/files", (err, files) => {
    if (err) throw err;
    console.log("lista", files);
  });
  const context = {
    folders: 1,
    files: 2,
  };
  res.render("filemanager.hbs");
});

console.clear();
app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});
