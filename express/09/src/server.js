const Datastore = require('@seald-io/nedb');
const express = require('express');
const { create } = require('express-handlebars');
const fs = require('fs');
const path = require('path');
const { hbHelpers } = require('./hbHelpers');
const { renderError } = require('./renderers');
const session = require('express-session');
require('dotenv').config();

const ROOT_DIR = path.join(__dirname, '..');
const FILES_DIR = path.join(ROOT_DIR, 'files');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');

if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR);
}

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const db = new Datastore({
  filename: 'users.db',
  autoload: true,
});

module.exports = {
  FILES_DIR,
  UPLOADS_DIR,
  db,
};

const app = express();
const PORT = 3000;

app.use(express.static('static'));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 30 }, // 30 minut
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

const { isAuthenticated } = require('./authMiddleware');

const { registerController, registerPageController } = require('./controllers/register');
const { loginController, loginPageController } = require('./controllers/login');
const { browserController } = require('./controllers/browser');
const { uploadController } = require('./controllers/api/upload');
const { newFolderController, newFileController } = require('./controllers/api/new');
const { renameFolderController, renameFileController } = require('./controllers/api/rename');
const { textEditorGetContentController, textEditorSaveContentController } = require('./controllers/textEditor');
const { getConfigController, updateConfigController } = require('./controllers/api/config');
const { imageEditorController, imageEditorSaveImageController } = require('./controllers/imageEditor');
const { deleteFolderController, deleteFileController } = require('./controllers/api/delete');
const { downloadFolderController, downloadFileController } = require('./controllers/api/download');
const { rawFileController } = require('./controllers/api/file');
const { logoutController } = require('./controllers/api/logout');

app.get('/register', registerPageController);
app.post('/register', registerController);

app.get('/login', loginPageController);
app.post('/login', loginController);

app.use(isAuthenticated)

app.get('/', browserController);

app.post('/upload', uploadController);

app.post('/new/folder', newFolderController);
app.post('/new/file', newFileController);

app.post('/rename/folder', renameFolderController);
app.post('/rename/file', renameFileController);

app.get('/editor/text',  textEditorGetContentController);
app.post('/editor/text', textEditorSaveContentController);

app.get('/config', getConfigController);
app.post('/config', updateConfigController);

app.get('/editor/image', imageEditorController);
app.post('/editor/image', imageEditorSaveImageController);

app.get('/delete/folder', deleteFolderController);
app.get('/delete/file', deleteFileController);

app.get('/download/folder', downloadFolderController);
app.get('/download/file', downloadFileController);

app.get('/file/raw', rawFileController);

app.get('/logout', logoutController);

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
