const express = require("express")
const { create } = require('express-handlebars');
const path = require("path")
const Datastore = require('@seald-io/nedb')

const app = express()
const PORT = 3000;

app.use(express.static('static'))
app.use(express.urlencoded({
 extended: true
}));

const carsDB = new Datastore({
    filename: 'cars.db',
    autoload: true
});


const hbs = create({
    defaultLayout: 'main.hbs', // Domyślny layout: views/layouts/main.hbs
    extname: '.hbs' // rozszerzenie plików szablonów
});

app.engine('.hbs', hbs.engine); // określenie silnika szablonów
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views')); // ustalamy katalog views

app.get("/", function(req, res) {
    res.render('index.hbs')
})

app.get("/add", function(erq, res) {
    res.render('add.hbs')
})

app.post("/add", function(req, res) {
    const { ubez, benz, uszk, naped } = req.body

    const models = ['clio', 'focus', 'stelvio', 'corsa']
    const randomIndex = Math.floor(Math.random() * 4);

    const newCar = {
        model: models[randomIndex],
        ubez: ubez ? 'TAK' : 'NIE',
        benz: benz ? 'TAK' : 'NIE',
        uszk: uszk ? 'TAK' : 'NIE',
        naped: naped ? 'TAK' : 'NIE',
    }

    carsDB.insert(newCar, function(err, newDoc) {
        if (err) {
            res.render('add.hbs', { text: 'Error'})
        } else {
            const context = {
                text: 'Car added: ' + newDoc.model + ' (id: ' + newDoc._id + ')'
            }
            res.render('add.hbs', context)
        }
    })
})

app.get("/list", function(req, res) {
    carsDB.find({}, function(err, doc) {
        res.render('list.hbs', { doc })
    })
})

app.get("/search", function(req, res) {
    carsDB.find({}, function(err, doc) {
        res.render('search.hbs', { doc })
    })
})

console.clear()
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT )
})