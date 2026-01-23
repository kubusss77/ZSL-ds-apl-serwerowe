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
    const relPath = req.query.path || "";
    const absPath = __dirname + "\\files\\" + relPath;

    const objects = fs.readdirSync(absPath);

    const files = [];
    const folders = [];

    objects.forEach((name) => {
      const childPath = __dirname + "/files/" + relPath + "/" + name;
      const isDir = fs.lstatSync(childPath).isDirectory();
      if (isDir) {
        folders.push({ name });
      } else {
        files.push({ name });
      }
    });

    res.render("filemanager.hbs", {
      path: relPath,
      hrefPath: relPath.split("/").join("%2F"),
      hrefParentPath: "/" + relPath.split("/").slice(0, -1).join("%2F"),
      folders,
      files,
    });
  } catch (error) {
    renderError(res, "Error reading files", error.message);
  }
});

function renderError(res, message, details) {
  res.render("filemanager.hbs", {
    error: {
      message,
      details,
    },
  });
}

/**
 * Files/folders actions
 */
app.post("/actions/folder", function (req, res) {
  try {
    // const name = req.
  } catch (error) {
    renderError(res, "Error adding folder", error.message);
  }
});

console.clear();
app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});

console.log(encodeURIComponent("/"));
