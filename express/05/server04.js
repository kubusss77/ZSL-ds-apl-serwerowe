const express = require("express");
const path = require("path");
const { create } = require('express-handlebars');

const app = express();

app.use(express.static('static'));

app.use(express.urlencoded({
    extended: true
}));

const hbs = create({
    defaultLayout: 'main.hbs', // Domyślny layout: views/layouts/main.hbs
    extname: '.hbs' // rozszerzenie plików szablonów
});

app.engine('.hbs', hbs.engine); // określenie silnika szablonów
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views')); // ustalamy katalog views

const context = {
    subject: "ćwiczenie 4 - dane z tablicy, select",
    fields: [
        { name: "title" },
        { name: "author" },
        { name: "lang" }
    ],
    books: [
        { title: "Lalka", author: "B Prus", lang: "PL" },
        { title: "Hamlet", author: "W Szekspir", lang: "ENG" },
        { title: "Pan Wołodyjowski", author: "H Sienkiewicz", lang: "PL" },
        { title: "Zamek", author: "F Kafka", lang: "CZ" }
    ]
}

app.get("/", function (req, res) {
    res.render('index04.hbs', context);
})

app.get("/handle04", function (req, res) {
    const fields = req.query.fields;
    let rows = []
    let text = "";
    switch (fields) {
        case "title": {
            context.books.forEach((book) => {
                rows.push({ content: book.title })
            })
            break
        }
        case "author": {
            context.books.forEach((author) => {
                rows.push({ content: author.author })
            })
            break
        }
        case "lang": {
            context.books.forEach((lang) => {
                rows.push({ content: lang.lang })
            })
            break
        }
        default: {
            rows.push({ content: "Nie wybrano opcji" })
        }
    }

    console.log(rows)

    res.render('index04-handle.hbs', {
        subject: context.subject,
        rows,
    })
})

app.listen("3000", () => {
    console.clear();
    console.log("Server started on: http://localhost:3000");
});