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
  try {
    const objects = fs.readdirSync(__dirname + "/files");

    const files = [];
    const folders = [];

    objects.forEach((name) => {
      const isDir = fs.lstatSync(__dirname + "/files/" + name).isDirectory();
      if (isDir) {
        folders.push({ name });
      } else {
        files.push({ name });
      }
    });

    res.render("filemanager.hbs", { folders, files });
  } catch (error) {
    res.render("filemanager.hbs", {
      error: {
        message: "Error reading files",
        details: error.message,
      },
    });
  }
});

console.clear();
app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});
