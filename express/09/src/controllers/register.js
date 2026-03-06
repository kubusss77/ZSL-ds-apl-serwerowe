const { db, FILES_DIR } = require('../server');
const { renderRegister } = require('../renderers');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

function registerController(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    renderRegister(res, 'Username and password are required', 'error');
    return;
  }

  if (username.includes('..')) {
    renderRegister(res, 'Forbidden characters in username and/or password', 'error');
    return;
  }

  db.findOne({ login: username }, (error, user) => {
    if (error) {
      renderRegister(res, 'Database error: ' + error.message, 'error');
      return;
    }
    if (user) {
      renderRegister(res, 'User already exists', 'error');
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 12);
    db.insert({ login: username, password: hashedPassword }, (error) => {
      if (error) {
        renderRegister(res, 'Error adding user: ' + error.message, 'error');
        return;
      }

      const userDir = path.join(FILES_DIR, username);
      fs.mkdirSync(userDir);

      renderRegister(res, 'User registered successfully', 'success');
    });
  });
}

function registerPageController(req, res) {
  renderRegister(res);
}

module.exports = {
  registerController,
  registerPageController,
};
