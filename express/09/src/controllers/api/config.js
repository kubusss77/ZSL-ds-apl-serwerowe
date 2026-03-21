const { db } = require('../../server');
const { renderError } = require('../../renderers');

function getConfigController(req, res) {
  db.findOne({ login: req.session.username }, (error, doc) => {
    if (error) {
      renderError(res, 'Database error');
      return;
    }

    res.json(doc.config);
  });
}

function updateConfigController(req, res) {
  const fontSize = req.body.fontSize;
  const backgroundColor = req.body.backgroundColor;

  db.findOne({ login: req.session.username }, (error, doc) => {
    if (error) {
      renderError(res, 'Error finding user config');
      return;
    }

    const configJson = doc.config || {};

    if (fontSize) {
      configJson.fontSize = fontSize;
    }

    if (backgroundColor) {
      configJson.backgroundColor = backgroundColor;
    }

    db.update({ login: req.session.username }, { $set: { config: configJson } }, {}, (error) => {
      if (error) {
        renderError(res, 'Error updating user config');
        return;
      }
      res.json(configJson);
    });
  });
}

module.exports = {
  getConfigController,
  updateConfigController,
};
