const express = require("express");
const path = require("path");
const { create } = require("express-handlebars");
const Datastore = require("@seald-io/nedb");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

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

const coll2 = new Datastore({
  filename: "kolekcja2.db",
  autoload: true,
});

// Server

app.get("/", function (erq, res) {
  coll2
    .find({})
    .sort({ timestamp: 1 })
    .exec(function (err, docs) {
      let text = "";
      if (docs.length == 0) {
        text = "Brak wpisów";
      }

      data = [];
      docs.forEach((doc, index) => {
        const d = {
          i: index + 1,
          login: doc.login,
          pass: doc.pass
        }
        data.push(d)
      })

      const context = {
        text,
        docs: data,
      };

      res.render("index2.hbs", context); // nie podajemy ścieżki tylko nazwę pliku
    });
});

app.post("/", function (req, res) {
  const { login, pass } = req.body;

  const doc = {
    login,
    pass,
    timestamp: new Date().getTime(),
  };

  coll2.insert(doc, function (err, newDoc) {
    console.log(
      "dodano dokument (obiekt): ",
      newDoc,
      ", unikalne id dokumentu: ",
      newDoc._id
    );
  });

  res.status(200).redirect("/");
});

app.listen("3000", () => {
  console.clear();
  console.log("Server started on: http://localhost:3000");
});
