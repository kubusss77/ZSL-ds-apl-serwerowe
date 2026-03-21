const { db } = require('../server');
const { renderLogin } = require('../renderers');
const bcrypt = require('bcrypt');

function loginController(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    renderLogin(res, 'Username and password are required', 'error');
    return;
  }

  db.findOne({ login: username }, (error, user) => {
    if (error) {
      renderLogin(res, 'Database error: ' + error.message, 'error');
      return;
    }
    if (!user) {
      renderLogin(res, 'Incorrect login or password', 'error');
      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      renderLogin(res, 'Incorrect login or password', 'error');
      return;
    }

    req.session.userId = user._id;
    req.session.username = user.login;
    res.redirect('/');
  });
}

function loginPageController(req, res) {
  if (req.query.error === 'not_authenticated') {
    renderLogin(res, 'Session expired', 'error');
    return;
  }
  renderLogin(res);
}

module.exports = {
  loginController,
  loginPageController,
};
