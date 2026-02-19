const express = require('express');
const { create } = require('express-handlebars');
const fs = require('fs');
const path = require('path');
const { hbHelpers } = require('./hbHelpers');
const { renderError } = require('./renderers');

const ROOT_DIR = path.join(__dirname, '..');
const FILES_DIR = path.join(ROOT_DIR, 'files');

if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR);
}

module.exports = {
  FILES_DIR,
};

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
  helpers: hbHelpers,
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(ROOT_DIR, 'views'));

const { browserController } = require('./controllers/browser');
const { uploadController } = require('./controllers/api/upload');
const { newFolderController, newFileController } = require('./controllers/api/new');
const { renameFolderController } = require('./controllers/api/rename');
const { editorGetContentController, editorSaveContentController } = require('./controllers/editor');
const { imageEditorController } = require('./controllers/imageEditor');
const { deleteFolderController, deleteFileController } = require('./controllers/api/delete');
const { downloadFolderController, downloadFileController } = require('./controllers/api/download');
const { rawFileController } = require('./controllers/api/rawFile');

app.get('/', browserController);

app.post('/upload', uploadController);

/**
 * API
 */
app.post('/new/folder', newFolderController);
app.post('/new/file', newFileController);

app.post('/rename/folder', renameFolderController);

app.get('/editor', editorGetContentController);
app.post('/editor', editorSaveContentController);

app.get('/editor/image', imageEditorController);

app.get('/delete/folder', deleteFolderController);
app.get('/delete/file', deleteFileController);

app.get('/download/folder', downloadFolderController);
app.get('/download/file', downloadFileController);

app.get('/raw', rawFileController);

app.use((req, res) => {
  renderError(res, 'Endpoint not found');
});

/**
 * Server start
 */

console.clear();
app.listen(PORT, function () {
  console.log('start serwera na porcie ' + PORT);
});
