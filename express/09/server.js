const express = require('express');
const { create } = require('express-handlebars');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname + '\\files';

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
  partialsDir: 'views/partials',
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
  try {
    if (req.query.path === '' || req.query.path === '/') {
      res.redirect('/');
      return;
    }

    const relPath = req.query.path || '';
    const relPathArray = relPath.split('/');
    const absPath = ROOT_DIR + relPath;

    const objects = fs.readdirSync(absPath);

    const files = [];
    const folders = [];

    objects.forEach((name) => {
      const childPath = absPath + '/' + name;
      const isDir = fs.lstatSync(childPath).isDirectory();
      if (isDir) {
        folders.push({ name });
      } else {
        files.push({ name });
      }
    });

    const hrefPath = relPathArray.join('%2F') + '%2F';
    const hrefParentPath = relPathArray.slice(0, -1).join('%2F');

    const errorsText = {
      file_exists: 'This file already exists',
      folder_exists: 'This folder already exists',
    };

    res.render('filemanager.hbs', {
      path: req.query.path,
      hrefPath,
      hrefParentPath,
      folders,
      files,
      error: errorsText[req.query.error],
    });
  } catch (error) {
    renderError(res, 'Error reading files', error.message);
  }
});

function renderError(res, message, details) {
  res.render('error.hbs', {
    error: {
      message,
      details,
    },
  });
}

/**
 * Files/folders actions
 */
app.post('/new/folder', function (req, res) {
  try {
    const path = req.body.path || '';
    const name = req.body.name;

    if (name === '') {
      res.redirect('/?path=' + encodeURIComponent(path || '/') + '&error=name_required');
      return;
    }

    const absPath = ROOT_DIR + path + '/' + name;

    if (fs.existsSync(absPath)) {
      res.redirect('/?path=' + encodeURIComponent(path || '/') + '&error=folder_exists');
      return;
    }

    fs.mkdirSync(ROOT_DIR + path + '/' + name);
    res.redirect('/?path=' + encodeURIComponent(path));
  } catch (error) {
    renderError(res, 'Error adding folder', error.message);
  }
});

app.post('/new/folder', function (req, res) {
  try {
    const path = req.body.path || '';
    const name = req.body.name;

    if (name === '') {
      renderError(res, 'No folder name');
    }

    fs.new(ROOT_DIR + path + '/' + name);
    res.redirect('/?path=' + encodeURIComponent(path));
  } catch (error) {
    renderError(res, 'Error adding folder', error.message);
  }
});

console.clear();
app.listen(PORT, function () {
  console.log('start serwera na porcie ' + PORT);
});
