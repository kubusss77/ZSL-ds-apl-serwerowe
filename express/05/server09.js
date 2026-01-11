const express = require("express");
const path = require("path");
const { create } = require('express-handlebars');
const data = require('./data/data09.json')

const app = express();

app.use(express.static('static'));

app.use(express.urlencoded({
    extended: true
}));

const hbs = create({
    defaultLayout: 'main.hbs', // Domyślny layout: views/layouts/main.hbs
    extname: '.hbs', // rozszerzenie plików szablonów
    helpers: {
        znakow10: function (title) {
            return title.substring(0, 10) + "...";
        },
        duzeLitery: function (title) {
            let ret = '';
            title.split(' ').forEach((word) => {
                ret += (word.charAt(0).toUpperCase() + word.substring(1, word.length) + ' ')
            })
            return ret;
        },
        myslniki: function (title) {
            let ret = ''
            title.split('').forEach((char) => {
                ret += (char + '-')
            })
            ret = ret.substring(0, ret.length - 1)
            return ret;
        }

    }
});

app.engine('.hbs', hbs.engine); // określenie silnika szablonów
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views')); // ustalamy katalog views

const context = data;

app.get("/", function (req, res) {
    console.log(context)
    res.render('index09.hbs', context);
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