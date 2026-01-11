const express = require("express");
const path = require("path");
const { create } = require('express-handlebars');

const app = express();

app.use(express.static('static'));

const hbs = create({
    defaultLayout: 'main.hbs', // Domyślny layout: views/layouts/main.hbs
    extname: '.hbs' // rozszerzenie plików szablonów
});

app.engine('.hbs', hbs.engine); // określenie silnika szablonów
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views')); // ustalamy katalog views

app.get("/index", function (req, res) {
    res.render('index.hbs'); // nie podajemy ścieżki tylko nazwę pliku
})

app.get("/login", function (req, res) {
    res.render('login.hbs');
})

app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
});