const express = require("express");
const path = require("path");
const { create } = require("express-handlebars");
const Datastore = require("@seald-io/nedb");

const app = express();

app.use(express.static("static"));

// HBS

const hbs = create({
  defaultLayout: "main.hbs", // Domyślny layout: views/layouts/main.hbs
  extname: ".hbs", // rozszerzenie plików szablonów
});

app.engine(".hbs", hbs.engine); // określenie silnika szablonów
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views")); // ustalamy katalog views

// Db

const coll3 = new Datastore({
  filename: "kolekcja3.db",
  autoload: true,
});

// Server

app.get("/", function (erq, res) {
  coll3
    .find({})
    .exec(function (err, docs) {
      console.log(docs)
      let text = "";
      if (docs.length == 0) {
        text = "Brak wpisów";
      }

      const context = {
        text,
        docs,
      };

      res.render("index3.hbs", context); // nie podajemy ścieżki tylko nazwę pliku
    });
});

app.listen("3000", () => {
  console.clear();
  console.log("Server started on: http://localhost:3000");
});
