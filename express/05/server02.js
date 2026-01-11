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

const context = {
    subject: "ćwiczenie 2 - podstawowy context",
    content: "to jest lorem ipsum",
    footer: "to jest stopka na mojej stronie"
}

app.get("/index2", function (req, res) {
    res.render('index02.hbs', context);
})

app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
});