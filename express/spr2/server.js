const express = require('express');
const { create } = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const FILES_DIR = path.join(__dirname, 'files');

const app = express();
const PORT = 3000;

app.use(express.static('static'));
app.use(
  express.urlencoded({
    extended: true,
  })
);

const hbs = create({
  defaultLayout: 'main.hbs',
  extname: '.hbs',
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/index01', function (req, res) {
  res.render('index01.hbs');
});

app.post('/index01', function (req, res) {
  fs.appendFileSync(path.join(__dirname, 'txt', 'notes.txt'), '\n' + req.body.text);
  res.render('index01.hbs', {
    success: true,
  });
});

app.get('/index02', function (req, res) {
  const fileContent = fs.readFileSync(path.join(__dirname, 'txt', 'notes.txt'));

  const lines = fileContent.toString().split('\n');
  const sortedLines = Array.from(lines);
  sortedLines.sort((a, b) => {
    if (a.length > b.length) return -1;
  });
  console.log(lines);

  const parsedLines = lines.map((line) => {
    const isPriority = line.length >= sortedLines[0].length;
    return {
      text: line,
      priority: isPriority ? 'HIGH' : 'NORNAL',
      color: isPriority ? 'orange' : 'green',
    };
  });

  res.render('index02.hbs', { parsedLines });
});

const circlesData = require('./circles.json');

app.get('/index03', function (req, res) {
  res.render('index03.hbs');
});

app.post('/index03', function (req, res) {
  const parsed = JSON.stringify(circlesData, null, 5);

  res.render('index03.hbs', { circlesData: parsed });
});

app.get('/index03/json', function (req, res) {
  res.json(circlesData);
});

app.get('/index04', function (req, res) {
  res.render('index04.hbs');
});

app.use(express.json());

app.post('/index04', function (req, res) {
  console.log(req.body);
  res.send(200);
});

app.listen(PORT, function () {
  console.log('start serwera na porcie ' + PORT);
});
